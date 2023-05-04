

let adminDivs = [

    `<div id="addItem" class="panelDiv selectedRequest">

    <h5>Image</h5>
        <input id="setSrc" type="file" accept="image/*">
    <h5>Cost</h5>
        <div>
            <input id="setCost" type="number" min=0 oninput="validity.valid||(value='');">
            $
        </div>
    <h5>Count</h5>
        <input id="setCount" type="number" min=0 oninput="validity.valid||(value='');">
    

    <h5>Brand</h5>
        <input id="setBrand" type="text" min=0>
    <h5>Category</h5>
        <input id="setCategory" type="text" min=0>


    <h5>Name</h5>
        <input id="setName" style="width:90%" type="text" >
    <h5>Description</h5>
        <textarea  cols="40" rows="4" id="setDescription" style="width:90%; resize: none;"></textarea> 

    </div>`,

    `<div id="editItem" class="panelDiv">

        <h5>Image (Optional)</h5>
            <input id="setSrc" type="file" accept="image/*">
        <h5>Item Id</h5>
            <input id="setId" style="width:30%" type="text" >
        <h5>Cost</h5>
            <div>
                <input id="setCost" type="number" min=0 oninput="validity.valid||(value='');">
                $
            </div>
        <h5>Count</h5>
            <input id="setCount" type="number" min=0 oninput="validity.valid||(value='');">
        
        <h5>Brand</h5>
            <input id="setBrand" type="text" min=0>
        <h5>Category</h5>
            <input id="setCategory" type="text" min=0>
        <h5>Name</h5>
            <input id="setName" style="width:90%" type="text" >
        <h5>Description</h5>
            <textarea  cols="40" rows="4" id="setDescription" style="width:90%; resize: none;"></textarea> 

    </div>`,


    `<div id="addBrand" class="panelDiv" >

        <h5 class="noSelection">Brand Name</h5>
            <input id="setBrand" style="width:40%" type="text" value="">
    </div>`,

    `<div id="removeBrand" class="panelDiv" >

        <h5 class="noSelection">Brand Name</h5>
            <input id="setBrand" style="width:40%" type="text" value="">
    </div>`,

    `<div id="addCategory" class="panelDiv" >

        <h5 class="noSelection">Category Name</h5>
            <input id="setCategory" style="width:40%" type="text" value="">
    </div>`,

    `<div id="removeCategory" class="panelDiv" >
        <h5 class="noSelection">Category Name</h5>
            <input id="setCategory" style="width:40%" type="text" value="">
    </div>`,

    `<div id="addAdmin" class="panelDiv">
        <h5 class="noSelection">User Name</h5>
            <h6 style="color: red;">case matters!</h6>
            <input id="setAdmin" style="width:40%" type="text" value="">
    </div>`,

    `<div id="removeAdmin" class="panelDiv">
        <h5 class="noSelection">User Name</h5>
            <h6 style="color: red;">case matters!</h6>
            <input id="setAdmin" style="width:40%" type="text" value="">
    </div>`,

    `<button type="button" class="elementsBuy btn" style="margin-top: 10px;" onclick="sendRequest(this)"> 
        Send a request
    </button>`
];


async function deleteItem(el, id = '') {

    const f = await fetch(url + '/admin/item/remove', {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
            authorization:getToken()
        },
        body: JSON.stringify({id:id}),
    })
    const data = await f.json();

    if (data.message) {
        alert(data.message)
        return;
    }

    let elem = document.querySelector('.'+el.replace('l',''));
    let elem2 = document.querySelector('.'+el);
    elem.style.transition = 'all 0.3s';
    elem2.style.transition = 'all 0.3s';
    elem.style.opacity = '1';

    setTimeout(() => {
        elem.style.opacity = '0';
        elem.style.width="0";
    }, 0);
    setTimeout(() => elem2.style.backgroundColor = 'rgba(255, 110, 110, 0.897)', 200);
    setTimeout(() => {
        elem2.style.opacity = '0';
        elem2.style.width="0"; 
        elem2.style.padding="0";
        elem2.style.minWidth="0"
    }, 500);
    setTimeout(() => refreshRow(), 850);
}


function addAdminPanel() {

    let div = document.createElement('div');
    div.setAttribute('id', 'adminPanel');
    div.setAttribute('onclick', 'openAdminPanel()');
    div.classList.add('userBtn');
    div.classList.add('noSelection');
    div.innerHTML = 'Admin Panel';
    document.getElementById('userProfile').prepend(div);
}

addAdminPanel();




async function openAdminPanel(id = '') {

    animateApp({id:'adminApp',html: `

        <div style="height: 86%; display: flex;">

            <div style="width:22%; height: 100%">
                <div onclick="changeDiv(this, adminDivs[0])" class="adminCategory noSelection selectedDiv" value="addItem">Add Item</div>
                <div onclick="changeDiv(this, adminDivs[1])" class="adminCategory noSelection" value="editItem">Edit Item</div>
                <div onclick="changeDiv(this, adminDivs[2])" class="adminCategory noSelection" value="addBrand">Add brand</div>
                <div onclick="changeDiv(this, adminDivs[3])" class="adminCategory noSelection" value="removeBrand">Remove brand</div>
                <div onclick="changeDiv(this, adminDivs[4])" class="adminCategory noSelection" value="addCategory">Add category</div>
                <div onclick="changeDiv(this, adminDivs[5])" class="adminCategory noSelection" value="removeCategory">Remove category</div>
                <div onclick="changeDiv(this, adminDivs[6])" class="adminCategory noSelection" value="addAdmin">Add Admin</div>
                <div onclick="changeDiv(this, adminDivs[7])" class="adminCategory noSelection" value="removeAdmin">Remove Admin</div>
            </div>
            
            <div id="divRequest" style="width:80%; height: 100%; overflow: auto">${adminDivs[0]}${adminDivs[adminDivs.length-1]}</div>

        </div>
    
    `,onclick: `closeApp('adminApp'); refreshRow()`});

    document.getElementById('waitAnimation').style.height = '100%';

    if (id) {

        changeDiv(document.querySelector('[value="editItem"]'), adminDivs[1]);
    
        set = (text, key) => document.getElementById('set'+text).value = key;

        const data = (await db_getItem(id)).item;

        set('Id', id);
        set('Name', data.name);
        set('Description', data.description);
        set('Cost', data.cost);
        set('Count', data.count);
        set('Brand', data.brand);
        set('Category', data.category);
    }
    else
        setTypes();

}


function setTypes() {

    try { deleteElement('#typesBtns'); } catch { }

    let divs = [ 'setBrand', 'setCategory'];
    for (let i = 0; i < 2; i++) {
        let div = document.createElement('div');
        id = 'helperType'+i;
        div.setAttribute('id', id);
        document.getElementById(divs[i]).before(div);
        createTypesBtns(divs[i].includes('Brand'), id);
    }
}


function changeDiv(el, html = '') {

    if (el.classList.contains('selectedDiv'))
        return;

    document.querySelector('.selectedDiv').classList.remove('selectedDiv');
    document.querySelector('.selectedRequest').classList.remove('selectedRequest');
    el.classList.add('selectedDiv');
    
    let div = document.getElementById('divRequest');
    div.innerHTML = html + adminDivs[8];
    
    div.style.opacity = '0';
    div.style.transition = '';
    setTimeout(() => {div.style.transition = 'all 0.35s';div.style.opacity = '1'}, 50);


    document.getElementById(el.getAttribute('value')).classList.add('selectedRequest');

    if (html.includes('Item') || html.includes('Admin'))
        setTypes()
    else
        createTypesBtns(html.includes('Brand'));
    

}

async function createTypesBtns(isBrand, elementId = 'divRequest') {

    try { deleteElement('#typesBtns'); } catch { }

    let div = document.createElement('div'),
        text = '';

    let array = await db_getType(isBrand ? 'brands' : 'categories');

    sortAbc(array);
    
    array.forEach(x =>
        text += `
            <button type="button" class="brandBtn noSelection" style="margin-bottom: 3px;"
                onclick="document.getElementById('set${isBrand ? 'Brand' : 'Category'}').value = this.innerHTML.replaceAll(' ', '')"
            >
                ${textSlice(x, 50)}
            </button>`
    );

    div.style.marginBottom = "10px";
    div.setAttribute('id', 'typesBtns');
    div.setAttribute('isBrand', isBrand ? 'Brand' : 'Category');
    div.innerHTML = text;
    
    document.getElementById(elementId).prepend(div);
}


async function sendRequest(el) {

    let data;

    async function send(req = '', body = {}, isFormType = false) {

        const f = isFormType ?
            await fetch(url + '/admin/'+req, {
                method: "post",
                headers: { authorization:getToken() },
                body: body,
            })
        :
            await fetch(url + '/admin/'+req, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    authorization:getToken()
                },
                body: JSON.stringify(body),
            });

        data = await f.json();

        if (data.message)
            alert(data.message);
    
        el.classList.remove('disabled');
    }
    
    el.classList.add('disabled');

    let id = document.querySelector('.selectedRequest').getAttribute('id');

    if (id.includes('Item')) {

        let bool = id.includes('add');

        id = id.replace(bool ? 'add' : 'edit', '');


        let elements = [];

        getVal = (text) => {
            elements.push(text);
            return document.getElementById('set'+text).value;
        };

        let src = document.getElementById('setSrc');


        let fd = new FormData();

        fd.append('name', getVal('Name'));
        fd.append('description', getVal('Description'));
        fd.append('cost', getVal('Cost'));
        fd.append('count', getVal('Count'));
        fd.append('brand', getVal('Brand'));
        fd.append('category', getVal('Category'));
        
        
        if (bool) {

            if (!src.files[0]) {

                alert('Image is not chosen');
                el.classList.remove('disabled');
                return;
            }
            fd.append('file', src.files[0]);
            fd.append('change', 'add');
        }
        else {
            if (src.files[0])
                fd.append('file', src.files[0]);

            fd.append('id', getVal('Id'));
            fd.append('change', 'edit');
        }
        
        await send('item/change', fd, true);

        if (data.message)
            return;
        
        elements.forEach(x => document.getElementById('set'+x).value = '')
    }
    else {

        let bool = id.includes('add');

        id = id.replace(bool ? 'add' : 'remove', '');
        
        let text = document.getElementById('set'+id);

        if (!text.value) {
            alert('Write a ' + id);
            el.classList.remove('disabled');
            return;
        }

        await send(id+(bool ? '/add': '/remove'), {
            
            name:text.value
        });
        
        if (data.message)
            return;
        

        text.value = '';

        createTypesBtns(document.getElementById('typesBtns').getAttribute('isBrand') == 'Brand');
    }
}
