'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname,'..','shared','staxx-hub.js'),'utf8');
const main = fs.readFileSync(path.join(__dirname,'..','ProfitStaxx.user.js'),'utf8');

function bootHub(){
  const listeners = Object.create(null);
  class FakeElement {
    constructor(tag){
      this.tag=tag;this.children=[];this.dataset={};this.hidden=false;this.attributes={};this.textContent='';
      this.className='';this.innerHTML='';this.id='';
      this.style={top:'',setProperty:(k,v)=>{this.style[k]=v;}};
      const classes=new Set();
      this.classList={toggle:(k,on)=>{if(on)classes.add(k);else classes.delete(k);},contains:k=>classes.has(k),add:k=>classes.add(k),remove:k=>classes.delete(k)};
      this.handlers=Object.create(null);
    }
    append(...children){this.children.push(...children);}
    replaceChildren(...children){this.children=[...children];}
    get childElementCount(){return this.children.length;}
    setAttribute(k,v){this.attributes[k]=String(v);}
    hasAttribute(k){return Object.prototype.hasOwnProperty.call(this.attributes,k);}
    addEventListener(k,cb){(this.handlers[k]??=[]).push(cb);}
    fire(k,target=this,props={}){for(const cb of this.handlers[k]||[])cb({target,pointerId:1,clientY:300,button:0,preventDefault(){},...props});}
    closest(selector){return selector==='button'&&this.tag==='button'?this:null;}
    getBoundingClientRect(){return {top:340,left:5,width:43,height:49};}
  }
  const roots={};
  for(const [selector,tag] of Object.entries({
    '#staxx-hub-toggle':'button','#staxx-hub-veil':'div','#staxx-hub-drawer':'aside',
    '#staxx-hub-tools':'div','#staxx-hub-alerts':'div','#staxx-hub-tasks':'section','#staxx-hub-count':'span',
    '#staxx-hub-overview':'section','[data-overview]':'button','#staxx-hub-diagnostics':'section','[data-diagnostics]':'button','[data-arrange]':'button','#staxx-hub-total':'span'
  }))roots[selector]=new FakeElement(tag);
  const doc={
    readyState:'complete',hidden:false,mounted:null,
    getElementById(id){return id==='staxx-hub-root'&&this.mounted?this.mounted:null;},
    createElement(tag){return new FakeElement(tag);},
    documentElement:{append(...elements){doc.mounted=elements.find(x=>x.id==='staxx-hub-root')||doc.mounted;}},
    addEventListener(k,cb){(listeners[k]??=[]).push(cb);},
    dispatchEvent(e){for(const cb of listeners[e.type]||[])cb(e);}
  };
  const storage=()=>{
    const content=new Map();
    return {getItem:k=>content.has(k)?content.get(k):null,setItem:(k,v)=>content.set(k,String(v))};
  };
  class CE {constructor(type,options={}){this.type=type;this.detail=options.detail;}}
  const win={innerHeight:850,addEventListener(){},setInterval(){}};
  win.top=win;win.self=win;
  const location={hostname:'www.torn.com',pathname:'/index.php',origin:'https://www.torn.com',assign(){}};
  vm.runInNewContext(source,{document:doc,window:win,location,CustomEvent:CE,sessionStorage:storage(),localStorage:storage(),Math,Date,Number,String,JSON,Set},{timeout:1000});
  const root=doc.mounted;assert.ok(root,'Launcher must mount');
  root.querySelector=selector=>roots[selector];
  // The stub needs querySelector during startHub, so this fixture uses an early root.querySelector prototype.
  return {doc,root,els:roots,CE};
}

// A DOM shim with selector resolution before initial mounting.
function mounted(){
  const oldSource=source;
  const injected=oldSource.replace('root.id = "staxx-hub-root";',
    'root.id = "staxx-hub-root"; root.querySelector = selector => document.__selectors[selector];');
  assert.notEqual(injected,oldSource);
  const listeners={};
  class Element {
    constructor(tag){
      this.tag=tag;this.children=[];this.dataset={};this.hidden=false;this.className='';this.textContent='';this.innerHTML='';this.id='';this.attributes={};this.handlers={};
      this.style={top:'',setProperty:(key,value)=>{this.style[key]=value;}};
      const c=new Set();this.classList={toggle:(key,yes)=>yes?c.add(key):c.delete(key),contains:key=>c.has(key),add:k=>c.add(k),remove:k=>c.delete(k)};
    }
    append(...elements){this.children.push(...elements);}replaceChildren(...elements){this.children=[...elements];}
    get childElementCount(){return this.children.length;}
    setAttribute(key,val){this.attributes[key]=String(val);}hasAttribute(key){return key in this.attributes;}
    addEventListener(name,fn){(this.handlers[name]??=[]).push(fn);}
    fire(name,target){for(const fn of this.handlers[name]||[])fn({target,button:0,pointerId:1,clientY:300,preventDefault(){}});}
    closest(selector){return selector==='button'&&this.tag==='button'?this:null;}
    getBoundingClientRect(){return {top:320,left:5,width:43,height:49};}
  }
  const q={};
  for(const [name,tag] of Object.entries({
    '#staxx-hub-toggle':'button','#staxx-hub-veil':'div','#staxx-hub-drawer':'aside',
    '#staxx-hub-tools':'div','#staxx-hub-alerts':'div','#staxx-hub-tasks':'section','#staxx-hub-count':'span',
    '#staxx-hub-overview':'section','[data-overview]':'button','#staxx-hub-diagnostics':'section','[data-diagnostics]':'button','[data-arrange]':'button','#staxx-hub-total':'span',
    '#staxx-hub-find':'section','#staxx-hub-find-input':'input','#staxx-hub-find-results':'section','#staxx-hub-find-status':'p','[data-hub-find]':'button','.staxx-scroll':'div',
    '#staxx-hub-best':'section','#staxx-hub-task-filters':'div','#staxx-hub-dashboard':'section',
    '#staxx-hub-activity':'section','#staxx-hub-frequent':'div','[data-activity-clear]':'button','[data-usage-reset]':'button'
  }))q[name]=new Element(tag);
  q["[data-overview]"].setAttribute("data-overview","");
  q["[data-diagnostics]"].setAttribute("data-diagnostics","");
  q["[data-arrange]"].setAttribute("data-arrange","");
  q["[data-hub-find]"].setAttribute("data-hub-find","");
  q["[data-activity-clear]"].setAttribute("data-activity-clear","");
  q["[data-usage-reset]"].setAttribute("data-usage-reset","");
  const doc={
    readyState:'complete',hidden:false,mounted:null,__selectors:q,
    getElementById:()=>null,
    createElement:tag=>new Element(tag),
    documentElement:{append(...els){doc.mounted=els.find(x=>x.id==='staxx-hub-root');}},
    addEventListener(name,fn){(listeners[name]??=[]).push(fn);},
    dispatchEvent(event){for(const fn of listeners[event.type]||[])fn(event);}
  };
  const store=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,v)=>values.set(key,String(v))};};
  class CE{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
  const w={innerHeight:850,addEventListener(){},setInterval(){}};
  w.top=w;w.self=w;
  const loc={hostname:'www.torn.com',pathname:'/index.php',origin:'https://www.torn.com',assign(){}};
  const local=store();
  vm.runInNewContext(injected,{document:doc,window:w,location:loc,CustomEvent:CE,localStorage:local,sessionStorage:store(),Date,Math,JSON,Number,String,Set},{timeout:1000});
  assert.ok(doc.mounted);
  return {document:doc,root:doc.mounted,q,local,emit:(name,detail)=>doc.dispatchEvent(new CE(name,{detail}))};
}
test('v3.5 hub is bundled in ProfitStaxx and has narrower side panel',()=>{
  assert.match(main,/StaxxHub v3\.5/);
  assert.match(source,/width:min\(302px,calc\(100vw - 36px\)\)/);
  assert.match(source,/staxx-hub-position-v2/);
});
test('launcher is hidden while sidebar or any tool panel is open',()=>{
  const h=mounted(),toggle=h.q['#staxx-hub-toggle'];
  assert.equal(toggle.hidden,false);
  h.root.fire('click',toggle);
  assert.equal(toggle.hidden,true,'Tab should disappear when drawer opens');
  assert.equal(h.q['#staxx-hub-drawer'].hidden,false);
  h.emit('staxx:register',{id:'profit'});
  const profit=h.q['#staxx-hub-tools'].children[0];
  h.root.fire('click',profit);
  assert.equal(toggle.hidden,true,'Tab should remain hidden behind open tool');
  assert.equal(h.q['#staxx-hub-drawer'].hidden,true,'Drawer should close when tool opens');
  h.emit('staxx:panel',{id:'profit',open:true});
  h.emit('staxx:panel',{id:'profit',open:false});
  assert.equal(toggle.hidden,false,'Tab should return after tool closes');
});
test('priority badges, dismiss, snooze, combined overview and dynamic discovery',()=>{
  const h=mounted(),toggle=h.q['#staxx-hub-toggle'];
  h.emit('staxx:register',{id:'custom',label:'Custom Staxx',desc:'Next script'});
  assert.equal(h.q['#staxx-hub-tools'].children.length,5);
  h.emit('staxx:notice',{id:'profit',count:2,level:'urgent',summary:'Urgent check',items:['Review now']});
  assert.equal(toggle.classList.contains('staxx-urgent'),true);
  assert.equal(h.q['#staxx-hub-count'].textContent,'2');
  const alert=h.q['#staxx-hub-alerts'].children[0];
  const actions=alert.children.find(x=>x.className==='staxx-alert-actions');
  h.root.fire('click',actions.children[0]);
  assert.equal(h.q['#staxx-hub-count'].hidden,true,'Dismiss should hide unchanged alert');
  h.emit('staxx:notice',{id:'profit',count:3,level:'warning',summary:'New findings',items:['Different alert']});
  assert.equal(h.q['#staxx-hub-count'].hidden,false,'New alert should override dismissal');
  const nextAlert=h.q['#staxx-hub-alerts'].children[0];
  h.root.fire('click',nextAlert.children.find(x=>x.className==='staxx-snooze-menu').children[1]); // 1h preset
  assert.equal(h.q['#staxx-hub-count'].hidden,true,'Snooze should hide a current alert');
  h.emit('staxx:summary',{id:'profit',headline:'Recent scan',metrics:[{label:'Deals',value:'3'}]});
  h.root.fire('click',h.q['[data-overview]']);
  assert.equal(h.q['#staxx-hub-overview'].hidden,false);
  assert.equal(h.q['#staxx-hub-overview'].children.find(x=>x.className==='staxx-overview-card').children[1].textContent,'Recent scan');
});

test('reorder moves tools with touch-friendly buttons',()=>{
  const h=mounted();
  h.root.fire('click',h.q['[data-arrange]']);
  const items=h.q['#staxx-hub-tools'].children;
  assert.equal(items[0].className,'staxx-toolrow');
  assert.equal(items[0].children[0].dataset.openStaxx,'profit');
  h.root.fire('click',items[0].children[2]);
  assert.equal(h.q['#staxx-hub-tools'].children[0].children[0].dataset.openStaxx,'company');
  assert.equal(h.q['#staxx-hub-tools'].children[1].children[0].dataset.openStaxx,'profit');
});
test('countdowns require genuine dueAt and trend charts show missing days',()=>{
  const h=mounted(),now=Date.now();
  h.emit('staxx:notice',{id:'happy',count:1,level:'warning',summary:'Gym action',dueAt:now+10*60000});
  const alert=h.q['#staxx-hub-alerts'].children[0];
  assert.ok(alert.children.some(x=>x.className==='staxx-due'&&/Due in 10m/.test(x.textContent)));
  h.emit('staxx:summary',{id:'company',headline:'Company',metrics:[{label:'Star rating',value:'4 / 10'}],updated:now});
  h.root.fire('click',h.q['[data-overview]']);
  const companyCard=h.q['#staxx-hub-overview'].children.filter(x=>x.className==='staxx-overview-card')[1];
  const trend=companyCard.children.find(x=>x.className==='staxx-trend');
  assert.ok(trend);
  assert.match(trend.children[2].textContent,/1\/7 recorded days/);
  assert.equal(trend.children[1].children.filter(x=>x.className==='missing').length,6);
});

test('specific notification opens the exact tool alert',()=>{
  const h=mounted();h.emit('staxx:register',{id:'profit'});
  h.emit('staxx:notice',{id:'profit',count:1,level:'warning',summary:'One purchase to review',alerts:[{id:'deal-123',title:'Buy 100 medical items',detail:'Check the live price'}]});
  const group=h.q['#staxx-hub-alerts'].children[0];
  const action=group.children.find(x=>x.dataset.openAlertId==='deal-123');
  assert.ok(action,'Individual alert should render an actionable sidebar button');
  let opened=null;h.document.addEventListener('staxx:open',e=>{opened=e.detail;});
  h.root.fire('click',action);
  assert.equal(opened.id,'profit');assert.equal(opened.alertId,'deal-123');
});

test('ranked next actions navigate directly to their matching tool alert',()=>{
  const h=mounted();h.emit('staxx:register',{id:'profit'});
  h.emit('staxx:actions',{id:'profit',updated:Date.now(),items:[
    {id:'deal-42',title:'Review 42 items',detail:'Estimated resale spread',status:'review',priority:72},
    {id:'refresh-scan',title:'Refresh prices',detail:'Quote age unknown',status:'now',priority:90}
  ]});
  const items=h.q['#staxx-hub-tasks'].children.filter(x=>x.dataset.openAlertId);
  assert.equal(items.length,2);
  assert.equal(items[0].dataset.openAlertId,'refresh-scan','Do-now actions should sort before review suggestions');
  assert.equal(items[1].dataset.openAlertId,'deal-42');
  let event=null;h.document.addEventListener('staxx:open',e=>{event=e.detail;});
  h.root.fire('click',items[1]);
  assert.equal(event.id,'profit');
  assert.equal(event.alertId,'deal-42');
});

test('native Torn guidance is optional, routed and does not perform gameplay writes',()=>{
  assert.match(source,/staxx-hub-context-v1/);
  assert.match(source,/data-context-toggle/);
  assert.match(source,/\/gym\.php/);
  assert.match(source,/\/companies\.php/);
  assert.match(source,/sid=itemmarket/);
  assert.match(source,/anchor\.insertAdjacentElement\("afterend",bar\)/);
  assert.match(source,/openTool\(ctx\.id,first\.id\)/);
  assert.doesNotMatch(source,/fetch\s*\(\s*["']https:\/\/api\.torn\.com/);
});

test('future tools join daily dashboard, expose safe diagnostics and do not promote cached urgent actions',()=>{
  const h=mounted();
  h.emit('staxx:register',{id:'newtool',label:'New Tool',icon:'NT',desc:'Future Staxx',freshnessMs:60000,trendMetric:'Completed'});
  h.emit('staxx:actions',{id:'newtool',updated:Date.now()-3600000,items:[{id:'new-task',title:'Review future tool',status:'urgent',priority:100}]});
  const btn=h.q['#staxx-hub-tasks'].children.find(x=>x.dataset.openAlertId==='new-task');
  assert.ok(btn);
  assert.doesNotMatch(btn.className,/urgent/,'old actions must not retain urgent styling');
  assert.match(btn.children[0].textContent,/LAST OBSERVED/);
  h.emit('staxx:diagnostics',{id:'newtool',version:'0.1.0',api:'ready',storage:'ready',ui:'ready',detail:'All fine'});
  h.root.fire('click',h.q['[data-diagnostics]']);
  const panel=h.q['#staxx-hub-diagnostics'];
  assert.equal(panel.hidden,false);
  const card=panel.children.find(x=>x.className==='staxx-overview-card'&&x.children[0].textContent.includes('New Tool'));
  assert.ok(card,'automatically registered tool must be visible in diagnostics');
  assert.ok(card.children.some(x=>x.textContent.includes('Version 0.1.0')));
});

test('Today shows two priority cards, with an explicit way to reveal the rest',()=>{
  const h=mounted();
  h.emit('staxx:register',{id:'profit'});
  h.emit('staxx:actions',{id:'profit',updated:Date.now(),items:[
    {id:'task-1',title:'Urgent review',status:'urgent',priority:100},
    {id:'task-2',title:'Second review',status:'now',priority:80},
    {id:'task-3',title:'Later review',status:'review',priority:20}
  ]});
  let shown=h.q['#staxx-hub-tasks'].children;
  assert.deepEqual(shown.filter(x=>x.dataset.openAlertId).map(x=>x.dataset.openAlertId),['task-1','task-2']);
  let toggle=shown.find(x=>x.dataset.toggleTasks==='1');
  assert.ok(toggle,'two action cards have a separate review control and an expand button');
  h.root.fire('click',toggle);
  shown=h.q['#staxx-hub-tasks'].children;
  assert.deepEqual(shown.filter(x=>x.dataset.openAlertId).map(x=>x.dataset.openAlertId),['task-1','task-2','task-3']);
  toggle=shown.find(x=>x.dataset.toggleTasks==='1');
  h.root.fire('click',toggle);
  assert.equal(h.q['#staxx-hub-tasks'].children.filter(x=>x.dataset.openAlertId).length,2,'collapse stays available');
});
test('Today-first navigation keeps deep links and advanced options accessible',()=>{
  assert.match(source,/data-hub-view="today"/);
  assert.match(source,/data-hub-view="tools"/);
  assert.match(source,/data-hub-view="alerts"/);
  assert.match(source,/data-hub-view="more"/);
  assert.match(source,/data-hub-section="more" hidden/);
  assert.match(source,/switchHubView\("today"\)/);
  assert.match(source,/data-hub-section/);
  assert.match(source,/if\(scroll\)scroll.scrollTop=0/);
});

test('v3.0 Find indexes active tool sections, alert IDs and verified recommendations',()=>{
  const h=mounted();
  h.emit('staxx:register',{id:'profit'});
  h.emit('staxx:register',{id:'company'});
  h.emit('staxx:notice',{id:'profit',count:1,summary:'Review a medical trade',alerts:[{id:'deal-91',title:'Medical supply order',detail:'Buy only after checking the price'}]});
  h.emit('staxx:actions',{id:'profit',updated:Date.now(),items:[{id:'stock-scan',title:'Review profitable stocks',status:'now',priority:85}]});
  h.root.fire('click',h.q['[data-hub-find]']);
  assert.equal(h.q['#staxx-hub-find'].hidden,false);
  assert.equal(h.q['.staxx-scroll'].hidden,true);
  const input=h.q['#staxx-hub-find-input'],results=h.q['#staxx-hub-find-results'];
  input.value='stock';input.fire('input');
  assert.ok(results.children.some(x=>x.dataset.hubSectionTool==='profit'&&x.dataset.hubSectionTab==='stocks'));
  assert.ok(results.children.some(x=>x.dataset.openAlertId==='stock-scan'));
  input.value='medical';input.fire('input');
  const hit=results.children.find(x=>x.dataset.openAlertId==='deal-91');
  assert.ok(hit);
  let action=null;h.document.addEventListener('staxx:open',e=>action=e.detail);
  h.root.fire('click',hit);
  assert.equal(action.id,'profit');
  assert.equal(action.alertId,'deal-91');
  assert.equal(h.q['#staxx-hub-find'].hidden,true);
});

test('v3.0 section routing validates requested tabs, reuses one panel and supports registered future tools',()=>{
  const h=mounted();
  h.emit('staxx:register',{id:'profit'});
  h.emit('staxx:register',{id:'other-tool',label:'Other Tool',sections:[{id:'ledger',label:'Transaction ledger'},{id:'<unsafe>',label:'Bad route'}]});
  h.root.fire('click',h.q['[data-hub-find]']);
  const input=h.q['#staxx-hub-find-input'],results=h.q['#staxx-hub-find-results'];
  input.value='stocks';input.fire('input');
  const button=results.children.find(x=>x.dataset.hubSectionTab==='stocks');
  assert.ok(button);
  let routed=null;h.document.addEventListener('staxx:open',e=>routed=e.detail);
  h.root.fire('click',button);
  assert.equal(routed.id,'profit');
  assert.equal(routed.section,'stocks');
  assert.equal(routed.alertId,null);
  h.emit('staxx:find');
  input.value='ledger';input.fire('input');
  assert.ok(results.children.some(x=>x.dataset.hubSectionTool==='other-tool'&&x.dataset.hubSectionTab==='ledger'));
  input.value='unsafe';input.fire('input');
  assert.ok(!results.children.some(x=>x.dataset.hubSectionTab==='<unsafe>'));
});

test('Find suppresses dismissed alerts and does not treat stale actions as live urgent recommendations',()=>{
  const h=mounted();h.emit('staxx:register',{id:'profit'});
  h.emit('staxx:notice',{id:'profit',count:1,summary:'Old trade review',alerts:[{id:'deal-17',title:'Review item 17'}]});
  h.emit('staxx:actions',{id:'profit',updated:Date.now()-3*3600000,items:[{id:'stale-review',title:'Review old quotes',status:'urgent',priority:100}]});
  h.root.fire('click',h.q['[data-hub-find]']);
  const input=h.q['#staxx-hub-find-input'],results=h.q['#staxx-hub-find-results'];
  input.value='old';input.fire('input');
  assert.ok(results.children.some(x=>x.children?.some(n=>/Last observed/.test(n.textContent))));
  const alert=h.q['#staxx-hub-alerts'].children[0];
  h.root.fire('click',alert.children.find(x=>x.className==='staxx-alert-actions').children[0]);
  input.value='item 17';input.fire('input');
  assert.ok(!results.children.some(x=>x.dataset.openAlertId==='deal-17'),'dismissed alerts must not reappear through Find');
  h.document.dispatchEvent({type:'keydown',key:'Escape',preventDefault(){}});
  assert.equal(h.q['#staxx-hub-find'].hidden,true);
  assert.equal(h.q['#staxx-hub-drawer'].hidden,false,'Escape should close Find first');
});

test('Find is local, accessible and never introduces gameplay submission',()=>{
  assert.match(source,/data-hub-find aria-label=/);
  assert.match(source,/id="staxx-hub-find-input"/);
  assert.match(source,/textContent=String\(value\)/);
  assert.match(source,/staxx:find/);
  assert.match(source,/staxx-open-company-section/);
  assert.match(source,/staxx-open-company-at/);
  assert.doesNotMatch(source,/fetch\s*\(\s*["']https:\/\/api\.torn\.com/);
});

test('StaxxHub 3.1 shows source-labelled suite dashboard and a freshness-ranked best review',()=>{
  const h=mounted(),now=Date.now();
  h.emit('staxx:register',{id:'profit'});
  h.emit('staxx:register',{id:'company'});
  h.emit('staxx:summary',{id:'profit',headline:'Cash performance',updated:now,metrics:[{label:'Fresh deals',value:'3'},{label:'Modelled profit',value:'£5k'}]});
  h.emit('staxx:summary',{id:'company',headline:'Company rating 4 stars',updated:now,metrics:[{label:'Star rating',value:'4 / 10'}]});
  const cards=h.q['#staxx-hub-dashboard'].children.filter(x=>x.className==='staxx-overview-card');
  assert.equal(cards.length,4);
  assert.ok(cards[0].children.some(x=>/Cash performance/.test(x.textContent)));
  assert.ok(cards[1].children.some(x=>/Company rating/.test(x.textContent)));
  h.emit('staxx:actions',{id:'profit',updated:now-86400000,items:[{id:'old-deal',title:'Old stock alert',status:'urgent',priority:100}]});
  h.emit('staxx:actions',{id:'company',updated:now,items:[{id:'loss-review',title:'Review company loss',status:'urgent',priority:95,reviewMinutes:3}]});
  let best=h.q['#staxx-hub-best'].children.find(x=>x.dataset?.openAlertId==='loss-review');
  assert.ok(best,'the best suggestion must not be the stale urgent stock alert');
  assert.ok(best.children.some(x=>/3 min review/.test(x.textContent)));
  assert.ok(h.q['#staxx-hub-best'].children.some(x=>/Ranked using source urgency/.test(x.textContent)));
});

test('StaxxHub 3.2 also exposes a Checked filter and bounds review-time estimates',()=>{
  const h=mounted(),now=Date.now();h.emit('staxx:register',{id:'profit'});
  h.emit('staxx:actions',{id:'profit',updated:now,items:[
    {id:'do',title:'Act now',status:'urgent',reviewMinutes:1},
    {id:'soon',title:'Check soon',status:'soon',reviewMinutes:2},
    {id:'optional',title:'Inspect later',status:'review',reviewMinutes:999}
  ]});
  const filter=h.q['#staxx-hub-task-filters'],tasks=h.q['#staxx-hub-tasks'];
  assert.equal(filter.children.length,7);
  assert.ok(tasks.children.some(x=>x.dataset.openAlertId==='do'));
  h.root.fire('click',filter.children.find(x=>x.dataset.taskFilter==='soon'));
  assert.equal(tasks.children.filter(x=>x.dataset?.openAlertId).length,1);
  assert.equal(tasks.children[0].dataset.openAlertId,'soon');
  h.root.fire('click',filter.children.find(x=>x.dataset.taskFilter==='optional'));
  assert.ok(tasks.children[0].children.some(x=>/not estimated/.test(x.textContent)));
});

test('StaxxHub 3.1 learns shortcuts only from actual user navigation and allows reset',()=>{
  const h=mounted();h.emit('staxx:register',{id:'profit'});h.emit('staxx:register',{id:'company'});
  const quick=h.q['#staxx-hub-frequent'];
  assert.ok(quick.children.some(x=>/after you open/.test(x.textContent)));
  const tool=h.q['#staxx-hub-tools'].children.find(x=>x.dataset.openStaxx==='profit');
  h.root.fire('click',tool);
  h.emit('staxx:panel',{id:'profit',open:false});
  assert.ok(quick.children.some(x=>/after you open/.test(x.textContent)),'one visit is not a learned shortcut');
  h.root.fire('click',tool);
  h.emit('staxx:panel',{id:'profit',open:false});
  assert.ok(quick.children.some(x=>x.dataset.openStaxx==='profit'));
  const saved=JSON.parse(h.local.getItem('staxx-hub-usage-v1'));
  assert.ok(saved.some(x=>x.tool==='profit'&&x.count===2));
  h.root.fire('click',h.q['[data-usage-reset]']);
  assert.equal(JSON.parse(h.local.getItem('staxx-hub-usage-v1')).length,0);
});

test('StaxxHub 3.1 retains bounded, deduplicated provenance-labelled activity only',()=>{
  const h=mounted(),now=Date.now();h.emit('staxx:register',{id:'happy'});
  const event={id:'gym-abc',at:now-1000,source:'api',section:'progress',title:'Gym +450 Strength',detail:'Official log record'};
  h.emit('staxx:activity',{id:'happy',events:[event,event,{id:'forecast',at:now,source:'forecast',title:'Not real'},{id:'future',at:now+86400000,source:'api',title:'Future event'}]});
  let stored=JSON.parse(h.local.getItem('staxx-hub-activity-v1'));
  assert.equal(stored.length,1);
  assert.equal(stored[0].source,'api');
  let cards=h.q['#staxx-hub-activity'].children.filter(x=>x.className==='staxx-overview-card');
  assert.equal(cards.length,1);
  assert.ok(cards[0].children.some(x=>/Verified Torn log/.test(x.textContent)));
  h.emit('staxx:activity',{id:'happy',events:[{id:'record-1',at:now,source:'recorded',title:'Manual entry'}]});
  stored=JSON.parse(h.local.getItem('staxx-hub-activity-v1'));
  assert.equal(stored.length,2);
  assert.ok(h.q['#staxx-hub-activity'].children.some(x=>x.children?.some(y=>/Locally recorded/.test(y.textContent))));
  h.root.fire('click',h.q['[data-activity-clear]']);
  assert.equal(JSON.parse(h.local.getItem('staxx-hub-activity-v1')).length,0);
});

test('StaxxHub 3.1 learns deliberate tool tab visits, never background section claims',()=>{
  const h=mounted();
  h.emit('staxx:register',{id:'company'});
  const frequent=h.q['#staxx-hub-frequent'];
  h.emit('staxx:visit',{id:'unknown',section:'training'});
  h.emit('staxx:visit',{id:'company',section:'unregistered-section'});
  assert.equal(h.local.getItem('staxx-hub-usage-v1'),null,'unknown sections must not be counted');
  h.emit('staxx:visit',{id:'company',section:'training'});
  let saved=JSON.parse(h.local.getItem('staxx-hub-usage-v1'));
  assert.equal(saved.length,1);
  assert.equal(saved[0].section,'training');
  assert.equal(saved[0].count,1);
  h.emit('staxx:visit',{id:'company',section:'training'});
  saved=JSON.parse(h.local.getItem('staxx-hub-usage-v1'));
  assert.equal(saved[0].count,1,'a duplicate tab event within 10 seconds must be ignored');
  assert.ok(frequent.children.some(x=>/after you open/.test(x.textContent)));
});
