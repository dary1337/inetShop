import db from './server/db/db.js';

await db.items.insertOne({
    "_id": {
      "$oid": "63d5269ce59b956e1da83e41"
    },
    "src": "src/images/img.jpeg",
    "cost": 2123,
    "count": 3132,
    "category": "tv",
    "brand": "lenovo",
    "name": "22\" Tv Super Mega Quardo HD++ MAX (yandere gayLisa,  dolbutAnuS)",
    "description": "Крутой телик, включил в розетку, он взорвал квартиру."
});

await db.items.insertOne({
    "_id": {
      "$oid": "63e3d8142164ae38663898e8"
    },
    "name": "ыПхон 16 прошка",
    "description": "тут должен быть текст, но Я его забыл...",
    "cost": 1,
    "count": 3132,
    "brand": "apple",
    "category": "tv",
    "src": "src/images/3df5bdc96174ebe0fa14a0d057f940b0.jpeg"
});

await db.items.insertOne({
    "_id": {
      "$oid": "63e7a84343860bbabbe8c607"
    },
    "name": "Cum Aphone",
    "description": "12312312321",
    "cost": 123123,
    "count": 123132,
    "brand": "apple",
    "category": "fridge",
    "src": "src/images/fb9cc2ac875e0bb03960550103dd5ca4.jpeg"
});


await db.categories.insertOne({
    "_id": {
      "$oid": "63dc55c31979b7dc6e61020c"
    },
    "names": [
      "tv",
      "phone",
      "laptop",
      "fridge",
      "computer",
      "mouse",
      "keyboard",
      "headphones",
      "tablet"
    ]
});

await db.brands.insertOne({
    "_id": {
      "$oid": "63dc558b650e3830d590aef1"
    },
    "names": [
      "lenovo",
      "tecno",
      "samsung",
      "apple",
      "google",
      "lg",
      "asus",
      "blackview",
      "dell",
      "huawei",
      "htc",
      "honor",
      "hp",
      "meizu",
      "oppo",
      "xiaomi",
      "zte"
    ]
});

await db.users.insertOne({
    "_id": {
      "$oid": "63dea8df1f11ea56dcf646b8"
    },
    "email": "qwe@mail.ru",
    "role": "admin",
    "password": "$2b$05$wHyW2Xm0xiudFbnQxXwJOeDzMRru18AHY9pirk1cpxfxvUno.MsWu",
    "username": "yuri",
    "cart": [ ]
});


console.log('success');
process.kill(0);