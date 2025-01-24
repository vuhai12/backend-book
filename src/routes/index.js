import user from './user';
import auth from './auth';
import insert from './insert';
import book from './book';
import category from './category';
import cart from './cart';
import order from './order';
import profileUser from './profile-user';
import { notFound } from '../middlewares/handle_errors';

const initRoutes = (app) => {
  app.use('/api/v1/user', user);
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/insert', insert);
  app.use('/api/v1/book', book);
  app.use('/api/v1/category', category);
  app.use('/api/v1/cart', cart);
  app.use('/api/v1/order', order);
  app.use('/api/v1/profile-user', profileUser);

  app.use(notFound);
};

module.exports = initRoutes;
