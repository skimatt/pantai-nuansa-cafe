# Testing and Acceptance

## Automated
TypeScript typecheck, ESLint, production build, JSON schema tests, asset existence and license metadata checks, unit tests for content loaders, smoke tests for anchors and state machine, e2e for intro skip, menu overlay, gallery lightbox, mute, video controls, navigation.

## Manual
Desktop/mobile screenshot comparison to art direction, visual review per scene, scroll forward/back, resize/orientation, Safari touch, focus traversal, reduced-motion, low-power fallback, broken media, slow network.

## MDLC evaluation
Black-box functional test cases with expected/actual outcomes; usability instrument (SUS optional, only if selected and administered correctly); media feasibility/expert validation with defined rubric if required by proposal. Report actual respondents, method, dates, raw results, limitations. Never fabricate scores or claim improved visitor counts without evidence.

## Acceptance criteria
No critical functionality failures, no fabricated business data, clear scene continuity, media accessible, no generic card-stack layout, working mobile, all paths valid, license log complete, no console errors, reproducible build. Quantitative targets require baseline and approval.

## Test evidence
`evidence/screenshots/`, `evidence/test-runs/`, `evidence/performance/`, `evidence/usability/` created during implementation; store sanitized reports only.
