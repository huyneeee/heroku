import express from 'express';
import { List,Create,blogById,Read,Delete,Update,Image } from '../controller/blog';
const router = express.Router();

router.get('/blogs',List);

router.post('/blogs',Create);

router.get('/blog/:blogId',Read);

router.put('/blog/:blogId',Update)

router.delete('/blog/:blogId',Delete);

router.get('/blog/image/:blogId', Image);

router.param('blogId',blogById);

module.exports = router;