class StartMenu {
  #elem = null;
  #lastTheme = 'glass';
  #startMenu = null;
  #stP1 = null;
  #stP2 = null;
  #stBtns = null;
  #apps = [];
  #currentCat = 'sys';
  #cats = {
    sys: ['app1','System Apps'], 
    acc: ['app2','Accessories'],
    tea: ['app3','Test Apps']
  }
  
  constructor() {
    this.#home()
  }
  registerApp(appObject,options) {
    if (options) {
      system.log.warn(`[${appObject.appName || options.name || appObject.name}] The options parameter is deprecated. Please extend the application object.`)
    }
    if (typeof options != 'object') options = {};
    const
    entry = {obj:appObject,options,category: appObject.appCategory || options.category || 'acc', name:appObject.appName || options.name,icon:appObject.icon || options.icon},
    name = appObject.appName || options.name,
    icon = appObject.icon || options.icon;
    entry.button = this.#makeButton(entry,(ev)=>{
      this.close();
      var inst = new appObject(options.name,[],{type:'taskbar',event:ev,options});
    })
    this.#apps.push(entry);
    this.#renderApps();
    return entry;
  }
  #makeButton(entry,click) {
    const
    //vars
      name = entry.name,
      icon = entry.icon;
    // make the button
    let btn = button([],{},[
      div(["icon"],{backgroundImage:`url(${icon})`},[]),
      insertText(span([],{},[]),name)
    ]);
    btn.addEventListener('click',(ev)=>click(ev));
    return btn;
  }
  #renderApps() {
    const apps2Show = this.#apps.filter(x=>x.category == this.#currentCat);
    this.#stP2.remove();
    this.#stP2 = div(['p2'],{overflowY:'auto'},apps2Show.map(x=>x.button))
    
    this.#elem.appendChild(this.#stP2);
  }
  
  #sdButton = null;
  #loButton = null;
  
  #home() {
    //start menu goes here...
    /*button(["app1",'dir1'],{},[
          div(["icon"],{},[]),
          insertText(span([],{},[]),'System Apps')
        ]),*/
    let dirOne;
    if (this.#elem) this.#elem.remove();
    this.#elem = div(['st-mnu',system.settings.getOpt('theme.theme','glass')],{zIndex:'10'},[
      this.#stP1 = insertType(elem('div',["p1"],{},Object.entries(this.#cats).map(([key,val])=>{
        let btn = button([val[0]],{},[
          div(["icon"],{},[]),
          insertText(span([],{},[]),val[1])
        ])
        btn.addEventListener('click',()=>{
          this.#currentCat = key;
          this.#renderApps();
        })
        return btn;
      }))),
      this.#stP2 = insertType(elem('div',["p2"],{},[
       ])),
      
      this.#stBtns = insertType(elem('div',["btns"],{},[
        this.#loButton = button(["logoff-opt"],{},[
          insertType(elem('div',[],{},[])),
          insertText(span([],{},[]),'Log off')
        ]),
        this.#sdButton = button(["shutdown-opt"],{},[
          insertType(elem('div',[],{},[])),
          insertText(span([],{},[]),'Shut Down')
        ])
      ])),
    ])
    this.#sdButton.addEventListener('click',()=>{
      this.close();
      system.shutdown.show();
    })
    this.#loButton.addEventListener('click',async ()=>{
      this.close();
      (await system.confirmBox('Are you sure you want to log off?','Start Menu')) && system.shutdown.logoff();
    })
    document.body.appendChild(this.#elem);
    this.#elem.style.display = 'none';
    this.#renderApps();

/* For apps to show on p2 aka. Row 2 */

//dirOne.addEventListener('click',()=>this.#dir1());
  }

  /* Directories for App Launchers (Start Menu) */

  #dir1() {
   this.#stP2.remove();
    this.#stP2 = div(['p2'],{},[
    // insertText(span([],{},[]),'it works')
      
   ])
    
    this.#elem.appendChild(this.#stP2);
}
  updateSettings(setting) {
    var settingManager = setting || system.settings;

    var theme = settingManager.getOpt('theme.theme','glass');
    if (this.#lastTheme == theme) return;
    this.#lastTheme = theme;
    system.theming.removeThemes(this.#elem);
    this.#elem.classList.add(theme);
    
    
  }
  
  // Start Menu HTML <div class="st-mnu"><div class="p1"><button type="app1"><div class="icon"></div><span>System Apps</span></button><button type="app2"><div class="icon"></div><span>Accessories</span></button></div><div class="p2"></div><div class="btns"><button type="shutdown-opt"><span>Shutdown!</span></button><button type="logoff-opt"><span>Logoff!</span></button></div></div>

  // App Button HTML <button class="app1"><div class="icon"></div><span>Event Viewer</span></button>
  
  open() {
    this.#home();
    this.#elem.style.display = '';
    
  }
  close() {
    this.#elem.style.display = 'none';
    if (typeof this.onhide == 'function') {
      this.onhide();  
    }
  }
  
}
