class ImgView extends Application {
  //Application configuration
  static appName = 'Image Viewer';
  static icon = '/apps/imgview/icon.png';
  static appCategory = 'acc';
  static appId = 'imgview';
  windowOptions = {resize:true};
  //End application configuration
  constructor(arg0,args,launchType) {
    super();
    this.name = 'Image Viewer' + (args[1] ? (' - ' + args[1]) : '');
    this.name = 'Image Viewer'
    this.__init(arg0,args,launchType);
    this.window.setWidthy();
    this.window.setMinWidth(503);
    this.window.setMinHeight(291);
    this.window.windowBody.appendChild(insertSrc(elem('img',[],{overflow:'hidden',height:'100%',margin:'auto',display:'flex'},[]),args[0] || '???'))
    this.window.windowBody.style.height = '256';
    this.window.windowBody.style.background = '#000000';
  }
}
function viewImageFile(link,ttl) {
  if (link.startsWith('fs://')) {
    system.fs.readFile(link.slice('fs://'.length),(error,data)=>{
      if (error) {
        system.log.warn('ImgView file fetch failed',error);
        var inst = new TextView('',['Failed to get file: '+error,'ImgView Error'],{type:'direct'});
        return
      }
      var spl = link.split('.');
      var ext = spl[spl.length-1].toLowerCase();
      var inst = new ImgView('Image Viewer',[`data:image/${ext};base64,${data.toString('base64')}`,ttl || link],{type:'direct'});
    });
  } else {
  //fetch(link).then(x=>x.text().then(x=>{
    var inst = new ImgView('Image Viewer',[link,ttl || link],{type:'direct'});
  /*})).catch(err=>{
    system.log.warn(err);
    var inst = new TextView('TextView',['Failed to get file:'+err,'ImgView error'],{type:'direct'});
  })*/
  }
}

system.app(()=>{},'imgview');
if (system.opener) {
  system.opener.registerMulti(['png','gif','jpg','jpeg','webp','ico','bmp'],system.opener.insertData((f)=>viewImageFile('fs://'+f),{icon:'image'}));
}