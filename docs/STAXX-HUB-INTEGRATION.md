# StaxxHub 2.1 integration

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

## Visual system

Dark navy background `#08192d`, card `#0d2945`, lighter stats `#102844`, border `#284b6b`, electric blue `#54d7fa`, action `#0879bd`, success `#49e2ad`. Tool panels use a top header and compact horizontally scrollable tabs. Keep all game operations read-only.

## Compatibility and testing

The stable Happy Jump installer stays pinned; StaxxHub 2 is integrated with the ongoing Happy Jump preview channel. When creating new releases, update the permanent preview and its versioned snapshot together. CI checks JavaScript syntax and runs the separate regression suites. Test in Torn PDA after installation for visual/interaction behaviour.
