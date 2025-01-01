class vm2SubApp extends Application {
  //Application configuration
  static appName = 'Windows 8 Remix - ' + vmv;
  static icon = '/apps/vmview/icon.png';
  static appId = 'vm2';
  windowOptions = {resize:true};
  //End application configuration
  constructor(arg0,args,launchType) {
    super();
    this.__init(arg0,args,launchType);
    this.window.setWidth(630);
    this.window.setMinWidth(430);
    this.window.setHeight(495);
    this.window.setMinHeight(335);
    this.win8remix();
}

win8remix() {
  this.window.windowBody.innerHTML=`
  <iframe src="//e382a71a-f01c-4dc5-a4d2-d7d9e9b24d59.id.repl.co" width="100%" height="100%" style="background-color: black; border: hidden; padding: 0; margin: 0;"></iframe>
  `;
  this.window.setTitle('Windows 8 Remix - VM Viewer');
}
  
}
window.vm2SubApp=vm2SubApp