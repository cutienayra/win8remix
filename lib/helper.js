function createUtility(elemName) {
  return (classes,style,children) => {
    var d = document.createElement(elemName);
    if (classes && classes instanceof Array) classes.forEach(x=>d.classList.add(x));
    if (classes && typeof classes == 'string') d.classList.add(classes);
    if (style && typeof style == 'object') Object.keys(style).forEach(x=>d.style[x]=style[x]);
    if (children && children instanceof Array) children.forEach(x=>d.appendChild(x));
    if (style && style instanceof Array) style.forEach(x=>d.appendChild(x));
    return d;
  }
}
/*
function -div(classes,style,children) {
  var d = document.createElement('div');
  classes.forEach(x=>d.classList.add(x))
  Object.keys(style).forEach(x=>d.style[x]=style[x]);
  children.forEach(x=>d.appendChild(x));
  return d;
}
function -table(classes,style,children) {
  var d = document.createElement('table');
  classes.forEach(x=>d.classList.add(x))
  Object.keys(style).forEach(x=>d.style[x]=style[x]);
  children.forEach(x=>d.appendChild(x));
  return d;
}
function -tbody(classes,style,children) {
  var d = document.createElement('tbody');
  classes.forEach(x=>d.classList.add(x))
  Object.keys(style).forEach(x=>d.style[x]=style[x]);
  children.forEach(x=>d.appendChild(x));
  return d;
}
function -tr(classes,style,children) {
  var d = document.createElement('tr');
  classes.forEach(x=>d.classList.add(x))
  Object.keys(style).forEach(x=>d.style[x]=style[x]);
  children.forEach(x=>d.appendChild(x));
  return d;
}
function td(classes,style,children) {
  var d = document.createElement('td');
  classes.forEach(x=>d.classList.add(x))
  Object.keys(style).forEach(x=>d.style[x]=style[x]);
  children.forEach(x=>d.appendChild(x));
  return d;
}
function button(classes,style,children) {
  var d = document.createElement('button');
  classes.forEach(x=>d.classList.add(x))
  Object.keys(style).forEach(x=>d.style[x]=style[x]);
  children.forEach(x=>d.appendChild(x));
  return d;
}
function span(classes,style,children) {
  var d = document.createElement('span');
  classes.forEach(x=>d.classList.add(x))
  Object.keys(style).forEach(x=>d.style[x]=style[x]);
  children.forEach(x=>d.appendChild(x));
  return d;
}*/
const div=createUtility('div'),
  span=createUtility('span'),
  table=createUtility('table'),
  tbody=createUtility('tbody'),
  tr=createUtility('tr'),
  td=createUtility('td'),
  button=createUtility('button'),
  p = createUtility('p'),
  h1 = createUtility('h1'),
  h2 = createUtility('h2'),
  h3 = createUtility('h3'),
  h4 = createUtility('h4'),
  h5 = createUtility('h5'),
  h6 = createUtility('h6');

function elem(type,classes,style,children) {
    var d = document.createElement(type);
    if (classes && classes instanceof Array) classes.forEach(x=>d.classList.add(x));
    if (classes && typeof classes == 'string') d.classList.add(classes);
    if (style && typeof style == 'object') Object.keys(style).forEach(x=>d.style[x]=style[x]);
    if (children && children instanceof Array) children.forEach(x=>d.appendChild(x));
    if (style && style instanceof Array) style.forEach(x=>d.appendChild(x));
    return d;
}
function createSetterUtility(attrib) {
  return (elem,text) => {
    elem[attrib]=text;
    return elem;
  }
}
/*
function insertText(elem,text) {
  elem.innerText=text;
  return elem;
}
function insertTitle(elem,text) {
  elem.title=text;
  return elem;
}
function insertType(elem,text) {
  elem.type=text;
  return elem;
}
function insertSrc(elem,text) {
  elem.src=text;
  return elem;
}
function insertIdPlsDontQuerySelectorThis(elem,text) {
  elem.id=text;
  return elem;
}
*/
var insertText = createSetterUtility('innerText'),
  insertTitle = createSetterUtility('title'),
  insertType = createSetterUtility('type'),
  insertSrc = createSetterUtility('src'),
  insertIdPlsDontQuerySelectorThis = createSetterUtility('id');
function insertAttr(elem,key,value) {
  elem.setAttribute(key,value);
  return elem;
}
function insertDisabled(elem,value) {
  elem.disabled=!!value;
  return elem;
}

var auto = 'auto',fixed='fixed',absolute='absolute';

function stack(skip) {
  if (typeof skip != "number" || skip < 1) {skip=0;}
  try {
    throw new Error();
  } catch(e) {
    return e.stack.split('\n').slice(1+skip).join('\n');
  }
}