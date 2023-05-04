import jsonwebtoken from 'jsonwebtoken'

import db_query from '../db/db-query.js';


export default async function (req, res, next) {

    if (req.method === "OPTIONS")
        next();

    try {
        let token = req.headers.authorization.split(' ')[1];
        
        if (!token)
            throw '';

        let decoded = jsonwebtoken.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        

        if ((await db_query.getUser(decoded.id)).role != 'admin') 
            throw '';

        next();
    }
    catch {
        res.status(401).json({message:'No permissions'})
    }
};