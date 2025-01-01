class Scaffolding {
  #elems = [];
  register(element) {
    if (this.#elems.includes(element)) return;
    this.#elems.push(element);
    element.addEventListener('mousedown',()=>{
      this.activate(element);
    });
    this.update();
  }
  getActive() {
    return this.#elems[this.#elems.length - 1];
  }
  unregister(element) {
    if (!this.#elems.includes(element)) return;
    this.#elems.splice(this.#elems.indexOf(element),1);
    this.update();
  }
  activate(element) {
    if (!this.#elems.includes(element)) return;
    this.#elems.splice(this.#elems.indexOf(element),1);
    this.#elems.push(element);
    this.update();
  }
  update() {
    this.#elems.forEach((x,i)=>{
      try {
        x.style.zIndex = i+1;
      } catch (e) {
        system.log.warn('Scaffolding error',e);
      }
    })
  }
}