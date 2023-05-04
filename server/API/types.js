import Router from 'express';

import db_query from '../db/db-query.js';


const types = new Router();


types.get('/get/all', async (req, res) =>
    res.json(await db_query.types_GetAll())
);

types.get('/get/brands', async (req, res) => 
    res.json(await db_query.types_Get('brand'))
);


types.get('/get/categories', async (req, res) => 
    res.json(await db_query.types_Get('category'))
);



export default types;