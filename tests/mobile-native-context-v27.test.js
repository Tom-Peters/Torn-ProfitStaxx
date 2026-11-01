"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const src=fs.readFileSync(path.join(__dirname,"../shared/staxx-hub.js"),"utf8");
const start=src.indexOf("    function renderContext(){");
const end=src.indexOf("    function renderTasks(){",start);
assert.ok(start>0&&end>start,"canonical context renderer available");
const snippet=src.slice(start,end)+";renderContext";
function harness({touch=false,width=1000,parentWidth=650,items=[{id:"train-ready",title:"Train available",detail:"Verified gym bars",status:"review",priority:50}]}={}){
 let inserted=0,removed=0,queries=0;
 const anchor={parentElement:{getBoundingClientRect:()=>({width:parentWidth})},closest:()=>null,insertAdjacentElement:()=>{inserted++;}};
 const old={remove:()=>{removed++;},dataset:{fingerprint:"old"},previousElementSibling:null};
 const node=(tag,cls,value)=>({tag,cls,value,dataset:{},setAttribute(){},append(){},addEventListener(){}});
 const context={
  document:{documentElement:{clientWidth:width},getElementById:()=>old,querySelector:()=>{queries++;return anchor;}},
  root:{querySelector:()=>null},currentContext:()=>({id:"happy",name:"Gym"}),contextEnabled:()=>true,
  active:{happy:true},openPanels:new Set(),panelOpen:false,expanded:false,
  window:{innerWidth:width,matchMedia:()=>({matches:touch})},navigator:{maxTouchPoints:touch?5:0},
  actionSets:{happy:{cached:false,updated:Date.now(),items}},Date,node,openTool:()=>{}
 };
 vm.runInNewContext(snippet,context)();
 return {inserted,removed,queries};
}
test("touch TornPDA never inserts a next-action card, even with a desktop-width viewport",()=>{
 const h=harness({touch:true,width:980});
 assert.equal(h.inserted,0);assert.equal(h.queries,0);assert.equal(h.removed,1);
});
test("narrow layouts and narrow heading parents do not receive cards",()=>{
 assert.equal(harness({width:420}).inserted,0);
 assert.equal(harness({parentWidth:112}).inserted,0);
});
test("stale-data refresh prompts remain in hub drawer, not native Torn content",()=>{
 assert.equal(harness({items:[{id:"refresh-happy",title:"Refresh gym",status:"now"}]}).inserted,0);
});
test("verified real actions remain accessible inline on safe desktop layouts",()=>{
 assert.equal(harness().inserted,1);
});
