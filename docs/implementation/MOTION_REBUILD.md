# Reopening the motion quality gate — 2026-11-03

User rejected the earlier static-looking implementation. Previous functional
test results remain historical evidence, **not acceptance of multimedia quality**.
Full-site motion quality is reopened; physical midrange-device testing remains pending.

## Implementation approach

Original native Canvas 2D renderer (`src/lib/coastal-world.ts`), React lifecycle,
and existing GSAP ScrollTrigger. No extra renderer dependency or paid service.
Painterly coast is a texture source with perspective-dependent ocean scan-line
displacement; independently phased foam advances/retreats along a shoreline.
Palm crown and tapered trunk share an articulated joint; each frond has a
separate phase and 24 desktop / 12 mobile bending segments. Sand particles, articulated birds,
pointer parallax and pointer/touch water rings share the scene clock.
HTML copy, links and controls stay outside Canvas; existing illustration is a
no-JavaScript fallback. Separate mobile crop and palm composition.

Animation targets 30fps; desktop DPR capped 1.5, mobile DPR capped 1. Mobile uses fewer fronds, wider water scan-lines and fewer foam/particle details to reduce draw cost. A frame cap is not a measured device FPS.
Intersection/page visibility pause the loop; reduced motion renders a still;
user pause freezes the environment; observers/listeners/RAF/GSAP clean up.
Photo scroll transforms and pointer transforms have separate owners to avoid
fighting; touch scrolling remains native. Video preview waits for deliberate
hover, is silent, disabled for reduced motion/touch/data saver, and pauses on exit,
visibility loss or leaving the viewport. Main documentary video stays click-driven.

## Source, rights, costs

- The Boat: https://www.sbs.com.au/theboat/ — reference for narrative depth and
  moving compositions, no artwork, audio, code or text copied. Search extraction
  could read only the site footer; user screenshots supply visual reference.
- Official Instagram supplied directly by user:
  https://www.instagram.com/nuansa_pantai_coffe/ . Automated fetch failed;
  no claims about posts scraped or inferred. Owner contact remains distinct.
- New generated asset: `assets-source/generated/palm-frond-rig-v1.png`, built-in
  image generation. No external API key, subscription, asset purchase, or deployment.
  No separate charge observed; account-side generation quota/pricing not inspected.
  Image asset remains generated/unverified/placeholder in manifest.
- Prompt: one isolated curved coconut frond, transparent canvas, attachment at
  left 4%/40%, irregular deep-green/olive leaflets, sunlit edges, rich editorial
  gouache botanical texture, no tree/trunk/text/background, production animation
  sprite, 3:2 landscape. Generated PNG preserved; 900px alpha WebP derived by Sharp.
- Hover clip: FFmpeg from already authorized `senja-silent-v1.mp4`, seconds 2–6,
  270×480,18fps,H264,CRF29,4 seconds, no audio. Original documentary source and
  embedded credits retained. No third-party soundtrack added.

## Acceptance evidence

Measured results and recording links are appended below. Static screenshots
alone cannot establish that this redesign meets the requested motion quality.


## Delivered files and reproduction

New source:
- `src/lib/coastal-world.ts`: original 2D renderer, water phase and foliage rig.
- `src/components/LivingCoast.tsx`: animation clock, visibility/pause/reduced-motion,
  adaptive mobile resolution and reversible camera. Short screens do not pin.
- `src/lib/use-media-depth.ts`: pointer tilt with separate transform ownership.
- `src/components/ChapterRail.tsx`: accessible chapter navigation and current state.
- `src/app/living-world.css`: composition, media hover and mobile safe spacing.
- `tests/e2e/motion.spec.ts`: temporal image tests and silent preview lifecycle.
- `tools/prepare-motion-assets.mjs`, `capture-motion.mjs`, `profile-motion.mjs`.
- Original frond PNG/prompt in `assets-source/generated/`, optimized alpha WebP
  in `public/assets/environment/`, hover clip in `public/assets/journey/`.

Integrated with CoastalArrival, JourneyScenes, DocumentaryVideo, GoldenScenes,
layout, Zod schemas and site/sections/scenes/animations/media JSON. Updated
scene architecture, content schema, decision log, README and MDLC handoff.

Run `npm run dev` for development, or `npm run build` then `npm run preview`
for production preview at http://127.0.0.1:4173 . Content changes stay in JSON.
Use the three tools above to reproduce optimized assets, recordings and profile.
No publishing performed.

## Actual performance investigation

First 4× CPU simulation exposed only **10.18 canvas draws/second**. Retained raw
baseline: `evidence/performance/motion-mobile-before-optimization.json`.
Mobile detail, pixel ratio, frond texture caching, low-power resolution and RAF
rounding tolerance were subsequently changed. Adaptive resolution uses 0.72×
backing-store scale if the mobile draw interval remains above 46ms; HTML copy
and controls retain native resolution. Reduced motion remains a still.

Final independent 390×844 Chromium simulation (4× CPU,150ms latency,200000B/s):
**140 canvas draws in 5005ms = 27.97 draws/second**, LCP2376ms, CLS0.02531;
reduced-motion draws0, LCP2400ms. No video request before user interaction.
Raw: `evidence/performance/motion-mobile-simulation.json`.
This is draw cadence, not a claim of display FPS, field INP or physical-device
performance. A single local sample is not a controlled comparative benchmark.
Physical Android/iOS and Safari/Firefox remain untested.

## Visual review and remaining boundaries

Reviewed desktop1440×900 and mobile390/360 compositions, plus generated tablet
screenshots. Fixed the initial overly geometric art, frond direction, unreachable
skip on short screens, duplicate navigation landmark names, hidden-H1/contrast
regressions, and rotating mobile captions overlapping the art notice. Media remains
labeled: generated environment/menu imagery is illustrative, documentary sources
retain credits. Controls and prose are HTML, not rasterized Canvas text.

Opening/Hero now has implemented independent motion and local evidence; this
replaces the earlier static-looking foundation. Do not describe all release gates
or the thesis as finished: physical devices, manual screen-reader/cross-browser
checks, owner visual validation, proposal requirements and academic evaluation
remain open. Hours and street address remain unknown; use the supplied Maps pin
and contact. No scores, research respondents or business impact fabricated.


## Final verification and evidence

- `npm run lint`, `npm run typecheck`, `npm run build`: passed on final renderer.
- `npm run test`: 11 content/intro/verification tests passed.
- `npm run test:e2e`: **30 passed**, final run 2.1 minutes, including new temporal
  desktop/mobile tests, explicit pause, reduced-motion still, offscreen sleep,
  silent hover and existing accessibility/interaction checks. Raw final report:
  `evidence/test-runs/e2e-results.json`; older motion-full-suite.json is historical.
- Recorded actual production browser at1440×900 and touch390×844; no page errors:
  `evidence/motion/capture-report.json`.
- Watch `evidence/motion/desktop-walkthrough.mp4` and
  `evidence/motion/mobile-walkthrough.mp4`; original WebM retained. Recordings
  show opening, independent ambient motion, pointer/touch, forward/back camera,
  photo composition and video interaction; they are browser captures, not renders
  of a design mockup. Screenshots/temporal frames in the same folder.
- Final screenshot review also covers `evidence/screenshots/hero-*.png` and
  `evidence/screenshots/p3/discover-full-*.png` / `experience-full-*.png`.

Checklist: seamless intro/skip/replay, environment motion, reversible scroll
camera, pointer depth, touch ripples, chapter navigation, photo depth, silent hover,
click-to-play documentary video, sound opt-in, keyboard, pause, reduced motion,
static/no-JS fallback, mobile safe spacing, source/provenance and placeholders are
implemented and covered locally. Physical devices and public deployment remain
outside these completed local checks.
