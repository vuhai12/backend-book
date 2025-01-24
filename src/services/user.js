import db from '../models';
import { Op } from 'sequelize';
import { v4 as generateId } from 'uuid';
import bcrypt from 'bcryptjs';
require('dotenv').config();

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

export const getCurrent = (userID) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { id: userID },
        attributes: {
          exclude: ['password', 'role_code', 'refresh_token'],
        },
        include: [{ model: db.Role, as: 'roleData', attributes: ['id', 'code', 'value'] }],
      });
      resolve({
        error: response ? 0 : 1,
        message: response ? 'Got' : 'User not found',
        userData: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllUsers = ({ page, limit, order, name, ...query }) =>
  new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: true, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_USER; //nếu truyền vào limit thì lấy, còn nếu không thì lấy limit trong file .env
      queries.offset = offset * fLimit;
      queries.limit = fLimit;
      if (order) queries.order = [order];
      if (name) query.name = { [Op.substring]: name }; //op là viết tắt của operator

      const response = await db.User.findAndCountAll({
        where: query,
        ...queries, //sử dụng destructuring rải các thuộc tính của queries ra
        include: [{ model: db.Role, as: 'roleData', attributes: ['id', 'code', 'value'] }],
      });

      resolve({
        error: response ? 0 : 1,
        message: response ? 'Got' : 'Cannot found',
        userData: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const createNewUser = (body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOrCreate({
        where: { email: body?.email },

        defaults: {
          ...body,
          id: generateId(),
          password: hashPassword(body?.password),
          avatar: `http://localhost:${process.env.PORT}/${fileData?.filename}`,
        },
      });

      resolve({
        error: response[1] ? 0 : 1, //true: 0 false: 1
        message: response[1] ? 'Created' : 'Cannot create new user',
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateUser = (body, fileData, id) =>
  new Promise(async (resolve, reject) => {
    try {
      if (fileData) body.avatar = `http://localhost:${process.env.PORT}/${fileData?.filename}`;
      if (body.password) body.password = hashPassword(body?.password);
      const response = await db.User.update(body, {
        where: { id },
      });

      resolve({
        error: response[0] > 0 ? 0 : 1, //true: 0 false: 1
        message: response[0] ? `${response[0]} updated` : 'Cannot update',
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteUser = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.destroy({
        where: { id },
      });
      resolve({
        error: response > 0 ? 0 : 1, //true: 0 false: 1
        message: `${response} User(s) deleted`,
      });
    } catch (error) {
      reject(error);
    }
  });
