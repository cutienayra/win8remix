class FXNew extends Application {
  //Application configuration
  static appName = 'File Explorer (New)';
  static icon = '/apps/file-explorer/icon.png';
  static appCategory = 'tea';
  static appId = 'file-explorer-new';
  windowOptions = {};
  //End application configuration
  #bar = null;
  #container = null;
  #driveLet = '?';
  #entryPath = '/';
  #relativePath = '';
  constructor(arg0,args,launch) {
    super();
    this.windowOptions = {resize:true,resizeMod:(_,height)=>{
      this.#container.style.height=(height-this.#bar.getBoundingClientRect().height)+'px';
    }};
    this.__init();
    const buttonStyle = {fontSize:'24pt',borderRadius:'150px',width:'50px',height:'50px',background:'lightblue',border:'gray 1px solid',marginRight:'5px'};
    const cls = 'c'+Math.floor(Math.random()*50000).toString(36);
    this.window.windowBody.appendChild(elem('style')).innerHTML=`.${cls}:focus{background:#74929b!important}.${cls}:hover{background:#8bb2bd!important}`;
    this.#bar=div([],{},[
      insertText(button([cls],buttonStyle),'<'),
      insertText(button([cls],buttonStyle),'>'),
    ]);
    this.window.windowBody.appendChild(this.#bar);
    this.#container=div([],{overflowY:'scroll'});
    this.#container.addEventListener('contextmenu',async (ev)=>{
      if (ev.target != this.#container && ev.target.parentElement != this.#container) return;
      let sel = await system.ctxmenu.open(['New Folder','New File','Upload File'],ev);
      if (sel == undefined) return;
      if (sel == 1) {
        system.promptBox('Enter new file name:','File Explorer','Untitled.txt').then(async val=>{
          if (!val) return;
          try {
            const fp = (this.#entryPath.endsWith('/') ? this.#entryPath : (this.#entryPath + '/')) + this.#relativePath;
            await system.fsPromise.writeFile(fp+val,'');
            this.#navigate();
          } catch (e) {
            system.log.warn('File Creation failed',e,e.stack);
            system.msgBox('Error while creating file: '+e, 'Error - File Explorer');
          }
        })
      }
      if (sel == 2) {
        let box = insertType(elem('input'),'file');
        box.addEventListener('change',()=>{
          if (box.files[0]) {
            var fr = new FileReader();
            fr.addEventListener('load',async ()=>{
              const fp = (this.#entryPath.endsWith('/') ? this.#entryPath : (this.#entryPath + '/')) + this.#relativePath;
              var buf = system.buffer.Buffer.from(fr.result);
              await system.fsPromise.writeFile(fp+box.files[0].name,buf);
              this.#navigate();
            })
            fr.readAsArrayBuffer(box.files[0]);
          }
        })
        box.click();
      }
    })
    this.window.windowBody.appendChild(this.#container);
    if (args[0] == 'viewDir' && typeof args[1] == 'string') {
      this.#driveLet='?';
      this.#entryPath='/';
      let p = args[1];
      if (p.startsWith('/')) p = p.replace('/','');
      this.relativePath = p;
      this.#navigate();
    } else {
      this.#homeScreen();
    }
  }
  #homeScreen() {
    this.window.setTitle('File Explorer');
    this.#container.innerHTML='';
    this.#container.appendChild(div([],[
      ...Object.keys(system.drives).map(drv=>{
        let elm = insertText(button(),drv+':');
        elm.addEventListener('click',()=>{
          this.#driveLet = drv;
          this.#entryPath = system.drives[drv].path;
          this.#relativePath = '';
          this.#navigate();
        })
        
        return elm;
      }),
      (()=>{
        let elm = insertText(button(),'Z: (Git)');
        elm.addEventListener('click',()=>{
          this.#container.innerHTML='<iframe src="https://gitea.usernamee.duckdns.org/win8remix/win8remix" style="width:100%;height:100%;border:none"></iframe>'
        })
        
        return elm;
      })()
    ]))
  }

  async #navigate() {
    const fp = (this.#entryPath.endsWith('/') ? this.#entryPath : (this.#entryPath + '/')) + this.#relativePath;
    this.window.setTitle('File Explorer - '+ this.#driveLet + ':\\'+this.#relativePath.replace(/\//g,'\\'));
    let list,dir=[],file=[];
    this.#container.innerHTML='Loading...';
    try {
      list = await system.fsPromise.readdir(fp);
    } catch (e) {
      this.#container.innerText="Error while trying to get files: "+e;
      system.log.warn('File explorer error in readdir',...system.log.niceError(e));
      return;
    }
    for (let item of list) {
        try {
          if (await system.fsPromise.isDirectory(fp+item)) {
            dir.push(item);
          } else {
            file.push(item);
          }
        } catch (err) {
          system.log.warn('fxnew.navigate failed to find type',...system.log.niceError(err));
        }
    }
    this.#container.innerHTML='';
    this.#container.appendChild(div([],{},[
      (()=>{
        let elm = insertText(button([],{display:'block'}),'..');
        elm.addEventListener('click',()=>{
          if (this.#relativePath == '/' || this.#relativePath == '') {
            this.#homeScreen();
            return;
          }
          let rpSplit = this.#relativePath.split('/').filter(x=>x);
          rpSplit.pop();
          this.#relativePath = rpSplit.join('/');
          if (!this.#relativePath.endsWith('/')) this.#relativePath += '/';
          if (this.#relativePath == '/') this.#relativePath='';
          this.#navigate();
        })
        return elm;
      })(),
      ...dir.map(x=>{
        let elm = insertText(elem('a',['folder','dir','fndir'],{display:'block'}),x);
        elm.addEventListener('click',()=>{
          this.#relativePath += x;
          if (!this.#relativePath.endsWith('/')) this.#relativePath += '/'
          this.#navigate();
        })
        return elm;
      }),
      ...file.map(x=>{
        let elm = insertText(elem('a',[system.opener.getType(x),'dir','fndir'],{display:'block'}),x);
        elm.addEventListener('contextmenu',async (ev)=>{
          let sel = await system.ctxmenu.open(['Open','Rename','Delete','Download'],ev);
          if (sel == undefined) return;
          if (sel == 0) elm.click();
          if (sel == 2) {
            if (await system.confirmBox('Are you sure you want to delete "'+x+'"?')) {
              await system.fsPromise.unlink(fp+x);
              this.#navigate();
            }
          }
          if (sel == 3) {
            let toDl = fp + x;
            let content = await system.fsPromise.readFile(toDl);
            let anc = document.createElement('a');
            anc.href='data:application/octet-stream;base64,'+content.toString('base64');
            anc.download=x;
            anc.click();
          }
        })
        elm.addEventListener('click',()=>{
          let toOpen = fp + x;
          system.opener.open(toOpen);
        })
        return elm;
      })
    ]))
    
  }
}
window.FXNew = FXNew;
function viewDirectory(path) {
  new FXNew('',['viewDir',path]);
}
system.app(()=>{
  system.apps.register(FXNew);
},'file-explorer-new');