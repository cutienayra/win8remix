class LogonUINew {
  #elem = null;
  #inst = null;
  #logonUser = 'User';
  constructor(inst) {
    this.#inst = inst;
    this.#newUI();
    // preload dots.gif to make it instantly show up
    let bruh = insertSrc(elem('img',[],{opacity:0,pointerEvents:'none',position:'fixed',top:'-999px'},[]),'/res/dots.gif');
    bruh.addEventListener('load',()=>bruh.remove());
    document.body.appendChild(bruh);
    inst.newUI = this;
  }
  #newUI() {
    if (this.#elem) this.#elem.remove();
    let users = Object.keys(system._globSettingsPleaseUseNormalSettingsAndNotThis.getOpt('auth.userInfo',{User:{name:'User',home:'/mnt/C/Users/User',domain:''}}));
    if (!users.length) { // no users???
      if (this.#inst) {
        this.#inst.noCancel();
        if (this.#inst.window.getIsMin()) this.#inst.window.restore();
        return;
        
      }
    }
    let btnUser,btnOther,btnShut,logonA,logonB,logonC,shutdownDialog,btnShutdown,btnReboot,userReplacable;
    this.#elem=div([],{position:'fixed',top:'0px',left:'0px',width:'100%',height:'100%'},[
      logonA = div('logon-a',{},[
        elem('d',[],[
          insertText(h1(),"User Accounts"),
          div([],{},[
            ...users.map(x=>{
            let elem = insertIdPlsDontQuerySelectorThis(button([],[
              div('icon'),
              insertText(p(),x)
            ]),'user1');
            elem.addEventListener('click',()=>{
              userReplacable.innerText=x;
                system._globSettingsPleaseUseNormalSettingsAndNotThis.setOpt('auth.logOut',false);
              system._globSettingsPleaseUseNormalSettingsAndNotThis.setOpt('auth.user',x);
              system._globSettingsPleaseUseNormalSettingsAndNotThis.setOpt('auth.domain','');
              logonA.classList.add('hide');
              logonB.classList.remove('hide');
              setTimeout(()=>location.reload(),2000);
            });
            return elem;
          }),
            btnOther = insertIdPlsDontQuerySelectorThis(button([],[
              div('add'),
              insertText(p(),'Other User')
            ]),'user1'),
          ]),
          shutdownDialog = div(['shutdown-dialog','hide'],[
            btnShutdown = button(['shut'],[
              insertText(p(),'Shut Down')
            ]),
            btnReboot = button(['rest'],[
              insertText(p(),'Reboot')
            ]),
            // btnRestart = insertIdPlsDontQuerySelectorThis(button(),'logf')
          ]),
          div(['shutdown-btns'],[
            btnShut = insertIdPlsDontQuerySelectorThis(button(),'logon-button')
          ]),
        ]),
      ]),
      logonB = div(['logon-b','hide'],{justifyContent:'center',display:'flex',marginTop:'75px'},[
        div('icon'),
        div('username',[
          userReplacable = insertText(h1(),'User'), // TODO: replace this
          insertText(p(),'Welcome')
        ])
      ]),
      logonC = div(['logon-d','hide'],{justifyContent:'center',marginTop:'75px',display:'flex'},[
        div('icon'),
        elem('d',[],[
          insertText(h1(),'Log in'),
          div('field-row')
        ])
      ])
      
    ])
    this.logonA = logonA;
    
    btnOther.addEventListener('click',()=>{
      logonA.classList.add('hide');
      //logonC.classList.remove('hide');
      if (this.#inst.window.getIsMin()) this.#inst.window.restore();
    });
    btnShut.addEventListener('click',()=>{
    shutdownDialog.classList.remove('hide');
    });
    btnShutdown.addEventListener('click',()=>{
    logonA.classList.add('hide');
    system.shutdown.shutdown();
    })
    btnReboot.addEventListener('click',()=>{
    logonA.classList.add('hide');
    system.shutdown.reboot();
    })
    document.body.appendChild(this.#elem)
  }
}
class LogonUI extends Application {
  constructor(arg0,args,launchType) {
    super("Log on",args,launchType,{noTbe:true,noClose:true,resize:false,"actually obey the resize:false option, ignore the experiment":true,width:'500px',startMinimised:true});
    //this.window.minimise();
    this.#mainUI();
    //this.#newUI()
  }
  #lbl = null;
  #lbl1 = null
  #boxUn = null;
  #boxPw = null;
  #status = null;
  #elem = null;
  #btnCancel = null;
  #noC = false;
  noCancel() {
    this.#noC = true;
    if (this.#btnCancel) this.#btnCancel.style.display='none'
  }
  
  #mainUI() {
    this.window.windowBody.innerHTML='';
    let stl,btn,btn1,btn2,lbl,lbl1;
    this.window.windowBody.appendChild(div([],{padding:'5px'},[
      stl = elem('style',[],{},[]),
      insertSrc(elem('img',[],{width:'100%'},[]),rl1),
      insertText(div([],{marginBottom:'4px'},[]),"Log in"),
      div(['field-row'],{display:'flex',alignItems:'center',marginBottom:'4px'},[
        lbl = insertText(elem('label',[],{},[]),"Username"),
        this.#boxUn = elem('input',[],{
          backgroundColor:'#fff',
          border:'1px solid #ccc',
          borderRadius: '2px',
          borderTopColor:'#8e8f8f',
          boxSizing:'border-box',
          padding:'3px 4px 5px',
          marginLeft:'6px'
        },[])
      ]),
      div(['field-row'],{display:'flex',alignItems:'center',marginBottom:'4px'},[
        lbl1 = insertText(elem('label',[],{},[]),"Password"),
        this.#boxPw = elem('input',[],{
          backgroundColor:'#fff',
          border:'1px solid #ccc',
          borderRadius: '2px',  
          borderTopColor:'#8e8f8f',
          boxSizing:'border-box',
          padding:'3px 4px 5px',
          marginLeft:'6px'
        },[])
      ]),
      this.#status = div([],{color:'red'},[]),
      btn = insertText(button([],{
        background: "linear-gradient(180deg,#eee 45%,#ddd 0,#bbb)",
        border:'1px solid #8e8f8f',
        borderRadius:'3px',
        boxShadow:'inset 0 -1px 1px hsla(0,0%,100%,.8),inset 0 1px 1px #fff',
        boxSizing:'border-box',
        color:'#222',
        padding:'0 12px',
        minWidth:'75px',
        minHeight:'23px',
        textAlign:'center'
      },[]),"Log in"),
      this.#btnCancel = btn2 = insertText(button([],{
        background: "linear-gradient(180deg,#eee 45%,#ddd 0,#bbb)",
        border:'1px solid #8e8f8f',
        borderRadius:'3px',
        boxShadow:'inset 0 -1px 1px hsla(0,0%,100%,.8),inset 0 1px 1px #fff',
        boxSizing:'border-box',
        color:'#222',
        padding:'0 12px',
        minWidth:'75px',
        minHeight:'23px',
        textAlign:'center',marginLeft:'4px'
      },[]),"Cancel"),
      btn1 = insertText(button([],{
        background: "linear-gradient(180deg,#eee 45%,#ddd 0,#bbb)",
        border:'1px solid #8e8f8f',
        borderRadius:'3px',
        boxShadow:'inset 0 -1px 1px hsla(0,0%,100%,.8),inset 0 1px 1px #fff',
        boxSizing:'border-box',
        color:'#222',
        padding:'0 12px',
        minWidth:'75px',
        minHeight:'23px',
        textAlign:'center',marginLeft:'4px'
      },[]),"Shut down")
    ]))
    btn.id=btn2.id=btn1.id='login';
    btn.addEventListener('click',async ()=>{
      this.#boxPw.disabled=this.#boxUn.disabled=btn2.disabled=btn.disabled=true;
      let undis = ()=>this.#boxPw.disabled=this.#boxUn.disabled=btn2.disabled=btn.disabled=false;
      
      if (this.#boxUn.value.includes('\\')) {
        this.#status.style.color='blue';
        this.#status.innerText="Contacting authentication server..."
        let server = this.#boxUn.value.split('\\',1)[0],unm = this.#boxUn.value.split('\\',2)[1] || 'default';
        let resp;
        try {
          resp = await fetch('//'+server+'/.w8r-auth/info.json');
        } catch (err) {
          this.#status.style.color='red';
          this.#status.innerText='Failed to connect to server: '+err;
          system.log.warn('Auth fail',err);
          undis();
          return;
        }
        if (resp.status!=200) {
          this.#status.style.color='red';
          this.#status.innerText='Server returned unexpected status: '+resp.status;
          undis();
          return
        }
        let data1;
        try {
          data1 = await resp.json();
        } catch (err) {
          this.#status.style.color='red';
          this.#status.innerText='Server returned invalid response: '+err;
          system.log.warn('Auth parse fail',err);
          undis();
          return
        }
        
        let actualServer = server+'';
        if (typeof data1?.notAvail == 'string') {
          this.#status.style.color='red';
          this.#status.innerText='Server not available: '+data1?.notAvail;
          undis();
          return
        }
        if (typeof data1?.actualLocation == 'string') {
          actualServer=data1.actualLocation;
        }
        let actualResp;
        try {
          actualResp = await fetch('//'+actualServer+'/.w8r-auth/users?user='+encodeURIComponent(unm)+'&pass='+encodeURIComponent(this.#boxPw.value));
        } catch (err) {
          this.#status.style.color='red';
          this.#status.innerText='Failed to connect to server: '+err;
          system.log.warn('Auth (while getting user) fail',err);
          undis();
          return;
        }
        if (resp.status!=200) {
          this.#status.style.color='red';
          this.#status.innerText='Server returned unexpected status: '+resp.status;
          undis();
          return
        }
        let data2;
        try {
          data2 = await actualResp.json();
        } catch (err) {
          this.#status.style.color='red';
          this.#status.innerText='Server returned invalid response: '+err;
          system.log.warn('Auth (while getting user) parse fail',err);
          undis();
          return
        }
        if (data2?.disabled) {
          this.#status.style.color='red';
          this.#status.innerText='Your account is disabled.';
          undis();
          return
        }
        if (data2?.badCred) {
          this.#status.style.color='red';
          this.#status.innerText='Invalid password or username.';
          undis();
          return
        }
        if (typeof data2?.rpcFSToken != 'string') {
          this.#status.style.color='red';
          this.#status.innerText='No FS token provided!';
          undis();
          return
        }
        if (typeof data2?.home != 'string') {
          this.#status.style.color='red';
          this.#status.innerText='No home dir provided!';
          undis();
          return
        }
        system._globSettingsPleaseUseNormalSettingsAndNotThis.setOpt('auth.user',unm);
        system._globSettingsPleaseUseNormalSettingsAndNotThis.setOpt('auth.domain',server);
        system._globSettingsPleaseUseNormalSettingsAndNotThis.setOpt('auth.user.home',data2?.home);
        system._globSettingsPleaseUseNormalSettingsAndNotThis.setOpt('auth.fstoken',data2?.rpcFSToken);
        system._globSettingsPleaseUseNormalSettingsAndNotThis.setOpt('auth.logOut',false);
        btn1.disabled=true;
        return
      }
      let gsett = system._globSettingsPleaseUseNormalSettingsAndNotThis;
      if (!gsett.getOptProp('auth.userInfo',this.#boxUn.value,null)) {
        this.#status.style.color='red';
        this.#status.innerText="Unknown user";
        undis();
        return;
      }
      btn2.disabled=btn1.disabled=true;
      gsett.setOpt('auth.user',this.#boxUn.value);
      gsett.setOpt('auth.domain','');
      gsett.setOpt('auth.logOut',false);
      system.shutdown.liReboot();
    })
    this.#boxUn.value = system._globSettingsPleaseUseNormalSettingsAndNotThis.getOpt('auth.lastUser','')
    this.#boxPw.value = '';
    btn1.addEventListener('click',()=>system.shutdown.show());
    btn2.addEventListener('click',()=>{
      if (this.window.getIsMin()) return;
      if (this?.newUI?.logonA) {
        this.window.minimise();
        this.newUI.logonA.classList.remove('hide');
        
      }
    })
    stl.innerHTML='#boxun:focus,#boxpw:focus{border-color:#86c6e8 #b3e0f9 #b3e0f9!important;outline:none}#login:hover{background:linear-gradient(180deg,#e5f4fd 45%,#b3e0f9 0)!important;border-color:#3c7fb1!important}#login:active{background:linear-gradient(180deg,#cee9f8 45%,#86c6e8 0)!important;border-color:#6d91ab!important;box-shadow:none}#login:focus{box-shadow:inset 0 0 0 2px #86c6e8!important;outline:1px dotted #000;outline-offset:-4px}#login:disabled{background:#f4f4f4!important;border-color:#aeb2b5!important;color:#838383!important}'
    this.#boxUn.id = 'boxun';
    this.#boxPw.id = 'boxpw';
    lbl.setAttribute('for','boxun');
    lbl1.setAttribute('for','boxpw')
    this.#boxUn.type= 'text';
    this.#boxPw.type= 'password';
  }
}
(()=>{
  
  var inst = new LogonUI('Log on',[],{type:'direct'});
  console.log(inst)
  var inst2 = new LogonUINew(inst);
})();