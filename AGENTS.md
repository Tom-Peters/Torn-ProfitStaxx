# AGENTS.md — Profit-TornStaxx

Read the **current** dedicated hub standard before modifying suite UI:
https://raw.githubusercontent.com/Tom-Peters/TornStaxx/main/AGENTS.md
https://raw.githubusercontent.com/Tom-Peters/TornStaxx/main/docs/INTEGRATION.md

The old `shared/staxx-hub.js` is a frozen legacy test source; do **not** embed it in modules.

- Canonical hub: `Tom-Peters/TornStaxx/TornStaxx.user.js`.
- Active Profit module installer: `ProfitStaxx.user.js` in this repository. Keep URL stable until migration is verified.
- Author attribution: **IamEEKY** only. No secrets, employee records or player accounts in GitHub.
- Preserve stock benefits, passive income modelling, read-only market analysis, ledger, cash receipt provenance, stockless company support and existing UI.
- Keep a tiny fallback launcher for absent hub, never a second full hub. Stable tool ID remains `profit`.
- Test with `node --test tests/*.test.js` and `node scripts/check-suite-sync.mjs`. Do not claim live Torn PDA tests from GitHub CI.
