
let User = {
    authed: false,
    role: '',
};
let waitAuth = true;



function changeAuth() {

    document.getElementById('i1').innerHTML = 'Log In'
    document.getElementById('i2').innerHTML = `
        <input value="Email" id="loginEmail" type="text" style="margin-top:4%; width: 60%; height: 20%; font-size: 120%;" onclick="setText(this)" onfocusout="returnText(this); checkEmail(this)">
        <input value="Password" id="loginPassword" type="password" style="margin-top:10px; width: 60%; height: 20%; font-size: 120%;" onclick="setText(this)" onfocusout="returnText(this)">
    `;
    document.getElementById('i3').innerHTML = `<button onclick="logIn()" id="loginButton" style="margin-left: 0" class="btn">Log In</button>`;
    
}


function setText(el) {

    if (!el.getAttribute('f'))
        el.setAttribute('f', el.value);

    if (el.value == el.getAttribute('f'))
        el.value = '';
}

function returnText(el) {

    if (el.value == '')
        el.value = el.getAttribute('f')
}


function setProfile() {

    User.authed ?
        showAnimation('userProfile')
    :
        animateApp({id:'formDiv',html:`

            <div id="i1" class="text-center noSelection" style="font-size: 260%; margin-top:2%;">Register</div>
            
            <div id="i2" style="display: flex; flex-direction: column; align-items: center; height: 40%">
                <input value="Username" id="regUsername" type="text" style="margin-top:4%; width: 60%; height: 20%; font-size: 120%;" onclick="setText(this)" onfocusout="returnText(this)" onkeyup="checkUsername(this)">
                <input value="Email" id="regEmail" type="text" style="margin-top:1%; width: 60%; height: 20%; font-size: 120%;" onclick="setText(this)" onfocusout="returnText(this); checkEmail(this)">
                <input value="Password" id="regPassword" type="password" style="margin-top:10px; width: 60%; height: 20%; font-size: 120%;" onclick="setText(this)" onfocusout="returnText(this)">
            </div>
            
            <div id="i3" class="text-center noSelection" style="height: 30%; margin-top:3%;">
                <a style="color: rgb(70, 70, 255); cursor:pointer;" onclick="changeAuth()">Have account?</a>
                <button onclick="register()" id="regButton" class="btn">Register</button>
            </div>
        `, width:'44%',height:'44%'});


        try {
            document.querySelector(`[onclick="closeApp('formDiv')"]`).style.marginLeft = '92%';
        } catch {}
    
}


function checkUsername(el) {

    el.value = el.value.replaceAll(/[^A-zА-яЁё0-9\-]/g, '').replaceAll('\n', ' ').trim()
    
    if (el.value.length > 30)
        el.value = el.value.slice(0, 30)
}

function checkEmail(el) {

    const validateEmail = (email = '') => email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    el.style.border = validateEmail(el.value) ? '' : '1px red solid';
}


getValue = (el) => document.getElementById(el).value;


async function register() {

    let d = await db_auth(true, {
        username: getValue('regUsername'),
        email: getValue('regEmail'),
        password: getValue('regPassword'),
    });

    if (d.message) {
        alert(d.message)
        return;
    }

    setToken(d.token);

    window.location.reload();
}

async function logIn() {
    
    let d = await db_auth(false, {
        email: getValue('loginEmail'),
        password: getValue('loginPassword'),
    });

    if (d.message) {
        alert(d.message)
        return;
    }
    
    setToken(d.token);

    window.location.reload();
}

function logOut() {

    document.cookie = "token=";
    window.location.reload();
}


setToken = (token = '') => setCookie('token', token, 7);
getToken = () => 'User ' + getCookie('token');


async function check() {

    let nick = document.getElementById('userName')

    if (getCookie('token')) {
        
        const data = await db_checkAuth();

        User = {

            authed:true,
            role: data.role,
            cart: data.cart.length ? data.cart : []
        }

        if (User.role == 'admin') {

            let sc = document.createElement('script');
            sc.src = 'src/js/admin.js';
            document.body.appendChild(sc);
        }
        nick.innerHTML = data.username;
        setToken(data.token);
    }
    else
        nick.innerHTML = 'Log in';

    waitAuth = false;
}


check();