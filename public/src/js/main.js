

document.getElementById('htmlTag').style.overflowX = 'hidden';


function showAnimation(id = '') {

  document.getElementById(id).classList.toggle('shown');
}



let xPos = 0, yPos = 0, xPosApp = 0, yPosApp = 0;

document.onmousedown = (e) => {

  xPos = window.event.clientX;
  yPos = window.event.clientY;
};


let appOpened = false;
function animateApp(params = {

  id:'',
  html:'',
  background:'white',
  onclick:'',

  width:'80%',
  height: '80%'
}) {

  if (!params.width)
    params.width = '80%';
  if (!params.height)
    params.height = '80%';


  if (appOpened)
    return;

  scrollPos = window.scrollY;
  appOpened = true;

  xPosApp = xPos;
  yPosApp = yPos;

  let div = document.createElement('div');
  div.setAttribute('id', params.id);
  div.classList.add('App');


  const css = (param = '', value = '') => div.style[param] = value;

  css('opacity',1);
  css('background',params.background);
  css('transition','all 0.4s');
  css('width',"50px");
  css('height',"50px");

  css('top', topElement = (scrollPos + yPos - 25) + 'px');
  css('left', leftElement = (xPos - 25)+ 'px');

  setTimeout(() => {

    css('width',params.width);
    css('height',params.height);
    css('top');
    css('left');
    css('background', 'white');
    setTimeout(()=>document.getElementById('waitAnimation').style.opacity = 1, 200);
  }, 15);


  let text = `
    <div id="waitAnimation" style="opacity:0; transition: all 0.3s">
    
      <div class="noSelection" style="transform: rotate(45deg) scale(1.12);font-size: 330%;margin-left: 95%; cursor: pointer;" 
        onclick="${params.onclick ? params.onclick : "closeApp('"+params.id+"')"}">+
      </div>

      ${params.html} 
      
      </div>
    `;

  div.innerHTML = text;
  document.body.appendChild(div);

}

function refreshApp(html = '') {

  let el = document.getElementById('waitAnimation');

  el.style.transition = '';
  el.style.opacity = '0';
  el.innerHTML = html;

  setTimeout(() => {
    el.style.transition = 'all 0.3s';
    el.style.opacity = '1'
  }, 10);
}

function closeApp(id = '') {


  window.scrollTo(0, scrollPos);
  document.getElementById('waitAnimation').style.opacity = 0;
  let el = document.getElementById(id);

  setTimeout(() => {
      
    el.style.width = "50px";
    el.style.height = "50px";
    el.style.top = topElement;
    el.style.left = leftElement;
    el.style.background = 'white';

    setTimeout(() => {
      el.style.opacity = 0;
      setTimeout(() =>{ deleteElement(el); appOpened = false}, 500);
    }, 100);
  }, 50);
}


function simpleApp(id = '', html = '') {

  if (document.getElementById(id))
    return;

  appOpened = true;

  let div = document.createElement('div');
  div.setAttribute('id', id);
  div.classList.add('App');

  div.innerHTML = html;

  div.style.opacity = 0;
  div.style.transition = 'all 0.25s';
  setTimeout(() => div.style.opacity = 1, 200);

  document.getElementById('fakeBody').appendChild(div);
}

function simpleClose(id = '', ms = 250) {

  let el = document.getElementById(id); 
  el.style.opacity = 0;
  setTimeout(() => deleteElement(el), ms);
  appOpened = false;
}


