# Archived v3 integration reference

**Current authoritative contract:** https://github.com/Tom-Peters/TornStaxx/blob/main/docs/INTEGRATION.md. Since 2026-11-04, TornStaxx alone provides the shared UI; the four modules no longer embed it. Preserve the domain safeguards below.

# StaxxHub 3.4 integration

## Session budget and API-verified checklist (3.4)

Today includes an explicit local-only session length preference: Any or 5, 10, 15, 30, 60 minutes. It improves tie-breaking among actions of **equal urgency and due time** based on source-supplied `reviewMinutes`; a suggested check does not promise the full gameplay operation fits. An optional **Fits** filter shows only fresh actions with a measured review estimate within the budget.

A Daily checklist shows captured API-verified completions distinct from source recommendations, locally reviewed suggestions, snapshots, and manual notes. Source-published `staxx:activity` events may include `completedActionId` only when an actual individual Torn API event conclusively closes the named live recommendation. The Hub validates this against the live action report, stores only a bounded locally derived signature, and removes that action from Pending until the recommendation changes or the UK calendar day changes. Without exact evidence, it stays pending even if a similar log exists.

ProfitStaxx 1.22.6 optionally reads Torn's Full-access `user/log` with existing key permission and strict source matching to reconcile actual cash stock dividend receipts; when permissions are insufficient, it leaves receipt totals unverified rather than reporting zero. Realised receipts are kept separate from manual income, ledger P/L and estimated forecasts. Stock benefit blocks are ranked by current holdings, required incremental shares, capital reserve and verified wallet when available. No automatic purchasing or claiming.

## Five cross-tool upgrades (3.3)

**Changed since last review:** fresh staxx:actions reports are compared locally with bounded hashes of prior action signatures. The first report establishes a baseline. Later new or materially changed recommendations are highlighted until the user marks changes seen. No raw recommendation text is stored in the change index.

**Daily evidence:** Dashboard counts today's staxx:activity events by source, tool and Europe/London date. Verified API logs, observed snapshots and local entries remain separate. A zero count means no evidence was captured on this device, not that no action took place.

**Early warnings:** Today shows actionable source-reported urgent/now/soon items with a valid future dueAt within 60 minutes. Never invent deadlines or treat checked suggestions as completed Torn actions. Existing alert suppression is respected.

**Page context:** Today offers a single existing-section shortcut for recognised gym, company, inventory, points, item market and stocks Torn pages. It does not edit any native form fields.

**Personal relevance:** Explicit Useful/Less relevant votes adjust rank by up to ten points, only after source urgency and actual due time. No inferred popularity, external analytics, automated gameplay or extra API permissions. Votes can be reset in More.



Author: IamEEKY. Read-only visual launcher for Torn PDA. The canonical implementation lives in `shared/staxx-hub.js` and is bundled directly into each participating userscript. No remote `@require` dependency is needed.

## Local review queue and source freshness (3.2)

Today displays a **Pending** review queue. A player may mark a fresh, nonurgent recommendation **Checked for now** to hide it from Pending and Best Next Review for four hours at most. The **Checked** filter lets the player restore it. A materially changed source recommendation (title, detail, status, priority or due time) reappears automatically, even before expiry. This action does NOT indicate a completed Torn training, purchase, payment, trade, or consumable use.

Urgent and stale/cached recommendations cannot be marked checked. Alerts and tool badges continue unchanged. Fingerprints are stored locally in a bounded `staxx-hub-reviewed-v1` record (max 60) and never transmitted. Source status indicators distinguish recently reported actions from previous reports, missing reports and tools not active on this Torn page. Recent report does not prove live Torn state.

Existing `staxx:actions` publishers require no changes. Use stable IDs and evidence-grounded details to support reliable change detection.

## Unified dashboard and evidence timeline (3.1)

The StaxxHub **Dashboard** is a single current/last-observed read-only view of every registered helper's existing `staxx:summary` metrics. The **Today** tab ranks fresh `staxx:actions` using source urgency, due date and priority, and groups additional recommendations under **Do now**, **Soon** and **Optional**.

An optional `reviewMinutes` integer (1–60) on each action supplies a *human review-time estimate*. The hub does not guess durations when missing and never represents an estimate as time to carry out a Torn operation. Freshness filtering avoids presenting cached advice as a live verified opportunity.

The **Activity** timeline accepts source-backed events only through the following local event. It does not inspect user transactions automatically from the DOM and does not send user data to an external endpoint:

```js
document.dispatchEvent(new CustomEvent('staxx:activity', {
  detail: {
    id: 'my-next-staxx',
    events: [
      { id: 'source-log-123', at: Date.now(), source: 'api',
        title: 'Example confirmed event', detail: 'Confirmed from Torn API log',
        section: 'history' }
    ]
  }
}));
```

The hub requires a bounded unique event ID, a timestamp within the last 30 days, and one of `source:'api'` (**Verified Torn log**), `source:'snapshot'` (**Observed snapshot**) or `source:'recorded'` (**Locally recorded**). A provider must only use `api` for an actual matched Torn log; a modelled daily return, a forecast, a planned train, or a manual ledger entry is never proof of a completed Torn action. Events are deduplicated and stored locally, capped at 120. Users can clear activity from its tab.

**Your shortcuts** learn from repeated user-initiated opens through the shared hub **and deliberate tab clicks inside a helper**. A helper should dispatch an event only from its real tab-click handler, after validating the selected section:

```js
document.dispatchEvent(new CustomEvent('staxx:visit', {
  detail: {id: 'my-next-staxx', section: 'history'}
}));
```

The Hub rejects unregistered tools and unknown sections, suppresses duplicate events within 10 seconds, and never counts background renders or automatic refreshes.

**Your shortcuts** learn from explicitly chosen sections. The usage history is local-only, capped and has a reset control in **More**. This never modifies the ordering of the standard tool navigation or collects background browsing activity.

The data provenance, no API key publication, read-only gameplay safeguards, stockless company alert exclusions and paid-train availability gates remain mandatory.

## Find and section deep links (3.0)

The header **Find** button and each active tool's own Find button search a single local index of installed tools, registered sections, unsnoozed/undismissed alerts and source-provided next actions. The search runs entirely on-device; no additional Torn API call, network request or saved search history is introduced. Cached results are marked **Last observed**. Results are selected using the same read-only `staxx:open` / existing alert routing.

Tools can offer safe in-tool section destinations by registering validated section identifiers:

```js
document.dispatchEvent(new CustomEvent('staxx:register', {
  detail: {id:'my-next-staxx',label:'NextStaxx',
    sections:[{id:'overview',label:'Today'},{id:'history',label:'History'}]}
}));
document.addEventListener('staxx:open', event=>{
  if(event.detail?.id!=='my-next-staxx')return;
  // Existing alertId has priority; otherwise choose a validated known section.
  if(event.detail.alertId)showAlert(event.detail.alertId);
  else if(['overview','history'].includes(event.detail.section))showSection(event.detail.section);
  openExistingPanel();
});
```

On a tool's **Find** button, first close its existing panel and publish `staxx:panel` with `open:false`, then dispatch `new CustomEvent('staxx:find')`. The shared hub opens Find with the current page's locally known data. It never opens multiple tools or submits any Torn gameplay action.

The built-in `profit`, `company` and `happy` section lists match their current tab IDs. Company Helper navigation from other Torn pages uses the existing `/companies.php` route with a short-lived session handoff. Alert focus is prioritised over a section, and only the named destination is changed.

## Shared usability state (2.9)

Every installed active tool uses the same local `staxx-hub-mode-v1` JSON string. The default is `"simple"`; `"advanced"` exposes all existing navigation. StaxxHub sends `staxx:mode` after an in-app mode switch; a tool reads the saved value and re-renders its visible tab strip, leaving the current active tab, calculations, local records, alert targets and form values intact. Each Simple tab strip includes a **More** control to expose the remaining views without changing global mode.

StaxxHub Today includes a first-run guide. Dismissing it stores `staxx-hub-onboarded-v1` as JSON `true`. Users may replay it under the hub More tab; onboarding is optional and never requests new API scopes or gameplay writes.

## Existing scripts
- ProfitStaxx: `profit`
- Company Helper: `company`
- Happy Jump preview: `happy`

A new Staxx userscript **automatically appears in the sidebar** once it includes the shared hub and registers itself on the page. The registry remembers previously discovered tools in local browser storage, including across Torn page transitions; it does not read Torn PDA's installed script list.

## Registering a new script

After creating its UI, listen for the hub's ping and register the script (repeatable and safe):

```js
function register() {
  document.dispatchEvent(new CustomEvent('staxx:register', {
    detail: {
      id: 'my-next-staxx',
      label: 'NextStaxx',
      icon: 'NS',
      desc: 'Short description'
    }
  }));
}
document.addEventListener('staxx:ping', register);
register();
```

The hub will show the tool immediately and persist its description. Valid IDs are lowercase alphanumeric with hyphens, starting with a letter, maximum 32 characters.

## Opening and closing

```js
document.addEventListener('staxx:open', (event) => {
  if (event.detail?.id !== 'my-next-staxx') return;
  // Open the existing tool UI; do not start a second userscript.
  document.dispatchEvent(new CustomEvent('staxx:panel', {
    detail: {id: 'my-next-staxx', open: true}
  }));
});
document.addEventListener('staxx:closeall', () => {
  // Close the tool if it was open.
  document.dispatchEvent(new CustomEvent('staxx:panel', {
    detail: {id: 'my-next-staxx', open: false}
  }));
});
```

Always publish `staxx:panel` with `open:false` when closing your own panel. The hub hides its floating S tab whenever a tool panel is open and restores it on close.

## Notifications

```js
document.dispatchEvent(new CustomEvent('staxx:notice', {
  detail: {
    id: 'my-next-staxx',
    count: 2,
    level: 'warning', // info | warning | urgent
    summary: 'Two items need attention',
    items: ['Item A', 'Item B'],
    dueAt: Date.now() + 20 * 60000 // optional: actual known due time in ms
  }
}));
```

Notifications are aggregated **per tool**, not individual dismissed messages. **Dismiss** silences a specific notification fingerprint until the data changes. **Snooze** provides 15 minutes, 1 hour, 4 hours, 24 hours, and a custom value from 1 to 10,080 minutes (7 days). Unchanged notifications from other pages are labelled as previous observations. Both controls are local-only. Add an optional `dueAt` UNIX epoch **millisecond** timestamp to the notice payload only when the tool has a real due time; the hub displays and refreshes its countdown once a minute, and never guesses missing timestamps.

## Combined overview

```js
document.dispatchEvent(new CustomEvent('staxx:summary', {
  detail: {
    id: 'my-next-staxx',
    headline: 'Latest verified status',
    metrics: [
      {label: 'Current total', value: '123'},
      {label: 'Next task', value: 'Today'}
    ],
    updated: Date.now()
  }
}));
```

Use actual API or locally computed values, label forecasts as estimates, and omit missing measurements. The overview remembers the most recent figures for the current Torn session. **Seven-day charts** store a local, bounded snapshot per observed day, without fabricating missing days. For built-in tools: ProfitStaxx uses fresh qualified deals; Company Helper uses current star rating; Happy Jump uses the **forecast** 24-hour projected gains (not actual earned gains). Each tool's `updated` value should reflect the underlying data's observation time, not just the latest rerender. Never publish API keys, user secrets, or individual employee records to GitHub.

## Tool ordering and future discovery

The Reorder control exposes touch-friendly Up/Down arrows and saves preferred order in local storage. New tools register themselves through `staxx:register` and show up on the same Torn page without reading the PDA installed-scripts list.

To add a new Torn repository to the suite: copy the standard `AGENTS.md`, bundle the **canonical** `shared/staxx-hub.js`, register events, then add the active entry to `suite/manifest.json` in Torn-ProfitStaxx. The shared cross-repository GitHub Actions workflow reads that manifest and detects out-of-sync code daily and on relevant pushes.

**Shared source of truth:** `docs/TORN-SUITE-STANDARD.md` and `docs/TORN-SUITE-CHANGELOG.md` in Torn-ProfitStaxx. These are instructions for future work, not a remote auto-update mechanism for already-installed scripts.


## Actionable individual alerts (v2.2)

Tool notifications can now include individual alert descriptors. Use stable, non-sensitive identifiers and a concise next action, not a full imported record:

```js
document.dispatchEvent(new CustomEvent('staxx:notice', {detail:{
  id:'profit', count:1, level:'warning',
  summary:'1 market opportunity needs review',
  alerts:[{id:'deal-123',title:'Review buying 100 medical items',detail:'Live price must be checked before buying'}]
}}));
```

The Hub renders one button per alert. Clicking it sends `staxx:open` with `{id:'profit',alertId:'deal-123'}` and closes the sidebar. Every participating tool must open its **Alerts** view, focus the matching element and show a clear action path. If the tool has to navigate to its native Torn route first (Company Helper), carry the `alertId` in session storage and consume it once on arrival. Generic tool buttons still open normally with no alert id. Older notifications without `alerts` still show basic text.

Individual alerts are cached only as brief labels/descriptions, and cannot encode arbitrary URLs or scripts in their IDs. The hub does not itself click, purchase, train or make Torn API calls.

### User-led Torn navigation and form preparation
- Tool-level action cards should offer **one primary next-step button** and show why it matters.
- Prefer verified Torn routes. ProfitStaxx uses `/page.php?sid=ItemMarket#/market/view=search&itemID=<id>`.
- When the user explicitly taps a purchase-preparation button, ProfitStaxx stages the item ID, proposed quantity, upper modeled unit price and age for up to ten minutes in same-origin `sessionStorage`.
- On arrival, it must verify item ID and find **one** visible, enabled, clearly buy-related quantity field. Never override a user-changed field. If ambiguous, offer a copy-quantity fallback rather than guessing.
- **No purchasing:** never click Buy, submit forms, select a seller, accept a trade or alter Torn gameplay state. User verifies current listing cost, available units and manually confirms the purchase.
- Happy Jump links to Gym, Items and Points Building; Company Helper links to its specific internal decision views. Only navigate to verified pages.
- Distinguish recommended, due, overdue and optional actions from observed data. Show saved-data freshness and protect all existing read-only API behaviour.

## Visual system

Dark navy background `#08192d`, card `#0d2945`, lighter stats `#102844`, border `#284b6b`, electric blue `#54d7fa`, action `#0879bd`, success `#49e2ad`. Tool panels use a top header and compact horizontally scrollable tabs. Keep all game operations read-only.

## Compatibility and testing

The stable Happy Jump installer stays pinned; StaxxHub 2 is integrated with the ongoing Happy Jump preview channel. When creating new releases, update the permanent preview and its versioned snapshot together. CI checks JavaScript syntax and runs the separate regression suites. Test in Torn PDA after installation for visual/interaction behaviour.

## Prioritised cross-tool action queue (v2.3)

All active tools should publish a **compact, data-grounded set of next steps** whenever the underlying data materially changes. StaxxHub shows the six highest-priority actions **above the tool list**. Tapping an action opens the **exact matching** card inside the tool's Alerts screen.

```js
document.dispatchEvent(new CustomEvent('staxx:actions', {detail:{
  id:'profit',
  updated:Date.now(), // timestamp of underlying verified data, not a UI rerender
  items:[
    {id:'deal-42',title:'Review buying 100 items',
     detail:'Estimated profit only; check the live item-market listing.',
     status:'review',priority:72},
    {id:'refresh-scan',title:'Refresh old prices',
     detail:'Market quote is no longer fresh.',status:'now',priority:90}
  ]
}}));
```

Statuses: `urgent` (critical issue or confirmed overdue), `now` (action needed first), `soon` (due shortly), `review` (advisory) and `optional`. Priority is an optional integer 0–100 to break ties **within a status**, not to override urgency. Optional `dueAt` is an actual verified time in milliseconds, not guessed. IDs must match safe, stable local alert IDs (`^[a-z][a-z0-9-]{0,63}$`). Max 12 actions sent per tool; 6 shown in the combined queue.

Hub remembers brief descriptions during Torn page transitions for up to four hours and marks them **LAST OBSERVED**. A cached item is not proof that its underlying opportunity is still valid. The target script should refresh and show why an action is still relevant. Do not embed key material, private employee data, full imported records or unsupported links.

**Script-specific action expectations:** ProfitStaxx shows fresh buy opportunities, a price-refresh action, and asking-price-based sell reviews only when supported by recorded holdings. Company Helper shows confirmed train obligations, bank overflow, losses, stock shortage, pending payment review and stale-data refresh. Happy Jump shows overdose recovery holds, scheduled events, current gym readiness, stale-data refresh and verified owned-book opportunities. All game actions require a separate user gesture and Torn confirmation.

## Seamless Torn navigation
- Opening from the Hub should close the sidebar/FAB, then reveal the destination tool and focus the exact alert.
- User-initiated ProfitStaxx buy preparations may prefill **only** a verified quantity field on a matching Item Market route. Never submit a transaction.
- Gym and points actions link to the live Torn pages; no remote gameplay write.
- Company Helper opens on Torn companies.php and restores an alert ID through sessionStorage.
- Keep visual chrome modest, accessible and compatible with Torn PDA touch interfaces. Do not cover Torn's own controls.

## Contextual integration (StaxxHub 2.4)

Without any new Torn API calls, Hub reads the locally published `staxx:actions` for the relevant tool and, where a known native heading is available, inserts one compact, screen-reader-labelled **Staxx next-action card** in the Torn page. Supported locations:
- `/gym.php` → Happy Jump; `/companies.php` → Company Helper; `/page.php?sid=ItemMarket` → ProfitStaxx.
- On unknown page layout, missing data, unavailable installed tool, cached or stale actions, and refresh-only advice, StaxxHub skips the native card. Those items remain available in the drawer and tools automatically try permitted foreground reads. Cached cross-page advice is never presented as a live recommendation.
- The player can disable/enable this from the Hub drawer with **On-page guidance: On/Off**, stored only in browser `localStorage["staxx-hub-context-v1"]`. The preference is on by default **only where safe to render**: StaxxHub v2.7 automatically suppresses on-page tips on touch/phone layouts, narrow viewports and cramped Torn headings, regardless of preference; every alert remains in the StaxxHub drawer. Inline hints disappear while a tool/drawer is open and after an unsuitable resize.
- User taps the card's button to dispatch the same `staxx:open` event `{id,alertId}` already used by the sidebar. No automated clicks on native Torn actions; scripts handle any optional user-initiated form preparation and leave the game-state operation to the player.
- The card uses `textContent`, not untrusted HTML, and is not fixed over the game controls. It checks for late-loaded headings periodically while the Torn page remains visible. **Visual compatibility with the live Torn PDA UI must be verified on-device**.

## Data-model additions

- ProfitStaxx 1.6.0: advisory capital allocation, sampled ASK-market history and listing competition. Return-on-active-review-time uses a user-configurable workload assumption; genuine time to sell is unknown.
- Company Helper 1.9.0: observed employee working-stat development pace, wage scenarios that do not change actual wages, and cautious multi-Sunday star history.
- Happy Jump preview 0.18.0: gain-per-energy and extra cash-per-1k-stat forecasts, scheduled refill timing and observed-versus-projected long-term progress.
- All three publish existing `staxx:actions` and target existing `Alerts` cards; no extra Hub API scope or gameplay writes were added.
