import * as services from '../services';
import { internalServerError } from '../middlewares/handle_errors';

//READ
export const getCategory = async (req, res) => {
  try {
    const response = await services.getCategory();
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
