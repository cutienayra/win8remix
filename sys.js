

setTimeout(()=>{
    document.querySelector('.sys').innerHTML=`
    The Windows 8 Project (part of Fen Tech Co.) ~ 2022-2023<span class="blinky">_</span>
    `;
    },5);

setTimeout(()=>{
    document.querySelector('.sys').innerHTML=`
    The Windows 8 Project (part of Fen Tech Co.) ~ 2022-2023<br>2536MB in System<span class="blinky">_</span>
    `;
    },100);

setTimeout(()=>{
    document.querySelector('.sys').innerHTML=`
    The Windows 8 Project (part of Fen Tech Co.) ~ 2022-2023<br>2536MB in System<br>BIOS Check OK!<span class="blinky">_</span>
    `;
    },1750);

setTimeout(()=>{
    document.querySelector('.sys').innerHTML=`
    The Windows 8 Project (part of Fen Tech Co.) ~ 2022-2023<br>2536MB in System<br>BIOS Check OK!<br>Starting Windows from Primary Partiton (1)<span class="blinky">_</span>
    `;
    },2245);

setTimeout(()=>{
    document.querySelector('.sys').innerHTML=`
    The Windows 8 Project (part of Fen Tech Co.) ~ 2022-2023<br>2536MB in System<br>BIOS Check OK!<br>Starting Windows from Primary Partiton (1)<br>Starting Now<span class="blinky">_</span>
    `;
    },4500);

setTimeout(()=>{
  document.querySelector('.sys').innerHTML=`
  <span class="blinky">_</span>
  `;
    },5000);

setTimeout(()=>{
  document.querySelector('.sys').innerHTML=`
  `;
    },7500);

setTimeout(()=>{
  document.querySelector('.sys').innerHTML=`
  <div class="screenlogon"><div class="message-logon"><div class="boot"><img src="${logo}" style="width: 125px;height: 125px;margin-top: -7%; margin-bottom: 13.5%;"><br></div></div></div>
  `;
    },8500);

setTimeout(()=>{
  let bootscreen = document.querySelector('.boot');
  bootscreen.innerHTML=`
  ${bootscreen.innerHTML}<br><img src="${dots}" style="width: 30px;height: 30px;"><br></div></div></div>
  `;
    },9500);

 setTimeout(()=>{
  window.location = "win.html";
    },14000);