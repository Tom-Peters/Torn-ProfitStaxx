'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','ProfitStaxx.user.js'),'utf8');

function harness(){
  const replacement='  window.__PS_TEST__ = {state,parseOffers,normalizeItems,listingReference,methodQuote,scoreDeal,positions,portfolio,recipeResults,esc,priceHistoryQuality,marketLiquiditySignal,allocationPlan,dealRisk,stockState,stockRows,dueDividends,reportedReadyDividends,profitNextActions,renderStockPanel,parseStockCashReceipt,stockCashReceipts,stockBlockOpportunities,renderStockCashReceipts,renderRevenuePanel,incomeComparisonPanel,moneyRecords,travelState,parseTravelFeed,travelRows,stockSignals,incomeCandidates,multiCapitalPlan,realisedEvents,profitHistory,dailyPlanV111,safeProfitDiagnosticsV111,liveMuseumOwnedV112,museumOwnedCountV112,parseMoneyV113,liveWalletCashV113};\n';
  const modified=source.replace("  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init",replacement+"  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init");
  assert.notEqual(modified,source,'Expected test injection point was missing');
  const window={};window.top=window;window.self=window;
  const sandbox={window,document:{readyState:'loading',addEventListener:()=>{}},console,Math,Date,setTimeout,clearTimeout};
  vm.runInNewContext(modified,sandbox,{filename:'ProfitStaxx.user.js'});
  assert.equal(window.__profitStaxxBooted,true);
  return window.__PS_TEST__;
}

test('userscript metadata and static boot',()=>{
  assert.match(source,/\/\/ ==UserScript==/);
  assert.match(source,/@author\s+IamEEKY/);
  assert.match(source,/PDA-APIKEY/);
  assert.match(source,/@updateURL\s+https:\/\/raw.githubusercontent.com/);
  harness();
});
test('normalises Torn v2 items and listing shapes',()=>{
  const {normalizeItems,parseOffers}=harness();
  const items=normalizeItems({items:[{id:12,name:'Xanax',market_value:800000}]});
  assert.equal(items.xanax.id,12);
  assert.equal(items.xanax.value,800000);
  const offers=parseOffers({itemmarket:{listings:[{price:100,amount:2},{price:90,amount:3}]}},'itemmarket');
  assert.deepEqual(Array.from(offers,x=>x.price),[90,100]);
  assert.deepEqual(Array.from(offers,x=>x.qty),[3,2]);
});
test('reference price ignores first listing and needs sufficient depth',()=>{
  const {listingReference}=harness();
  assert.equal(listingReference([{price:1},{price:100},{price:101},{price:102},{price:103}]),101.5);
  assert.equal(listingReference([{price:50},{price:100},{price:110}]),0);
});
test('models Item Market 5% tax and Bazaar fee-free route',()=>{
  const {methodQuote,state}=harness();
  const quote=methodQuote({price:1000000},1200000);
  assert.equal(quote.marketNet,140000);
  assert.equal(quote.bazaarNet,176000);
  assert.equal(quote.method,'bazaar');
  state.settings.method='market';
  assert.equal(methodQuote({price:1000000},1200000).unitProfit,140000);
});
test('trading ledger calculates realised profit on weighted average cost',()=>{
  const {state,positions,portfolio}=harness();
  state.trades=[
    {side:'buy',itemId:12,name:'Xanax',qty:10,price:100,fee:0,at:1},
    {side:'buy',itemId:12,name:'Xanax',qty:10,price:200,fee:0,at:2},
    {side:'sell',itemId:12,name:'Xanax',qty:4,price:250,fee:5,at:3}
  ];
  const p=positions()[0];
  assert.equal(p.qty,16);
  assert.equal(p.cost,2400);
  assert.equal(p.realised,350);
  assert.equal(portfolio().realised,350);
});
test('capital and risk filters reject unprofitable offers',()=>{
  const {scoreDeal,state}=harness();
  const base={id:12,name:'Xanax',at:Date.now(),reference:1300000,
    offers:[{price:1000000,qty:20},...Array.from({length:9},()=>({price:1300000,qty:20}))]};
  const deal=scoreDeal(base);
  assert.ok(deal,'Expected profitable deal with sufficient depth');
  assert.ok(deal.qty<=9,'Should stay under 3% of $300m with $1m entry price');
  assert.ok(deal.profit>0);
  state.settings.minRoi=80;
  assert.equal(scoreDeal(base),null);
  state.settings.minRoi=0;
  assert.equal(scoreDeal({...base,reference:1000000}),null);
});
test('museum accounts for pre-owned items but economic profit includes opportunity cost',()=>{
  const {state,recipeResults}=harness();
  const plush=['Jaguar Plushie','Lion Plushie','Panda Plushie','Monkey Plushie','Chamois Plushie',
    'Wolverine Plushie','Nessie Plushie','Red Fox Plushie','Camel Plushie','Kitten Plushie',
    'Teddy Bear Plushie','Sheep Plushie','Stingray Plushie'];
  for(let i=0;i<plush.length;i++){
    const id=i+1;
    state.catalog[plush[i].toLowerCase()]={id,name:plush[i]};
    state.quotes[id]={id,name:plush[i],at:Date.now(),offers:[{price:60000,qty:10}]};
  }
  state.pointsPrice=100000;
  state.settings.museumOwned={'Jaguar Plushie':1};
  const r=recipeResults()[0];
  assert.equal(r.ready,true);
  assert.equal(r.cost,780000);
  assert.equal(r.missingCost,720000);
  assert.equal(r.profit,220000);
});
test('Museum batch planner consumes price levels and owned stock',()=>{
  const {state,recipeResults}=harness();
  const plush=['Jaguar Plushie','Lion Plushie','Panda Plushie','Monkey Plushie','Chamois Plushie',
    'Wolverine Plushie','Nessie Plushie','Red Fox Plushie','Camel Plushie','Kitten Plushie',
    'Teddy Bear Plushie','Sheep Plushie','Stingray Plushie'];
  plush.forEach((name,index)=>{
    const id=index+1;
    state.catalog[name.toLowerCase()]={id,name};
    state.quotes[id]={id,name,at:Date.now(),
      offers:[{price:60000,qty:15},{price:65000,qty:15}]};
  });
  state.pointsPrice=100000;
  state.settings.museumOwned={'Jaguar Plushie':1};
  state.settings.museumBatch=25;
  const r=recipeResults()[0];
  assert.equal(r.ready,true);
  assert.equal(r.batch,25);
  assert.equal(r.cost,13*(15*60000+10*65000)-5000);
  assert.equal(r.missingCost,r.cost-60000);
  state.settings.museumBatch=31;
  assert.equal(recipeResults()[0].batch,25,'Batch maximum must be enforced');
});
test('HTML escaping protects item labels',()=>{
  const {esc}=harness();
  assert.equal(esc('<svg onload="boom">&'), '&lt;svg onload=&quot;boom&quot;&gt;&amp;');
});

test('seven-day ask history shows evidence strength without treating asks as sales',()=>{
  const {state,priceHistoryQuality,marketLiquiditySignal}=harness();
  const now=Date.now();
  state.snapshots[12]=[{at:now-900000,reference:110},{at:now-500000,reference:120},{at:now-100000,reference:105}];
  const h=priceHistoryQuality(12);
  assert.ok(h.n>=1&&h.n<=3);
  assert.match(h.label,/snapshot|sample|Developing|Moderate/i);
  const liquidity=marketLiquiditySignal({id:12,qty:2,reference:120});
  assert.equal(liquidity.competing,0);
  assert.equal(liquidity.label,'Limited near-price asks');
});
test('capital allocator respects deployable funds and per-item constraints',()=>{
  const {state,allocationPlan}=harness();
  const now=Date.now();
  state.settings.capital=1000000;
  state.settings.reservePct=50;
  state.settings.maxTradePct=10;
  state.settings.maxItemPct=20;
  state.settings.minProfit=1;
  state.settings.minRoi=1;
  state.quotes[12]={id:12,name:'Test medical item',reference:130,at:now,
    offers:[{price:100,qty:999},...Array.from({length:8},()=>({price:130,qty:999}))]};
  state.snapshots[12]=[{at:now-3600000,reference:125},{at:now,reference:130}];
  const p=allocationPlan();
  assert.ok(p.available<=500000);
  assert.ok(p.allocations.length<=1);
  assert.ok(p.allocations.every(x=>x.allocQty>=1&&x.allocCost<=100000+1e-6));
  assert.ok(p.allocations.reduce((n,x)=>n+x.allocCost,0)<=p.available+1e-6);
});

test('stock cash yields need a real market price and fixed-cash payout metadata',()=>{
  const {state,stockState,stockRows,dueDividends,reportedReadyDividends,profitNextActions,renderStockPanel}=harness();
  stockState.all=[
    {id:1,acronym:'CNC',name:'Cash Dividends',market:{price:1000000},bonus:{requirement:1000,description:'Cash benefit',passive:false}},
    {id:2,acronym:'OTHER',name:'Unknown reward',market:{price:2000000},bonus:{requirement:100,description:'Utility'}},
    {id:3,acronym:'GRN',name:'Missing quote',market:{price:0},bonus:{requirement:100}}
  ];
  stockState.owned=[{id:1,shares:1100,bonus:{available:true,increment:0}}];
  stockState.ownedAt=Date.now();
  const rows=stockRows();
  assert.equal(rows.length,2);
  assert.equal(rows[0].acronym,'CNC');
  assert.ok(rows[0].annualYield>0);
  assert.equal(rows[1].annualYield,null,'unknown reward cannot be assigned a fabricated yield');
  assert.equal(reportedReadyDividends().length,1,'fresh active stock benefit can be reported without making it a task');
  assert.equal(state.settings.stockClaimReminders,false,'withdrawal reminders start off for existing and new users');
  assert.equal(dueDividends().length,0,'no unrequested claim reminder when Torn handles the payout');
  assert.equal(profitNextActions().some(x=>x.id==='stock-claim'),false,'Hub action queue must not nag about automatic stock payouts');
  assert.match(renderStockPanel(),/Off · enable/,'player can opt into manual claim reminders');
  state.settings.stockClaimReminders=true;
  assert.equal(dueDividends().length,1,'explicit preference enables active benefit review');
  assert.equal(profitNextActions().find(x=>x.id==='stock-claim')?.status,'review','API status must not masquerade as urgent manual gameplay');
  stockState.owned[0].bonus.available=false;
  assert.equal(dueDividends().length,0,'a benefit already credited must clear on the next holdings refresh');
  stockState.owned[0].bonus.available=true;
  stockState.all[0].bonus.passive=true;
  assert.equal(dueDividends().length,0,'passive benefits never require a claim, even if API reports available');
  stockState.all[0].bonus.passive=false;
  stockState.ownedAt=Date.now()-1800001;
  assert.equal(dueDividends().length,0,'expired readings cannot keep a dividend alert active');
});

test('income comparison keeps user-entered bank and rental cashflows separate from realised earnings',()=>{
  const {state,incomeComparisonPanel,moneyRecords}=harness();
  state.settings.bankPrincipal=100000000;
  state.settings.bankApr=8;
  state.settings.rentalAssetValue=500000000;
  state.settings.rentalNetWeekly=250000;
  state.income=[{source:'travel',net:2000000,minutes:120,at:Date.now()}];
  const html=incomeComparisonPanel();
  assert.match(html,/8,000,000/,'bank scenario uses entered rate, not a fake live quote');
  assert.match(html,/13,000,000/,'rental scenario annualises reported weekly net');
  assert.match(html,/1,000,000/,'active return per hour is derived from the ledger');
  assert.equal(moneyRecords()[0].net,2000000);
});

test('scroll restoration is per-tab and numeric field selection does not crash renders',()=>{
  assert.match(source,/scrollPositions=Object\.create\(null\)/);
  assert.match(source,/scrollPositions\[lastRenderedTab\]=previousBody\.scrollTop/);
  assert.match(source,/body\.scrollTop=scrollPositions\[active\]\|\|0/);
  assert.match(source,/try\{start=focused\.selectionStart;end=focused\.selectionEnd;\}catch/);
  assert.match(source,/focus\(\{preventScroll:true\}\)/);
});
test('foreign shop feed requires observed quantities and current Torn resale quote',()=>{
  const {parseTravelFeed,travelState,travelRows,state}=harness(),t=Date.now();
  const rows=parseTravelFeed({countries:[{country:'mex',name:'Mexico',items:[
    {item_id:206,name:'Xanax',cost:100,quantity:40,observed_at:new Date(t-60000).toISOString(),reporters:3},
    {item_id:-1,name:'bad',cost:0,quantity:9}
  ]}]});
  assert.equal(rows.length,1);
  travelState.rows=rows;state.settings.travelCapacity=20;state.settings.maxTradePct=100;
  state.quotes[206]={id:206,at:t,reference:180,offers:[]};
  const deal=travelRows()[0];
  assert.equal(deal.quantityBuy,20);
  assert.equal(deal.spent,2000);
  assert.equal(deal.net,1420);
  assert.equal(deal.valid,true);
  state.quotes[206].at=t-9*60000;
  assert.equal(travelRows()[0].valid,false,'Old market asking prices must not count as executable deals');
});
test('stock watch alerts use fresh quotes and explicit per-stock buy/sell levels',()=>{
  const {state,stockState,stockSignals}=harness();
  stockState.all=[{id:2,name:'Example',acronym:'TCT',market:{price:20},bonus:{requirement:1000}}];
  stockState.at=Date.now();
  state.settings.stockTargets={'2':{buy:25,sell:30}};
  assert.equal(stockSignals()[0].id,'stock-buy-2');
  stockState.all[0].market.price=40;
  assert.equal(stockSignals()[0].id,'stock-sell-2');
  stockState.at=Date.now()-31*60000;
  assert.equal(stockSignals().length,0);
});
test('cross-source ranking excludes stale prices and will not fabricate active profit',()=>{
  const {state,travelState,incomeCandidates,stockState}=harness();
  state.quotes={};travelState.rows=[];stockState.at=0;
  state.settings.bankPrincipal=100000000;state.settings.bankApr=6;
  const r=incomeCandidates();
  assert.ok(r.some(x=>x.id==='bank'&&x.category==='passive'));
  assert.ok(!r.some(x=>x.category==='active'));
  assert.ok(r.every(x=>x.score>=0&&x.score<=100));
});
test('four-way capital allocation cannot overspend deployable money or count held stock block as a new purchase',()=>{
  const {state,stockState,multiCapitalPlan}=harness();
  state.settings.capital=100000000;
  state.settings.reservePct=50;
  state.settings.allocMarket=25;state.settings.allocTravel=25;state.settings.allocStock=25;state.settings.allocBank=25;
  state.settings.bankApr=8;
  stockState.all=[{id:2,acronym:'TCT',name:'Example',market:{price:10000},bonus:{requirement:100}}];
  stockState.owned=[{id:2,shares:100,bonus:{increment:0}}];
  stockState.at=Date.now();
  const p=multiCapitalPlan();
  assert.equal(p.liquid,50000000);
  assert.ok(p.items.every(x=>x.source!=='stocks'),'No extra stock purchase when held shares already satisfy target block');
  assert.ok(p.spent.every((x,i)=>x<=p.limits[i]+1e-6));
  assert.ok(p.spent.reduce((n,x)=>n+x,0)+p.unallocated<=p.liquid+1e-6);
});
test('realised history reflects weighted-average cost and fees, never hypothetical open-position gains',()=>{
  const {state,realisedEvents,profitHistory}=harness();
  const t=Date.now();
  state.trades=[
    {itemId:12,name:'Sample',side:'buy',qty:10,price:100,at:t-3500},
    {itemId:12,name:'Sample',side:'sell',qty:4,price:200,fee:5,at:t-1500}
  ];
  state.income=[{source:'travel',net:20,at:t-1000}];
  const events=realisedEvents();
  assert.equal(events.length,2);
  assert.equal(events.find(x=>x.source==='Item trades (ledger)').net,360);
  const p=profitHistory(7);
  assert.equal(p.total,380);
  assert.equal(p.sources.size,2);
});

test('StaxxHub stock and market alert focus uses exact DOM id, not a numeric-only parser',()=>{
 assert.match(source,/const focus='ps-alert-'\+String\(state\.alertFocus\)/);
 assert.match(source,/\.find\(x=>x\.id===focus\)/);
 assert.doesNotMatch(source,/Number\(state\.alertFocus\.replace/);
});

test('fast opportunity scans are bounded and can be stopped without claiming a full scan',()=>{
 assert.match(source,/async function scan\(\{manual=false,quick=false\}=\{\}\)/);
 assert.match(source,/slice\(0,10\):all/);
 assert.match(source,/if\(state\.cancelScan\)/);
 assert.match(source,/if\(complete&&!quick\)state\.lastScan=now\(\)/);
 assert.match(source,/case 'stopscan':if\(state\.busy\)/);
});
test('deal risk flags derive from observed history and ask competition, not fictional sales',()=>{
 const {state,dealRisk}=harness(),t=Date.now(),id=206;
 state.snapshots[id]=[{at:t-3*3600000,reference:200},{at:t-2*3600000,reference:140},{at:t-3600000,reference:100}];
 state.quotes[id]={id,at:t,reference:100,offers:Array.from({length:8},()=>({price:100,qty:100}))};
 const r=dealRisk({id,qty:10,reference:100,roi:4});
 assert.ok(r.flags.some(x=>x.includes('falling')));
 assert.ok(r.flags.some(x=>x.includes('Crowded')));
 assert.ok(r.flags.some(x=>x.includes('Thin')));
 assert.equal(r.level,'High');
});

test('daily top-five queue stays within time and protected cash and never counts review as realised income',()=>{
  const {state,dailyPlanV111}=harness();
  state.settings.capital=100000000;
  state.settings.reservePct=50;
  state.settings.dailyReviewMinutes=5;
  state.settings.bankPrincipal=10000000;
  state.settings.bankApr=6;
  state.settings.rentalAssetValue=20000000;
  state.settings.rentalNetWeekly=100000;
  const p=dailyPlanV111();
  assert.ok(p.items.length<=5);
  assert.ok(p.committed<=p.spendable+1e-6);
  assert.ok(p.activeMinutes<=5);
  assert.ok(p.items.some(x=>x.category==='passive'));
  if(p.items.length){state.dailyReviews[p.day]={[p.items[0].id]:true};}
  const after=dailyPlanV111();
  assert.equal(after.items[0].reviewed,true);
  assert.equal(state.income.length,0,'review tracking must not fabricate completed income');
});
test('ProfitStaxx diagnostics are non-sensitive and report statuses, not stored keys',()=>{
  const {state,safeProfitDiagnosticsV111}=harness();
  state.settings.key='TEST-SECRET-VALUE';
  const report=safeProfitDiagnosticsV111();
  assert.ok(report.tool==='ProfitStaxx');
  assert.ok('lastFullScanMinutes' in report);
  assert.ok(!JSON.stringify(report).includes('TEST-SECRET-VALUE'));
  assert.ok(!('settings' in report));
});

test('balanced daily recommendations require travel time and reject high-risk item deals',()=>{
 assert.match(source,/if\(x\.kind==='travel'&&!minutes\)continue/);
 assert.match(source,/dealRisk\(observed\)\.level==='High'/);
 assert.match(source,/if\(minutes&&activeMinutes\+minutes>budget\)continue/);
});

test('automatic inventory counts override manual estimates only while a verified snapshot is fresh',()=>{
 const {state,liveMuseumOwnedV112,museumOwnedCountV112}=harness();
 state.settings.museumOwned={'Jaguar Plushie':4};
 assert.equal(museumOwnedCountV112('Jaguar Plushie'),4);
 state.inventoryOwned={'Jaguar Plushie':2};
 state.inventoryAt=Date.now();
 assert.equal(liveMuseumOwnedV112(),true);
 assert.equal(museumOwnedCountV112('Jaguar Plushie'),2);
 assert.equal(museumOwnedCountV112('Lion Plushie'),0);
 state.inventoryAt=Date.now()-61*60000;
 assert.equal(liveMuseumOwnedV112(),false);
 assert.equal(museumOwnedCountV112('Jaguar Plushie'),4);
});
test('automatic read-only data scheduler enforces independent cooldowns and visible-only work',()=>{
 assert.match(source,/async function autoTickV112\(/);
 assert.match(source,/autoTickRunningV112\|\|document\.hidden/);
 assert.match(source,/time-autoChecksV112\.full>=45\*60000/);
 assert.match(source,/time-autoChecksV112\.travel>=20\*60000/);
 assert.match(source,/time-autoChecksV112\.stocks>=10\*60000/);
 assert.match(source,/time-autoChecksV112\.inventory>=30\*60000/);
 assert.match(source,/for\(let offset=0;offset<2000;offset\+=250\)/);
 assert.match(source,/if\(!complete\)throw Error/);
 assert.match(source,/if\(entry\.faction_owned\)continue/);
});

test('live cash sync accepts only verified wallet figures and never turns missing data into zero',()=>{
  const {parseMoneyV113,liveWalletCashV113,state}=harness();
  assert.equal(parseMoneyV113({money:{money_onhand:123456}}),123456);
  assert.equal(parseMoneyV113({money_onhand:0}),0);
  assert.equal(parseMoneyV113({money:{points:10}}),null);
  assert.equal(parseMoneyV113({money_onhand:"invalid"}),null);
  assert.equal(liveWalletCashV113(),null);
  state.walletCash=500000;state.walletAt=Date.now();
  assert.equal(liveWalletCashV113(),500000);
  state.walletAt=Date.now()-20*60000;
  assert.equal(liveWalletCashV113(),null);
});
test('quick background price scan is not blocked by full-scan cooldown',()=>{
  assert.match(source,/!manual&&!quick&&now\(\)-state\.lastScan/);
  assert.match(source,/staxx:refresh-request/);
  assert.match(source,/user\/money/);
});


test('watched Torn market items share the verified inventory sync without inferred trades',()=>{
 assert.match(source,/const names=new Map\(\[\.\.\.RECIPES\.flatMap\(r=>r\.items\),\.\.\.CORE_ITEMS\]/);
 assert.match(source,/function verifiedOwnedV114\(name\)/);
 assert.match(source,/Verified Torn inventory:/);
 assert.doesNotMatch(source,/autoExecuteTrade\(/);
});


test('3.4 verified dividend parser requires exact Torn stock cash log fields',()=>{
 const {parseStockCashReceipt}=harness(),timestamp=Math.floor(Date.now()/1000);
 const good={id:'dividend-log-42',timestamp,details:{title:'Stock dividend cash received'},
   data:{cash_received:4000000,stock_acronym:'GRN'}};
 const receipt=parseStockCashReceipt(good);
 assert.equal(receipt.id,'dividend-log-42');
 assert.equal(receipt.amount,4000000);
 assert.equal(receipt.stock,'GRN');
 assert.equal(parseStockCashReceipt({...good,data:{amount:4000000}}),null,
  'unqualified amount may mean item count or shares, not confirmed cash');
 assert.equal(parseStockCashReceipt({...good,details:{title:'Stock shares purchased'}}),null,
  'share purchases must not count as income');
 assert.equal(parseStockCashReceipt({...good,data:{cash_received:'4000000'}}),null,
  'text cash values are not proof of structured API money receipt');
 assert.equal(parseStockCashReceipt({...good,id:'bad id'}),null);
 assert.equal(parseStockCashReceipt({...good,timestamp:timestamp-91*86400}),null);
 assert.match(source,/user\/log\?cat=134&limit=100/);
 assert.doesNotMatch(source,/PDA_http(?:Post|Put|Patch|Delete)\s*\(/);
});
test('3.4 stock benefit ranking accounts for current shares and protected trading cash',()=>{
 const {state,stockState,stockBlockOpportunities}=harness();
 const now=Date.now();state.settings.capital=100000;state.settings.reservePct=20;
 stockState.at=now;stockState.ownedAt=now;
 stockState.all=[{id:1,acronym:'GRN',name:'Cash dividend',market:{price:1000},
  bonus:{requirement:100,passive:false}}];
 stockState.owned=[{id:1,shares:30,bonus:{increment:0}}];
 let opportunities=stockBlockOpportunities();
 assert.equal(opportunities.length,1);
 assert.equal(opportunities[0].need,70);
 assert.equal(opportunities[0].cost,70000);
 assert.equal(opportunities[0].affordable,true);
 assert.ok(opportunities[0].marginalYield>0);
 state.settings.reservePct=40;
 assert.equal(stockBlockOpportunities()[0].affordable,false,
  'protected reserve must remain protected');
 stockState.ownedAt=now-31*60000;
 assert.equal(stockBlockOpportunities().length,0,'no ranking without fresh holdings');
});
test('3.4 independently verified stock cash stays separate from manually recorded earnings',()=>{
 const {state,stockCashReceipts,renderStockCashReceipts,renderRevenuePanel}=harness();
 const now=Date.now();state.stockReceipts=[{id:'receipt-1',at:now,amount:4000000,stock:'GRN'}];
 state.income=[{id:'manual-1',at:now,source:'stocks',net:4000000}];
 assert.equal(stockCashReceipts(30).length,1);
 const card=renderStockCashReceipts();
 assert.match(card,/4,000,000/);
 assert.match(card,/Matched Torn log/);
 state.stockReceipts=[];
 assert.match(renderStockCashReceipts(),/No verified receipts/,'no matching log cannot be treated as zero confirmed stock income');
 state.stockReceipts=[{id:'receipt-1',at:now,amount:4000000,stock:'GRN'}];
 const revenue=renderRevenuePanel();
 assert.match(revenue,/Verified stock cash receipts/);
 assert.match(revenue,/manual income entries/i);
 assert.match(revenue,/do not add|NOT added|NOT added together/i,
  'manual and API receipts must never be summed as a fake combined total');
});
