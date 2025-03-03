import * as services from '../services';
import { internalServerError } from '../middlewares/handle_errors';

export const createComment = async (req, res) => {
  try {
    const { id } = req.user;
    const { bookId, content, parentId } = req.body;

    const response = await services.createComment(id, bookId, content, parentId);

    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const getComments = async (req, res) => {
  try {
    const { idBook } = req.params;
    const { id } = req.user;
    const { limit, pageCurrent, ...query } = req.query;
    const response = await services.getComments({ idBook, limit, pageCurrent, id, ...query });
    return res.status(200).json(response);
  } catch (error) {
    console.log('error', error);
    return internalServerError(res);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { idComment } = req.params;
    const response = await services.deleteComment(idComment);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
