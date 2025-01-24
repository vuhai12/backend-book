import { bid, quantity, isChecked, totalPrices, image, cartBookId } from '../helpers/joi_schemas';
import Joi from 'joi';
import * as services from '../services';
import { internalServerError, badRequest } from '../middlewares/handle_errors';

export const addCart = async (req, res) => {
  try {
    const { id } = req.user;
    const { error } = Joi.object({ bid, quantity, totalPrices, image, isChecked }).validate(req.body);
    if (error) {
      return badRequest(error.details[0].message, res);
    }
    const response = await services.addCart(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const getCartById = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.getCartById(id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const getBookInCartChecked = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.getBookInCartChecked(id);

    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const deleteBookInCart = async (req, res) => {
  try {
    //tiền xử lý

    // const { error } = Joi.object({ cartBookId }).validate(req.query)
    // if (error) {
    //     return badRequest(error.details[0].message, res)
    // }
    const response = await services.deleteBookInCart(req.query.bookCartId);
    return res.status(200).json(response);
    // return res.status(200).json('ok')
  } catch (error) {
    return internalServerError(res);
  }
};

export const deleteCheckAllBookCart = async (req, res) => {
  try {
    //tiền xử lý

    // const { error } = Joi.object({ cartBookId }).validate(req.query)
    // if (error) {
    //     return badRequest(error.details[0].message, res)
    // }
    const response = await services.deleteCheckAllBookCart();
    return res.status(200).json(response);
    // return res.status(200).json('ok')
  } catch (error) {
    return internalServerError(res);
  }
};

export const updateCheckAllBookCart = async (req, res) => {
  try {
    // const { error } = Joi.object({ isChecked }).validate({ isChecked: req.body.isChecked })
    // if (error) {
    //     return badRequest(error.details[0].message, res)
    // }
    const response = await services.updateCheckAllBookCart(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const updateCheckBookCart = async (req, res) => {
  try {
    const { error } = Joi.object({ cartBookId }).validate({ cartBookId: req.body.cartBookId });
    if (error) {
      return badRequest(error.details[0].message, res);
    }
    const response = await services.updateCheckBookCart(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const updateQuantityBookInCart = async (req, res) => {
  try {
    // const { error } = Joi.object({ cartBookId }).validate({ cartBookId: req.body.cartBookId })
    // if (error) {
    //     return badRequest(error.details[0].message, res)
    // }
    const response = await services.updateQuantityBookInCart(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
