# Performance and Responsive Budget

## Strategy
Aim for fast perceived load and smooth interaction on mid-range Android/iOS, not just developer desktop. Measure before setting final numeric performance thresholds. Prioritize first-screen content; lazy-load below-fold Pixi scenes, media and noncritical JS.

## Controls
Dynamic import Pixi on client; cap device pixel ratio where appropriate; sprite atlas; texture unload/dispose; limit particles; pause offscreen tickers; avoid giant canvases; compressed WebP/AVIF; responsive `srcset`; video poster and metadata; prefer transform/opacity; reduced-motion fallback; avoid heavy smooth-scroll hacks.

## Testing matrix
Mobile 360×800, 390×844, tablet ~768px, desktop 1440×900; touch and mouse; Chrome/Edge/Safari/Firefox as available; low-power simulation; slow network. Record actual LCP/CLS/INP and FPS/memory measurements if tooling allows; do not invent results.

## Failure behavior
If WebGL unavailable: static layered fallback. If audio blocked: mute stays on. If video fails: poster and description. If image API unavailable: procedural assets and logged gap. If JS slow: semantic HTML content remains accessible.
