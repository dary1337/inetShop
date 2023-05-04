import Router from 'express';
import APIerror from '../errorHandle/APIerror.js';
import adminMiddleware from '../Middleware/adminMiddleware.js';

import db_query from '../db/db-query.js';
import helper from '../helper.js';

import path from 'path';

import fileUpload from 'express-fileupload';

const admin = new Router();


const staticFolder = path.join(path.dirname(helper.getFileUrl()).replaceAll('\\', '/'), '../').replaceAll('\\', '/') + 'public/';


admin.post('/item/change', adminMiddleware, fileUpload({
    createParentPath: true, safeFileNames: true, abortOnLimit: true, 
    debug: false,
    limits: { fileSize: 2097152 },
    limitHandler: (req, res, next) => next(APIerror.send('image size more then 2mb'))
}), async (req, res, next) => { 

    let body = req.body;

    if (!body.cost || !body.count || !body.brand || !body.category || !body.name || !body.description, !body.change)
        return next(APIerror.notAllData());

    if (body.cost > 1000000)
        return next(APIerror.send('cost is too much'));

    if (body.count > 1000000)
        return next(APIerror.send('count is too much'));


    if (body.name.length > 200)
        return next(APIerror.valueIsTooLong('name length'));

    if (body.description.length > 400)
        return next(APIerror.valueIsTooLong('description length'));


    if (!(await db_query.types_GetOne('brand', body.brand)))
        return next(APIerror.notFound('brand'));

    if (!(await db_query.types_GetOne('category', body.category)))
        return next(APIerror.notFound('category'));


    if (body.change == 'add') {

        if (await db_query.items_GetByName(body.name))
            return next(APIerror.alreadyInDb('name'));

        if (Object.keys(req.files).length == 0)
            return next(APIerror.send('image is not sent'));

        let file = req.files.file;
        
        if (!file.mimetype.includes('image'))
            return next(APIerror.send('sent file is not image'));
        
        let name = helper.getFileName(file);

        let image = await db_query.items_GetBySrc('src/images/'+name)
    
        if (image)
            return next(APIerror.alreadyInDb('image'));

        await file.mv(staticFolder + 'src/images/'+name);

        if (!helper.fileExists(staticFolder + 'src/images/'+name))
            return next(APIerror.send('file is not created'));
        
    
        await db_query.items_Add({
            name:body.name,
            description:body.description,
    
            cost:parseInt(body.cost),
            count:parseInt(body.count),
            brand:body.brand.toLowerCase(),
            category:body.category.toLowerCase(),
            src:'src/images/'+name,
        });

    }
    else {

        if (!body.id)
            return next(APIerror.emptyId());

        let filesNotSent = !req.files || Object.keys(req.files).length == 0;
        
        let image = await db_query.items_GetOne(body.id)

        let name = '';

        if (!filesNotSent) {

            let file = req.files.file;

            if (!file.mimetype.includes('image'))
                return next(APIerror.send('sent file is not image'));

            name = helper.getFileName(file);

            helper.deleteFile(staticFolder + image.src);
            await file.mv(staticFolder + 'src/images/'+name);

            if (!helper.fileExists(staticFolder + 'src/images/'+name))
                return next(APIerror.send('file is not created'));
        }

        await db_query.items_Update(body.id,
            {$set:{
                name:body.name,
                description:body.description,
        
                cost:parseInt(body.cost),
                count:parseInt(body.count),
                brand:body.brand.toLowerCase(),
                category:body.category.toLowerCase(),
                src: !filesNotSent ? ('src/images/'+name) : image.src,
            }
        });

    }


    res.json({success:true});
});

admin.post('/item/remove', adminMiddleware, async (req, res, next) => { 

    let body = req.body;

    if (!body.id)
        return next(APIerror.emptyId());

    await db_query.cart_RemoveId(body.id);
    await db_query.items_Remove(body.id);

    
    let image = await db_query.items_GetOne(body.id);

    helper.deleteFile(staticFolder + image.src);

    res.json({success:true});
});


admin.post('/brand/add', adminMiddleware, async (req, res, next) => { 

    let body = req.body;

    if (!body.name)
        return next(APIerror.empty('name')); 
        
    body.name = body.name.toLowerCase();


    if (await db_query.types_GetOne('brand', body.name))
        return next(APIerror.alreadyInDb('brand'));

    await db_query.types_Add('brand', body.name);

    res.json({success:true});
});

admin.post('/brand/remove', adminMiddleware, async (req, res, next) => { 

    let body = req.body;

    if (!body.name)
        return next(APIerror.empty('name')); 

    body.name = body.name.toLowerCase();


    if (!(await db_query.types_GetOne('brand', body.name)))
        return next(APIerror.notFound('brand'));

    await db_query.types_Remove('brand',body.name);

    res.json({success:true});
});

admin.post('/category/add', adminMiddleware, async (req, res, next) => { 

    let body = req.body;

    if (!body.name)
        return next(APIerror.empty('name')); 
    
    body.name = body.name.toLowerCase();


    if (await db_query.types_GetOne('category', body.name))
        return next(APIerror.alreadyInDb('category'));

    await db_query.types_Add('category', body.name);
    
    res.json({success:true});
});

admin.post('/category/remove', adminMiddleware, async (req, res, next) => { 

    let body = req.body;

    if (!body.name)
        return next(APIerror.empty('name')); 

    body.name = body.name.toLowerCase();


    if (!(await db_query.types_GetOne('category', body.name)))
        return next(APIerror.notFound('category'));

    await db_query.types_Remove('category', body.name);

    res.json({success:true});
});


admin.post('/admin/:type', adminMiddleware, async (req, res, next) => { 

    let
        body = req.body,
        type = req.params.type;

    if (!body.name)
        return next(APIerror.empty('username'));


    if (type == 'add')
        await db_query.admin_Add(body.name);
    else
        await db_query.admin_Remove(body.name);
    

    res.json({success:true});
});




export default admin;