# Homepage smooth scrolling — 6 November 2026

## Research and selection

Lenis 1.3.27 is pinned exactly. Its official documentation supports GSAP ScrollTrigger and the shared GSAP ticker without restructuring existing pinned scenes. Only the homepage owns a controller. Collection pages retain native scrolling.

- Documentation: https://github.com/darkroomengineering/lenis
- MIT license: https://github.com/darkroomengineering/lenis/blob/main/LICENSE
- Local license: public/licenses/lenis-LICENSE.txt; generated THIRD_PARTY_NOTICES includes Lenis.
- npm lockfile records registry integrity. Runtime audit: evidence/smooth-scroll/runtime-audit.json, zero runtime vulnerabilities at inspection. Existing development dependency findings were not automatically upgraded.
- No new API, paid service, renderer or external account.

## Implementation

src/lib/use-homepage-scroll.ts owns initialization, cleanup, live reduced-motion changes, modal/visibility pause and navigation. The existing GSAP ticker supplies wall-clock milliseconds to Lenis; Lenis events update ScrollTrigger. No independent RAF loop or global GSAP lag setting changes. CSS disables competing native smooth scrolling while Lenis is active.

content/animations.json supplies smoothScroll.enabled, lerp (0.12) and wheelMultiplier (1), validated by Zod. Touch remains native (syncTouch false). Reduced motion disables Lenis, including live preference changes. Ambient-animation opt-in does not override the scroll accessibility preference.

WaveNavigation retains ownership of anchors. At the covered midpoint its helper moves immediately and clears residual inertia, preserving destination focus and history. Gallery dialogs stop page scrolling and resume it on close. Nested media controls are excluded. Leaving the homepage removes controller, ticker, observers and listeners. Offscreen scene handlers now skip unnecessary geometry reads.

## Verification

- npm run lint, npm run typecheck, npm run test: pass; 19 unit/content tests.
- npm run build: pass; seven static routes; all 156 media references validated.
- smooth-scroll.spec.ts: 4 passed (interpolation/anchor inertia, modal lock/focus, live reduced motion/route cleanup, mobile touch/horizontal gallery).
- section-transitions.spec.ts: 3 passed (desktop/mobile reversible fades, pause, reduced motion and no-JavaScript visibility).
- Visual inspection: evidence/smooth-scroll/desktop.png (1440x900), mobile.png (360x800). Readable text/photos, retained backgrounds; no horizontal overflow or page errors. Static captures verify composition; browser tests verify movement.

## Local performance evidence and limits

The before export was profiled before integration; after uses the final export. Both use local headless Chromium 156 at 1440x900, 16 wheel inputs totalling 4800px. Raw data: evidence/smooth-scroll/before.json and after.json.

| Scenario | Median before | After | P95 before | After |
| --- | ---: | ---: | ---: | ---: |
| Normal CPU | 83.3ms | 33.3ms | 466.6ms | 83.3ms |
| CPU slowed 4x | 116.7ms | 116.7ms | 349.9ms | 666.7ms |

These are single local runs, not physical-device or field measurements. Rasterization, decoding and machine load affect results. The normal desktop run improved; the heavily throttled run did not and remains a known limitation. Lenis interpolates input but does not guarantee 60fps or remove scene rendering costs. Intermediate after-lenis.json remains investigation evidence, not a substitute for the final measurement. Real mid-range-device validation remains outstanding.

## Run and review

npm run dev starts local development. Refresh the homepage after restarting an existing server. Static reproduction: npm run build then npm run preview. The profiling and visual-review helpers expect a separate static preview at port 4185. New dependency cost: zero, MIT licensed.
