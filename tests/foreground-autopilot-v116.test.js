"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const src=fs.readFileSync(path.join(__dirname,"../ProfitStaxx.user.js"),"utf8");
test("open recorded positions join the automatic market watch, even if not manually watched",()=>{
 const a=src.indexOf("function getWatchList(){"),b=src.indexOf("async function loadCatalog(){",a);
 assert.ok(a>=0&&b>a);
 const lookup={x:{id:7,name:"Open holding"},y:{id:8,name:"Plushie"}};
 const state={settings:{watchNames:[]},trades:[{side:"buy",qty:1,itemId:7}],catalog:{}};
 const fn=vm.runInNewContext(src.slice(a,b)+";getWatchList",{
  state,RECIPES:[{items:["Plushie"]}],positions:()=>[{itemId:7,name:"Open holding",qty:3}],
  getItem:name=>lookup[name==="Open holding"?"x":"y"]
 });
 assert.deepEqual([...fn().map(x=>x.id)],[8,7]);
});
test("automatic scanner persists throttling and never drives gameplay transactions",()=>{
 assert.match(src,/profitstaxx-auto-attempts-v116/);
 assert.match(src,/noteAutoAttemptV116\('quick',time\)/);
 assert.match(src,/Math\.max\(autoChecksV112\.quick,state\.lastScan\)>=8\*60000/);
 assert.match(src,/held\.has\(Number\(a\.id\)\)/);
 assert.doesNotMatch(src,/PDA_http(?:Post|Put|Patch|Delete)\s*\(/);
});