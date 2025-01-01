class MonacoApp extends Application {
  //Application configuration
  static appName = 'Monaco';
  static icon = '/apps/monaco/icon.png';
  static appCategory = 'acc';
  static appId = 'monaco';
  windowOptions = {resize:true,height:window.innerHeight*.6,width:window.innerWidth*.7,shadow:true};
  //End application configuration
  #shadow = null;
  #container = null;
  #editor = null;
  #file = '';
  #model = null;
  async #init() {
    if (window.require) {
      this.#doApp();
    } else {
      try {
        await this.#script();
        try {
          require.config({ paths: { vs: '/lib/vendor/monaco/package/min/vs' } });
          require(['vs/editor/editor.main'],  ()=>{
          this.#doApp();
          });
          
        } catch (err) {
          system.log.warn("Monaco error during loading",err,err.stack||'');
          this.window.windowBody.innerHTML="Error loading! Please check Event Viewer"
        }
      } catch (err) {
        system.log.warn("Monaco failed to load",err,err.stack||'');
        this.window.windowBody.innerHTML="Error loading! Please check Event Viewer"
      }
    }
  }
  #script() {
    return new Promise((res,rej)=>{
      let scr = document.createElement('script');
      scr.src="/lib/vendor/monaco/package/min/vs/loader.js";
      scr.addEventListener('load',()=>res());
      scr.addEventListener('error',(e)=>rej(e));
      document.head.appendChild(scr);
      
    })
  }
  #promiseReadFile(file,enc) {
    return new Promise((res,rej)=>{
      system.fs.readFile(file,(err,data)=>{
        if (err) return rej(err);
        res(data);
      })
    })
  }
  async #doApp() {
    this.window.windowBody.innerHTML='';
    //this.#shadow = this.window.windowBody.attachShadow({mode:'closed'});
    //this.#container = this.#shadow.appendChild(elem('div',[],{},[]));
    let content = '', type = undefined;
    if (this.#file) {
      try {
        let read = await this.#promiseReadFile(this.#file);
        content = read+'';
        
        /*con sole.log(content);
             if (this.#file.toLowerCase().endsWith('.js'))  type = 'javascript'
        else if (this.#file.toLowerCase().endsWith('.ts'))  type = 'typescript'
        else if (this.#file.toLowerCase().endsWith('html')) type = 'html'*/
        let gm = monaco.editor.getModel(monaco.Uri.parse('fs://'+this.#file));
        if (gm) {
          this.#model = gm;
          this.#model.setValue(content); // update the model
        } else {
          this.#model = monaco.editor.createModel(content,undefined,monaco.Uri.parse('fs://'+this.#file));  
          
        }
        
      } catch (e) {
        content = 'Failed to load file! Please check event viewer for the error!';
        this.#model = monaco.editor.createModel(content);
        system.log.warn('Monaco fs error',e,e?.stack);
      }
    } else {
       this.#model = monaco.editor.createModel('');
    }
    let target = div([],{width:'100%',height:'100%',position:'absolute',overflow:'hidden'});
    //let stl = elem('link');
    //stl.rel='stylesheet';
    //stl.href='lib/vendor/monaco/package/min/vs/editor/editor.main.css';
    // Copy over editor styles
    if (this.windowOptions.shadow) {
  		const styles = document.querySelectorAll(
  			"link[rel='stylesheet'][data-name^='vs/']"
  		);
  		for (const style of styles) {
  			this.window.windowBody.appendChild(style.cloneNode(true));
  		}
    }
    //if (this.windowOptions.shadow) this.window.windowBody.appendChild(stl);
    this.#editor = window.bruh12 = monaco.editor.create(target,{
      //value: content+'',
      model:this.#model,
      theme: system.settings.getOpt('vscode.lightTheme',false) ? undefined : 'vs-dark',
      automaticLayout: true,
      
      //language:type
    },{
      openerService:{
        open: (uri,...opt)=>{
          debugger;
          console.trace(uri,...opt);
        }
      }
    });
    if (this.windowOptions.shadow) {
  		const styles = document.querySelectorAll(
  			"style.monaco-colors"
  		);
  		for (const style of styles) {
  			this.window.windowBody.appendChild(style.cloneNode(true));
  		}
    }
    this.window.windowBody.appendChild(target);
    
    this.#file && this.#editor.addAction({
    	// An unique identifier of the contributed action.
    	id: "w8r-monaco-reload",
    
    	// A label of the action that will be presented to the user.
    	label: "Reload file",
    
    	// An optional array of keybindings for the action.
    	keybindings: [
    		monaco.KeyMod.chord(
    			monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
    			monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR
    		),
    	],
    
    	// A precondition for this action.
    	precondition: null,
    
    	// A rule to evaluate on top of the precondition in order to dispatch the keybindings.
    	keybindingContext: null,
    
    	contextMenuGroupId: "9_cutcopypaste",
    
    	contextMenuOrder: 2.5,
    
    	// Method that will be executed when the action is triggered.
    	// @param editor The editor instance is passed in as a convenience
    	run: async (ed) => {
        let read = await this.#promiseReadFile(this.#file);
        let content = read+'';
        ed.setValue(content);
    		//alert("i'm running => " + ed.getPosition());
    	},
    });
    let writing = false,wTo = null;
    if (this.#file && Object.keys(system.drives).find(D=>this.#file.startsWith(system.drives[D].path) && system.drives[D].writable)) {
      this.#editor.getModel().onDidChangeContent(async ()=>{
        //if (writing) {
        if (wTo) clearTimeout(wTo);
        wTo = setTimeout(async ()=>{
          console.log('wto',Date.now());
          wTo = null;
          try {
            await system.fsPromise.writeFile(this.#file,this.#editor.getValue());
          } catch (e) {
            system.log.warn('Write fail',e,e?.stack);
          }
        },500);
        //return
        //}
        /*writing = true;
        try {
          await system.fsPromise.writeFile(this.#file,this.#editor.getValue());
        } catch (e) {
          system.log.warn('Write fail',e,e?.stack);
        }
        writing = false;*/
      })
    }
  }
  onClose() {
    this.destroyWindows();
    //try{if (this.#model) this.#model.dispose()}catch{}
    try{if (this.#editor) this.#editor.dispose()}catch{}
    
  }
  constructor(arg0,args,launchType) {
    super();
    this.__init(arg0,args,launchType);
    if (typeof args[0] == 'string') this.#file=args[0]+'';
    this.window.windowBody.innerHTML='Loading...';
    this.#init();
  }
}
function editTextFile(file) {
    var inst = new MonacoApp('',[file]);
}
system.app(()=>{
  system.apps.register(MonacoApp);
},'monaco');
if (system.opener) {
  system.opener.registerMulti(['txt','html','css','js','ts','json','py','sol','htm','vbs','bat','md','nix','sh','ini','yaml'],(f)=>editTextFile(f));
}