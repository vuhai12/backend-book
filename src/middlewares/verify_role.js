import { notAuthorized } from './handle_errors';

export const isAdmin = (req, res, next) => {
  const { role_code } = req.user;
  if (role_code !== 'R1') return notAuthorized('Require role Admin', res);
  next();
};

export const isUser = (req, res, next) => {
  const { role_code } = req.user;
  console.log('role_code', role_code);
  if (role_code !== 'R2') return notAuthorized('Require role User', res);
  console.log('next');
  next();
};

export const isCreatorOrAdmin = (req, res, next) => {
  const { role_code } = req.user;
  if (role_code !== 'R1' && role_code !== 'R2') return notAuthorized('Require role Admin or Creator', res);
  next();
};
