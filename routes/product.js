import express from 'express';
import { isAdmin, isAuth, requireSignin } from '../controller/auth';
import { countProduct, Create, Delete, Image, List, listBySearch, listRelated, ProductByCateId, ProductById, ProductByPrice, ProductByTextSearch, ProductPagination, Read, Update, getImage, sumProductOfCate } from '../controller/product';
import { userById } from '../controller/user';
const router = express.Router();

router.get('/products', List);

router.post('/products/:userById', requireSignin, isAuth, isAdmin, Create);

router.get('/product/:productId', Read);

router.put('/product/:productId/:userById', requireSignin, isAuth, isAdmin, Update)

router.delete('/product/:productId/:userById', requireSignin, isAuth, isAdmin, Delete);

router.get('/products/category/:cate_id', Read);

router.get('/products/:textSearch', Read);

router.post('/product/pagination', ProductPagination);

router.param('textSearch', ProductByTextSearch);

router.post('/product/price', ProductByPrice);

router.param('cate_id', ProductByCateId);

router.get('/product/image/:productId', Image);

router.post('/image', getImage);

router.get('/countproduct', countProduct);

router.get('/sumProductOfCate', sumProductOfCate);

router.post('/products/search', listBySearch);

router.get('/products/related/:productId', listRelated);

router.param('productId', ProductById);

router.param('userById', userById);

module.exports = router;