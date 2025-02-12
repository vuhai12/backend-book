//dinh nghia cac api (crud) lien quan den user
import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verfy_token';
import uploadCloud from '../middlewares/uploader';

const router = express.Router();

router.use(verifyToken);

router.get('/me', controllers.getCurrent);
router.put('/me', uploadCloud.single('avatar'), controllers.updateCurrent);
router.get('/', controllers.getAllUsers);
router.post('/', uploadCloud.single('avatar'), controllers.createNewUser);

router.put('/', uploadCloud.single('avatar'), controllers.updateUser);

router.delete('/:id', controllers.deleteUser);

module.exports = router;
