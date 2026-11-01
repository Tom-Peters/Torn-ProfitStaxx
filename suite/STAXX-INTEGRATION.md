# StaxxHub v2.5 — integration contract for every future Staxx tool

**Author: IamEEKY.** This is the canonical compatibility contract for TornPDA userscripts in the Staxx suite. A new helper (for any Torn game system) joins the same launcher, overview, priority queue and diagnostics without hard-coded additions to the sidebar.

## Tool registration

- Embed the **exact** shared launcher from `shared/staxx-hub.js`, including its version header. Keep canonical and all active tool bundles in sync; the suite CI checks bytewise equality.
- Register on startup, and reply to `staxx:ping` with an identical `staxx:register` event. Example (fictional tool with no real personal data):

```js
const register = () => document.dispatchEvent(new CustomEvent('staxx:register', {
  detail: { id:'example', label:'ExampleStaxx', icon:'EX',
    desc:'A concise tool category description', trendMetric:'Completed',
    freshnessMs:900000 }
}));
document.addEventListener('staxx:ping',register);
register();
```

IDs: lowercase letters followed by 0–31 lowercase alphanumeric/dashes. Every tool must use a distinct ID, a unique launcher, and must not expose any real API keys. `freshnessMs` between 60,000 and 86,400,000 declares when its proposed actions become unverified in the hub. When no value is given, StaxxHub defaults to one hour.

- Emit `staxx:summary`: `{id,headline,metrics:[{label,value}],updated:Date.now()}`. For observed trend bars, the registration's `trendMetric` must exactly equal a metric label. Current timestamps must be truthful; do not relabel cached forecasts as new observations.
- Emit `staxx:actions`: `{id,items:[{id,title,detail,status:'urgent'|'now'|'soon'|'review'|'optional',priority:0..100,dueAt?:futureUnixMilliseconds}],updated:actualDataTime}`. Include meaningful user-led actions only. A stale item is downgraded and explicitly labelled; it is never silently presented as a verified urgent task.
- Emit `staxx:notice`: `{id,count,level:'urgent'|'warning'|'info',summary,alerts:[{id,title,detail}]}`. Alerts need stable unique IDs so the hub can deep-link. Never invent an alert merely to increase FAB badges.
- Emit `staxx:panel` when the panel opens or closes: `{id,open:true|false}`. Listen to `staxx:open` and `staxx:closeall` so panels don't overlap; `staxx:open` contains `detail.alertId` for exact alert focus. Always leave real Torn purchases/actions user-confirmed.

## Diagnostics

Listen to `staxx:diagnostics-request` and respond synchronously with `staxx:diagnostics` containing:
```js
{
 id:'example', version:'0.1.0',
 api:'ready'|'stale'|'missing'|'error'|'unknown',
 storage:'ready'|'missing'|'error'|'unknown',
 ui:'ready'|'missing'|'error'|'unknown',
 detail:'Short generic status without data or secrets'
}
```
Also provide an internal Diagnostics page that shows API permissions, most recent successful observation, storage and UI mounting, without revealing the key itself or any employee, trade, player or inventory records. Copy/export only the explicitly allowlisted fields.

## Reliability checklist

1. Same permanent userscript URL with a version bump. Use preview snapshots for unverified major changes; never overwrite the phone-confirmed Happy Jump stable installer without the user approving promotion.
2. Preserve scroll positions, form drafts, expanded sections and focus when re-rendering progressive API responses.
3. Never fabricate sale fills, stat gains, training purchases, wages or personal funds from quote estimates. Label observed, user-entered, modelled and unverified fields.
4. Respect TornPDA permissions and API rate limits. No automatic gameplay writes. API keys must not leave `api.torn.com` or be copied into reports or repositories.
5. Run each repo's regression tests and `scripts/check-suite-sync.mjs` after every suite-wide launcher edit. Confirm release metadata and versioned snapshot parity.
6. All public source, test examples and docs credit only `IamEEKY`; no personally identifying or gameplay secrets.

### Adding a fourth/fifth tool

Create its repo and implement registration, notifications, actions, summaries and diagnostics using the above events. The launcher automatically discovers and remembers new registrations. Add the new repo's path to `suite/manifest.json` only when its userscript is ready and CI should enforce canonical StaxxHub bundle parity for it.
