import db from '../models';
import { Op } from 'sequelize';
import { v4 as generateId } from 'uuid';
require('dotenv').config();

//CRUD = CREATE - READ - UPDATE - DELETE

//READ
export const getBooks = ({ page, limit, order, name, available, ...query }) =>
  new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: true, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_BOOK; //nếu truyền vào limit thì lấy, còn nếu không thì lấy limit trong file .env
      queries.offset = offset * fLimit;
      queries.limit = fLimit;
      if (order) queries.order = [order];
      if (name) query.title = { [Op.substring]: name }; //op là viết tắt của operator
      if (available) query.available = { [Op.between]: available };
      const response = await db.Book.findAndCountAll({
        where: query,
        ...queries, //sử dụng destructuring rải các thuộc tính của queries ra
        attributes: {
          exclude: ['category_code'],
        },
        order: [['createdAt', 'DESC']],

        include: [
          {
            model: db.Category,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            as: 'categoryData',
          },
        ],
      });
      resolve({
        error: response ? 0 : 2,
        message: response ? 'Got' : 'Cannot found',
        bookData: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getBookById = (bookID) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Book.findOne({
        where: { id: bookID },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'categoryId', 'filename'],
        },
        include: [{ model: db.Category, as: 'categoryData', attributes: ['id', 'code', 'value'] }],
      });

      resolve({
        error: response ? 0 : 2,
        message: response ? 'Got' : 'Book not found',
        bookData: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const createNewBook = (body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Book.findOrCreate({
        where: { title: body?.title },

        defaults: {
          ...body,
          id: generateId(),
          image: fileData.path,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      if (response[1]) {
        await db.Book.update(
          { createdAt: new Date() }, // Cập nhật createdAt để đảm bảo luôn mới nhất
          { where: { id: response[0].id } }
        );
      }

      resolve({
        error: response[1] ? 0 : 2, //true: 0 false: 1
        message: response[1] ? 'Created' : 'Cannot create new book',
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateBook = ({ bid, ...body }, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      const existingBook = await db.Book.findOne({ where: { id: bid } });

      const isSameData =
        existingBook.title === body.title &&
        existingBook.price === Number(body.price) &&
        existingBook.description === body.description &&
        existingBook.category_code === body.category_code &&
        existingBook.available === Number(body.available) &&
        !fileData;

      if (isSameData) {
        return resolve({ error: 1, message: 'Không có gì thay đổi' });
      }
      if (fileData) body.image = fileData.path;
      const response = await db.Book.update(body, {
        where: { id: bid },
      });
      resolve({
        error: response[0] > 0 ? 0 : 2, //true: 0 false: 1
        message: response[0] ? `${response[0]} updated` : 'Cannot update',
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteBook = (bid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Book.destroy({
        where: { id: bid },
      });
      resolve({
        error: response > 0 ? 0 : 2, //true: 0 false: 1
        message: `${response} book(s) deleted`,
      });
    } catch (error) {
      reject(error);
    }
  });
