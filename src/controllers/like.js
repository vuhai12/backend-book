import * as services from '../services';
import { internalServerError } from '../middlewares/handle_errors';

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.user;
    const { commentId } = req.body;

    const response = await services.toggleLike(id, commentId);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
