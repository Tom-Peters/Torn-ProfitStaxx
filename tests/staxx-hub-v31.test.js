'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const hub=fs.readFileSync(path.join(__dirname,'..','shared','staxx-hub.js'),'utf8');
function fixture(){
  const listeners=Object.create(null);
  class Element {
    constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.hidden=false;this.className='';this.textContent='';this.innerHTML='';this.id='';this.attributes={};this.handlers={};this.value='';
      this.style={top:'',setProperty:(key,value)=>{this.style[key]=value;}};
      const c=new Set();this.classList={toggle:(key,on)=>on?c.add(key):c.delete(key),contains:key=>c.has(key),add:key=>c.add(key),remove:key=>c.delete(key)};
    }
    append(...children){this.children.push(...children);}
    replaceChildren(...children){this.children=[...children];}
    get childElementCount(){return this.children.length;}
    setAttribute(k,v){this.attributes[k]=String(v);}
    hasAttribute(k){const key=k.replace(/^data-/,'').replace(/-([a-z])/g,(_,c)=>c.toUpperCase());return k in this.attributes||(k.startsWith('data-')&&key in this.dataset);}
    addEventListener(k,fn){(this.handlers[k]??=[]).push(fn);}
    fire(k,target=this){for(const fn of this.handlers[k]||[])fn({target,key:'',pointerId:1,clientY:300,button:0,preventDefault(){}});}
    closest(selector){return selector==='button'&&this.tag==='button'?this:null;}
    getBoundingClientRect(){return {top:320,left:5,width:43,height:49};}
    focus(){}
  }
  const q={};
  const selectors={
    '#staxx-hub-toggle':'button','#staxx-hub-veil':'div','#staxx-hub-drawer':'aside',
    '#staxx-hub-tools':'section','#staxx-hub-alerts':'section','#staxx-hub-tasks':'section',
    '#staxx-hub-count':'span','#staxx-hub-total':'span','#staxx-hub-quick-tools':'section',
    '#staxx-hub-best':'section','#staxx-hub-task-filters':'section','#staxx-hub-frequent':'section',
    '#staxx-hub-dashboard':'section','#staxx-hub-activity':'section','#staxx-hub-welcome':'section','#staxx-hub-source-status':'section',
    '#staxx-hub-page-shortcut':'section','#staxx-hub-early':'section','#staxx-hub-changes':'section','#staxx-hub-daily':'section',
    '#staxx-hub-overview':'section','[data-overview]':'button','#staxx-hub-diagnostics':'section',
    '[data-diagnostics]':'button','[data-arrange]':'button','[data-hub-find]':'button',
    '#staxx-hub-find':'section','#staxx-hub-find-input':'input','#staxx-hub-find-status':'p',
    '#staxx-hub-find-results':'section','.staxx-scroll':'section'
  };
  for(const [selector,tag] of Object.entries(selectors))q[selector]=new Element(tag);
  for(const name of ['[data-overview]','[data-diagnostics]','[data-arrange]','[data-hub-find]'])
    q[name].setAttribute(name.slice(1,-1),'');
  const doc={readyState:'complete',hidden:false,mounted:null,__selectors:q,
    getElementById(id){return id==='staxx-hub-root'?this.mounted:null;},
    createElement:tag=>new Element(tag),
    documentElement:{clientWidth:1000,append(...elements){doc.mounted=elements.find(x=>x.id==='staxx-hub-root');}},
    addEventListener(k,fn){(listeners[k]??=[]).push(fn);},
    dispatchEvent(event){for(const fn of listeners[event.type]||[])fn(event);}
  };
  const createStore=()=>{const contents=new Map();return {getItem:k=>contents.has(k)?contents.get(k):null,setItem:(k,v)=>contents.set(k,String(v))};};
  class CE{constructor(type,{detail}={}){this.type=type;this.detail=detail;}}
  const win={innerHeight:800,innerWidth:900,addEventListener(){},setInterval(){}};
  win.top=win;win.self=win;
  const loc={hostname:'www.torn.com',pathname:'/index.php',origin:'https://www.torn.com',assign(){}};
  const modified=hub.replace('root.id = "staxx-hub-root";',
    'root.id = "staxx-hub-root"; root.querySelector = selector => document.__selectors[selector]; root.querySelectorAll = selector => [];');
  assert.notEqual(modified,hub);
  const local=createStore();
  vm.runInNewContext(modified,{document:doc,window:win,location:loc,CustomEvent:CE,
    localStorage:local,sessionStorage:createStore(),Date,Math,Number,String,JSON,Set,Map},{timeout:2000});
  assert.ok(doc.mounted);
  return {doc,loc,local,root:doc.mounted,q,emit:(name,detail)=>doc.dispatchEvent(new CE(name,{detail}))};
}
test('suite dashboard renders all tools with labelled snapshot metrics',()=>{
 const h=fixture();
 h.emit('staxx:register',{id:'company',label:'Company Helper',freshnessMs:86400000});
 h.emit('staxx:summary',{id:'company',headline:'Fitness Center · 3 stars',metrics:[{label:'Star rating',value:'3 / 10'},{label:'Daily P/L estimate',value:'-$10,000'}],updated:Date.now()});
 const cards=h.q['#staxx-hub-dashboard'].children.filter(x=>x.className==='staxx-overview-card');
 assert.equal(cards.length,3);
 const company=cards.find(x=>x.children.some(child=>child.textContent==='Company Helper'));
 assert.ok(company);
 assert.ok(company.children.some(child=>child.textContent==='Fitness Center · 3 stars'));
 assert.match(company.children.find(x=>x.tag==='dl').children[0].children[1].textContent,/3 \/ 10/);
});
test('best next action refuses stale urgent advice and urgency filters keep the original recommendations',()=>{
 const h=fixture();h.emit('staxx:register',{id:'profit',freshnessMs:60000});
 h.emit('staxx:register',{id:'happy',freshnessMs:60000});
 h.emit('staxx:actions',{id:'profit',updated:Date.now()-700000,items:[{id:'old-profit',title:'Old urgent listing',priority:100,status:'urgent'}]});
 h.emit('staxx:actions',{id:'happy',updated:Date.now(),items:[
   {id:'fresh-now',title:'Review actual gym status',priority:70,status:'now',reviewMinutes:2},
   {id:'fresh-soon',title:'Review coming cooldown',priority:60,status:'soon',reviewMinutes:3},
   {id:'fresh-optional',title:'Review perks',priority:20,status:'review',reviewMinutes:5}
 ]});
 const first=h.q['#staxx-hub-best'].children.find(x=>x.tag==='button');
 assert.equal(first.dataset.openAlertId,'fresh-now');
 assert.ok(first.children.some(x=>/2 min review/.test(x.textContent)));
 const filter=h.q['#staxx-hub-task-filters'].children.find(x=>x.dataset.taskFilter==='soon');
 assert.ok(filter);h.root.fire('click',filter);
 const shown=h.q['#staxx-hub-tasks'].children.filter(x=>x.dataset.openAlertId);
 assert.equal(shown.length,1);assert.equal(shown[0].dataset.openAlertId,'fresh-soon');
});
test('timeline requires actual evidence timestamps and labels API logs apart from local records',()=>{
 const h=fixture();const now=Date.now();h.emit('staxx:register',{id:'happy'});
 h.emit('staxx:activity',{id:'happy',events:[
   {id:'gym-123',at:now-10000,source:'api',title:'Gym training gained 120 strength',section:'progress'},
   {id:'gym-123',at:now-10000,source:'api',title:'Duplicate source log'},
   {id:'forecast-1',at:now,source:'forecast',title:'Planned train'},
   {id:'future-1',at:now+3600000,source:'api',title:'Future log'},
   {id:'old-1',at:now-35*86400000,source:'api',title:'Old log'},
   {id:'manual-note',at:now-5000,source:'recorded',title:'Local entry'}
 ]});
 const events=h.q['#staxx-hub-activity'].children.filter(x=>x.className==='staxx-overview-card');
 assert.equal(events.length,2);
 assert.ok(events.some(x=>x.children[0].textContent.includes('Verified Torn log')));
 assert.ok(events.some(x=>x.children[0].textContent.includes('Locally recorded')));
 assert.ok(!events.some(x=>x.children[1].textContent.includes('Planned train')));
});
test('frequent shortcuts learn from repeated user opens only, and can be reset',()=>{
 const h=fixture();h.emit('staxx:register',{id:'profit'});
 const tool=h.q['#staxx-hub-tools'].children.find(x=>x.dataset.openStaxx==='profit');
 assert.ok(tool);
 assert.match(h.q['#staxx-hub-frequent'].children[0].textContent,/Shortcuts appear/);
 h.root.fire('click',tool);h.root.fire('click',tool);
 const shortcuts=h.q['#staxx-hub-frequent'].children.filter(x=>x.tag==='button');
 assert.ok(shortcuts.length>=1,'two user clicks should promote the tool');
});

test('3.2 review queue checks only fresh nonurgent advice and reopens changed evidence',()=>{
 const h=fixture();
 h.emit('staxx:register',{id:'happy',freshnessMs:900000});
 const now=Date.now();
 const items=[
   {id:'gym-current',title:'Review energy',detail:'Energy available',status:'now',priority:80,reviewMinutes:2},
   {id:'gym-soon',title:'Review cooldown',detail:'Next Xanax window',status:'soon',priority:60}
 ];
 h.emit('staxx:actions',{id:'happy',updated:now,items});
 const best=h.q['#staxx-hub-best'];
 assert.equal(best.children.find(x=>x.dataset.openAlertId)?.dataset.openAlertId,'gym-current');
 assert.equal(h.q['#staxx-hub-source-status'].children.length,3);
 assert.ok(h.q['#staxx-hub-source-status'].children.some(x=>x.className.includes('fresh')));
 const mark=best.children.find(x=>x.dataset.reviewId==='gym-current');
 assert.ok(mark,'routine best recommendation should have its own check button');
 h.root.fire('click',mark);
 assert.equal(best.children.find(x=>x.dataset.openAlertId)?.dataset.openAlertId,'gym-soon');
 assert.match(h.q['#staxx-hub-task-filters'].children.find(x=>x.dataset.taskFilter==='all').textContent,/Pending · 1/);
 const checked=h.q['#staxx-hub-task-filters'].children.find(x=>x.dataset.taskFilter==='reviewed');
 assert.match(checked.textContent,/Checked · 1/);
 h.root.fire('click',checked);
 assert.ok(h.q['#staxx-hub-tasks'].children.some(x=>x.dataset.openAlertId==='gym-current'));
 assert.ok(!h.q['#staxx-hub-tasks'].children.some(x=>x.dataset.openAlertId==='gym-soon'));
 h.emit('staxx:actions',{id:'happy',updated:now+1000,items:[
   {...items[0],detail:'Energy changed after refresh'},items[1]
 ]});
 assert.match(h.q['#staxx-hub-task-filters'].children.find(x=>x.dataset.taskFilter==='reviewed').textContent,/Checked · 0/);
 h.root.fire('click',h.q['#staxx-hub-task-filters'].children.find(x=>x.dataset.taskFilter==='all'));
 assert.equal(best.children.find(x=>x.dataset.openAlertId)?.dataset.openAlertId,'gym-current');
 h.emit('staxx:actions',{id:'happy',updated:now+2000,items:[{id:'gym-urgent',title:'Urgent recovery',status:'urgent',priority:100}]});
 assert.equal(best.children.find(x=>x.dataset.openAlertId)?.dataset.openAlertId,'gym-urgent');
 assert.ok(!best.children.some(x=>x.dataset.reviewId==='gym-urgent'),'urgent recommendations must stay visible');
});

test('3.3 first fresh source report establishes a baseline; later new and changed items stand out',()=>{
 const h=fixture(),now=Date.now();h.emit('staxx:register',{id:'profit'});
 h.emit('staxx:actions',{id:'profit',updated:now,items:[{id:'stock-a',title:'Review owned stock',status:'review',detail:'One visible position'}]});
 assert.equal(h.q['#staxx-hub-changes'].children.length,0,'first report cannot invent historical changes');
 h.emit('staxx:actions',{id:'profit',updated:now+1,items:[
   {id:'stock-a',title:'Review owned stock',status:'review',detail:'Fresh quote changed'},
   {id:'stock-b',title:'Review new item',status:'soon',detail:'Observed opportunity'}
 ]});
 const changed=h.q['#staxx-hub-changes'];
 assert.equal(changed.children.length,1);
 const buttons=changed.children[0].children.filter(x=>x.tag==='button');
 assert.ok(buttons.some(x=>/UPDATED/.test(x.textContent)));
 assert.ok(buttons.some(x=>/NEW/.test(x.textContent)));
 h.root.fire('click',buttons.find(x=>x.dataset.changeClear));
 assert.equal(changed.children.length,0);
 h.emit('staxx:actions',{id:'profit',updated:now+2,items:[
   {id:'stock-a',title:'Review owned stock',status:'review',detail:'Fresh quote changed'},
   {id:'stock-b',title:'Review new item',status:'soon',detail:'Observed opportunity'}
 ]});
 assert.equal(changed.children.length,0,'same refreshed evidence must not recreate cleared highlights');
});
test('3.3 early warnings require real future due times and fresh actionable source data',()=>{
 const h=fixture(),now=Date.now();h.emit('staxx:register',{id:'happy',freshnessMs:60000});
 h.emit('staxx:actions',{id:'happy',updated:now,items:[
   {id:'xanax-soon',title:'Review cooldown',status:'soon',dueAt:now+20*60000},
   {id:'optional-later',title:'Read gym information',status:'optional',dueAt:now+10*60000},
   {id:'no-clock',title:'No actual due time',status:'now'}
 ]});
 const early=h.q['#staxx-hub-early'];
 assert.equal(early.children.length,1);
 assert.ok(early.children[0].children.some(x=>x.dataset.openAlertId==='xanax-soon'));
 assert.ok(!early.children[0].children.some(x=>x.dataset.openAlertId==='optional-later'));
 const clock=h.q['#staxx-hub-tasks'].children.find(x=>x.dataset.reviewId==='xanax-soon');
 h.root.fire('click',clock);
 assert.ok(early.children[0].children.some(x=>x.dataset.openAlertId==='xanax-soon'),
  'checking advice never silences a timed heads-up');
 h.emit('staxx:actions',{id:'happy',updated:now-900000,items:[
   {id:'xanax-soon',title:'Old cooldown',status:'soon',dueAt:now+20*60000}
 ]});
 assert.equal(early.children.length,0,'stale source cannot generate imminent warnings');
});
test('3.3 explicit relevance votes are bounded to priority within the same urgency and due order',()=>{
 const h=fixture(),now=Date.now();h.emit('staxx:register',{id:'profit',freshnessMs:900000});
 h.emit('staxx:actions',{id:'profit',updated:now,items:[
   {id:'high',title:'High priority',status:'now',priority:50},
   {id:'low',title:'Lower priority',status:'now',priority:43}
 ]});
 let rows=h.q['#staxx-hub-tasks'].children.filter(x=>x.dataset.openAlertId);
 assert.equal(rows[0].dataset.openAlertId,'high');
 const less=h.q['#staxx-hub-tasks'].children.flatMap(x=>x.children||[]).find(x=>x.dataset.voteId==='high'&&x.dataset.voteValue==='-1');
 h.root.fire('click',less);
 assert.equal(JSON.parse(h.local.getItem('staxx-hub-feedback-v1')||'{}')['profit/high']?.vote,-1,'feedback is stored only on this device');
 rows=h.q['#staxx-hub-tasks'].children.filter(x=>x.dataset.openAlertId);
 assert.equal(rows[0].dataset.openAlertId,'low');
 h.emit('staxx:actions',{id:'profit',updated:now+1,items:[
   {id:'high',title:'High priority',status:'now',priority:50},
   {id:'low',title:'Lower priority',status:'now',priority:43},
   {id:'urgent',title:'Urgent',status:'urgent',priority:0}
 ]});
 rows=h.q['#staxx-hub-tasks'].children.filter(x=>x.dataset.openAlertId);
 assert.equal(rows[0].dataset.openAlertId,'urgent','feedback cannot outrank source urgency');
});
test('3.3 local UK-day evidence report never merges verified, observed and manual records',()=>{
 const h=fixture(),now=Date.now();h.emit('staxx:register',{id:'happy'});
 h.emit('staxx:activity',{id:'happy',events:[
   {id:'gym-real',source:'api',at:now-1000,title:'Verified gym log'},
   {id:'snapshot-real',source:'snapshot',at:now-900,title:'Observed stat difference'},
   {id:'note-real',source:'recorded',at:now-800,title:'Manual note'}
 ]});
 const daily=h.q['#staxx-hub-daily'].children[0];
 assert.ok(daily.children.some(x=>/UK TIME/.test(x.textContent)));
 const card=daily.children.find(x=>x.className==='staxx-overview-card'&&x.children[0]?.textContent==='Happy Jump');
 assert.ok(card);
 assert.match(card.children[1].textContent,/Verified Torn logs: 1/);
 assert.match(card.children[1].textContent,/Observed changes: 1/);
 assert.match(card.children[1].textContent,/Locally recorded: 1/);
});
test('3.3 context shortcut targets a verified section and leaves the native page alone',()=>{
 const h=fixture();h.loc.pathname='/gym.php';
 h.emit('staxx:register',{id:'happy'});
 const panel=h.q['#staxx-hub-page-shortcut'].children[0];
 assert.ok(panel);
 const go=panel.children.find(x=>x.dataset.hubSectionTool==='happy');
 assert.ok(go);
 assert.equal(go.dataset.hubSectionTab,'today');
 h.loc.pathname='/unknown.php';
 h.emit('staxx:actions',{id:'happy',updated:Date.now(),items:[]});
 assert.equal(h.q['#staxx-hub-page-shortcut'].children.length,0);
});
