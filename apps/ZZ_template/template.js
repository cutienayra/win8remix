class Template extends Application {
  //Application configuration
  static appName = 'Template';
  static icon = '/apps/template/icon.png';
  static appCategory = 'acc';
  static appId = 'template';
  windowOptions = {resize:true};
  //End application configuration
  constructor(arg0,args,launchType) {
    super();
    this.__init(arg0,args,launchType);
  }
}
system.app(()=>{
  system.apps.register(Template);
},'template')