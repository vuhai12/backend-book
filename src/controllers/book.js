import * as services from '../services';
import { internalServerError, badRequest } from '../middlewares/handle_errors';
import { bid, title, price, available, category_code, image, bids, description } from '../helpers/joi_schemas';
import Joi from 'joi';

//READ
export const getBooks = async (req, res) => {
  try {
    const response = await services.getBooks(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

//Get one
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await services.getBookById(id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

//CREATE book lưu trực tiếp trên db
export const createNewBook = async (req, res) => {
  try {
    const fileData = req.file;
    //tiền xử lý
    const { error } = Joi.object({ title, price, available, category_code, image, description }).validate({ ...req.body, image: fileData?.path });
    if (error) {
      return badRequest(error.details[0].message, res);
    }
    const response = await services.createNewBook(req.body, fileData);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

//UPDATE
export const updateBook = async (req, res) => {
  try {
    const fileData = req.file;
    //tiền xử lý
    const { error } = Joi.object({ bid }).validate({ bid: req.body.bid });
    if (error) {
      return badRequest(error.details[0].message, res);
    }
    const response = await services.updateBook(req.body, fileData);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

//delete khi ảnh lưu trực tiếp trên db

export const deleteBook = async (req, res) => {
  try {
    //tiền xử lý

    const { error } = Joi.object({ bid }).validate({ bid: req.params.bid });
    if (error) {
      return badRequest(error.details[0].message, res);
    }
    const response = await services.deleteBook(req.params.bid);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
