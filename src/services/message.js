import db from '../models';
import { v4 as generateId } from 'uuid';
import { Model, Op, where } from 'sequelize';
import { raw } from 'express';
//CRUD = CREATE - READ - UPDATE - DELETE

//CREATE
export const sendMessageToAmin = (senderId, receiverId, message) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Message.create({
        id: generateId(),
        senderId,
        receiverId,
        message,
      });
      resolve({
        error: response ? 0 : 1,
        message: response ? 'Message được tạo' : 'Message chưa được tạo',
      });
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });

//READ

export const getListConversationsUserChatWithAdmin = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Message.findAll({
        where: {
          [Op.or]: [{ senderId: id }, { receiverId: id }],
        },
        raw: true,
        order: [['createdAt', 'DESC']],
      });

      resolve({
        error: response ? 0 : 1,
        message: response ? 'Lấy được Message' : 'Không lấy được Message',
        listConversations: response,
      });
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });

export const getListUsersChattedWithAdmin = () =>
  new Promise(async (resolve, reject) => {
    try {
      const users = await db.Message.findAll({
        where: {
          [Op.or]: [{ senderId: '1' }, { receiverId: '1' }],
        },
        raw: true,
        order: [['createdAt', 'DESC']],
      });

      const userIds = [...new Set(users.flatMap((msg) => [msg.senderId, msg.receiverId]))].filter((id) => id !== 1); // Loại bỏ admin
      const userList = await db.User.findAll({
        where: { id: userIds },
        attributes: ['id', 'name', 'avatar'],
      });

      const userListWithLastMessage = await Promise.all(
        userList.map(async (user) => {
          const lastMessage = await db.Message.findOne({
            where: {
              [Op.or]: [
                { senderId: user.id, receiverId: '1' },
                { senderId: '1', receiverId: user.id },
              ],
            },
            order: [['createdAt', 'DESC']], // Tin nhắn mới nhất
            attributes: ['message', 'createdAt'],
            raw: true,
          });

          return {
            ...user,
            lastMessage: lastMessage ? lastMessage.message : '',
            lastMessageTime: lastMessage ? lastMessage.createdAt : null,
          };
        })
      );

      resolve({
        error: userListWithLastMessage ? 0 : 1,
        message: userListWithLastMessage ? 'Lấy được danh sách user chat' : 'Không lấy được danh sách user chat',
        userListWithLastMessage,
      });
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });

// export const getListConversationsAdminChatWithUsers = (userId) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const response = await db.Message.findAll({
//         where: {
//           [Op.or]: [
//             { senderId: userId, receiverId: '1' },
//             { senderId: '1', receiverId: userId },
//           ],
//         },
//         include: [
//           {
//             model: db.User,
//             as: 'sender',
//             attributes: ['id', 'name', 'avatar'],
//           },
//           {
//             model: db.User,
//             as: 'receiver',
//             attributes: ['id', 'name', 'avatar'],
//           },
//         ],
//       });
//       resolve({
//         error: response ? 0 : 1,
//         message: response ? 'Lấy được danh sách chat với user' : 'Không lấy được danh sách chat với user',
//         listConversationsWithUser: response,
//       });
//     } catch (error) {
//       console.log('error', error);
//       reject(error);
//     }
//   });
