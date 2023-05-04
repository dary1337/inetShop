import Router from 'express';

import auth from './auth.js';
import items from './items.js';
import admin from './admin.js';
import cart from './cart.js';
import types from './types.js';
import search from './search.js';


const router = new Router();

router.use('/auth', auth);
router.use('/items', items);
router.use('/admin', admin);
router.use('/cart', cart);
router.use('/types', types);
router.use('/search', search);


export default router;