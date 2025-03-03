import db from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as generateId } from 'uuid';
import { sendResetPasswordEmail } from '../config/email';

//hàm băm mật khẩu giúp tăng tính bảo mật
const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

export const register = ({ email, password, name }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOrCreate({
        where: { email },
        defaults: {
          id: generateId(),
          email,
          name,
          password: hashPassword(password),
        },
        include: [{ model: db.Role, as: 'roleData', attributes: ['id', 'code', 'value'] }],
      });

      resolve({
        error: response[1] ? 0 : 1,
        message: response[1] ? 'Register successfully' : 'Email is already registered',
      });
    } catch (error) {
      reject(error);
    }
  });

export const login = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { email },
        // attributes: {
        //     exclude: ['role_code']
        // },
        raw: true,
        include: [{ model: db.Role, attributes: ['id', 'code', 'value'], as: 'roleData' }],
      });

      const isChecked = response && bcrypt.compareSync(password, response.password);

      const accessToken = isChecked
        ? jwt.sign(
            {
              id: response.id,
              email: response.email,
              role_code: response?.role_code,
            },
            process.env.JWT_SECRET,
            { expiresIn: '500s' }
          )
        : null;
      //JWT_SECRET_REFRESH_TOKEN

      const refreshToken = isChecked
        ? jwt.sign(
            {
              id: response.id,
            },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: '2d' }
          )
        : null;

      resolve({
        //kiểm tra dựa trên token
        error: accessToken ? 0 : 1,
        message: accessToken ? 'Login successfully' : response ? 'Password is wrong' : 'Email is not signed up',
        access_token: accessToken ? `Bearer ${accessToken}` : accessToken,
        refresh_token: refreshToken,
        role_code: response?.role_code,
      });
      if (refreshToken) {
        await db.User.update(
          {
            refresh_token: refreshToken,
          },
          {
            where: { id: response.id },
          }
        );
      }
    } catch (error) {
      reject(error);
    }
  });
export const logout = (user) =>
  new Promise(async (resolve, reject) => {
    try {
      const { id } = user;
      const response = await db.User.update(
        { refresh_token: null },
        {
          where: { id },
          raw: true,
        }
      );
      resolve({
        error: response ? 0 : 1,
        message: response ? 'Logout success' : 'Logout failed',
      });
    } catch (error) {
      reject(error);
    }
  });

export const refreshToken = (refresh_token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { refresh_token },
      });
      if (response) {
        jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH_TOKEN, (err) => {
          if (err)
            resolve({
              error: 1,
              message: 'Refresh token expired. Require login again',
            });
          else {
            const accessToken = jwt.sign(
              {
                id: response.id,
                email: response.email,
                role_code: response.role_code,
              },
              process.env.JWT_SECRET,
              // { expiresIn: "2d" }
              // { expiresIn: "30s" }
              { expiresIn: '500s' }
            );
            resolve({
              error: accessToken ? 0 : 1,
              message: accessToken ? 'ok' : 'Fail to generate new access token.',
              access_token: accessToken ? `Bearer ${accessToken}` : accessToken,
              refresh_token: refresh_token,
            });
          }
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const requestPasswordReset = ({ email }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        resolve({
          error: 1,
          message: 'Email không tồn tại',
        });
      }
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '30s' });

      await db.PasswordReset.create({
        id: generateId(),
        email,
        token,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Hết hạn sau 15 phút
      });

      const response = await sendResetPasswordEmail(email, token);
      resolve({
        error: response ? 0 : 1,
        message: response ? 'Email đặt lại mật khẩu đã được gửi' : 'Email đặt lại mật khẩu chưa được gửi',
      });
    } catch (error) {
      reject(error);
    }
  });

export const resetPassword = ({ token, newPassword }) =>
  new Promise(async (resolve, reject) => {
    try {
      // 🕵️‍♂️ Kiểm tra token hợp lệ
      console.log('token', token);
      console.log('newPassword', newPassword);
      const resetEntry = await db.PasswordReset.findOne({ where: { token } });
      if (!resetEntry) {
        resolve({
          error: 1,
          message: 'Token không hợp lệ',
        });
      }
      console.log('resetEntry', resetEntry);
      if (new Date() > resetEntry.expiresAt) {
        resolve({
          error: 1,
          message: 'Token đã hết hạn',
        });
      }
      // 🆕 Hash mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const response = await db.User.update({ password: hashedPassword }, { where: { email: resetEntry.email } });

      await db.PasswordReset.destroy({ where: { email: resetEntry.email } });

      resolve({
        error: response ? 0 : 1,
        message: response ? 'Mật khẩu đã được đặt lại' : 'Mật khẩu chưa được đặt lại',
      });
    } catch (error) {
      reject(error);
    }
  });
