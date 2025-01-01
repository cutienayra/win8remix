/* 
                            ▒▒████                              
                            ████████                            
                          ██████████                            
                          ████▒▒██████                          
                        ██████    ████▒▒                        
                        ████      ▒▒████                        
                      ██████        ██████                      
                    ▒▒████    ████    ████                      
                    ████▒▒  ████████  ██████                    
                  ██████    ████████    ████                    
                  ████░░    ████████    ██████                  
                ██████      ████████      ████▒▒                
              ░░████        ████████      ▒▒████                
              ██████        ████████        ██████              
            ▒▒████          ████████          ████              
            ████▒▒          ██████▒▒          ██████            
          ██████              ████              ████            
          ████                ████              ██████          
        ██████                ████                ████▒▒        
      ░░████                                      ▒▒████        
      ████▓▓                                        ██████      
    ▒▒████                    ████                    ████      
    ████▒▒                  ████████                  ██████    
  ██████                      ▒▒▒▒                      ████░░  
  ████                                                  ▒▒████  
██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒██████
████████████████████████████████████████████████████████████████
▓▓████████████████████████████████████████████████████████████▓▓

*/
//WARNING: every application depends on this file
// edit with caution






















class AppWindow {
  #onClosed=null;
  
  //Elements
  #mainDiv=null;
  #titleBarText=null;
  #btnMinimise=null;
  #btnMaximize=null;
  #btnClose=null;
  #titleBar=null;
  #tbe = null;
  #tbeTitle = null;
  #isMin = false;
  #isMax = false;
  #resObsFn = null;
  #op = null;
  
  //Dragging variables
  #dragActive = false;
  #drag1=0;
  #drag2=0;
  #drag3=0;
  #drag4=0;
  
  /**
   * The constructor
   * @param {string} title
   * @param {WindowOptions} options
   * @param {function} onClosed
   */
  //Constructor
  constructor(title,options,onClosed) {
    this.#onClosed = onClosed;
    this.#op = options;
    this.#mainDiv = document.createElement('div');
    if (options.startMinimised) {this.#mainDiv.style.display='none';this.#isMin = true;};
    if (system.settings.getOpt('experiments.globalResize',false) && options.windowType!='infoMessage' && !options["actually obey the resize:false option, ignore the experiment"]) {
      options.resize = true;
    }
    //if (system.settings.getOpt('experiments.scaffolding',false)) {
      system.scaffolding.register(this.#mainDiv);
    //}
    if (options.windowType!='infoMessage' && !options.noTbe) {
        system.topbar.elem.appendChild(this.#tbe = this.__tbe = 
        elem('button',[],{
          borderRight:'solid 0.5px #ffffff',marginTop:'1px',marginBottom:'1px'
        },[
          div(['icon'],{backgroundImage:options.icon ? `url(${options.icon})` : ''},[]),
          this.#tbeTitle = insertText(span(['winTbeTitle'],{},[]),title)
        ]));
      this.#tbe.addEventListener('click',()=>{
        if (system.scaffolding.getActive() != this.#mainDiv) {
          if (this.#isMin) {
            this.restore();
          }
          system.scaffolding.activate(this.#mainDiv);
          
          return
        }
        if (this.#isMin) {
          this.restore();
        } else {
          this.minimise()
        }
      })
    }
    let win = this.#mainDiv; //quick reference
    win.classList.add("window");
    win.classList.add(system.theming.getTheme() || 'glass');
    if(options.windowType!='fullscreen'){
    this.#mainDiv.style.resize=options.resize ? 'both' : 'none';
    this.#mainDiv.style.overflow=options.resize ? 'hidden' : '';
    this.#mainDiv.style.height=options.height ?  (typeof options.height == "number" ? options.height+'px' : options.height) : '';
    win.style.width=options.width ? (typeof options.width == 'number' ? options.width+'px' : options.width) : '500px';
     let winInitX,winInitY
    if (options.position == 'center') {
      winInitX = (window.innerWidth / 3) - 250;
      winInitY = (window.innerHeight / 3) - 200;
    } else {
      [winInitX,winInitY] = system.newWindowPos();
    }
    win.style.left=winInitX+'px';
    win.style.top=winInitY+'px';
    win.style.position='fixed';

    }
    win.appendChild(
      this.#titleBar = div(['title-bar'],{},[
        this.#titleBarText = div(['title-bar-text'],{},[]),
        div(['title-bar-controls'],{},[
          this.#btnMinimise = elem('button',[],{},[]),
          this.#btnMaximize = elem('button',[],{},[]),
          this.#btnClose = elem('button',[],{},[])
        ]),
      ])
    );
if(options.windowType!='fullscreen'){
    //Dragging stuff
    this.#titleBar.addEventListener('mousedown',(ev)=>this.#handleMouseDown(ev));
    let mmv = (ev)=>this.#handleMouseMove(ev);
    this.mmv = mmv;
    window.addEventListener('mousemove',this.mmv);
    this.mup = (ev)=>this.#handleMouseUp(ev);
    window.addEventListener('mouseup',this.mup);
}
    //Buttons
    this.#btnMinimise.setAttribute('aria-label','Minimise');
    if (options.noTbe || options.noMin) {this.#btnMinimise.style.display='none';this.__yes = this.#btnMinimise;};
    if (options.noClose) {this.#btnClose.style.visibility='hidden';this.#btnClose;};
    if (options.noMax) {this.#btnMaximize.style.visibility='hidden';this.#btnMaximize;};
    this.#btnMinimise.addEventListener('click',()=>this.minimise());
    this.#btnMaximize.setAttribute('aria-label','Maximize');
    this.#btnMaximize.addEventListener('click',()=>this.maximize());
    this.#btnClose.setAttribute('aria-label','Close')
    this.#btnClose.addEventListener('click',()=>this.#onClosed());
    //Title
    this.#titleBarText.innerText = title;
    //Window body
    win.appendChild(div(['window-body'],{},[
      this.windowBody = this.__windowBody = div(['window-body-filler'],{},[])
    ]));
    if (options.shadow) this.windowBody = this.__windowBody.attachShadow({mode:'open'});
    //this.#mainDiv.style.height=options.height || '';
    if (options.resize) {
      let fn = this.#resObsFn = ()=>{
        let tbh = this.__windowBody.parentElement.parentElement.querySelector('.title-bar').getBoundingClientRect().height;
        let wbh = parseInt(this.#isMax ? this.__windowBody.parentElement.parentElement.getBoundingClientRect().height : this.__windowBody.parentElement.parentElement.style.height) - tbh;
        this.__windowBody.style.height=wbh+'px'
        if (typeof options.resizeMod == 'function') {
          options.resizeMod(tbh,wbh);
        }
      }
      (new ResizeObserver(fn)).observe(this.#mainDiv);
      //fn();
    } else {
      this.#btnMaximize.style.display="none";
    }
    console.log(options)
    if(options.windowType=='fullscreen'){this.windowBody.style.position='fixed';this.windowBody.style.left=this.windowBody.style.top='0';this.windowBody.style.width=this.windowBody.style.height=this.#mainDiv.style.height='100%';}
    //Append to DOM
    document.body.appendChild(this.#mainDiv);
  }
  getIsMin() {
    return this.#isMin;
  }
  //Handle dragging the title bar
  #handleMouseDown(ev) {
    ev.preventDefault();
    this.#dragActive = true;
    
    this.#drag3 = ev.clientX;
    this.#drag4 = ev.clientY;
  }
  #handleMouseMove(ev) {
    if (!this.#dragActive) return;
    ev.preventDefault();
    if (this.#isMax) this.maximize();
    //Calculate new position
    this.#drag1 = this.#drag3 - ev.clientX;
    this.#drag2 = this.#drag4 - ev.clientY;
    this.#drag3 = ev.clientX;
    this.#drag4 = ev.clientY;
    //Actually move it
    this.#mainDiv.style.top = (this.#mainDiv.offsetTop - this.#drag2) + "px";
    this.#mainDiv.style.left = (this.#mainDiv.offsetLeft - this.#drag1) + "px";
  }
  /** 
   * Checks if the window is active.
   * @returns {boolean}
   */
  isActive() {
    return system.scaffolding.getActive() == this.#mainDiv;
  }

  #handleMouseUp(ev) {
    if (!this.#dragActive) return;
    this.#dragActive = false;
  }
  /** 
   * Sets the window's width in pixels
   * @param {number} w
   */
  setWidth(w) {if(this.#op.windowType=='fullscreen')return;
    this.#mainDiv.style.width=w+'px';
  }
  /** 
   * Sets the window's height in pixels. If no argument is specified the width is set to auto.
   * @param {number} [w]
   */
  setHeight(w) {if(this.#op.windowType=='fullscreen')return;
    if (!w) return this.#mainDiv.style.height='auto';
    this.#mainDiv.style.height=w+'px';
  }
  
  setWidthy(w) {if(this.#op.windowType=='fullscreen')return;
    this.#mainDiv.style.width='auto';
  }
  setWidthy2(w) {if(this.#op.windowType=='fullscreen')return;
    this.#mainDiv.style.width=w+'%';
  }
  setHeighty(w) {if(this.#op.windowType=='fullscreen')return;
    this.#mainDiv.style.height=w+'%';
  }
  
  setMinWidth(w) {if(this.#op.windowType=='fullscreen')return;
    this.#mainDiv.style.minWidth=w+'px';
  }
  
  setMinHeight(w) {if(this.#op.windowType=='fullscreen')return;
    this.#mainDiv.style.minHeight=w+'px';
  }
  
  setMaxWidth(w) {if(this.#op.windowType=='fullscreen')return;
    this.#mainDiv.style.minWidth=w+'px';
  }
  
  setMaxHeight(w) {if(this.#op.windowType=='fullscreen')return;
    this.#mainDiv.style.minHeight=w+'px';
  }
  setTop(w) {if(this.#op.windowType=='fullscreen')return;
    this.#mainDiv.style.top=w+'px';
  }
  setLeft(w) {if(this.#op.windowType=='fullscreen')return;
    this.#mainDiv.style.left=w+'%';
  }
  setZIndex(w) {if(this.#op.windowType=='fullscreen')return;
    this.#mainDiv.style.zIndex=w+'0';
  }
  
  /** 
   * Minimises the window
   */
  minimise() {
    this.#isMin = true;
    this.#mainDiv.style.animation = 'FadeOut 0.1s';
    setTimeout(()=>{ // wait for the animation
      this.#mainDiv.style.animation = '';
      this.#mainDiv.style.display='none';
      
    },100)
  }
  /** 
   * Restores (unminimises) the window
   */
  restore() {
    this.#isMin = false;
    this.#mainDiv.style.display='';
  }
  #origWidth = 0;
  #origHeight = 0;
  #origTop = 0;
  #origLeft = 0;
  /** 
   * Maximises the window
   */
  maximize() {
    //alert('wip');return;//pls dont remove
    if (!this.#op.resize || !this.#resObsFn) return;
    this.#isMax = !this.#isMax;
    if (this.#isMax) {
      this.#origWidth = parseInt(this.#mainDiv.style.width);
      this.#origHeight = parseInt(this.#mainDiv.style.height);
      
      this.#origTop = parseInt(this.#mainDiv.style.top);
      this.#origLeft = parseInt(this.#mainDiv.style.left);
      
      this.setWidthy2(100);
      this.#mainDiv.style.height=`calc(100% - ${system.topbar.elem.getBoundingClientRect().height}px)`
      this.setTop(0);
      this.setLeft(0);
      this.#resObsFn();
    } else {
      this.#mainDiv.style.top=this.#origTop;
      this.#mainDiv.style.left=this.#origLeft;
      this.#mainDiv.style.width=this.#origWidth;
      this.#mainDiv.style.height=this.#origHeight;
    }
  }
  
  //Other things
  /** 
   * Gets the window's title
   * @returns {string}
   */
  getTitle() {
    return this.#titleBarText.innerText;
  }
  /** 
   * Sets the window's title (same as setTitle)
   * @param {string} newTitle
   */
  changeTitle(newTitle) {
    this.setTitle(newTitle);
  }
  
  /** 
   * Sets the window's title (same as changeTitle)
   * @param {string} newTitle
   */
  setTitle(newTitle) {
    this.#titleBarText.innerText = this.#tbeTitle.innerText = newTitle+'';
  }
  /** 
   * Removes the window.
   */
  destroy() {
    window.removeEventListener('mousemove',this.mmv);
    window.removeEventListener('mouseup',this.mup);
    this.#mainDiv.style.animation = 'FadeOut 0.1s';
    this.#mainDiv.style.pointerEvents='none'
    setTimeout(()=>{ // wait for the animation
      system.scaffolding.unregister(this.#mainDiv);
      this.#mainDiv.remove();
    },100)
    if (this.#tbe) this.#tbe.remove();
  }
}
// Type definitions
/** 
 * Set of options for creating a window
 * @typedef {Object} WindowOptions
 * @property {boolean} [shadow] Create a shadow DOM inside the window.
 * @property {boolean} [startMinimised] Start the window minimised.
 * @property {boolean} [noTbe] Do not create a taskbar icon.
 * @property {boolean} [resize] Make the window resizable.
 * @property {boolean} [noMin] Prevent minimising the window, always enabled if noTbe is set.
 * @property {boolean} [noClose] Prevents closing the window.
 * @property {boolean} [noMax] Prevents maximising the window.
 * @property {string} [width] The window's width including the measurement unit (px, vw, etc...).
 * @property {string} [height] The window's height including the measurement unit (px, vh, etc...).
 * @property {string} [position] The window's position, auto is the default, center places the window in the center of the screen.
 * @property {string} [windowType] The window's type.
 */