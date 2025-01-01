class ThemeManager {
  #lastTheme = 'glass';
  #lastBck = 7;
  constructor(sm,log) {
    this.log = log;
    this.upd8(sm);
  }
  #themes = [
    'basic10',
    'basic-10',
    'glass',
    'glass10',
    'frosted',
    'red',
    'basic-81-th',
    'basic-purple',
    'basic-2012',
    'purple',
    'build5112-theme',
    'build5112-aero-theme',
    'winxp-theme'
  ];
  get themes() {
    return this.#themes.slice();
  }
  removeThemes(elem) {
    this.#themes.forEach(x=>{
      elem.classList.remove(x);
    })
  }
  upd8(sm) {
    var smg = sm || system.settings;
    var theme = smg.getOpt('theme.theme','glass');
    this.#lastTheme = theme;
    var back = smg.getOpt('theme.wallpaper',2);
    if (this.#lastBck != back) {
      this.setWallpaper(back);
    }
    this.#lastBck = back;
    this.log.info('Setting theme to',theme);
    let windows = document.querySelectorAll('.window');
    windows.forEach(x=>{
      this.removeThemes(x);
      x.classList.add(theme);
    })
    let windowss = document.querySelectorAll('.shutdown-window');
    windowss.forEach(x=>{
      this.removeThemes(x);
      x.classList.add(theme);
    })
  }
  getTheme() {
    return this.#lastTheme;
  }
  //set the wallpaper
  setWallpaper(number) {
    this.log.info('Setting wallpaper to',number);
    let element = document.body;
    element.classList.forEach(x=>{
      if (x.startsWith('bag-')) element.classList.remove(x); // remove previous wallpaper(s)
    })
    element.classList.add('bag-'+number);
  }
}