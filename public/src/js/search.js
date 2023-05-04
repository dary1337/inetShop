
let 
    searchInput = document.getElementById('searchInput'),
    searchButton = document.getElementById('searchButton'),
    searchBox = document.getElementById('searchResult'),

    defValue = 'looking for something?',
    
    lastTypes = [];

searchInput.onmousedown = () => {

    if (searchInput.value == defValue) {

        searchInput.value = '';
        searchInput.style.color = 'black';
        return;
    }

};

const refreshTypes = async () => lastTypes = await db_getType('all');

refreshTypes();



async function search(query = '', force = false) {

    if (query == '') {

        searchBox.classList.remove('shown');
        return;
    }
    else
        searchBox.classList.add('shown');
    


    if (force)
        refreshTypes();
    

    let d = {};
        d.categories = searchInArray(lastTypes.categories, query);
        d.brands = searchInArray(lastTypes.brands, query);


    let 
        text = '<div style="margin-top: 4px;"> </div>',
        countResults = 0,
        maxResults = 5;

    const createResult = (array, type = '') => {

        if (!array)
            return;

        for (let i = 0; i < array.length; i++) {

            countResults++;

            if (countResults > maxResults)
                continue;

            text += `                
                <div class="searchResult" onclick="chooseSearch('${array[i]}', '${type}')"> 
                    ${array[i]}
                    <div class="searchType"> ${type} </div>
                </div>`;
        }
    };

    
    createResult(d.categories, 'Category');
    createResult(d.brands, 'Brand');


    let items = (await db_search(query)).result;

    if (items && items.length !== 0)
        items.forEach(x => {

            countResults++;

            if (countResults > maxResults)
                return;

            text += `
                <div class="searchResult" onclick="chooseSearch('${x.name.replaceAll('\"', '')}', '${x._id}')"> 
                    ${textSlice(x.name, 40)}
                    <div class="searchType"> Item </div>
                </div>`;
        });
    
    

    if (!text.includes('searchResult'))
        text += '<div> Nothing found =( </div>';


    if (countResults > maxResults)
        text += `
            <div class="searchResult" onclick="showAllResults('${query}')">
                Show more results 
                <div class="searchType"> (${countResults}) </div> 
            </div>`;
    
    
    searchBox.innerHTML = text;
}
async function showAllResults(query = '') {

    const createResult = (array, type = '') => {

        if (!array)
            return;

        preText += `<h4> ${type}: </h4>`;

        for (let i = 0; i < array.length; i++) {

            preText += `
                <div class="searchResult" onclick="chooseSearch('${array[i]}', '${type}'); closeApp('fullResult')"> 
                    ${array[i]}
                </div>`;
            countResults++;
        }
    };

    let countResults = 0;

    let d = {};
        d.categories = searchInArray(lastTypes.categories, query);
        d.brands = searchInArray(lastTypes.brands, query);


    let preText = '';
    
    createResult(d.categories, 'Category');
    createResult(d.brands, 'Brand');

    let items = (await db_search(query)).result;
    if (items && items.length !== 0) {

        preText += `<h4> Items: </h4>`;
        items.forEach(x => {
            preText += `
                <div class="searchResult" onclick="chooseSearch('${x.name.replaceAll('\"', '')}', 
                '${x._id}', '${x._id}')"> 
                    ${textSlice(x.name, 90)}
                </div>`;
            countResults++;
        });
    }

    let text = `
        <div class="noSelection">
        
            <h3 style="margin-left:2%;"> Found ${countResults} results for "${query}" query: </h3>
        
            <div id="showResult">
                ${preText}
                <div style="margin-bottom:2%;"></div>
            </div>
        </div>
        `;

    animateApp({
        id:'fullResult',
        html: text
    });
    document.getElementById('fullResult').style.overflowX = 'hidden';
    clearField(false);
}



function chooseSearch(value = '', type = '', id = '') {

    if (id)
        openSelectedItem(id, true);

    searchInput.value = upFirstChar(value);

    value = value.toLowerCase();

    if (type == 'Brand')
        selectBrand(value);
    else if (type == 'Category')
        selectCategory(value);
    else
        openSelectedItem(type);
    

    searchBox.classList.remove('shown');
}

searchButton.onclick = async () => {

    if (!searchInput.value || searchInput.value == defValue) {
        alert('enter a query');
        return;
    }

    await search(searchInput.value, true);
};


searchInput.onkeyup = async () => await search(searchInput.value);


function searchFocusOut(el) {

    if (el.value)
        return;

    el.value = defValue;
    el.style.color = 'gray';
    searchBox.classList.remove('shown');
}

function clearField(clear = true) {

    if (searchInput.value == defValue)
        return;
        
    if (clear)
        searchInput.value = '';

    searchBox.classList.remove('shown');
}
