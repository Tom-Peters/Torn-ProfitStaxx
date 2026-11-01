"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"../ProfitStaxx.user.js"),"utf8");
const start=source.indexOf("function profitNextActions(){");
const end=source.indexOf("// Advisory only:",start);
assert.ok(start>=0&&end>start,"Extract the actual hub-action recommendation function");
function actionList(fresh){
 const state={lastScan:1};
 const code=source.slice(start,end)+";profitNextActions";
 const fn=vm.runInNewContext(code,{
   activeDealAlerts:()=>fresh,exitSignals:()=>[],dailyPlanV111:()=>({items:[],activeMinutes:0}),
   dueDividends:()=>[],stockSignals:()=>[],state,now:()=>20000000,
   fmt:n=>String(n),pct:n=>String(n)+"%"
 });
 return [...fn()];
}
test("a fresh quick-scan deal is shown even if the last full scan is old",()=>{
 const actions=actionList([{id:5,name:"Sample item",qty:4,profit:20000,roi:8,score:70}]);
 assert.ok(actions.some(x=>x.id==="deal-5"),"A fresh item quote remains actionable");
 assert.ok(!actions.some(x=>x.id==="refresh-scan"),"Do not incorrectly suppress all fresh quotes");
});
test("an empty qualified shortlist gives a recheck action, never a fabricated deal",()=>{
 const actions=actionList([]);
 assert.ok(actions.some(x=>x.id==="refresh-scan"));
 assert.ok(!actions.some(x=>x.id.startsWith("deal-")));
});
test("autopilot refreshes stale recorded holdings before expensive full scans",()=>{
 const a=source.indexOf("async function autoTickV112(){"),b=source.indexOf("async function init(){",a);
 assert.ok(a>=0&&b>a);
 const scheduler=source.slice(a,b);
 assert.match(scheduler,/staleHeld/);
 assert.match(scheduler,/noteAutoAttemptV116\('quick',time\)/);
 assert.ok(scheduler.indexOf("if(staleHeld")<scheduler.indexOf("if((!state.lastScan"));
 assert.match(source,/function autopilotPanelV117\(/);
 assert.match(source,/Stale or unavailable/);
 assert.doesNotMatch(source,/PDA_http(?:Post|Put|Patch|Delete)\s*\(/);
});
