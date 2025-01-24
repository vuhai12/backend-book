import * as controllers from '../controllers';
import express from 'express';
const router = express.Router();

router.get('/', controllers.getCategory);

module.exports = router;
