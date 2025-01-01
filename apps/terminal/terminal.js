class TerminalApp extends Application {
  //Application configuration
  static appName = 'Terminal';
  static icon = '/apps/terminal/terminal.png';
  static appCategory = 'sys';
  static appId = 'terminal';
  windowOptions = { resize: true };
  //End application configuration
  constructor(arg0, args, launchType) {
    super();
    this.__init(arg0, args, launchType);
    this.window.windowBody.innerHTML = 'testing 1234';
  }
}

system.app(() => {
  system.startmenu.registerApp(TerminalApp);
}, 'terminal');
