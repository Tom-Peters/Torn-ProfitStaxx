# StaxxHub 2.3 integration

Author: IamEEKY. Read-only visual launcher for Torn PDA. The canonical implementation lives in `shared/staxx-hub.js` and is bundled directly into each participating userscript. No remote `@require` dependency is needed.

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
- On unknown page layout, missing data, unavailable installed tool, cached or stale actions, the card provides only a safe “check recommendations” route or skips insertion. Cached cross-page advice is never presented as a live recommendation.
- The player can disable/enable this from the Hub drawer with **On-page guidance: On/Off**, stored only in browser `localStorage["staxx-hub-context-v1"]`. Enabled by default, automatically hidden when a tool or drawer is open.
- User taps the card's button to dispatch the same `staxx:open` event `{id,alertId}` already used by the sidebar. No automated clicks on native Torn actions; scripts handle any optional user-initiated form preparation and leave the game-state operation to the player.
- The card uses `textContent`, not untrusted HTML, and is not fixed over the game controls. It checks for late-loaded headings periodically while the Torn page remains visible. **Visual compatibility with the live Torn PDA UI must be verified on-device**.

## Data-model additions

- ProfitStaxx 1.6.0: advisory capital allocation, sampled ASK-market history and listing competition. Return-on-active-review-time uses a user-configurable workload assumption; genuine time to sell is unknown.
- Company Helper 1.9.0: observed employee working-stat development pace, wage scenarios that do not change actual wages, and cautious multi-Sunday star history.
- Happy Jump preview 0.18.0: gain-per-energy and extra cash-per-1k-stat forecasts, scheduled refill timing and observed-versus-projected long-term progress.
- All three publish existing `staxx:actions` and target existing `Alerts` cards; no extra Hub API scope or gameplay writes were added.
