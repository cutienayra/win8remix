class CursorsSubApp extends Application {
  //Application configuration
  static appName = 'Cursors';
  static icon = '/res/icons/mouse.png';
  static appId = 'cursors_subapp'
  windowOptions = {resize:false,noMin:true};
  //End application configuration
  constructor(arg0,args,launchType) {
    super();
    this.name = 'Cursors - ' + sts;
    this.__init(arg0,args,launchType);
    this.window.setWidth(450);
    this.mnu();
  }
  //tldr: complete the cursor menu by making it functional
  mnu() {
    this.window.windowBody.innerHTML=`<div class="cur-mnu"><h1>Cursors</h1><hr><div class="listbox revamped"><div class="item one">Default Cursors (Windows 8 Remix Aero Cursors)</div><br></div></div>`;
  }
  
}
window.CursorsSubApp = CursorsSubApp;