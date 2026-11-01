# Torn Staxx Suite — Development Standard
Version: **2026.11.01** · Maintainer: **IamEEKY** · Applies to **every present and future Torn userscript/tool** in this suite.

**Canonical document:** https://raw.githubusercontent.com/Tom-Peters/Torn-ProfitStaxx/main/docs/TORN-SUITE-STANDARD.md

This file is the single source of truth for *cross-script* behaviour, design and integration. Each repository keeps a small root-level `AGENTS.md` that links to this document and tells coding assistants to read the latest revision before changing Torn code. **Updating this file does not automatically change running userscripts**. Shared implementation changes must be synchronized, checked, committed and released in all affected repositories.

## Scope and inheritance
1. Applies to ProfitStaxx, Torn Company Helper, Torn Happy Jump Helper, and **new** Torn tools. Retain project-specific calculations and features unless the task explicitly changes them.
2. When a task impacts two or more tools, update this standard first, update the canonical implementation, distribute the implementation and test every affected entrypoint.
3. A repository's project-level documentation can add rules but cannot silently override shared rules; record any necessary exception here, with reasons and expiry/review conditions.
4. Treat user-approved decisions and newly discovered recurring bugs as candidate standard changes. Record the decision in `docs/TORN-SUITE-CHANGELOG.md`. Increase the standard version when the rule itself changes.
5. Do not assume a past ChatGPT session automatically reloads GitHub. Read this canonical file during future tasks and report if inaccessible rather than silently applying an outdated version.

## Non-negotiable rules
- **Public attribution:** `IamEEKY` only in author credits, README examples, commit message authored metadata and docs. Keep real API keys, employee data and user-specific transactions OUT of GitHub. Existing repository URL namespaces are unchanged.
- **Read-only Torn interactions:** No automated gameplay actions, no browser HTTP writes to Torn. User-driven script buttons may perform permitted **local** calculations, preference persistence and client navigation only.
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
- `staxx:open`, `staxx:closeall`, `staxx:panel`: open one tool and report visibility accurately.
- `staxx:notice`: `{id,count,level,summary,items,dueAt?}`; `dueAt` is UNIX epoch **milliseconds** and must come from a real due time, not a guessed estimate. Levels: info/warning/urgent.
- `staxx:summary`: `{id,headline,metrics:[{label,value}],updated}`; publish concise, verified figures. `updated` is source observation time in UNIX epoch milliseconds where available.
- Notifications are **per tool**. Dismiss silences the current alert fingerprint until it changes; snooze supports 15m, 1h, 4h, 24h and custom 1–10080 minutes. Snoozes and tool order persist locally. Use local-only timers to refresh countdown labels and expire snoozes.
- Seven-day overview trends use only stored real daily observations, with missing days clearly marked. ProfitStaxx: fresh qualifying deals; Company: star rating; Happy Jump: 24h projected stat gain (**forecast**, not realized stats). Never backfill fake history.
- New tools must register an explicit id and provide their own handlers, data and alerts. Unknown scripts cannot be discovered simply from Torn PDA's installed script list.

## Required change process
1. Read the CURRENT standard, suite changelog, integration guide, relevant repository `AGENTS.md` and source/test files.
2. Identify shared impact and compatibility constraints for each tool.
3. Change the central hub once, run syntax and unit/integration tests, then update all active bundled copies. Bump each changed userscript version to ensure auto-updates.
4. Update the corresponding Happy Jump versioned preview snapshot and parity test without altering pinned stable.
5. Update or add regression tests for real-world mobile behaviour (closing a tool restores launcher, reordering persists, snoozing and countdowns work, missing history is not filled).
6. Run every affected repository's CI and the cross-repo hub sync workflow. Fix failures; don't claim device runtime is tested if only CI was run.
7. Document meaningful cross-tool changes in the suite changelog. Keep stable raw GitHub installer URLs.
8. If a feature needs game-state writes, external services, sensitive data or new API scopes, stop and seek explicit authorization.

## Current active version mapping
The exact versions change independently:
- ProfitStaxx main installer: `ProfitStaxx.user.js`.
- Company Helper main installer: `Torn-Company-Helper.user.js`.
- Happy Jump: `Torn-Happy-Jump-Helper-preview.user.js` for enhancements; keep `Torn-Happy-Jump-Helper.user.js` as stable rollback.

Update this mapping if paths or release policy change; do not hardcode an obsolete version in these instructions.
