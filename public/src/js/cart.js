
let 
    cartCount = document.getElementById('cartCount'),
    cart = document.getElementById('svgCart'),
    buyCost = 0;



cart.onclick = () => openCart();




async function setCount() {
    await waitAuthFunc();

    if (!User.authed)
        return;

    cartCount.style.opacity = User.cart.length ? '1' : '0';
    
    cartCount.innerHTML = User.cart.length;
}
setCount();


async function cartButton(el, id = '', text = '') {
    
    if (el.value == 'false') {
        
        if (await changeCart(id, true)) {
            
            el.value = 'true';
            el.innerText = text ? text : '-';

            if (text)
                el.classList.add('disabled');
            
            cartCount.style.opacity = '1';
            cartCount.innerHTML = parseInt(cartCount.innerHTML) + 1;

            User.cart.push(id);

            if (document.getElementById('cartAlert').classList.contains('shown'))
                showAnimation('cartAlert');
        }
    }
    else {
        
        if (await changeCart(id, false)) {
            
            el.value = 'false';
            el.innerText = '+';
            
            if (parseInt(cartCount.innerHTML) != 1)
                cartCount.innerHTML = parseInt(cartCount.innerHTML) - 1;
            else {
                cartCount.innerHTML = 0;
                cartCount.style.opacity = '0';
            }

            deleteFromArray(id);
        }
    }
}


async function changeCart(id = '', bool) {

    let d = await db_changeCart(bool, id);

    if (d.message) {
        alert(d.message);
        return;
    }
    
    return true;
}

async function deleteCartElement(elemId = '', id = '') { 

    if (!(await changeCart(id, false)))
        return;

    deleteFromArray(id);
    setCount();

    
    let input = document.querySelector('[elementId="'+elemId+'"]');
    input.value = 0;
    changeCost(input);

    let el = document.getElementById(elemId);
    el.style.transition = 'all 0.3s';
    el.style.opacity = '0.5';
    

    if (buyCost == 0) {

        document.getElementById('buyButton').classList.add('disabled');
        setBtnCost();
    }

    refreshRow();
}

function deleteFromArray(id = '') {

    let index = User.cart.indexOf(id);
    if (index > -1)
        User.cart.splice(index, 1);
}







async function openCart() {    
    
    
    if (appOpened)
        return;

    if (!User.authed) {

        document.getElementById('cartAlert').innerHTML = 'You are not logged in';
        
        showAnimation('cartAlert');
        return;
    }

    if (!User.cart.length) {

        showAnimation('cartAlert');
        return;
    }


    let text = `<div id="cartElements">`;

    let array = (await db_getCart()).cart;


    for (let i = 0; i < array.length; i++) { 

        buyCost += parseInt(array[i].cost);

        text += `
            <div id="cart${i}" class="elementCart">
            
                <div class="divMain">
                    <div class="cartMain">
                        <img src="${array[i].src}" alt="" class="cartImg">
                        <span class="elementText" 
                            style="
                                margin: 0 30px 0 10px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;"
                            >
                            <div>
                                ${textSlice(array[i].name, 150)}
                            </div>
                            <div class="martop">
                                ${textSlice(array[i].description, 300)}
                            </div>

                            <div class="martop" style="display:flex;">
                                <button type="button" class="brandBtn noSelection"> 
                                    ${textSlice(array[i].brand, 50)}
                                </button>
                                <button type="button" class="brandBtn noSelection marleft"> 
                                    ${textSlice(array[i].category, 50)}
                                </button>
                            </div>
                        </span>
                    </div>

                    <div class="cartDescription"
                        <span class="elementText">${array[i].cost}$</span>
                        
                        <div>
                            <input elementId="cart${i}" itemId="${array[i]._id}" min=0 
                                oninput="validity.valid||(value=''); changeCost(this)" 
                                cost="${array[i].cost}" count="${array[i].count}" lastCount="0" type="number" value="1" style="width: 70px;text-align: center;"
                            >
                            <svg style="padding-bottom: 4px; cursor:pointer;" 
                                onclick="deleteCartElement('cart${i}', '${array[i]._id}');" fill="red" width="30px" height="30px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><polygon points="337.46 240 312 214.54 256 270.54 200 214.54 174.54 240 230.54 296 174.54 352 200 377.46 256 321.46 312 377.46 337.46 352 281.46 296 337.46 240" style="fill:none"/><polygon points="337.46 240 312 214.54 256 270.54 200 214.54 174.54 240 230.54 296 174.54 352 200 377.46 256 321.46 312 377.46 337.46 352 281.46 296 337.46 240" style="fill:none"/><path d="M64,160,93.74,442.51A24,24,0,0,0,117.61,464H394.39a24,24,0,0,0,23.87-21.49L448,160ZM312,377.46l-56-56-56,56L174.54,352l56-56-56-56L200,214.54l56,56,56-56L337.46,240l-56,56,56,56Z"/><rect x="32" y="48" width="448" height="80" rx="12" ry="12"/></svg>
                        </div>

                        <span class="elementText">Count: ${array[i].count}</span>
                    </div>
                </div>
            </div>`
    }


    text += `</div>
        <div style="display:flex; justify-content: right;">
            <button id="buyButton" class="btn">
                Place&#160;an&#160;order&#160;(${buyCost}$)
            </button>
        </div>`;
    
    setBuyCost();
    animateApp({id:'cart',html: text,background:'white'});
}


function setBuyCost() {

    let tmp = 0;
    Array.from(document.querySelectorAll('[min="0"]'))
        .forEach((x) => tmp += x.value * x.getAttribute('cost'));
    buyCost = tmp;
}

function changeCost(el) {

    if (parseInt(el.getAttribute('count')) < el.value) {

        el.value = el.getAttribute('count');
        return;
    }

    setBuyCost();


    let btn = document.getElementById('buyButton');

    if (buyCost == 0)
        btn.classList.add('disabled');
    else {

        let input = document.getElementById(el.getAttribute('elementId'));
        
        if (input.style.opacity == 0.5) {

            input.style.opacity = 1;
            changeCart(el.getAttribute('itemId'), true);
            User.cart.push(el.getAttribute('itemId'));
            setCount();
        }
        btn.classList.remove('disabled');
    }

    setBtnCost();
}

const setBtnCost = () => document.getElementById('buyButton').innerHTML = `Place an order (${buyCost}$)`.replaceAll(' ', '&#160;');
