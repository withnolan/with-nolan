/* which graphics card the headless browser gets, and the canvas' render size */
const {chromium}=require("playwright");
(async()=>{
  for(const args of [[],["--use-angle=d3d11","--enable-gpu","--ignore-gpu-blocklist"]]){
    const b=await chromium.launch({args});
    const p=await b.newPage({viewport:{width:1440,height:900}});
    await p.route("https://api.jsonbin.io/**",r=>r.abort());
    await p.route(/open-meteo\.com|bigdatacloud\.net/,r=>r.abort());
    await p.goto("file:///C:/Users/sheng/Desktop/Nolan/index.html?guest#home");
    await p.waitForTimeout(6000);
    console.log(JSON.stringify(args), await p.evaluate(()=>{
      const c=document.createElement("canvas").getContext("webgl2"); const e=c&&c.getExtension("WEBGL_debug_renderer_info");
      const cv=[...document.querySelectorAll("canvas")].map(x=>x.width+"x"+x.height);
      return {r:e?c.getParameter(e.UNMASKED_RENDERER_WEBGL):"none", cv, busy:window.Universe&&Universe.busy()};
    }));
    await b.close();
  }
})();
