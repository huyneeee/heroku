
import express from 'express';
import { requireSignin } from '../controller/auth';
import { commentByProduct, Create, List, Read } from '../controller/comment';
import { userById } from '../controller/user';

const router = express.Router();

router.post('/comment/:userId', requireSignin, Create);
router.get('/comment/:commentByProduct', Read);
router.param('commentByProduct', commentByProduct);
router.get('/comment', List);
router.param('userId', userById)
module.exports = router;