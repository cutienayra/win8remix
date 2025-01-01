class FileOpener {
  #openers = {};
  constructor(log,settings) {
    
  }
  insertData(fn,data) {
    fn.openData = data;
    return fn;
  }
  register(ext,fn) {
    this.#openers[ext] = fn;
  }
  registerMulti(exts,fn) {
    exts.forEach(ext=>
      this.#openers[ext] = fn
    );
  }
  getType(file) {
    const defType = 'text'
    try {
      /*if (!await system.fsPromise.exists(file)) {
        return defType;
      }
      if (await system.fsPromise.isDirectory(file)) {
        return 'folder';
      }*/
      let spl = file.split('.');
      let ext = spl[spl.length-1] || '';
      if (typeof this.#openers[ext] == 'function' && typeof this.#openers[ext].openData == 'object' && typeof this.#openers[ext].openData?.icon == 'string') {
        return this.#openers[ext].openData.icon || defType;
      } else {
        return defType;
      }
    } catch (e) {
      return defType;
    }
  }
  async open(file) {
    if (!await system.fsPromise.exists(file)) {
      system.msgBox("Input doesn't exist");
      return
    }
    if (await system.fsPromise.isDirectory(file)) {
      viewDirectory(file);
      return;
    }
    let spl = file.split('.');
    let ext = spl[spl.length-1] || '';
    if (typeof this.#openers[ext] == 'function') {
      this.#openers[ext](file);
    } else {
      system.msgBox('You don\'t have any applications that can open this file!')
    }
  }
}