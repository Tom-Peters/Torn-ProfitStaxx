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
      this.classList={toggle:(k,on)=>{if(on)classes.add(k);else classes.delete(k);},contains:k=>classes.has(k)};
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
    '#staxx-hub-tools':'div','#staxx-hub-alerts':'div','#staxx-hub-count':'span',
    '#staxx-hub-overview':'section','[data-overview]':'button','[data-arrange]':'button','#staxx-hub-total':'span'
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
      const c=new Set();this.classList={toggle:(key,yes)=>yes?c.add(key):c.delete(key),contains:key=>c.has(key)};
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
    '#staxx-hub-tools':'div','#staxx-hub-alerts':'div','#staxx-hub-count':'span',
    '#staxx-hub-overview':'section','[data-overview]':'button','[data-arrange]':'button','#staxx-hub-total':'span'
  }))q[name]=new Element(tag);
  q["[data-overview]"].setAttribute("data-overview","");
  q["[data-arrange]"].setAttribute("data-arrange","");
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
  vm.runInNewContext(injected,{document:doc,window:w,location:loc,CustomEvent:CE,localStorage:store(),sessionStorage:store(),Date,Math,JSON,Number,String,Set},{timeout:1000});
  assert.ok(doc.mounted);
  return {document:doc,root:doc.mounted,q,emit:(name,detail)=>doc.dispatchEvent(new CE(name,{detail}))};
}
test('v2.2 hub is bundled in ProfitStaxx and has narrower side panel',()=>{
  assert.match(main,/StaxxHub v2\.2/);
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
  assert.equal(h.q['#staxx-hub-tools'].children.length,4);
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
  assert.equal(h.q['#staxx-hub-overview'].children[0].children[1].textContent,'Recent scan');
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
  const companyCard=h.q['#staxx-hub-overview'].children[1];
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
