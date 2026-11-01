# Torn Staxx Suite — Shared Change Log

All shared changes are documented here. This log is **not** a feed of user-specific Torn data.

## 2026-11-01 — StaxxHub 2.2 / standard 2026.11.01.1
- Individual alert buttons now open the matching tool's Alerts view and focus the relevant issue, rather than opening the tool's default tab.
- ProfitStaxx 1.4.0: explicit buy-quantity action cards, correct item-market deep link and user-confirmed, guarded quantity preparation with safe manual fallback. No automatic purchases or API writes.
- Company Helper 1.7.0: named alert destinations for train bank, owed trains, unverified payments, finance guardrail and stale data; Today foregrounds one priority action.
- Happy Jump preview 0.16.0: Alerts action centre, overdose hold and next-action targeting; direct user-led links to Torn Gym, Items and Points Building. Stable remains untouched.
- Updated integration contract, suite standard and regression expectations. Any market DOM changes require live Torn PDA validation; no claim of verified page autofill.

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
