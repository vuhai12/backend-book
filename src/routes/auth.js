import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verfy_token';

const router = express.Router()

router.post('/register', controllers.register)
router.post('/login', controllers.login)
router.post('/refresh-token', controllers.refreshTokenController)
router.post('/logout', verifyToken, controllers.logout)


module.exports = router