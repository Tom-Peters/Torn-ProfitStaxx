# ProfitStaxx

**Torn trading, stocks and income intelligence for TornPDA** — developed by **IamEEKY**.

A mobile-first userscript for Torn Item Market deals, stock benefit blocks, cash dividend opportunities, Museum conversions, a trading ledger and a multi-source realised-income tracker. All in-game purchases, sales and claims remain user-confirmed.

## ProfitStaxx 1.9.0 · new command centre

This version adds five major areas alongside the existing Deal, Museum and Ledger screens:

- **Best** — mixed item-flip, travel, Museum, fixed-cash-stock, bank and rental opportunities ranked by an explicit heuristic (payoff, indicative ROI, review time, source confidence). Active one-off gains are **not** presented as recurring income; the periods are displayed on every result.
- **Travel** — **opt-in** public foreign-stock observation scanner (Torn Tracker, data by torn-tracker.com contributors, CC BY 4.0). On demand it reads reported stock, then uses your Torn API key **only with Torn** for a capped 16-item resale-price scan. Older shelf observations or old Torn asks are withheld from confirmed-margin recommendations. Enter your own travel capacity and real round-trip minutes by country to compare per-hour returns. No API key is sent to Torn Tracker.
- **Stocks** — per-stock buy-below / sell-above price targets, visible StaxxHub notifications, auto-refresh at most every ten minutes **while Torn is open** if at least one target is configured; sampled trend history limited to 90 days. Never submits orders.
- **Charts** — interactive 7, 30 and 90-day realised profit charts reconstructed from weighted-average-cost ledger sales and manual income entries. Groups income by category and includes losses; unrealised prices are excluded.
- **Capital** — protected cash reserve, pre-existing recorded open item positions, four adjustable cash-weight buckets (Item Market, travel, stock benefits and bank), cash caps and unallocated cash. It is a model, not a bank/broker balance or an optimal portfolio guarantee.

**Scroll issue resolved:** Progressive scans no longer reset the scroll position in every ProfitStaxx tab; the current form, focused field and horizontal tab-bar position are restored between display updates. It is still necessary to verify the behaviour in TornPDA's actual WebView.

**Limitations:** Torn Tracker observations can disappear before travel. Foreign feeds and permissioned Torn API responses need a real on-device check. Other earnings (crime, contracts, revives, company, property) have manual income tracking and relevant links, not complete live optimisers. Current quotes and asking-price heuristics never establish a guaranteed sale.

## Install on TornPDA (remote URL)

**Important:** Select the **Remote URL / Configure** option in TornPDA's userscript manager and paste the **raw JavaScript URL below**. Do not use the GitHub repository page (`github.com/Tom-Peters/Torn-ProfitStaxx`) or the GitHub file viewer (`github.com/.../blob/...`). Those return HTML and TornPDA may report **"No header available"**.

Use this **permanent script URL** in TornPDA's Scripts section:

https://raw.githubusercontent.com/Tom-Peters/Torn-ProfitStaxx/main/ProfitStaxx.user.js

The filename and URL remain unchanged when the script is updated. This file begins with `// ==UserScript==` and includes `@name`, `@version`, and `@match` metadata for TornPDA.

If TornPDA still says "No header available", check that the pasted URL begins with `https://raw.githubusercontent.com/` and ends with `/ProfitStaxx.user.js`, with no extra spaces, and use the **Remote URL** field instead of the code field. In the TornPDA script configuration, use **Fetch**, then **Load** once the header/name displays. If your TornPDA version does not auto-refresh scripts, refresh or re-import it from the same URL.

You can also use a compatible browser userscript manager. TornPDA is the primary target.

### First run

1. Open Torn in TornPDA, then open **StaxxHub** and select **ProfitStaxx** (the legacy PS button is intentionally hidden when the unified launcher is active).
2. Tap **PS > Settings** and set your trading capital, maximum exposure, preferred resale method, and watchlist.
3. TornPDA normally injects your existing API key automatically. If not, enter a restricted/custom Torn API key **in the app**, never in the GitHub source.
4. Open **Deals > Refresh opportunities** to perform the first scan. Then use **Best** for ranked cross-source options, **Capital** for an allocation scenario and **Charts** for realised profit history.
5. Use the linked Torn market page to **manually** inspect and buy any candidate.
6. Record actual buys and sells in **Ledger** so the tool can measure *realised* profit.
7. Open **Stocks > Refresh stocks** to load real stock quotes. Personal holdings and claim-ready dividends require a Limited-access API key that authorises `user/stocks`.
8. Open **Travel > Scan abroad** for an optional, one-time third-party public observation scan. Enter your own travel capacity and per-country round-trip minutes. Open **Stocks** to set share-price buy/sell alerts.
9. Open **Income** to record completed returns from bank interest, stock dividends, company payouts, rental income, travel importing, crimes, services, bounties and other sources. Record each realised earning only once.

## Features

| Feature | Included |
| --- | --- |
| Persistent floating PS button | Yes |
| Badge displaying profitable opportunities and due stock claims | Yes — only from recent API data |
| Torn API v2 Item Market watchlist scanner | Yes |
| Market depth / spread / fee-adjusted ROI | Yes |
| Choice of Bazaar vs Item Market exit | Yes — model, not guaranteed sale |
| Balanced risk caps / cash reserve | Yes |
| Torn Stock Market live quotations | Yes — `torn/stocks` |
| Benefit-block price and fixed-cash-dividend yield estimates | Yes — no modelled future share appreciation |
| Own shares and claim-ready dividend status | Yes — authorised `user/stocks` API selection |
| Multi-source income directory and Torn handoffs | Yes — 12 channels, player-led navigation |
| Native-storage realised income ledger | Yes — received less costs, 7-/30-day totals |
| Income comparison and source ranking | Yes — bank/rent inputs, live cash-dividend candidates, 30-day income/hour |
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

- Data requested: Torn API v2 **torn/items**, **market/{itemId}/itemmarket**, **market/pointsmarket**, **torn/stocks** and, if authorised, **user/stocks**.
- API requests go only to **api.torn.com**, using a key in the Authorization header.
- TornPDA's \`###PDA-APIKEY###\` placeholder is supported; no key is shipped in the code.
- When pasted manually in Settings, a key is stored **locally** in the native PDA per-script storage (or localStorage fallback). It is never uploaded to GitHub.
- The JSON backup **redacts the manually entered key**. The CSV contains only user-recorded transactions.
- A public-access key supports market and public stock quotes; reading your personal holdings and ready-to-claim dividends requires a suitably restricted **Limited** key. Do not paste a Full Access key unless you understand its access.
- Deleting the script or native storage can delete your trade history. Use **Backup JSON** regularly.

## Comparing passive-income opportunities

**Income > Passive-income comparison** accepts the actual annual-equivalent bank interest rate, bank principal, property value, and net weekly rent you enter. It shows annualised bank interest, annualised net rent / property yield, and the highest available fixed-cash-dividend stock block that fits your configured trading reserve. Bank and rent terms are **user-entered**, while eligible stock prices come from recent Torn API quotes. This is a cash-yield comparison, not a full risk-adjusted investment ranking.

Income history also groups manually recorded earnings from the last 30 days by source, with net per active hour where time was recorded. This is actual recorded activity rather than a prediction of future profits.

## Stock Market and income boundaries

- Torn API quotations reflect the stock market at retrieval time. This tool displays fixed cash payout yield estimates only where payout amounts and intervals are known. Noncash benefits are left **unpriced** rather than assuming a guaranteed cash-equivalent yield.
- Own-stock benefits can require waiting, owning enough shares and manually claiming a payout. No stock purchases, disposals or claims are executed by the script.
- Stock price changes, buying fees, resale delays and future dividends cannot be forecast precisely. Yield rankings are cash-dividend scenarios, not promises.
- The **Income** tab is a manually maintained ledger of completed receipts and costs. It does **not** automatically count item-sale profits already recorded in the trade ledger, so the two ledgers should not be added together blindly.
- Other income pages open on Torn but do not automatically price every activity (for example, travel profits vary by destination, inventory availability and time). This is a revenue directory plus a realised-income tracker, not a live optimiser for all possible revenue streams.

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

ProfitStaxx does not purchase or sell items or stocks, claim dividends, send automated in-game transaction requests, inspect unfocused Torn pages, bypass CAPTCHA, or promise automated profit. Item Market quantity preparation is limited to a user-triggered, guarded handoff that requires manual final confirmation. All in-game actions require direct user interaction.

Official references: [Torn API](https://www.torn.com/api.html), [Torn scripting rules](https://www.torn.com/forums.php?p=threads&t=16534470), [TornPDA script API](https://github.com/Manuito83/torn-pda/tree/master/userscripts), [Torn Wiki Bazaar](https://wiki.torn.com/wiki/Bazaar), [Museum](https://wiki.torn.com/wiki/Museum).
