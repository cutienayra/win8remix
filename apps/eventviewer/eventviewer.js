class EventViewerApp extends Application {
    //Application configuration
    static appName = 'Event Viewer';
    static icon = '/apps/eventviewer/icon.png';
    static appCategory = 'sys';
    static appId = 'eventviewer';
    windowOptions = {resize:true,height:500};
  //End application configuration
  constructor(arg0,args,launchType) {
    super();
    this.__init(arg0,args,launchType);
    this.w = (e)=>this.update(e);
    system.log.watchers.push(this.w);
    this.window.windowBody.style.overflowY='scroll';
    this.update(system.log.entries);
  }
  onClose() {
    this.destroyWindows();
    if (system.log.watchers.includes(this.w)) {
      system.log.watchers.splice(system.log.watchers.indexOf(this.w),1); // remove the watcher
    }
  }
  update(ent) {
    this.window.windowBody.innerHTML='';
    let lis = ent.map(x=>{
      let color = '';
      let sym = ''; //9888
      switch (x.type) {
        case "error":
          color = 'red';
          sym = String.fromCharCode(10060);
        break;
        case 'warn':
          color = '#9b9b00'
          sym = String.fromCharCode(9888);
        break;
        case 'info':
          sym = String.fromCharCode(8505);
        break;
      }
      return insertText(elem('li',[],{color},[]),sym+(sym ? ' ': '')+x.msg.join(' '));
    })
    this.window.windowBody.innerHTML='';
    this.window.windowBody.appendChild(elem('ul',[],{},[
      ...lis
    ]));
    setTimeout(()=>this.window.windowBody.scrollTo(0,0xffffff),0);
  }
}
system.app(()=>{
  system.apps.register(EventViewerApp);
},'eventviewer');