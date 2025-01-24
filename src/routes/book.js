import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verfy_token';
import uploadCloud from '../middlewares/uploader';
const router = express.Router();

//public routes

router.get('/:id', controllers.getBookById);
router.get('/', controllers.getBooks);
router.use(verifyToken);

router.post('/', uploadCloud.single('image'), controllers.createNewBook);

router.put('/', uploadCloud.single('image'), controllers.updateBook);

router.delete('/', controllers.deleteBook);
module.exports = router;
