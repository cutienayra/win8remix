/* Taskbar for Windows 8 Remix */

class Topbar {
  #elem = null;
  #settInst = null;
  #startBtn = null;
  #lastTheme = 'glass';
  #isSel = false;
  #clock = null;
  constructor(settings,log,startmenu) {//<bar><button type="start"><div class="icon"></div><span>Start!</span></button><button type="shutdown-opt" id="shutdown-btn"><div class="icon"></div>Shutdown Options</button><button type="settings-opt"><div class="icon"></div>System Settings</button></topbar>
    let d1 = new Date()
    this.#elem = elem('bar',["glass"],{zIndex:'9999'},[
      this.#startBtn = insertType(elem('button',[],{},[
        div(['icon'],{},[]),
        insertText(span([],{},[]),'Start!')
      ]),'start'),
      insertType(elem('div',['time'],{},[
        this.#clock = span([],{},[])
      ]),'time'),
    ]);
    let updateClock = ()=>{
      let d = new Date()
      this.#clock.innerText = `${d.getHours()}:${d.getMinutes()}`;
    }
    setInterval(()=>{
      updateClock();
    },1000);
    updateClock();

    //const getHours = getTimezoneOffset();
    this.elem = this.#elem;
    //this.shutdownBtn.addEventListener('click',()=>system.shutdown.show());
    document.body.appendChild(this.#elem);
    /*this.settingBtn.addEventListener('click',()=>{
      if (this.#settInst && !this.#settInst.destroyed) {
        if (this.#settInst.window.getIsMin()) {
          this.#settInst.window.restore(); 
        } else {
          this.#settInst.window.minimise(); 
        }
      } else {
        this.#settInst = new SettingsApp('Windows 8 Remix - Settings',[],{type:'direct'})
        this.#settInst.window.__yes.style.display='';
      }
      
    });*/
    startmenu.onhide = () => {
      this.#startBtn.classList.remove('selected');
      this.#isSel = false;
    }
    this.#startBtn.addEventListener('click',()=>{
      if (this.#isSel) {
        this.#startBtn.classList.remove('selected');
        startmenu.close();
        this.#isSel = false;
      } else {
        this.#startBtn.classList.add('selected');
        startmenu.open();
        this.#isSel = true;
      }
    });
    /*this.#startBtn.addEventListener('click',(2)=>{
      document.querySelector('button[type="start"].selected').classList.remove('selected');
    });*/
    this.updateSettings(settings);
    document.body.appendChild(this.#elem);
  }
  updateSettings(setting) {
    var settingManager = setting || system.settings;

    var theme = settingManager.getOpt('theme.theme','glass');
    if (this.#lastTheme == theme) return;
    this.#lastTheme = theme;
    system.theming.removeThemes(this.#elem);
    this.#elem.classList.add(theme);
    
    
  }
}