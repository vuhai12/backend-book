import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verfy_token';
import { isUser } from '../middlewares/verify_role';

const router = express.Router();

router.use(verifyToken);
router.use(isUser);

router.post('/', controllers.addCart);
router.get('/', controllers.getCartById);
router.get('/checked', controllers.getBookInCartChecked);
router.delete('/', controllers.deleteBookInCart);
router.put('/', controllers.updateCheckBookCart);
router.put('/quantity', controllers.updateQuantityBookInCart);
router.put('/checked-all', controllers.updateCheckAllBookCart);
router.delete('/checked-all', controllers.deleteCheckAllBookCart);

module.exports = router;
