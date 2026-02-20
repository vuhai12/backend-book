import * as services from '../services';
import { internalServerError } from '../middlewares/handle_errors';

//READ
export const getCategory = async (req, res) => {
  try {
    console.log('111111111');
    console.log('typeof service:', typeof services.getCategory);
    const response = await services.getCategory();
    console.log('xong');
    return res.status(200).json(response);
  } catch (error) {
    console.log('falllllllll');
    console.log(error);
    return internalServerError(res);
  }
};
