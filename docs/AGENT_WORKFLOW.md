# Agent Workflow / Execution Plan

## Roles (dapat dijalankan satu Codex)
- Product/Research: audit scope dan proposal.
- Art Director: art bible, composition, quality gate.
- Asset Producer: generation, vector, spritesheets, licenses.
- Motion Engineer: GSAP, Pixi, intro and scroll.
- Frontend Engineer: Next.js, responsive UI, JSON loader.
- QA Engineer: tests, screenshots, performance, accessibility.

## Sprint gates
P0 Repository + schemas + references → P1 master keyframe + assets → P2 opening+Hero working → P3 Discover/Experience → P4 Explore/Taste → P5 Moments/FindUs/Footer → P6 QA+MDLC+deploy.

## Agent loop
Plan → generate/implement → run → screenshot → compare with art bible → identify concrete defects → fix → retest → log. Never advance if visual quality fails. When source facts missing, log TODO and use safe placeholders; never invent.

## Review report format
For each checkpoint: what changed, file paths, screenshots, expected/actual, performance notes, accessibility notes, source/license notes, open questions, next actions.

## External tool policy
Check actual availability and authorization before use. Any paid API, MCP with shell/filesystem control, external downloads, or scraping requires budget/permission/licensing checks. Prefer simple maintainable tools over unnecessary dependencies.
