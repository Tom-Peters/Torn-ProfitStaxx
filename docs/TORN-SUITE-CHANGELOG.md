# Torn Staxx Suite — Shared Change Log

All shared changes are documented here. This log is **not** a feed of user-specific Torn data.

## 2026-11-01 — StaxxHub 2.1 / standard 2026.11.01
- Shared left sidebar and native S launcher; launcher hidden behind expanded drawer or open tool; draggable vertical position stored locally.
- Reduced sidebar width to 302 px; common ProfitStaxx-inspired navy/cyan styling and matching bounded top-tab panels, including Company Helper.
- Added per-tool notification urgency, local dismiss/snooze with 15m, 1h, 4h, 24h and custom minutes, and explicit due countdowns when the tool supplies a timestamp.
- Added combined overview including 7-day **observed** snapshot trends; missing days remain blank and projected gains labelled as forecast.
- Added mobile-friendly Up/Down tool reordering saved locally, plus explicit registration API for future scripts.
- Set canonical source `shared/staxx-hub.js` and per-repository `AGENTS.md` links to this standard.
- Required all active inlined hub copies to match the canonical source; stable Happy Jump installer remains pinned.

## Ongoing recording rules
For every change affecting multiple Torn scripts, append: date, feature/rule, which scripts changed, migration risk and testing results. Update `TORN-SUITE-STANDARD.md` when a behavioural rule is added, removed or changed.
