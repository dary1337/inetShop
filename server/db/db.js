import { MongoClient } from 'mongodb';

const 
    dbClient = (new MongoClient('mongodb://127.0.0.1')).db('inetShop'),
    
    database = {
        users: dbClient.collection('users'),
        
        brands: dbClient.collection('brands'),
        categories: dbClient.collection('categories'),

        items: dbClient.collection('items'),
    }

export default database;