# Torn Staxx Suite — Development Standard
Version: **2026.11.02.2** · Maintainer: **IamEEKY** · Applies to **every present and future Torn userscript/tool** in this suite.

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
