/* Creative audit screenshots. Never types the PIN: the device hash from tests/run.js is set before loading.
   Usage: node shoot.js [desk|phone] [es|en] [routes,comma,separated] 
   The headless browser is a robot to universe.js (navigator.webdriver: 0.4 resolution, few stars), so ?tier= forces what a real device draws. */
const {chromium}=require("playwright");
const path=require("path");
const DEVICE="f9d8f1cd96a7b5ffd4c1f01c7f5f0a7c00940726b33625b4755a1d4f25a91f20";
const PAGE="file:///C:/Users/sheng/Desktop/Nolan/index.html";
const OUT=path.join(__dirname,"..","screenshots");
const dev=process.argv[2]||"desk", lang=process.argv[3]||"es";
const ROUTES=(process.argv[4]||"home,schedule,planner,subjects,exams,tasks,nolan,spending,orion,blackhole,earth").split(",");
const VP=dev==="phone"?{width:390,height:844}:{width:1440,height:900};
const MAXSHOTS=dev==="phone"?5:3;
async function settle(p,extra=1200){
  await p.waitForFunction(()=>typeof Universe!=="undefined"&&Universe.ready()&&!Universe.busy(),null,{timeout:60000}).catch(()=>console.log("  (still busy)"));
  await p.waitForTimeout(extra);
}
async function shots(p,name){
  /* the scroller: home's portal if open, else the page */
  const n=await p.evaluate(()=>{
    const po=document.getElementById("portal");
    const w=document.querySelector("body > div.wrap");
    const el=po&&!po.hidden?po:(w&&w.scrollHeight>w.clientHeight+4?w:document.scrollingElement);
    window.__sc=el; el.scrollTop=0;
    return Math.ceil(el.scrollHeight/el.clientHeight);
  });
  for(let i=0;i<Math.min(n,MAXSHOTS);i++){
    if(i) { await p.evaluate(i=>{ window.__sc.scrollTop=i*window.__sc.clientHeight*0.85; },i); await p.waitForTimeout(900); }
    const f=`${dev}-${lang}-${name}-${i+1}.jpg`;
    await p.screenshot({path:path.join(OUT,f),type:"jpeg",quality:70});
    console.log(f);
  }
  await p.evaluate(()=>{ window.__sc.scrollTop=0; });
}
(async()=>{
  const b=await chromium.launch({args:["--use-angle=d3d11","--enable-gpu","--ignore-gpu-blocklist"]});
  const ctx=await b.newContext({viewport:VP,hasTouch:dev==="phone",isMobile:dev==="phone",deviceScaleFactor:dev==="phone"?2:1});
  const p=await ctx.newPage();
  p.on("pageerror",e=>console.log("PAGEERROR",e.message));
  await p.route("https://api.jsonbin.io/**",r=>r.abort());
  await p.route(/open-meteo\.com|bigdatacloud\.net/,r=>r.abort());
  await p.addInitScript(([k,s])=>{ localStorage.setItem("nolan-device",k); localStorage.setItem("settings",s); },[DEVICE,JSON.stringify({lang})]);
  const first=ROUTES[0];
  await p.goto(PAGE+"?tier="+(dev==="phone"?"phone":"desk")+"#"+first,{waitUntil:"load",timeout:60000});
  /* the opening flight: catch it mid-way once */
  await p.waitForFunction(()=>typeof Universe!=="undefined"&&Universe.ready(),null,{timeout:60000}).catch(()=>{});
  await p.waitForTimeout(1500);
  await p.screenshot({path:path.join(OUT,`${dev}-${lang}-opening.jpg`),type:"jpeg",quality:70});
  await settle(p,1500);
  for(const r of ROUTES){
    if(r!==first){ await p.evaluate(r=>{ location.hash=r; },r); await p.waitForTimeout(400); await settle(p); }
    await shots(p,r.replace(/\//g,"_"));
  }
  await b.close();
})();
