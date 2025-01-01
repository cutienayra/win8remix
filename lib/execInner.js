console.log('hello from execInner');
top.postMessage({type:'hello'},org);
const pen = {};
window.addEventListener('message',(m)=>{
  if (m.source != top) return;
  if (m.data.type == 'fileResult') {
    if (pen[m.data.id]) {
      pen[m.data.id](m.data.data);
    }
  }
  if (m.data.type == 'fileError') {
    if (pen[m.data.id]) {
      pen[m.data.id](null,new Error('An error ocurred while reading the file!'));
    }
  }
  
})
var pn = 0,pni = 0;
function getFile(file) {
  return new Promise((res,rej)=>{
    let p = performance.now();
    if (p == pn) {p+= pni++} else {pn=p;pni=0};
    pen[p] = (d,e)=>{
      delete pen[p];
      if (e) return rej(e);
      res(d);
    }
    top.postMessage({type:'getFile',file,id:p},org);
  })
}
async function loadScript(path) {
  let isEnp = false;
  const dec = new TextDecoder();
  const contentR = await getFile(path);
  const content = dec.decode(contentR);
  const r = 'data:application/javascript;base64,'+btoa(isEnp ? `class BundledApp extends Application{${content}}` : content);
  const s = document.createElement('script');
  
}
let awInit = false;
class AppWindow {
  constructor(name,options,onClose) {
    if (!options?.__baInframeWindow || awInit) {
      throw new Error('Creating multiple windows is not supported (yet).');
    }
    awInit = true;
    this.windowBody = document.createElement('div');
    document.body.appendChild(this.windowBody);
  }
}
class Application {
  constructor() {
    
  }
  __init(arg0,args,launchType) {
    if (!(launchType?.type == 'fromSys')) {
      throw new Error('Running multiple applications is not supported (yet).');
    }
  }
}
let baInit = false;
window.system = {
  initBundledApp: (app)=>{
    if (baInit) throw new Error('You can only init once.');
    baInit = true;
    var i = new app('',[],{type:'fromSys'});
  }
}
window.__getFile = (...a)=>getFile(...a);
