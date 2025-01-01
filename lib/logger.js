class Logger {
  entries = [];
  watchers = [];
  #updateWatchers() {
    this.watchers.forEach(x=>{
      if (typeof x != 'function') return;
      try {
        x(this.entries);
      } catch (e) {
        console.error(e); //do not create an infinite loop
      }
    })
  }
  niceError(e) {
    if (e.stack) {
      return [e,'\n'+e.stack]
    } else {
      return [e];
    }
  }
  print(...msg) {
    this.entries.push({type:'print',msg});
    this.#updateWatchers();
    console.log(...msg);
  }
  error(...msg) {
    this.entries.push({type:'error',msg});
    this.#updateWatchers();
    console.error(...msg);
  }
  warn(...msg) {
    this.entries.push({type:'warn',msg});
    this.#updateWatchers();
    console.warn(...msg);
  }
  info(...msg) {
    this.entries.push({type:'info',msg});
    this.#updateWatchers();
    console.info(...msg);
  }
  trace(...msg) {
    var stacktrace = stack(1);
    this.entries.push({type:'trace',msg:[...msg,'\n'+stacktrace]});
    this.#updateWatchers();
    console.log(...msg,'\n'+stacktrace);
  }
}

