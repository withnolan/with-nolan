/* Benchmark screenshots: the first screen and one scroll of each reference, desktop and phone. Nothing of Nolan's is loaded here. */
const {chromium}=require("playwright");
const path=require("path");
const OUT=path.join(__dirname,"..","screenshots");
const SITES={igloo:"https://www.igloo.inc/",messenger:"https://messenger.abeto.co/",nasaeyes:"https://eyes.nasa.gov/apps/solar-system/",things:"https://culturedcode.com/things/"};
(async()=>{
  const b=await chromium.launch({args:["--use-angle=d3d11","--enable-gpu","--ignore-gpu-blocklist"]});
  for(const [dev,vp] of [["desk",{width:1440,height:900}],["phone",{width:390,height:844}]]){
    for(const [k,u] of Object.entries(SITES)){
      const ctx=await b.newContext({viewport:vp,isMobile:dev==="phone",hasTouch:dev==="phone",deviceScaleFactor:dev==="phone"?2:1});
      const p=await ctx.newPage();
      try{
        await p.goto(u,{waitUntil:"domcontentloaded",timeout:45000});
        await p.waitForTimeout(12000);
        await p.screenshot({path:path.join(OUT,`bench-${dev}-${k}-1.jpg`),type:"jpeg",quality:65});
        await p.mouse.wheel(0,vp.height*1.5); await p.waitForTimeout(4000);
        await p.screenshot({path:path.join(OUT,`bench-${dev}-${k}-2.jpg`),type:"jpeg",quality:65});
        console.log("ok",dev,k);
      }catch(e){ console.log("FAIL",dev,k,e.message.split("\n")[0]); }
      await ctx.close();
    }
  }
  await b.close();
})();
