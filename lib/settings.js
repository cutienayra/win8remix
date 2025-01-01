class SystemSettings {
  #opts = {};
  #doneInit = false;
  #lst = null;
  #pfix = '';
  #uhome = null;
  #sys = null;
  constructor(system,lst,pfix,uhome) {
    if (uhome) {
      this.doActualInit =this.#doActualInit
      return;
    }
    this.#doActualInit(system,lst,pfix,uhome)

  }
  #promiseExist(file) {
    return new Promise((res)=>{
      this.#sys.fs.exists(file,(exi)=>{
        res(exi);
      })
    })
  }
  #promiseReadFile(file) {
    return new Promise((res,rej)=>{
      this.#sys.fs.readFile(file,(err,data)=>{
        if (err) return rej(err);
        res(data);
      })
    })
  }
  async #doActualInit(system,lst,pfix,uhome) {
    if (this.#doneInit) return;
    if (this.doActualInit) delete this.doActualInit
    this.#pfix = pfix;
    this.#sys = system;
    if (uhome) this.#uhome = uhome;
    this.#doneInit = true;
    this.#lst = lst;
    try {
      if (this.#uhome) {
        let ext = await this.#promiseExist(this.#uhome+'/settings.json');
        //console.log(ext);
        if (!ext) return;
        let item = await this.#promiseReadFile(this.#uhome+'/settings.json');
        if (!item) return;
        this.#opts = JSON.parse(item);
      } else {
        let item = this.#lst.getItem('__win8remix-settings'+pfix);
        if (!item) return;
        this.#opts = JSON.parse(item);
      }
    } catch (e) {
      system.log.warn('An error ocurred while parsing settings. Reverting to defaults.', e.toString(),e?.stack);
    }
    //nothing else should be here, see return above
  }

  getOpt(opt, def) {
    if (this.#opts.hasOwnProperty(opt)) {
      return this.#opts[opt];
    } else {
      return def;
    }
  }
  getOptProp(opt, prop, def) {
    if (this.#opts.hasOwnProperty(opt)) {
      if (typeof this.#opts[opt] != 'object') return def;
      if (!this.#opts[opt].hasOwnProperty(prop)) return def;
      return this.#opts[opt][prop];
    } else {
      return def;
    }
  }

  setOpt(opt, val) {
    //this should be cleaned up
    this.#opts[opt] = val;
    this.#sync();
    this.#upd8Apps(opt);
  }
  setOptProp(opt, prop, val) {
    //this should be cleaned up
    if (typeof this.#opts[opt] != 'object') this.#opts[opt] = {};
    this.#opts[opt][prop] = val;
    this.#sync();
    this.#upd8Apps(opt);
  }
  toggleOpt(opt) {
    //this should be cleaned up
    this.#opts[opt] = !this.#opts[opt];
    this.#sync();
    this.#upd8Apps(opt);
  }

  delOpt(opt) {
    delete this.#opts[opt];
    this.#sync();
    this.#upd8Apps(opt);
  }
  delOptProp(opt,prop) {
    if (typeof this.#opts[opt] != 'object') return;
    delete this.#opts[opt][prop];
    this.#sync();
    this.#upd8Apps(opt);
  }

  #upd8Apps(opt) {
    if (opt.startsWith('startmenu.')) system.startmenu.updateSettings();
    if (opt.startsWith('theme.')) { system.theming.upd8(); system.topbar.updateSettings();system.startmenu.updateSettings() };
  }

  #sync() {
    if (this.#uhome) {
      this.#sys.fs.writeFile(this.#uhome+'/settings.json',JSON.stringify(this.#opts),(err)=>{
        if (err) {
          this.#sys.log.warn("Failed to save settings",err,err?.stack);
          if (err?.code == 'ENOENT') { //the user's home doesn't exist??
            this.#sys.log.info('[settings] Attempting to create the user\'s home directory');
            this.#sys.fsPromise.mkdir(this.#uhome).then(x=>{this.#sys.log.info('[settings] Home created, trying again!');this.#sync()}).catch(x=>this.#sys.log('[settings] Home folder failed to create!',x,x.stack));
          }
        };
      })
    } else {
      if (Object.keys(this.#opts).length) {
        this.#lst.setItem('__win8remix-settings'+this.#pfix, JSON.stringify(this.#opts));
      } else {
        this.#lst.removeItem('__win8remix-settings'+this.#pfix);
      }
      
    }
  }
}
