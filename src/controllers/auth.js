import * as services from '../services';
import { internalServerError, badRequest } from '../middlewares/handle_errors';
import { email, password, refreshToken, name } from '../helpers/joi_schemas';
import Joi from 'joi';

export const register = async (req, res) => {
  try {
    const { error } = Joi.object({ email, password, name }).validate(req.body);
    if (error) return badRequest(error.details[0]?.message, res);
    const response = await services.register(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const login = async (req, res) => {
  try {
    const { error } = Joi.object({ email, password }).validate(req.body);
    if (error) return badRequest(error.details[0]?.message, res);

    const response = await services.login(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const logout = async (req, res) => {
  try {
    // const {} = req.user
    // const { error } = Joi.object({ email, password }).validate(req.body)
    // if (error) return badRequest(error.details[0]?.message, res)
    const response = await services.logout(req.user);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const { error } = Joi.object({ refreshToken }).validate(req.body);
    if (error) return badRequest(error.details[0]?.message, res);
    const response = await services.refreshToken(req.body.refreshToken);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await services.requestPasswordReset({ email });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const response = await services.resetPassword({ token, newPassword });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
