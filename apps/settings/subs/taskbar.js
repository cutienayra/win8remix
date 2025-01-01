class TaskbarSubApp extends Application {
  //Application configuration
  static appName = 'Taskbar';
  static icon = '/res/icons/taskbar.png';
  static appId = 'taskbar_subapp'
  windowOptions = {resize:false,noMin:true};
  //End application configuration
  constructor(arg0,args,launchType) {
    super();
    this.name = 'Taskbar Options - ' + sts;
    this.__init(arg0,args,launchType);
    this.window.setWidth(450);
    this.mnu();
  }

  mnu() {
    this.window.windowBody.innerHTML=`<div class="view mai-mnu" style="height: 220px">
  <div class="cat-marker" style="height: auto; display: flex; text-align: center; justify-content: center; margin-top: auto; margin-bottom: auto;">Coming soon...</div>
</div>`;
  }
  
}
window.TaskbarSubApp = TaskbarSubApp;