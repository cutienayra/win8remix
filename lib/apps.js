class AppsManager {
  #smenu = null;
  constructor(smenu) {
    this.#smenu = smenu;
  }
  #apps = {};
  register(obj) {
    const aid = obj?.appId;
    if (typeof aid != 'string') throw TypeError('appId is not a string');
    if (this.#apps[aid]) throw ValueError('appId already in use');
    this.#apps[aid]=obj;
    if (this.#smenu) this.#smenu.registerApp(obj);
  }
  launch(aid,args,lt) {
    if (typeof lt != 'object') lt = {};
    if (!(args instanceof Array)) args = [];
    if (!this.#apps[aid]) return;
    new this.#apps[aid]('',args,{type:'direct',...lt});
  }
  registerApp(obj) {
    this.register(obj);
  }
}
