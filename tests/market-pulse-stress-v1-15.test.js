"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"../ProfitStaxx.user.js"),"utf8");
function snippet(from,to){const a=source.indexOf("function "+from+"("),b=source.indexOf("function "+to+"(",a);assert.ok(a>=0&&b>a);return source.slice(a,b);}
const esc=x=>String(x),fmt=x=>"$"+Math.round(x),now=()=>Date.UTC(2026,10,1,12);
test("Market Pulse compares verified historical asks and links to manual inspection",()=>{
 const t=now(),sandbox={state:{snapshots:{"12":[{at:t-3600000,price:100},{at:t-180000,price:80}]},catalog:{sample:{id:12,name:"Test item"}},quotes:{}},now,esc,fmt,age:()=>"3m ago"};
 const render=vm.runInNewContext(snippet("renderMarketPulseV115","renderTradeStressV115")+";renderMarketPulseV115",sandbox);
 const html=render();
 assert.match(html,/Market Pulse/);assert.match(html,/-20\.0%/);assert.match(html,/data-action="market-view"/);
 assert.doesNotMatch(html,/data-action="market-buy"/);
});
test("Stress test models profit and downside with 5% sale fee",()=>{
 const render=vm.runInNewContext(snippet("renderTradeStressV115","renderScan")+";renderTradeStressV115",{esc,fmt});
 const html=render({id:12,name:"Test item",buy:100,qty:10,reference:130});
 assert.match(html,/Resale ASK -0%/);assert.match(html,/Resale ASK -10%/);
 assert.match(html,/\$230/);assert.match(html,/\$110/);
 assert.match(html,/market-buy/);assert.match(html,/none of these are executable bids/);
});
