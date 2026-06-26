# Agent Operating Guide

This repository implements a local Web UI and CLI wrapper for the `agent-reach` skill.

## Scope

- Provide a graphical control surface for Agent Reach capabilities:
  search, social platforms, career search, GitHub/dev search, web/RSS reading,
  video transcripts, finance lookups, environment diagnostics, and update checks.
- Provide CLI parity through Makefile targets and Node scripts.
- Keep generated output in `tmp/` or user-configured output locations.
- Do not require network dependency installation for the default static UI.

## Required Commands

- `make help`: list available commands.
- `make serve`: run the local web UI.
- `make doctor`: run `agent-reach doctor --json`.
- `make search QUERY="..."`: run an Exa web search through `mcporter`.
- `make code QUERY="..."`: run Exa code-context search through `mcporter`.
- `make web URL="..."`: read a page through Jina Reader.
- `make github QUERY="..."`: search GitHub repositories.
- `make youtube URL="..."`: fetch video subtitles with `yt-dlp`.
- `make v2ex`: fetch V2EX hot topics.
- `make bili QUERY="..."`: search Bilibili videos.
- `make twitter QUERY="..."`: search Twitter/X through `twitter-cli`.
- `make reddit QUERY="..."`: search Reddit through OpenCLI.
- `make xhs QUERY="..."`: search Xiaohongshu through OpenCLI.
- `make update-check`: run `agent-reach check-update`.
- `make package`: create a distributable archive.

## Implementation Notes

- The UI must generate explicit, inspectable commands instead of hiding behavior.
- Potentially credentialed or login-dependent commands are never auto-run from the
  browser. They are copied for execution in a trusted terminal.
- The hidden command entrance is available from the Web UI with `Ctrl+K`.
- Keep the design system consistent: one light theme, one accent, consistent radii.
- Avoid adding build dependencies unless they are necessary for requested behavior.

## Verification

- Validate HTML/CSS/JS syntax with lightweight local checks.
- Run `make help` and at least one non-network command before marking complete.
- Confirm `README.md` documents external tools and open-source references used.
