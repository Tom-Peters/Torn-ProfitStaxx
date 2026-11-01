# Torn Staxx Suite — Shared Change Log

- 2026-11-01 — **ProfitStaxx 1.7.0** adds public Torn stock quotes, stock-benefit block cost and limited-access owned-share / claim-ready dividend information; fixed cash dividend annualisation; 12-category realised-income tracking in TornPDA native storage with JSON backups; and user-led Torn revenue links. No stock transaction is automated.
- **Company Helper 1.9.1** adds distinct-day estimated profit history, three-observation loss warnings and a direct ProfitStaxx income handoff (without pretending operating models are realised payouts).
- **Happy Jump preview 0.18.1** adds the cost-of-training-versus-preserved-capital decision card; v0.18.1 immutable snapshot retained beside the permanent preview URL. Stable installer unchanged.
- **Shared StaxxHub 2.4** stock-market context and updated ProfitStaxx labels are now identical in all three active bundles and canonical source.

All shared changes are documented here. This log is **not** a feed of user-specific Torn data.

## 2026-11-01 — StaxxHub 2.4 / decision intelligence across Torn

- Added a context-sensitive, optional Staxx recommendation directly below known Torn Gym, Company and Item Market page headings, with an on/off sidebar setting; clicking an advisory action opens its specific alert card inside the responsible tool. No autonomous Torn actions or additional API reads.
- ProfitStaxx **1.6.0**: bounded capital allocation, asking-price sample quality and near-price competition labels, configurable assumed active-review minutes for profit/work-time comparisons, and holding-specific after-fee sell watch.
- Company Helper **1.9.0**: working-stat development pace based on real dated snapshots, conservative salary cash-flow what-ifs, and historical Sunday-star readiness only with sufficient observed promotion data; retains existing staff role simulator.
- Happy Jump preview **0.18.0**: gain-per-energy comparison, marginal point-refill cash efficiency, refill timing, historical daily stat changes and conditional long-term target scenarios; immutable v0.18.0 snapshot updated. Stable HJ installer remains pinned.
- Shared `shared/staxx-hub.js` code synchronized into all three active scripts and Happy Jump preview snapshot. Synthetic regression checks added for risk allocation, wage scenario logic, training advising and data freshness. Native Torn PDA visual and field selection still require on-device verification.

## 2026-11-01 — StaxxHub 2.3 / next-action overhaul

- All three active tools now publish a structured `staxx:actions` queue. Sidebar ranks urgent, due, upcoming, advisory and optional opportunities across tools, deep-links to exact alert cards, and labels last-observed cached recommendations.
- ProfitStaxx 1.5.0: clearer live-market buy sizing and costs, opportunity hero, holdings-aware sell-review signals with 5% item-market fee and break-even asking price. No automated sale or purchase.
- Company Helper 1.8.0: top three director decisions, confirmed eligible paid-train queue, stock shortage, operating guardrails, stale refresh and targeted cards.
- Happy Jump preview 0.17.0: verified energy-based trains possible, estimated time to natural energy cap, scheduled cooldown priorities, overdose safety, book decision, exact alert targets and Gym links.
- Hub 2.3 canonical bundled identically into all three active scripts; stable Happy Jump 0.10.22 is untouched. CI, syntax and cross-repo parity are required; Torn PDA live field targeting still requires device validation.

## 2026-11-01 — StaxxHub 2.2 / standard 2026.11.01.1
- Individual alert buttons now open the matching tool's Alerts view and focus the relevant issue, rather than opening the tool's default tab.
- ProfitStaxx 1.4.1: explicit buy-quantity action cards, correct item-market deep link and user-confirmed, guarded quantity preparation with safe manual fallback. No automatic purchases or API writes.
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
