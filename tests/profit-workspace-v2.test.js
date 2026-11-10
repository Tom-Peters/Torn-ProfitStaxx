'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../ProfitStaxx.user.js'),'utf8');
function fixture(){
 const w={};w.top=w;w.self=w;
 const marker="  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init";
 const code=source.replace(marker,'  window.test={state,stockState,profitDeskModel,renderProfitHome,renderMoneyWorkspace,renderStockWorkspace,profitNavigation,onClick,setFilter(v){stockViewFilter=v;},setQuery(v){stockViewQuery=v;}};\n'+marker);
 const stored={},nav=[];
 vm.runInNewContext(code,{window:w,document:{readyState:'loading',addEventListener(){}},console,Date,Math,setTimeout,clearTimeout,sessionStorage:{setItem(k,v){stored[k]=v;}},location:{assign(url){nav.push(url);}}});
 return Object.assign(w.test,{stored,nav});
}
function quote(at=Date.now()){return {id:12,name:'Sample',at,reference:1300000,offers:[{price:1000000,qty:20},...Array.from({length:9},()=>({price:1300000,qty:20}))]};}
test('overview excludes stale quotes and separates forecasts from ledger results',()=>{
 const v=fixture();v.state.quotes[12]=quote(Date.now()-9*60000);
 assert.equal(v.profitDeskModel().fresh.length,0);
 v.state.quotes[12]=quote();assert.equal(v.profitDeskModel().fresh.length,1);
 assert.equal(v.profitDeskModel().money.realised,0);
 const html=v.renderProfitHome();assert.match(html,/Recorded results/);assert.match(html,/From recorded buy\/sell transactions/);assert.match(html,/No matched receipts/);
});
test('overview respects protected cash and prioritises a recorded exit',()=>{
 const v=fixture();v.state.settings.key='fixture-only';v.state.settings.capital=100;v.state.quotes[12]=quote();
 assert.equal(v.profitDeskModel().affordable.length,0);
 v.state.trades=[{side:'buy',itemId:12,name:'Sample',qty:2,price:1000000,at:1}];
 assert.match(v.renderProfitHome(),/Review selling Sample/);
 assert.match(v.renderMoneyWorkspace(),/Open cost basis/);
 assert.match(v.renderMoneyWorkspace(),/No fresh profitable exit flagged|after-fee upside/);
});
test('stock budget filter requires fresh ownership, valid block and an actual shortfall',()=>{
 const v=fixture();v.stockState.all=[{id:1,name:'Test stock',acronym:'TST',market:{price:10},bonus:{requirement:10,passive:true}}];v.stockState.at=Date.now();v.setFilter('budget');
 assert.doesNotMatch(v.renderStockWorkspace(),/data-view-key="stock-1"/);
 v.stockState.ownedAt=Date.now();assert.match(v.renderStockWorkspace(),/data-view-key="stock-1"/);
 v.stockState.owned=[{id:1,shares:10}];assert.doesNotMatch(v.renderStockWorkspace(),/data-view-key="stock-1"/);
 v.stockState.owned=[];v.stockState.all[0].bonus.requirement=0;assert.doesNotMatch(v.renderStockWorkspace(),/data-view-key="stock-1"/);
});
test('stock search escapes data and keeps utility perks unpriced',()=>{
 const v=fixture();v.stockState.all=[{id:1,name:'<b>Example</b>',acronym:'TST',market:{price:10},bonus:{requirement:10}}];v.setQuery('example');
 const html=v.renderStockWorkspace();assert.match(html,/&lt;b&gt;Example/);assert.match(html,/Unpriced perk/);assert.doesNotMatch(html,/<b>Example<\/b>/);
 v.setQuery('absent');assert.doesNotMatch(v.renderStockWorkspace(),/data-view-key="stock-1"/);
});
test('visible fresh deals can open below notification threshold without submitting a purchase',async()=>{
 const v=fixture();v.state.quotes[12]=quote();v.state.settings.alertThreshold=1e12;
 await v.onClick({target:{closest:()=>({dataset:{action:'market-buy',id:'12'}})}});
 assert.equal(v.nav.length,1);const intent=JSON.parse(v.stored['profitstaxx-market-intent-v1']);assert.equal(intent.id,12);assert.ok(intent.qty>0);
 v.state.quotes[12].at=Date.now()-9*60000;
 await v.onClick({target:{closest:()=>({dataset:{action:'market-buy',id:'12'}})}});assert.equal(v.nav.length,1);assert.match(v.state.error,/expired/);
});
