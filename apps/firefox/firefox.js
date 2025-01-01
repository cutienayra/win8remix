class TheNewApp extends Application {
  //Application configuration
  static appName = 'Firefox';
  static icon = '/apps/firefox/icon.png';
  static appCategory = 'acc';
  static appId = 'firefox';
  windowOptions = {resize:true,
      width:(window.innerWidth*0.60)+'px',//make it 60% of screen width
      height:(window.innerHeight*0.60)+'px'
  };
  //End application configuration
  constructor(arg0,args,launchType) {
    super();
    this.__init(arg0,args,launchType);
    const url = system.settings.getOpt('firefox.remoteUrl', 'example.org')+'';
    let starter = args[0];
    let params = new URLSearchParams();
    if (typeof starter == 'string') {
      params.set('start',starter+'');
    }
    let frame = document.createElement('iframe');
    frame.src=`https://${url}/${params.toString() ? '?' : ''}${params}`;
    frame.style.border='none';
    frame.style.height=frame.style.width='100%'
    this.window.windowBody.appendChild(frame);
  }
}
function launchFirefox(starter) {
  new TheNewApp('Firefox',[starter]);
} 
system.app(()=>{
  system.apps.register(TheNewApp);
},'firefox');