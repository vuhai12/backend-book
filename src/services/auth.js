import db from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as generateId } from 'uuid';

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
