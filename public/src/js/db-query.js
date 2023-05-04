const url = 'http://localhost:5000/api';


function checkAnswer(data) {

    if (!data || data.length === 0)
        throw 'empty data from server';
    
    if (data.message)
        throw data.message;
}

async function f(endpoint = '', init = {}) {

    try {

        const res = await fetch(url + endpoint, init);
        const data = await res.json();
    
        if (!data || data.length === 0)
            throw 'empty data from server';
    
        if (data.message)
            throw data.message;
    }
    catch (e) {

        if (e.message.includes('Failed to fetch'))
            return;
        
        console.log(endpoint + ' | ' + e);
    }


    
}



async function db_auth(isRegister = false, body = {}) {

    try {

        if (!body.email || !body.password)
            throw 'email or password can\'t be empty';

        const f = await fetch(url + `/auth/${(isRegister ? 'register' : 'login')}`, {
            method: "post",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })
        const data = await f.json();
        checkAnswer(data);

        return data;
    }
    catch (e) {
        alert('auth error: ' + e);
        console.log(e);
    }
}

async function db_checkAuth() {

    try {

        const f = await fetch(url + '/auth/check', {
            method: "get",
            headers: { authorization:getToken() }
        })
        const data = await f.json();
        checkAnswer(data);

        return data;
    }
    catch (e) {
        alert('checkAuth error: ' + e);
        console.log(e);
    }
}



async function db_getItems(query = {}) {

    try {    
        if (!query.sortBy)
            throw 'sortBy is empty';

        let qUrl = `/items/get/{"sortBy":"${query.sortBy}","limit":"${query.limit}","category":"${query.category}","brand":"${query.brand}"}`

        const f = await fetch(url + qUrl, { method: "get" })
        const data = await f.json();

        if (data.message)
            throw data.message;

        return data;
    }
    catch (e) {
        alert('getItems error: ' + e);
        console.log(e);
    }
}

async function db_getItem(id = '') {

    try {
        if (!id)
            throw 'id is empty';

        const f = await fetch(url + `/items/getOne/${id}`, { method: "get" })
        const data = await f.json();

        checkAnswer(data);
        
        return data;
    }
    catch (e) {
        alert('getItem error: ' + e.message);
        console.log(e);
    }
}


async function db_getType(typeName = '') {

    try {
        const f = await fetch(url + `/types/get/${typeName}`, { method: "get" })
        const data = await f.json();

        checkAnswer(data);
        
        return data;
    }
    catch (e) {
        alert('getType error: ' + e.message);
        console.log(e);
    }
}


async function db_getCart() {

    try {

        const f = await fetch(url + '/cart/get', {
            method: "get",
            headers: {
                authorization:getToken()
            },
        });
        const data = await f.json();

        checkAnswer(data);
        
        return data;
    }
    catch (e) {
        alert('getCart error: ' + e.message);
        console.log(e);
    }
}

async function db_changeCart(isAdding = false, id = '') {

    try {
        if (!id)
            throw 'id is empty';

        const f = await fetch(url + `/cart/${(isAdding ? 'add' : 'remove')}`, {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                authorization:getToken()
            },
            body: JSON.stringify({id:id}),
        })
        const data = f.json();

        checkAnswer(data);
        
        return data;
    }
    catch (e) {
        alert('changeCart error: ' + e.message);
        console.log(e);
    }
}




async function db_search(query = '') {

    if (!query)
        return;

    try {

        const f = await fetch(url + `/search/find/${query}`, { method: "get", })
        const data = f.json();
        
        return data;
    }
    catch (e) {
        console.log(e);
    }
}