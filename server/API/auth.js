import Router from 'express';
import APIerror from '../errorHandle/APIerror.js';
import authMiddleware from '../Middleware/authMiddleware.js';

import db_query from '../db/db-query.js';

import helper from '../helper.js'
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

const auth = new Router();


const genJWT = (email = '') => jsonwebtoken.sign({id:email}, process.env.SECRET_KEY, {expiresIn: '168h'})


auth.post('/register', async (req, res, next) => {

    let body = req.body;

    if (!body.email || !body.password || !body.username)
        return next(APIerror.emptyData());


    if (body.password.length > 200)
        return next(APIerror.valueIsTooLong('password'));

    if (body.email.length > 200)
        return next(APIerror.valueIsTooLong('email'));
    

    if (body.username.length > 30)
        return next(APIerror.valueIsTooLong('username'));

    if (await db_query.auth_checkUsername(body.username))
        return next(APIerror.send('username is registered'));


    if (body.email.length > 80)
        return next(APIerror.valueIsTooLong('email'));

    if (!helper.validateEmail(body.email))
        return next(APIerror.send('email is not valid'));
        
    if (await db_query.getUser(body.email))
        return next(APIerror.send('email is registered'));


    let hashPassword = await bcrypt.hash(body.password, 5);
    await db_query.auth_add(body.email, hashPassword, body.username)
    
    let token = genJWT(body.email);
    
    res.json({token});
});

auth.post('/login', async (req, res, next) => {

    let body = req.body;

    if (!body.email || !body.password)
        return next(APIerror.emptyData());


    let user = await db_query.getUser(body.email);

    if (!user)
        return next(APIerror.send('email or password is not correct'));

    let passIsReal = bcrypt.compareSync(body.password, user.password);

    if (!passIsReal)
        return next(APIerror.send('email or password is not correct'));
    
    
    let token = genJWT(body.email);

    res.json({token, cart:user.cart});
});

auth.get('/check', authMiddleware, async (req, res, next) => {

    let 
        body = req.user,
        token = genJWT(body.id),
        u = await db_query.getUser(body.id);

    if (!u)
        return next(APIerror.send('account is not found, maybe is deleted'));

    res.json({token, username:u.username, role:u.role, cart:u.cart})
});


export default auth;