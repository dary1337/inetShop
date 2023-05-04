




function setCookie(key = '', value = '', exdays = 0) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = key + "=" + value + ";" + expires + ";path=/";
}

function getCookie(key = '') {
      
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for(let i = 0; i < ca.length; i++) {

    let c = ca[i];

    while (c.charAt(0) == ' ')
        c = c.substring(1);

    if (c.indexOf(name) == 0) 
        return c.substring(name.length, c.length);
    }

    return "";
}


const sleep = async (ms = 100) => await new Promise(r => setTimeout(r, ms));

const waitAuthFunc = async () => {

  while (waitAuth)
    await sleep();
};


const upFirstChar = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const textSlice = (string = '', limit = 0) => upFirstChar(string.slice(0, limit)+(string.length > limit ? '...' : ''));


const deleteElement = (query) => {
    
    let el = typeof query === 'string' ? document.querySelector(query) : query;
    el.parentNode.removeChild(el);
}

const sortAbc = (array) => array.sort((a, b) => a.localeCompare(b));


const searchInArray = (array, query = '') => {

    let tmp = [];

    if (array && array.length != 0) {

        array.find((str) => {
            if (str.includes(query.toLowerCase()))
                tmp.push(upFirstChar(str));
        });
        return tmp;
    }

    return undefined;
};