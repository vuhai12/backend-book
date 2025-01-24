import { response } from 'express';
import db from '../models';
import { Op } from 'sequelize';
import { v4 as generateId } from 'uuid';

export const createOrder = (body, id) =>
  new Promise(async (resolve, reject) => {
    try {
      const { count, rows } = await db.CartBook.findAndCountAll({
        where: {
          isChecked: true,
        },
      });

      if (count > 0) {
        const response = await db.Order.create({
          id: generateId(),
          totalPrices: body.totalPriceCheckedInCart,
          paymentMethod: body.methodPayment,
          status: 'Active',
          isDelivered: false,
          isPaid: false,
          orderUserId: id,
        });

        if (response && response.id) {
          const data = body.listBookInCartChecked.map((item) => {
            return {
              id: generateId(),
              orderBookId: response.id,
              bookOrderId: item.books.id,
            };
          });
          const listBookInCartChecked = data.map((item) => {
            return item.bookOrderId;
          });
          const res = await db.OrderBook.bulkCreate(data);
          if (res) {
            const response = await db.CartBook.destroy({
              where: {
                bookCartId: {
                  [Op.in]: listBookInCartChecked,
                },
              },
            });
          }
        }
      }
      resolve({
        error: response ? 0 : 1, //true: 0 false: 1
        message: response ? 'Created' : 'Cannot create order',
      });
    } catch (error) {
      reject(error);
    }
  });

export const getOrders = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Order.findAll({
        raw: true,
        nest: true,
        include: [
          {
            model: db.Book,
            as: 'books',
            required: true,
            // attributes: ['id', 'name'],
            through: {
              model: db.OrderBook,
              as: 'orders',
              // attributes: ['qty'],
            },
          },
        ],
      });

      resolve({
        error: response ? 0 : 1,
        message: response ? 'Got' : 'Cannot found',
        orderData: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getOrderById = (orderUserId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Order.findAll({
        where: {
          orderUserId,
        },
        include: [
          {
            model: db.Book,
            as: 'books',
            attributes: ['id', 'title', 'price', 'quantity', 'image', 'description', 'category_code', 'createdAt', 'updatedAt'], // Lấy thuộc tính cần thiết
            through: {
              model: db.OrderBook,
              as: 'orders',
              attributes: [], // Không cần lấy thuộc tính từ bảng trung gian
            },
          },
        ],
      });

      const orders = response.map((order) => ({
        id: order.id,
        totalPrices: order.totalPrices,
        paymentMethod: order.paymentMethod,
        orderUserId: order.orderUserId,
        status: order.status,
        isDelivered: order.isDelivered,
        isPaid: order.isPaid,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        books: order.books.map((book) => ({
          id: book.id,
          title: book.title,
          price: book.price,
          quantity: book.quantity,
          image: book.image,
          description: book.description,
          category_code: book.category_code,
          createdAt: book.createdAt,
          updatedAt: book.updatedAt,
        })),
      }));

      resolve({
        error: orders ? 0 : 1,
        message: orders ? 'Got' : 'Cannot found',
        orderData: orders,
      });
    } catch (error) {
      reject(error);
    }
  });
