class VMViewApp extends Application {
  //Application configuration
  static appName = 'VM Viewer';
  static icon = '/apps/vmview/icon.png';
  static appCategory = 'acc';
  static appId = 'vmviewer';
  windowOptions = {resize:false};
  //End application configuration
  constructor(arg0,args,launchType) {
    super();
    this.name = vmv;
    this.__init(arg0,args,launchType);
    this.window.setWidth(600);
    this.homeVM();
}

  homeVM() {
    this.window.setTitle('VM Viewer');
    this.window.windowBody.innerHTML=`
    <div class="view" style="height: 400px;">
  <div class="p2">
    <div class="cat-marker">OSes availible:</div>
    <div class="item" id="win96">
      <div class="icon" style="background-image: url(https://windows96.net/system/resource/app/appletouch-icon.png);">
      </div>
      <div class="title">Windows 96</div>
    </div><div class="item" id="win8rmx">
      <div class="icon" style="background-image: url(../favicon.ico);">
      </div>
      <div class="title">Windows 8 Remix</div>
    </div>
    
    
    
    
  </div>
</div>
`;
this.window.windowBody.querySelector('#win96').addEventListener('click',()=>this.win96());
    
this.window.windowBody.querySelector('#win8rmx').addEventListener('click',()=>this.win8rmx());
  
  }

win96() {
    system.adtScript('apps/vmview/subs/vm1.js','vm1SubApp').then(v1sa=>{new v1sa('',[],{});});
    console.log('Loaded VM 1 - Windows 96');
}

win8rmx() {
    system.adtScript('apps/vmview/subs/vm2.js','vm2SubApp').then(v2sa=>{new v2sa('',[],{});});
    console.log('Loaded VM 2 - Windows 8 Remix');
}
  
}
system.app(()=>{
  system.startmenu.registerApp(VMViewApp);
},'vmview');