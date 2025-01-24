import * as services from '../services';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const createOrder = async (req, res) => {
  try {
    const { id } = req.user;
    // const { error } = Joi.object({ paymentMethod,isDelivered,isPaid }).validate({ req.body })
    // if (error) {
    //     return badRequest(error.details[0].message, res)
    // }
    const response = await services.createOrder(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.getOrderById(id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const getOrders = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.getOrders(id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
