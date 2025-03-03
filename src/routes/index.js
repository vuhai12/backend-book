import user from './user';
import auth from './auth';
import insert from './insert';
import book from './book';
import category from './category';
import cart from './cart';
import order from './order';
import comment from './comment';
import like from './like';
import message from './message';
import payment from './payment';
import { notFound } from '../middlewares/handle_errors';

const initRoutes = (app) => {
  app.use('/api/v1/user', user);
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/insert', insert);
  app.use('/api/v1/book', book);
  app.use('/api/v1/category', category);
  app.use('/api/v1/cart', cart);
  app.use('/api/v1/order', order);
  app.use('/api/v1/comment', comment);
  app.use('/api/v1/like', like);
  app.use('/api/v1/message', message);
  app.use('/api/v1/payment', payment);

  app.use(notFound);
};

module.exports = initRoutes;
