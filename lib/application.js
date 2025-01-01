class Application { // An instance of an application.
  graphical = true;

  windowOptions = { position: 'auto' };
  name = "";

  icon = '';

  static appCategory = '';
  static appId = '???';

  window = null;

  windows = [];

  _onCloseWrap() { //Should NOT be overriden!
    this.onClose();
  }

  destroyWindows() {
    this.window && this.window.destroy();
    this.windows.forEach(x => x.destroy());
    this.destroyed = true;
  }
  onClose() {
    this.destroyWindows();
  }
  __init(arg0, args, launchType) {
    if (!this.name) {
      this.name = this.constructor.appName;
    }
    if (!this.icon) {
      this.icon = this.constructor.icon;
    }
    if (this.graphical) {
      //if (typeof wop == 'object') {
      this.window = new AppWindow(this.name, { icon: this.icon, ...this.windowOptions }, () => this.onClose());

      //} else {
      //  this.window = new AppWindow(this.name,this.windowOptions,()=>this.onClose());
      //}
    }
  }

  constructor(arg0, args, launchType, wop) {
    if (arg0 || args || launchType || wop) {
      //system.log.warn(`[${arg0}] Using old application constructor is deprecated, please use the new please use the new one.`);
      this.name = arg0;
      if (typeof wop == 'object') Object.assign(this.windowOptions, wop);
      this.icon = launchType?.options?.icon;
      this.__init();
    }
  }
}