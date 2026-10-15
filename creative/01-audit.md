# 01 · Creative audit: Nolan v0.97

*Thursday 15 Oct 2026, around 11:30 Madrid, real clock. Local build (`file:///…/index.html`), Spanish UI plus one English pass. Desktop 1440×900 and phone 390×844, real GPU (Intel Arc 140V through ANGLE/D3D11), with `?tier=desk` / `?tier=phone` forced so the universe draws what Nolan's devices draw (see `decisions.md` #1). Cloud and weather blocked, so the weather card shows dashes and Pendientes says "Sin conexión" in every shot. Those are artefacts of the test setup, not flaws.*

Screenshots: `creative/screenshots/` (`desk-es-*`, `phone-es-*`, `*-en-*`, `*-first-*`, `*-live-earth`, `bench-*`). Scripts: `creative/scripts/shoot.js`, `extra.js`, `first5.js`, `bench.js`.

---

## 1. First impression

**What it says in 5 seconds.** "This is Nolan's own sky, it is 11:33, and you are in Ingeniería del Software for 42 more minutes." That is a very good five-second message for a one-person daily tool, and few dashboards manage it. The real black hole, the Sombrero, two spirals, the Pleiades and a band of the Milky Way say *premium* before you read a word.

**What it makes you feel.** Awe first, then calm. The awe comes from the sky. The UI on top of it looks like a phone lock screen: logo, letter-spaced NOLAN, big clock, greeting, one class card, one weather card, all stacked in a 400 px column in the middle. It is tidy and polite. It is not epic. The universe is a 10; the layer of interface on it is a 6, and the two do not yet look like one piece of work.

**What you remember after the scroll.** The black hole. The "Empieza el viaje" card with its glowing play button. Then nothing: home ends on that card, every UC3M tab ends on a grey `v0.97`, and the Nolan section ends wherever its grid ends. The sky gets a strong opening. The interface gets no ending.

**The one-line verdict.** The engine is award-level and the product is honest and useful, but the interface treats the universe as wallpaper. Text sits on top of galaxies instead of being composed with them, the personal parts (Nolan, Gastos) are still mostly promises, and the words are written by an engineer, except on the black hole page, which shows what the whole site could sound like.

**Overall: 6.5 / 10.** The sky and the sights alone would score 9. The organizer alone would score 6.

---

## 2. Section by section

Scores are out of 10. "D" is desktop and "P" is phone.

### 2.1 Entry screen (gate): **5**
`desk-es-gate.jpg`, `phone-es-gate.jpg`
- **Purpose:** keep strangers out, and give guests a demo.
- **Works:** restraint. A blue constellation N and one INVITADO pill on black is confident, and the PIN being hidden behind the logo is a nice secret for the owner.
- **Flat:** it is pure black, with no universe behind it. The first frame of a site whose whole idea is "a living universe" shows no stars at all. A guest gets one word and no promise of what is behind the door. `v0.97` is the only other text on screen.
- **Fix direction:** let a very faint, slow star field (or the far-sky pass alone) live behind the gate. Add one line under the N for guests: *"Un organizador dentro de un universo." / "An organizer inside a universe."*

### 2.2 The opening (the first seconds): **D 4 · P 6**
`desk-first-1s … 7_5s.jpg`, `phone-first-1s … 7_5s.jpg`
- **Purpose:** the flight from behind the Earth into home, about 5.5 s.
- **Works:** the staged reveal in `cinema.css` is well timed on paper: the N draws itself (0.3–1.9 s), the letters arrive (1.25–3.25 s), then the time (2.1 s), the next class (2.2 s) and the weather (2.3 s). "Saltar intro" is discreet. On the phone the universe is ready by about 2.5 s, so the flight and the reveal roughly overlap: it works.
- **Broken on desktop, cold load** (measured on this laptop's GPU, `first5.js`): `Universe.ready()` was still false at 7.5 s. The whole reveal therefore plays on **pure black**: NOLAN assembling at 2.5 s, the full dashboard on black at 5.5 s. Only at about 7.5 s does the sky fade in and the flight start, behind a UI that has already finished. The most cinematic asset of the site, the flight, runs as a background behind a lock screen, and the reveal runs against nothing. (Headless Chromium may be slower than Nolan's own browser, so confirm on his machine. The ordering problem holds either way: the reveal is on a timer, not on the universe.)
- **Fix direction:** start the reveal from `Universe.ready()`, not from page load. Let the N's self-drawing be the loader: loop its stroke until the sky is ready, which is what Igloo's loader does (see §3). Then give the camera its first 2–3 s alone with only the N, and land the clock, the class and the weather with the camera.

### 2.3 Home hero: **D 7 · P 5**
`desk-es-home-1.jpg`, `phone-es-home-1.jpg`, `phone-es-guest.jpg`
- **Purpose:** the time, a greeting, the next class, the weather. This is the screen Nolan sees ten times a day.
- **Works:** the next-class card (new in v0.92) is the single most useful thing on the site. "Ahora · quedan 48 min" in a soft blue pill is exactly right. The letter-spaced NOLAN over the time is elegant on desktop.
- **Flat / wrong:**
  - **Phone composition is broken.** The black hole sits right against the "11" of the clock and the vampire star's orange glow sits *inside* the colon (`phone-es-home-1.jpg`, and every phone home shot). The Milky Way runs diagonally through NOLAN. On a 390 px screen the three brightest objects in the sky overlap the three most important words. The cause is the phone positions: black hole `m:[-.45,-.1]` (`js/universe.js:80`) and binary `m:[.05,-.1]` (`js/wonders.js:300`), both at the height of the clock.
  - **Offline, the weather card is an empty instrument panel:** "—°", "—", "—", "—", and one real value (sunset 19:37). It is a deliberate placeholder while loading (`weather.js:54`), but when the fetch fails it never goes away. On the metro this is what Nolan sees.
  - The hero repeats itself further down: the UC3M card says "Ahora: Ingeniería del Software · 10:45 · Aula 2.3.D01", the same fact as the hero card, a few hundred pixels later.

### 2.4 Home cards ("¿A dónde vamos?"): **5**
`desk-es-home-2.jpg`, `phone-es-home-2.jpg`, `phone-es-home-3.jpg`, `desk-en-home-end.jpg`
- **Purpose:** the doors to UC3M, Nolan and Gastos.
- **Works:** each card has its colour and its own icon. The Gastos icon (a coin falling into a black hole) is the best icon on the site.
- **Flat:**
  - These are generic glass SaaS tiles: icon, title, subtitle, a line, "Ver →". Two of the three carry no live data. Nolan's card says "La universidad, tu rutina y tus planes." whatever the day, and Gastos repeats its slogan. Only UC3M lives.
  - **Stale truth:** "Examen de ED: hoy" at 11:33, when that exam ended at 10:30. For an organizer, that is the one thing that must never be wrong (`js/home.js:34` keeps any assessment whose last *day* is today, ignoring its end time).
  - On phone each card is about half a screen tall, so the three cards are 1.5 screens of mostly empty glass.
  - "¿A dónde vamos?" is fine but small and grey, and almost lost.

### 2.5 "Empieza el viaje": **7**
- **Purpose:** the tour of the 11 sights.
- **Works:** this is the only element on home with *art direction*: an orbiting planet illustration, a gradient border, a big round play button, and "11 DESTINOS · ELIGE A DÓNDE IR". It reads as an invitation.
- **Flat:** it is the last thing on home and nothing follows it, so there is no ending. The subtitle is a list ("la Tierra, la Luna, un agujero negro, galaxias y nebulosas"). On phone the play button floats far from the title.

### 2.6 Sights and the dock: **D 8 · P 7**
`desk-es-orion-1.jpg`, `desk-es-blackhole-1.jpg`, `desk-es-earth-1.jpg`, `desk-live-earth.jpg`, `phone-es-orion-1.jpg`, `phone-live-earth.jpg`
- **Purpose:** the universe as a destination.
- **Works:** this is the strongest part of the site. The ray-traced black hole is genuinely jury-level. The Orion Nebula is lush. The type stack (kicker in accent caps, then a big name, then two lines of plain science) is clean and confident. The copy is good: "Aquí la luz se curva: el arco que ves sobre la sombra es la parte de atrás del disco, doblada hacia ti." teaches something real in one breath.
- **Flat:**
  - **Dock labels are cut off on both devices:** "Galaxia del …", "Nebulosa d…", "Estrella vam…", "Galaxias An…" (desktop), and "Nebulosa …", "Las Pléya…" (phone, where only 3 of 11 fit). A premium tour cannot have truncated destination names.
  - "Destino 7 de 11" is a page counter, not a moment.
  - On phone the Milky Way band runs vertically through the middle of every sight and competes with the subject (Orion, the Earth).
  - At the Earth on 15 Oct, the Moon reads as a black disc, a hole in the sky (`desk-live-earth.jpg`). On 15 Oct 2026 the real Moon is a waxing crescent, between the new moon of 10–11 Oct and the first quarter of 18 Oct (sources: [LPL moon calendar, Oct 2026](https://catalina.lpl.arizona.edu/moon-phases/month/2026-10); [SpaceWeatherLive, Oct 2026](https://www.spaceweatherlive.com/en/moon-phases-calendar/2026/10.html)). From this camera angle we may simply be seeing its night side, but a visitor sees a hole. *Not verified in code: check that the lit limb faces the camera at least partly at this sight.*

### 2.7 Gastos (`#spending`): **8**
`desk-es-spending-1.jpg`, `phone-es-spending-1.jpg`
- **Purpose:** a coming-soon page for spending, at the black hole.
- **Works:** this is the best-written and best-directed screen on the site. The black hole fills the frame, and "Todo lo que cae aquí no vuelve." in a warm gradient lands both the joke and the theme. "Lo que ya cruzó el horizonte" and "Las órbitas que te cobran cada mes" are lovely. It proves the voice.
- **Flat:**
  - "tu sueldo, tampoco": Nolan is a full-time student, and *sueldo* (salary) rings false. *Paga* or *dinero* is truer. The English "your pay doesn't either" is clunky.
  - It is a dead end: three "— €" cards and a locked pill. There is no single interaction (not even a "prueba: ¿cuánto llevas este mes?" field). It is fine for now, but it is the second "coming soon" on home.

### 2.8 UC3M frame (the header shared by every tab): **D 6 · P 6**
`desk-es-schedule-1.jpg`, `phone-es-schedule-1.jpg`
- **Works:** the big clock, "Semana 6 de 14" with its progress bar, and the 7 / 42 / 2 stats are a strong dashboard header. The Aula Global pill is a useful accent.
- **Flat:** the UC3M galaxy's bright golden bar sits right behind the header stats on desktop: "asignaturas" under the 7 is barely readable. On phone the Pleiades or the vampire star sits behind the Notes icon. The header is 230 px tall on desktop and is repeated, identical, on six tabs.

### 2.9 Horario (`#schedule`): **7**
- **Works:** this is the most useful screen. Today has the past class dimmed, the red "now" line with its glowing point, "quedan 41 min", and the exam banner in red. The weekly grid is legible, with group and campus chips and a colour legend.
- **Flat:**
  - On phone the red now-line cuts straight through "12:15" and "teoría · Leganés" (`phone-es-schedule-1.jpg`): the line sits on top of the text instead of behind it.
  - "Próximos 7 días" still lists "Examen de Estructura de Datos · 09:00–10:30 · **hoy**" in red at 11:34, after the exam has ended.
  - In the weekly grid, half-width slots clip their room ("Aula 10.2.1" is cut). The lead "Cada asignatura tiene su color y lo mantiene en toda la página." is a design note, not copy.

### 2.10 Mes (`#planner`): **6**
- **Works:** month at a glance, week numbers, holidays in red, the purple line for a multi-day window, a clear "+ Añadir".
- **Flat:** the cells use four background tints (brown, navy, red, near-black) with no legend, so the grid looks muddy rather than meaningful. The lead copy is instructions ("Pulsa un evento para ver el detalle, o «+ Añadir»…"). On phone, chips become dots (right), but the dots carry no label at all.

### 2.11 Asignaturas (`#subjects`): **6**
- **Works:** dense and genuinely valuable: rooms, faculty with Gmail buttons, a grading bar, a grade calculator, and the honest advice box ("un 8,3 para aprobar, que no es realista").
- **Flat:** it is a long, flat wall with seven cards at the same weight and nothing to help you find one. "Acumulado: 0.00 ptos" is a sad empty state. The page is about three screens per subject on phone.

### 2.12 Exámenes (`#exams`): **D 6 · P 4**
`desk-es-exams-1.jpg`, `phone-es-exams-1.jpg`
- **Works:** "Añadir a mi calendario" is a real feature with a clear explanation, and the table is in order.
- **Flat:** on phone, 13 filter chips over six rows push the first exam below the fold, and the chips sit on the brightest part of the galaxy (low contrast). The lead "Todo lo evaluable del cuatrimestre en orden." is fine but forgettable. Past rows are not dimmed.

### 2.13 Pendientes (`#tasks`): **5**
- **Works:** the idea of "your constellation", one star per task joined when done, is the best metaphor in the product.
- **Flat:** at 0 of 7 done it is an empty dark rectangle with eight dots and a caption, which reads as *nothing here*. The lead "Se guardan en la nube y siguen ahí al recargar." is a technical guarantee, not a reason to care.

### 2.14 Nolan (`#nolan`, Mes / Semana / Día): **4**
`desk-es-nolan-1.jpg`, `desk-es-nolan-semana.jpg`, `desk-es-nolan-dia.jpg`, `phone-es-nolan-*.jpg`
- **Purpose:** Nolan's own life: UC3M plus his routine and plans.
- **Works:** the v0.97 month does fill the screen, and the slim bar (N, galaxy mark, Mes/Semana/Día, time) is clean.
- **Flat, and the core problem:** `ROUTINE` and `PERSONAL` in `data.js` are both empty, so `#nolan` shows *exactly the same events as `#planner`*. The card promises "tu rutina y tus planes" and the page delivers UC3M's calendar under another name. Nothing invites him to add his life: no empty-state line, and no visual difference between "university" and "mine".
  - Week and Day use half the screen on desktop. The other half is sky, with "Saltar intro" floating under the week when the page is opened directly.
  - Day shows two rows at 09:00 (the class *and* the exam that replaces it), with no "now" line and no split between morning and evening, unlike the Today card in UC3M.
  - Monday 12 (a holiday) is blank in Semana with no "festivo" label.

### 2.15 Configuración (`#settings`): **7**
- **Works:** "Supernova ya" is a delightful button and the clearest easter egg on the site. The Effects descriptions are honest.
- **Flat:** the descriptions are long (the Effects one is five lines). "Se guarda en este dispositivo." is overlapped by a galaxy.

### 2.16 The ending (footer on every page): **2**
- `v0.97` in 40 % grey. No sign-off, no last moment, no "see you tomorrow". The tour ends, home ends and the tabs end, and nothing says goodbye.

---

## 3. Against the benchmark

Shot the same way (desktop 1440×900 and phone 390×844, real GPU): `bench-desk-*.jpg`, `bench-phone-*.jpg`. I am learning format and pacing from them, not copying anything.

| Benchmark | Why it counts | Source |
|---|---|---|
| **Igloo Inc** (igloo.inc) | Awwwards Site of the Year 2024 (Developer Award), immersive WebGL | [Awwwards collection listing](https://www.awwwards.com/du-haihang/collections/webgl-animations/), [Awwwards case study](https://awwwards.com/igloo-inc-case-study.html) |
| **Messenger** by Abeto (messenger.abeto.co) | A WebGL tiny-planet world, featured on Awwwards | [Awwwards page](https://www.awwwards.com/messenger.html), [80.lv](https://80.lv/articles/deliver-mail-on-tiny-colorful-planet-in-this-relaxing-web-game) |
| **NASA's Eyes on the Solar System** (eyes.nasa.gov) | The reference for live 3D space with information on top | [eyes.nasa.gov](https://eyes.nasa.gov/apps/solar-system/) |
| **Things 3** (culturedcode.com/things) | A premium personal planner, "honored twice with the Apple Design Award" | [culturedcode.com](https://culturedcode.com/) |

### Screen by screen

| Moment | What the benchmark does | What Nolan does | Where we feel empty |
|---|---|---|---|
| **Loading** | Igloo shows a branded progress line (ASCII dashes and pluses) on a calm grey field until the 3D is ready, then reveals the scene whole (`bench-desk-igloo-1.jpg`, `-3.jpg`). The wait *is* the brand. | The reveal runs on a timer over black, and the sky arrives late behind finished UI (§2.2). | The loading time is wasted instead of staged. |
| **Hero composition** | Messenger: one object (the planet), one word stamped on it, one button (`bench-desk-messenger-1.jpg`). Igloo: the object owns the centre; every word sits in the corners in small mono type ("Scroll down to discover.", "Sound: Off"). | Nine sky objects plus six UI blocks, all in the centre column. On phone, the clock collides with the black hole. | No single hero object. The words and the sky compete for the centre. |
| **Information in the 3D** | NASA Eyes pins labels to the bodies themselves ("MARS", "EARTH") and runs a **LIVE · REAL RATE · date · time** bar along the bottom (`bench-desk-nasaeyes-1.jpg`). On phone: 3D in the top 60 %, cards below, never on top of each other (`bench-phone-nasaeyes-1.jpg`). Igloo draws a constellation of numbered points over its object. | The data never touches the sky. The real Moon phase, meteor showers and the supernova are all true and live, but never named on home. On phone, text sits on top of the brightest band. | The best facts in the product are invisible: "the Moon tonight over Getafe" is drawn and never said. |
| **Scroll** | Igloo assembles its object block by block as you scroll (`bench-desk-igloo-1.jpg` → `-4.jpg`). | On home, the camera does not answer the scroll: the same sky sits behind the hero and the cards (`desk-es-home-1.jpg` vs `-2.jpg`). | Scrolling home is just glass sliding over wallpaper. |
| **Cards** | NASA Eyes' feature cards each carry an image of the spacecraft plus a kicker in spaced caps. | Glyph icon, title, subtitle, "Ver →". Two of the three have no live content. | Cards without content or imagery. |
| **The day** | Things splits the day into **Today** and **This Evening**, shows the calendar on top of the to-dos, and makes the product screenshot the hero (`bench-desk-things-2.jpg`). | Nolan's Día is a flat list with no "now" and no evening, and it shows the class and its exam twice. | The personal day has no shape. |
| **Jokes and personality** | Messenger is playful throughout. Igloo is dry and mono. Things is warm and plain. | One joke, and it is excellent ("Todo lo que cae aquí no vuelve."). Everything else is neutral. | One voice moment in 15 screens. |
| **Rich motion** | Igloo: one hero object with physical detail. | **Nolan wins here.** A real ray-traced black hole, supernovae with a blast wave, comets on real orbits, meteor showers on their real dates. Nothing in the benchmark set has this much live astronomy. | Not empty, just not *pointed at*. |

**Summary.** On raw craft of the 3D, Nolan already stands with the benchmark. Where it falls behind is **direction**: the benchmarks decide what the one object on screen is, where the words go so they never fight it, how the wait becomes part of the brand, and how the 3D carries information. Nolan has the engine of a jury site and the layout of a dashboard template.

---

## 4. The 5 biggest problems (most important first)

1. **The opening is on a timer, not on the universe.** On a cold desktop load the reveal plays on black and the flight starts at about 7.5 s behind a finished UI (§2.2).
   **Fix:** start the hero reveal from `Universe.ready()` and loop the N's stroke as the loader. The camera gets 2–3 s alone, then the clock and the class land with it.
2. **The sky and the words fight for the same pixels.** On the phone hero, the black hole and the vampire star sit on the clock. On every UC3M tab the golden bar sits behind the header stats and section leads, and filter chips sit on the brightest band.
   **Fix:** compose each view so text zones stay dark (move the phone positions of the black hole and the binary; add a soft reading shade behind every text block).
3. **Nolan's own section is UC3M's calendar under his name.** `ROUTINE` and `PERSONAL` are empty, there is no invitation to add anything, and UC3M events look exactly like his own.
   **Fix:** add an empty-state line that invites ("+"), dim UC3M events inside `#nolan` so his own are the bright ones, and seed `ROUTINE` with his real week (owner input needed).
4. **Truth slips on the first screens.** "Examen de ED: hoy" an hour after it ended (home card and Próximos 7 días). The hero's class line is repeated in the UC3M card. Día shows the class and its exam as two rows at 09:00.
   **Fix:** anything already over today says so and leaves "next", and the UC3M card shows the next thing the hero does not (the next deadline).
5. **No voice and no ending.** Section leads read like README lines ("Se guardan en la nube y siguen ahí al recargar."), only Gastos has a voice, and every page ends on a grey `v0.97`.
   **Fix:** carry Gastos' voice into every lead and empty state, and close every page with a sign-off line.

---

## 5. Quick wins (each under an hour, ordered by visible lift)

Every change below is exact. After applying, bump the version (README › Publishing) and run only the touched test sections.

### QW1 · Clear the clock on the phone (composition)
- `js/universe.js:80`: in `bh:{star:"255,120,210", at:{d:[-.36,-.28],m:[-.45,-.1]}, …}`, change `m:[-.45,-.1]` → `m:[-.58,-.58]` (the black hole moves up-left, between the icons and the logo).
- `js/wonders.js:300`: in `skyWonder("binary",{at:{d:[.61,.12],m:[.05,-.1]},…`, change `m:[.05,-.1]` → `m:[.6,.42]` (the vampire star moves right, below the weather card).
- Check one phone screenshot of `#home` before shipping (the values are a first proposal). Tests: `ONLY="Astral,Home"`.

### QW2 · A reading shade behind every block of text on the sky
Append to `css/astral.css`:
```css
/* words that sit on the sky get a soft pool of dark behind them, never a box */
.shead{position:relative;isolation:isolate}
.shead::before{content:"";position:absolute;z-index:-1;inset:-28px -56px -14px;pointer-events:none;
  background:radial-gradient(60% 100% at 40% 50%,rgba(6,8,14,.66),rgba(6,8,14,0) 100%)}
.shead p,#stats,.p-greeting,.p-ask{text-shadow:0 1px 14px rgba(0,0,0,.85),0 0 2px rgba(0,0,0,.6)}
.p-time,.p-word{text-shadow:0 2px 28px rgba(0,0,0,.65)}
```

### QW3 · Never call a finished exam "hoy"
`js/home.js:34`: replace
```js
const ex=EVENTS.filter(e=>isAssessment(e)&&lastDay(e)>=k).sort(byDate)[0];
```
with
```js
/* an assessment that already ended today is no longer "next" (its time is "HH:MM–HH:MM") */
const endsAt=e=>{ const x=/–(\d\d):(\d\d)/.exec(e.time||""); return x?+x[1]*60+ +x[2]:1440; };
const ex=EVENTS.filter(e=>isAssessment(e)&&(lastDay(e)>k||(lastDay(e)===k&&endsAt(e)>m))).sort(byDate)[0];
```
Apply the same rule to *Próximos 7 días* (`js/today.js`), where an assessment that is over today should drop out or show **hecho / done** instead of **hoy / today**. Add a test in *Home* at 11:30 on an exam day.

### QW4 · An invitation in Nolan's empty month
`js/nolan.js`: when `ROUTINE.length===0 && PERSONAL.length===0` and `MyEvents` holds none of his own, show one slim line under the bar (style: `color:var(--ink-2); font-size:.85rem; padding:6px 4px`). New keys in `js/i18n.js`:
- `"nolan.empty"`: ES **"Por ahora tu mes es solo de la UC3M. Pulsa + y añade lo tuyo: el gimnasio, una cena, un viaje."** EN **"For now your month only holds UC3M. Press + and add your own: the gym, a dinner, a trip."**

### QW5 · Destination names never cut off
`css/home.css:246`: replace `.t-name{…white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}` with
```css
.t-name{font-size:.66rem;font-weight:600;line-height:1.12;text-align:center;max-width:100%;
  white-space:normal;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;min-height:2.24em}
```
"Galaxia del Remolino", "Nebulosa de Orión" and "Estrella vampiro" then wrap to two lines instead of "Galaxia del …".

### QW6 · Phone home cards: half the height, same content
Inside the existing `@media (max-width:620px)` block in `css/home.css` (line 266), after `.p-ic svg{…}` add:
```css
  .p-card{display:grid;grid-template-columns:56px 1fr;column-gap:16px;row-gap:6px;align-items:start}
  .p-card>.p-ic{grid-row:1/span 3}
  .p-card>.p-txt,.p-card>.p-info,.p-card>.p-go{grid-column:2}
```
The three cards go from about 1.5 phone screens to about 0.9, and "Empieza el viaje" moves into the second screen.

### QW7 · The weather card when the sky does not answer
`js/weather.js:56–63`: when a fetch has failed and there is no reading, do not draw four dashes. Draw one line instead: the icon, `t("weather.none")` and the sun stat. Keep the dashed shape only while the *first* request is in flight, which is its reason to exist. New keys:
- `"weather.none"`: ES **"Sin parte del cielo por ahora"** EN **"No word from the sky yet"**

### QW8 · Section leads with a voice
`js/i18n.js` (and the Spanish fallback text in `index.html` for the same `data-i18n` keys):

| Key | ES now → new | EN now → new |
|---|---|---|
| `s.schedule.lead` | "Cada asignatura tiene su color y lo mantiene en toda la página." → **"Cada asignatura, su color. Cada día, su órbita."** | "Each subject has its own colour and keeps it across the whole page." → **"Every subject has its colour. Every day, its orbit."** |
| `s.planner.lead` | "Todo el curso, de septiembre a junio. Pulsa un evento para ver el detalle, o «+ Añadir» para añadir uno tuyo." → **"El curso entero, de septiembre a junio. Toca un evento para verlo de cerca."** | "The whole year, from September to June. Tap an event to see its details, or “+ Add” to add your own." → **"The whole year, September to June. Tap an event to look closer."** |
| `subjects.intro` | "Las {n} con la misma ficha: horario y aulas, profesorado, evaluación y fechas propias." → **"Las {n}, una a una: dónde, con quién, cuánto cuenta cada cosa y cuándo."** | "{n} subjects, each with the same card: …" → **"All {n}, one by one: where, with whom, what counts and when."** |
| `s.exams.lead` | "Todo lo evaluable del cuatrimestre en orden." → **"Todo lo que cuenta para nota, en el orden en que llega."** | "Everything graded this term, in order." → **"Everything that counts, in the order it arrives."** |
| `s.tasks.lead` | "Se guardan en la nube y siguen ahí al recargar." → **"Cada tarea hecha enciende una estrella."** | "Saved to the cloud, still there after reloading." → **"Every task you finish lights a star."** |

(`subjects.introOne`: ES **"La única, entera: dónde, con quién, cuánto cuenta y cuándo."** EN **"Just one, whole: where, with whom, what counts and when."**)

### QW9 · An ending on every page
`index.html:291`: `<footer><div class="wrap"><p class="version">v0.97</p></div></footer>` →
```html
<footer><div class="wrap"><p class="sign" data-i18n="s.sign">Nolan · bajo el cielo de Getafe</p><p class="version">v0.97</p></div></footer>
```
Keep `.version` as its own element, because `js/gate.js:131` copies its text to the entry screen. New key `"s.sign"`: ES **"Nolan · bajo el cielo de Getafe"** EN **"Nolan · under the sky of Getafe"**. CSS (`css/base.css`): `footer .sign{margin:0 0 4px;color:var(--ink-2);font-size:.8rem;letter-spacing:.04em}`. Add the same line under "Empieza el viaje" on home.

### QW10 · Two small copy fixes
- **Constellation at zero** (`js/i18n.js:130` and its EN twin): add `"tasks.constellationZero"`: ES **"{total} estrellas esperan a que las enciendas"** EN **"{total} stars waiting for you to light them"**. In `js/tasks.js:71` and `:73`, use it when `count===0`:
  `const cap=count===n?t("tasks.constellationDone"):count===0?t("tasks.constellationZero",{total:n}):tn("tasks.constellation",count,{total:n});` (use `cap` in both the `aria-label` and the `<p>`).
- **Gastos lead** (`s.spending.lead`): ES "…Ni la luz escapa; tu sueldo, tampoco." → **"…Ni la luz escapa. Tu dinero, tampoco."** EN "…Not even light escapes; your pay doesn't either." → **"…Not even light escapes. Neither does your money."** (Nolan is a student: *sueldo* rings false.)

---

## 6. Smaller notes (for later briefs, not quick wins)

- **Gate:** let a faint star field live behind the PIN screen, and give guests one line: ES *"Un organizador dentro de un universo."* EN *"An organizer inside a universe."*
- **Day view (`#nolan/dia`):** merge a class with the exam that takes its slot, add the red "now" line, and split into *Mañana / Tarde / Noche*.
- **Week view:** label holidays ("Festivo" / "Holiday"), and let the grid use the full height on desktop as the month does.
- **"Saltar intro"** shows for about 4 s on a direct load of `#nolan/semana`, with no intro visible (`html.intro-on` from `Home.intro()` in `router.js:216`). Only show it while the camera is actually flying.
- **Planner tints:** four background tints with no legend. Keep two at most (term weeks and holidays) or add a key.
- **Phone schedule:** draw the red now-line *under* the row text (`z-index`), not across "12:15".
- **Exams on phone:** collapse the 13 filter chips into one horizontal scrolling row.
- **Subjects:** a sticky row of the 7 subject colours as anchors at the top. "Acumulado: 0.00 ptos" → ES *"Aún sin notas"* EN *"No grades yet"*.
- **The Moon at `#earth`** reads as a black disc on 15 Oct (a waxing crescent in reality). Check that some of its lit limb faces this camera.
- **The sky never says what it knows.** One line on home (ES *"Esta noche: Luna creciente · Oriónidas activas"*) would turn the hidden astronomy into a daily delight. The Orionids are active 2 Oct to 7 Nov 2026, peaking on the night of 20–21 Oct ([IMO meteor shower calendar](https://www.imo.net/resources/calendar/)). Check against `Astro.shower` before shipping. *This belongs in Task 2.*

---

## 7. Scores at a glance

| Section | Score |
|---|---|
| Entry screen | 5 |
| Opening | D 4 · P 6 |
| Home hero | D 7 · P 5 |
| Home cards | 5 |
| Empieza el viaje | 7 |
| Sights and dock | D 8 · P 7 |
| Gastos | 8 |
| UC3M header | 6 |
| Horario | 7 |
| Mes | 6 |
| Asignaturas | 6 |
| Exámenes | D 6 · P 4 |
| Pendientes | 5 |
| Nolan | 4 |
| Configuración | 7 |
| Ending | 2 |
| **Whole site** | **6.5** |
