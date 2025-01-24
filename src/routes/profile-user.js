import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verfy_token';

const router = express.Router();

router.use(verifyToken);

router.get('/', controllers.getProfileUserById);

module.exports = router;
