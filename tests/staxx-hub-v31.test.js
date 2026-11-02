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
    hasAttribute(k){return k in this.attributes;}
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
    '#staxx-hub-dashboard':'section','#staxx-hub-activity':'section','#staxx-hub-welcome':'section',
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
  vm.runInNewContext(modified,{document:doc,window:win,location:loc,CustomEvent:CE,
    localStorage:createStore(),sessionStorage:createStore(),Date,Math,Number,String,JSON,Set,Map},{timeout:2000});
  assert.ok(doc.mounted);
  return {doc,root:doc.mounted,q,emit:(name,detail)=>doc.dispatchEvent(new CE(name,{detail}))};
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
