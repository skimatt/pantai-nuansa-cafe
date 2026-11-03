# Security, Provenance, and Tool Governance

## Secrets
Never commit API keys; env vars server-side only. Never expose paid image API credentials in client bundle. No untrusted code execution from JSON. Sanitize any external strings/URLs; no dangerous HTML injection.

## Sources
Record licenses/attribution for every external image, audio, font, video, and library. Do not assume GitHub repository contents are public domain. Avoid scraping protected sites or violating ToS. Use approved/owned media for venue documentary content.

## Agent MCP risk
MCP plugins can read/write files, invoke network and execute commands. Restrict scope, review tool calls, avoid broad filesystem permissions, sandbox Blender operations, obtain consent for paid actions and destructive changes.

## Accessibility and truthfulness
AI generated menu images are illustrative, not evidence of actual dishes; unverified location/facility details cannot appear as factual claims. Maintain placeholders until verified.
