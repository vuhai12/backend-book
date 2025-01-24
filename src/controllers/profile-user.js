import * as services from '../services';
import { internalServerError } from '../middlewares/handle_errors';

//Get one
export const getProfileUserById = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.getProfileUserById(id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
