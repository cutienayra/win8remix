class DOSBox extends Application {
  constructor(arg0,args,launchType) {
    super("DOSBox",args,launchType,{resize:false,"actually obey the resize:false option, ignore the experiment": true});
  }
}
system.app(()=>{
  system.taskbar.registerApp(DOSBox,{
    icon: "/apps/eventviewer/icon.png",
    name: 'DOSBox'
  });
},'dosbox');