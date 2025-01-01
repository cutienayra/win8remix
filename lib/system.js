//class that glues everything together
class System {
  #apps = [];
  #loaded = [];
  #pbr = null;
  #themes = [];
  #firstBoot = false;
  
  #userName = "";
  isDankVM = !!window.DankVM;
  get userNameRaw() {
    return this.#userName+'';
  }
  get userName() {
    return (this.#domain ? (this.#domain + '\\') : '') + this.#userName;
  }
  #userHome = "";
  get userHome() {
    return this.#userHome+'';
  }
  #domain = "";  
  get domain() {
    return this.#domain+'';
  }
  #loggedIn = false;
  drives = {
    C: {
      path: '/mnt/C',
      writable: true
    },
    Z: {
      path: '/mnt/Z',
      isNet: true
    }
  };
  ctxmenu={
    open: (opts,ev)=>{
      return new Promise((res)=>{
        var elm = div([],{position:'fixed',zIndex:'9999',top:ev.clientY+'px',left:ev.clientX+'px',background:'white'},opts.map((x,i)=>{
          let optElm = insertText(button([],{display:'block'}),x);
          optElm.addEventListener('click',()=>{
            elm.remove();
            res(i);
          });
          return optElm;
        }));
        document.body.appendChild(elm);
        elm.focus();
        elm.addEventListener('blur',()=>{
          elm.remove();
        })
      })
    }
  }
  fsPromise = {
    readdir: (d)=>{return new Promise((res,rej)=>{this.fs.readdir(d,(e,r)=>{if (e)return rej(e);res(r);})})},
    readFile: (d)=>{return new Promise((res,rej)=>{this.fs.readFile(d,(e,r)=>{if (e)return rej(e);res(r);})})},
    unlink: (d)=>{return new Promise((res,rej)=>{this.fs.unlink(d,(e)=>{if (e)return rej(e);res();})})},
    mkdir: (d)=>{return new Promise((res,rej)=>{this.fs.mkdir(d,(e)=>{if (e)return rej(e);res();})})},
    stat: (d)=>{return new Promise((res,rej)=>{this.fs.stat(d,(e,r)=>{if (e)return rej(e);res(r);})})},
    writeFile: (d,c)=>{return new Promise((res,rej)=>{this.fs.writeFile(d,c,(e)=>{if (e)return rej(e);res();})})},
    exists: (d)=>{return new Promise((res,rej)=>{this.fs.exists(d,(e)=>{if (!e)return res(false);res(true);})})},
    isDirectory: (file)=>{
      return new Promise((res,rej)=>{
        system.fs.readdir(file,(error,result)=>{
          if (error && error.code == 'ENOTDIR') return res(false);
          if (error) return rej(error);
          res(true);
        })
      });
    }
  };
  msgBox(message,title) {
    title = title || 'MsgBox';
    let win = new AppWindow(title,{windowType:'infoMessage'},()=>{
      win.destroy();
    });
    win.windowBody.innerText=message;
    win.windowBody.appendChild((()=>{
      let btn = insertText(button([],{display:'block'}),'OK');
      btn.addEventListener('click',()=>{
        win.destroy();
      });
      return btn;
    })());
  }
    promptBox(message,title,def) {
    return new Promise((res)=>{
      title = title || 'PromptBox';
      let win = new AppWindow(title,{windowType:'infoMessage'},()=>{
        win.destroy();
        res(false);
      });
      win.windowBody.innerText=message;
      let box;
      win.windowBody.appendChild(div([],[
        (()=>{
          box = insertType(elem('input',[],{display:'block'}),'text');
          box.value = (def || '')+'';
          return box;
        })(),
        (()=>{
          let btn = insertText(button([],{}),'OK');
          btn.addEventListener('click',()=>{
            win.destroy();
            res(box.value);
          });
          return btn;
        })(),
        (()=>{
          let btn = insertText(button([],{}),'Cancel');
          btn.addEventListener('click',()=>{
            win.destroy();
            res(false);
          });
          return btn;
        })(),
      ]));
      
    })
  }
  confirmBox(message,title) {
    return new Promise((res)=>{
      title = title || 'ConfirmBox';
      let win = new AppWindow(title,{windowType:'infoMessage'},()=>{
        win.destroy();
        res(false);
      });
      win.windowBody.innerText=message;
      win.windowBody.appendChild(div([],[
        (()=>{
          let btn = insertText(button([],{}),'Yes');
          btn.addEventListener('click',()=>{
            win.destroy();
            res(true);
          });
          return btn;
        })(),
        (()=>{
          let btn = insertText(button([],{}),'No');
          btn.addEventListener('click',()=>{
            win.destroy();
            res(false);
          });
          return btn;
        })(),
      ]));
      
    })
  }
  getUser() {
    return {name:this.#userName+'',home:this.#userHome+'',domain:this.#domain,nameWithDomain:this.#domain+this.#userName};
  }
  getLoggedIn() {
    return this.#loggedIn;
  }
  mkUserFolder(user) {
    /*await*/ this.#promiseMkdir('/mnt/C/Users/'+user);
        
    /*await*/ this.#promiseMkdir('/mnt/C/Users/'+user+'/Documents');
    /*await*/ this.#promiseMkdir('/mnt/C/Users/'+user+'/Desktop');
    /*await*/ this.#promiseMkdir('/mnt/C/Users/'+user+'/Downloads');
    /*await*/ this.#promiseMkdir('/mnt/C/Users/'+user+'/Videos');
    /*await*/ this.#promiseMkdir('/mnt/C/Users/'+user+'/Music');
    /*await*/ this.#promiseMkdir('/mnt/C/Users/'+user+'/Documents');
    /*await*/ this.#promiseMkdir('/mnt/C/Users/'+user+'/Pictures');
    /*await*/ this.#promiseMkdir('/mnt/C/Users/'+user+'/Contacts');
    /*await*/ this.#promiseMkdir('/mnt/C/Users/'+user+'/Links');
  }
  async #initFS() {
    let tmpFs = await this.#configureBfsFs("InMemory",{});
    let sysFs = await this.#configureBfsFs("InMemory",{});
    
    let cfs = await this.#configureBfsFs("IndexedDB",{storeName:'cDrive'});
    let xfs = await this.#configureBfsFs("XmlHttpRequest",{index:'/apps/file-explorer/index.json',baseUrl:'/'});
    let mfs = await this.#configureBfsFs("MountableFileSystem",{
      '/tmp': tmpFs,
      '/sys': sysFs,
      '/mnt/Z': xfs,
      '/mnt/C': cfs
    });
    BrowserFS.initialize(mfs);
    this.fs = BrowserFS.BFSRequire('fs');
    this.fs.mkdirSync('/tmp/logonui');
    this.fs.mkdirSync('/tmp/firstboot');
    this.fs.mkdirSync('/sys/apps');
    this.fs.writeFileSync('/tmp/logonui/settings.json',JSON.stringify({
      'theme.theme':'basic-2012',
      'theme.wallpaper':999
    }));
    this.fs.writeFileSync('/tmp/firstboot/settings.json',JSON.stringify({
      'theme.theme':'basic-2012',
      'theme.wallpaper':999
    }))
    this.buffer = BrowserFS.BFSRequire('buffer');
    //window.require = window.require || ((el)=>BrowserFS.BFSRequire(el));
    
    if (!this._globSettingsPleaseUseNormalSettingsAndNotThis.getOpt('fs.cDrivePopulatedv3',false)) {
      try {
        this._globSettingsPleaseUseNormalSettingsAndNotThis.setOpt('fs.cDrivePopulatedv3',true);
        /*await*/ this.#promiseMkdir('/mnt/C/Program Files');
        
        /*await*/ this.#promiseMkdir('/mnt/C/Program Files/KeroGunPlayer');
        /*await*/ this.#promiseMkdir('/mnt/C/Program Files/Windows NT');
        
        /*await*/ this.#promiseMkdir('/mnt/C/Users');
        
        this.mkUserFolder(this.isDankVM ? 'DankVM' : "User");
        
        /*await*/ this.#promiseMkdir('/mnt/C/Windows');
        
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/addins');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/appcombar');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/apppatch');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/AppReadiness');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/assembly');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/bcastdvr');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/Boot');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/Branding');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/CbsTemp');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/Containers');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/Cursors');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/debug');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/diagnostics');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/DiagTrack');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/DigitalLocker');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/Downloaded Program Files');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/Fonts');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/Globalization');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/Help');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/IdentityCRL');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/IME');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/INF');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/InputMethod');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/Java');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/L2Schemas');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/LiveKernelReports');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/Logs');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/Media');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/Migration');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/Minidump');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/ModemLogs');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/OCR');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/Offline Web Pages');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/panther');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/Preformance');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/PLA');
        /*await*/ this.#promiseMkdir('/mnt/C/Windows/PolicyDefinitions');
        
      } catch (e) {
        this.log.warn(e)
      }
    }
  }
  constructor(apps,experimentalApps,themes2Load) {
    this.#doInit(apps,experimentalApps,themes2Load);
  }
  __initMgCh(registration) {
    this.__mgCh = new MessageChannel();
    system.__mgCh.port1.onmessage=()=>{}; // ???
    this.__mgCh.port1.addEventListener('message',async (msg)=>{
      if (typeof msg?.data == 'object' && msg.data?.ping) {
        this.__mgCh.port1.postMessage({pong:true});
      }
      if (typeof msg?.data == 'object' && msg.data?.reconnect) {
        this.__initMgCh(registration);
        registration.active.postMessage({init:true},[this.__mgCh.port2]);
      }
      if (typeof msg?.data == 'object' && typeof msg.data?.getPath == 'string') {
        try {
          if (await this.fsPromise.exists(msg.data?.getPath)) {
            if (await this.fsPromise.isDirectory(msg.data?.getPath)) {
              this.__mgCh.port1.postMessage({id:msg.data.ix,fName:msg.data.getPath,result:{error: 'Directory listing is not yet implemented.',eid:'EISDIR'}});
              return;
            }
            const result = await this.fsPromise.readFile(msg.data?.getPath);
            this.__mgCh.port1.postMessage({id:msg.data.ix,fName:msg.data.getPath,result});
          } else {
            this.__mgCh.port1.postMessage({id:msg.data.ix,fName:msg.data.getPath,result:{error: 'Not found',eid:'ENOENT'}});
          }
        } catch (e) {
          this.log.warn('Remote error',e,e.stack);
          this.__mgCh.port1.postMessage({id:msg.data.ix,fName:msg.data.getPath,result:{error: 'Error while getting the file: '+e}});
        }
      }
      })
  }
  async #doInit(apps,experimentalApps,themes2Load) {
    this.log = new Logger();
    this.#pbr = elem('progress',[],{position:'fixed',zIndex:'999999999',top:'50%',left:'50%',transform:'translate(-50%,-50%)'},[]);
    document.body.appendChild(this.#pbr);
    window.addEventListener('error',(error)=>{
      this.log.error('Uncaught error: '+error?.message);
    })
    this._globSettingsPleaseUseNormalSettingsAndNotThis = new SystemSettings(this,window.localStorage,'-global');
    let gsett = this._globSettingsPleaseUseNormalSettingsAndNotThis;
    if ((!gsett.getOpt('auth.systemSetUp',false)) && gsett.getOpt('experiments.firstboot',false)){
      this.#userName = 'FirstBoot';
      this.#userHome = '/tmp/firstboot';
      this.#firstBoot = true;
    } else {
    if (!gsett.getOpt('auth.userInfo',false)) {
      gsett.setOpt('auth.userInfo',{User:{name:'User',home:'/mnt/C/Users/User',domain:''}});
    }
    if (gsett.getOpt('auth.logOut',false)) {
      this.#userName = 'LogonUI';
      this.#userHome = '/tmp/logonui';
    } else if(gsett.getOptProp('auth.userInfo',gsett.getOpt('auth.user',null),null)) {
      let uo = gsett.getOptProp('auth.userInfo',gsett.getOpt('auth.user',{name:'User',home:'/mnt/C/Users/User',domain:''}));
      this.#userName = uo.name;
      this.#userHome = uo.home;
      this.#loggedIn = true;
    } else {
      this.#userName = 'User';
      this.#userHome = '/mnt/C/Users/User';
      this.#loggedIn = true;
    }}
    try{await this.#initFS();}catch(e){
      this.log.error("FATAL: Failed to init FS",e,e?.stack);
      alert("FATAL: Failed to init FS:"+e+(e.stack ? ('\n'+e.stack) : '')+'\nPlease make sure you are using the latest version of your browser.')
      return;
    }
    this.settings = new SystemSettings(this,window.localStorage,'',this.#userHome);
    await this.settings.doActualInit(this,window.localStorage,'',this.#userHome);
    if (this.settings.getOpt('experiments.workerfs',false)) {
      try {
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.register("/worker.js", {
            scope: "/",
          });
          this.__svReg = registration;
          this.__initMgCh(registration);
          navigator.serviceWorker.ready.then(x=>{
            registration.active.postMessage({init:true},[this.__mgCh.port2]);
          })
        }
      } catch (e) {
        this.log.warn('Service worker failed to register, WorkerFS will be unavailable.',e,e.stack);
      }
    }
    //if (this.settings.getOpt('experiments.scaffolding',false)) {
    this.scaffolding = new Scaffolding();
    //}
    this.theming = new ThemeManager(this.settings,this.log);
    try {
      this.startmenu = new StartMenu(this.settings,this.log);
    } 
    catch (e) {
      this.log.warn(e);
      this.startmenu={open:()=>alert('The Start Menu could not load at the moment due to a error, for more details, please go into the Console!\n\nThanks!'),close:()=>{}}
    }
    this.apps = new AppsManager(this.startmenu);
    
    //let olds = {};
    /*let toPatch = ['querySelector','querySelectorAll','getElementById'];
    toPatch.forEach(x=>{
      //olds[x] = document[x];
      let old = document[x];
      document[x]=(...args)=>{
        this.log.warn("Using global "+x+" is deprecated and may be removed. Please use local variables to ensure concurrency.")
        return old(...args);
      }
    })*/
    if (this.#loggedIn) {
      try {
        this.opener = new FileOpener(this.log,this.settings);
      } catch (e) {
        this.log.warn(this.log.niceError(e))
      }
      this.topbar = new Topbar(this.settings,this.log,this.startmenu);
      this.taskbar = {
        registerApp: (ao,op)=>{
          if (typeof op != 'object') op = {};
          system.log.warn(`[${ao.appName || op.name || 'Unknown App'}] Registering apps to the taskbar is deprecated, please use system.startmenu.registerApp instead.`)
          op.category = op.category || 'sys';
          system.startmenu.registerApp(ao,op);
        }
      }
    } else {
      this.topbar = {elem:document.createElement('bar'),updateSettings:()=>{}};
    }
    if (this.settings.getOpt('experiments.exec',false)) {
      try {
        this.exec = new ExecutableHandler(this.opener);
      } catch(e) {
        this.log.warn('exec failed to load',e);
      }
    }
    //this.taskbar = new Taskbar();
    //this.taskbar.updateSettings(this.settings);
    this.shutdown = new ShutdownDialog(this.settings,!!this.#loggedIn);
    if (location.hostname != 'win8remix.mywire.org') this.#bestExp();
    if (location.hostname === 'e382a71a-f01c-4dc5-a4d2-d7d9e9b24d59.id.repl.co') this.#bestExpB();
    if (location.hostname === 'win8.cdh8uisthebest.info') this.#bestExpB();
    let oldLst = window.localStorage;
    /*delete window.localStorage;
    window.localStorage = {
      getItem:(itm)=>{
        if (itm == '__test__') return oldLst.getItem(itm);
        return oldLst.getItem('browserfs-'+itm);
      },
      setItem:(itm,val)=>{
        return oldLst.setItem('browserfs-'+itm,val);
      },
      removeItem:(itm)=>{
        return oldLst.removeItem('browserfs-'+itm);
      }
    }*/
    
    if (this.#loggedIn && (!system.settings.getOpt('system.noLoadDefaultApps',false))) {
      apps.forEach(x=>{
        this.loadApplication(x);
      });
      experimentalApps.forEach(x=>{
        if (this.settings.getOpt('experiments.app-'+x,false)) this.loadApplication(x);
      });
      
    } else {
      if (!this.#firstBoot) {
        let scr = document.createElement('script');
        scr.src ='lib/logonui.js';
        scr.addEventListener('load',()=>{
          this.#pbr.style.display='none';
        })
        document.head.appendChild(scr);
      } else {
        this.#pbr.style.display='none';
        this.fboot = new FirstBoot();
        /*this.loadApplication('msoobe')
          .then(x=>{new MsoobeApp()})
          .catch(async x=>{console.error(x);
            let v = await this.confirmBox('OOBE failed to load, check console. Disable OOBE?');
            if(v){
              system._globSettingsPleaseUseNormalSettingsAndNotThis.delOpt('experiments.firstboot');system.shutdown.reboot();
            } else {system.shutdown.reboot()}
          });*/
      };
    }
    if (!system.settings.getOpt('system.noLoadThemes',false)) {
      themes2Load.forEach((th)=>{
        this.loadTheme(th);
      })
      
    }
    
  }
  #promiseMkdir(dir) {
    //return new Promise((res,rej)=>{
    this.fs.mkdir(dir,(error)=>{
      //if (error) return rej(error);
      //res(true);
    })
      
    //})
  }
  #configureBfsFs(type,arg) {
    return new Promise((res,rej)=>{
        BrowserFS.FileSystem[type].Create(arg, function(e,fs) {
        if (e) return rej(e);
        res(fs);
      });
      
    });
  }
  #bestExp() {
    let buildINnfo = document.querySelector('.nte');
    buildINnfo.innerHTML=`Please use <a href="https://win8remix.mywire.org" style="color:white;">win8remix.mywire.org</a> for the best experience!`;
  }
  #bestExpB() {
    let buildINnfo = document.querySelector('.nte');
    buildINnfo.innerHTML=``;
  }
  #appsegg = {};
  #fin = [];
  #uPbr() {
    if ((this.#pbr.value +1) > this.#pbr.max) {
      this.#pbr.style.display='none'
    } else {
      this.#pbr.style.display=''
    }
  }
  adtScript(path,exp) {
    return new Promise((res,rej)=>{
     if (window[exp]) return res(window[exp]);
     var s;
     if (s = document.getElementById('adtscript-'+exp)) {
       s.addEventListener('load',()=>{
         res(window[exp]);
       })
     } else {
       s = document.createElement('script');
       s.id = 'adtscript-'+exp;
       s.src = path;
       s.addEventListener('load',()=>{
         res(window[exp]);
       })
       document.head.appendChild(s);
     }
    })
  }
  app(fn,id,adt) {
    if (!this.#apps.includes(id)) return;
    this.#appsegg[id]=fn;
    if (Object.keys(this.#appsegg).length < this.#apps.length) {
      return
    }
    this.#apps.forEach(x=>{
      if (this.#fin.includes(x)) return; // only load apps once
      this.#fin.push(x);
      this.#pbr.value= this.#fin.length;
      this.#uPbr();
      try {
        this.#appsegg[x]();
      } catch (e) {
        this.log.warn('Application',x,'failed to load!',e+e.stack);
      }
      
    });
    //fn(); //maybe something in the future?
  }
  
  loadApplication(appname) {
    return new Promise((res,rej)=>{
    this.#apps.push(appname);
    this.#pbr.max = this.#apps.length;
    this.#uPbr();
    this.log.info("Starting app",appname,'...');
    var script = document.createElement('script');
    script.src = 'apps/'+appname+'/'+appname+'.js';
    script.addEventListener('load',()=>{this.log.info("App",appname,"loaded!");this.#loaded.push(appname);
    setTimeout(()=>{
      if (!this.#appsegg[appname]) {
        this.app(()=>{
          system.log.warn(appname,'failed to load!');rej();
        },appname);
      } else {res();}
    },1)
    })
    /*script.addEventListener('error',()=>{
      //if (this.#loaded.includes(appname)) return;
      this.app(()=>{/*noop*///},appname);
    //})
    document.head.appendChild(script);
    });
  }

  loadTheme(themename) {
    this.log.info("Loading theme",themename,'...');
    var style = document.createElement('link');
    style.rel='stylesheet';
    style.href = 'th/'+themename+'/'+themename+'.css';
    style.addEventListener('load',()=>{
      this.log.info("Theme",themename,"loaded!");//this.#loaded.push(themename);
    })
    document.head.appendChild(style);
  }
  
  #winPosX = 0;
  #winPosY = 0;
  newWindowPos() {
    this.#winPosX += 10;
    this.#winPosY += 10;
    
    if (this.#winPosX > 500) {
      this.#winPosX = 10;
    }
    
    if (this.#winPosY > 500) {
      this.#winPosY = 10;
    }
    
    return [this.#winPosX+40,this.#winPosY+50];
  }
}

document.addEventListener("contextmenu", function (e){
    e.preventDefault();
}, false);
