/* The first seconds of a fresh session, as Nolan gets them: frames at fixed times after the page starts loading.
   Device key set before loading (never a PIN); cloud and weather blocked. */
const {chromium}=require("playwright");
const path=require("path");
const DEVICE="f9d8f1cd96a7b5ffd4c1f01c7f5f0a7c00940726b33625b4755a1d4f25a91f20";
const OUT=path.join(__dirname,"..","screenshots");
(async()=>{
  const b=await chromium.launch({args:["--use-angle=d3d11","--enable-gpu","--ignore-gpu-blocklist"]});
  for(const dev of ["desk","phone"]){
    const vp=dev==="phone"?{width:390,height:844}:{width:1440,height:900};
    const ctx=await b.newContext({viewport:vp,isMobile:dev==="phone",hasTouch:dev==="phone",deviceScaleFactor:dev==="phone"?2:1});
    const p=await ctx.newPage();
    await p.route("https://api.jsonbin.io/**",r=>r.abort());
    await p.route(/open-meteo\.com|bigdatacloud\.net/,r=>r.abort());
    await p.addInitScript(([k,s])=>{ localStorage.setItem("nolan-device",k); localStorage.setItem("settings",s); },[DEVICE,JSON.stringify({lang:"es"})]);
    const t0=Date.now();
    await p.goto("file:///C:/Users/sheng/Desktop/Nolan/index.html?tier="+dev+"#home",{waitUntil:"commit"});
    for(const s of [1,2.5,4,5.5,7.5]){
      const wait=t0+s*1000-Date.now(); if(wait>0) await p.waitForTimeout(wait);
      const st=await p.evaluate(()=>typeof Universe!=="undefined"?{ready:Universe.ready(),busy:Universe.busy()}:{}).catch(()=>({}));
      await p.screenshot({path:path.join(OUT,`${dev}-first-${String(s).replace(".","_")}s.jpg`),type:"jpeg",quality:60});
      console.log(dev,s+"s",JSON.stringify(st));
    }
    await ctx.close();
  }
  await b.close();
})();
