# Asset provenance — 2026-11-03

## Generated originals
Built-in image_gen tool; no separate API keys, paid API subscription, external scraping or stock downloads. Billing/quota of the built-in tool is not exposed; no independently metered API was called. Eight separate menu generations, one master generation and one independent transparent foliage generation. Exact prompts: `assets-source/prompts-v1.json` and `assets-source/palm-prompt-v2.txt`. Original PNGs: `assets-source/generated/`; WebP variants: `public/assets/`. Tool output retained in the local generated-images directory and copied into this workspace. Generated concepts are not documentary images, not evidence of location or product availability, and not certified exclusively copyrightable. Public release still requires owner review of suitability and applicable service terms.

| Asset IDs | Source | Edits | Status |
|---|---|---|---|
| coastal-master, coastal-mobile | imagegen, master coastal prompt v1 | Sharp WebP compression; mobile right crop | Fictional coastal mood illustration, placeholder, unverified |
| arrival-clouds, arrival-waves, arrival-birds | Original procedural SVG by Codex | Native vector artwork; independent layers, not sliced master | Decorative illustration, not venue facts |
| arrival-palm | Imagegen independent transparent foliage v2 | Alpha preserved, 900×600 WebP; SVG v1 retained as unused editable alternative | Generated framing illustration; placeholder, unverified. Alpha inspected with Sharp stats (0–253) |
| menu-placeholder-01…08 | imagegen, eight individual prompts v1 | Sharp resize/compression, no product alterations | AI food/drink concepts; placeholder=true, verified=false, sourceType=generated |
| favicon, wave mark, UI arrows/speaker | Original SVG by Codex | Code-native vectors | Project UI art, no external source |
| synthetic-ocean | Original Web Audio filtered noise | Generated on user gesture, no recording/download | Optional synthetic sound; muted by default |

## Owner media
`Assets/foto-ig/` supplied with repository. Owner confirmed usage permission in chat on 2026-11-03 (“Sudah”). Preserve existing photographer credits in filenames; original upload URLs, authorship and consent details are not in repository. No documentary files were integrated at the original foundation checkpoint. P3 now integrates two photographs and one silent video derivative locally; see `docs/implementation/P3_PROVENANCE.md`. Permission confirmation does not verify menu prices, venue facilities or precise location. Not deployed publicly.

## Fonts and libraries
Self-hosted Cormorant Garamond and DM Sans from @fontsource, SIL OFL-1.1. Packages downloaded from npm, not from undocumented image sources. Installed package versions/licenses recorded by `npm run licenses` in `evidence/test-runs/dependency-licenses.json`. GSAP uses its own Standard License, not MIT: https://gsap.com/standard-license/. Review redistribution restrictions before packaging as a competing authoring tool; this project is a cafe website. Next.js/React/TypeScript/Tailwind/Zod/Sharp and development tooling retain upstream package notices in node_modules. No font API calls or trackers at runtime.

## Reproduction
Read `assets-source/prompts-v1.json`, invoke imagegen per asset, inspect, copy originals without overwriting v1, optimize with `npm run assets:process`, update `content/media.json`, validate, build, and inspect desktop/mobile. No automatic generation retries or cost escalation. Existing SVGs are editable and reproducible using `node tools/generate-layers.mjs`. No spritesheet is needed for four vector layers; an atlas would add needless complexity at this checkpoint.
