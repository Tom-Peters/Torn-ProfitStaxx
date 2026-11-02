# Torn Staxx Suite — Shared Change Log

## 2026-11-02 — StaxxHub 3.2 local reviewed queue and source status

- Added a locally persisted **Checked for now** control for fresh, nonurgent recommendations in all three tools. Checked items return after four hours, and automatically reappear when their source evidence changes.
- Urgent and stale recommendations cannot be checked. This is a review-queue convenience, NOT confirmation of Torn gameplay, and does not hide notifications.
- Added three small per-tool source freshness indicators to Today. No extra API scopes, gameplay writes or background actions.
- Published ProfitStaxx **1.22.3**, Company Helper **1.25.3**, Happy Jump Preview **0.31.3** and its matching immutable snapshot. Happy Jump stable is pinned.
- Shared Hub remains identical in all active scripts; device-level TornPDA layout verification remains separate from syntax and CI.



## 2026-11-02 — StaxxHub 3.1 unified dashboard, action priorities and activity

- **Q1:** One Dashboard view presents last-reported, timestamped headline figures and up to four metrics for each registered tool. Forecasts are explicitly not recorded Torn actions; refresh is available on demand.
- **Q2:** Today actions can be filtered to **Do now**, **Soon** or **Optional**. Review times appear only when the source provides a bounded estimate (1–60 minutes); otherwise the time is not estimated.
- **Q3:** A bounded, locally stored usage counter learns shortcuts from deliberate Hub navigation and real in-tool tab clicks (not passive refresh). The user can reset the history; entries expire after 30 days.
- **Q4:** Activity displays only deduplicated, provenance-labelled API log, snapshot or locally recorded events. Forecasts are excluded; records expire after 30 days, and activity can be cleared locally.
- **Q5:** **Best Next Action** uses current tool-reported priorities, status and due times, excluding stale recommendations. It opens the relevant helper for review and does not perform Torn gameplay writes.
- Suite versions: ProfitStaxx **1.22.2**, Company Helper **1.25.2**, Happy Jump Preview **0.31.2**; all embed the same StaxxHub 3.1 code. Happy Jump's stable rollback remains unchanged.
- Fixed dashboard re-rendering after background summaries and immediate display of learned shortcuts. Source-driven activity has local deduplication, provenance labels and delete control.
- This is a source-backed advisory interface, not a claim of live TornPDA on-device validation.


## 2026-11-02 — StaxxHub 3.0 action finder and direct section navigation

- Upgraded shared StaxxHub with touch-friendly Find in the drawer header, searching connected tools, supported sections, actionable alerts and source-provided recommendations. Terms remain local; cached results are labelled and dismissed or snoozed alerts are excluded. Common plurals such as **stocks** resolve to **stock market**.
- ProfitStaxx **1.21.1**, Company Helper **1.24.1** and Happy Jump Preview **0.30.1** expose Find inside their existing tool headers and handle verified direct section destinations. Company Helper can stage a time-limited section route to its company page without losing an alert-focused jump.
- Preserved all trading, training, company growth, overdoses, pricing and ledgers as read-only models. No automatic Torn gameplay, new API scopes, remote search calls or persistent query logs.
- Bundled the canonical Hub into each active script and an immutable Happy Jump 0.30.1 preview snapshot. Happy Jump stable rollback remains pinned. Added Find regression coverage and cross-repository parity enforcement; browser/PDA device layout still requires hands-on QA.


## 2026-11-02 — StaxxHub 2.9 unified usability release

- Added one persistent Simple/Advanced display preference across ProfitStaxx 1.20.1, Company Helper 1.23.1, and Happy Jump preview 0.29.1. Simple shows high-use tabs and a More control; Advanced restores every section. Alert deep links continue to reveal less-common destinations.
- Introduced a lightweight, dismissible/replayable first-run guide in the hub Today view. Advanced can show all six top actions without hiding the existing alert routing, detailed dashboards, diagnostics or source freshness.
- Fixed event handling for valueless mode/guide controls and kept Company Helper event listeners compatible with minimal environments. No domain calculations, saved data structures or Torn gameplay safety safeguards were changed.
- Synchronized canonical StaxxHub 2.9 to all three active scripts and the matching immutable Happy Jump preview snapshot. Stable Happy Jump install URL remains pinned. GitHub CI is necessary but not equivalent to TornPDA on-device verification.


## 2026-11-02 — StaxxHub 2.8 simplified navigation

- Shared Torn drawer now launches on **Today**: top two ranked actions and direct shortcuts to the three installed tools, with a toggle for further ranked recommendations.
- **Tools**, **Alerts**, and **More** tabs keep secondary functions out of the way while preserving tool reordering, per-alert deep-link/snooze/dismiss, combined dashboard, diagnostics, and contextual guidance.
- Refreshes update figures without forcing the drawer back to the top; Today resets only when reopening the drawer. No change to stockless-company rules, paid-training eligibility, gameplay read-only safeguards or preview/stable distinction.
- Released ProfitStaxx 1.19.0, Company Helper 1.22.1 and Happy Jump Preview 0.28.0, with immutable matching Happy Jump snapshot. Company Helper 1.22.1 also makes verified imminent train-bank overflow alerts independent of paid training obligations, without activating zero-availability paid-train alerts. Device QA remains necessary.


## 2026-11-01 — Company Helper 1.20.0 paid-training alert eligibility (standard 2026.11.01.6)

- Company Helper no longer raises a paid-train alert just because employees have outstanding confirmed purchases. An alert now requires a verified nonzero available train bank and at least one oldest-first allocation to an eligible employee.
- Training debt remains visible in the ledger when availability is zero, unknown or not allocatable. Company badge, Alerts view and StaxxHub action feeds use the same actionable queue. Independent train-storage risk and pending-payment alerts are preserved.
- No changes to the shared Hub implementation or other userscripts; no automated company training or gameplay writes.

## 2026-11-01 — touch-safe StaxxHub v2.7 (standard 2026.11.01.5)

- Removed inline native-page Next Action cards on touch and narrow layouts, including TornPDA desktop-scaled mobile pages. Existing tool actions remain accessible through the shared S drawer, which does not interrupt gym controls.
- On larger fine-pointer desktops, native guidance requires a sufficiently wide heading parent and a fresh, substantive recommendation; stale refresh-only prompts remain inside the tool rather than being rendered over the game. Layout changes trigger re-evaluation on window resize.
- Synchronized the canonical StaxxHub bundle in ProfitStaxx 1.18.0, Company Helper 1.18.0 and Happy Jump Preview 0.27.0. The latter accepts successful lightweight gym observations as fresh for the action queue and begins eligible full-data checks after a foreground light refresh, with existing 45-minute attempt backoff.
- No Torn gameplay writes or automatic button presses are introduced. Android TornPDA visual verification remains pending.

## 2026-11-01 — automatic foreground intelligence (standard 2026.11.01.4)

- **ProfitStaxx 1.16.0:** Recorded open item positions join watched-item scans automatically; quick refresh preferentially checks aged owned-item quotes. Local-only timestamps retain automatic API-check backoff across navigation, and the fast-scan interval is eight minutes.
- **Company Helper 1.16.0:** All visible TornPDA pages can trigger a bounded read-only company refresh every 15 minutes. Official Torn continuation links allow incremental automatic training-news and incoming-money history imports (at most one extra page per eligible refresh). Invalid/missing cursors halt safe backfill, preserving manual review and de-duplication.
- **Happy Jump preview 0.25.0:** Verifies owned Torn points automatically with `user/money` during supported full and light updates; settings retain a fallback only when data is missing or stale. Current overdose, real training logs and stat snapshots continue to sync without manual acknowledgement.
- All changes are read-only, permission-gated and foreground-only. No market buy, gym train, company wage/order, item use or employee payment action is submitted. No API keys or personal account data are published.
- Release requires ordinary CI and Happy Jump preview/snapshot parity; visual TornPDA device behaviour remains a separate acceptance check.


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
