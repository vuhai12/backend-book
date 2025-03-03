import * as services from '../services';
import { internalServerError } from '../middlewares/handle_errors';
import { onlineUsers } from '../ultils/onlineUsers';

export const sendMessageToAmin = async (req, res) => {
  try {
    const { id } = req.user;
    const { message, userId } = req.body;

    if (userId) {
      const response = await services.sendMessageToAmin('1', userId, message);
      return res.status(200).json(response);
    } else {
      const response = await services.sendMessageToAmin(id, '1', message);
      return res.status(200).json(response);
    }
  } catch (error) {
    return internalServerError(res);
  }
};

export const getListConversationsUserChatWithAdmin = async (req, res) => {
  try {
    const { id } = req.user;
    const { userId } = req.query;

    const idUserSender = userId ? userId : id;
    const response = await services.getListConversationsUserChatWithAdmin(idUserSender);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const getListUsersChattedWithAdmin = async (req, res) => {
  try {
    const response = await services.getListUsersChattedWithAdmin();
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
