import db from '../models';
import { Op } from 'sequelize';
import { v4 as generateId } from 'uuid';

export const addCart = (body, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      // Tìm giỏ hàng của người dùng
      let cart = await db.Cart.findOne({ where: { cartUserId: userId } });

      // Nếu chưa có giỏ hàng, tạo mới
      if (!cart) {
        cart = await db.Cart.create({
          id: generateId(),
          cartUserId: userId,
        });
      }

      // Kiểm tra sách đã có trong giỏ hàng hay chưa
      const bookInCart = await db.CartBook.findOne({
        where: {
          cartBookId: cart.id,
          bookCartId: body.bid,
        },
      });

      if (bookInCart) {
        // Nếu sách đã có, cập nhật số lượng
        await db.Book.update({ quantity: body.quantity }, { where: { id: body.bid } });
      } else {
        // Nếu sách chưa có, thêm vào giỏ hàng
        await db.CartBook.create({
          id: generateId(),
          cartBookId: cart.id,
          bookCartId: body.bid,
        });

        // Cập nhật số lượng sách
        await db.Book.update({ quantity: body.quantity }, { where: { id: body.bid } });
      }

      resolve({
        error: 0,
        message: 'Book added to cart successfully!',
      });
    } catch (error) {
      console.error('Error in addCart:', error);
      reject({
        error: 1,
        message: 'Failed to add book to cart.',
      });
    }
  });

export const getCartById = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Cart.findAll({
        raw: true,
        nest: true,
        where: {
          cartUserId: id,
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: db.Book,
            as: 'books',
            required: true,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            through: {
              model: db.CartBook,
              attributes: { exclude: ['createdAt', 'updatedAt'] },
              as: 'cartBooks',
              required: true,
            },
          },
        ],
      });
      resolve({
        error: response ? 0 : 1, //true: 0 false: 1
        message: response ? 'Success' : 'Cannot create or update Cart',
        cartData: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getBookInCartChecked = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Cart.findAll({
        where: { cartUserId: id },
        raw: true,
        nest: true,
        attributes: { exclude: ['id', 'cartUserId'] },
        include: [
          {
            model: db.Book,
            as: 'books',
            required: true,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            through: {
              model: db.CartBook,
              where: {
                isChecked: true,
              },
              required: true,
              attributes: { exclude: ['createdAt', 'updatedAt'] },
              as: 'cartBooks',
            },
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      });
      resolve({
        error: response ? 0 : 1, //true: 0 false: 1
        message: response ? 'Success' : 'Cannot get Cart',
        cartData: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteBookInCart = (bookCartId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.CartBook.destroy({
        where: { bookCartId },
      });
      resolve({
        error: response > 0 ? 0 : 1, //true: 0 false: 1
        message: `${response} book in cart(s) deleted`,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateCheckBookCart = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.CartBook.update(
        { isChecked: body.isChecked },
        {
          where: { bookCartId: body.cartBookId },
        }
      );
      resolve({
        error: response[0] > 0 ? 0 : 1, //true: 0 false: 1
        message: response[0] ? `${response[0]} updated` : 'Cannot update',
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateCheckAllBookCart = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.CartBook.update(
        {
          isChecked: body.isChecked,
        },
        {
          where: {
            bookCartId: {
              [Op.in]: body.listCartBookId,
            },
          },
        }
      );
      resolve({
        error: response[0] > 0 ? 0 : 1, //true: 0 false: 1
        message: response[0] ? `${response[0]} updated` : 'Cannot update',
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteCheckAllBookCart = (cartBookIds) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.CartBook.destroy({
        where: {
          isChecked: true,
        },
      });
      // const response = await db.Cart.destroy({
      //   where: {
      //     cartBookId: {
      //       [Op.in]: cartBookIds
      //     },
      //     isChecked: true
      //   },
      // });
      resolve({
        error: response > 0 ? 0 : 1, //true: 0 false: 1
        message: `${response} book in cart(s) deleted`,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateQuantityBookInCart = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Book.update(
        { quantity: body.quantity },
        {
          where: { id: body.bookId },
        }
      );
      resolve({
        error: response[0] > 0 ? 0 : 1, //true: 0 false: 1
        message: response[0] ? `${response[0]} updated` : 'Cannot update',
      });
    } catch (error) {
      reject(error);
    }
  });
