class FileExplorerApp extends Application {
  //Application configuration
  static appName = 'File Explorer';
  static icon = '/apps/file-explorer/icon.png';
  static appCategory = 'sys';
  static appId = 'file-explorer';
  windowOptions = {height: '395px', overflow: 'hidden', width: '650px'};
  //End application configuration
  #zDriveData = [];
  #zDriveData1 = [];
  #zDriveDir = '/';
  #fsDir = '/';
  #fsEntryDir = '/';
  #driveLET = '?:'
  constructor(arg0, args, launchType) {
    super();
    this.__init(arg0, args, launchType);
    this.home();
  }
  isImg(fp) {
    if (typeof fp != 'string') return false;
    return fp.endsWith('.png') || fp.endsWith('.gif') || fp.endsWith('.jpg') || fp.endsWith('.jpeg') || fp.endsWith('.webp') || fp.endsWith('.ico') || fp.endsWith('.bmp')
  }
  isVid(fp) {
    if (typeof fp != 'string') return false;
    return fp.endsWith('.webm') || fp.endsWith('.mp4')|| fp.endsWith('.mkv')|| fp.endsWith('.avi')|| fp.endsWith('.mov')|| fp.endsWith('.mpg')|| fp.endsWith('.3gp')
  }
  home() {
    this.window.windowBody.innerHTML = `<div class="window-html" style="">
  <div class="window-html-content nodrag wexplorer-app">
    <div class="view-box">
      <table>
        <tbody>
          <tr>
                    <td>
                      <a class="drive dir" id="cdrive">C:\\ (Windows 8 Remix)
                      </a>
                    </td>
                    </tr>
                    <tr>
                    <td>
                      <a class="netdrv dir" id="zdrive">Z:\\ (Source code)
                      </a>
                    </td>
                  </tr>
                    <tr>
                    <td>
                      <a class="drive dir" id="root">/ (Root)
                      </a>
                    </td>
                    </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
<footer class="file-footer fe"><div class="btns"><button class="back disabled"></button><button class="forw disabled"></button></div><input class="textbox disabled" value=".." disabled="disabled"><button class="search disabled"></button></footer><footer class="status-footer">File Explorer has loaded 2 items successfully!</footer>
</div>
`;
    //this.window.windowBody.querySelector('#zdrive').remove();
    if (!system.settings.getOpt('experiments.root',false)) {
      this.window.windowBody.querySelector('#root').remove();
    } else {
      this.window.windowBody.querySelector('#root').addEventListener('click',() => this.rootDrive());
    }
    this.window.windowBody.querySelector('#zdrive').addEventListener('click', () => this.zDrive());
    this.window.windowBody.querySelector('#cdrive').addEventListener('click', () => this.cDrive());
  }
  /*zDrive() {
    if (!this.#zDriveData.length) {
      //this.window.windowBody.innerHTML='Loading, please wait...';
      this.window.windowBody.innerHTML = '';
      this.window.setTitle('Z:' + this.#zDriveDir.replace(/\//g, '\\') + ' - ' + this.name);
      this.window.windowBody.appendChild(div(['window-html'], {}, [
        div(['window-html-content', 'nodrag', 'wexplorer-app'], {}, [
          div(['view-box'], {}, [
            elem('table', [], {}, [
              elem('tbody', [], {}, [
                elem('tr', [], {}, [
                  elem('td', [], {}, [
                    insertText(elem('loader', [], {}, []), "Loading..."),
                    insertText(elem('loaderP', [], {}, []), "Please wait until the Source Code (Z:/) Drive loads successfully!")
                  ])
                ])
              ])
            ])
          ])
        ])
      ]));
      this.window.windowBody.appendChild(elem('footer', ['file-footer'], {}, [
        insertText(span([], {}, []), `Loading...`),
        /*elem('footer',['go-back-btn'],{},[
          insertText(elem('grn',[],{},[]),'Go Back!')
        ])* /
      ]));
      fetch('/apps/file-explorer/directory.json').then(x => x.json()).then(x => {
        fetch('/apps/file-explorer/file.json').then(y => y.json()).then(y => {
          this.#zDriveData1 = x;
          this.#zDriveData = y;
          window.zDD = y;
          window.zDD1 = x;
          window.rZ = this.renderZ;
          this.renderZ();
        }).catch((err) => {
          this.window.windowBody.innerHTML = 'An error ocurred while trying to get files.<br>' + err;
        });
      }).catch((err) => {
        system.log.warn('Failed to fetch The Z:\\ Drive', err + '');
        this.window.windowBody.innerHTML = 'An error ocurred while trying to get files.<br>' + err;
      })
    } else {
      this.renderZ();
    }
  }*/
  /*renderZ() {
    var files = this.#zDriveData.filter(x => x.startsWith(this.#zDriveDir));
    var filesSplit = files.map(x => x.split('/').slice(1 + (this.#zDriveDir.split('/').filter(x => x).length)));
    var dirs = this.#zDriveData1.filter(x => x.startsWith(this.#zDriveDir));
    var dirsSplit = dirs.map(x => x.split('/').slice(1 + (this.#zDriveDir.split('/').filter(x => x).length)));
    var dirs2Show = dirsSplit.filter(x => x.length == 1).filter(x => x != this.#zDriveDir.split('/')[this.#zDriveDir.split('/').length - 1]);
    var files2Show = filesSplit.filter(x => x.length == 1);
    var dirsElems = dirs2Show.map(x => {
      let elm = elem('tr', [], {}, [
        elem('td', [], {}, [
          insertText(elem('a', ['folder', 'dir'], {}, []), x[0])
        ])
      ]);
      elm.addEventListener('click', () => {
        this.#zDriveDir += (this.#zDriveDir.endsWith('/') ? '' : '/') + x[0];
        this.renderZ();
      })
      return elm
    });
    var filesElems = files2Show.map(x => {
      let elm = elem('tr', [], {}, [
        elem('td', [], {}, [
          insertText(elem('a', [this.isImg(x[0]) ? 'image' : 'text', 'dir'], {}, []), x)
        ])
      ]);
      elm.addEventListener('click', () => {
        var fp = this.#zDriveDir + (this.#zDriveDir.endsWith('/') ? '' : '/') + x[0];
        if (fp.endsWith('.ttf')) return alert('This file type is not supported!');
        if (this.isImg(fp)) {
          viewImageFile(fp, 'Z:' + fp.replace(/\//g, '\\'));
        } else {
          viewTextFile(fp, 'Z:' + fp.replace(/\//g, '\\'));

        }
        //alert("Opening files has not been implemented (yet)");
      });
      return elm;
    });
    let goback;
    //console.log(dirs2Show,files2Show);
    this.window.windowBody.innerHTML = '';
    this.window.windowBody.appendChild(div(['window-html'], { overflow: 'hidden' }, [
      div(['window-html-content', 'nodrag', 'wexplorer-app'], {}, [
        div(['view-box'], {}, [
          elem('table', [], {}, [
            elem('tbody', [], {}, [
              ...dirsElems,
              ...filesElems
            ])
          ])
        ])
      ])
    ]));
    let itemCount = dirs2Show.length + files2Show.length;
    this.window.windowBody.appendChild(elem('footer', ['file-footer'], {}, [
      insertText(span([], {}, []), `${itemCount} item${itemCount == 1 ? '' : 's'}`),
      elem('footer', ['go-back-btn'], {}, [
        goback = insertText(elem('grn', [], {}, []), 'Go Back!')
      ])
    ]));
    goback.addEventListener('click', () => {
      if (this.#zDriveDir == '/') {
        this.window.changeTitle(this.name);
        this.home();
        return
      }
      let a = this.#zDriveDir.split('/');
      a.pop();
      this.#zDriveDir = a.join('/');
      if (!this.#zDriveDir) this.#zDriveDir = '/';
      this.renderZ();
    })
    /*
    <div class="window-html" style="">
  <div class="window-html-content nodrag wexplorer-app">
    <div class="view-box">
      <table order="">
        <tbody>
          <tr style="left: 0;">
            <td sortable-data="1Backupparam">
              <table class="ellipsis">
                <tbody>
                  <tr>
                    <td>
                      <a class="folder dir">User
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
<footer class="file-footer">2 folders
  <footer class="go-back-btn">
    <grn id="cdrive">Go Back!
    </grn>
  </footer>
</footer>
</div>
* /
    this.window.setTitle('Z:' + this.#zDriveDir.replace(/\//g, '\\') + ' - ' + this.name);
  }*/
  #promiseStat(file) {
    return new Promise((res,rej)=>{
      system.fs.stat(file,(error,result)=>{
        if (error) return rej(error);
        res(result);
      })
    })
  }
  #promiseReaddir(file) {
    return new Promise((res,rej)=>{
      system.fs.readdir(file,(error,result)=>{
        if (error) return rej(error);
        res(result);
      })
    })
  }
  #promiseIsDir(file) {
    return new Promise((res,rej)=>{
      system.fs.readdir(file,(error,result)=>{
        if (error && error.code == 'ENOTDIR') return res(false);
        if (error) return rej(error);
        res(true);
      })
    })
  }
  zDrive() {
    this.#fsDir = '/mnt/Z';
    this.#fsEntryDir = '/mnt/Z';
    this.driveLET = 'Z:';
    this.renderFS();
  }
  rootDrive() {
    this.#fsDir = '/';
    this.#fsEntryDir = '/';
    this.driveLET = '';
    this.renderFS();
  }
  async renderFS() {
    try {
      // get files and directories
      this.window.windowBody.style.opacity='0.7';
      this.window.windowBody.style.pointerEvents='none';
      let list = await this.#promiseReaddir(this.#fsDir);
      let dirs = [],files=[];
      for (let item of list) {
        try {
          //var stat = await this.#promiseStat(this.#fsDir + (this.#fsDir.endsWith('/') ? '' : '/')+item);
          if (await this.#promiseIsDir(this.#fsDir + (this.#fsDir.endsWith('/') ? '' : '/')+item)) {
            dirs.push(item);
          } else {
            files.push(item);
          }
        } catch (err) {
          system.log.warn('renderfs failed to find type',err+(err?.stack ? '\n'+err.stack : ''));
        }
      }
      //console.log(files,dirs)
      files = files.sort();
      dirs  = dirs.sort().filter(x=>x!='___');
      //create elements
      var dirsElems = dirs.map(x => {
      let elm = elem('tr', [], {}, [
        elem('td', [], {}, [
          insertText(elem('a', ['folder', 'dir'], {}, []), x)
        ])
      ]);
      elm.addEventListener('click', () => {
        this.#fsDir += (this.#fsDir.endsWith('/') ? '' : '/') + x;
        this.renderFS();
      })
      return elm
    });
      
    var filesElems = files.map(x => {
      let elm = elem('tr', [], {}, [
        elem('td', [], {}, [
          insertText(elem('a', [this.isImg(x[0]) ? 'image' : 'text', 'dir'], {}, []), x)
        ])
      ]);
      elm.addEventListener('click', () => {
        var fp = this.#fsDir + (this.#fsDir.endsWith('/') ? '' : '/') + x;
        if (fp.endsWith('.ttf') || fp.endsWith('.gz') || fp.endsWith('.tar')) return alert('This file type is not supported!');
        if (fp.endsWith('.iso') || fp.endsWith('.zip')) return alert('This file type is not (yet) supported!'); 
        if (this.isImg(fp)) {
          viewImageFile('fs://'+fp, this.#fsEntryDir == '/' ? fp : (this.driveLET + "\\" + fp.replace(this.#fsEntryDir,'/').replace('//','').replace(/\//g, '\\')));
        } else if (this.isVid(fp)) {
          viewVideoFile('fs://'+fp, this.#fsEntryDir == '/' ? fp : (this.driveLET + "\\" + fp.replace(this.#fsEntryDir,'/').replace('//','').replace(/\//g, '\\')));
        } else if(fp.endsWith('.dos')) {
          if (window.runDOSBox) {runDOSBox(fp)} else {alert('The DOSBox experiment is not enabled!')};
        } else {
          if (window.editTextFile) {
            editTextFile(fp)
          } else {
          viewTextFile('fs://'+fp, this.#fsEntryDir == '/' ? fp : (this.driveLET +  "\\"+fp.replace(this.#fsEntryDir,'/').replace('//','').replace(/\//g, '\\')));
          }

        }
        //alert("Opening files has not been implemented (yet)");
      });
      return elm;
    });
      //create window body
      let goback;
      let goforw;
    this.window.windowBody.innerHTML = '';
    this.window.windowBody.appendChild(div(['window-html'], { overflow: 'hidden' }, [
      div(['window-html-content', 'nodrag', 'wexplorer-app'], {}, [
        div(['view-box'], {}, [
          elem('table', [], {}, [
            elem('tbody', [], {}, [
              ...dirsElems,
              ...filesElems
            ])
          ])
        ])
      ])
    ]));
    let itemCount = dirs.length + files.length;
    this.window.windowBody.appendChild(elem('footer', ['file-footer', 'fe'], {}, [
      elem('div', ['btns'], {}, [
        goback = elem('button', ['back', 'enabled'], {}, []),
        goforw = elem('button', ['forw', 'disabled'], {}, [])
      ]),
      elem('input', ['textbox', 'disabled'], {}, []),
      elem('button', ['search', 'disabled'], {}, [])
    ]));
    this.window.windowBody.appendChild(elem('footer', ['status-footer'], {}, [
      insertText(span([], {}, []), `File Explorer has loaded ${itemCount} item${itemCount == 1 ? '' : 's'} successfully!`)
    ]));
    goback.addEventListener('click', () => {
      if (this.#fsDir == this.#fsEntryDir) {
        this.window.changeTitle(this.name);
        this.home();
        return
      }
      let a = this.#fsDir.split('/');
      a.pop();
      this.#fsDir = a.join('/');
      if (!this.#fsDir) this.#fsDir = '/';
      this.renderFS();
    })
      this.window.windowBody.style.opacity='';
      this.window.windowBody.style.pointerEvents='';
      if (this.#fsEntryDir == '/') {
        this.window.setTitle(this.#fsDir + ' - ' + this.name);
      } else {
this.window.setTitle((this.driveLET+'\\'+this.#fsDir.replace(this.#fsEntryDir,'').replace(/\//g,'\\')).replace('\\\\','\\') + ' - ' + this.name);
      }
    } catch (err) {
      this.window.windowBody.style.opacity='';
      this.window.windowBody.style.pointerEvents='';
      this.window.windowBody.innerHTML='Something went wrong, check Event Viewer for the error.';
      system.log.warn('Error in renderFS:',err+(err?.stack ? '\n'+err.stack : ''));
    }
  }
  cDrive() {
    this.#fsDir = '/mnt/C';
    this.#fsEntryDir = '/mnt/C';
    this.driveLET = 'C:';
    this.renderFS();
    return;
    // if you want to change cDrive, edit in system.js
    // this.window.windowBody.innerHTML = `<div class="window-html" style=""><div class="window-html-content nodrag wexplorer-app"><div class="view-box"><table order=""><tbody><tr style="left: 0;"><td sortable-data="1Backupparam"><table class="ellipsis"><tbody><tr><td><a class="folder dir" id="progs">Program Files</a></td></tr><tr><td><a class="folder dir" id="usrs">Users</a></td></tr><tr><td><a class="folder dir" id="windir">Windows</a></td></tr></tbody></table></td></tr></tbody></table></div></div></div><footer class="file-footer">4 folders<footer class="go-back-btn"><grn id="backbtn">Go Back!</grn></footer></footer></div>`;
  }
}
system.app(() => {
  system.apps.register(FileExplorerApp);
}, 'file-explorer');