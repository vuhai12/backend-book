import * as services from '../services';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const createPayment = async (req, res) => {
  try {
    const { amount, bankCode } = req.body;

    const response = await services.createPayment({ amount, bankCode, req });
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const paymentReturn = async (req, res) => {
  try {
    const query = req.query;
    const response = await services.paymentReturn({ query });
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
