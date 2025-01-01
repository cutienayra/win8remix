class TextView extends Application {
  //Application configuration
  static appName = 'TextView';
  static icon = '/apps/textview/icon.png';
  static appCategory = 'acc';
  static appId = 'textview';
  windowOptions = {resize:true}
  //End application configuration
  constructor(arg0,args,launchType) {
    super();
    this.name = 'TextView' + (args[1] ? (' - ' + args[1]) : '');
    this.__init(arg0,args,launchType);
    this.window.setWidth(700);
    this.window.windowBody.style.backgroundColor='#4a4253';
    this.window.setMinHeight(480);
    /*this.window.setHeight(480);
    /*this.window.setMinWidth(439);
    this.window.setMinHeight(481);*/
    
    this.window.windowBody.appendChild(insertText(elem('pre',[],
                                                       //{overflow:'scroll',maxHeight:'432px',height:'100%',userSelect:'text'}
                                                       {overflow:'scroll',maxHeight:'60vh',userSelect:'text',backgroundColor:'#4a4253',color:'white'}
                                                       ,[]),args[0] || '???'))
   
  }
}
function viewTextFile(link,ttl) {
  if (link.startsWith('fs://')) {
    system.fs.readFile(link.slice('fs://'.length),(error,data)=>{
      if (error) {
        system.log.warn('TextView file fetch failed',error);
        var inst = new TextView('',['Failed to get file:'+error],{type:'direct'});
        return
      }
      var inst = new TextView('',[data+'', ttl || link],{type:'direct'});
    });
  } else {
    fetch(link).then(x=>x.text().then(x=>{
      var inst = new TextView('',[x,ttl || link],{type:'direct'});
    })).catch(err=>{
      system.log.warn(err);
      var inst = new TextView('',['Failed to get file: '+err],{type:'direct'});
    })
  }
}
// TextView needs an input file
system.app(()=>{},'textview');
/*
system.app(() => ({
    icon: "/apps/textview/icon.png",
}), 'textview');
*/