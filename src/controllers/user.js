import * as services from '../services';
import { internalServerError, badRequest } from '../middlewares/handle_errors';
import { email, password, name, role_code, address } from '../helpers/joi_schemas';
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

export const updateCurrent = async (req, res) => {
  try {
    const fileData = req.file;
    const { id } = req.user;
    const response = await services.updateCurrent(req.body, fileData, id);
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
    const { error } = Joi.object({ name, email, role_code, password, address }).validate({ ...req.body });
    if (error) {
      return badRequest(error.details[0].message, res);
    }
    const response = await services.createNewUser(req.body, fileData);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const updateUser = async (req, res) => {
  try {
    const fileData = req.file;
    const { id } = req.body;
    const response = await services.updateUser(req.body, fileData, id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await services.deleteUser(id);
    return res.status(200).json(response);
    // return res.status(200).json('ok')
  } catch (error) {
    return internalServerError(res);
  }
};
