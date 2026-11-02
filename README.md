## v1.22.6 — stock income evidence, next benefit blocks and StaxxHub 3.4

- **Actual dividend cash:** optional, read-only, rate-bounded reconciliation of matching cash stock events from Torn API `user/log?cat=134` using the player's existing key. Full or scoped log permission is needed; when absent, receipts remain unverified rather than assumed zero. Imported log IDs deduplicate, and cash entries are stored only on-device.
- **Next stock block:** ranks extra shares and modelled cash to qualify for the next benefit using recently verified holdings, share price, the saved protected capital reserve, and actual cash on hand when available. Utility benefits remain unpriced, stock risk and delayed qualification are disclosed, and no shares are bought by the script.
- **Income truth:** verified stock cash, manual income, locally recorded trade P/L and estimated future income remain separate. Don't double-count manually entered stock payouts that were also matched from Torn logs.
- **StaxxHub 3.4:** shared daily pending/checked/API-verified completion checklist and player-chosen review-session lengths (Any, 5, 10, 15, 30, 60 min). Urgency and actual deadlines take precedence; no gameplay is automated.
- Permanent install URL is unchanged. ProfitStaxx 1.22.6 shares the byte-identical StaxxHub 3.4 with Company Helper 1.25.5 and Happy Jump Preview 0.31.5. All source-only tests do not replace device-level TornPDA QA.

## v1.17.0 — faster evidence-based foreground market autopilot

- **Fresh quick-scan quotes stay eligible** for the ranked action queue even when the previous comprehensive scan is older than eight minutes. Each suggested deal still requires an independently observed quote less than eight minutes old.
- **Open positions get priority:** when a recorded holding's asking-price observation is stale, the foreground scheduler prioritises a bounded quick scan before another lengthy full scan, subject to persistent throttling.
- **Autopilot health panel:** watched-quote freshness, stale holdings and last full/quick attempts are visible without manual investigation.
- **Portfolio estimates:** stale observed asking prices no longer masquerade as fresh estimated sell valuations. Trades are never placed automatically.
- The userscript metadata and runtime display now both report v1.17.0. Existing install URL and shared StaxxHub remain unchanged.

## v1.16.0 — stronger foreground automation

- Recorded **open trading positions automatically join the watched-item pool**, even when removed from a manual watchlist. The fast scan prioritises old quotes for recorded holdings before other watched items.
- Foreground quick scans now run on an approximately eight-minute cadence when eligible, while full market, stocks, foreign prices, inventory and cash remain bounded and refresh independently.
- The automatic task attempt clock survives page reloads in local-only timestamp storage, reducing repeated API work when navigating Torn. Neither API credentials nor trading amounts are stored in that scheduler key.
- Scans, alerts and risk calculations are advisory. Live listings, trades and income receipts still require the player to verify and confirm them.

## v1.15.0 — Market Pulse and trade risk sandbox

- **Market Pulse:** Highlights 3%+ movements in saved lowest asking-price observations from watched items, using a recently scanned point and a separate earlier sample. Each row opens the live market for manual checking. Changes are not completed sale prices or trading signals.
- **Trade Stress Test:** Shows estimated profit/loss for the top fresh qualifying deal when resale asking prices drop 0%, 5% or 10%, with a conservative 5% market selling fee and an explicit break-even estimate. Includes an optional, player-confirmed buy-quantity preparation shortcut.
- Both features are read-only and keep existing cash/exposure protections. Historical quotes remain samples, not orders or fills.

## v1.14.0 — automatic live quantities for watched items

- Inventory auto-sync now captures the core watched trading items as well as museum plushies and flowers. Market opportunities display verified current ownership when a complete Torn inventory snapshot is fresh.
- Counts are informational and do not imply a sale, purchase price, or realised profit. Ledger entries and purchases remain under user control.

# ProfitStaxx

## v1.13.0 — StaxxHub smart sync and wallet-aware risk

- **Hub-driven refresh:** Opening StaxxHub requests a read-only update from each connected tool, subject to its existing cooldown and API permissions. The daily dashboard also offers a manual check button.
- **Cash-on-hand verification:** ProfitStaxx attempts `user/money` approximately every 10 minutes while Torn is visible. Only a valid numeric `money_onhand` field is accepted; missing or denied responses never become zero. Recent confirmed on-hand cash caps proposed liquid trades, while saved capital/reserve rules still apply. Cash kept in a bank or vault is not assumed to be spendable.
- **Fast scans actually refresh:** The incremental ten-item quote scan no longer inherits the full-scan cooldown. Full scans remain bounded and back off independently.
- **Gameplay writes remain manual:** Market transactions, realised profit entries and income receipts require confirmed execution; estimated spreads are never auto-booked as profit.

## v1.12.0 — automatic read-only data and inventory

- **Visible-only automatic intelligence:** A bounded single-task scheduler checks full Item Market prices roughly hourly, stale watched items in short batches, foreign stock observations around every 20 minutes, and stock prices around every 10 minutes. It only operates with an API key while Torn is foregrounded, and backs off failed full scans instead of repeating them on every timer tick.
- **Automatic museum counts:** Reads the current, complete paginated `user/inventory` response (up to 2,000 rows) to count your own flowers and plushies. Excludes faction-owned inventory and labels other locations as excluded. Failed/partial scans never turn missing data into zero holdings; saved local counts remain the fallback. An explicit **Sync owned flowers & plushies** button remains for immediate checks.
- **No automatic in-game purchases:** Market buy handoff still requires reviewing listings and tapping Buy in Torn. Travel sightings, asking prices and future income remain estimates.

## v1.11.0 — five money-making decisions, diagnostics and StaxxHub v2.5

- **Today:** An actionable, prioritised shortlist of up to five supported profit opportunities that fit a user-entered time budget and protected trading cash. Each item links to a manual review action, retains an explicitly labelled return period, and can be marked **reviewed** without generating fictitious realised profits. UTC-day review marks are stored locally and included in backups.
- **Diagnostics:** New internal tab shows API presence, quote recency, native vs fallback storage, UI mounting and scanner status. Copying its report deliberately excludes keys, amounts, imported trades and player data.
- **StaxxHub v2.5:** All current and newly registered Staxx tools join one daily dashboard, cross-tool priority queue and safe diagnostics surface. Older observations cannot silently become current urgent actions. The latest integration and privacy rules live at `suite/STAXX-INTEGRATION.md`.


## v1.10.0 — quicker scans and trading-risk gates

- **Fast scan:** Press **Fast scan · 10** in Deals to price up to ten stale/unpriced watched items first. Full scan remains available. Requests are spaced to avoid API pressure.
- **Stop scan:** Stops after the in-flight API response; completed partial prices remain visible. A cancelled, partial or quick scan **does not** overwrite the timestamp of the last verified complete scan.
- **Risk detail per deal:** Warning flags now call out sparse price samples, falling asking-price trend, wide asking-price spread, crowded resale listings, limited near-price depth and thin estimated margins. These use observations, not actual bids or guaranteed completed sales.
- **Scroll continuity:** Each tab retains its position, and active form values are preserved while prices update.


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
