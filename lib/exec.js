class HashError extends Error {
  constructor(message, options) {
    super(message, options);
  }
}
const rootKeyHash = '6ccb0dea3696dfc11bcd41319406225ac7ea06ea40e2cb45d41bb1fd346b4a31';
class ExecutableHandler {
  #inner = null;
  #checkedApps = [];
  constructor(opener) {
    // TODO: Remove this test line
    system.drives.S = {path:'/sys'};
    opener.register('ex3',(p)=>this.runExe(p));
    this.#inner = fetch('lib/execInner.js').then(x=>x.text());
  }
  #isIn(path,dir) {
    return BrowserFS.BFSRequire('path').normalize(dir+'/'+path).startsWith(dir);
  }
  #assertType(inp,type,px) {
    if (typeof inp != type) throw new TypeError(`${px} is not of type ${type}`)
  }
  #assertTypeOptional(inp,type,px) {
    if (inp == undefined) return;
    if (typeof inp != type) throw new TypeError(`${px} is not of type ${type}`)
  }
  #assertInstanceOf(inp,type,px) {
    if (!(typeof inp == 'object' && inp instanceof type)) throw new TypeError(`${px} is not an instance of ${type.name}`)
  }
  #assertInstanceOfOptional(inp,type,px) {
    if (inp == undefined) return;
    if (!(typeof inp == 'object' && inp instanceof type)) throw new TypeError(`${px} is not an instance of ${type.name}`)
  }
  #promiseCreateZfs(options) {
    return new Promise((res,rej)=>{
      BrowserFS.FileSystem.ZipFS.Create(options,(e,fs)=>{
        if (e) return rej(e);
        res(fs);
      })
    })
  }
  
  #sha256Buffer(ascii) {
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32 - amount));
    };
    
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;
    
    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = this.#sha256Buffer.h = this.#sha256Buffer.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = this.#sha256Buffer.k = this.#sha256Buffer.k || [];
    var primeCounter = k[lengthProperty];
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }
    
    //ascii += '\x80' // Append ' bit (plus zero padding)
    ascii = system.buffer.Buffer.concat([ascii,system.buffer.Buffer([0x80])]);
    var aLength = ascii[lengthProperty];
    var aGrow = 0;
    while (aLength%64 - 56) {aLength++;aGrow++} // More zero padding
    var addArr = system.buffer.Buffer.from(Array(aGrow).fill(0));
    ascii = system.buffer.Buffer.concat([ascii,addArr]);
    addArr = null;
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii[i];
        if (j>>8) return; // ASCII check: only accept characters in range 0-255
        words[i>>2] |= j << ((3 - i)%4)*8;
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)
    
    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);
        
        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            // Used below if 
            var w15 = w[i - 15], w2 = w[i - 2];

            // Iterate
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e&hash[5])^((~e)&hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                    )|0
                );
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
            
            hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash[4] = (hash[4] + temp1)|0;
        }
        
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i])|0;
        }
    }
    
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i]>>(j*8))&255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};
    #sha256String(ascii) {
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32 - amount));
    };
    
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;
    
    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = this.#sha256String.h = this.#sha256String.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = this.#sha256String.k = this.#sha256String.k || [];
    var primeCounter = k[lengthProperty];
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }
    
    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j>>8) return; // ASCII check: only accept characters in range 0-255
        words[i>>2] |= j << ((3 - i)%4)*8;
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)
    
    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);
        
        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            // Used below if 
            var w15 = w[i - 15], w2 = w[i - 2];

            // Iterate
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e&hash[5])^((~e)&hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                    )|0
                );
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
            
            hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash[4] = (hash[4] + temp1)|0;
        }
        
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i])|0;
        }
    }
    
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i]>>(j*8))&255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};
  async #checkFile(base,file,sums) {
    if (file.startsWith('/')) file = file.slice(1);
    if (file == 'sum.json') return;
    if (!sums[file]) throw ReferenceError(`Extraneous file: ${file}`);
    const content = await system.fsPromise.readFile(base+'/'+file);
    const hash = this.#sha256Buffer(content);
    if (hash !== sums[file]) throw new HashError(`File ${file} has the wrong hash. (expected ${sums[file]} got ${hash})`);
    
  }
  async #checkDir(base,dir,sums) {
    const list = await system.fsPromise.readdir(base+'/'+dir);
    const prs = [];
    for (let ent of list) {
      if (await system.fsPromise.isDirectory(base+'/'+dir+'/'+ent)) {
        prs.push(this.#checkDir(base,dir+'/'+ent,sums))
      } else {
        prs.push(this.#checkFile(base,dir+'/'+ent,sums));
      }
    }
    await Promise.all(prs);
  }
  runExe(path) {
    return this.#runExe(path);
  }
  async #runExe(path) {
    const fileContent = await system.fsPromise.readFile(path);
    const hash = this.#sha256Buffer(fileContent);
    if (!(await system.fsPromise.exists('/sys/apps/'+hash))) {
      const zfsObj = await this.#promiseCreateZfs({zipData:fileContent})
      system.fs.getRootFS().mount('/sys/apps/'+hash,zfsObj);
    }
    if (!this.#checkedApps.includes(hash)) {
      const pfix = '/sys/apps/'+hash+'/';
      const sumData = JSON.parse((await system.fsPromise.readFile(pfix+'sum.json')).toString());
      if (typeof sumData != 'object') throw new TypeError('sumData is not an object');
      if (typeof sumData.files != 'object') throw new TypeError('files is not an object');
      if (typeof sumData.filesSum != 'string') throw new TypeError('filesSum is not a string');
      if (!(this.#sha256String(JSON.stringify(sumData.files))) == sumData.filesSum) {
        throw new HashError('filesSum is not valid');
      }
      if (sumData.signing) {
        this.#assertType(sumData.signing,'object','signing');
        //if (typeof sumData.signing.filesSumSign != 'string') throw new TypeError('signing.filesSumSign is not an object');
        this.#assertType(sumData.signing.filesSumSign,'string','signing.filesSumSign');
        this.#assertInstanceOf(sumData.signing.keys,Array,'signing.keys');
        
        let pkey;
        for (let keyI in sumData.signing.keys) {
          let key = sumData.signing.keys[keyI];
          this.#assertType(key,'object','signing.keys['+keyI+']');
          this.#assertType(key.hash,'string','signing.keys['+keyI+'].hash');
          this.#assertType(key.data,'object','signing.keys['+keyI+'].data');
          this.#assertType(key.data.key,'object','signing.keys['+keyI+'].data.key');
          
          if (!(this.#sha256String(JSON.stringify(key.data))) == key.hash) {
            throw new HashError('key'+keyI+' hash is not valid');
          }
          if (keyI == (sumData.signing.keys.length-1)) {
            if (key.hash != rootKeyHash) {
              throw new HashError('Unknown root key');
            }
          } else {
            this.#assertType(key.hashSig,'string','signing.keys['+keyI+'].hashSig');
            
          }
          if (pkey) {
            const pbKey = await crypto.subtle.importKey('jwk',key.data.key,{name:'RSA-PSS',hash:'SHA-256'},true,['verify']);
            const enc = new TextEncoder();
            const sigAb = await fetch('data:application/octet-binary;base64,'+pkey.hashSig).then(x=>x.arrayBuffer());
            if (await crypto.subtle.verify({name:'RSA-PSS',saltLength:32},pbKey,sigAb,enc.encode(pkey.hash))) {} else {
          throw new ValueError('Invalid signature');
        }
          }
          pkey=key;
        }
        const sKey = sumData.signing.keys[0];
        if (!(this.#sha256String(JSON.stringify(sKey.data))) == sKey.hash) {
          throw new HashError('key0 hash is not valid');
        }
        // TODO: verify the entire chain
        const crKey = await crypto.subtle.importKey('jwk',sKey.data.key,{name:'RSA-PSS',hash:'SHA-256'},true,['verify']);
        const enc = new TextEncoder();
        const sigAb = await fetch('data:application/octet-binary;base64,'+sumData.signing.filesSumSign).then(x=>x.arrayBuffer());
        if (await crypto.subtle.verify({name:'RSA-PSS',saltLength:32},crKey,sigAb,enc.encode(sumData.filesSum))) {} else {
          throw new ValueError('Invalid signature');
        }
      }
      await this.#checkDir('/sys/apps/'+hash,'',sumData.files);
      this.#checkedApps.push(hash);
    }
    const prefix = '/sys/apps/'+hash+'/';
    let manifest = JSON.parse(await system.fsPromise.readFile(prefix+'manifest.json')+'');
    if (typeof manifest != 'object') throw new TypeError('Invalid manifest');
    this.#assertType(manifest.manifestVersion,'number','manifestVersion');
    if (manifest.manifestVersion < 1 || manifest.manifestVersion > 1) throw ValueError('Invalid manifest version');
    this.#assertType(manifest.id,'string','id');
    this.#assertType(manifest.name,'string','name');
    this.#assertTypeOptional(manifest.icon,'string','icon');
    this.#assertType(manifest.version,'string','version');
    this.#assertType(manifest.entrypoint,'string','entrypoint');
    
    let appWin = new AppWindow('Loading...',{},()=>{
      
    })
    let fr = elem('iframe');
    let ei = await this.#inner;
    fr.sandbox='allow-scripts allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-scripts';
    fr.src='data:text/html;base64,'+btoa(`<!doctype html><html><body><script>document.currentScript.remove();((org)=>{${ei}})(${JSON.stringify(location.origin+'')})</script></body></html>`);
    fr.style.width='100%';
    fr.style.height='100%';
    fr.style.border='none';
    fr.style.display='block';
    window.addEventListener('message',async (d)=>{
      if (d.source !== fr.contentWindow) return;
      if (typeof d.data != 'object') return;
      if (typeof d.data.type != 'string') return;
      
      switch (d.data.type) {
        case 'getFile':
          this.#assertType(d.data.file,'string','file');
          let file = d.data.file;
          if (!this.#isIn(file,prefix)) return fr.contentWindow.postMessage({type:'fileError',id:d.data.id},'*');;
          try {
            let fileCont = await system.fsPromise.readFile(prefix+file);
            fr.contentWindow.postMessage({type:'fileResult',data:fileCont,id:d.data.id},'*');
          } catch (e) {
            system.log.warn('File access error',e,e?.stack);
            fr.contentWindow.postMessage({type:'fileError',id:d.data.id},'*');
          }
      }
    })
    appWin.windowBody.appendChild(fr);
    //console.log(sumData);
  }
}
