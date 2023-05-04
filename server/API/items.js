import Router from 'express';
import APIerror from '../errorHandle/APIerror.js';

import db_query from '../db/db-query.js';


const items = new Router();



const returnItems = async (params = {}) => {

    let filter = { };

    if (params.category)
        filter.category = params.category;

    if (params.brand)
        filter.brand = params.brand;

    let array = await db_query.items_Get(filter);

    if (params.sortBy) {

        if (params.sortBy == 'Count+')
            array.sort((a, b) => b.count - a.count);
        else if (params.sortBy == 'Count-')
            array.sort((a, b) => a.count - b.count);
        else if (params.sortBy == 'Cost+')
            array.sort((a, b) => b.cost - a.cost);
        else if (params.sortBy == 'Cost-')
            array.sort((a, b) => a.cost - b.cost);
    }

    if (params.limit && array.length > params.limit)
        array.length = params.limit;
    

    return array;
};

items.get('/get/:params', async (req, res, next) => {

    let body = req.params.params;

    if (!body)
        return next(APIerror.notAllData());

    try {

        body = JSON.parse(body);
    
        res.json(await returnItems({
    
            sortBy:body.sortBy,
            limit:body.limit,
            category:body.category,
            brand:body.brand,
        }));
    }
    catch { 
        return next(APIerror.send('maybe, sent data is not json?'));
    }

});


items.get('/getOne/:id', async (req, res, next) => {

    let id = req.params.id;

    if (!id)
        return next(APIerror.emptyId());
    
    let item = await db_query.items_GetOne(id);

    res.json({item});
});

export default items;