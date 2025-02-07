import * as services from '../services';
import { internalServerError, badRequest } from '../middlewares/handle_errors';
import { email, password, avatar, name, role_code } from '../helpers/joi_schemas';
import Joi from 'joi';

export const getCurrent = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.getCurrent(id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const response = await services.getAllUsers(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const createNewUser = async (req, res) => {
  try {
    const fileData = req.file;
    const { error } = Joi.object({ avatar, name, email, role_code, password }).validate({ ...req.body, avatar: fileData?.path });
    if (error) {
      // if(fileData) cloudinary.uploader.destroy(fileData.filename)
      return badRequest(error.details[0].message, res);
    }
    const response = await services.createNewUser(req.body, fileData);
    return res.status(200).json(response);
    // return res.status(200).json('ok')
  } catch (error) {
    return internalServerError(res);
  }
};

export const updateUser = async (req, res) => {
  try {
    const fileData = req.file;
    const { id } = req.user;
    // const { error } = Joi.object({ bid }).validate({ bid: req.body.bid })

    // if (error) {
    //     // if (fileData) cloudinary.uploader.destroy(fileData.filename)
    //     return badRequest(error.details[0].message, res)
    // }
    const response = await services.updateUser(req.body, fileData, id);
    // const response = await services.updateUser(req.body)

    return res.status(200).json(response);
    // return res.status(200).json('ok')
  } catch (error) {
    return internalServerError(res);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.user;
    // if (error) {
    //   return badRequest(error.details[0].message, res);
    // }
    const response = await services.deleteUser(id);
    return res.status(200).json(response);
    // return res.status(200).json('ok')
  } catch (error) {
    return internalServerError(res);
  }
};
