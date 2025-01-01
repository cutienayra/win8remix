// Wallpaper Total
let wall_total = '8';

class WallpaperSubApp extends Application {
  //Application configuration
  static appName = 'Wallpaper';
  static icon = '/res/icons/wallpaper.png';
  static appId = 'wallpaper_subapp'
  windowOptions = {resize:false,noMin:true};
  //End application configuration
  walls = [
    {name: 'Sunset Beach'},
    {name: 'Longhorn Build 5112'},
    {name: 'DEEPROT Wallpaper 1.'},
    {name: 'DEEPROT Wallpaper 2.'},
    {name: 'Tamama (Nitouhei)'},
    {name: 'Jean Francois'},
    {name: 'Beta 8'},
    {name: 'Blackwood Forest'},
    {name: 'Sunny City View'},
    {name: 'Rocky Waterfalls'},
    {name: 'Glowing Grassy Meadows'},
  ];
  wSel = 0;
  
  constructor(arg0,args,launchType) {
    super();
    this.name = 'Wallpaper Settings - ' + sts;
    this.__init(arg0,args,launchType);
    this.window.setWidth(550);
    this.show();
  }
  fw() {
    this.wSel++;
    if (this.wSel > (this.walls.length-1)) this.wSel = 0; // wrap around if too large
    this.show();
  }
  back() {
    this.wSel--;
    if (this.wSel < 0) this.wSel = this.walls.length-1; // wrap around if too large
    this.show();
  }
  show() {
    if (this.walls[this.wSel].skip) return this.fw();
    this.window.windowBody.innerHTML=`<div class="img-mnu"><div class="background bag-${this.wSel+1}"></div><div class="sub"><div class="title-subtitle"><h1>${this.walls[this.wSel].name}</h1><p><b>${this.wSel+1}</b> / ${this.walls.length}</p></div><div class="btns"><button id="wallApply">Apply Wallpaper</button><div class="m-btns"><button id="bk"></button><button id="fw"></button></div></div></div></div>`;
    let btn = this.window.windowBody.querySelector('#wallApply');
    btn.addEventListener('click',()=>system.settings.setOpt('theme.wallpaper',this.wSel+1));
    this.window.windowBody.querySelector('#fw').addEventListener('click',()=>this.fw());
    this.window.windowBody.querySelector('#bk').addEventListener('click',()=>this.back());
  }
}
window.WallpaperSubApp = WallpaperSubApp;