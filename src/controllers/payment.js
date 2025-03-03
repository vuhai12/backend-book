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
    console.log('query', query);
    const response = await services.paymentReturn({ query });
    console.log('response', response);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
