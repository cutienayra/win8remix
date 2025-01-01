class WinverApp extends Application {
  //Application configuration
  static appName = 'About Windows';
  static icon = 'favicon.ico';
  static appCategory = 'sys';
  static appId = 'winver';
  windowOptions = {resize:false,noMin:true};
  //End application configuration
  constructor(arg0,args,launchType) {
    super();
    this.__init(arg0,args,launchType);
    this.window.setWidth(460);
    this.window.setHeight(425);
    this.mnu();
  }

  mnu() {
    this.window.windowBody.innerHTML=`
<div class="winver">
  <div class="logo" style="background: center / cover no-repeat url(${rl1_2})"></div>
  <hr>
  <p id="main">
    Fen Tech Co. Windows
    <br>Version ${ver} [${bld}]
    <br>© The Windows 8 Project ~ 2022-2023
    <br>
    <br>
    <br>
    <br>This project is open source and you can view that 
    <a href="https://gitea.usernamee.duckdns.org/win8remix/win8remix" target="_blank">here...
    </a>
    <br>
    <br>
    <br>
    <br>This product is created all thanks to the awesome folks from 
    <b>Fen Tech Co.
    </b> including...
    <br>
    <br>
    <b>Strow
    </b> and 
    <b>usernamee
    </b>
  </p>
</div>

`;
    let b;
    this.window.windowBody.querySelector('#main').appendChild(div([],[
      b = insertText(button([],{float:'right'}),'OK'),
    ]))
    b.addEventListener('click',()=>this.window.destroy());
  }
  
}
system.app(()=>{
  system.apps.register(WinverApp);
},'winver');