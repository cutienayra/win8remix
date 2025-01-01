class FirstBoot {
  #elem = null;
  #cPage = 0;
  #pages = [];
  #unInput = null;
  #next() {
    this.#pages[this.#cPage].classList.add('fbt_hide');
    this.#cPage++;
    if (this.#cPage >= this.#pages.length) {
      system._globSettingsPleaseUseNormalSettingsAndNotThis.setOpt('auth.systemSetUp',true);
      system.shutdown.liReboot();
    } else {
      this.#pages[this.#cPage].classList.remove('fbt_hide');
    }
  }
  constructor() {
    let nextBtn,pages=this.#pages;
    this.#elem = div([],{position:'fixed',top:'0',left:'0',width:'100%',height:'100%',color:'white'},[
      insertText(elem('style'),'.fbt_hide{display:none}'),
      elem('img'),
      pages[0] = div([],{},[
        insertText(elem('h1'),'Welcome to Windows 8 Remix'),
        insertText(div(),"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."),
      ]),
      pages[1] = div(['fbt_hide'],{},[
        insertText(elem('h1'),'Create your account'),
        elem('input')
      ]),
      nextBtn = insertText(button(),'Next')
    ]);
    nextBtn.addEventListener('click',()=>{
      this.#next();
    })
    document.body.appendChild(this.#elem);
  }
}