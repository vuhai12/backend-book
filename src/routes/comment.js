import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verfy_token';
const router = express.Router();

router.use(verifyToken);

router.post('/', controllers.createComment);
router.get('/:idBook', controllers.getComments);
router.delete('/:idComment', controllers.deleteComment);
module.exports = router;
