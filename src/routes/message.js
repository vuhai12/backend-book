import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verfy_token';
const router = express.Router();

router.use(verifyToken);

router.post('/user-to-admin', controllers.sendMessageToAmin);
router.get('/conversations/user-chat-admin', controllers.getListConversationsUserChatWithAdmin);
router.get('/users/chatted-with-admin', controllers.getListUsersChattedWithAdmin);
// router.get('/conversations/admin-chat-with-user', controllers.getListConversationsAdminChatWithUsers);

// router.delete('/:idComment', controllers.deleteLike);
module.exports = router;
