class vm1SubApp extends Application {
  //Application configuration
  static appName = 'Windows 96 - ' + vmv;
  static icon = '/apps/vmview/icon.png';
  static appId = 'vm1';
  windowOptions = {resize:true};
  //End application configuration
  constructor(arg0,args,launchType) {
    super();
    this.__init(arg0,args,launchType);
    this.window.setWidth(630);
    this.window.setMinWidth(430);
    this.window.setHeight(495);
    this.window.setMinHeight(335);
    this.win96();
}

win96() {
  this.window.windowBody.innerHTML=`
  <iframe src="//windows96.net" width="100%" height="100%" style="background-color: black; border: hidden; padding: 0; margin: 0;"></iframe>
  `;
  this.window.setTitle('Windows 96 - VM Viewer');
}
  
}
window.vm1SubApp=vm1SubApp