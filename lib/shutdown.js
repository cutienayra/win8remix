class ShutdownDialog {
  //Constructor
  #elem = null;
  #loDialog = null;
  #rbButton = null;
  #shButton = null;
  #loButton = null;
  #cnButton = null;
  constructor(sett,ili) {
    window.addEventListener('keydown',(e)=>{
      if (e.key == 'F5') {
        if (e.ctrlKey) return;
        e.preventDefault();
        if (!this.#isActive && !e.shiftKey) {
          this.show();
        } else {
          //QUICK RELOAD, DO NOT EDIT
          try{this.#hideWins();this.#elem.remove()}catch{};try{this.buildLOD('Rebooting')}catch{};location.reload()}
        //thank you for not editing
        
      }
    })
    //Construct dialog
    this.#elem = div(['shutdown-options','hide'],{},[
      div(['shutdown-window',sett.getOpt('theme.theme','glass')],{width:'500px',height:'auto'},[
        div(['title-bar'],{},[
          insertText(div(['title-bar-text'],{},[]),'Shutdown Options')
        ]),
        div(['window-body'],{},[
          div(['window-body-filler'],{},[
            insertText(elem('h1',[],{},[]),'What do you want to do?'),
            insertText(elem('p',[],{},[]),'Make sure you saved any unsaved progress/files on this machine!'),
            this.#rbButton = insertText(elem('button',['r-down'],{},[]),'Reboot!'),
            this.#shButton = insertText(elem('button',['s-down'],{},[]),'Shutdown!'),
            this.#loButton = insertText(elem('button',['s-down'],{},[]),'Log off!'),
            this.#cnButton = insertText(elem('button',['c-down'],{},[]),'Cancel and Return to Desktop!'),
          ])
        ])
      ])
    ]);
    this.#shButton.type=this.#loButton.type=this.#rbButton.type='enabled';
    this.#cnButton.type='enabled';
    this.#rbButton.addEventListener('click',()=>this.reboot());
    this.#shButton.addEventListener('click',()=>this.shutdown());
    if (ili) {
      this.#loButton.addEventListener('click',()=>this.logoff());
    } else {
      this.#loButton.remove()
    }
    this.#cnButton.addEventListener('click',()=>this.hide());
    document.body.appendChild(this.#elem);
  }
  logoff() {
    //if (confirm("WARNING\nI have not implemented logging in, once you log out you won't be able to use the system")) {
        //if (confirm("Press yes to confirm if you actually want to log out")) {
          system._globSettingsPleaseUseNormalSettingsAndNotThis.setOpt('auth.logOut',true);
          system._globSettingsPleaseUseNormalSettingsAndNotThis.setOpt('auth.lastUser',system.getUser().nameWithDomain);
        system._globSettingsPleaseUseNormalSettingsAndNotThis.delOpt('auth.user');
        system._globSettingsPleaseUseNormalSettingsAndNotThis.delOpt('auth.domain');
        system._globSettingsPleaseUseNormalSettingsAndNotThis.delOpt('auth.fstoken');
          this.#loReboot();
        //}
    //}
  }
  #loReboot() {
    this.#hideWins();
    this.#elem.remove();
    this.buildLOD('Logging off');
    setTimeout(()=>{
      location.reload()
    },2000);
  }
  liReboot() {
    this.#hideWins();
    this.#elem.remove();
    this.buildLOD('Logging in');
    setTimeout(()=>{
      location.reload()
    },2000);
  }
  #hideWins() {
    document.querySelector('taskbar') && (document.querySelector('taskbar').remove());
    document.querySelector('bar') && (document.querySelector('bar').remove());
    document.querySelector('.st-mnu') && (document.querySelector('.st-mnu').remove());
    document.querySelectorAll('.window').forEach(x=>x.remove());
  }
  reboot() {
    this.#hideWins();
    this.#elem.remove();
    this.buildLOD('Rebooting');
    setTimeout(()=>{
      location.href='/';
    },6000);
    //location.reload();
  }
  shutdown() {
    this.#hideWins();
    this.#elem.remove();
    this.shutdownB();
  }
  #isActive = false;
  show() {
    this.#isActive = true;
    this.#elem.classList.add('show');
    this.#elem.classList.remove('hide');
  }
  hide() {
    this.#isActive = false;
    this.#elem.classList.remove('show');
    this.#elem.classList.add('hide');
  }
  shutdownB() {
  // Removing Shutdown Options Class
    /*
  var element = document.getElementById("shutdown");
  element.classList.remove("shutdown-options");
  // Replacing it with Screen Logon Class
  var elementB = document.getElementById("shutdown");
  elementB.classList.add("screenlogon");*/
    this.buildLOD('Shutting Down');
    setTimeout(()=>{
      location.href='/itisnowsafe.html';
    },8000);
  }
  buildLOD(type) {
    this.#loDialog = div(['shutdown-options','screenlogon'],{},[
      div(['message-logon'],{},[
        div([],{},[
          insertSrc(elem('img',[],{width:'80px',height:'80px',verticalAlign:'center'},[]),rl2),
          elem('br',[],{},[]),
          insertText(span([],{fontSize:'24px'},[]),type)
        ])
      ])
    ]);
    document.body.appendChild(this.#loDialog);
  }

  /* Shutdown Menu */

  // This involves removing Classes

  // <img src="${dots}" style="width: 80px; height: 80px; vertical-align: center;"><br><span style="font-size: 24px;">Shutting Down</span>
}