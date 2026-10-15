/* ==========================================================
   nolan.js — the Nolan section: one slim bar (the logo that goes home, his
   mark NOLAN_SVG, the windows, the time and date) over three windows of his
   own, one at a time:
     · Mes (#nolan, #nolan/mes): the month planner (planner.js), filling the
       screen; a day shows what fits and "+N" for the rest, which opens that day.
     · Semana (#nolan/semana): the seven days of a week side by side.
     · Día (#nolan/dia): one day, hour by hour.
   The day and the week show the UC3M classes and events, his weekly routine
   (ROUTINE in data.js), his plans (PERSONAL in data.js) and every event added
   with "+" (MyEvents, planner.js); the month, the events and plans. Adding is always the same
   form (the month's): the "+" of the day and the week opens it on that day.
   Its design is in css/nolan.css.
   ========================================================== */
const Nolan=(function(){
  const WINDOWS=[["mes","nolan.month"],["semana","nolan.week"],["dia","nolan.day"]];
  const ALIAS={day:"dia",today:"dia",hoy:"dia",week:"semana",month:"mes"};
  let box=null, cal=null, shown="mes", day=todayISO(), weekStart=null;
  const routine=()=>typeof ROUTINE!=="undefined"?ROUTINE:[];
  const personal=()=>typeof PERSONAL!=="undefined"?PERSONAL:[];
  const mondayOf=k=>addDays(k,-((fromISO(k).getDay()+6)%7));
  const okColor=c=>/^#[0-9a-f]{3,8}$/i.test(c||"")?c:"#FFA640";
  /* the first time of a text ("18:00", "12:30–14:00"), in minutes; none: -1 (it goes first, all day) */
  const minutesIn=s=>{ const m=/(\d{1,2})[:.](\d{2})/.exec(s||""); return m?+m[1]*60+ +m[2]:-1; };

  /* everything of one day, in order: {at, end, time, what, sub, color, kind} (end: the minute it is over) */
  function itemsOn(k){
    const out=[], dow=(fromISO(k).getDay()+6)%7;           /* 0 Monday … 6 Sunday */
    const evs=EVENTS.filter(e=>!e.noDay&&e.date<=k&&(e.until||e.date)>=k);
    /* an assessment that takes its subject's class slot (an exam in class time) is one row, not two */
    const taken=c=>evs.some(e=>isAssessment(e)&&e.subject===c.subject&&minutesIn(e.time)>=0&&minutesIn(e.time)<c.end&&endsAt(e)>c.start);
    classesOn(k).forEach(c=>{ const S=SUBJECTS[c.subject];
      if(taken(c)) return;
      out.push({at:c.start,end:c.end,time:hhmm(c.start)+"–"+hhmm(c.end),what:S.name,sub:c.kind+" · "+roomOn(c,k),color:S.color,kind:"class"}); });
    routine().filter(r=>r.day===dow&&(!r.from||k>=r.from)&&(!r.to||k<=r.to)).forEach(r=>
      out.push({at:minutesIn(r.start),end:r.end?minutesIn(r.end):minutesIn(r.start)+60,time:r.start+(r.end?"–"+r.end:""),what:r.what,sub:r.place||"",color:okColor(r.color),kind:"routine"}));
    evs.forEach(e=>{ const S=SUBJECTS[e.subject];
      if((e.type==="cl"||e.type==="cf")&&classesOn(k).some(c=>c.subject===e.subject)) return;          /* (already there as its class) */
      const c=classesOn(k).find(c=>c.subject===e.subject&&taken(c));
      out.push({at:minutesIn(e.time),end:lastDay(e)===k?endsAt(e):1440,time:e.time||"",what:S.short+" · "+e.what,sub:e.room||(c?roomOn(c,k):""),color:S.color,kind:e.type==="ex"?"exam":"event"}); });
    personal().concat(MyEvents.list()).filter(e=>e.date<=k&&(e.until||e.date)>=k).forEach(e=>
      out.push({at:minutesIn(e.time),end:(e.until||e.date)===k?endsAt(e):1440,time:e.time||"",what:e.what,sub:[e.place,e.note].filter(Boolean).join(" · "),color:okColor(e.color),kind:"plan"}));
    return out.sort((a,b)=>a.at-b.at);
  }
  const item=(x,past)=>`<li class="n-item ${x.kind}${past?" past":""}" style="--sc:${x.color}"><time>${esc(x.time||t("nolan.allDay"))}</time>`+
    `<span><b>${esc(x.what)}</b>${x.sub?`<em>${esc(x.sub)}</em>`:""}</span></li>`;
  /* a day off: a holiday, a break, or a holiday on one campus only */
  const offOn=k=>{ const r=noClassReason(k), h=holidayOn(k);
    if(r&&r.why==="holiday") return t("nolan.holiday");
    if(r&&r.why==="break") return periodOn(k).label;
    if(h&&h.campus) return t("today.noClass")+" · "+t("today.onlyCampus",{campus:CAMPUS[h.campus.toUpperCase()]});
    return ""; };
  const bar=(label,sub,attr)=>`<div class="m-title n-bar"><button class="m-nav" data-step="-1" aria-label="${esc(t("nolan.prev"))}">‹</button>`+
    `<span class="m-name">${esc(label)}${sub?`<small>${esc(sub)}</small>`:""}</span>`+
    `<button class="m-nav" data-step="1" aria-label="${esc(t("nolan.next"))}">›</button>`+
    `<button class="m-today" data-step="0">${esc(t("today.button"))}</button>`+
    `<button class="m-add" data-add="${attr}" aria-label="${esc(t("planner.addAria"))}"><b aria-hidden="true">+</b><span>${esc(t("planner.add"))}</span></button></div>`;

  /* the day in its parts (all day, morning, afternoon, night); on today, what is over is dimmed and a red
     line says where now is. Redrawn each minute, but only when something changed */
  const PARTS=[["allDay",-1,0],["morning",0,840],["afternoon",840,1260],["night",1260,1441]];
  function drawDay(){
    const list=itemsOn(day), d=fromISO(day), w=weekOf(day), now=new Date(), m=day===isoDate(now)?minutesOf(now):-1;
    let rows="", nowDone=m<0;
    const nowLine=()=>{ nowDone=true; return `<li class="n-now" aria-label="${esc(t("nolan.now",{time:hhmm(m)}))}"><span>${esc(t("nolan.now",{time:hhmm(m)}))}</span></li>`; };
    PARTS.forEach(([p,a,b])=>{
      const its=list.filter(x=>p==="allDay"?x.at<0:x.at>=a&&x.at<b), here=!nowDone&&p!=="allDay"&&m>=a&&m<b;
      if(!its.length&&!here) return;
      rows+=`<li class="n-part">${esc(t("nolan.part."+p))}</li>`;
      its.forEach(x=>{ if(here&&!nowDone&&x.at>m) rows+=nowLine(); rows+=item(x,m>=0&&x.at>=0&&x.end<=m); });
      if(here&&!nowDone) rows+=nowLine();
    });
    const off=offOn(day);
    const html=`<div class="month">`+bar(cap(fmtLong(d)),(w?t("header.week",{n:w.n}):"")+(off?(w?" · ":"")+off:""),day)+
      (list.length?`<ul class="n-list">${rows}</ul>`:`<p class="n-empty">${esc(off||t("nolan.nothing"))}</p>`)+`</div>`;
    const el=$("#n-day"); if(el.dataset.html!==html){ el.dataset.html=html; el.innerHTML=html; }
  }
  function drawWeek(){
    const days=[...Array(7)].map((_,i)=>addDays(weekStart,i)), today=todayISO();
    const w=weekOf(addDays(weekStart,2));
    $("#n-week").innerHTML=`<div class="month">`+bar(fmtRange(fromISO(days[0]),fromISO(days[6])),w?t("header.week",{n:w.n}):"",days.includes(today)?today:days[0])+
      `<div class="n-days">`+days.map(k=>{ const d=fromISO(k), list=itemsOn(k);
        return `<div class="n-col${k===today?" today":""}${d.getDay()%6===0?" weekend":""}" data-day="${k}">`+
          `<h4>${esc(WEEKDAY_SHORT[d.getDay()])} <b>${d.getDate()}</b></h4>`+(offOn(k)?`<p class="n-off">${esc(offOn(k))}</p>`:"")+
          (list.length?`<ul class="n-list small">${list.map(item).join("")}</ul>`:"")+`</div>`; }).join("")+`</div></div>`;
  }
  function draw(){
    WINDOWS.forEach(([id])=>{ const el=$("#n-"+({dia:"day",semana:"week",mes:"month"})[id]); if(el) el.hidden=id!==shown; });
    box.querySelectorAll(".n-tabs a").forEach(a=>a.setAttribute("aria-current",a.dataset.w===shown?"page":"false"));
    if(shown==="dia") drawDay(); else if(shown==="semana") drawWeek(); else cal.render();
  }

  /* the month: each day holds what fits; the rest hides behind "+N", which opens that day (all of it, by time).
     Measured after drawing, and again when the screen changes size */
  function fit(){
    const grid=$("#nolan-grid");
    if(!grid||shown!=="mes"||!grid.offsetHeight) return;
    grid.querySelectorAll(".m-day").forEach(d=>{
      d.querySelectorAll(".m-more").forEach(x=>x.remove());
      const items=[...d.children].filter(x=>x.matches(".m-chip,.m-link"));
      items.forEach(x=>x.hidden=false);
      if(d.scrollHeight<=d.clientHeight+1) return;
      const more=document.createElement("button");
      more.type="button"; more.className="m-more";
      if(d.dataset.day) more.dataset.more=d.dataset.day; else more.disabled=true;
      d.appendChild(more);
      let n=0;
      for(let i=items.length-1; i>=0&&(n===0||d.scrollHeight>d.clientHeight+1); i--){
        items[i].hidden=true; n++;
        more.textContent="+"+n; more.setAttribute("aria-label",t("nolan.moreAria",{n}));
      }
    });
  }
  let fitTimer=0;
  const refit=()=>{ cancelAnimationFrame(fitTimer); fitTimer=requestAnimationFrame(fit); };

  function build(){
    box.innerHTML=
      `<div class="n-head">`+
        `<a class="icon home-btn" href="#home" aria-label="${esc(t("nolan.backAria"))}" title="${esc(t("nolan.backAria"))}">${LOGO_SVG}</a>`+
        `<span class="n-brand"><span class="n-mark">${NOLAN_SVG}</span><span class="n-name">${esc(t("nolan.brand"))}</span></span>`+
        `<nav class="n-tabs" aria-label="${esc(t("nolan.windows"))}">`+WINDOWS.map(([id,k])=>`<a href="#nolan/${id}" data-w="${id}">${esc(t(k))}</a>`).join("")+`</nav>`+
        `<div class="n-clock"><span class="n-time"></span><span class="n-date"></span></div>`+
      `</div>`+
      /* while his month holds only UC3M: an invitation (it opens the form to add one of his own) */
      `<button type="button" class="n-invite" data-invite hidden>${esc(t("nolan.invite"))}</button>`+
      `<section class="n-win" id="n-month"><div id="nolan-grid"></div></section>`+
      `<section class="n-win" id="n-week" hidden></section>`+
      `<section class="n-win" id="n-day" hidden></section>`;
    cal=makePlanner($("#nolan-grid"),{detail:"nolan-detail",events:EVENTS,personal:personal(),mine:()=>MyEvents.list(),where:"nolan",onRender:refit});
    window.addEventListener("resize",refit);
    /* the arrows, "today" and "+" of the day and the week; "+N" of a day of the month */
    box.addEventListener("click",ev=>{
      /* (the click stops here: on the page it would count as a click outside the form and close it) */
      if(ev.target.closest("[data-invite]")){ ev.stopPropagation(); if(shown!=="mes") location.hash="#nolan/mes"; else cal.add(todayISO()); return; }
      const more=ev.target.closest(".m-more[data-more]");
      if(more){ day=more.dataset.more; location.hash="#nolan/dia"; return; }
      const a=ev.target.closest("[data-add]");
      if(a){ pendingAdd=a.dataset.add; location.hash="#nolan/mes"; return; }       /* (the form opens once the month shows) */
      const col=ev.target.closest(".n-col[data-day]");
      if(col&&!ev.target.closest(".n-item")){ day=col.dataset.day; location.hash="#nolan/dia"; return; }
      const s=ev.target.closest("[data-step]"); if(!s||shown==="mes") return;
      const n=+s.dataset.step;
      if(shown==="dia") day=n?addDays(day,n):todayISO();
      else weekStart=n?addDays(weekStart,7*n):mondayOf(todayISO());
      draw();
    });
    /* the time and the date are the app header's own (header.js keeps them right) */
    const tick=()=>{
      const n=new Date(), hm=String(n.getHours()).padStart(2,"0")+":"+String(n.getMinutes()).padStart(2,"0");
      const put=(sel,v)=>{ const el=box.querySelector(sel); if(el&&el.textContent!==v) el.textContent=v; };
      put(".n-time",hm); put(".n-date",($("#clockDate")||{}).textContent||"");
    };
    tick(); document.addEventListener("minute",()=>{ tick(); if(shown==="dia"&&!$("#n-day").hidden) drawDay(); });
    document.addEventListener("newDay",e=>{ tick(); if(day===addDays(e.detail,-1)) day=e.detail;
      /* (on this week when Sunday turns into Monday: the next one follows, as the day does) */
      if(weekStart===mondayOf(addDays(e.detail,-1))) weekStart=mondayOf(e.detail); if(box&&!box.hidden) draw(); });
    MyEvents.onChange(()=>{ invite(); if(shown!=="mes") draw(); });
    return tick;
  }
  let tick=null, pendingAdd=null;
  /* the invitation shows while nothing of his own exists; the month gives it room (--n-invite, nolan.css) */
  function invite(){
    const on=!routine().length&&!personal().length&&!MyEvents.list().length, b=box.querySelector(".n-invite");
    if(b) b.hidden=!on; box.classList.toggle("inviting",on);
  }
  return {
    /* Home calls it when #nolan (or #nolan/dia, /semana, /mes) opens */
    render(el,subroute){
      if(!box){ box=el; tick=build(); weekStart=mondayOf(todayISO()); }
      const w=ALIAS[subroute]||subroute;
      shown=WINDOWS.some(([id])=>id===w)?w:"mes";
      tick(); invite(); draw();
      if(shown==="mes"&&pendingAdd){ const k=pendingAdd; pendingAdd=null; cal.add(k); }
    }
  };
})();
