import Router from 'express';
import APIerror from '../errorHandle/APIerror.js';
import helper from '../helper.js';

import db_query from '../db/db-query.js';


const search = new Router();



search.get('/find/:query', async (req, res, next) => {
    
    let query = req.params.query;

    if (!query)
        return next(APIerror.emptyData());
    
    query = query.toLowerCase().replaceAll(' ', '');

    
    let items = await db_query.items_Get();
    
    const searchInArray = (array) => {

        let tmp = [];

        if (array && array.length != 0) {

            array.find((str) => {

                if ((str.name.toLowerCase().replaceAll(' ', '')).includes(query))
                    tmp.push(str.name);
            });
            return tmp;
        }

        return undefined;
    };


    let result = (await (await db_query.items_GetByArray(searchInArray(items))).toArray());

    result = helper.filterObject(result, ['_id', 'name']);

    res.json({result});
});



export default search;