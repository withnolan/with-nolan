/* Igloo Inc (Awwwards Site of the Year 2024) takes long to load: one long wait, then two frames. */
const {chromium}=require("playwright");
const path=require("path");
(async()=>{
  const b=await chromium.launch({args:["--use-angle=d3d11","--enable-gpu","--ignore-gpu-blocklist"]});
  const p=await b.newPage({viewport:{width:1440,height:900}});
  await p.goto("https://www.igloo.inc/",{waitUntil:"load",timeout:60000}).catch(()=>{});
  await p.waitForTimeout(40000);
  await p.screenshot({path:path.join(__dirname,"..","screenshots","bench-desk-igloo-3.jpg"),type:"jpeg",quality:65});
  await p.mouse.move(700,450); await p.mouse.wheel(0,1400); await p.waitForTimeout(5000);
  await p.screenshot({path:path.join(__dirname,"..","screenshots","bench-desk-igloo-4.jpg"),type:"jpeg",quality:65});
  await b.close();
})();
