// Names
let sts = 'Settings';
let vmv = 'VM Viewer';
let exp = 'File Explorer';

class SettingsApp extends Application {
  //Application configuration
  static appName = 'Settings';
  static icon = '/apps/settings/icon.ico';
  static appCategory = 'sys';
  static appId = 'settings';
  windowOptions = {resize:false};
  //End application configuration
  #sts = SettingsApp.appName;
  constructor(arg0,args,launchType) {
    super();
    this.name = 'Main Page - ' + this.#sts;
    this.__init(arg0,args,launchType);
    this.window.setWidth(760);
    this.homeStg();
}

  /*

        .
       / \
      /   \
     /  |  \ 
    /   |   \
   /    |    \
  /     .     \
 /_____________\

This application for Windows 8 Remix is 𝗵𝗶𝗴𝗵𝗹𝘆 𝗶𝗺𝗽𝗼𝗿𝘁𝗮𝗻𝘁 𝗮𝗻𝗱 𝘀𝗵𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗯𝗲 𝗿𝗲𝗺𝗼𝘃𝗲𝗱 𝗶𝗻 𝗮𝗻𝘆 𝘄𝗮𝘆!
Any attempts of removing this application will break Windows 8 Remix...
  */

  homeStg() {
    this.window.setTitle('Main Page - ' + this.#sts);
    this.window.windowBody.style.display = 'flex';
    this.window.windowBody.innerHTML=`<div class="sidebar"><h1>Quick Options</h1><hr>
  <a id="cSts">Cursor Settings</a>
  <a id="taskbarOpt">Taskbar Options</a>
  <a id="wallPge">Wallpapers</a>
  <a id="aboutWinPge">About Windows</a>
  </div>
  <div class="view mai-mnu">
    <div class="cat-marker">Adjust your Computer settings!~</div>
    <div class="p2">
      <div class="item" id="personalise" style="display:flex; flex-direction:row;">
        <div class="icon"></div>
        <div>
          <div class="title">Personalise</div>
          <a class="shortlink a" id="wallpaper">Wallpapers</a>
        </div>
      </div>
      <div class="item no-sub-lnk" id="taskbar">
      <div class="icon"></div>
      <div class="title">Taskbar Options</div>
    </div>
    </div>
    <div class="p2">
    <div class="item no-sub-lnk" id="cursors">
      <div class="icon"></div>
      <div class="title">Cursors</div>
    </div>
    </div>
  </div>
</div>

`;

this.window.windowBody.querySelector('#personalise').addEventListener('click',(e)=>{if (e.target.id=='wallpaper') return; this.personalise()});

this.window.windowBody.querySelector('#cursors').addEventListener('click',(e)=>{if (e.target.id=='cursors') return; this.cursors()});

// this.window.windowBody.querySelector('#wallpaper').addEventListener('click',()=>{this.personalise();this.walls()});

this.window.windowBody.querySelector('#wallpaper').addEventListener('click',()=>{this.walls()});

/* Quick Options */

this.window.windowBody.querySelector('#cSts').addEventListener('click',()=>this.cursors());

this.window.windowBody.querySelector('#taskbarOpt').addEventListener('click',()=>this.taskbar());

this.window.windowBody.querySelector('#taskbar').addEventListener('click',()=>this.taskbar());

this.window.windowBody.querySelector('#wallPge').addEventListener('click',()=>this.walls());

this.window.windowBody.querySelector('#aboutWinPge').addEventListener('click',()=>this.abtWin());

/*
    if (system.settings.getOpt('experiments.settings.experimentOption',false)) {
      this.window.windowBody.querySelector('#expInfo').addEventListener('click',()=>this.expInfo());
      
    } else {
      this.window.windowBody.querySelector('#expInfo').remove();
      this.window.windowBody.querySelector('#eee').remove();
    }
*/

}
  /* expInfo(){
    this.window.setWidth(1024);
    this.window.windowBody.innerHTML='<iframe src="https://gitea.usernamee.duckdns.org/win8remix/win8remix/wiki/Experiments" style="width:100%;height:600px;border:none"></iframe>'
  } */

  cursors() {
system.adtScript('apps/settings/subs/cursors.js','CursorsSubApp').then(csa=>{
      new csa('',[],{});
    });
  }
  taskbar() {
system.adtScript('apps/settings/subs/taskbar.js','TaskbarSubApp').then(tsa=>{
      new tsa('',[],{});
    });
  }
  abtWin() {
system.apps.launch('winver',[],{});
  }
  
  /* Personalise Section */
  
  personalise() {
    this.window.setTitle('Personalise - ' + this.#sts);
    this.window.windowBody.innerHTML = `
  <div class="sidebar"><h1>Quick Options</h1><hr>
  <a id="mPge">Main Page</a>
  <a id="cSts">Cursor Settings</a>
  <a id="wallPge">Wallpapers</a></div>
<div class="view" style="height: auto;" id="mennu">
  <div class="p3">
    <div class="cat-marker">Themes<footer class="c-btn">
        <rd id="backBtn">X
        </rd>
      </footer>
    </div>
    <div class="item" id="aero-theme">
        <div class="icon" style="background-image: url(${cAero});">
      </div>
      <div class="title">Current Aero</div>
    </div>
    <div class="item" id="build5112-theme">
      <div class="icon" style="background-image: url(${b5112theme});">
      </div>
      <div class="title">Build 5112</div>
    </div>
    <div class="item" id="build5112-aero-theme"> <div class="icon" style="background-image: url(${b5112theme});">
</div> 
<div class="title">Aero 5112</div> 
</div>
    <div class="item" id="glass10">
      <div class="icon" style="background-image: url(${themeGlass});">
      </div>
      <div class="title">Old Aero</div>
    </div>
    <div class="item" id="winxp-theme"> <div class="icon" style="background-image: url(${b5112theme});">
</div> 
<div class="title">Luna (BETA)</div> 
</div>
    <div class="dialog-box">
      <div class="cat-marker">Quick Options
      </div>
      <div class="item" id="visual_styles">
        <div class="icon" style="background-image: url(res/icons/theme.png);">
        </div>
        <div class="title">Visual Styles</div>
      </div>
    </div>
  </div>
</div>
`;

  this.window.windowBody.querySelector('#backBtn').addEventListener('click',()=>this.homeStg());
  
this.window.windowBody.querySelector('#mPge').addEventListener('click',()=>this.homeStg());

this.window.windowBody.querySelector('#cSts').addEventListener('click',()=>this.cursors());

this.window.windowBody.querySelector('#wallPge').addEventListener('click',()=>this.walls());

this.window.windowBody.querySelector('#visual_styles').addEventListener('click',()=>this.personalise_3());

  // Themes

this.window.windowBody.querySelector('#aero-theme').addEventListener('click',()=>system.settings.setOpt('theme.theme','glass'));
    
this.window.windowBody.querySelector('#build5112-theme').addEventListener('click',()=>system.settings.setOpt('theme.theme','build5112-theme'));

  this.window.windowBody.querySelector('#build5112-aero-theme').addEventListener('click',()=>system.settings.setOpt('theme.theme','build5112-aero-theme'));
  this.window.windowBody.querySelector('#glass10').addEventListener('click',()=>system.settings.setOpt('theme.theme','glass10'));

this.window.windowBody.querySelector('#winxp-theme').addEventListener('click',()=>system.settings.setOpt('theme.theme','winxp-theme'));
  }

// End of Themes

walls() {
system.adtScript('apps/settings/subs/wallpaper.js','WallpaperSubApp').then(wsa=>{
      new wsa('',[],{});
    });
    }

//

personalise_3() {
    this.window.setTitle('Visual Styles - Personalise - ' + this.#sts);
    this.window.windowBody.innerHTML=`
    <div class="sidebar" style="width: 385px;"><h1>Quick Options</h1><hr><a id="mPge">Main Page</a></div>
    <div id="walls" class="">
  <div class="view" type="walls" id="eiene snskos saoams"><div class="p3">
    <div class="cat-marker">Visual Styles<footer class="c-btn">
        <rd id="personalise">X
        </rd>
      </footer>
    </div>
    <div class="item" id="basic10-theme">
      <div class="icon" style="background-image: url(../res/icons/per/basic10.png);">
      </div>
      <div class="title">Basic10
      </div>
    </div>
    <div class="item" id="basic8-theme">
      <div class="icon" style="background-image: url(../res/icons/per/basic8.png);">
      </div>
      <div class="title">Basic8
      </div>
    </div>
    <div class="item" id="basicp-theme">
      <div class="icon" style="background-image: url(../res/icons/per/basicP.png);">
      </div>
      <div class="title">Basic Purple</div>
    </div>
    <div class="item" id="basic2012-theme">
      <div class="icon" style="background-image: url(../res/icons/per/basic2012.png);">
      </div>
      <div class="title">Basic 2012</div>
    </div>
    <div class="item" id="aero-theme">
      <div class="icon" style="background-image: url(../res/icons/per/glass_aero.png);">
      </div>
      <div class="title">Aero Glass
      </div>
    </div>
    <div class="item" id="frosted-aero-theme">
      <div class="icon" style="background-image: url(../res/icons/per/frost_aero.png);"></div>
      <div class="title">Frosted Aero </div>
    </div>
    <div class="item" id="red-aero-theme">
      <div class="icon" style="background-image: url(../res/icons/per/red_aero.png);">
      </div>
      <div class="title">Red Aero</div>
    </div>
    <div class="item" id="purple-aero-theme">
      <div class="icon" style="background-image: url(../res/icons/per/purple_aero.png);">
      </div>
      <div class="title">Purple Aero</div>
    </div>
    </div>
    </div></div>
</div>
`;
  this.window.windowBody.querySelector('#personalise').addEventListener('click',()=>this.personalise());

this.window.windowBody.querySelector('#mPge').addEventListener('click',()=>this.homeStg());

  // Visual Styles

  this.window.windowBody.querySelector('#aero-theme').addEventListener('click',()=>system.settings.setOpt('theme.theme','glass'));
  
  this.window.windowBody.querySelector('#basic10-theme').addEventListener('click',()=>system.settings.setOpt('theme.theme','basic-10'));
    
  this.window.windowBody.querySelector('#basic8-theme').addEventListener('click',()=>system.settings.setOpt('theme.theme','basic-81-th'));
    
  this.window.windowBody.querySelector('#red-aero-theme').addEventListener('click',()=>system.settings.setOpt('theme.theme','red'));

  this.window.windowBody.querySelector('#purple-aero-theme').addEventListener('click',()=>system.settings.setOpt('theme.theme','purple'));
    
  this.window.windowBody.querySelector('#basicp-theme').addEventListener('click',()=>system.settings.setOpt('theme.theme','basic-purple'));

  this.window.windowBody.querySelector('#basic2012-theme').addEventListener('click',()=>system.settings.setOpt('theme.theme','basic-2012'));
    
  this.window.windowBody.querySelector('#frosted-aero-theme').addEventListener('click',()=>system.settings.setOpt('theme.theme','frosted'));
    }

/* Secret Menu */

secrt() {
  this.window.setTitle(this.#sts);
  let ytbe_url = `https://www.youtube-nocookie.com/embed/pDpU3dxHsZk`;
  this.window.windowBody.innerHTML=`
  <div class="view" style="height: auto; background-color: black; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;"><iframe width="560" height="315" src="${ytbe_url}" title="YouTube" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="no" style="border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;padding: 0;margin: 0;"></iframe></div>
  `;
}

}
  
system.app(()=>{
  system.apps.register(SettingsApp);
},'settings');