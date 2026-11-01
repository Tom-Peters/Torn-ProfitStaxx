'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','ProfitStaxx.user.js'),'utf8');

function harness(){
  const replacement='  window.__PS_TEST__ = {state,parseOffers,normalizeItems,listingReference,methodQuote,scoreDeal,positions,portfolio,recipeResults,esc};\n';
  const modified=source.replace("  if(document.readyState==='loading')",replacement+"  if(document.readyState==='loading')");
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
test('HTML escaping protects item labels',()=>{
  const {esc}=harness();
  assert.equal(esc('<svg onload="boom">&'), '&lt;svg onload=&quot;boom&quot;&gt;&amp;');
});
