import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verfy_token';
const router = express.Router();

router.use(verifyToken);

router.post('/', controllers.createOrder);
router.get('/id', controllers.getOrderById);

router.get('/', controllers.getOrders);
module.exports = router;
