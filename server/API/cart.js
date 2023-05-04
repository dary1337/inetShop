import Router from 'express';
import APIerror from '../errorHandle/APIerror.js';
import authMiddleware from '../Middleware/authMiddleware.js';

import db_query from '../db/db-query.js';


const cart = new Router();




cart.post('/add', authMiddleware, async (req, res, next) => {

    let id = req.body.id;

    if (!id)
        return next(APIerror.emptyId());

    let item = await db_query.cart_Check(req.user.id, id);

    if (item)
        return next(APIerror.send('This id (item) is already in the cart'));

    await db_query.cart_Add(req.user.id, id);

    res.json({success:true});
});

cart.post('/remove', authMiddleware, async (req, res, next) => {

    let id = req.body.id;

    if (!id)
        return next(APIerror.emptyId());

    await db_query.cart_Remove(req.user.id, id);

    res.json({success:true});
});

cart.get('/get', authMiddleware, async (req, res) =>
    res.json({cart: (await db_query.cart_Get(req.user.id))})
);

export default cart;