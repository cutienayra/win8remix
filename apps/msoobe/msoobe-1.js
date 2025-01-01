class MsoobeSubApp extends Application {
  //Application configuration
  static appName = 'Microsoft OOBE';
  static icon = '/favicon.ico';
  static appId = 'msoobee'
  windowOptions = {resize:false,noMin:true,noClose:true,windowType:'fullscreen'};
  //End application configuration
  
  constructor(arg0,args,launchType) {
    super();
    this.name = 'Out of Box Experience';
    this.__init(arg0,args,launchType);
    this.window.setWidth(550);
    this.show();
    // doesn't work yet // this.window.classList.add('msoobe');
  }
  show() {
    this.window.windowBody.innerHTML=`<div class="msg"><h1>Welcome to Windows 8 Remix!</h1><p>In this Setup is where you will be able to Personalise and customize your Windows 8 Experience to whatever you desire.<br>Let's get started!</p></div><div class="dev-note"><b>WARNING:</b><br>The OOBE for Windows 8 Remix is unfinished and shouldn't be used fully for production!</div><div class="branding"></div>`;
}
}
window.MsoobeSubApp = MsoobeSubApp;