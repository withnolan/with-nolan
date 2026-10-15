# Creative decisions log

Calls made without asking, with the reason. Newest at the bottom.

## 2026-10-15 · Task 1 (audit)

1. **Screenshots force the real render tier (`?tier=desk` / `?tier=phone`).** `universe.js` treats any automated browser (`navigator.webdriver`) as a "robot" and draws at 0.4 resolution with a fraction of the stars. The first pass looked blurry and blobby because of that, not because of the site. Judging the robot tier would have been judging something Nolan never sees.
2. **Chromium is launched on the laptop's real GPU** (`--use-angle=d3d11`, Intel Arc 140V). The default headless launch falls back to SwiftShader (software).
3. **Wait signal is `Universe.ready() && !Universe.busy()`**, not `busy()` alone. `busy()` is false before the galaxies are even built, which gave black screenshots.
4. **Real clock, Thursday 15 Oct 2026, ~11:30 Madrid.** That puts Nolan in a live class (Ingeniería del Software), with an exam that morning. It is a realistic weekday, so I judged it as-is.
5. **The weather card shows dashes in every screenshot.** That is because Open-Meteo and BigDataCloud are blocked, as the rules require. I do not score the empty weather as a design flaw. I do score what the offline state looks like, because Nolan will see it on the metro.
6. **The Earth uses its procedural texture in `file://` screenshots** (README: "A page opened as a file cannot use pictures"). Its invented continents are a local artefact, so I compared it against the live site before judging.
7. **Benchmarks:** Igloo Inc (Awwwards Site of the Year 2024, developer award), Messenger by Abeto (WebGL world, featured on Awwwards), NASA's Eyes on the Solar System (the reference for 3D space with information on top) and Things 3 (two Apple Design Awards: the reference for a premium personal planner). None of them are copied. They are used only to compare pacing, richness and craft.
8. **Spanish is the primary UI** (the owner's language), with one English pass of home to check copy length and tone.
9. **Igloo needed a 40 s wait** (`scripts/igloo.js`). It shows only its loader for the first 16 s in headless Chromium, so the first benchmark pass caught just the loader. That loader is itself part of the lesson (see audit §3).
10. **Desktop opening timing was measured in headless Chromium** on the owner's laptop GPU (`scripts/first5.js`): `Universe.ready()` was still false at 7.5 s. I report it as a finding with a caveat ("confirm in his own browser"), because the ordering problem (the reveal on a timer, not on the universe) holds however fast the build is.
11. **Quick wins stop short of new features.** Anything that needs new logic beyond a few lines (merging a class with its exam in Día, live sky facts on home, the reveal tied to `Universe.ready()`) is listed as a fix direction or a later note, not a quick win. It goes to Task 2 / Task 3.
12. **Footer sign-off keeps `.version` as its own element**, because `js/gate.js:131` copies `footer .version` text to the entry screen. Merging the sign-off into it would leak onto the gate.
13. **Screenshots are JPEG at quality 60–70**, about 8 MB for 94 files, so they can be committed. The robot-tier first pass was deleted.
