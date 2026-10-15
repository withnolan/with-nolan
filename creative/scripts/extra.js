/* Entry screen (no device key: never types a PIN), a guest's home, Nolan's week and day, English home, and the live site's Earth.
   Blocks the cloud and the weather in every page. */
const {chromium}=require("playwright");
const path=require("path");
const DEVICE="f9d8f1cd96a7b5ffd4c1f01c7f5f0a7c00940726b33625b4755a1d4f25a91f20";
const LOCAL="file:///C:/Users/sheng/Desktop/Nolan/index.html", LIVE="https://withnolan.github.io/with-nolan/";
const OUT=path.join(__dirname,"..","screenshots");
const ready=p=>p.waitForFunction(()=>typeof Universe!=="undefined"&&Universe.ready()&&!Universe.busy(),null,{timeout:60000}).catch(()=>console.log("  (not ready)"));
async function page(b,dev,{key=true,lang="es"}={}){
  const vp=dev==="phone"?{width:390,height:844}:{width:1440,height:900};
  const ctx=await b.newContext({viewport:vp,isMobile:dev==="phone",hasTouch:dev==="phone",deviceScaleFactor:dev==="phone"?2:1});
  const p=await ctx.newPage();
  await p.route("https://api.jsonbin.io/**",r=>r.abort());
  await p.route(/open-meteo\.com|bigdatacloud\.net/,r=>r.abort());
  await p.addInitScript(([k,s])=>{ if(k) localStorage.setItem("nolan-device",k); localStorage.setItem("settings",s); },[key?DEVICE:null,JSON.stringify({lang})]);
  return p;
}
const shot=(p,f)=>p.screenshot({path:path.join(OUT,f),type:"jpeg",quality:70}).then(()=>console.log(f));
(async()=>{
  const b=await chromium.launch({args:["--use-angle=d3d11","--enable-gpu","--ignore-gpu-blocklist"]});
  for(const dev of ["desk","phone"]){
    const tier="?tier="+dev;
    let p=await page(b,dev,{key:false});                       /* the entry screen */
    await p.goto(LOCAL+tier+"#home"); await p.waitForTimeout(6000); await shot(p,`${dev}-es-gate.jpg`); await p.context().close();
    p=await page(b,dev,{key:false});                           /* a guest */
    await p.goto(LOCAL+tier+"&guest#home"); await ready(p); await p.waitForTimeout(1500); await shot(p,`${dev}-es-guest.jpg`); await p.context().close();
    p=await page(b,dev);                                       /* Nolan's week and day */
    await p.goto(LOCAL+tier+"#nolan/semana"); await ready(p); await p.waitForTimeout(1500); await shot(p,`${dev}-es-nolan-semana.jpg`);
    await p.evaluate(()=>{ location.hash="nolan/dia"; }); await p.waitForTimeout(2500); await shot(p,`${dev}-es-nolan-dia.jpg`);
    await p.evaluate(()=>{ location.hash="settings"; }); await p.waitForTimeout(2500); await shot(p,`${dev}-es-settings.jpg`); await p.context().close();
    p=await page(b,dev,{lang:"en"});                           /* English home */
    await p.goto(LOCAL+tier+"#home"); await ready(p); await p.waitForTimeout(1500); await shot(p,`${dev}-en-home-1.jpg`);
    await p.evaluate(()=>{ const po=document.getElementById("portal"); po.scrollTop=po.scrollHeight; }); await p.waitForTimeout(1200); await shot(p,`${dev}-en-home-end.jpg`); await p.context().close();
    p=await page(b,dev);                                       /* the live Earth, with its real pictures */
    await p.goto(LIVE+tier+"#earth"); await ready(p); await p.waitForTimeout(4000); await shot(p,`${dev}-live-earth.jpg`); await p.context().close();
  }
  await b.close();
})();
