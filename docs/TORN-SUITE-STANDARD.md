# Torn Staxx Suite — Development Standard
Version: **2026.11.03.1** · Maintainer: **IamEEKY** · Applies to **every present and future Torn userscript/tool** in this suite.

**Canonical document:** https://raw.githubusercontent.com/Tom-Peters/Torn-ProfitStaxx/main/docs/TORN-SUITE-STANDARD.md

This file is the single source of truth for *cross-script* behaviour, design and integration. Each repository keeps a small root-level `AGENTS.md` that links to this document and tells coding assistants to read the latest revision before changing Torn code. **Updating this file does not automatically change running userscripts**. Shared implementation changes must be synchronized, checked, committed and released in all affected repositories.

## Scope and inheritance
1. Applies to ProfitStaxx, Torn Company Helper, Torn Happy Jump Helper, and **new** Torn tools. Retain project-specific calculations and features unless the task explicitly changes them.
2. When a task impacts two or more tools, update this standard first, update the canonical implementation, distribute the implementation and test every affected entrypoint.
3. A repository's project-level documentation can add rules but cannot silently override shared rules; record any necessary exception here, with reasons and expiry/review conditions.
4. Treat user-approved decisions and newly discovered recurring bugs as candidate standard changes. Record the decision in `docs/TORN-SUITE-CHANGELOG.md`. Increase the standard version when the rule itself changes.
5. Do not assume a past ChatGPT session automatically reloads GitHub. Read this canonical file during future tasks and report if inaccessible rather than silently applying an outdated version.

## Foreground automation and data provenance (2026-11-01)
- Automatically collect and reconcile **read-only** API facts and local evidence while TornPDA is in the foreground, with per-endpoint intervals, permission checks, bounded requests and failure backoff. Each tool may refresh from any visible Torn page when its installed key is available. Timers stop API work while the page is hidden; no expectation of background execution with TornPDA closed.
- Recover unimported historical pages incrementally when valid official Torn cursors, identifiers or timestamp boundaries exist; persist progress, de-duplicate by exact source ID, halt safely on ambiguous or repeated cursors, and never invent missing history. Old transfers may be suggested for review, not silently assigned a training purpose.
- Automatically monitor real saved open positions, observed gains and other verifiable account-owned records where relevant; never overwrite explicitly chosen user focus, personal assumptions or manual ledger entries. Mark estimated, cached and partly verified data distinctly.
- Prefer persistent per-tool failure backoff, failure visibility and user-triggered retry. Respect API limits and don't let one failing category starve unrelated refreshes. Do not equate successful HTTP response with complete/valid data.
- Gameplay mutations (purchases, training, wage changes, stock orders, resource use, payment approvals) always remain deliberate player actions on Torn, even if a script can calculate or prepare the next step. No silent form prefill except explicit user-led guarded preparation.

## Non-negotiable rules
- **Public attribution:** `IamEEKY` only in author credits, README examples, commit message authored metadata and docs. Keep real API keys, employee data and user-specific transactions OUT of GitHub. Existing repository URL namespaces are unchanged.
- **Read-only Torn interactions:** No automated gameplay actions, no browser HTTP writes to Torn. User-driven buttons may perform local calculations, preference persistence, client navigation and guarded preparation of visible form fields. Never submit a purchase, consume an item, train, approve a payment, transfer funds or trigger any other game-state change automatically. Never override a field the player has edited.
- **Torn PDA first:** Single JavaScript userscripts with `@match` for `www.torn.com` and `torn.com`, and stable `@updateURL`/`@downloadURL` where available. Avoid external runtime dependencies, remote `@require` and assumptions about page layout.
- **Data correctness:** Do not fabricate API data, countdowns, gains or historical numbers. Clearly differentiate factual snapshots, stale last-seen data, projections, estimates and currently due actions. Never delete user local data on a render failure.
- **No regressions:** Keep existing functional pages, training ledgers, employee payment allocation, overdose handling, market analysis, key management and restore behaviour. Update narrow features without replacing the domain logic.
- **Safe rendering:** Escape all untrusted Torn data before inserting HTML, use DOM textContent for hub items, and ensure no network request on initial script setup unless the specific tool's already-approved behaviour calls for it. The Company Helper refresh policy stays separate from StaxxHub's local-only UI timer.

## Shared design system (Staxx UI)
- Background `#08192d`; cards `#0d2945`; elevated cards `#102844`; borders `#284b6b`; electric cyan `#54d7fa`; action blue `#0879bd`; success `#49e2ad`; warning `#ffd17e`; urgent `#ff778d`. No amber/gold as the default accent.
- Shared navy/cyan contrast, compact rounded cards, legible figures, responsive widths and touch targets.
- Tool dashboards are bounded overlays with a small header, compact **top** navigation and scrollable content. Avoid large persistent bottom bars. Respect mobile safe areas and browser zoom.
- A single launcher (the S tab) opens a left sidebar of ~302 px; it disappears **while a tool is open or the drawer is expanded**, returns when closed, and can be repositioned vertically. Never overlay main controls with duplicate floating action buttons.
- Sidebar offers registered tool navigation, combined overview, notifications, urgency, custom snoozes, dismissal and persistent ordering. A proposed always-visible mini-summary remains **optional, not enabled by default**.

## StaxxHub 3.4 — verified completion, session fit and truthful income (2026-11-02)

- **Daily checklist:** display current per-tool recommendations alongside separate evidence-confirmed completions. Only a source-specific, matched API event may close a recommendation; `staxx:activity` can include a validated `completedActionId` tied to the exact active action and its current fingerprint, same UK day. Never infer completion from visiting, tapping Checked, a forecast, a balance change, or a generic log. Reappear immediately if the source task meaning changes.
- **Session fit:** keep a local, explicit 5/10/15/30/60-minute preference (or Any). Within the **same urgency and due-time order**, prefer recommendations whose source-supplied `reviewMinutes` fit the available time. Unknown durations must remain unknown, not be filtered into quick work. No source urgency, true deadline, safety condition or stale-data gate is demoted.
- **ProfitStaxx:** use fresh actual holdings, share increments and quoted prices to rank the marginal shares/cash needed for the next stock benefit block; respect saved capital reserve, optionally verified wallet cap, and mark any expected yield as modelling, never realised income. Omit opportunities without fresh holdings and quote evidence. User approves all purchases.
- **Stock cash receipts:** optionally reconcile only exact, uniquely identified Torn `user/log` cash stock-benefit events, with validated amount and timestamp, storing bounded deduplicated local records. Torn `user/log` requires Full access; use an existing permitted key only, back off on lack of access, never publish account data. Do not equate a stock benefit `available` flag, item benefit, or cash balance change with a verified receipt; do not double-count matching manual income.
- **Income truth:** show independently verified API cash receipts, user-entered income and locally recorded completed trading ledger P/L in explicitly separate categories; exclude all ask-derived opportunities and passive-income scenarios from realised totals. Warn when manually recorded stock income may overlap synced receipts.
- Preserve StaxxHub bundle parity in ProfitStaxx, Company Helper and Happy Jump Preview plus immutable versioned snapshot, keep Happy stable pinned, no new gameplay writes, and test API permission denial and local-storage bounds.

## Stock benefit status versus manual claims (2026-11-02)

- Torn `user/stocks` bonus `available` is an API-reported benefit status, not independent evidence that a player still needs to claim anything. Never derive an urgent claim instruction solely from this field or from cached holdings.
- Filter out passive stock perks from withdrawal reminders. Check that active-benefit metadata and personal holdings are both present and fresh; refresh clears a resolved benefit when the availability flag disappears.
- Default manual-withdrawal reminders **off** with a clear opt-in within ProfitStaxx Stocks; in the opt-in flow, describe remaining active dividends as **verify on Torn**, not a proven overdue obligation. Never execute a claim. Display API-reported status separately for informational use.
- Suppress the opt-out claim task consistently in source alerts, Hub notifications, badge counts and action recommendations, without affecting non-stock alerts or the underlying stock analysis.

## StaxxHub 3.3 — evidence-aware personal command centre (2026-11-02)

- **Changed since last review:** compare bounded, locally stored *hashes* of current source-reported action title/detail/status/priority/dueAt; never store source text in the change index. The first valid report per tool establishes a baseline and must not invent past changes. Subsequent new or materially changed actions display New/Updated until the player deliberately clears highlights. Never imply Torn actions were executed; ignore stale/cached reports and do not learn from passive opening or renders. Preserve 3.2 review controls.
- **Daily evidence report:** the Dashboard summarises local-day (Europe/London) counts of recorded, snapshot-observed and actually verified Torn-API activity separately, per tool, alongside time-labelled source summaries and recommendations. Counts only reflect events captured on this device, not exhaustive game performance; no inferred income or stat gains or invented day-on-day returns. No new API requests or cloud analytics.
- **Early warnings:** surface a clearly labelled, fresh-source, time-bound *heads-up* when an existing actionable (urgent/now/soon) source recommendation includes a valid future dueAt within 60 minutes. Do not invent due times, issue browser notifications, or convert advisories into verified events. Advisory review markers must not silence time-bound heads-up. Respect the existing dismissed/snoozed alerts.
- **Page-aware shortcuts:** on recognised Torn routes (gym, company, item inventory, points, item market, stocks), offer one compact in-Hub review link to a verified, allowlisted section of the relevant helper. Do not inject anything over mobile Torn controls, infer hidden page data or prefill/submit gameplay forms. Re-evaluate links on in-app route change.
- **Helpful/less relevant learning:** only explicit player feedback may adjust ordering within the *same urgency category and equivalent due-time group*, with bounded tie-breaking weight. Feedback must never outrank urgent status, real due times, cached gating or snooze/dismiss rules. Store only a short-lived/bounded local vote keyed by tool+action ID, allow reset, no upload, API scopes, automated gameplay or personally identifying fields.
- Preserve exact canonical StaxxHub parity in three active userscripts and current immutable Happy Jump preview, pinned Happy Jump stable, testable semantic controls and existing source-driven domain calculations. CI parsing/parity and device-level TornPDA verification are different checks.

## StaxxHub 3.2 — checked reviews and per-tool evidence status (2026-11-02)

- Today permits an explicit **Checked for now** action only on fresh, nonurgent source recommendations. This is a local review marker, never proof that a Torn action was performed.
- The default Pending, Do now, Soon and Optional filters exclude checked recommendations for at most four hours. Checked shows those markers and lets users restore individual entries.
- Any change to title, detail, status, priority or dueAt immediately returns the recommendation to the review queue. IDs are namespaced by tool.
- Urgent and stale/cached recommendations cannot be checked. No checked marker affects the Alerts view, per-tool badges, activity history or underlying tool calculations.
- Reviewed fingerprints stay in local device storage only, capped at 60 and expiring after four hours. Never send them over the network.
- Today shows evidence status for all three tools based on registered availability, recent source action reports and the per-tool freshness window. Recent report is not equivalent to live Torn verification or completion.
- Retain the 3.1 dashboard, activity, shortcuts, all stable URLs, source provenance and strict bundled Hub parity. Happy Jump stable remains pinned; no gameplay writes or new API scopes.

## StaxxHub 3.1 — unified decisions, habit shortcuts and evidence timeline (2026-11-02)

- Make **Dashboard** and **Activity** first-class StaxxHub views. Dashboard reuses the existing `staxx:summary` snapshots and displays all registered tools side by side in the drawer, with status/freshness clearly distinguished from real-time verification. Keep the legacy combined overview and diagnostic tools available under More.
- Today shows a **single best next review** chosen transparently from fresh, action-specific `staxx:actions` recommendations. Prioritise genuine urgency/due times, fresh evidence and source-supplied priorities. Never promote stale/cached recommendations as current. Show a plain explanation of why it ranked first; when no current data exists, say so.
- Group next-step recommendations under **Do Now / Soon / Optional** (including optional reviews) with a simple filter. Display *estimated review minutes* only when the tool provides a bounded positive `reviewMinutes` estimate; always label these as estimates for human review, not time to execute a Torn action.
- Add **frequently used shortcuts** to Today, learned only from actual user clicks on tools and sections through the Hub **or their own navigation bars**. An explicit `staxx:visit` event (`{detail:{id,section}}`) may record a validated in-tool tab click; never count automatic refreshes, passive renders or programmatic section changes. Persist bounded on-device usage counts without account data; require multiple visits before promoting a shortcut, keep default navigation unchanged, never collect background view counts or send usage analytics.
- Activity is a bounded, deduplicated, *on-device* timeline fed through `staxx:activity` with `{id,events:[{id,at,title,detail,section,source}]}`. Every event needs a unique source-derived identifier and actual observation timestamp; only `source:'api'` may be shown as **Verified Torn log**, `source:'snapshot'` as **Observed change** and `source:'recorded'` as **Locally recorded**. Never present scheduled actions, watched prices, draft buy recommendations, manual trading entries or modelled P/L as verified completed Torn transactions. Data older than 30 days, in the future, duplicated, invalid or exceeding per-event limits is ignored; retain at most 120 entries locally. Search and activity data must not be uploaded or committed.
- ProfitStaxx publishes locally recorded trades/income and observed market quote checks, clearly labelled by provenance. Company Helper publishes actually matched company-news training records and separate-day *observed* company star changes, not outstanding commitments or speculative daily P/L. Happy Jump publishes genuine parsed Torn gym logs and verified drug/refill log entries, not scheduled trains, estimated stat gains or unconfirmed OD.
- Every tool retains existing navigation, API backoff, ledger, stockless service logic, overdue train eligibility rules, overdose gating, scroll preservation and user confirmation for gameplay. No new Torn API scopes or gameplay writes are authorised.
- Keep the shared StaxxHub code byte-identical in canonical source, the three active scripts and Happy Jump's versioned preview snapshot. Update regression tests for safety, parsing, version metadata and suite parity. On-device TornPDA verification is separate from GitHub CI.

## StaxxHub 3.0 — Find and navigate (2026-11-02)

- Add one accessible **Find** control in the shared StaxxHub header and in each active tool's own header. It searches known tools, explicitly registered tool sections, current actionable alerts, and existing recommendations. Filter locally and immediately, case-insensitive and token-based. Never send search terms to Torn, an analytics service, or persistent storage.
- Use the verified existing `staxx:actions` and `staxx:notice` state, respecting snoozes and dismissals; mark stale/cached results as **last observed** and never imply a cached recommendation is live. No fabricated actions, countdowns or deep links. Empty or missing data must show a helpful no-results message.
- Search results are buttons with semantic labels, reasonable mobile touch targets and keyboard support; use DOM `textContent` for untrusted values. Opening a result uses the existing hub's `openTool` and emits `staxx:open` with optional **`section`** (a short allowlisted tab identifier) or `alertId`. Only one tool may remain open.
- For Company Helper, section routing from other Torn pages must use short-lived same-origin session state and the existing explicit `/companies.php` navigation. Alert focus takes priority over `section`; never overwrite user-entered form values or silently submit any Torn action.
- A tool's **Find** button emits `staxx:find` after closing its own panel. The hub opens its search without launching a second panel or exposing a duplicate launcher. Closing search restores the previous Today/Tools/Alerts/More selection; closing the drawer clears the ephemeral query. Mobile tap works without keyboard shortcuts; optional Ctrl/Cmd+K operates only while the hub drawer is open.
- Registerable sections may be supplied as `staxx:register.detail.sections=[{id,label}]`; the hub must validate/cap entries. Built-in sections for the three active tools must match their existing tab identifiers; unknown tools expose only verified registration metadata until they register routes.
- Keep the current 302 px drawer, independent per-tool read-only models, scroll/focus preservation, the suite-wide Simple/Advanced control, alert visibility, and all stable install URLs. Verify unit tests, shared hub parity, preview snapshot parity and unchanged pinned Happy Jump stable installer. Test on TornPDA separately from CI.

## StaxxHub 2.9 — unified Simple/Advanced navigation and first-run guide (2026-11-02)

- The default is **Simple** mode across **all** active tools. A persistent `staxx-hub-mode-v1` value (`simple` or `advanced`) determines which top-navigation tabs appear; hide secondary navigation only, **never remove or skip its underlying calculations**. A contextual **More** control must reveal all hidden tabs, and the current tab must remain accessible after a deep link.
- **Advanced** displays all existing sections and up to six ranked actions on StaxxHub Today. Simple shows the most useful four to six tabs in each tool, the top two Today actions and the existing optional Show more; both modes retain all Alerts, Settings, diagnostics and drill-down destinations.
- The hub **More → Display** button changes the shared mode, persists the choice locally and dispatches `staxx:mode` with `{detail:{mode:'simple'|'advanced'}}`; every active userscript listens and re-renders only its visible navigation. It must not clear saved account data or reset an open editor.
- New installations show a compact dismissible **Welcome** guide in StaxxHub Today. Store dismissal in `staxx-hub-onboarded-v1`; More provides **Show getting-started guide** to replay it. No forced modal, extra API calls, or onboarding steps that gate gameplay.
- Keep the existing v2.8 Today's actions, tool shortcuts, alert filters, one-tap routes, 302 px drawer, safe mobile layout, page-scroll preservation and unified navy/cyan design. Alert and action filtering remains source-driven, not based solely on whether a navigation tab is hidden.
- Every suite-wide change must keep the four current active/snapshot hub regions byte-identical to `shared/staxx-hub.js`, check JavaScript parsing, and update tests tied to the current version and snapshot. The Happy Jump stable installer remains pinned.

## StaxxHub 2.8 — simple everyday navigation (2026-11-02)

- The shared left drawer starts on a compact **Today** view with the two highest-ranked verified recommendations and one-tap access to installed tools. An optional **Show more** expands to the existing six-ranked action limit without altering scores or changing source data.
- Separate top-level **Tools**, **Alerts**, and **More** views replace the long mixed drawer. Tools retains persistent reordering; Alerts retains individual alert deep-links and dismiss/snooze; More retains the combined seven-day dashboard, diagnostics and page-guidance toggle.
- On reopening the drawer show Today, so the immediate decision is always visible. Only reset drawer scroll on explicit tab changes or reopening, never during automatic refresh or event-driven rendering. Show a numbered Alerts tab label only for unsnoozed, undismissed alerts.
- Preserve the original `staxx:register`, `staxx:notice`, `staxx:actions`, `staxx:panel`, and tool-specific interaction contracts. Shared UX changes must be synchronized byte-for-byte across the canonical hub, all three active entrypoints and Happy Jump's matching preview snapshot; do not update the pinned stable installer.

## Canonical StaxxHub implementation
Canonical source: `shared/staxx-hub.js` in **Torn-ProfitStaxx**.
Integration API: `docs/STAXX-HUB-INTEGRATION.md` in the same repository.

StaxxHub is inlined in each active userscript because Torn PDA cannot be assumed to load a shared JavaScript module at runtime. Maintain byte-for-byte equality of the region from `/* StaxxHub vX.Y` through its matching `})();` across:
- `Torn-ProfitStaxx/ProfitStaxx.user.js`
- `Torn-Company-Helper/Torn-Company-Helper.user.js`
- `Torn-Happy-Jump-Helper/Torn-Happy-Jump-Helper-preview.user.js` and the CURRENT versioned preview snapshot.

The Happy Jump **stable** installer remains deliberately pinned and must not be silently upgraded just to share a theme. A cross-repo CI check validates active bundles against the canonical source; do not bypass it without documenting a justified exception.

### Event contract
- `staxx:register` and `staxx:ping`: discover tools and restore current availability.
- `staxx:open`, `staxx:closeall`, `staxx:panel`: open one tool and report visibility accurately. A targeted alert uses `staxx:open` with `{id,alertId}` so the recipient opens its Alerts tab and focuses that exact issue. Preserve the alert destination across a same-origin page transition, e.g. Company Helper opening `/companies.php`.
- `staxx:notice`: `{id,count,level,summary,items,dueAt?,alerts?:[{id,title,detail}]}`. Each alert id must be stable, tool-local, safe alphanumeric/hyphen and navigate to a matching in-tool action card. Older tools may omit `alerts`, retaining their existing generic open-tool behaviour. `dueAt` is optional; UNIX epoch **milliseconds**, from a real due time, not a guessed estimate. Levels: info/warning/urgent.
- `staxx:summary`: `{id,headline,metrics:[{label,value}],updated}`; publish concise, verified figures. `updated` is source observation time in UNIX epoch milliseconds where available.
- Notifications are **per tool**. Dismiss silences the current alert fingerprint until it changes; snooze supports 15m, 1h, 4h, 24h and custom 1–10080 minutes. Snoozes and tool order persist locally. Use local-only timers to refresh countdown labels and expire snoozes.
- Seven-day overview trends use only stored real daily observations, with missing days clearly marked. ProfitStaxx: fresh qualifying deals; Company: star rating; Happy Jump: 24h projected stat gain (**forecast**, not realized stats). Never backfill fake history.
- New tools must register an explicit id and provide their own handlers, data and alerts. Unknown scripts cannot be discovered simply from Torn PDA's installed script list.

## Action-first navigation and decision hierarchy
- Every active tool must expose an obvious **Alerts** control in its top navigation or header. A sidebar alert must open **the matching alert card**, not merely the tool homepage.
- Separate **DO NOW / NEXT / OPTIONAL** as applicable, based on verified data. Each alert card states the concrete action, key quantity/threshold, source freshness, and one prominent next-step control.
- Prefer one-click deep links to supported Torn pages (Item Market, Gym, Items, Points Building, Company). Do not guess URLs or claim a destination input was filled unless confirmed on device.
- Where safe and useful, allow a user-initiated **prepare form** action. It may stage item ID and quantity in local session storage for a brief window and enter the quantity into a single clearly identified **buy quantity** field on the correct Torn item page. If no unambiguous field is found, show a copy/manual fallback. The player checks listing price/availability and presses Buy.
- Market quote values are advisory snapshots, not guarantees. Do not select an arbitrary seller, exceed user quantity, prefill price, click Buy or bypass confirmation.
- A tool-specific action can route to its own relevant section before offering a Torn game-page shortcut. Prefer manual final confirmation for all game-affecting operations.
- Keep panel-focus, staged form data and alert identity minimal and short-lived. Never expose private data in public repos or cross-tool notifications.

## Required change process
1. Read the CURRENT standard, suite changelog, integration guide, relevant repository `AGENTS.md` and source/test files.
2. Identify shared impact and compatibility constraints for each tool.
3. Change the central hub once, run syntax and unit/integration tests, then update all active bundled copies. Bump each changed userscript version to ensure auto-updates.
4. Update the corresponding Happy Jump versioned preview snapshot and parity test without altering pinned stable.
5. Update or add regression tests for real-world mobile behaviour (closing a tool restores launcher, reordering persists, snoozing and countdowns work, missing history is not filled).
6. Run every affected repository's CI and the cross-repo hub sync workflow. Fix failures; don't claim device runtime is tested if only CI was run.
7. Document meaningful cross-tool changes in the suite changelog. Keep stable raw GitHub installer URLs.
8. If a feature needs game-state writes, external services, sensitive data or new API scopes, stop and seek explicit authorization.

## Mandatory next-action experience (StaxxHub 2.3)

- Every active tool publishes `staxx:actions` with up to 12 clear, ranked, meaningful tasks whenever verified data changes.
- Cross-tool queue shows six highest priority actions, sorted **urgent → now → soon → review → optional**, then actual due timestamp and bounded confidence/priority.
- An action has a stable ID, plain-language imperative, quantitative context when available, data freshness or uncertainty note, and an actual one-tap route to its corresponding tool Alerts card. Do not render dead links.
- Never confuse a forecast, asking price, investment upside or stale observation with an actual completed game action or executable order.
- If no reliable data exists, the correct primary action is Refresh or Recheck, not speculative advice.
- **Company paid training is an actionable alert only when the currently reported train bank has at least one unit that can be assigned to an eligible employee with a confirmed unpaid training obligation** (the existing oldest-first queue allocates at least one train). Outstanding purchases remain visible in the training ledger while availability is zero, unknown or no employee is eligible; they must not increase the badge, Alerts tab, or `staxx:actions` queue. Storage-capacity/overflow warnings and unverified-payment review are independent issues. Never treat future daily train awards as currently available.
- All business/game mutations remain user-confirmed inside Torn. A user-initiated DOM quantity prefill is allowed only after unambiguous verification of item, route and input; no auto-click or automatic purchase.

## Current active version mapping
The exact versions change independently:
- ProfitStaxx main installer: `ProfitStaxx.user.js`.
- Company Helper main installer: `Torn-Company-Helper.user.js`.
- Happy Jump: `Torn-Happy-Jump-Helper-preview.user.js` for enhancements; keep `Torn-Happy-Jump-Helper.user.js` as stable rollback.

Update this mapping if paths or release policy change; do not hardcode an obsolete version in these instructions.

## StaxxHub 2.4 — native context and modelling discipline (2026-11-01)

- StaxxHub's one-line, **opt-out** in-page advisor is desktop-only (minimum 850 CSS px, fine pointer and non-touch), and appears immediately after an identifiable Torn heading on the Gym (/gym.php), Company (/companies.php) or Item Market (/page.php?sid=ItemMarket) pages. If Torn's page structure changes or no heading exists, skip embedding rather than overlaying an arbitrary element.
- The contextual card uses an already-published fresh `staxx:actions` recommendation and its stable alert ID, opens the matching script/Alerts card, and does **not** query the Torn API on its own. When stale or missing, show a “check recommendations” prompt rather than a supposedly live action.
- Context visibility is stored locally via `staxx-hub-context-v1` (default on where layout is safe); the sidebar provides an explicit on/off toggle. Hide the embedded card when sidebar or a tool panel is open. Keep native Torn controls unobstructed. On touch/mobile layouts, never insert guidance into native Torn headings: retain actionable recommendations and alerts in the existing StaxxHub drawer instead. Do not inject fallback refresh cards on-page: automatic foreground reads handle freshness, and error details remain inside the tool. Verify heading parent width before insertion and remove existing inline tips after a viewport resize.
- Native contextual recommendations are not proof of automatic native form preparation. ProfitStaxx's verified-by-item-ID, user-tapped quantity handoff stays separate and always requires final manual purchase confirmation.
- ProfitStaxx 1.6.0 adds a risk-weighted shortlist respecting available capital and its existing per-item/trade exposure caps; history is a *sample of observed asking prices*, not actual market trades. “Profit per review minute” includes a user-configurable active-review-time assumption but **excludes unknown time-to-sale**. Sell-timing indicators must not imply genuine buyer depth.
- Company Helper 1.9.0 extrapolates training stat shortfall only from dated working-stat observations; wage scenarios hold revenue/advertising constant and never claim that paying more earns stars. A next-star *historical pace* estimate may appear only with a meaningful record of Sunday star gains; never claim Torn exposes a reliable deterministic promotion formula.
- Happy Jump 0.18.0 compares forecast gym gains per energy and incremental cash per 1,000 forecast stat gain, uses the actual planned refill event for timing, and distinguishes observed daily stat changes from straight-line 30/90-day scenarios. Suspend training recommendations on reported overdose; never override live user choices.
- A suite update MUST preserve preview/snapshot body parity, pinned stable HJ installer, canonical shared Hub byte-for-byte parity, existing local data and read-only gameplay, then pass all affected regression suites and cross-repo sync checks.

## WarStaxx 0.1 — fourth tool registration (2026-11-03)

- Active fourth tool: **WarStaxx**, repository **Torn-WarStaxx**, entrypoint **WarStaxx.user.js**, registered tool ID **war**. Use the existing one-launcher StaxxHub; include the byte-identical canonical source and publish summary, actions, notices, panel, diagnostics and visit events. Add generic in-tool Find, Simple/Advanced tabs and local section routing. Preserve the original three tools and pinned Happy Jump stable installer unchanged.
- Read-only official API access may collect both factions' public current and historical ranked-war information, rosters/statuses, war reports, and optional permitted faction attack data. Bound archival requests, enforce backoff and stop API work when Torn is hidden. Do not auto-attack, use consumables, trade, assign game positions or post in faction chat.
- **Temporal provenance:** distinguish historic war results from player-online/travel behaviour observed *during a currently monitored war*. Completed report entries do not retrospectively reveal status or travel schedules. Every forecast must show its source, sample size, age and uncertainty.
- **FF and battle statistics:** unknown stats remain unknown; accept verified/manual per-player spies, confirmed attack-log FF and clearly named external estimates. Actual FF from Torn attacks, manually supplied spy stats, and modelled FF must be visually separate. An FFScouter integration must be opt-in with the player's independently supplied registered key, third-party data-policy link, no silent key sharing, and no false per-hitter precision.
- **Member planning:** show a distinct proposed task for each friendly member; never imply that an unverified matchup is safe. Local manual assignments take priority, and no local order is automatically distributed to other faction members. WarStaxx currently has no cross-device coordination backend.
- **Cross-tool:** discovery in StaxxHub Today, Dashboard, Find, Tools and Alerts; explicit user-led navigation to Happy Jump, ProfitStaxx and Company Helper. Only share non-secret, read-only war context via events and never alter their unrelated core calculations or existing API key permissions.
- Add WarStaxx to the canonical suite manifest and shared parity tests. Existing three tool entrypoints are not required to change if the canonical Hub implementation is unchanged. Treat CI and TornPDA live installation verification separately.
