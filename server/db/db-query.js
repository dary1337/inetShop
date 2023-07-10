import db from './db.js';
import { ObjectId } from 'mongodb';


class db_query {

    // main
    static getUser = async (userEmail = '') => 
        await db.users.findOne({email:userEmail});


    // admin
    static admin_Add = async (userName = '') =>
        await db.users.updateOne({username:userName}, {$set:{role:'admin'}});

    static admin_Remove = async (userName = '') =>
        await db.users.updateOne({username:userName}, {$set:{role:''}});


    // auth
    static auth_CheckUsername = async (userName = '') =>
        await db.users.findOne({username:userName});

    static auth_Add = async (userEmail = '', userPassword = '', userName = '') =>
        await db.users.insertOne({email:userEmail, password:userPassword, username:userName});



    // cart
    static cart_Check = async (userEmail = '', itemId = '') =>
        await db.users.findOne({email:userEmail, cart:itemId});
    
    static cart_Add = async (userEmail = '', itemId = '') =>
        await db.users.updateOne({email:userEmail}, {$push:{cart:itemId}});
    
    static cart_Remove = async (userEmail = '', itemId = '') =>
        await db.users.updateOne({email:userEmail}, {$pull:{cart:itemId}});

    static cart_Get = async (userEmail = '') => {

        let dbCart = (await db.users.findOne({email:userEmail})).cart;
        
        let userCart = [];
        for (let i = 0; i < dbCart.length; i++)
            userCart.push(ObjectId(dbCart[i]));
    
        let cart = (await db.items.find({"_id":{$in:userCart}}).toArray());
    
        return cart;
    };


    static cart_RemoveId = async (id = '') =>
        await db.users.updateMany({},{$pull:{cart:{$in:[id]}}});


    // items

    /** @returns all items in array */
    static items_Get = async (filter = {}) =>
        await db.items.find(filter).toArray();

    static items_GetOne = async (id = '') =>
        await db.items.findOne({"_id":ObjectId(id)});
    


    static items_GetByName = async (name = '') =>
        await db.items.findOne({name:name});
    
    static items_GetByArray = async (array = []) =>
        await db.items.find({name:{$in:array}});

    static items_GetBySrc = async (src = '') =>
        await db.items.findOne({src:src});


    
    static items_Add = async (document = {}) =>
        await db.items.insertOne(document);

    static items_Update = async (id = '', document = {}) =>
        await db.items.updateOne({"_id": ObjectId(id)}, document);

    static items_Remove = async (id = '') =>
        await db.items.deleteOne({"_id": ObjectId(id)});


    // types

    /** @returns all types in array */
    static types_Get = async (type = '') => {

        if (!type)
            return '';

        if (type == 'brand')
            return (await db.brands.find().toArray())[0].names;
        if (type == 'category')
            return (await db.categories.find().toArray())[0].names;
    }

    static types_GetAll = async () => {
        return {
            brands: await db_query.types_Get('brand'),
            categories: await db_query.types_Get('category'),
        }
    };

    static types_GetOne = async (type = '', typeName = '') => {
    
        let filter = {names:{$all:[typeName.toLowerCase()]}};

        if (type == 'brand')
            return (await db.brands.findOne(filter));
        if (type == 'category')
            return (await db.categories.findOne(filter));
    }


    static types_Add = async (type = '', typeName = '') => {
    
        if (type == 'brand')
            return (await db.brands.updateOne({},{$push:{names:typeName}}));
        if (type == 'category')
            return (await db.categories.updateOne({},{$push:{names:typeName}}));
    }

    static types_Remove = async (type = '', typeName = '') => {
    
        if (type == 'brand')
            return (await db.brands.updateOne({},{$pull:{names:typeName}}));
        if (type == 'category')
            return (await db.categories.updateOne({},{$pull:{names:typeName}}));
    }

}

export default db_query;