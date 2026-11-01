# Torn Staxx — shared development constitution
Version: 1.2.0 | Owner attribution: IamEEKY | Scope: every Torn script/tool in the Staxx ecosystem

## Mandatory starting procedure
1. Before modifying ANY Torn tool, read this constitution and `docs/STAXX-HUB-INTEGRATION.md` from Torn-ProfitStaxx's main branch.
2. Read the target repository's README, live script, tests and release/update policy. Inspect other Staxx scripts if changing a shared contract.
3. Identify whether a change is **shared** (Hub, appearance, notifications, integration, navigation, storage conventions, accessibility) or **tool-specific** (calculations, domain models, API endpoints). Shared changes must be propagated across ALL three active script bundles and their relevant tests/snapshots.
4. Preserve existing functionality, read-only gameplay, user data, API key isolation and stable installation URLs. Never silently reset local data or change monetisation, permissions or API scope.
5. Run JavaScript syntax checks, regression tests and GitHub Actions; record results and flag remaining Torn PDA device-testing limitations.

## Single source of truth
- This file governs common behaviour, architecture and acceptance criteria for every Staxx tool.
- `shared/staxx-hub.js` in Torn-ProfitStaxx is the canonical shared launcher implementation. Each standalone userscript bundles the same code; no external runtime dependency.
- `docs/STAXX-HUB-INTEGRATION.md` defines the integration events and appearance tokens.
- Individual tool repositories own their domain-specific features, data schemas, calculations, and independent release versions.
- For a new cross-tool feature: **update this constitution and integration documentation in the same work**, then apply it to all applicable scripts. Don't treat documentation as optional.
- If a change impacts only one tool, update its own documentation without adding unnecessary global rules.
- These instructions are not automatically fetched by other agents: future development must explicitly read them. When automation is added, enforce synchronization through CI.

## Shared design rules
- Dark navy `#08192d`, card `#0d2945`, inner card `#102844`, border `#284b6b`, electric cyan `#54d7fa`, primary blue `#0879bd`, success `#49e2ad`. Avoid amber/gold as decorative accents; amber only for meaningful warning states.
- Mobile-first Torn PDA; compact header, horizontally scrollable top tabs, touch targets >= 40 px, no oversized bottom bar, responsive panel that never hides content.
- Shared StaxxHub sidebar on the left; current target width 302 px or less, constrained to viewport. FAB must hide whenever drawer or any registered tool panel is open and reappear on close.
- Allow vertical FAB dragging with persisted position; protect taps from accidental drag and retain position across viewport rotation.
- Every script registers via `staxx:register`, handles `staxx:open`/`staxx:closeall`, publishes `staxx:panel` when opened/closed, and provides `staxx:notice` and `staxx:summary` when grounded data exists.
- New scripts auto-register in Hub when installed/enabled; registry is not a claim to read the Torn PDA installed-scripts list.
- Allow manual drag-and-drop or accessible move-up/move-down reordering of registered tools, persisted locally.

## Notification contract and roadmap
- Alert priority: `info`, `warning`, `urgent`. Urgent means action is due/overdue or another genuinely time-sensitive state; never inflate severity.
- Snooze options: 15 minutes, 1 hour, 4 hours, 12 hours, 24 hours. Dismiss suppresses the current alert fingerprint until materially changed. Snooze expires based on time, even across page changes.
- For scheduled alerts, include a verified due timestamp and display an updating countdown or elapsed overdue time. Do not invent due times or imply live API freshness when cached.
- Persist only minimal local alert metadata; never API keys, sensitive details or full imported records in Hub.
- Notifications must remain actionable: click to open the responsible script. Avoid obstructing the Torn page or open panels.

## Shared action queue

- Each installed, enabled active script publishes actionable, **verified** recommendations through `staxx:actions`.
- Hub prioritises urgent problems first, then immediate tasks, upcoming deadlines, review tasks and optional opportunities. Each action must route to its corresponding tool Alerts card and a safe manual Torn workflow.
- Prefer **quantified advice**: number of trains, purchase quantity, required capital, estimated profit, stock deficit, guardrail headroom, or energy available. Clearly label estimated, advisory, and last-observed information.
- Never report a sell as executable at the lowest ask; label asking-price exit models and show user-confirmed transactions only.
- Stale information generates a **refresh action**, not a potentially dangerous imperative.
- This contract is mandatory when adding a fourth tool. Keep the source-of-truth in the suite standard and integration guide.

## Combined overview
- Cards for ProfitStaxx, Company Helper, Happy Jump and any newly registered tool.
- Include seven-day trends **only where dated historical samples are actually available**; distinguish observed results from projections and from missing data. Avoid silently manufacturing backfill or conflating training forecast with recorded gains.
- Show last verified update age. Cache the latest summary across page navigation without pretending the tool is running on another page.
- Optional compact next-action strip: keep opt-in/off by default until approved.

## Actionable alert implementation standard
- Treat the newer canonical `docs/TORN-SUITE-STANDARD.md` as the definitive cross-repository rulebook. This constitution captures standing principles and points to that source.
- Every alert in the sidebar links to its specific in-tool Alerts card through `staxx:open {id, alertId}`; older tools retain generic open fallback.
- Put one prominent, plain-language next action on each relevant screen. Surface the needed quantity/threshold, verified age and what the player should do, not just an abstract forecast.
- Link to a verified Torn page, and, for a specific **user-initiated** market action, safely prepare only a clearly matched quantity field. No Torn gameplay writes, automatic purchase, item usage or training.
- If destination-field detection is ambiguous, refuse automatic entry and offer copy/manual instructions. Always leave final confirmation to the player.

## Tool-specific invariants
- ProfitStaxx: maintain trading opportunity thresholds, market data handling, existing portfolio ledger and read-only UI.
- Company Helper: preserve staff allocation, wages, training ledger including purchased/owed/free trains, star growth, finance guardrails, history imports and read-only API. Never silently assign paid trains in-game.
- Happy Jump: maintain real observed training stats regardless of schedule compliance, OD recovery and probability modelling, gym selection, Xanax/refill planning, sleep window, forecasts and existing preview/stable split.
- The Happy Jump stable installer remains a tested rollback; preview changes need matching immutable versioned snapshot and parity test.
- Use `IamEEKY` only for author attribution. Never publish API keys, personal information, employee-specific records or real imported data.

## Release checklist
- [ ] Read this constitution and integration document.
- [ ] List affected scripts and shared components.
- [ ] Make canonical shared change first, then sync every embedded copy.
- [ ] Update version headers, snapshots and tests as appropriate.
- [ ] Add tests for behaviour, particularly FAB lifecycle, alert controls and overview rendering.
- [ ] Run all affected GitHub Actions; distinguish unrelated pre-existing failures.
- [ ] Verify stable raw URLs and avoid duplicate Happy Jump stable/preview installations.
- [ ] Explain what was changed, which versions to install and what needs Torn PDA testing.

## Change log
- 1.2.0 (2026-11-01): Shared priority queue, exact per-action navigation, decision transparency and quantified action guidance across all tools.
- 1.1.0 (2026-11-01): Per-alert navigation, actionable tool views and guarded user-led field preparation; defer detailed event contracts to the canonical suite standard.
- 1.0.0 (2026-11-01): Established shared Staxx design, Hub lifecycle, snooze/countdown/trends/reordering requirements, integration and release discipline.
