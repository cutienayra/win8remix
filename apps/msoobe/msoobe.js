class MsoobeApp extends Application {
  //Application configuration
  static appName = 'Out of Box Experience';
  static icon = 'favicon.ico';
  static appCategory = 'tea';
  static appId = 'msoobe';
  graphical = false;
  windowOptions = {resize:false};
  //End application configuration
  constructor(arg0,args,launchType) {
    super();
    this.__init(arg0,args,launchType);
    //this.window.setWidth(1);
    this.homeE();
}

  homeE() {
    //this.window.setTitle('Running Msoobe...');
    system.adtScript('apps/msoobe/msoobe-1.js','MsoobeSubApp').then(msa=>{
      new msa('',[],{});
    });
    //this.window.destroy();
  }
  
}
system.app(()=>{
  system.startmenu.registerApp(MsoobeApp);
},'msoobe');