/* ==========================================================
   settings.js — the Settings page (#settings, gear icon in the header):
   language, Effects (animations and quality together), and Log out (for a guest: leave guest mode). Each choice is a segmented control;
   saving and applying are done by saveSetting() in prefs.js.
   ========================================================== */
(function(){
  const box=$("#settingsList");
  const ROWS=[
    {key:"lang",  label:"s.set.lang",   help:"s.set.langHelp",
     options:[["es","Español"],["en","English"]]},          /* each language in its own name */
    /* animations and quality, as one choice (LOOKS in prefs.js) */
    {key:"look",  label:"s.set.look",   help:"s.set.lookHelp",
     options:Object.keys(LOOKS).map(v=>[v,t("s.set.look."+v)])},
    /* the mouse wheel glides (smooth.js); no reload needed */
    {key:"scroll",label:"s.set.scroll", help:"s.set.scrollHelp",
     options:[["smooth",t("s.set.scroll.smooth")],["native",t("s.set.scroll.native")]]},
    /* supernovas on their own now and then (wonders.js); only with the 3D universe, no reload needed. Its
       button sets a quick one off at once and leaves just the sky to watch it */
    {key:"nova",  label:"s.set.nova",   help:"s.set.novaHelp", cls:"set-nova", extra:"nova",
     options:[["on",t("s.set.nova.on")],["off",t("s.set.nova.off")]]}
  ];
  const current=k=>k==="look"?currentLook():SETTINGS[k];
  function render(){
    box.innerHTML=ROWS.map(r=>`<div class="set-row${r.cls?" "+r.cls:""}"><div class="set-txt"><b id="set-${r.key}">${esc(t(r.label))}</b>`+
      `<p>${esc(t(r.help))}</p></div>`+
      `<div class="seg" role="radiogroup" aria-labelledby="set-${r.key}" data-key="${r.key}">`+
      r.options.map(o=>`<button type="button" role="radio" data-value="${o[0]}" aria-checked="${current(r.key)===o[0]}"`+
        `${o[0]==="es"||o[0]==="en"?` lang="${o[0]}"`:""}>${esc(o[1])}</button>`).join("")+
      `</div>`+(r.extra==="nova"?`<button type="button" class="nova-btn" id="novaNow">${esc(t("s.set.novaNow"))}</button>`:"")+
      `</div>`).join("")+
      `<p class="set-note">${esc(t("s.set.reload"))}</p>`+
      /* Log out: this device forgets the PIN and the PIN screen comes back (a guest: leaves
         guest mode, back to that screen; css shows the words that fit, cinema.css) */
      `<div class="set-row set-danger"><div class="set-txt"><b><span class="own">${esc(t("s.logout"))}</span><span class="guest">${esc(t("s.guestExit"))}</span></b>`+
      `<p><span class="own">${esc(t("s.logoutHelp"))}</span><span class="guest">${esc(t("s.guestExitHelp"))}</span></p></div>`+
      `<button type="button" class="logout-btn" id="logout"><span class="own">${esc(t("s.logout"))}</span><span class="guest">${esc(t("s.guestExit"))}</span></button></div>`;
  }
  box.addEventListener("click",ev=>{
    if(ev.target.closest("#logout")){ Gate.lock(); return; }
    if(ev.target.closest("#novaNow")){ if(typeof Wonders!=="undefined"&&Wonders.boom()) View.show(); return; }
    const b=ev.target.closest(".seg button"); if(!b) return;
    const key=b.parentNode.dataset.key;
    b.parentNode.querySelectorAll("button").forEach(x=>x.setAttribute("aria-checked",String(x===b)));
    saveSetting(key,b.dataset.value);
  });
  /* arrow keys move within a group; Enter or Space chooses (choosing reloads the page,
     so moving alone must not choose) */
  box.addEventListener("keydown",ev=>{
    const b=ev.target.closest(".seg button"); if(!b||!["ArrowLeft","ArrowRight"].includes(ev.key)) return;
    const all=[...b.parentNode.querySelectorAll("button")], i=all.indexOf(b);
    all[(i+(ev.key==="ArrowRight"?1:all.length-1))%all.length].focus(); ev.preventDefault();
  });
  render();
})();
