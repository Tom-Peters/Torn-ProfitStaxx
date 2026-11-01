# ProfitStaxx

**Torn trading intelligence for TornPDA** — developed by **IamEEKY**.

A mobile-first userscript that spots potentially profitable Item Market listings, compares no-fee Bazaar resale with Item Market resale, evaluates complete Museum sets, tracks your purchases and sales, and shows a profit-opportunity badge on a floating **PS** button.

## Install

Use this **permanent script URL** in TornPDA's Scripts section:

https://raw.githubusercontent.com/Tom-Peters/Torn-ProfitStaxx/main/ProfitStaxx.user.js

The filename and URL remain unchanged when the script is updated. If your TornPDA version does not auto-refresh scripts, refresh or re-import it from the same URL.

You can also use a compatible browser userscript manager. TornPDA is the primary target.

### First run

1. Open Torn in TornPDA. Confirm the **PS** button appears near the bottom-right.
2. Tap **PS > Settings** and set your trading capital, maximum exposure, preferred resale method, and watchlist.
3. TornPDA normally injects your existing API key automatically. If not, enter a restricted/custom Torn API key **in the app**, never in the GitHub source.
4. Open **Deals > Refresh opportunities** to perform the first scan.
5. Use the linked Torn market page to **manually** inspect and buy any candidate.
6. Record actual buys and sells in **Ledger** so the tool can measure *realised* profit.

## Features

| Feature | Included |
| --- | --- |
| Persistent floating PS button | Yes |
| Badge displaying profitable opportunities | Yes — only from recent API data |
| Torn API v2 Item Market watchlist scanner | Yes |
| Market depth / spread / fee-adjusted ROI | Yes |
| Choice of Bazaar vs Item Market exit | Yes — model, not guaranteed sale |
| Balanced risk caps / cash reserve | Yes |
| Museum plushie / flower arbitrage | Yes |
| Manually record pre-owned Museum items | Yes |
| 10-point set calculations and points quotes | Yes |
| Museum batch optimiser (1–25 sets, market depth-aware) | Yes |
| Local trade ledger and weighted average cost | Yes |
| Realised P&L and estimated open positions | Yes |
| CSV ledger export and JSON backup/restore | Yes |
| TornPDA native SQLite-backed script storage | Yes, fallback to localStorage |
| Automatic trading / scripted in-game purchase | **No** |
| Scraping hidden/unopened Torn pages | **No** |
| Data uploads to third-party services | **No** |

## How the estimates work

- Market reference = median asking price from listings 2–16 in the current market order book. **It is not a confirmed historical sale price.**
- Item Market resale = modeled reference asking price, minus Torn's normal 5% selling fee.
- Bazaar resale = modeled market reference minus a configurable discount (default 2%), with 0% Bazaar listing fee. Bazaar sales can take longer; the engine does not assume matching buyers exist.
- Suggested quantity is capped by listing quantity, available capital, per-item exposure and per-trade exposure.
- Deals are filtered by minimum expected net ROI, minimum expected total profit, number of market offers and quote age.
- Badge counts only opportunities from market quotes checked within the last eight minutes. A price may have changed before the player manually opens the market.
- Museum supports batches of 1–25 complete sets. It consumes market listing quantities from cheapest to more expensive price tiers and rejects insufficient available depth. Economic profit counts the *market value of owned components* as an opportunity cost. "Cash to complete" separately deducts locally recorded owned components.
- Ledger uses weighted-average purchase cost. It does not auto-detect purchases or sales; only entries you record are considered realised profit.
- Points revenue is based on the **lowest currently listed asking price** for points, not a guaranteed execution price.
- The scanner is deliberately rate limited to one item request every 2.5 seconds and uses a 3-minute default overall interval. Torn may cache Item Market prices for ~30 seconds.

**Never assume a scored deal is guaranteed profit.** Recheck quantity, current listing, market demand and the actual resale route before purchasing.

## Privacy / API key handling

- Data requested: Torn API v2 **torn/items**, **market/{itemId}/itemmarket**, **market/pointsmarket**.
- API requests go only to **api.torn.com**, using a key in the Authorization header.
- TornPDA's \`###PDA-APIKEY###\` placeholder is supported; no key is shipped in the code.
- When pasted manually in Settings, a key is stored **locally** in the native PDA per-script storage (or localStorage fallback). It is never uploaded to GitHub.
- The JSON backup **redacts the manually entered key**. The CSV contains only user-recorded transactions.
- For this market-only version, use a public-access/custom-scoped key if entering it manually. Do not paste a Full Access key unless you understand its access.
- Deleting the script or native storage can delete your trade history. Use **Backup JSON** regularly.

## Known boundaries

Torn's official API does not provide a comprehensive, reliably fresh listing feed for *all player Bazaars*. ProfitStaxx currently uses official **Item Market** offers for discovery and models Bazaar **as a sale route**, not as an exhaustive bargain source.

There is no verifiable historical sold-price feed in this script; score and confidence are heuristic. Limited item market depth may exclude items from suggestions. The script does not estimate time-to-sell with scientific confidence.

Museum set membership currently uses the known flower/plushie recipes, matched against the live Torn item catalog. If a component is missing from the catalog or API does not return quotes, its set is reported as incomplete.

## Technical

- Single self-contained userscript: \`ProfitStaxx.user.js\`.
- Native TornPDA storage uses \`PDA_storage.getMany\` and \`PDA_storage.setMany\`.
- All API reads use \`PDA_httpGet\` where available, then compatible userscript or fetch fallbacks.
- No server, database hosting, package manager, paid API, background bot or build step is required.
- JavaScript tests: \`node --test tests/*.test.js\` (Node 20+).
- Author attribution: **IamEEKY**.

## Compliance

ProfitStaxx does not purchase or sell items, manipulate the Torn UI, send any extra non-API Torn requests, inspect unfocused Torn pages, bypass CAPTCHA, or promise automated profit. All in-game actions require direct user interaction.

Official references: [Torn API](https://www.torn.com/api.html), [Torn scripting rules](https://www.torn.com/forums.php?p=threads&t=16534470), [TornPDA script API](https://github.com/Manuito83/torn-pda/tree/master/userscripts), [Torn Wiki Bazaar](https://wiki.torn.com/wiki/Bazaar), [Museum](https://wiki.torn.com/wiki/Museum).
