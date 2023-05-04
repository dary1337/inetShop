
let 
    limitShow = document.getElementById('HMS').value,
    sortByWhat = '',
    categoryChoosen = '',
    brandChoosen = '',
    pageChoosen = 1,
    
    topElement = '',
    leftElement = '',
    scrollPos = 0,
    
    waitRefresh = false;


async function setSortBy() {

    Array.from(document.querySelectorAll('.sortBy')).forEach((el) => el.onclick = () => {

        if (el.classList.contains('sortSelected'))
            return;
    
        document.querySelector('.sortSelected').classList.remove('sortSelected');
        el.classList.add('sortSelected');
    
        document.getElementById('showSortBy').innerHTML = el.getAttribute('value');
        sortByWhat = el.getAttribute('value');
    
        pageChoosen = 1;
    
        refreshRow();
    });
}
setSortBy();

async function setCategories() {

    let el = document.getElementById('categoryBox');

    const data = sortAbc(await db_getType('categories'));
    let text = '';

    for (let i = 0; i < data.length; i++)
        text += `<div class="category noSelection" value="${data[i]}">${upFirstChar(data[i])}</div>`;
    
    el.innerHTML = text;

    Array.from(document.querySelectorAll('.category')).forEach((el) => 
        el.onclick = () => selectCategory(el));

    sortByWhat = document.querySelector('.sortSelected').getAttribute('value');
    

    document.getElementById('showSortBy').innerHTML = sortByWhat;

    updateData();
}
setCategories();


function selectBrand(brand = '') {

    try { deleteElement('#selectedBrand'); } catch { }

    let btn = document.createElement('button');
    btn.setAttribute('id', 'selectedBrand'); 
    btn.setAttribute('type', 'button'); 
    btn.setAttribute('onclick', 'clearBrand()'); 
    btn.classList.add('brandBtn');
    btn.innerHTML = upFirstChar(brand);
    btn.style.marginLeft = '10px';

    document.getElementById('page').append(btn);

    brandChoosen = brand;
    refreshRow();
}

function clearBrand() {
    deleteElement(document.querySelector('#selectedBrand'));
    brandChoosen = '';
    refreshRow();
}


function selectPage(el) {

    if (el.getAttribute('id').includes('prev')) {

        if (pageChoosen == 1)
            return;

        pageChoosen -= 1;
    }
    else
        pageChoosen += 1;
    

    document.getElementById('currentPage').innerHTML = pageChoosen;

    setItems(lastData);
}


function selectCategory(el) {

    if (typeof el === 'string')
        el = document.querySelector(`[value="${el}"]`);
    

    if (el.classList.contains('categoryChoosen')) {

        categoryChoosen = '';
        el.classList.remove('categoryChoosen');
        refreshRow();
        return;
    }

    document.querySelector('.categoryChoosen')?.classList.remove('categoryChoosen');

    el.classList.add('categoryChoosen');

    categoryChoosen = el.getAttribute('value');

    pageChoosen = 1;

    refreshRow();
    
    
}



lastData = {};
async function updateData() {

    await waitAuthFunc();

    let array = await db_getItems({
        category:categoryChoosen,
        brand:brandChoosen,
        sortBy: sortByWhat,
    });
    
    setItems(array);

    lastData = array;
}

function refreshRow() {

    limitShow = document.getElementById('HMS').value;
    
    updateData();
}

function setItems(array = {}) {

    Array.from(document.querySelectorAll('.elements'))
        .forEach(el => deleteElement(el));

    limitShow = document.getElementById('HMS').value;

    if (limitShow > array.length)
        pageChoosen = 1;
    if (array[limitShow * pageChoosen - limitShow] == undefined)
        pageChoosen -= 1;
    
    document.getElementById('currentPage').innerHTML = pageChoosen;
    
    
    index = limitShow * pageChoosen - limitShow;
    endIndex = limitShow * pageChoosen;


    
    let el = document.getElementById('elementsShop');

    for (let i = index; i < endIndex; i++) {

        if (array[i] == undefined)
            break;

        let div = document.createElement('div');
        div.classList.add('elements');
        div.classList.add('el'+i);

        let text = `
        <div class="elementsStyle ${'e'+i}">
            <img src="${array[i].src}" class="elementsImages" alt="">
            <span class="elementText">
                ${textSlice(array[i].name, 40)}
            </span>
            <span style="margin-bottom: 6px">${array[i].cost}$ | Count: ${array[i].count}</span>
            
            <div style="display:flex; justify-content: center; align-items: center;">
            
            <button type="button" class="brandBtn" onclick="selectBrand('${array[i].brand}')"> 
                ${textSlice(array[i].brand, 12)}
            </button>
            `;

            if (User.authed) {

                let bool = User.cart.includes(array[i]._id);

                text += `<button type="button" class="elementsBuy btn plus pl${array[i]._id}" value="${bool}" onclick="cartButton(this, '${array[i]._id}')"> ${bool ? '-' : '+'} </button>`
            }

            text += `
                <button onclick="openSelectedItem('${array[i]._id}')" type="button" class="elementsBuy btn arrow" style="width:min-content; padding-left:6px; padding-right:6px;">
                    <svg fill="#000000" width="30px" height="30px" viewBox="-8.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <title>Open item</title>
                        <path d="M14.56 9.6c0-0.64-0.44-0.92-0.88-0.92v0h-9.64c-0.48 0-0.84 0.36-0.84 0.84s0.36 0.84 0.84 0.84h7.68l-11.48 11.52c-0.32 0.32-0.32 0.84 0 1.2 0.16 0.16 0.4 0.24 0.6 0.24s0.44-0.080 0.6-0.24l11.44-11.44v7.68c0 0.48 0.36 0.84 0.84 0.84s0.84-0.36 0.84-0.84v-9.72z"></path>
                    </svg>
                </button>
                </div>
            `;

        if (User.role == 'admin')
            text += `
                <div class="martop" 
                    style="display: flex; flex-direction: row; justify-content: flex-end;"
                >
                    <button type="button" class="elementsBuy btn" style="background-color:black !important; color:white" 
                        onclick="openAdminPanel('${array[i]._id}')"> Edit 
                    </button>
                    <button type="button" class="elementsBuy btn" style="background-color:red !important; color:white" 
                        onclick="deleteItem('${'el'+i}','${array[i]._id}')"> Delete 
                    </button>
                </div>`;


        text += `</div>`;

        div.innerHTML = text;

        div.style.opacity = 0.2;
        div.style.transition = 'all 0.2s';
        setTimeout(() => {
            try { document.querySelector('.el'+i).style.opacity = 1 } catch {}}
        , 150+i*100);
        
        el.appendChild(div);
    }
}



function checkElement(el) {

    if (!User.authed)
        return;

    let bool = User.cart.includes(el.replace('.pl', ''));
    let el2 = document.querySelector(el);
    el2.innerHTML = bool ? '-' : '+';
    el2.value = bool ? 'true' : 'false';
}

async function openSelectedItem(id = '', refresh = false) {

    document.querySelectorAll('.arrow').forEach((x) => x.classList.add('disabled'));

    if (appOpened && !refresh)
        return;
    
    let array = (await db_getItem(id)).item;

    let text = `

        <div style="display:flex; align-items:center">
            <div style="
            display: flex;
            flex-direction: column;
            align-items: center;">
                <img id="fullImage" src="${array.src}" alt="">`
                
                if (User.authed) {

                    if (User.cart.includes(array._id))
                        text += `<button id="addToCartBtn" type="button" class="elementsBuy btn disabled" value="true" onclick="cartButton(this, '${array._id}')"> Already in the cart </button>`
                    else
                        text += `<button id="addToCartBtn" type="button" class="elementsBuy btn" value="false" onclick="cartButton(this, '${array._id}', 'Added to cart')"> Add to Cart </button>`
                }

    text += `
            </div>
            <div style="margin-right: 3%;width: 90%;">
                <h1 class="elementText">${array.name}</h1>

                <button type="button" class="brandBtn noSelection" onclick="selectBrand('${array.brand}'); closeSelectedItem();"> 
                    ${textSlice(array.brand, 50)}
                </button>
                <button type="button" class="brandBtn noSelection"> 
                    ${textSlice(array.category, 50)}
                </button>
                <h4 class="noSelection">Cost:</h4>

                <h4 style="margin-left:14px;">${array.cost}$</h4>

                <h6 style="margin-left:14px;">${array.count} pieces in stock</h6>

                <h3 class="noSelection">Description:</h3>

                <span style="display: flex;margin-left: 14px;">${array.description}</span>
            </div>
        </div>`    
        
        
    refresh ?
        refreshApp(`
            <div class="noSelection" style="transform: rotate(45deg) scale(1.12);font-size: 330%;margin-left: 95%; cursor: pointer;" 
                onclick="closeSelectedItem('fullResult');">+
            </div>` + 
            text
        )
    :
        animateApp({id:'elementApp',html:text,background: 'aquamarine',onclick: `closeSelectedItem(); checkElement('.pl${array._id}')`});
}

function closeSelectedItem(el = 'elementApp') {

    document.querySelectorAll('.arrow').forEach((x) => x.classList.remove('disabled'));

    closeApp(el);
}







document.getElementById('refreshButton').onclick = () => {
    
    if (waitRefresh)
        return;

    waitRefresh = true;
    refreshRow();
    setTimeout(() => waitRefresh =false, 500);
};
