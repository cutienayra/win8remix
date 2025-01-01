//DOOM: system.fs.writeFileSync('/tmp/doom.dos',system.buffer.Buffer.from(await emulatorsUi.network.resolveBundle('https://cdn.dos.zone/custom/dos/doom.jsdos')));
//MK: system.fs.writeFileSync('/tmp/mk.dos',system.buffer.Buffer.from(await emulatorsUi.network.resolveBundle('https://cdn.dos.zone/original/2X/8/872f3668c36085d0b1ace46872145285364ee628.jsdos')));
class DOSBox extends Application {
  //Application configuration
  static appName = 'DOSBox';
  static icon = '/apps/dosbox/icon.png';
  static appCategory = 'acc';
  static appId = 'dosbox';
  windowOptions = {resize:false,"actually obey the resize:false option, ignore the experiment": true, width:'640px'};
  //End application configuration
  #scripts = 0;
  #ci = null;
  #cvs = null;
  
  constructor(arg0,args,launchType) {
    super();
    this.__init(arg0,args,launchType);
    let file;
    args[0]
    if (typeof args[0] == 'string') {
      file = args[0];
    } else {
      this.window.windowBody.innerHTML='<div style="height:400px;background:black;color:white;font-family:cp437, monospace;">No file specified!<br>Tip: check the Z:\\apps\\dosbox\\games folder for some games!</div>'
      return;
    }
    this.window.windowBody.innerHTML='<div style="height:400px;background:black;color:white;font-family:cp437, monospace;">Loading, please wait... (1/2)</div>'
    if (!document.querySelector('#js-dos-script')) {//global queryselector is fine here, this won't break concurrency
      var script = document.createElement('script');
      script.src='https://js-dos.com/v7/build/releases/latest/emulators/emulators.js';
      script.id='js-dos-script';
      document.head.appendChild(script);
      script.addEventListener('load',()=>{
        this.#scripts++;
        if ((this.#scripts+1) > 2) this.#init(file); //init only when both script loaded
      })
      var script2 = document.createElement('script');
      script2.src='https://js-dos.com/v7/build/releases/latest/emulators-ui/emulators-ui.js';
      script2.id='js-dos-script2';
      document.head.appendChild(script2);
      script2.addEventListener('load',()=>{
        this.#scripts++;
        if ((this.#scripts+1) > 2) this.#init(file); //init only when both script loaded
      })
      
    } else {
      this.#init(file);
    }
  }
  onClose() {
    this.destroyWindows();
    if (this.#ci)      this.#ci.exit();
    if (this.keyDownH) window.removeEventListener('keydown', this.keyDownH);
    if (this.keyUpH)   window.removeEventListener('keyup',   this.keyUpH);
  }
  #promiseReadFile(file) {
    return new Promise((res,rej)=>{
      system.fs.readFile(file,(err,dat)=>{
        if (err) return rej(err);
        res(dat);
      })
    })
  }
  async #init(file) {
    this.window.windowBody.innerHTML='<div style="height:400px;background:black;color:white;font-family:cp437, monospace;">Loading, please wait... (2/2)</div>'
    emulators.pathPrefix = "https://js-dos.com/v7/build/releases/latest/emulators/";
    if (!window.Dos) {
      alert('Something went wrong!');
      this.destroy();
    }
    /*var e = document.createElement('link');
    e.rel='stylesheet';
    e.href='https://js-dos.com/v7/build/releases/latest/js-dos/js-dos.css';
    this.window.windowBody.parentElement.appendChild(e);
    this.dos = Dos(this.window.windowBody).run('https://cdn.dos.zone/original/2X/9/9ed7eb9c2c441f56656692ed4dc7ab28f58503ce.jsdos');*/
    //const bundle = await emulatorsUi.network.resolveBundle(/*"https://cdn.dos.zone/original/2X/9/9ed7eb9c2c441f56656692ed4dc7ab28f58503ce.jsdos"'https://cdn.dos.zone/custom/dos/doom.jsdos'*/);
    let bundle;
    try {
      bundle = await system.fsPromise.readFile(file);
    } catch (e) {
      this.window.windowBody.innerHTML='<div style="height:400px;background:black;color:white;font-family:cp437, monospace;">An error ocurred while reading file. Please check Event Viewer for the error.</div>';
      system.log.warn(e);
      return;
    }
    this.#ci =  await emulators.dosboxDirect(bundle);
    let ci = this.#ci;
    this.#cvs  = document.createElement('canvas');
    let cvs = this.#cvs;
    this.window.windowBody.innerHTML =   '';
    this.window.windowBody.appendChild(cvs);
    cvs.width =  640;
    cvs.height = 400;
    
    emulatorsUi.sound.audioNode(ci); //enable sound
    this.keyDownH = (e)=>this.#keyDown(e);
    this.keyUpH   = (e)=>this.#keyUp  (e);
    window.addEventListener('keydown', this.keyDownH);
    window.addEventListener('keyup',   this.keyUpH);
    let sw = (w)=>this.window.setWidth(w);
    emulatorsUi.graphics.webGl(
      {

      width:cvs.width ,height:cvs.height,
       canvas: {
        style:{},
        getContext:(...arg)=>cvs.getContext(...arg),
        _w: cvs.width,_h:cvs.height,
       get width() {return this._w},
       get height() {return this._h},
       set width(v) {this._w =cvs.width=v;sw(v)}, 
       set height(v) {this._h=cvs.height=v},
       },addOnResize:(fn)=>{
      /*noop*/
       },
       removeOnResize:(fn)=>{}},ci);
}
  #keyUp(e) {
    if (!this.window.isActive()) return;
    e.preventDefault();
    const keyCode = emulatorsUi.controls.domToKeyCode(e.keyCode);
    this.#ci.sendKeyEvent(keyCode, false);
  }
  #keyDown(e) {
    if (!this.window.isActive()) return;
    e.preventDefault();
    const keyCode = emulatorsUi.controls.domToKeyCode(e.keyCode);
    this.#ci.sendKeyEvent(keyCode, true);
  }
}
function runDOSBox(fiel) {
  var inst = new DOSBox('',[fiel])
}
system.app(()=>{
  system.apps.register(DOSBox);
},'dosbox');
if (system.opener) {
  system.opener.register('dos',(f)=>runDOSBox(f));
}