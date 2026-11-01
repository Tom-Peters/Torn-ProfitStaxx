// ==UserScript==
// @name         ProfitStaxx - Torn Trading Intelligence
// @namespace    https://github.com/Tom-Peters/Torn-ProfitStaxx
// @homepageURL  https://github.com/Tom-Peters/Torn-ProfitStaxx
// @supportURL   https://github.com/Tom-Peters/Torn-ProfitStaxx/issues
// @version      1.12.0
// @description  Torn stock benefits, market deals, passive income scenarios and manual income ledger for TornPDA.
// @author       IamEEKY
// @match        https://www.torn.com/*
// @match        https://torn.com/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @connect      www.torn-tracker.com
// @updateURL    https://raw.githubusercontent.com/Tom-Peters/Torn-ProfitStaxx/main/ProfitStaxx.user.js
// @downloadURL  https://raw.githubusercontent.com/Tom-Peters/Torn-ProfitStaxx/main/ProfitStaxx.user.js
// ==/UserScript==
/* StaxxHub v2.5 · shared Torn PDA launcher · IamEEKY · no external dependencies */
(function () {
  "use strict";
  if (typeof location === "undefined" || typeof document === "undefined" ||
      !document.documentElement || typeof document.createElement !== "function" ||
      !/^(www\.)?torn\.com$/i.test(location.hostname) || window.top !== window.self) return;
  function startHub() {
    if (document.getElementById("staxx-hub-root")) return;
    const root = document.createElement("div");
    root.id = "staxx-hub-root";
    root.innerHTML =
      '<button type="button" id="staxx-hub-toggle" aria-label="Open Staxx tools" aria-expanded="false"><b>S</b><span id="staxx-hub-count" hidden></span></button>' +
      '<div id="staxx-hub-veil" hidden></div>' +
      '<aside id="staxx-hub-drawer" aria-label="Staxx tools and notifications" hidden>' +
      '<header class="staxx-head"><div><strong>Staxx<span>Hub</span></strong><small>YOUR TORN COMMAND CENTRE</small></div><button type="button" data-hub-close aria-label="Close sidebar">×</button></header>' +
      '<div class="staxx-scroll"><button class="staxx-overview-switch" type="button" data-overview>▦ &nbsp; Daily dashboard · all tools</button>' +
      '<button class="staxx-overview-switch" type="button" data-diagnostics>⚙ &nbsp; Tool diagnostics</button><section id="staxx-hub-diagnostics" hidden></section>' +
      '<section id="staxx-hub-overview" hidden></section><button class="staxx-context-control" type="button" data-context-toggle>On-page guidance: On</button><div class="staxx-label"><h3>WHAT TO DO NEXT</h3><span>Prioritised</span></div><section id="staxx-hub-tasks" aria-label="Prioritised Torn actions"></section><div class="staxx-label"><h3>YOUR TOOLS</h3><button type="button" data-arrange aria-pressed="false">Reorder</button></div><div id="staxx-hub-tools"></div>' +
      '<div class="staxx-label"><h3>NOTIFICATIONS</h3><span id="staxx-hub-total"></span></div>' +
      '<div id="staxx-hub-alerts"></div><p class="staxx-foot">Read-only signals · Alerts use last known data · Drag the S tab vertically to reposition</p>' +
      '</div></aside>';
    const css = document.createElement("style");
    css.id = "staxx-hub-css";
    css.textContent = [
      '#staxx-hub-root{position:fixed!important;inset:0!important;z-index:2147483647!important;pointer-events:none!important;font:14px/1.45 system-ui,-apple-system,Segoe UI,sans-serif!important;color:#e7f2ff!important}',
      '#staxx-hub-root *{box-sizing:border-box}#staxx-hub-root [hidden]{display:none!important}#staxx-hub-root button{font:inherit;color:inherit;cursor:pointer}',
      '#staxx-hub-root button:focus-visible{outline:2px solid #73dfff;outline-offset:2px}',
      '#staxx-hub-toggle{position:fixed;left:5px;top:43%;width:43px;height:49px;pointer-events:auto;border:1px solid #69dfff99;border-radius:0 13px 13px 0;background:linear-gradient(150deg,#0b74ba,#082a4a);box-shadow:0 6px 24px #000b;align-items:center;justify-content:center;touch-action:none;user-select:none}',
      '#staxx-hub-toggle b{font-size:22px;font-weight:900;color:#baf1ff}#staxx-hub-count{position:absolute;top:-8px;right:-8px;padding:2px 5px;min-width:20px;border-radius:14px;background:#38cfa9;border:2px solid #08192d;color:#062821;font-size:11px;font-weight:900}',
      '#staxx-hub-toggle.staxx-urgent{border-color:#ff778d;background:linear-gradient(150deg,#a83b54,#4b1734)}#staxx-hub-toggle.staxx-urgent #staxx-hub-count{background:#ff6b83;color:#fff}',
      '#staxx-hub-toggle.staxx-warning{border-color:#ffd17e;background:linear-gradient(150deg,#9b5b19,#433322)}#staxx-hub-toggle.staxx-warning #staxx-hub-count{background:#ffd17e;color:#32220a}',
      '#staxx-hub-veil{position:fixed;inset:0;pointer-events:auto;background:#020a17ba}',
      '#staxx-hub-drawer{position:fixed;inset:0 auto 0 0;width:min(302px,calc(100vw - 36px));height:100vh;height:100dvh;pointer-events:auto;background:#08192d;border-right:1px solid #28506e;box-shadow:10px 0 45px #000b;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top)}',
      '#staxx-hub-drawer .staxx-head{display:flex;align-items:center;justify-content:space-between;padding:15px 13px;background:linear-gradient(120deg,#0c3358,#0b203b);border-bottom:1px solid #28506e;flex-shrink:0}',
      '#staxx-hub-drawer .staxx-head strong{display:block;font-size:20px;font-weight:850;letter-spacing:-.4px}#staxx-hub-drawer .staxx-head strong span{color:#54d7fa}',
      '#staxx-hub-drawer .staxx-head small{font-size:9px;letter-spacing:1px;color:#8fabca}',
      '#staxx-hub-drawer [data-hub-close]{background:#1c3b59;border:0;border-radius:9px;width:34px;height:34px;font-size:24px}',
      '#staxx-hub-drawer .staxx-scroll{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:12px 10px 26px}',
      '#staxx-hub-drawer h3{color:#8faec9;font-size:10px;letter-spacing:1.1px;margin:9px 4px 10px}',
      '#staxx-hub-drawer .staxx-overview-switch{width:100%;text-align:left;background:linear-gradient(120deg,#124a71,#0c2d4b);border:1px solid #4384ad;border-radius:10px;padding:11px;margin-bottom:10px;font-weight:750}',
      '#staxx-hub-drawer .staxx-overview-switch.selected{border-color:#71d9fd;background:#19527b}',
      '#staxx-hub-drawer .staxx-toolrow{display:flex;align-items:center;gap:4px;margin-bottom:8px}#staxx-hub-drawer .staxx-toolrow .staxx-tool{margin-bottom:0;flex:1;min-width:0}#staxx-hub-drawer .staxx-move{height:31px;width:27px;flex:0 0 27px;border-radius:7px;background:#1a4364;border:1px solid #416c8e;color:#ccecff;font-weight:900}#staxx-hub-drawer .staxx-move:disabled{opacity:.25}#staxx-hub-drawer .staxx-tool{display:flex;align-items:center;gap:8px;text-align:left;width:100%;background:#102844;border:1px solid #284b6b;border-radius:11px;padding:10px 8px;min-height:62px;margin-bottom:8px}',
      '#staxx-hub-drawer .staxx-icon{width:35px;height:35px;display:grid;place-items:center;border-radius:9px;background:linear-gradient(135deg,#0b79b9,#123c65);border:1px solid #4f9dc8;color:#cff6ff;font-weight:900;flex-shrink:0;font-size:12px}',
      '#staxx-hub-drawer .staxx-info{flex:1;min-width:0}#staxx-hub-drawer .staxx-info b{display:block;font-size:13px}#staxx-hub-drawer .staxx-info small{display:block;font-size:10px;color:#94b1c9;margin-top:3px;overflow-wrap:anywhere}',
      '#staxx-hub-drawer .staxx-pill{border-radius:14px;background:#1b486c;padding:2px 6px;font-size:11px;font-weight:800;color:#bdeaff}#staxx-hub-drawer .staxx-pill.on{background:#145f58;color:#89edca}',
      '#staxx-hub-drawer .staxx-label{display:flex;align-items:center;justify-content:space-between;margin-top:15px}#staxx-hub-drawer .staxx-label span{color:#a4c1d8;font-size:10px}#staxx-hub-drawer .staxx-label button{background:#173958;border:1px solid #365b79;border-radius:8px;padding:5px 9px;font-size:10px}#staxx-hub-drawer .staxx-label button[aria-pressed="true"]{background:#175f91;color:#fff}',
      '#staxx-hub-drawer .staxx-alert{background:#0e2945;border:1px solid #315977;border-radius:10px;padding:10px;margin-bottom:9px}',
      '#staxx-hub-drawer .staxx-alert.urgent{border-color:#e56785}#staxx-hub-drawer .staxx-alert.warning{border-color:#ae8450}',
      '#staxx-hub-drawer .staxx-alert-title{border:0;background:none;padding:0;text-align:left;width:100%;font-size:12px;font-weight:750;color:#81dbfa!important}',
      '#staxx-hub-drawer .staxx-alert.urgent .staxx-alert-title{color:#ff9bad!important}',
      '#staxx-hub-drawer .staxx-alert span{display:block;color:#daecf9;font-size:12px;margin:5px 0;overflow-wrap:anywhere}',
      '#staxx-hub-drawer .staxx-alert small{display:block;color:#91aec6;font-size:11px;margin:4px 0}',
      '#staxx-hub-drawer .staxx-alert-item{display:block;width:100%;margin:7px 0 3px;padding:9px 10px;background:#123c60;border:1px solid #427b9f;color:#e3f5ff;border-radius:8px;text-align:left;font-size:12px;font-weight:750;line-height:1.35;min-height:38px}#staxx-hub-drawer .staxx-alert-item:focus-visible{outline:2px solid #54d7fa}#staxx-hub-drawer .staxx-alert-description{padding:0 3px 3px}',
      '#staxx-hub-drawer .staxx-alert-actions{display:flex;gap:7px;margin-top:10px}',
      '#staxx-hub-drawer .staxx-snooze-menu{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}#staxx-hub-drawer .staxx-snooze-menu button{background:#174463;border:1px solid #3e7593;border-radius:7px;padding:6px 8px;min-height:32px;font-size:11px}#staxx-hub-drawer .staxx-snooze-menu input{background:#071d32;border:1px solid #527b9b;border-radius:7px;color:#fff;min-width:56px;width:64px;padding:6px;font-size:12px}#staxx-hub-drawer .staxx-snooze-menu label{display:flex;align-items:center;gap:4px;color:#bfd9ec;font-size:11px}#staxx-hub-drawer .staxx-due{font-size:11px;color:#b8e4ff!important;font-weight:700}#staxx-hub-drawer .staxx-spark{display:flex;align-items:end;gap:3px;height:40px;margin:11px 0 4px}#staxx-hub-drawer .staxx-spark span{flex:1;min-width:0;max-width:30px;border-radius:3px 3px 0 0;background:linear-gradient(#50d5f8,#17649c)}#staxx-hub-drawer .staxx-spark span.missing{background:#1e3a52;height:3px!important}#staxx-hub-drawer .staxx-trendnote{font-size:10px!important;color:#9ab5cf!important}#staxx-hub-drawer .staxx-alert-actions button{background:#1c3e5b;border:1px solid #365978;border-radius:8px;padding:6px 9px;font-size:11px;flex:1;min-height:32px}',
      '#staxx-hub-drawer .staxx-empty{color:#9db7cd;background:#0c243e;border:1px dashed #305473;border-radius:10px;font-size:11px;padding:14px 10px}',
      '#staxx-hub-drawer .staxx-overview-card{background:#0d2945;border:1px solid #2d5574;border-radius:11px;padding:11px;margin-bottom:8px}',
      '#staxx-hub-drawer .staxx-overview-card b{color:#83dbfa;font-size:12px}#staxx-hub-drawer .staxx-overview-card p{margin:5px 0;color:#d4eafa;font-size:11px}',
      '#staxx-hub-drawer .staxx-overview-card dl{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0 0}',
      '#staxx-hub-drawer .staxx-overview-card dt{font-size:10px;color:#96b6cf}#staxx-hub-drawer .staxx-overview-card dd{font-size:13px;font-weight:750;margin:0;overflow-wrap:anywhere}',
      '#staxx-hub-drawer .staxx-task{width:100%;text-align:left;display:block;border:1px solid #315b79;border-radius:10px;background:#102b46;color:#eef8ff;padding:10px;margin-bottom:8px;line-height:1.45}#staxx-hub-drawer .staxx-task.urgent{border-color:#e56785}#staxx-hub-drawer .staxx-task.soon{border-color:#ae8450}#staxx-hub-drawer .staxx-task b{display:block;font-size:12px}#staxx-hub-drawer .staxx-task small{display:block;font-size:10px;color:#8fb7d2;margin-top:4px}#staxx-hub-drawer .staxx-task .staxx-step{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.4px;color:#67dfff;margin-bottom:4px}#staxx-hub-drawer .staxx-task:focus-visible{outline:2px solid #67dfff}',
      '#staxx-hub-drawer .staxx-foot{font-size:10px;color:#6d90ab;margin-top:17px}#staxx-hub-drawer .staxx-diagnostic-actions{display:flex;gap:8px;margin-bottom:12px}#staxx-hub-drawer .staxx-diagnostic-actions button{flex:1;background:#17496d;border:1px solid #3e789f;border-radius:8px;padding:9px;font-size:11px}#staxx-hub-drawer #staxx-safe-report{width:100%;min-height:130px;white-space:pre;color:#cfeeff;background:#091f34;border:1px solid #5182a3;border-radius:8px;font-size:10px}'
    ].join("");
    css.textContent += '#staxx-hub-drawer .staxx-context-control{display:block;width:100%;background:#0b314e;color:#8bdffc;border:1px solid #315775;border-radius:9px;padding:8px;margin:7px 0 14px;text-align:left}' +
      '#staxx-page-tip{box-sizing:border-box;display:flex;flex-wrap:wrap;gap:7px;align-items:center;background:#0c2944;color:#e9f5ff;border:1px solid #345f7d;border-left:4px solid #54d7fa;border-radius:9px;padding:10px 12px;margin:10px 0;font:13px/1.4 system-ui,Arial,sans-serif;max-width:100%}' +
      '#staxx-page-tip strong{color:#84e0fb}#staxx-page-tip small{color:#a9cce5;flex-basis:100%}' +
      '#staxx-page-tip button{background:#0879bd;color:#fff;border:1px solid #69cef5;border-radius:8px;padding:7px 10px;font:inherit;font-weight:700;cursor:pointer}';
    document.documentElement.append(css, root);

    const entries = [
      {id:"profit",label:"ProfitStaxx",icon:"PS",desc:"Markets · Stocks · Income"},
      {id:"company",label:"Company Helper",icon:"CO",desc:"Staff · Training · Growth"},
      {id:"happy",label:"Happy Jump",icon:"HJ",desc:"Gym · Schedule · Recovery"}
    ];
    const active = Object.create(null), notices = Object.create(null), summaries = Object.create(null), controls = Object.create(null), actionSets=Object.create(null), healthReports=Object.create(null);
    const registeredAt=Object.create(null);
    let trends=Object.create(null), arrangeShown=false;
    const toggle=root.querySelector("#staxx-hub-toggle"),veil=root.querySelector("#staxx-hub-veil"),drawer=root.querySelector("#staxx-hub-drawer");
    const tools=root.querySelector("#staxx-hub-tools"),alerts=root.querySelector("#staxx-hub-alerts"),bubble=root.querySelector("#staxx-hub-count");
    const overview=root.querySelector("#staxx-hub-overview"),overviewButton=root.querySelector("[data-overview]"),taskList=root.querySelector("#staxx-hub-tasks"),diagnostics=root.querySelector("#staxx-hub-diagnostics"),diagnosticButton=root.querySelector("[data-diagnostics]");
    let expanded=false, panelOpen=false, overviewShown=false, diagnosticsShown=false, moving=null, suppressClickUntil=0;
    const openPanels=new Set();
    const idOk = v=>typeof v==="string" && /^[a-z][a-z0-9-]{0,31}$/.test(v);
    function node(tag,cls,value) {const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=String(value);return e;}
    function safeRead(key, fallback) {try {const v=JSON.parse(localStorage.getItem(key)||"null");return v===null?fallback:v;}catch(_){return fallback;}}
    function saveLocal(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch(_){}}
    function remember(){
      try{sessionStorage.setItem("staxx-hub-state-v2",JSON.stringify({at:Date.now(),notices,summaries,actionSets}));}catch(_){}
    }
    try {
      const known=safeRead("staxx-hub-registry-v2",[]);
      if(Array.isArray(known))for(const e of known.slice(0,25)){
        if(idOk(e.id)&&!entries.some(x=>x.id===e.id))entries.push({id:e.id,label:String(e.label||e.id).slice(0,40),icon:String(e.icon||"S").slice(0,3),desc:String(e.desc||"Staxx tool").slice(0,70)});
      }
    }catch(_){}
    try {
      const old=JSON.parse(sessionStorage.getItem("staxx-hub-state-v2")||"null");
      if(old&&Date.now()-old.at<4*3600000){
        for(const id of Object.keys(old.notices||{}))if(idOk(id)){const n=old.notices[id];if(n&&Number(n.count)>=0)notices[id]=Object.assign({},n,{cached:true});}
        for(const id of Object.keys(old.summaries||{}))if(idOk(id)){const d=old.summaries[id];if(d&&typeof d==="object")summaries[id]=d;}
        for(const id of Object.keys(old.actionSets||{}))if(idOk(id)){const d=old.actionSets[id];if(d&&Array.isArray(d.items))actionSets[id]={items:d.items.slice(0,8),updated:d.updated,cached:true};}
      }
    }catch(_){}
    for(const e of entries)controls[e.id]=safeRead("staxx-hub-alert-control-"+e.id,{});
    const savedOrder=safeRead("staxx-hub-order-v3",[]);
    if(Array.isArray(savedOrder)){
      entries.sort((a,b)=>{
        const ai=savedOrder.indexOf(a.id),bi=savedOrder.indexOf(b.id);
        return (ai<0?1000:ai)-(bi<0?1000:bi);
      });
    }
    const savedTrends=safeRead("staxx-hub-trends-v3",{});
    if(savedTrends&&typeof savedTrends==="object"&&!Array.isArray(savedTrends))trends=savedTrends;
    const pos=safeRead("staxx-hub-position-v2",0.43);
    function position(value) {
      const height=Math.max(160,window.innerHeight||600),buttonHeight=49;
      const top=Math.max(18,Math.min(height-buttonHeight-18,Math.round(height*Math.max(0,Math.min(1,Number(value)||0)))));
      toggle.style.top=top+"px";
      return top/height;
    }
    position(typeof pos==="number"?pos:0.43);
    function launcherVisibility(){
      const hide=expanded||panelOpen;
      toggle.hidden=hide;
      toggle.style.setProperty("display",hide?"none":"flex","important");
      toggle.style.setProperty("pointer-events",hide?"none":"auto","important");
      toggle.setAttribute("aria-expanded",String(expanded));
    }
    function setExpanded(value){
      expanded=Boolean(value);veil.hidden=drawer.hidden=!expanded;launcherVisibility();renderContext();
    }
    function activeNotice(id){
      const n=notices[id];if(!n||!(n.count>0))return null;
      const control=controls[id]||{};
      if(control.dismissed===n.fingerprint || Number(control.snoozeUntil)>Date.now())return null;
      return n;
    }
    function openTool(id,alertId){
      if(id==="company"&&!/^\/companies\.php$/i.test(location.pathname)){
        try{sessionStorage.setItem("staxx-open-company","1");if(alertId)sessionStorage.setItem("staxx-open-company-alert",alertId);}catch(_){}
        location.assign(location.origin+"/companies.php");return;
      }
      if(!active[id]){
        alerts.replaceChildren(node("p","staxx-empty","This tool is not active on this page. Enable its script in Torn PDA and reload."));
        return;
      }
      panelOpen=true;setExpanded(false);launcherVisibility();
      document.dispatchEvent(new CustomEvent("staxx:closeall"));
      document.dispatchEvent(new CustomEvent("staxx:open",{detail:{id,alertId:alertId||null}}));
    }
    function timeUntil(ms) {
      if(!Number.isFinite(ms)||ms<=0)return "";
      const diff=ms-Date.now(),minutes=Math.max(1,Math.ceil(Math.abs(diff)/60000));
      const text=minutes<60?minutes+"m":minutes<1440?Math.ceil(minutes/60)+"h":Math.ceil(minutes/1440)+"d";
      return diff<=0?"Overdue "+text: "Due in "+text;
    }
    function trendValue(value) {
      const match=String(value??"").replace(/,/g,"").trim().match(/^[$£]?\s*(-?\d+(?:\.\d+)?)\s*([kmb])?/i);
      if(!match)return null;
      const multiplier={k:1000,m:1000000,b:1000000000}[String(match[2]||"").toLowerCase()]||1;
      const n=Number(match[1])*multiplier;
      return Number.isFinite(n)?n:null;
    }
    const trendMetric={profit:"Fresh deals",company:"Star rating",happy:"24h projected gains"};
    const trendTitle={profit:"Fresh deals",company:"Company stars",happy:"24h projected gains (forecast)"};
    function dayKey(time){const d=new Date(time);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
    function recordTrend(id,entry) {
      const own=entries.find(x=>x.id===id);const key=own?.trendMetric||trendMetric[id]||entry?.metrics?.find(x=>trendValue(x.value)!==null)?.label;
      if(!key||!entry||!Array.isArray(entry.metrics))return;
      const metric=entry.metrics.find(x=>x.label===key);
      const timestamp=Number(entry.updated)||Date.now(),value=metric?trendValue(metric.value):null;
      if(value===null||timestamp>Date.now()+60000||Date.now()-timestamp>86400000)return;
      const list=Array.isArray(trends[id])?trends[id]:[];
      const day=dayKey(timestamp);
      const next=list.filter(x=>x&&typeof x.day==="string"&&x.day!==day&&Date.now()-Number(x.timestamp)<8*86400000);
      next.push({day,value,timestamp});next.sort((a,b)=>a.timestamp-b.timestamp);
      trends[id]=next.slice(-8);saveLocal("staxx-hub-trends-v3",trends);
    }
    function trendCard(id){
      const list=Array.isArray(trends[id])?trends[id]:[];
      if(!trendMetric[id]&&!entries.find(x=>x.id===id)?.trendMetric&&!(summaries[id]?.metrics||[]).some(x=>trendValue(x.value)!==null))return null;
      const wrap=node("div","staxx-trend");
      const title=node("small","staxx-trendnote","7-day trend · "+(entries.find(x=>x.id===id)?.trendMetric||trendTitle[id]||"first numeric summary metric")+" · observed snapshots");wrap.append(title);
      const bar=node("div","staxx-spark");
      const values=[];
      for(let offset=6;offset>=0;offset--){
        const time=new Date();time.setHours(12,0,0,0);time.setDate(time.getDate()-offset);
        const date=dayKey(time.getTime()),point=list.find(x=>x.day===date);values.push(point?point.value:null);
      }
      const max=Math.max(1,...values.filter(x=>x!==null).map(x=>Math.max(0,x)));
      for(const [i,value] of values.entries()){
        const b=node("span",value===null?"missing":"");
        b.style.height=value===null?"3px":Math.max(4,Math.min(40,Math.round(Math.max(0,value)/max*40)))+"px";
        b.title=(i===6?"Today":"Day "+(i+1))+" · "+(value===null?"Not recorded":String(value));
        bar.append(b);
      }
      wrap.append(bar);
      const recorded=values.filter(v=>v!==null);
      wrap.append(node("p","staxx-trendnote",recorded.length>1?
        "Change: "+(recorded.at(-1)-recorded[0]>0?"+":"")+String(Math.round((recorded.at(-1)-recorded[0])*100)/100)+" · "+recorded.length+"/7 recorded days":
        recorded.length+"/7 recorded days · comparison appears after two days"));
      return wrap;
    }

    // V2.5: everything registered through the normal Staxx event protocol joins the dashboard.
    // Never promote old or cross-page cached observations to a verified urgent instruction.
    function freshnessMs(id){
      const entry=entries.find(x=>x.id===id);
      return Math.max(60000,Math.min(86400000,Number(entry?.freshnessMs)||({profit:600000,company:86400000,happy:900000}[id]||3600000)));
    }
    function taskRowsV25(){
      const rows=[];
      for(const e of entries){
        const set=actionSets[e.id],control=controls[e.id]||{};
        if(!set||!Array.isArray(set.items)||Number(control.snoozeUntil)>Date.now())continue;
        const old=Boolean(set.cached)||!Number.isFinite(Number(set.updated))||Date.now()-Number(set.updated)>freshnessMs(e.id);
        for(const a of set.items)rows.push({...a,owner:e.id,tool:e.label,cached:old,updated:set.updated});
      }
      const rank={urgent:4,now:3,soon:2,review:1,optional:0};
      return rows.sort((a,b)=>Number(a.cached)-Number(b.cached)||
        (rank[b.status]??0)-(rank[a.status]??0)||
        (Number(a.dueAt)||Infinity)-(Number(b.dueAt)||Infinity)||
        (Number(b.priority)||0)-(Number(a.priority)||0));
    }
    function diagnosticReportV25(){
      const time=Date.now();
      return {hub:"2.5",capturedAt:new Date(time).toISOString(),page:String(location.pathname||""),
        connectedCount:entries.filter(x=>active[x.id]).length,knownCount:entries.length,tools:entries.map(e=>{
          const sum=summaries[e.id],actions=actionSets[e.id],notice=notices[e.id],h=healthReports[e.id];
          const age=Number(sum?.updated),lastAction=Number(actions?.updated);
          return {id:e.id,label:e.label,connected:Boolean(active[e.id]),registeredSecondsAgo:
            registeredAt[e.id]?Math.max(0,Math.floor((time-registeredAt[e.id])/1000)):null,
            summaryAgeMinutes:age>0?Math.max(0,Math.floor((time-age)/60000)):null,
            actionAgeMinutes:lastAction>0?Math.max(0,Math.floor((time-lastAction)/60000)):null,
            actionCount:Array.isArray(actions?.items)?actions.items.length:0,
            alertCount:Number(notice?.count)||0,
            stale:!actions||Boolean(actions.cached)||time-lastAction>freshnessMs(e.id),
            health:h?{version:h.version,api:h.api,storage:h.storage,ui:h.ui,detail:h.detail,observedAt:h.observedAt}:null};
        })};
    }
    function showDiagnosticsV25(){
      if(!diagnostics)return;
      diagnostics.replaceChildren();
      if(!diagnosticsShown){diagnostics.hidden=true;diagnosticButton.classList.remove("selected");return;}
      diagnostics.hidden=false;diagnosticButton.classList.add("selected");
      diagnostics.append(node("p","staxx-trendnote","Local health indicators only. No API keys, financial records, employee names, battle stats or personal IDs are collected in this report."));
      const buttons=node("div","staxx-diagnostic-actions"),check=node("button","","Check installed tools"),copy=node("button","","Copy safe report");
      check.type=copy.type="button";check.dataset.checkDiagnostics="1";copy.dataset.copyDiagnostics="1";
      buttons.append(check,copy);diagnostics.append(buttons);
      for(const row of diagnosticReportV25().tools){
        const card=node("div","staxx-overview-card");
        card.append(node("b","",row.label+" · "+(row.connected?"connected":"not running on this page")),
          node("p","",row.health?.version?"Version "+row.health.version:"Version not reported"),
          node("p","",row.health?"API "+row.health.api+" · Storage "+row.health.storage+" · UI "+row.health.ui:
            "No recent health response; open this tool or check whether it is enabled in TornPDA."),
          node("p","",row.stale?"Last action data stale or unverified":"Last action data within declared freshness window"),
          node("p","",row.actionCount+" recommendations · "+row.alertCount+" alerts"));
        if(row.health?.detail)card.append(node("small","staxx-trendnote",row.health.detail));
        diagnostics.append(card);
      }
      const output=node("textarea");output.id="staxx-safe-report";output.readOnly=true;output.hidden=true;
      output.value=JSON.stringify(diagnosticReportV25(),null,2);diagnostics.append(output);
    }

    function showOverview(){
      overview.replaceChildren();
      overview.append(node("p","staxx-trendnote","All registered tools automatically appear here, including future Staxx scripts. Stale suggestions are labelled and sorted after current data."));
      for(const [i,item] of taskRowsV25().slice(0,5).entries()){
        const row=node("button","staxx-task "+(!item.cached&&item.status==="urgent"?"urgent":""));
        row.dataset.openAlertTool=item.owner;row.dataset.openAlertId=item.id;
        row.append(node("span","staxx-step",(i+1)+" · "+item.tool+(item.cached?" · CHECK FRESHNESS":"")),node("b","",item.title));
        if(item.detail)row.append(node("small","",item.detail));overview.append(row);
      }
      for(const e of entries){
        const s=summaries[e.id],card=node("article","staxx-overview-card");
        card.append(node("b","",e.label),node("p","",s?.headline || (active[e.id]?"No verified figures yet":"Open tool for the latest figures")));
        const d=node("dl");
        for(const m of (Array.isArray(s?.metrics)?s.metrics:[]).slice(0,4)){
          const group=node("div");group.append(node("dt","",m.label),node("dd","",m.value));d.append(group);
        }
        if(d.childElementCount)card.append(d);
        const trend=trendCard(e.id);if(trend)card.append(trend);
        const btn=node("button","staxx-overview-switch","Open "+e.label);btn.dataset.openStaxx=e.id;card.append(btn);
        overview.append(card);
      }
      overview.hidden=!overviewShown;
      overviewButton.classList.toggle("selected",overviewShown);
      overviewButton.setAttribute("aria-expanded",String(overviewShown));
    }

    // Contextual, non-invasive Torn page tip. It never fills fields or performs gameplay.
    function currentContext(){
      const path=String(location.pathname||"").toLowerCase();
      if(path==="/gym.php")return {id:"happy",name:"Gym"};
      if(path==="/companies.php")return {id:"company",name:"Company"};
      if(path==="/page.php"&&/\bsid=itemmarket\b/i.test(String(location.search||"")))return {id:"profit",name:"Item Market"};
      if(path==="/page.php"&&/\bsid=stocks\b/i.test(String(location.search||"")))return {id:"profit",name:"Stock Market"};
      return null;
    }
    function contextEnabled(){return safeRead("staxx-hub-context-v1",true)!==false;}
    function renderContext(){
      const old=document.getElementById("staxx-page-tip");
      const control=root.querySelector("[data-context-toggle]");
      if(control){control.textContent="On-page guidance: "+(contextEnabled()?"On":"Off");
        control.setAttribute("aria-pressed",String(contextEnabled()));}
      const ctx=currentContext();
      if(!ctx||!contextEnabled()||!active[ctx.id]||openPanels.size||panelOpen||expanded){
        if(old)old.remove();return;
      }
      const anchor=document.querySelector?.("#gymroot h1, #mainContainer h1, .content-wrapper h1, h1");
      if(!anchor||typeof anchor.insertAdjacentElement!=="function"){if(old)old.remove();return;}
      const set=actionSets[ctx.id],fresh=set&&!set.cached&&Date.now()-Number(set.updated)<(ctx.id==="company"?86400000:ctx.id==="happy"?900000:480000);
      const ranks={urgent:5,now:4,soon:3,review:2,optional:1};
      const items=fresh&&Array.isArray(set.items)?set.items.slice().sort((a,b)=>(ranks[b.status]||0)-(ranks[a.status]||0)||(b.priority||0)-(a.priority||0)):[];
      const first=items[0];
      const title=first?first.title:"Check "+ctx.name+" recommendations";
      const detail=first?first.detail:"Open the tool to verify current data before taking action.";
      // Reuse existing element to avoid mutating Torn's DOM during every heartbeat.
      const fingerprint=ctx.id+"|"+title+"|"+detail+"|"+String(first?.id||"");
      if(old&&old.dataset.fingerprint===fingerprint&&old.previousElementSibling===anchor)return;
      if(old)old.remove();
      const bar=node("div");bar.id="staxx-page-tip";bar.dataset.fingerprint=fingerprint;
      bar.setAttribute("role","region");bar.setAttribute("aria-label","Staxx contextual guidance");
      const heading=node("strong","",ctx.name+" · "+(first?"NEXT ACTION":"STAXX"));
      const message=node("span","",title),sub=node("small","",detail);
      const button=node("button","",first?"Review action ›":"Open "+ctx.name+" tool ›");
      button.type="button";button.addEventListener("click",()=>openTool(ctx.id,first?.id||null));
      bar.append(heading,message,button,sub);
      anchor.insertAdjacentElement("afterend",bar);
    }
    function renderTasks(){
      if(!taskList)return;
      taskList.replaceChildren();
      const rows=taskRowsV25();
      for(const item of rows.slice(0,6)){
        const btn=node("button","staxx-task "+(!item.cached&&item.status==="urgent"?"urgent":!item.cached&&item.status==="soon"?"soon":""));
        btn.type="button";btn.dataset.openAlertTool=item.owner;btn.dataset.openAlertId=item.id;
        btn.append(node("span","staxx-step",(item.cached?"LAST OBSERVED · ":"")+(item.status==="urgent"?"ACT NOW":item.status==="now"?"DO NEXT":item.status==="soon"?"UPCOMING":item.status==="review"?"REVIEW":"OPTIONAL")+" · "+item.tool),
          node("b","",item.title));
        if(item.detail)btn.append(node("small","",item.detail));
        if(item.dueAt)btn.append(node("small","",timeUntil(item.dueAt)));
        if(item.cached)btn.append(node("small","","Verify current Torn data before acting"));
        taskList.append(btn);
      }
      if(!rows.length)taskList.append(node("p","staxx-empty","No verified next steps yet. Open a tool to refresh its data."));
      else if(rows.length>6)taskList.append(node("p","staxx-foot",String(rows.length-6)+" more recommendations inside your tools"));
    }
    function render(){
      tools.replaceChildren();alerts.replaceChildren();
      let total=0,maxLevel=0,visible=0,muted=0;
      for(const [index,e] of entries.entries()){
        const n=activeNotice(e.id),count=n?Math.min(99,Number(n.count)||0):0;
        total+=count;visible+=Number(count>0);
        if(n)maxLevel=Math.max(maxLevel,n.level==="urgent"?2:n.level==="warning"?1:0);
        if(!n && notices[e.id]?.count>0)muted++;
        const btn=node("button","staxx-tool");btn.type="button";btn.dataset.openStaxx=e.id;
        const info=node("span","staxx-info");info.append(node("b","",e.label),node("small","",active[e.id]?e.desc:"Enable script to open"));
        btn.append(node("span","staxx-icon",e.icon),info,node("span","staxx-pill"+(count?" on":""),count||"›"));
        if(arrangeShown){
          const row=node("div","staxx-toolrow"),up=node("button","staxx-move","↑"),down=node("button","staxx-move","↓");
          up.type=down.type="button";up.dataset.moveId=down.dataset.moveId=e.id;up.dataset.moveDir="-1";down.dataset.moveDir="1";
          up.disabled=index===0;down.disabled=index===entries.length-1;
          up.title="Move "+e.label+" up";down.title="Move "+e.label+" down";
          row.append(btn,up,down);tools.append(row);
        }else tools.append(btn);
      }
      toggle.classList.toggle("staxx-urgent",maxLevel===2);
      toggle.classList.toggle("staxx-warning",maxLevel===1);
      bubble.hidden=total===0;bubble.textContent=total>=100?"99+":String(total);
      toggle.setAttribute("aria-label",total?total+" Staxx notifications; open tools":"Open Staxx tools");
      root.querySelector("#staxx-hub-total").textContent=visible?visible+" tools":muted?muted+" muted":"All clear";
      for(const e of entries){
        const n=activeNotice(e.id);if(!n)continue;
        const card=node("div","staxx-alert "+n.level);
        const title=node("button","staxx-alert-title",e.label+" · "+n.count+" alert"+(n.count===1?"":"s"));
        title.type="button";title.dataset.openStaxx=e.id;card.append(title);
        card.append(node("span","",n.summary||"Needs attention"));
        if(Array.isArray(n.alerts)&&n.alerts.length){
          for(const item of n.alerts.slice(0,8)){
            const go=node("button","staxx-alert-item",item.title);
            go.type="button";go.dataset.openAlertTool=e.id;go.dataset.openAlertId=item.id;
            go.title=item.detail||item.title;
            card.append(go);
            if(item.detail)card.append(node("small","staxx-alert-description",item.detail));
          }
          if(n.alerts.length>8)card.append(node("small","",String(n.alerts.length-8)+" more — open the tool's Alerts tab"));
        }else for(const item of n.items.slice(0,2))card.append(node("small","",item));
        if(n.cached)card.append(node("small","","Last observed on a previous page"));
        if(n.dueAt){const countdown=node("small","staxx-due",timeUntil(n.dueAt));card.append(countdown);}
        const buttons=node("div","staxx-alert-actions");
        const dismiss=node("button","","Dismiss"),snooze=node("button","","Snooze ▾");
        dismiss.type=snooze.type="button";dismiss.dataset.dismissStaxx=e.id;snooze.dataset.snoozeStaxx=e.id;
        buttons.append(dismiss,snooze);card.append(buttons);
        const menu=node("div","staxx-snooze-menu");menu.hidden=true;
        for(const [minutes,label] of [[15,"15m"],[60,"1h"],[240,"4h"],[1440,"24h"]]){
          const option=node("button","",label);option.type="button";option.dataset.snoozeId=e.id;option.dataset.snoozeMinutes=String(minutes);menu.append(option);
        }
        const custom=node("label","","Custom");const input=node("input");input.type="number";input.min="1";input.max="10080";input.value="120";input.title="Snooze duration in minutes";
        const units=node("span","","min");custom.append(input,units);
        const set=node("button","","Set");set.type="button";set.dataset.snoozeCustom=e.id;menu.append(custom,set);
        card.append(menu);alerts.append(card);
      }
      if(!visible)alerts.append(node("p","staxx-empty",muted?"Alerts dismissed or snoozed. New alerts will still appear.":"Nothing needs your attention right now."));
      renderTasks();
      showOverview();
      showDiagnosticsV25();
      launcherVisibility();
      renderContext();
    }
    root.addEventListener("click",e=>{
      const b=e.target.closest("button");if(!b)return;
      if(b.dataset.contextToggle!==undefined){saveLocal("staxx-hub-context-v1",!contextEnabled());renderContext();return;}
      if(b.dataset.dismissStaxx){const id=b.dataset.dismissStaxx,n=notices[id];if(n){controls[id]={...controls[id],dismissed:n.fingerprint,snoozeUntil:0};saveLocal("staxx-hub-alert-control-"+id,controls[id]);render();}return;}
      if(b.dataset.snoozeStaxx){const menu=b.parentNode?.nextSibling;if(menu)menu.hidden=!menu.hidden;return;}
      if(b.dataset.snoozeId || b.dataset.snoozeCustom){
        const id=b.dataset.snoozeId||b.dataset.snoozeCustom;
        const minutes=b.dataset.snoozeCustom?Number(b.parentNode?.querySelector("input")?.value):Number(b.dataset.snoozeMinutes);
        if(!Number.isInteger(minutes)||minutes<1||minutes>10080)return;
        controls[id]={...controls[id],snoozeUntil:Date.now()+minutes*60000};
        saveLocal("staxx-hub-alert-control-"+id,controls[id]);render();return;
      }
      if(b.dataset.moveId){
        const from=entries.findIndex(x=>x.id===b.dataset.moveId),to=from+Number(b.dataset.moveDir);
        if(from>=0&&to>=0&&to<entries.length){
          const [entry]=entries.splice(from,1);entries.splice(to,0,entry);
          saveLocal("staxx-hub-order-v3",entries.map(x=>x.id));render();
        }return;
      }
      if(b.hasAttribute("data-arrange")){
        arrangeShown=!arrangeShown;b.setAttribute("aria-pressed",String(arrangeShown));b.textContent=arrangeShown?"Done":"Reorder";render();return;
      }
      if(b.dataset.openAlertTool){openTool(b.dataset.openAlertTool,b.dataset.openAlertId);return;}
      if(b.dataset.openStaxx){openTool(b.dataset.openStaxx);return;}
      if(b.hasAttribute("data-overview")){overviewShown=!overviewShown;if(overviewShown)diagnosticsShown=false;render();return;}
       if(b.hasAttribute("data-diagnostics")){diagnosticsShown=!diagnosticsShown;if(diagnosticsShown){overviewShown=false;
         document.dispatchEvent(new CustomEvent("staxx:diagnostics-request"));}render();return;}
       if(b.dataset.checkDiagnostics){document.dispatchEvent(new CustomEvent("staxx:ping"));
         document.dispatchEvent(new CustomEvent("staxx:diagnostics-request"));showDiagnosticsV25();return;}
       if(b.dataset.copyDiagnostics){const report=JSON.stringify(diagnosticReportV25(),null,2);
         const clipboard=window.navigator?.clipboard;
         if(clipboard?.writeText){clipboard.writeText(report).catch(()=>{const box=diagnostics.querySelector("#staxx-safe-report");if(box){box.hidden=false;box.value=report;}});}
         else{const box=diagnostics.querySelector("#staxx-safe-report");if(box){box.hidden=false;box.value=report;box.select?.();}}
         return;}
      if(b===toggle){if(Date.now()<suppressClickUntil)return;setExpanded(true);return;}
      if(b.hasAttribute("data-hub-close"))setExpanded(false);
    });
    veil.addEventListener("click",()=>setExpanded(false));
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&expanded)setExpanded(false);});
    toggle.addEventListener("pointerdown",e=>{
      if(e.button!==undefined&&e.button!==0)return;
      moving={id:e.pointerId,startY:e.clientY,top:toggle.getBoundingClientRect().top,dragged:false};
      try{toggle.setPointerCapture?.(e.pointerId);}catch(_){}
    });
    toggle.addEventListener("pointermove",e=>{
      if(!moving||e.pointerId!==moving.id)return;
      if(Math.abs(e.clientY-moving.startY)>7)moving.dragged=true;
      if(moving.dragged){const height=Math.max(160,window.innerHeight||600);
        const y=Math.max(18,Math.min(height-67,moving.top+e.clientY-moving.startY));
        toggle.style.top=Math.round(y)+"px";}
    });
    function endMove(e){if(!moving||e.pointerId!==moving.id)return;
      if(moving.dragged){suppressClickUntil=Date.now()+350;saveLocal("staxx-hub-position-v2",position((parseFloat(toggle.style.top)||0)/Math.max(1,window.innerHeight)));
        // Prevent a post-drag synthetic click from reopening the drawer.
        e.preventDefault?.();}
      moving=null;
    }
    toggle.addEventListener("pointerup",endMove);toggle.addEventListener("pointercancel",endMove);
    window.addEventListener("resize",()=>position(safeRead("staxx-hub-position-v2",0.43)));
    document.addEventListener("staxx:panel",e=>{
      if(!e.detail||!idOk(e.detail.id))return;
      if(e.detail.open){openPanels.add(e.detail.id);panelOpen=true;setExpanded(false);}
      else{openPanels.delete(e.detail.id);panelOpen=openPanels.size>0;launcherVisibility();}
      renderContext();
    });
    document.addEventListener("staxx:register",e=>{
      const d=e.detail||{},id=d.id;if(!idOk(id))return;
      let entry=entries.find(x=>x.id===id);
      if(!entry && entries.length<25){
        entry={id,label:String(d.label||id).slice(0,40),icon:String(d.icon||"S").slice(0,3),desc:String(d.desc||"Staxx tool").slice(0,70)};
        entries.push(entry);controls[id]=safeRead("staxx-hub-alert-control-"+id,{});
        saveLocal("staxx-hub-registry-v2",entries.slice(3));
      }
      if(entry){
        if(d.label)entry.label=String(d.label).slice(0,40);
        if(d.icon)entry.icon=String(d.icon).slice(0,3);
        if(d.desc)entry.desc=String(d.desc).slice(0,70);
        if(typeof d.trendMetric==='string')entry.trendMetric=d.trendMetric.slice(0,36);
        if(Number(d.freshnessMs)>=60000&&Number(d.freshnessMs)<=86400000)entry.freshnessMs=Number(d.freshnessMs);
        if(!registeredAt[id])registeredAt[id]=Date.now();
        active[id]=true;render();}
    });

    document.addEventListener("staxx:diagnostics",e=>{
      const d=e.detail||{},id=d.id;if(!idOk(id)||!entries.some(x=>x.id===id))return;
      const allow=(value,valid)=>valid.includes(value)?value:"unknown";
      healthReports[id]={version:String(d.version||"not-reported").slice(0,20),
        api:allow(d.api,["ready","stale","missing","error","unknown"]),
        storage:allow(d.storage,["ready","missing","error","unknown"]),
        ui:allow(d.ui,["ready","missing","error","unknown"]),
        detail:String(d.detail||"").replace(/[A-Za-z0-9]{20,}/g,"[redacted]").slice(0,110),
        observedAt:Date.now()};
      if(diagnosticsShown)showDiagnosticsV25();
    });
    document.addEventListener("staxx:notice",e=>{
      const d=e.detail||{},id=d.id;if(!idOk(id)||!entries.some(x=>x.id===id))return;
      const count=Math.min(99,Math.max(0,Math.floor(Number(d.count)||0)));
      const n={count,summary:String(d.summary||"").slice(0,180),
        items:Array.isArray(d.items)?d.items.slice(0,5).map(x=>String(x).slice(0,160)):[],
        level:["urgent","warning","info"].includes(d.level)?d.level:"info",cached:false};
      n.alerts=Array.isArray(d.alerts)?d.alerts.slice(0,30).filter(x=>x&&/^[a-z][a-z0-9-]{0,63}$/.test(String(x.id||""))).map(x=>({id:String(x.id),title:String(x.title||x.id).slice(0,100),detail:String(x.detail||"").slice(0,190)})):[];
      n.dueAt=Number.isFinite(Number(d.dueAt))&&Number(d.dueAt)>0?Number(d.dueAt):null;
      n.fingerprint=JSON.stringify([n.count,n.summary,n.items,n.alerts,n.level,n.dueAt]);
      if(JSON.stringify(notices[id])!==JSON.stringify(n)){notices[id]=n;remember();render();}
    });
    document.addEventListener("staxx:actions",e=>{
      const d=e.detail||{},id=d.id;if(!idOk(id)||!entries.some(x=>x.id===id))return;
      const items=Array.isArray(d.items)?d.items.slice(0,12).filter(a=>a&&/^[a-z][a-z0-9-]{0,63}$/.test(String(a.id||""))).map(a=>({
        id:String(a.id),title:String(a.title||"Review action").slice(0,100),detail:String(a.detail||"").slice(0,160),
        status:["urgent","now","soon","review","optional"].includes(a.status)?a.status:"review",
        priority:Math.max(0,Math.min(100,Number(a.priority)||0)),
        dueAt:Number.isFinite(Number(a.dueAt))&&Number(a.dueAt)>0?Number(a.dueAt):null
      })):[];
      const next={items,updated:Number(d.updated)||Date.now(),cached:false};
      if(JSON.stringify(actionSets[id])!==JSON.stringify(next)){actionSets[id]=next;remember();render();}
    });
    document.addEventListener("staxx:summary",e=>{
      const d=e.detail||{},id=d.id;if(!idOk(id)||!entries.some(x=>x.id===id))return;
      const entry={headline:String(d.headline||"").slice(0,90),
        metrics:Array.isArray(d.metrics)?d.metrics.slice(0,4).map(x=>({label:String(x.label||"").slice(0,36),value:String(x.value??"—").slice(0,45)})):[],
        updated:Number(d.updated)||Date.now()};
      if(JSON.stringify(summaries[id])!==JSON.stringify(entry)){summaries[id]=entry;recordTrend(id,entry);remember();if(expanded&&overviewShown)showOverview();}
    });
    window.setInterval(()=>{if(!document.hidden&&entries.some(e=>Number(controls[e.id]?.snoozeUntil)>0&&Number(controls[e.id]?.snoozeUntil)<=Date.now())){for(const e of entries){if(Number(controls[e.id]?.snoozeUntil)>0&&Number(controls[e.id]?.snoozeUntil)<=Date.now()){controls[e.id]={...controls[e.id],snoozeUntil:0};saveLocal("staxx-hub-alert-control-"+e.id,controls[e.id]);}}render();}else if(!document.hidden&&expanded&&entries.some(e=>activeNotice(e.id)?.dueAt)){render();}},60000);
    window.addEventListener?.("hashchange",renderContext);
    window.addEventListener?.("popstate",renderContext);
    window.setInterval?.(()=>{if(!document.hidden)renderContext();},15000);
    // Older v1 notifications cannot be trusted for dismiss-state comparisons.
    render();
    document.dispatchEvent(new CustomEvent("staxx:ping"));
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startHub,{once:true});else startHub();
})();







(function () {
  'use strict';
  if (window.top !== window.self || window.__profitStaxxBooted) return;
  window.__profitStaxxBooted = true;

  const VERSION = '1.12.0';
  const PDA_KEY = '###PDA-APIKEY###';
  const KEY_PREFIX = 'profitstaxx_v1_';
  const API_ROOT = 'https://api.torn.com/v2/';
  const CORE_ITEMS = ['Xanax', 'Feathery Hotel Coupon', 'Erotic DVD', 'Energy Drink',
    'Bottle of Beer', 'Bottle of Champagne', 'Bottle of Vodka',
    'Box of Medical Supplies', 'First Aid Kit', 'Small First Aid Kit',
    'Morphine', 'Blood Bag', 'Donator Pack', 'Drug Pack',
    'Bottle of Whiskey', 'Ecstasy', 'Cannabis'];
  const RECIPES = [
    {name:'Plushie set',points:10,items:['Jaguar Plushie','Lion Plushie','Panda Plushie','Monkey Plushie','Chamois Plushie','Wolverine Plushie','Nessie Plushie','Red Fox Plushie','Camel Plushie','Kitten Plushie','Teddy Bear Plushie','Sheep Plushie','Stingray Plushie']},
    {name:'Flower set',points:10,items:['Dahlia','Orchid','African Violet','Cherry Blossom','Peony','Ceibo Flower','Edelweiss','Crocus','Heather','Tribulus Omanense','Banana Orchid']}
  ];
  const DEFAULTS = {capital:300000000,maxTradePct:3,maxItemPct:10,reservePct:40,minRoi:3,minProfit:40000,reviewMinutes:3,
    bazaarDiscount:2,pointFee:0,method:'best',scanInterval:180,watchNames:CORE_ITEMS.slice(),museumOwned:{},museumBatch:1,
    key:'',alertThreshold:100000,tab:'scan',allocMarket:55,allocTravel:20,allocStock:20,allocBank:5,bankPrincipal:0,bankApr:0,rentalAssetValue:0,rentalNetWeekly:0,stockTargets:{},
    travelCapacity:10,travelMinProfit:100000,travelMinutes:'',dailyReviewMinutes:15};
  const state={alertFocus:'',settings:Object.assign({},DEFAULTS),catalog:{},quotes:{},snapshots:{},
    trades:[],income:[],stockHistory:{},stockCache:[],stockCacheAt:0,status:'Ready',error:'',busy:false,cancelScan:false,scanMode:'full',lastScan:0,pointsPrice:0,inventoryOwned:{},inventoryAt:0,inventoryBusy:false,inventoryError:'',
    tab:'scan',dailyReviews:{},rankFilter:'all',chartDays:30,open:false,storage:'browser',watchCount:0,scanDone:0,scanTotal:0};
  let root, fab, badge, shell, saveChain=Promise.resolve(), scanTimer=null, lastHubPanelState=null;
  const scrollPositions=Object.create(null);
  let lastRenderedTab=null;
  const fmt=n=>Number.isFinite(Number(n)) ? '$'+Math.round(Number(n)).toLocaleString('en-US') : '—';
  const pct=n=>Number.isFinite(n) ? n.toFixed(1)+'%' : '—';
  const number=n=>Math.max(0,Number(n)||0);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const now=()=>Date.now();
  const age=ms=>ms?Math.max(0,Math.floor((now()-ms)/60000))+'m ago':'Never';
  const human=n=>{if(!Number.isFinite(n))return '—'; const a=Math.abs(n);
    return (n<0?'-':'')+'$'+(a>=1e9?(a/1e9).toFixed(2)+'b':a>=1e6?(a/1e6).toFixed(2)+'m':a>=1e3?(a/1e3).toFixed(1)+'k':Math.round(a));};

  async function readStore() {
    try {
      if (typeof PDA_storage!=='undefined' && typeof PDA_storage.getMany==='function') {
        const data=await PDA_storage.getMany(['settings','quotes','snapshots','trades','catalog','pointsPrice','lastScan','income','travelRows','travelAt','stockHistory','stockCache','stockCacheAt','dailyReviews','inventoryOwned','inventoryAt']);
        state.storage='TornPDA';
        return data||{};
      }
    } catch(e){console.warn('[ProfitStaxx] Native storage unavailable; falling back');}
    state.storage='browser';
    const data={};
    for(const key of ['settings','quotes','snapshots','trades','catalog','pointsPrice','lastScan','income','travelRows','travelAt','stockHistory','stockCache','stockCacheAt','dailyReviews']){
      try{data[key]=JSON.parse(localStorage.getItem(KEY_PREFIX+key)||'null');}catch(e){data[key]=null;}
    }
    return data;
  }
  function persist() {
    const data={settings:state.settings,quotes:state.quotes,snapshots:state.snapshots,
      trades:state.trades,income:state.income,catalog:state.catalog,pointsPrice:state.pointsPrice,lastScan:state.lastScan,
      travelRows:travelState.rows,travelAt:travelState.at,
      stockHistory:state.stockHistory,stockCache:state.stockCache,stockCacheAt:state.stockCacheAt,dailyReviews:state.dailyReviews,inventoryOwned:state.inventoryOwned,inventoryAt:state.inventoryAt};
    saveChain=saveChain.catch(()=>{}).then(async()=>{
      if(state.storage==='TornPDA' && typeof PDA_storage!=='undefined'){
        await PDA_storage.setMany(data);
      }else{
        for(const [k,v] of Object.entries(data))localStorage.setItem(KEY_PREFIX+k,JSON.stringify(v));
      }
    }).catch(e=>{state.error='Unable to save locally: '+(e.message||'storage error');console.warn('[ProfitStaxx] Storage write failed');});
    return saveChain;
  }
  function apiKey() {
    return PDA_KEY && !PDA_KEY.includes('PDA-APIKEY') ? PDA_KEY.trim() : String(state.settings.key||'').trim();
  }
  async function api(path) {
    const key=apiKey();
    if(!key)throw new Error('Set a Torn API key in Settings (or use TornPDA key injection).');
    const url=API_ROOT+path;
    const headers={Authorization:'ApiKey '+key};
    let payload;
    if(typeof PDA_httpGet==='function'){
      const response=await PDA_httpGet(url,headers);
      if(!response || response.status<200 || response.status>=300)throw new Error('API HTTP '+(response&&response.status||'unknown'));
      payload=JSON.parse(response.responseText);
    } else if(typeof GM_xmlhttpRequest==='function'){
      payload=await new Promise((resolve,reject)=>{
        GM_xmlhttpRequest({method:'GET',url,headers,timeout:20000,
          onload:r=>{try{if(r.status<200||r.status>=300)throw new Error('HTTP '+r.status);resolve(JSON.parse(r.responseText));}catch(e){reject(e);}},
          ontimeout:()=>reject(new Error('API timed out')),onerror:()=>reject(new Error('API connection failed'))});
      });
    } else {
      const res=await fetch(url,{headers,credentials:'omit'});
      if(!res.ok)throw new Error('API HTTP '+res.status);
      payload=await res.json();
    }
    if(payload && payload.error)throw new Error('Torn API: '+(payload.error.error||payload.error.message||'unknown error'));
    return payload||{};
  }
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  function normalizeItems(payload) {
    const data=payload.items||payload;
    const rows=Array.isArray(data)?data:Object.entries(data||{}).map(([id,v])=>Object.assign({id:Number(id)},v||{}));
    const output={};
    for(const entry of rows){
      if(!entry||!entry.name)continue;
      const id=Number(entry.id||entry.item_id||0);
      if(!id)continue;
      output[String(entry.name).toLowerCase()]={id,name:entry.name,value:number(entry.market_value||entry.marketValue||0),type:entry.type||''};
    }
    return output;
  }
  function getItem(name){return state.catalog[String(name).toLowerCase()]||null;}
  function parseOffers(payload,field) {
    const data=payload[field]||payload;
    const rows=Array.isArray(data)?data:
      Array.isArray(data.listings)?data.listings:
      Array.isArray(data.offers)?data.offers:
      (data&&typeof data==='object'?Object.values(data).filter(v=>v&&typeof v==='object') : []);
    return rows.map(o=>({price:number(o.price??o.cost),qty:number(o.amount??o.quantity??o.qty)}))
      .filter(o=>o.price>0&&o.qty>0).sort((a,b)=>a.price-b.price);
  }
  function listingReference(offers) {
    const sample=offers.slice(1,Math.min(16,offers.length));
    if(sample.length<4)return 0;
    const prices=sample.map(x=>x.price).sort((a,b)=>a-b);
    const mid=Math.floor(prices.length/2);
    return prices.length%2 ? prices[mid] : (prices[mid-1]+prices[mid])/2;
  }
  function methodQuote(entry,marketRef){
    const cost=entry.price;
    const bazaarPrice=Math.floor(marketRef*(1-number(state.settings.bazaarDiscount)/100));
    const marketPrice=Math.floor(marketRef);
    const marketNet=Math.floor(marketPrice*.95)-cost;
    const bazaarNet=bazaarPrice-cost;
    const selected=state.settings.method==='market'?'market':
      state.settings.method==='bazaar'?'bazaar':(bazaarNet>marketNet?'bazaar':'market');
    return {method:selected,price:selected==='bazaar'?bazaarPrice:marketPrice,
      unitProfit:selected==='bazaar'?bazaarNet:marketNet,marketNet,bazaarNet};
  }
  function exposure(itemId){
    const pos=positions().find(p=>p.itemId===itemId);
    return pos?pos.cost:0;
  }
  function scoreDeal(q){
    if(!q||q.offers.length<6||!q.reference)return null;
    const offer=q.offers[0],ref=q.reference;
    if(ref<=offer.price)return null;
    const sell=methodQuote(offer,ref);
    const roi=100*sell.unitProfit/offer.price;
    const cashCap=number(state.settings.capital)*number(state.settings.maxTradePct)/100;
    const itemCap=number(state.settings.capital)*number(state.settings.maxItemPct)/100;
    const funds=Math.min(cashCap,Math.max(0,itemCap-exposure(q.id)),Math.max(0,number(state.settings.capital)*(1-number(state.settings.reservePct)/100)-openCost()));
    const quantity=Math.max(0,Math.min(offer.qty,Math.floor(funds/offer.price)));
    const profit=quantity*sell.unitProfit;
    if(!quantity||roi<number(state.settings.minRoi)||profit<number(state.settings.minProfit))return null;
    const near=q.offers.filter(o=>o.price<=ref*1.02).reduce((t,o)=>t+o.qty,0);
    const priceConfidence=clamp(q.offers.length*5,0,100);
    const depthConfidence=clamp(near/(quantity||1)*10,0,100);
    const freshness=clamp(100-(now()-q.at)/60000*4,0,100);
    const strength=clamp(roi*5,0,100);
    const score=Math.round(priceConfidence*.2+depthConfidence*.2+freshness*.15+strength*.45);
    return {id:q.id,name:q.name,buy:offer.price,qty:quantity,reference:ref,roi,profit,unitProfit:sell.unitProfit,
      marketNet:sell.marketNet,bazaarNet:sell.bazaarNet,method:sell.method,score,at:q.at,depth:near};
  }
  function deals(){return Object.values(state.quotes).map(scoreDeal).filter(Boolean).sort((a,b)=>(b.score* b.profit)-(a.score*a.profit));}
  function openCost(){return positions().reduce((v,p)=>v+p.cost,0);}
  function positions(){
    const byId={};
    for(const t of (state.trades||[]).slice().sort((a,b)=>a.at-b.at)){
      const key=String(t.itemId);
      if(!byId[key])byId[key]={itemId:Number(t.itemId),name:t.name,qty:0,cost:0,realised:0};
      const p=byId[key],qty=number(t.qty),amount=number(t.price)*qty;
      if(t.side==='buy'){p.cost+=amount;p.qty+=qty;}
      else if(t.side==='sell'&&p.qty>=qty&&qty>0){
        const basis=p.cost/p.qty;
        p.realised+=amount*(1-number(t.fee)/100)-basis*qty;
        p.cost=Math.max(0,p.cost-basis*qty);p.qty-=qty;
      }
    }
    return Object.values(byId);
  }
  function portfolio(){const ps=positions();return {positions:ps,realised:ps.reduce((s,p)=>s+p.realised,0),
    invested:ps.reduce((s,p)=>s+p.cost,0),unrealised:ps.reduce((s,p)=>{
      const q=state.quotes[p.itemId];const benchmark=q&&q.reference;
      return s+(benchmark?p.qty*benchmark*.95-p.cost:0);},0)};}
  function validateSell(id,qty){
    const p=positions().find(p=>p.itemId===id);return p&&p.qty>=qty;
  }
  function addTrade({side,itemId,qty,price,fee,method}){
    const item=Object.values(state.catalog).find(x=>x.id===Number(itemId));
    if(!item)throw new Error('Choose an item in the catalog.');
    qty=Math.floor(Number(qty));price=Number(price);
    if(!Number.isFinite(qty)||qty<1||!Number.isFinite(price)||price<=0)throw new Error('Enter a valid quantity and unit price.');
    if(side==='sell'&&!validateSell(item.id,qty))throw new Error('Not enough units in your recorded position.');
    state.trades.push({id:now()+'_'+Math.random().toString(36).slice(2,7),side,itemId:item.id,name:item.name,qty,price,
      fee:side==='sell'?clamp(Number(fee)||0,0,100):0,method:String(method||'manual'),at:now()});
    persist();render();
  }
  function normalizeMarket(payload,id,name){
    const offers=parseOffers(payload,'itemmarket');
    return {id,name,offers,reference:listingReference(offers),at:now(),
      cacheTimestamp:Number(payload.itemmarket&&payload.itemmarket.cache_timestamp)||0};
  }
  function getWatchList(){
    const names=[...(state.settings.watchNames||[]),...RECIPES.flatMap(r=>r.items)];
    return [...new Set(names.map(x=>String(x).trim()).filter(Boolean))].map(name=>getItem(name)).filter(Boolean)
      .filter((item,i,all)=>all.findIndex(x=>x.id===item.id)===i);
  }
  async function loadCatalog(){
    if(Object.keys(state.catalog).length>100)return;
    const payload=await api('torn/items');
    const parsed=normalizeItems(payload);
    if(!Object.keys(parsed).length)throw new Error('Torn item catalog did not match the expected API response.');
    state.catalog=parsed;persist();
  }
  async function refreshPoints(){
    try{
      const p=await api('market/pointsmarket');
      const rows=parseOffers(p,'pointsmarket');
      state.pointsPrice=rows.length?rows[0].price:0;
    }catch(e){state.error='Points pricing unavailable: '+e.message;}
  }
  async function scan({manual=false,quick=false}={}){
    if(state.busy)return;
    if(!apiKey()){state.status='API key needed';render();return;}
    if(!manual&&document.hidden)return;
    if(!manual&&now()-state.lastScan<number(state.settings.scanInterval)*1000)return;
    state.busy=true;state.cancelScan=false;state.scanMode=quick?'quick':'full';state.error='';state.status='Loading catalog...';render();
    try{
      await loadCatalog();
      const all=getWatchList();
      // Fast mode prioritises stale and never-priced items, with a small bounded API budget.
      const list=quick?all.slice().sort((a,b)=>(Number(state.quotes[a.id]?.at)||0)-(Number(state.quotes[b.id]?.at)||0)).slice(0,10):all;
      state.scanTotal=list.length;state.scanDone=0;
      state.status='Scanning '+list.length+' items...';render();
      await refreshPoints();render();
      let firstFailure='';
      for(const item of list){
        if(state.cancelScan){state.status='Stopped at '+state.scanDone+' / '+list.length+' · partial quotes kept';break;}
        if(document.hidden&&!manual){state.status='Scan paused while hidden';break;}
        try {
          const p=await api('market/'+item.id+'/itemmarket');
          state.quotes[item.id]=normalizeMarket(p,item.id,item.name);
          const history=state.snapshots[item.id]||[];
          history.push({at:now(),price:state.quotes[item.id].offers[0]?.price||0,reference:state.quotes[item.id].reference});
          state.snapshots[item.id]=history.slice(-96);
        } catch(e) {
          if(!firstFailure)firstFailure=e.message;
          if(/API.*(key|permission|access|limit|rate)|HTTP 429|HTTP 401/i.test(e.message))break;
        }
        state.scanDone+=1;
        state.status='Scanned '+state.scanDone+'/'+list.length;
        render();
        if(state.scanDone<list.length)await sleep(2500);
      }
      const complete=!state.cancelScan&&state.scanDone===list.length&&!firstFailure;
      if(complete&&!quick)state.lastScan=now();
      state.status=state.cancelScan?'Scan stopped · '+state.scanDone+'/'+list.length:
        complete?(quick?'Quick scan complete · '+list.length+' items':'Full scan complete · '+list.length+' items'):
        'Partial scan · '+state.scanDone+'/'+list.length;
      if(firstFailure)state.error='Some items could not be checked: '+firstFailure;
      persist();
    }catch(e){state.status='Scan failed';state.error=e.message;console.warn('[ProfitStaxx] Scan issue: '+e.message);}
    finally{state.busy=false;render();}
  }
  function bookCost(offers,amount){
    let remaining=Math.max(0,Math.floor(amount)),sum=0;
    if(!remaining)return 0;
    for(const offer of offers||[]){
      const take=Math.min(remaining,Math.floor(number(offer.qty)));
      sum+=take*number(offer.price);
      remaining-=take;
      if(!remaining)return sum;
    }
    return null;
  }
  function liveMuseumOwnedV112(){
    return state.inventoryAt>0&&now()-state.inventoryAt<60*60000;
  }
  function museumOwnedCountV112(name){
    const source=liveMuseumOwnedV112()?state.inventoryOwned:(state.settings.museumOwned||{});
    return Math.max(0,Math.floor(number(source[name])));
  }
  async function refreshInventoryV112(){
    if(state.inventoryBusy||!apiKey()||document.hidden)return;
    state.inventoryBusy=true;state.inventoryError='';render();
    try{
      // Only promote complete inventory; no invented zero quantities on partial responses.
      const pages=[];let complete=false;
      for(let offset=0;offset<2000;offset+=250){
        const response=await api('user/inventory?limit=250&offset='+offset);
        const rows=response?.inventory?.items;
        if(!Array.isArray(rows))throw Error('Inventory API returned no item list.');
        if(rows.some(x=>!x||!Number.isFinite(Number(x.id))||!Number.isFinite(Number(x.amount))||Number(x.amount)<0))
          throw Error('Inventory returned invalid item quantities.');
        pages.push(...rows);
        const total=Number(response?._metadata?.total);
        if(rows.length<250||(Number.isFinite(total)&&total>=0&&pages.length>=total)){
          complete=true;break;
        }
      }
      if(!complete)throw Error('Inventory exceeds the safe 2,000-entry page cap.');
      const names=new Map(RECIPES.flatMap(r=>r.items).map(n=>[n.toLowerCase(),n]));
      const owned={};
      for(const entry of pages){
        if(entry.faction_owned)continue;
        const name=names.get(String(entry.name||'').toLowerCase());
        if(name)owned[name]=(owned[name]||0)+Math.floor(Number(entry.amount));
      }
      state.inventoryOwned=owned;state.inventoryAt=now();
      persist();
    }catch(e){state.inventoryError='Inventory auto-sync unavailable; using saved manual counts: '+String(e.message||e);}
    finally{state.inventoryBusy=false;render();}
  }
  function recipeResults(){
    const batch=clamp(Math.floor(number(state.settings.museumBatch)||1),1,25);
    return RECIPES.map(r=>{
      const rows=r.items.map(name=>{const item=getItem(name),q=item&&state.quotes[item.id];
        const owned=museumOwnedCountV112(name);
        const price=q&&q.offers[0]&&q.offers[0].price||0;
        const needed=Math.max(0,batch-owned);
        const cash=q?bookCost(q.offers,needed):null;
        const ownedOpportunity=Math.min(batch,owned)*price;
        return {name,id:item&&item.id,price,owned,needed,cash,opportunity:ownedOpportunity,at:q&&q.at||0};});
      const ready=rows.every(x=>x.price>0&&x.cash!==null);
      const missingCost=ready?rows.reduce((s,x)=>s+x.cash,0):0;
      const cost=ready?rows.reduce((s,x)=>s+x.cash+x.opportunity,0):0;
      const proceeds=r.points*batch*state.pointsPrice*(1-number(state.settings.pointFee)/100);
      const profit=ready&&state.pointsPrice>0?proceeds-cost:null;
      return {name:r.name,points:r.points,batch,rows,cost,missingCost,proceeds,profit,
        roi:profit!==null&&cost?profit/cost*100:null,ready};
    });
  }

  // Live Torn Stock Market and local revenue ledger. No transactions are submitted.
  const dividendCash={CNC:[80000000,31],GRN:[4000000,31],IOU:[12000000,31],TMI:[25000000,31],TCT:[1000000,31],TSB:[50000000,31]};
  const incomeRoutes=[['market','Item Market / Bazaar','/page.php?sid=ItemMarket'],['stocks','Stock Market','/page.php?sid=stocks'],
    ['bank','Bank interest','/bank.php'],['rent','Property rental','/properties.php'],['company','Company income / wages','/companies.php'],
    ['travel','Travel importing','/travelagency.php'],['crimes','Crimes / OC','/loader.php?sid=crimes'],
    ['bounty','Bounty hunting','/bounties.php'],['revive','Reviving / services','/hospitalview.php'],
    ['museum','Museum arbitrage','/museum.php'],['points','Points trading','/pmarket.php'],['other','Other earned income','/city.php']];
  const stockState={all:[],owned:[],at:0,ownedAt:0,loading:false,error:''};
  function moneyRecords(){return state.income||[]}
  function putMoney(rows){state.income=rows.slice(-1000);persist()}
  function stockRows(){
    const mine=new Map(stockState.owned.map(x=>[Number(x.id),x]));
    return stockState.all.filter(x=>number(x.market?.price)>0).map(x=>{
      const own=mine.get(Number(x.id)),shares=number(own?.shares),p=number(x.market.price),block=number(x.bonus?.requirement);
      const cash=dividendCash[x.acronym],annualYield=cash&&block?100*cash[0]*365/cash[1]/(block*p):null;
      const increments=number(own?.bonus?.increment);
      const next=block*(x.bonus?.passive?1:Math.pow(2,Math.min(25,increments)));
      return {...x,own,shares,p,block,annualYield,increment:increments,need:Math.max(0,next-shares)};
    }).sort((a,b)=>(b.annualYield??-1)-(a.annualYield??-1));
  }
  function dueDividends(){return stockState.ownedAt&&now()-stockState.ownedAt<1800000?stockRows().filter(x=>x.own?.bonus?.available===true):[]}
  async function refreshStocks(){
    if(stockState.loading||!apiKey())return;
    stockState.loading=true;stockState.error='';render();
    try{
      const rows=await api('torn/stocks');
      if(!Array.isArray(rows.stocks))throw Error('Invalid stock quote response.');
      stockState.all=rows.stocks;stockState.at=now();
      const bucket=Math.floor(stockState.at/(6*3600000));
      for(const item of stockState.all){
        if(!(Number(item.id)>0&&number(item.market?.price)>0))continue;
        const id=String(item.id),old=state.stockHistory[id]||[];
        if(!old.length||Math.floor(old[old.length-1].at/(6*3600000))!==bucket)old.push({at:stockState.at,price:number(item.market.price)});
        state.stockHistory[id]=old.filter(x=>x.at>now()-90*86400000).slice(-400);
      }
      state.stockCache=stockState.all;state.stockCacheAt=stockState.at;
      persist();
      try{const mine=await api('user/stocks');if(!Array.isArray(mine.stocks))throw Error('Invalid holdings response.');
        stockState.owned=mine.stocks;stockState.ownedAt=now();}
      catch(e){stockState.owned=[];stockState.ownedAt=0;
        stockState.error='Prices loaded, but personal holdings require a Limited-access key with user/stocks: '+e.message;}
    }catch(e){stockState.error=e.message}
    finally{stockState.loading=false;render()}
  }

  function stockHistoryPoint(id){return (state.stockHistory[String(id)]||[]).filter(x=>x?.at>now()-90*86400000&&number(x.price)>0).sort((a,b)=>a.at-b.at);}
  function stockChange(row){
    const old=stockHistoryPoint(row.id).filter(x=>x.at<=now()-86400000).slice(-1)[0];
    return old?100*(row.p/old.price-1):null;
  }
  function stockSignals(){
    if(!stockState.at||now()-stockState.at>30*60000)return [];
    const signals=[];
    for(const row of stockRows()){
      const cfg=state.settings.stockTargets?.[String(row.id)]||{};
      if(number(cfg.buy)>0&&row.p<=number(cfg.buy))signals.push({id:'stock-buy-'+row.id,
        title:'Review buying '+row.acronym,why:fmt(row.p)+' at or below '+fmt(cfg.buy),priority:80});
      if(number(cfg.sell)>0&&row.p>=number(cfg.sell))signals.push({id:'stock-sell-'+row.id,
        title:'Review selling '+row.acronym,why:fmt(row.p)+' at or above '+fmt(cfg.sell),priority:85});
    }
    return signals.slice(0,30);
  }
  function stockWatchPanel(){
    const rows=stockRows(),targets=state.settings.stockTargets||{};
    if(!rows.length)return '';
    let h='<div class="card"><h3>Stock buy / sell price alerts</h3>'+
      '<p class="muted">Watch absolute share prices. Signals require a quote checked within 30 minutes and run only while Torn is open.</p>'+
      '<form id="ps_stocktargets"><div class="field"><label>Stock</label><select name="stockId">'+rows.slice().sort((a,b)=>a.acronym.localeCompare(b.acronym))
      .map(x=>'<option value="'+x.id+'">'+esc(x.acronym)+' · '+esc(x.name)+' ('+fmt(x.p)+')</option>').join('')+'</select></div>'+
      '<div class="duo">'+field('stockBuy','Buy at or below ($)',0)+field('stockSell','Sell at or above ($)',0)+'</div>'+
      '<button class="btn" type="submit">Save target</button></form>';
    for(const [id,x] of Object.entries(targets)){
      const row=rows.find(r=>String(r.id)===id);if(!row)continue;
      h+='<div class="line"><span>'+esc(row.acronym)+' · buy '+(x.buy?fmt(x.buy):'off')+' / sell '+(x.sell?fmt(x.sell):'off')+'</span>'+
        '<button class="btn red" data-stock-clear="'+esc(id)+'">Remove</button></div>';
    }
    return h+'</div>';
  }

  function renderStockPanel(){
    const rows=stockRows(),due=dueDividends();
    let h='<div class="toolbar"><button class="btn" data-action="stockrefresh" '+(stockState.loading?'disabled':'')+'>'+(stockState.loading?'Refreshing…':'Refresh stocks')+
      '</button><button class="btn secondary" data-action="stockpage">Open Torn stock exchange</button></div>'+
      notice('Block costs and share prices are from Torn API v2. Annual yield is shown only for fixed cash dividends; price appreciation is excluded. Selling shares incurs a 0.1% fee.');
    if(stockState.error)h+=notice(stockState.error,true);
    h+=stockWatchPanel();
    if(stockSignals().length)h+='<div class="card"><h3>Stock price targets reached</h3>'+stockSignals().map(x=>'<div class="line" id="ps-alert-'+esc(x.id)+'"><span>'+esc(x.title)+' · '+esc(x.why)+'</span><button class="btn secondary" data-action="stockpage">Inspect</button></div>').join('')+'</div>';
    if(!rows.length)return h+'<div class="empty">Press Refresh to load live stocks.</div>';
    h+='<div class="statrow"><div class="stat"><small>Market value of owned shares</small><b>'+(stockState.ownedAt?fmt(rows.reduce((n,x)=>n+x.shares*x.p,0)):'Limited key needed')+'</b></div>'+
      '<div class="stat"><small>Ready dividends</small><b>'+(stockState.ownedAt?due.length:'—')+'</b></div></div>';
    if(due.length)h+='<div class="card" id="ps-alert-stock-claim"><h3>Collect dividends</h3><p>'+due.map(x=>esc(x.acronym)).join(', ')+'</p><button class="btn" data-action="stockpage">Collect on Torn</button></div>';
    for(const x of rows)h+='<div class="card"><div class="line"><strong>'+esc(x.acronym)+' · '+esc(x.name)+'</strong><span class="pill">'+(x.annualYield===null?'Unpriced bonus':pct(x.annualYield)+' cash yield')+'</span></div>'+
      '<div class="line"><span>Share / first benefit block</span><b>'+fmt(x.p)+' / '+fmt(x.p*x.block)+'</b></div>'+
      '<p class="muted">'+esc(x.bonus?.description||'No benefit description')+(stockChange(x)===null?' · 24h trend unavailable':' · sampled 24h '+pct(stockChange(x)))+'</p>'+
      (stockState.ownedAt?'<p>Owned '+Math.floor(x.shares).toLocaleString('en-US')+' · active increments '+x.increment+
        (x.own?.bonus?.available?' · <b class="positive">Claim now</b>':'')+'</p><p class="muted">Next benefit: '+Math.floor(x.need).toLocaleString('en-US')+' more shares, about '+fmt(x.need*x.p)+'.</p>':'')+
      '<button class="btn secondary" data-action="stockpage">Inspect stock</button></div>';
    return h+notice('Utility perks and item dividend returns are left unpriced rather than treating market asking prices as realised revenue. Each new active benefit increment doubles the share requirement.');
  }


  // Optional, anonymised public abroad-shop observations. No Torn API key is ever sent to this provider.
  const TRAVEL_FEED='https://www.torn-tracker.com/api/open/v1/travel/stocks';
  const travelState={rows:[],at:0,busy:false,error:'',progress:''};
  function countryMinutes(country){
    const key=String(country||'').trim().toLowerCase();
    const match=String(state.settings.travelMinutes||'').split(/[\r\n]+/).map(s=>s.match(/^\s*([a-z -]{2,40})\s*[:=]\s*(\d{1,5})\s*$/i)).filter(Boolean)
      .find(x=>x[1].trim().toLowerCase()===key);
    return match?Number(match[2]):0;
  }
  function travelRows(){
    const cap=clamp(Math.floor(number(state.settings.travelCapacity)||10),1,200);
    const maxSpend=number(state.settings.capital)*number(state.settings.maxTradePct)/100;
    return travelState.rows.map(x=>{
      const observed=Number(x.observed)||0,ageMs=observed?now()-observed:Infinity;
      const q=state.quotes[x.id],fresh=q&&now()-q.at<8*60000&&q.reference>0;
      const resale=fresh?Math.floor(q.reference*.95):null;
      const quantity=Math.max(0,Math.min(cap,x.quantity,Math.floor(maxSpend/x.cost)));
      const cost=quantity*x.cost,net=resale===null?null:quantity*(resale-x.cost);
      const mins=countryMinutes(x.country)||countryMinutes(x.countryName);
      return {...x,quantityBuy:quantity,spent:cost,net,roi:net!==null&&cost>0?100*net/cost:null,
        perHour:net!==null&&mins>0?net*60/mins:null,roundTripMinutes:mins,
        saleReference:resale,quoteAt:fresh?q.at:0,observationAge:ageMs,
        valid:ageMs>=-5*60000&&ageMs<=30*60000&&quantity>0&&net!==null&&net>0};
    }).sort((a,b)=>(Number(b.valid)-Number(a.valid))||(b.perHour??b.net??-1)-(a.perHour??a.net??-1));
  }
  async function publicTravelGet(){
    if(typeof PDA_httpGet==='function'){
      try{const r=await PDA_httpGet(TRAVEL_FEED,{});
        if(r&&r.status===200)return JSON.parse(r.responseText);
        throw Error('Travel feed HTTP '+(r?.status||'unknown'));
      }catch(e){if(typeof GM_xmlhttpRequest!=='function'&&typeof fetch!=='function')throw e;}
    }
    if(typeof GM_xmlhttpRequest==='function')return await new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({method:'GET',url:TRAVEL_FEED,timeout:15000,
        onload:r=>{try{if(r.status!==200)throw Error('Travel feed HTTP '+r.status);resolve(JSON.parse(r.responseText));}catch(e){reject(e)}},
        onerror:()=>reject(Error('Travel feed connection failed')),ontimeout:()=>reject(Error('Travel feed timed out'))});
    });
    const r=await fetch(TRAVEL_FEED,{credentials:'omit',mode:'cors'});if(!r.ok)throw Error('Travel feed HTTP '+r.status);
    return await r.json();
  }
  function parseTravelFeed(body){
    if(!Array.isArray(body?.countries))throw Error('Foreign stock data unavailable or changed format.');
    const result=[];
    for(const group of body.countries.slice(0,40)){
      if(!Array.isArray(group?.items))continue;
      const country=String(group.country||group.name||'').slice(0,40);
      if(!country)continue;
      for(const x of group.items.slice(0,150)){
        const id=Number(x.item_id),price=Number(x.cost),qty=Number(x.quantity),age=Number(x.age_s);
        if(!Number.isSafeInteger(id)||id<1||!Number.isFinite(price)||price<=0||!Number.isSafeInteger(qty)||qty<0)continue;
        const parsed=Date.parse(x.observed_at||'');
        const observed=Number.isFinite(parsed)?parsed:Number.isFinite(age)&&x.age_s!==null&&age>=0?now()-age*1000:0;
        result.push({country,countryName:String(group.name||country).slice(0,50),id,name:String(x.name||'Item #'+id).slice(0,90),
          cost:price,quantity:qty,observed,reporters:Math.max(0,Number(x.reporters)||0),source:String(x.source||'unknown').slice(0,16)});
      }
    }
    return result.slice(0,1500);
  }
  async function scanTravel(){
    if(travelState.busy||state.busy)return;
    travelState.busy=true;travelState.error='';travelState.progress='Loading foreign stock reports…';render();
    try{
      const feed=await publicTravelGet();
      const rows=parseTravelFeed(feed);
      if(!rows.length)throw Error('No usable foreign stock observations reported.');
      travelState.rows=rows;travelState.at=now();
      // Scan only a capped, diverse set of fresh shelf candidates: item-market reads remain rate-limited.
      if(apiKey()){
        await loadCatalog();
        const catalogById=new Map(Object.values(state.catalog).map(x=>[x.id,x]));
        // Catalog market values only prioritise which item gets a fresh Torn quote.
        // They are NEVER used in displayed profit, opportunity rankings or allocation.
        const cap=clamp(Math.floor(number(state.settings.travelCapacity)||10),1,200);
        const candidates=rows.filter(x=>x.quantity>0&&x.observed>now()-30*60000)
          .map(x=>({...x,roughProfit:Math.max(0,number(catalogById.get(x.id)?.value)*.95-x.cost)*Math.min(x.quantity,cap)}))
          .sort((a,b)=>b.roughProfit-a.roughProfit||b.reporters-a.reporters||b.quantity-a.quantity);
        const ids=[...new Set(candidates.map(x=>x.id))].slice(0,16);
        let index=0;
        for(const id of ids){
          if(document.hidden)break;
          const cached=state.quotes[id];
          if(cached&&now()-cached.at<4*60000){index++;continue;}
          const item=Object.values(state.catalog).find(x=>x.id===id);
          if(!item){index++;continue;}
          try{const quote=await api('market/'+id+'/itemmarket');
            state.quotes[id]=normalizeMarket(quote,id,item.name);}
          catch(e){travelState.error='Some resale prices unavailable: '+e.message;if(/429|rate|permission|key/i.test(e.message))break;}
          travelState.progress='Pricing foreign items '+(++index)+' / '+ids.length;render();
          if(index<ids.length)await sleep(2600);
        }
      }else travelState.error='Add a Torn API key to price the foreign stock against fresh Item Market asks.';
      persist();
    }catch(e){travelState.error=String(e.message||e);}
    finally{travelState.busy=false;travelState.progress='';render();}
  }
  function renderTravel(){
    const rows=travelRows(),fresh=rows.filter(x=>x.valid),priced=rows.filter(x=>x.net!==null).length;
    let h='<div class="card"><h3>Foreign-shop profit scanner</h3>'+
      '<p class="muted">Optional third-party public observation data from Torn Tracker, checked automatically when Torn is in the foreground (or on demand). No API key, identity or stored trading record is sent. <a href="https://torn-tracker.com/guide/website/developer-api/" target="_blank" rel="noopener noreferrer">Data: torn-tracker.com contributors</a> (CC BY 4.0). Shelf stock is reported by players and may disappear before arrival. Estimated resale uses recent Torn Item Market asking prices less 5%.</p>'+
      '<form id="ps_travelsettings"><div class="duo">'+field('travelCapacity','Carry capacity (items)',state.settings.travelCapacity||10)+
      field('travelMinProfit','Minimum trip profit ($)',state.settings.travelMinProfit||0)+'</div>'+
      '<div class="field"><label>Round-trip minutes by destination (country=minutes; include shop time)</label>'+
      '<textarea name="travelMinutes" rows="3" style="width:100%;background:#061b31;color:white;border:1px solid #325c79;border-radius:8px;padding:9px" placeholder="mex=180">'+esc(state.settings.travelMinutes||'')+'</textarea></div>'+
      '<button class="btn secondary" type="submit">Save travel limits</button></form></div>'+
      '<div class="toolbar"><button class="btn" data-action="travelscan" '+(travelState.busy?'disabled':'')+'>'+(travelState.busy?'Scanning…':'Scan abroad and price up to 16 items')+'</button>'+
      '<button class="btn secondary" data-action="incomepage" data-source="travel">Open travel agency</button></div>';
    if(travelState.error)h+=notice(travelState.error,true);
    if(travelState.progress)h+=notice(travelState.progress);
    h+='<div class="statrow"><div class="stat"><small>Fresh profitable routes</small><b>'+fresh.length+'</b></div>'+
      '<div class="stat"><small>Priced offers / observed</small><b>'+priced+' / '+rows.length+'</b></div></div>';
    if(!rows.length)return h+'<div class="empty">No travel scan yet. Reported stock and resale market prices must be checked before choosing a route.</div>';
    h+=notice('Last feed scan '+age(travelState.at)+' · only shelf sightings within 30 minutes count as current; round-trip profit/hour requires your own travel times. Cash per trip obeys your maximum single-trade exposure.');
    const limit=number(state.settings.travelMinProfit);
    for(const x of rows.filter(x=>x.valid&&x.net>=limit).slice(0,35)){
      h+='<div class="card"><div class="line"><strong>'+esc(x.countryName)+' · '+esc(x.name)+'</strong><span class="pill">'+(x.perHour===null?pct(x.roi)+' ROI':fmt(x.perHour)+'/h')+'</span></div>'+
        '<div class="line"><span>Estimated net trip profit</span><b class="positive">'+fmt(x.net)+'</b></div>'+
        '<div class="line"><span>Purchase '+x.quantityBuy+' × '+fmt(x.cost)+'</span><span>'+fmt(x.spent)+' total</span></div>'+
        '<p class="muted">Observed '+age(x.observed)+' · shelf '+x.quantity+' units · '+x.reporters+' reporters · modeled resale '+fmt(x.saleReference)+'/item (ask-derived)</p>'+
        '<button class="btn secondary" data-action="incomepage" data-source="travel">Open travel agency</button></div>';
    }
    if(!fresh.length)h+='<div class="empty">No fresh, verified-margin travel route qualifies yet. Unknown or old resale prices are not treated as profit.</div>';
    return h;
  }

  // User-supplied terms complement live stock quotes; never label inputs as API observations.
  function incomeComparisonPanel(){
    const s=state.settings,bank=number(s.bankPrincipal),bankApr=number(s.bankApr),asset=number(s.rentalAssetValue),
      weeklyRent=number(s.rentalNetWeekly),bankAnnual=bank*bankApr/100,rentAnnual=weeklyRent*52,
      rentYield=asset>0?100*rentAnnual/asset:null,
      usable=Math.max(0,number(s.capital)*(1-number(s.reservePct)/100)-openCost());
    const liveStock=stockState.at&&now()-stockState.at<30*60000;
    const stocks=liveStock?stockRows().filter(x=>x.annualYield!==null&&x.block*x.p>0&&x.block*x.p<=usable):[];
    const top=stocks[0];
    let html='<div class="card"><h3>Passive-income comparison</h3>'+
      '<p class="muted">Bank and property amounts are your own inputs. Stock block costs and fixed-cash yield come from recent Torn quotes. The returns have different risks and lock-up conditions.</p>'+
      '<form id="ps_passive"><div class="duo">'+field('bankPrincipal','Bank principal ($)',bank)+
      field('bankApr','Bank annual-equivalent rate (%)',bankApr)+'</div>'+
      '<div class="duo">'+field('rentalAssetValue','Rental property value ($)',asset)+
      field('rentalNetWeekly','Rent net per week ($)',weeklyRent)+'</div>'+
      '<button type="submit" class="btn secondary">Update scenarios</button></form>';
    html+='<div class="line"><span>Bank: yearly interest at entered rate</span><b>'+(bank&&bankApr?fmt(bankAnnual):'Add bank quote')+'</b></div>'+
      '<div class="line"><span>Rent: yearly net / annual yield</span><b>'+(asset&&weeklyRent?fmt(rentAnnual)+' / '+pct(rentYield):'Add rental terms')+'</b></div>'+
      '<div class="line"><span>Cash deployable under trading reserve</span><b>'+fmt(usable)+'</b></div>'+
      (top?'<div class="line"><span>Highest fixed-cash stock yield within cash cap</span><b>'+esc(top.acronym)+' · '+pct(top.annualYield)+'</b></div>'+
        '<p class="muted">First block costs '+fmt(top.block*top.p)+'. Indicative yield excludes stock depreciation, cash-flow interruption and foregone alternatives.</p>':
        '<p class="muted">'+(liveStock?'No priced cash-dividend block fits the available trading allocation.':'Stock quote comparison unavailable or over 30 minutes old. Open Stocks to refresh first.')+'</p>')+
      '<div class="toolbar"><button class="btn secondary" data-tab="stocks">Review stocks</button>'+
      '<button class="btn secondary" data-action="incomepage" data-source="bank">Open bank</button></div></div>';
    const recent=moneyRecords().filter(x=>Number(x.at)>=now()-30*86400000),totals=new Map();
    for(const r of recent){const key=String(r.source||'other'),v=totals.get(key)||{net:0,minutes:0,count:0};
      v.net+=Number(r.net)||0;v.minutes+=number(r.minutes);v.count++;totals.set(key,v);}
    html+='<div class="card"><h3>30-day income by source</h3>';
    if(!totals.size)html+='<p class="muted">No realised entries recorded in the last 30 days.</p>';
    for(const [source,v] of [...totals].sort((a,b)=>b[1].net-a[1].net)){
      const label=incomeRoutes.find(x=>x[0]===source)?.[1]||'Other';
      html+='<div class="line"><span>'+esc(label)+' · '+v.count+' records</span><b class="'+(v.net<0?'negative':'positive')+'">'+fmt(v.net)+'</b></div>'+
        (v.minutes>0?'<p class="muted">Net per active hour: '+fmt(v.net*60/v.minutes)+'</p>':'');
    }
    return html+'</div>';
  }

  function renderRevenuePanel(){
    const records=moneyRecords(),sum=days=>records.filter(x=>x.at>=now()-days*86400000).reduce((n,x)=>n+Number(x.net||0),0);
    let h='<div class="statrow"><div class="stat"><small>7-day realised net</small><b>'+fmt(sum(7))+'</b></div><div class="stat"><small>30-day realised net</small><b>'+fmt(sum(30))+'</b></div></div>'+
      '<div class="card"><h3>Record completed income or losses</h3><form id="ps_revenue"><div class="field"><label>Income source</label><select name="source">'+incomeRoutes.map(r=>'<option value="'+esc(r[0])+'">'+esc(r[1])+'</option>').join('')+'</select></div>'+
      '<div class="duo">'+field('received','Received ($)',0)+field('spent','Spent ($)',0)+'</div><div class="duo">'+field('minutes','Minutes of active work',0)+field('note','Note','','text','maxlength="100"')+'</div><button class="btn" type="submit">Save income</button></form></div>'+
      '';
    h+=incomeComparisonPanel();
    h+='<h3>Explore other Torn revenue sources</h3>';
    for(const r of incomeRoutes)h+='<div class="card"><div class="line"><strong>'+esc(r[1])+'</strong><button class="btn secondary" data-action="incomepage" data-source="'+esc(r[0])+'">Open Torn</button></div></div>';
    h+='<h3>Income history</h3>';
    for(const x of records.slice(-30).reverse())h+='<div class="card"><div class="line"><b>'+esc(incomeRoutes.find(r=>r[0]===x.source)?.[1]||'Other')+'</b><span>'+fmt(x.net)+'</span></div>'+
      '<div class="line"><span class="muted">'+esc(x.note||new Date(x.at).toLocaleDateString())+'</span><button class="btn red" data-income-id="'+esc(x.id)+'">Delete</button></div></div>';
    return h+notice('Only completed earnings are recorded. Stock holding values, unrealised resale estimates and bank scenarios are not counted as earned income.');
  }


  // Cross-category ranking deliberately distinguishes one-off spreads from recurring cash benefits.
  function incomeCandidates(){
    const remaining=Math.max(0,number(state.settings.capital)*(1-number(state.settings.reservePct)/100)-openCost());
    const entries=[],activeMin=Math.max(1,number(state.settings.reviewMinutes)||3);
    const add=(x)=>{
      if(!Number.isFinite(Number(x.cost))||x.cost<=0||!Number.isFinite(Number(x.net))||x.net<=0)return;
      const roi=100*x.net/x.cost,confidence=clamp(x.confidence,0,100);
      // Score is a transparent shortlist heuristic, not a probability or guaranteed recurring return.
      const speed=x.minutes>0?clamp(Math.log10(1+Math.max(0,x.net)/x.minutes)*17,0,100):0;
      const quality=clamp(roi*3,0,100),scale=clamp(Math.log10(1+x.net)*13,0,100);
      x.score=Math.round(confidence*.35+quality*.25+speed*.20+scale*.20);
      x.roi=roi;entries.push(x);
    };
    for(const d of activeDealAlerts().slice(0,24)){
      add({id:'market-'+d.id,kind:'market',label:d.name,category:'active',cost:d.buy*d.qty,net:d.profit,
        minutes:activeMin,confidence:Math.min(85,Number(d.score)||0),period:'one trade',route:'market',
        summary:'Live item ask-derived exit · resale not guaranteed',itemId:d.id});
    }
    for(const r of travelRows().filter(x=>x.valid).slice(0,40)){
      add({id:'travel-'+r.country+'-'+r.id,kind:'travel',label:r.countryName+' · '+r.name,category:'active',
        cost:r.spent,net:r.net,minutes:r.roundTripMinutes||0,confidence:Math.max(0,70-r.observationAge/60000),
        period:'one round trip',route:'travel',summary:r.roundTripMinutes?'Round-trip minutes: '+r.roundTripMinutes:'Enter travel minutes for hourly comparison'});
    }
    if(state.pointsPrice>0){
      for(const r of recipeResults())if(r.ready&&r.profit>0&&r.missingCost>0){
        add({id:'museum-'+r.name,kind:'museum',label:r.name+' × '+r.batch,category:'active',
          cost:r.missingCost,net:r.profit,minutes:activeMin*2,confidence:38,period:'one conversion',route:'museum',
          summary:'Components and point proceeds are asking-price estimates'});
      }
    }
    if(stockState.at&&now()-stockState.at<30*60000){
      for(const s of stockRows().filter(x=>x.annualYield!==null&&x.block*x.p>0)){
        if(s.need<=0)continue;
        const cost=s.need*s.p;
        const payout=dividendCash[s.acronym],income=payout?payout[0]*30/payout[1]:0;
        if(!income||cost>remaining)continue;
        add({id:'stock-'+s.id,kind:'stock',label:s.acronym+' first/next cash benefit',category:'passive',
          cost,net:income,minutes:0,confidence:65,period:'modelled 30 days after benefit eligibility',
          route:'stocks',summary:'Fixed cash benefit only · stock price risk and eligibility delay excluded'});
      }
    }
    const bank=state.settings;
    if(number(bank.bankPrincipal)>0&&number(bank.bankApr)>0)
      add({id:'bank',kind:'bank',label:'Bank interest (entered quote)',category:'passive',
        cost:number(bank.bankPrincipal),net:number(bank.bankPrincipal)*number(bank.bankApr)/1200,
        minutes:0,confidence:48,period:'30-day simple-interest equivalent',
        route:'bank',summary:'Rate entered by you · not a live quote or reinvestment guarantee'});
    if(number(bank.rentalAssetValue)>0&&number(bank.rentalNetWeekly)>0)
      add({id:'rent',kind:'rent',label:'Property rental (entered net)',category:'passive',
        cost:number(bank.rentalAssetValue),net:number(bank.rentalNetWeekly)*30/7,
        minutes:0,confidence:48,period:'30-day rent equivalent',
        route:'rent',summary:'User-entered property figures · vacancies not modelled'});
    return entries.sort((a,b)=>b.score-a.score||b.net-a.net);
  }

  // Daily review queue: choose distinct, priced opportunities and never treat proposals as completed earnings.
  function dailyPlanV111(){
    const day=new Date().toISOString().slice(0,10),settings=state.settings,
      budget=Math.max(1,number(settings.dailyReviewMinutes)||15),
      spendable=Math.max(0,number(settings.capital)*(1-number(settings.reservePct)/100)-openCost()),
      candidates=incomeCandidates().filter(x=>x&&x.net>0&&x.cost>0&&x.score>=20);
    const categories=new Map(),items=[];let activeMinutes=0,committed=0;
    // First pass: diversity across sources, second pass: best remaining cash/time fit.
    const sorted=candidates.sort((a,b)=>(b.score+(b.category==='active'?8:0))-(a.score+(a.category==='active'?8:0))||b.net-a.net);
    const picked=new Set();
    for(const diverse of [true,false]){
      for(const x of sorted){
        if(items.length>=5)break;
        if(picked.has(x.id)||diverse&&(categories.get(x.kind)||0)>=1)continue;
        const minutes=x.minutes>0?x.minutes:0;
        // A travel trip with no known door-to-door duration cannot be claimed to fit a short session.
        if(x.kind==='travel'&&!minutes)continue;
        if(x.kind==='market'){
          const observed=activeDealAlerts().find(d=>Number(d.id)===Number(x.itemId));
          if(!observed||dealRisk(observed).level==='High')continue;
        }
        if(minutes&&activeMinutes+minutes>budget)continue;
        // Principal of manually-entered property/bank scenarios need not belong to trading funds.
        const liquid=x.kind!=='bank'&&x.kind!=='rent';
        if(liquid&&committed+x.cost>spendable)continue;
        const selected={...x,kind:x.kind,needsCash:liquid,reviewed:!!state.dailyReviews?.[day]?.[x.id]};
        items.push(selected);picked.add(x.id);
        categories.set(x.kind,(categories.get(x.kind)||0)+1);
        activeMinutes+=minutes;
        if(liquid)committed+=x.cost;
      }
    }
    return {day,budget,spendable,activeMinutes,committed,items,observedAt:state.lastScan};
  }
  function renderDailyPlanV111(){
    const plan=dailyPlanV111(),done=plan.items.filter(x=>x.reviewed).length;
    let html='<div class="card" id="ps-alert-daily-plan"><h3>Today · five profit decisions</h3>'+
      '<p class="muted">A short, risk-aware review queue across priced income sources. Scores are heuristics. Passive options show a 30-day cashflow equivalent, whereas item flips and travel are one-off opportunities; they cannot be summed as a daily income forecast.</p>'+
      '<form id="ps_daily_limits"><div class="duo">'+field('dailyReviewMinutes','Time available today (min)',plan.budget)+
      field('dailyReviewCap','Maximum reviewed opportunities',5,'number','disabled')+'</div><button class="btn secondary" type="submit">Save time budget</button></form>'+
      '<div class="statrow"><div class="stat"><small>Reviewed today</small><b>'+done+'/'+plan.items.length+'</b></div>'+
      '<div class="stat"><small>Modelled active time</small><b>'+plan.activeMinutes+' / '+plan.budget+' min</b></div></div>'+
      '<p class="muted">Working cash model: '+fmt(plan.spendable)+' · selected short-list commitments '+fmt(plan.committed)+'. The model does not know your current Torn wallet or confirm buy/sell fills.</p></div>';
    if(!plan.items.length)html+='<div class="empty">No supported candidates fit your time and protected cash. Refresh the separate Deals, Travel or Stocks data; never trade just to fill a quota.</div>';
    for(const [i,x] of plan.items.entries()){
      const mark=x.reviewed?'Reviewed (not bought)':'Mark reviewed';
      html+='<div class="card"><div class="line"><h3>'+(i+1)+'. '+esc(x.label)+'</h3><span class="pill">'+x.score+'/100</span></div>'+
        '<div class="line"><span>Cash exposure</span><b>'+fmt(x.cost)+'</b></div>'+
        '<div class="line"><span>Indicative net · '+esc(x.period)+'</span><b class="positive">'+fmt(x.net)+'</b></div>'+
        '<p class="muted">'+esc(x.summary)+' · '+(x.minutes?x.minutes+' active minutes estimated':'No active duration confirmed')+'</p>'+
        '<div class="toolbar"><button class="btn" data-action="rank-open" data-rank-id="'+esc(x.id)+'">Review in Torn</button>'+
        '<button class="btn secondary" data-daily-review="'+esc(x.id)+'">'+mark+'</button></div></div>';
    }
    return html+notice('Review status is stored locally per UTC date, and never treated as a completed transaction or receipt. Use Ledger or Income to record actual results.');
  }

  function renderRankings(){
    const rows=incomeCandidates(),filter=state.rankFilter||'all',shown=rows.filter(x=>filter==='all'||x.category===filter);
    let h='<div class="card"><h3>One dashboard · best options to review</h3><p class="muted">A single ranked shortlist across active and passive income. Scores combine indicative ROI, payoff size, active time where known and source quality. They do not annualise a one-off trade or imply a chance of profit.</p>'+
      '<div class="toolbar">'+[['all','All'],['active','Quick / active'],['passive','Passive']].map(x=>
        '<button class="btn '+(filter===x[0]?'':'secondary')+'" data-rank-filter="'+x[0]+'">'+x[1]+'</button>').join('')+'</div></div>';
    if(!shown.length)h+='<div class="empty">Nothing sufficiently priced to rank. Refresh Deals, Stocks and Travel, or enter actual bank/rental terms.</div>';
    for(const x of shown.slice(0,35)){
      h+='<div class="card"><div class="line"><strong>'+esc(x.label)+'</strong><span class="pill">Priority '+x.score+'/100</span></div>'+
        '<div class="line"><span>Cash commitment</span><b>'+fmt(x.cost)+'</b></div>'+
        '<div class="line"><span>Modelled net · '+esc(x.period)+'</span><b class="positive">'+fmt(x.net)+'</b></div>'+
        '<div class="line"><span>ROI / confidence heuristic</span><span>'+pct(x.roi)+' / '+Math.round(x.confidence)+'/100</span></div>'+
        (x.minutes?'<p class="muted">Estimated active time '+x.minutes+' min · '+fmt(x.net*60/x.minutes)+'/active hour if completed</p>':'')+
        '<p class="muted">'+esc(x.summary)+'</p>'+
        '<button class="btn secondary" data-action="rank-open" data-rank-id="'+esc(x.id)+'">Review this opportunity</button></div>';
    }
    return h;
  }
  // Buckets share only deployable cash; the unspent cash reserve and item cost basis are protected.
  function multiCapitalPlan(){
    const s=state.settings,capital=number(s.capital),liquid=Math.max(0,capital*(1-number(s.reservePct)/100)-openCost());
    const input=[number(s.allocMarket),number(s.allocTravel),number(s.allocStock),number(s.allocBank)];
    const total=input.reduce((a,b)=>a+b,0)||1;
    const percent=input.map(x=>100*x/total);
    const limits=percent.map(x=>liquid*x/100),spent=[0,0,0,0],items=[];
    const propose=(bucket,source,title,cost,net,period,description)=>{
      if(!(cost>0&&cost<=limits[bucket]-spent[bucket]+1e-6))return false;
      spent[bucket]+=cost;items.push({bucket,source,title,cost,net,period,description});return true;
    };
    for(const d of allocationPlan().allocations){
      if(items.filter(x=>x.bucket===0).length>=8)break;
      const qty=Math.min(Math.floor(d.allocQty),Math.floor((limits[0]-spent[0])/d.buy));
      if(qty>0)propose(0,'market',d.name+' × '+qty,qty*d.buy,qty*d.unitProfit,'one resale','Modelled asking-price profit; confirm listing and demand');
    }
    for(const r of travelRows().filter(x=>x.valid)){
      if(items.some(x=>x.bucket===1))break;
      propose(1,'travel',r.countryName+' · '+r.name,r.spent,r.net,'one trip','Check shelf on arrival; sale and round-trip time unconfirmed');
    }
    if(stockState.at&&now()-stockState.at<30*60000)for(const r of stockRows().filter(x=>x.annualYield!==null)){
      if(items.some(x=>x.bucket===2))break;
      if(r.need<=0)continue;
      const price=r.need*r.p;
      const payout=dividendCash[r.acronym];if(payout)propose(2,'stocks',r.acronym+' benefit block',price,payout[0]*30/payout[1],
        '30-day equivalent after eligibility','Share price risk; income assumes reward cadence only after activation');
    }
    if(number(s.bankApr)>0&&limits[3]>0)propose(3,'bank','Bank allocation',limits[3],limits[3]*number(s.bankApr)/1200,
      '30-day equivalent','Entered bank rate, not verified live, check investment term');
    return {liquid,limits,percent,spent,items,unallocated:Math.max(0,liquid-spent.reduce((a,b)=>a+b,0))};
  }
  function renderCapital(){
    const s=state.settings,p=multiCapitalPlan(),names=['Item Market','Foreign trips','Stock blocks','Bank'];
    let h='<div class="card"><h3>Capital allocator · diversified scenarios</h3>'+
      '<p class="muted">Uses your '+fmt(s.capital)+' trading-capital assumption, protects '+pct(number(s.reservePct))+' cash reserve and subtracts the cost basis of recorded open items. Stock holdings and other assets are not assumed to be cash. Buckets normalise to 100%.</p>'+
      '<form id="ps_allocation"><div class="duo">'+field('allocMarket','Item flipping weight',s.allocMarket)+
      field('allocTravel','Travel weight',s.allocTravel)+'</div><div class="duo">'+field('allocStock','Stock blocks weight',s.allocStock)+
      field('allocBank','Bank weight',s.allocBank)+'</div>'+
      '<button class="btn secondary" type="submit">Update capital split</button></form>'+
      '<div class="statrow"><div class="stat"><small>Deployable cash</small><b>'+fmt(p.liquid)+'</b></div>'+
      '<div class="stat"><small>Unallocated cash</small><b>'+fmt(p.unallocated)+'</b></div></div>';
    for(let i=0;i<names.length;i++)h+='<div class="line"><span>'+names[i]+' · '+pct(p.percent[i])+'</span><b>'+fmt(p.spent[i])+' / '+fmt(p.limits[i])+'</b></div>';
    h+='</div><h3>Proposed use of capital</h3>';
    if(!p.items.length)h+='<div class="empty">No qualifying offers fit current bucket limits. Unallocated cash remains liquid.</div>';
    for(const x of p.items)h+='<div class="card"><div class="line"><strong>'+esc(x.title)+'</strong><span class="pill">'+esc(names[x.bucket])+'</span></div>'+
      '<div class="line"><span>Cash needed</span><b>'+fmt(x.cost)+'</b></div>'+
      '<div class="line"><span>Modelled upside · '+esc(x.period)+'</span><b class="positive">'+fmt(x.net)+'</b></div>'+
      '<p class="muted">'+esc(x.description)+'</p>'+
      '<button class="btn secondary" data-action="allocation-open" data-source="'+esc(x.source)+'">Inspect in Torn</button></div>';
    return h+notice('This is a split-capital scenario, not an instruction to buy. It is not a verified optimal portfolio: liquidity, realised fills, stock capital losses and current cash in your Torn account are not automatically known.');
  }


  // Realised trading cashflow is reconstructed chronologically from weighted-average cost.
  function realisedEvents(){
    const events=[],holdings=new Map();
    for(const t of (state.trades||[]).slice().sort((a,b)=>Number(a.at)-Number(b.at))){
      const id=String(t.itemId),qty=Number(t.qty),price=Number(t.price),when=Number(t.at);
      if(!Number.isFinite(qty)||qty<=0||!Number.isFinite(price)||price<0||!Number.isFinite(when))continue;
      const pos=holdings.get(id)||{qty:0,basis:0};
      if(t.side==='buy'){pos.basis+=qty*price;pos.qty+=qty;}
      else if(t.side==='sell'&&qty<=pos.qty){
        const basis=pos.basis/pos.qty*qty,net=qty*price*(1-clamp(Number(t.fee)||0,0,100)/100)-basis;
        pos.qty-=qty;pos.basis=Math.max(0,pos.basis-basis);
        events.push({at:when,source:'Item trades (ledger)',net});
      }
      holdings.set(id,pos);
    }
    for(const r of moneyRecords()){
      const value=Number(r.net),when=Number(r.at);
      if(!Number.isFinite(value)||!Number.isFinite(when)||when<=0)continue;
      events.push({at:when,source:incomeRoutes.find(x=>x[0]===r.source)?.[1]||'Other income',net:value});
    }
    return events;
  }
  function profitHistory(days){
    const end=new Date(),endDate=Date.UTC(end.getUTCFullYear(),end.getUTCMonth(),end.getUTCDate());
    const start=endDate-(days-1)*86400000;
    const daily=Array.from({length:days},(_,i)=>({day:new Date(start+i*86400000).toISOString().slice(0,10),net:0,cumulative:0}));
    const sources=new Map();
    for(const e of realisedEvents()){
      if(!Number.isFinite(e.at)||e.at<start||e.at>=endDate+86400000)continue;
      const index=Math.floor((e.at-start)/86400000);
      if(!daily[index])continue;
      daily[index].net+=e.net;
      sources.set(e.source,(sources.get(e.source)||0)+e.net);
    }
    let running=0;
    for(const d of daily){running+=d.net;d.cumulative=running;}
    return {daily,sources,total:running};
  }
  function svgLine(values,label,color){
    const w=590,h=185,left=48,right=18,top=16,bottom=37;
    if(!values.length)return '';
    const low=Math.min(0,...values),high=Math.max(0,...values),range=Math.max(1,high-low);
    const px=i=>left+(values.length===1?0:(w-left-right)*i/(values.length-1));
    const py=v=>top+(h-top-bottom)*(high-v)/range;
    const points=values.map((v,i)=>px(i).toFixed(2)+','+py(v).toFixed(2)).join(' ');
    const baseline=py(0);
    return '<svg class="ps-chart" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+esc(label)+'" xmlns="http://www.w3.org/2000/svg">'+
      '<title>'+esc(label)+'</title>'+
      '<line x1="'+left+'" y1="'+baseline+'" x2="'+(w-right)+'" y2="'+baseline+'" stroke="#6a8196" stroke-width="1"/>'+
      '<polyline points="'+points+'" fill="none" stroke="'+color+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+
      '<text x="7" y="'+(top+5)+'" fill="#c7e1f7" font-size="10">'+esc(human(high))+'</text>'+
      '<text x="7" y="'+(h-bottom)+'" fill="#c7e1f7" font-size="10">'+esc(human(low))+'</text>'+
      '<text x="'+left+'" y="'+(h-9)+'" fill="#b8d2e4" font-size="11">First day</text>'+
      '<text x="'+(w-right-42)+'" y="'+(h-9)+'" fill="#b8d2e4" font-size="11">Today</text></svg>';
  }
  function renderHistory(){
    const n=[7,30,90].includes(state.chartDays)?state.chartDays:30,h=profitHistory(n),
      highest=Math.max(1,...h.daily.map(x=>Math.abs(x.net)));
    let out='<div class="card"><h3>Realised profit history</h3>'+
      '<p class="muted">Based on dated, completed item sales in Ledger and manually recorded Income entries. Includes losses. No unrealised shares, forecast returns or unsold inventory.</p>'+
      '<div class="toolbar">'+[7,30,90].map(d=>'<button class="btn '+(d===n?'':'secondary')+'" data-chart-days="'+d+'">'+d+' days</button>').join('')+'</div>'+
      '<div class="statrow"><div class="stat"><small>Selected-period net</small><b class="'+(h.total<0?'negative':'positive')+'">'+fmt(h.total)+'</b></div>'+
      '<div class="stat"><small>Active sources</small><b>'+h.sources.size+'</b></div></div>'+
      '<h3>Cumulative net during period</h3>'+svgLine(h.daily.map(x=>x.cumulative),'Cumulative realised profit', '#43cbef')+
      '<h3>Daily net</h3>'+svgLine(h.daily.map(x=>x.net),'Daily realised profit and losses','#66d6a3')+'</div>';
    out+='<div class="card"><h3>Income composition by source</h3>';
    if(!h.sources.size)out+='<p class="muted">Record income or close a ledger trade to build the chart.</p>';
    const max=Math.max(1,...[...h.sources.values()].map(x=>Math.abs(x)));
    for(const [key,value] of [...h.sources].sort((a,b)=>b[1]-a[1])){
      out+='<div class="line"><span>'+esc(key)+'</span><b class="'+(value<0?'negative':'positive')+'">'+fmt(value)+'</b></div>'+
        '<div class="meter"><i style="width:'+clamp(Math.abs(value)/max*100,0,100).toFixed(1)+'%;background:'+(value<0?'#fa7484':'#43cbef')+'"></i></div>';
    }
    out+='</div><div class="card"><h3>What counts?</h3><p class="muted">Income logged separately as Item Market earnings may duplicate sales already in Ledger. Stock dividend receipts should be recorded once in Income when actually received. Historical data starts only when you started recording, and is not proof of missing earnings.</p>'+
      '<div class="toolbar"><button class="btn secondary" data-tab="income">Record income</button><button class="btn secondary" data-tab="portfolio">Trade ledger</button></div></div>';
    return out;
  }

  function css(){
    return [
      ':host{all:initial;font:14px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#e7f2ff}',
      '*{box-sizing:border-box}button,input,select{font:inherit}button{cursor:pointer}',
      '.fab{position:fixed;right:16px;bottom:86px;z-index:2147483645;border:1px solid #5de2fd80;',
      'background:linear-gradient(145deg,#0a84db,#073e7c);color:white;border-radius:18px;',
      'min-width:58px;height:55px;box-shadow:0 7px 28px #0009;font-weight:900;letter-spacing:.3px}',
      '.bubble{position:absolute;right:-4px;top:-7px;background:#2cdeaa;color:#052922;min-width:21px;',
      'border-radius:12px;font-size:11px;padding:3px 5px;border:2px solid #06162a}',
      '.overlay{position:fixed;inset:0;z-index:2147483646;background:#0009;display:none;align-items:flex-end;',
      'justify-content:center}.overlay.active{display:flex}',
      '.panel{width:min(630px,100vw);height:min(93dvh,900px);background:#08192d;',
      'border:1px solid #28506e;border-radius:19px 19px 0 0;box-shadow:0 0 45px #000b;',
      'display:flex;flex-direction:column;overflow:hidden;color:#dcefff}',
      '.heading{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:15px 17px;',
      'background:linear-gradient(120deg,#0c3358,#0b203b);border-bottom:1px solid #254765}',
      '.brand{font-size:19px;font-weight:850;letter-spacing:.1px}.sub{color:#90a9c0;font-size:11px}',
      '.close{background:#1c3b59;color:#fff;border:0;padding:7px 12px;border-radius:9px;font-weight:700}',
      '.tabs{display:flex;gap:4px;padding:7px;overflow-x:auto;background:#0b223b}',
      '.tab{border:0;border-radius:8px;background:transparent;color:#91aac4;padding:10px;font-size:12px;white-space:nowrap;flex:0 0 auto}',
      '.tab.active{background:#1c5080;color:#fff;font-weight:750}',
      '.body{overflow-y:auto;padding:13px;flex:1;overscroll-behavior:contain}',
      '.statrow{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:0 0 10px}',
      '.stat{padding:12px;border:1px solid #294661;background:#102844;border-radius:11px}',
      '.stat small{display:block;color:#88a9c9}.stat b{display:block;font-size:18px;margin-top:4px}',
      '.card{background:#0d2945;border:1px solid #284b6b;border-radius:12px;padding:12px;margin-bottom:10px}',
      '.card h3{margin:0 0 8px;font-size:15px}.line{display:flex;justify-content:space-between;align-items:center;',
      'gap:8px;margin:6px 0}.line>span:last-child{text-align:right}',
      '.muted{color:#94abc0;font-size:12px}.positive{color:#49e2ad}.negative{color:#ff828a}',
      '.pill{background:#19496b;border-radius:20px;padding:3px 7px;color:#b6dbff;font-size:11px}',
      '.btn{background:#0879bd;color:#fff;border:0;padding:9px 12px;border-radius:9px;font-weight:700}',
      '.btn.secondary{background:#233e58}.btn.red{background:#82334a}.btn:disabled{opacity:.4;cursor:default}',
      '.toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}',
      '.field{display:grid;gap:4px;margin-bottom:10px}.field label{font-size:12px;color:#adc5de}',
      '.field input,.field select{border:1px solid #325c79;border-radius:8px;background:#061b31;',
      'color:#fff;padding:10px;min-width:0;width:100%}.duo{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
      '.notice{padding:9px 11px;border-radius:8px;background:#163752;color:#cee7ff;margin-bottom:9px;font-size:12px}',
      '.warning{background:#402d34;color:#ffcfce}.empty{padding:25px;text-align:center;color:#9eb6ce}',
      '.meter{height:5px;background:#193b5d;border-radius:5px;overflow:hidden;margin-top:9px}',
      '.meter>i{display:block;height:100%;background:#45b5e8}',
      '.footer{border-top:1px solid #223d5c;padding:8px 13px;color:#819db5;font-size:10px;background:#0b2139}',
      '.ps-chart{width:100%;height:auto;max-width:100%;display:block;background:#0b223b;border-radius:10px;margin:8px 0 14px}',
      'a{color:#66d5ff;text-decoration:none}a:hover{text-decoration:underline}',
      '@media(min-width:800px){.overlay{align-items:center}.panel{border-radius:18px;height:min(85vh,880px)}}'
    ].join('');
  }
  function field(name,label,value,type='number',attr=''){
    return '<div class="field"><label for="ps_'+esc(name)+'">'+esc(label)+'</label><input id="ps_'+esc(name)+'" name="'+esc(name)+'" type="'+esc(type)+'" value="'+esc(value)+'" '+attr+'></div>';
  }
  function notice(str,warning=false){return '<div class="notice'+(warning?' warning':'')+'">'+esc(str)+'</div>';}
  function linkToItem(id){return 'https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID='+encodeURIComponent(id);}
  function activeDealAlerts(){return deals().filter(x=>x.profit>=number(state.settings.alertThreshold)&&now()-x.at<8*60000);}
  // Conservative exit watch: asking prices are NOT executed sales. No sell is automated.
  function exitSignals(){
    return portfolio().positions.filter(p=>p.qty>0&&p.cost>0&&p.itemId>0).map(p=>{
      const q=state.quotes[p.itemId],ask=Number(q?.reference)||0,observed=Number(q?.at)||0;
      if(!ask||!observed||now()-observed>8*60000)return null;
      const net=p.qty*ask*.95,upside=net-p.cost,roi=p.cost?100*upside/p.cost:0;
      return upside>0&&roi>=3?{...p,ask,net,upside,roi,at:observed,breakeven:p.cost/p.qty/.95}:null;
    }).filter(Boolean).sort((a,b)=>b.upside-a.upside);
  }
  function profitNextActions(){
    const fresh=activeDealAlerts(),exits=exitSignals(),actions=[];
    const daily=dailyPlanV111();
    if(daily.items.length)actions.push({id:'daily-plan',title:'Review '+daily.items.length+' best money-making options today',
      detail:daily.items.filter(x=>!x.reviewed).length+' not yet reviewed · '+daily.activeMinutes+' modelled active minutes · manual checks only',status:'review',priority:76});
    if(dueDividends().length)actions.push({id:'stock-claim',title:'Collect available stock dividends',detail:dueDividends().map(x=>x.acronym).join(', ')+' · withdraw manually on Torn',status:'now',priority:95});
    for(const x of stockSignals().slice(0,4))actions.push({id:x.id,title:x.title,detail:x.why,status:'review',priority:x.priority});
    const stale=!state.lastScan||now()-state.lastScan>8*60000;
    if(stale)actions.push({id:'refresh-scan',title:'Refresh market prices before trading',detail:'Quotes are missing or older than 8 minutes.',status:'now',priority:90});
    else for(const d of fresh.slice(0,3))actions.push({
      id:'deal-'+Number(d.id),title:'Review '+Math.floor(d.qty)+' × '+String(d.name||'item'),
      detail:'Estimated +'+fmt(d.profit)+' · '+pct(d.roi)+' net ROI · check live listing price',
      status:'review',priority:Math.min(85,40+Math.round(Number(d.score)||0)/2)
    });
    for(const x of exits.slice(0,2))actions.push({
      id:'exit-'+x.itemId,title:'Review selling '+x.qty+' × '+x.name,
      detail:'Indicative after-fee upside '+fmt(x.upside)+' · not a confirmed sale',
      status:'review',priority:Math.min(80,40+Math.round(x.roi))
    });
    return actions;
  }

  // Advisory only: asking-price history is NOT a record of completed sales.
  function priceHistoryQuality(itemId){
    const raw=(state.snapshots[itemId]||[]).filter(x=>x&&Number(x.at)>now()-7*86400000&&Number(x.reference)>0);
    const buckets=new Map();
    for(const x of raw)buckets.set(Math.floor(Number(x.at)/1800000),Number(x.reference));
    const prices=[...buckets.values()].filter(x=>x>0),n=prices.length;
    if(!n)return {n:0,label:'No price history',trend:null,spread:null};
    const ordered=prices.slice().sort((a,b)=>a-b),median=ordered[Math.floor(n/2)];
    const trend=n>=2?100*(prices[n-1]-prices[0])/prices[0]:null;
    const spread=n>=3?100*(ordered[Math.floor(n*.75)]-ordered[Math.floor(n*.25)])/median:null;
    const label=n<3?'Low · few snapshots':n<8?'Developing · '+n+' samples':'Moderate · '+n+' samples';
    return {n,label,trend,spread,median};
  }
  function marketLiquiditySignal(d){
    const q=state.quotes[d.id],offers=q?.offers||[];
    const competing=offers.filter(o=>o.price<=d.reference*1.02).reduce((v,o)=>v+number(o.qty),0);
    const ratio=competing/Math.max(1,d.qty);
    return {competing,ratio,label:ratio>=5?'Crowded asks':ratio>=2?'Some competing asks':'Limited near-price asks'};
  }

  function dealRisk(d){
    const h=priceHistoryQuality(d.id),l=marketLiquiditySignal(d),flags=[];
    if(h.n<3)flags.push('Price history limited');
    if(h.spread!==null&&h.spread>=20)flags.push('Large observed asking-price spread');
    if(h.trend!==null&&h.trend<=-12)flags.push('Recent asking prices falling');
    if(l.ratio>=5)flags.push('Crowded resale listings');
    if(d.qty>l.competing&&l.competing>=0)flags.push('Planned quantity exceeds near-price listing depth');
    if(d.roi<5)flags.push('Thin estimated resale margin');
    const level=flags.length>=3?'High':flags.length>=1?'Review':'Normal';
    return {flags,level,confidence:h.n>=8?'Moderate':h.n>=3?'Developing':'Low'};
  }

  function allocationPlan(){
    const available=Math.max(0,number(state.settings.capital)*(1-number(state.settings.reservePct)/100)-openCost());
    let remaining=available;
    const ranked=deals().filter(d=>now()-d.at<8*60000).map(d=>{
      const history=priceHistoryQuality(d.id),liquidity=marketLiquiditySignal(d);
      const confidence=history.n>=8?.85:history.n>=3?.65:.4;
      const efficiency=d.buy>0?d.unitProfit/d.buy:0;
      return {...d,history,liquidity,weight:d.score*confidence*efficiency};
    }).sort((a,b)=>b.weight-a.weight||b.profit-a.profit);
    const allocations=[];
    for(const d of ranked){
      const qty=Math.max(0,Math.min(Math.floor(d.qty),Math.floor(remaining/d.buy)));
      if(!qty)continue;
      const cost=qty*d.buy,profit=qty*d.unitProfit;
      // Three minutes per reviewed opportunity is a user-planning assumption, not observed execution time.
      const reviewMinutes=clamp(number(state.settings.reviewMinutes)||3,0.5,60);
      allocations.push({...d,allocQty:qty,allocCost:cost,allocProfit:profit,reviewMinutes});
      remaining=Math.max(0,remaining-cost);
    }
    return {available,remaining,allocations,profit:allocations.reduce((n,d)=>n+d.allocProfit,0)};
  }
  function allocationPanel(){
    const plan=allocationPlan(),rows=plan.allocations;
    let out='<div class="card"><h3>Capital allocator · risk-weighted shortlist</h3>'+
      '<div class="statrow"><div class="stat"><small>Deployable cash</small><b>'+fmt(plan.available)+'</b></div>'+
      '<div class="stat"><small>Unallocated cash</small><b>'+fmt(plan.remaining)+'</b></div></div>'+
      '<p class="muted">Respects your cash reserve, existing recorded holdings, per-trade and per-item limits. Allocations are suggestions, not placed orders. Estimated profit '+fmt(plan.profit)+' assumes modelled resale at asking-derived reference prices.</p>';
    if(!rows.length)out+='<p>No fresh qualifying allocations. Refresh the scan or preserve cash.</p>';
    for(const d of rows.slice(0,6))out+='<div class="line"><strong>'+esc(d.name)+' × '+d.allocQty+'</strong><span>'+fmt(d.allocCost)+' / est. +'+fmt(d.allocProfit)+'</span></div>'+
      '<small class="muted">Modelled '+fmt(d.allocProfit/d.reviewMinutes)+'/review minute (assumes '+d.reviewMinutes+' min of active review; excludes unknown sale waiting time) · '+esc(d.history.label)+' · '+esc(d.liquidity.label)+'</small>'+
      '<div><button class="btn secondary" data-action="market-buy" data-id="'+Number(d.id)+'">Inspect and prepare market</button></div>';
    return out+'</div>';
  }
  function sellTimingPanel(){
    const ps=portfolio().positions.filter(p=>p.qty>0&&p.cost>0);
    if(!ps.length)return '';
    let out='<div class="card"><h3>Sell timing · asking-price monitor</h3>'+
      '<p class="muted">Compares observed asking prices, not completed sales or available buyers. Check the live market before listing.</p>';
    for(const p of ps.slice(0,12)){
      const q=state.quotes[p.itemId],h=priceHistoryQuality(p.itemId);
      if(!q||now()-Number(q.at)>8*60000||!h.n)continue;
      const current=number(q.reference),basis=p.cost/Math.max(1,p.qty)/.95;
      const profit=p.qty*(current*.95)-p.cost;
      const direction=h.trend===null?'Insufficient history':h.trend>3?'Asks rising':h.trend< -3?'Asks falling':'Asks broadly flat';
      out+='<div class="line"><b>'+esc(p.name)+'</b><span>'+fmt(current)+' ask · '+esc(direction)+'</span></div>'+
        '<small class="muted">After 5% fee: '+fmt(profit)+' modeled gain · break-even ask '+fmt(basis)+' · '+esc(h.label)+(h.spread!==null?' · historical ask IQR '+h.spread.toFixed(1)+'%':'')+'</small>'+
        '<div><button class="btn secondary" data-action="market-view" data-id="'+Number(p.itemId)+'">Check live market</button></div>';
    }
    return out+'</div>';
  }
  function renderAlerts(){
    const list=activeDealAlerts();
    const exits=exitSignals();
    return (stockSignals().length?stockSignals().map(x=>'<div class="card" id="ps-alert-'+esc(x.id)+'"><h3>'+esc(x.title)+'</h3><p>'+esc(x.why)+'</p><button class="btn" data-action="stockpage">Inspect stock</button></div>').join(''):'')+(dueDividends().length?'<div class="card" id="ps-alert-stock-claim"><h3>Stock dividends ready</h3><p>'+dueDividends().map(x=>esc(x.acronym)).join(', ')+'</p><button class="btn" data-action="stockpage">Collect manually on Torn</button></div>':'')+'<div class="card" id="ps-alert-refresh-scan"><h3>What should I do next?</h3><p>'+esc(state.lastScan?'Last market scan '+age(state.lastScan):'No confirmed scan yet')+'. Check prices on Torn before deciding to trade.</p><button class="btn secondary" data-action="scan">↻ Refresh opportunities</button></div>'+
      (list.length?list.slice(0,30).map(x=>'<div class="card" id="ps-alert-deal-'+Number(x.id)+'"><h3>BUY · '+esc(x.name)+'</h3><p><b>Quantity:</b> up to '+Math.floor(x.qty)+' · <b>maximum:</b> '+fmt(x.buy)+'/unit.</p><p><b>Capital required:</b> '+fmt(x.buy*x.qty)+' · <b>Score:</b> '+Math.floor(x.score)+'/100</p><p class="positive">Potential profit '+fmt(x.profit)+' · '+pct(x.roi)+' estimated ROI after modelled fees</p><p class="muted">Buy only at or below the suggested cap. Re-check inventory, listings and prices.</p><button class="btn" data-action="market-buy" data-id="'+Number(x.id)+'">Open market · prepare '+Math.floor(x.qty)+'</button></div>').join(''):'<div class="empty">No fresh qualifying buy opportunities — do not force a trade.</div>')+
      (exits.length?'<div class="card"><h3>Positions worth reviewing for sale</h3><p class="muted">Estimated from current asking prices, less a 5% market selling fee. Not an executable bid.</p></div>'+exits.slice(0,10).map(x=>'<div class="card" id="ps-alert-exit-'+Number(x.itemId)+'"><h3>SELL REVIEW · '+esc(x.name)+'</h3><p><b>Recorded holdings:</b> '+Math.floor(x.qty)+' · <b>breakeven ask:</b> '+fmt(x.breakeven)+'/unit</p><p class="positive">Indicative gain '+fmt(x.upside)+' · '+pct(x.roi)+' based on asking prices</p><button class="btn secondary" data-action="market-view" data-id="'+Number(x.itemId)+'">Inspect live market listings</button></div>').join(''):'');
  }
  function renderScan(){
    const d=deals().filter(x=>now()-x.at<8*60000),p=portfolio();
    const pick=d[0];
    let html=pick?'<div class="card"><h3>Best opportunity to review</h3><p><b>'+esc(pick.name)+'</b> · up to '+Math.floor(pick.qty)+' units</p><p>Capital '+fmt(pick.qty*pick.buy)+' · modeled gain <span class="positive">'+fmt(pick.profit)+'</span> · '+pct(pick.roi)+' ROI</p><button class="btn" data-action="market-buy" data-id="'+Number(pick.id)+'">Review live listing and prepare quantity</button></div>':'';
    html+=allocationPanel();
    html+='<div class="statrow"><div class="stat"><small>Working capital</small><b>'+human(state.settings.capital)+'</b></div>'+
      '<div class="stat"><small>Recorded invested</small><b>'+human(p.invested)+'</b></div></div>';
    html+='<div class="toolbar"><button class="btn" data-action="scan" '+(state.busy?'disabled':'')+'>'+
      (state.busy?'Scanning '+state.scanDone+'/'+state.scanTotal:'Refresh opportunities')+'</button>'+
      '<button class="btn secondary" data-action="quickscan" '+(state.busy?'disabled':'')+'>Fast scan · 10</button>'+
      (state.busy?'<button class="btn secondary" data-action="stopscan">Stop scan</button>':'')+
      '<button class="btn secondary" data-tab="museum">Museum</button></div>';
    html+=notice(state.status+' · Last full scan: '+age(state.lastScan));
    if(state.error)html+=notice(state.error,true);
    if(!apiKey())html+=notice('Torn API key not available. Open Settings to provide one or configure TornPDA.',true);
    if(!d.length)html+='<div class="empty">No qualifying fresh deals. That is a valid result: do not force a trade. Adjust thresholds in Settings if needed.</div>';
    for(const x of d.slice(0,30)){
      const risk=dealRisk(x);
      html+='<div class="card"><div class="line"><h3>'+esc(x.name)+'</h3><span class="pill">Score '+x.score+'/100</span></div>'+
        '<div class="line"><span class="muted">Buy '+x.qty+' × '+fmt(x.buy)+'</span><strong class="positive">+'+fmt(x.profit)+'</strong></div>'+
        '<div class="line"><span class="muted">Reference ask '+fmt(x.reference)+'</span><span>'+pct(x.roi)+' estimated ROI</span></div>'+
        '<div class="line"><span class="muted">Best modeled exit</span><span>'+esc(x.method==='bazaar'?'Bazaar (slower sale possible)':'Item Market')+'</span></div>'+
        '<div class="line"><span class="muted">Market net / Bazaar net per unit</span><span>'+fmt(x.marketNet)+' / '+fmt(x.bazaarNet)+'</span></div>'+
        '<p class="muted">Risk checks: <strong>'+esc(risk.level)+'</strong> · '+esc(risk.flags.join(' · ')||'No additional historical flags')+' · '+esc(risk.confidence)+' evidence</p>'+
        '<p class="muted">'+esc(priceHistoryQuality(x.id).label)+' · '+esc(marketLiquiditySignal(x).label)+(priceHistoryQuality(x.id).trend===null?'':' · ask trend '+pct(priceHistoryQuality(x.id).trend))+'</p>'+ 
        '<div class="line"><span class="muted">Competition depth: '+x.depth+' units · '+age(x.at)+'</span>'+
        '<button class="btn secondary" data-action="market-buy" data-id="'+Number(x.id)+'">Market · '+Math.floor(x.qty)+' units</button></div>'+
        '<div class="meter"><i style="width:'+x.score+'%"></i></div></div>';
    }
    html+=notice('Expected resale is inferred from active asking prices, not confirmed completed sales. Listings may disappear before you buy.');
    return html;
  }
  function renderMuseum(){
    let html='<div class="statrow"><div class="stat"><small>Cheapest point ask</small><b>'+fmt(state.pointsPrice)+'</b></div>'+
      '<div class="stat"><small>Museum unlocked</small><b>Yes</b></div></div>';
    html+=notice('Each complete flower or plushie set = 10 points. Cash cost assumes Item Market purchases; points revenue uses the lowest ASK, not guaranteed proceeds.');
    html+='<div class="toolbar"><button class="btn secondary" data-action="inventoryscan" '+(state.inventoryBusy?'disabled':'')+'>'+
      (state.inventoryBusy?'Checking Torn inventory…':'Sync owned flowers & plushies')+'</button></div>';
    html+=notice(liveMuseumOwnedV112()?'Torn inventory quantities synced '+age(state.inventoryAt)+'; faction-owned and items kept elsewhere are excluded.':
      'Using locally recorded counts until a complete Torn inventory sync succeeds.');
    if(state.inventoryError)html+=notice(state.inventoryError,true);
    for(const r of recipeResults()){
      html+='<div class="card"><h3>'+esc(r.name)+'</h3>'+
        '<div class="line"><span>Sets modeled</span><strong>'+r.batch+'</strong></div>'+
        '<div class="line"><span>Full economic cost</span><strong>'+fmt(r.cost)+'</strong></div>'+
        '<div class="line"><span>Cash to complete with holdings</span><strong>'+fmt(r.missingCost)+'</strong></div>'+
        '<div class="line"><span>Points value ('+r.points+')</span><strong>'+fmt(r.proceeds)+'</strong></div>'+
        '<div class="line"><span>Estimated spread</span><strong class="'+(r.profit>0?'positive':'negative')+'">'+(r.profit===null?'Incomplete':fmt(r.profit))+'</strong></div>'+
        '<div class="line"><span>Estimated ROI</span><strong>'+ (r.roi===null?'—':pct(r.roi))+'</strong></div>'+
        '<div class="line"><span>Capital limit check</span><span>'+(r.missingCost>number(state.settings.capital)*number(state.settings.maxTradePct)/100?'<span class="negative">Above single-trade cap</span>':'Within single-trade cap')+'</span></div>'+
        '<details><summary class="muted">Component prices and missing data</summary>';
      for(const item of r.rows)html+='<div class="line"><span>'+esc(item.name)+'</span><span>'+fmt(item.price)+
        ' · Owned '+item.owned+(liveMuseumOwnedV112()?' · Torn inventory':
        ' <button class="btn secondary" data-owned="'+esc(item.name)+'" data-delta="-1">−</button> '+
        '<button class="btn secondary" data-owned="'+esc(item.name)+'" data-delta="1">+</button>')+'</span></div>';
      html+='</details></div>';
    }
    html+=notice('This models full-set purchases only. On a complete inventory sync, counts update automatically; +/− remain available as the offline fallback. Cash needed reflects these holdings; profit includes their opportunity cost. Batch prices use available order-book quantities and are not guaranteed. Conversions stay manual.');
    return html;
  }
  function renderPortfolio(){
    const p=portfolio();
    let html='<div class="statrow"><div class="stat"><small>Realised profit</small><b class="'+(p.realised>=0?'positive':'negative')+'">'+fmt(p.realised)+'</b></div>'+
      '<div class="stat"><small>Open cost basis</small><b>'+fmt(p.invested)+'</b></div></div>';
    html+=notice('Realised P&L uses weighted-average cost for recorded buy/sell transactions. Estimates on open stock are excluded from realised profits.');
    html+=sellTimingPanel();
    html+='<div class="card"><h3>Log a trade</h3><form id="ps_trade"><div class="duo"><div class="field"><label>Side</label>'+
      '<select name="side"><option value="buy">Bought</option><option value="sell">Sold</option></select></div>'+
      '<div class="field"><label>Sale method</label><select name="method"><option value="bazaar">Bazaar (0%)</option><option value="market">Item Market (5%)</option><option value="direct">Direct trade (0%)</option></select></div></div>'+
      '<div class="field"><label>Item name</label><input list="ps_names" name="item" required placeholder="Xanax" autocomplete="off"></div>'+
      '<datalist id="ps_names">'+Object.values(state.catalog).slice(0,1400).map(i=>'<option value="'+esc(i.name)+'"></option>').join('')+'</datalist>'+
      '<div class="duo">'+field('qty','Quantity',1)+field('price','Price per unit',0)+'</div>'+
      '<button class="btn" type="submit">Record trade</button></form></div>';
    const holdings=p.positions.filter(x=>x.qty>0);
    html+='<h3>Holdings ('+holdings.length+')</h3>';
    if(!holdings.length)html+='<div class="empty">No open positions recorded.</div>';
    for(const x of holdings){
      const q=state.quotes[x.itemId];const estimate=q&&q.reference?x.qty*q.reference*.95-x.cost:null;
      html+='<div class="card"><div class="line"><strong>'+esc(x.name)+'</strong><span>'+x.qty+' units</span></div>'+
        '<div class="line"><span>Cost basis</span><span>'+fmt(x.cost)+'</span></div>'+
        '<div class="line"><span>Open market estimate after 5% fee</span><span>'+(estimate===null?'—':fmt(estimate))+'</span></div></div>';
    }
    html+='<div class="toolbar"><button class="btn secondary" data-action="export">Export CSV</button>'+
      '<button class="btn secondary" data-action="backup">Backup JSON</button>'+
      '<button class="btn secondary" data-action="import">Restore JSON</button></div>';
    html+='<h3>Recent trades</h3>';
    for(const t of state.trades.slice(-30).reverse()){
      html+='<div class="card"><div class="line"><b>'+esc(t.side.toUpperCase())+' '+esc(t.name)+'</b>'+
        '<button class="btn red" data-delete="'+esc(t.id)+'">Undo entry</button></div>'+
        '<div class="line"><span>'+t.qty+' × '+fmt(t.price)+'</span><span class="muted">'+new Date(t.at).toLocaleString()+'</span></div></div>';
    }
    return html;
  }

  function safeProfitDiagnosticsV111(){
    return {tool:'ProfitStaxx',version:VERSION,at:new Date().toISOString(),
      keyPresent:Boolean(apiKey()),storage:state.storage,screenMounted:Boolean(root&&shell),
      panelOpen:state.open,scanBusy:state.busy,lastFullScanMinutes:state.lastScan?Math.floor((now()-state.lastScan)/60000):null,
      checkedItems:Object.keys(state.quotes).length,stockQuoteAgeMinutes:stockState.at?Math.floor((now()-stockState.at)/60000):null,
      foreignFeedAgeMinutes:travelState.at?Math.floor((now()-travelState.at)/60000):null,
      catalogLoaded:Object.keys(state.catalog).length>0,incomeRecords:moneyRecords().length,
      errorPresent:Boolean(state.error||stockState.error||travelState.error)};
  }
  function renderProfitDiagnosticsV111(){
    const d=safeProfitDiagnosticsV111();
    let h='<div class="card"><h3>ProfitStaxx · diagnostics</h3>'+
      '<p class="muted">These checks contain no Torn API key, player identity, financial amounts, trading holdings or imported item records.</p>'+
      '<div class="toolbar"><button class="btn" data-action="diagcheck">Recheck tools</button>'+
      '<button class="btn secondary" data-action="diagcopy">Copy safe report</button></div>';
    const lines=[['Script version',d.version],['API key detected',d.keyPresent?'Yes':'No'],['Storage',d.storage],
      ['UI mounted',d.screenMounted?'Yes':'No'],['Market scan in progress',d.scanBusy?'Yes':'No'],
      ['Last complete market scan',d.lastFullScanMinutes===null?'Never':d.lastFullScanMinutes+' min ago'],
      ['Market items cached',d.checkedItems],['Stock quotes age',d.stockQuoteAgeMinutes===null?'Unknown':d.stockQuoteAgeMinutes+' min'],
      ['Foreign stock age',d.foreignFeedAgeMinutes===null?'Not scanned':d.foreignFeedAgeMinutes+' min'],
      ['Item catalogue',d.catalogLoaded?'Loaded':'Not loaded'],['Income entries',d.incomeRecords],
      ['An API/data warning exists',d.errorPresent?'Yes':'No']];
    for(const [name,value] of lines)h+='<div class="line"><span>'+esc(name)+'</span><b>'+esc(value)+'</b></div>';
    return h+'</div>'+notice('If the dashboard is empty: verify the script is enabled, check its TornPDA API-key permission and run a manual scan. If prices are missing, check whether the original API reply still matches the expected Torn v2 shape.');
  }

  function renderSettings(){
    const s=state.settings;
    let html='<div class="card"><h3>API privacy and access</h3>'+
      notice('ProfitStaxx requests item catalog, Item Market and Points Market data from Torn API v2. The key is sent only to api.torn.com. No key, trading data or analytics are sent to GitHub or third-party servers.')+
      notice('TornPDA can inject its own key automatically. Manual keys are saved only on this device in TornPDA native script storage, or browser localStorage as fallback. Use a public-access/custom-scoped key for market selections.')+
      '<div class="field"><label>Manual API key (only needed without TornPDA injection)</label>'+
      '<input id="ps_key" type="password" autocomplete="off" placeholder="'+(apiKey()?'Key configured':'Paste key')+'" value=""></div>'+
      '<button class="btn secondary" data-action="savekey">Save entered key</button> '+
      '<button class="btn secondary" data-action="clearkey">Clear manual key</button></div>';
    html+='<div class="card"><h3>Trading and risk settings</h3><form id="ps_settings">'+
      '<div class="duo">'+field('capital','Trading capital ($)',s.capital)+field('maxTradePct','Maximum single trade (%)',s.maxTradePct)+'</div>'+
      '<div class="duo">'+field('maxItemPct','Maximum per item (%)',s.maxItemPct)+field('reservePct','Keep cash uninvested (%)',s.reservePct)+'</div>'+
      '<div class="duo">'+field('minRoi','Minimum net ROI (%)',s.minRoi)+field('minProfit','Minimum total profit ($)',s.minProfit)+'</div>'+
      '<div class="duo">'+field('bazaarDiscount','Bazaar discount versus ask (%)',s.bazaarDiscount)+field('pointFee','Point sale fee (%)',s.pointFee)+'</div>'+
      '<div class="duo">'+field('museumBatch','Museum batch size (1–25)',s.museumBatch||1)+ '<div class="notice">Multi-set pricing consumes cheapest available offers first; missing stock blocks an estimate.</div></div>'+
      '<div class="duo">'+field('alertThreshold','FAB profit badge threshold ($)',s.alertThreshold)+field('scanInterval','Scan interval (seconds)',s.scanInterval)+'</div>'+ 
      '<div class="duo">'+field('reviewMinutes','Estimated minutes of active work per deal',s.reviewMinutes||3)+'</div>'+
      '<div class="field"><label>Preferred exit method</label><select name="method">'+
      ['best','bazaar','market'].map(x=>'<option value="'+x+'" '+(s.method===x?'selected':'')+'>'+esc(x)+'</option>').join('')+
      '</select></div><div class="field"><label>Items to monitor (one exact Torn item name per line)</label>'+
      '<textarea name="watchNames" rows="7" style="width:100%;background:#061b31;color:#fff;border:1px solid #325c79;border-radius:8px;padding:10px">'+
      esc(s.watchNames.join('\n'))+'</textarea></div>'+
      '<button class="btn" type="submit">Save settings</button></form></div>';
    html+=notice('Requests are throttled to 1 per 2.5 seconds. Full scans can take a couple of minutes. Badge alerts update only when Torn is open and visible. No automated buying, selling or page scraping.');
    html+='<p class="muted">ProfitStaxx '+VERSION+' · Storage: '+esc(state.storage)+' · Built by IamEEKY</p>';
    return html;
  }
  function render(){
    if(!root)return;
    if(lastHubPanelState!==state.open){lastHubPanelState=state.open;
      document.dispatchEvent?.(new CustomEvent('staxx:panel',{detail:{id:'profit',open:state.open}}));}
    const valid=activeDealAlerts(),claims=dueDividends(),stockNotices=stockSignals(),noticeCount=valid.length+claims.length+stockNotices.length;
    if(badge){badge.textContent=noticeCount?String(Math.min(99,noticeCount)):'';badge.style.display=noticeCount?'block':'none';}
    document.dispatchEvent?.(new CustomEvent('staxx:notice',{detail:{id:'profit',count:noticeCount,level:claims.length?'urgent':stockNotices.length||valid.length?'warning':'info',summary:claims.length+' dividends · '+stockNotices.length+' stock targets · '+valid.length+' market deals',items:claims.slice(0,2).map(x=>'Collect '+x.acronym+' dividend').concat(stockNotices.slice(0,2).map(x=>x.title)).concat(valid.slice(0,2).map(d=>String(d.name||d.itemName||'Market opportunity'))),alerts:[...claims.map(x=>({id:'stock-claim',title:'Claim '+x.acronym+' dividend',detail:'Ready for withdrawal in Torn Stock Exchange'})),...stockNotices.map(x=>({id:x.id,title:x.title,detail:x.why})),...valid.slice(0,25).map(d=>({id:'deal-'+Number(d.id),title:'Buy up to '+Math.floor(d.qty)+' '+String(d.name||'items'),detail:'Estimated profit '+fmt(d.profit)+' · max '+fmt(d.buy)+'/unit'}))]}}));
    document.dispatchEvent?.(new CustomEvent('staxx:actions',{detail:{id:'profit',items:profitNextActions(),updated:state.lastScan||now()}}));
    const summaryPortfolio=portfolio();
    document.dispatchEvent?.(new CustomEvent('staxx:summary',{detail:{id:'profit',headline:state.lastScan?'Last scan '+age(state.lastScan):'Awaiting market scan',metrics:[
      {label:'Fresh deals',value:state.lastScan?String(valid.length):'Not scanned'},
      {label:'Recorded invested',value:human(summaryPortfolio.invested)},
      {label:'Realised P/L',value:fmt(summaryPortfolio.realised)},
      {label:'30d other income',value:fmt(moneyRecords().filter(x=>x.at>=now()-30*86400000).reduce((n,x)=>n+Number(x.net||0),0))}
    ],updated:state.lastScan||now()}}));
    if(!state.open){shell.classList.remove('active');return;}
    shell.classList.add('active');
    const tabs=['alerts','daily','best','scan','travel','stocks','capital','history','income','museum','portfolio','settings','diagnostics'];
    const labels=['Alerts '+noticeCount,'Today','Best','Deals','Travel','Stocks','Capital','Charts','Income','Museum','Ledger','Settings','Diagnostics'];
    const active=state.tab;
    const content=active==='alerts'?renderAlerts():active==='scan'?renderScan():active==='museum'?renderMuseum():
      active==='portfolio'?renderPortfolio():active==='daily'?renderDailyPlanV111():active==='stocks'?renderStockPanel():active==='travel'?renderTravel():active==='best'?renderRankings():active==='capital'?renderCapital():active==='history'?renderHistory():active==='income'?renderRevenuePanel():active==='diagnostics'?renderProfitDiagnosticsV111():renderSettings();
    // Preserve the actual inner scroll container across progressive scans and any other renders.
    // TornPDA WebView otherwise snaps to the beginning when shell.innerHTML is replaced.
    const previousBody=shell.querySelector('.body'),previousTabs=shell.querySelector('.tabs');
    if(previousBody&&lastRenderedTab)scrollPositions[lastRenderedTab]=previousBody.scrollTop;
    const tabScroll=previousTabs?previousTabs.scrollLeft:0;
    const focused=root.activeElement;
    let edit=null;
    if(focused&&shell.contains(focused)&&/^(INPUT|TEXTAREA|SELECT)$/.test(focused.tagName)){
      let start=null,end=null;
      try{start=focused.selectionStart;end=focused.selectionEnd;}catch(_){}
      const form=focused.form;
      const fields=form?[...form.elements].filter(x=>x&&x.name&&'value' in x).map(x=>({name:x.name,value:x.value,checked:x.type==='checkbox'?x.checked:null})):[];
      edit={id:focused.id,name:focused.name,value:focused.value,start,end,fields,
        formId:form?.id||'',checked:focused.type==='checkbox'?focused.checked:null,tab:lastRenderedTab};
    }
    shell.innerHTML='<div class="panel" role="dialog" aria-modal="true" aria-label="ProfitStaxx">'+
      '<div class="heading"><div><div class="brand">Profit<span style="color:#54d7fa">Staxx</span></div><div class="sub">Profit intelligence · v'+VERSION+'</div></div>'+
      '<button class="close" data-action="close">Close ×</button></div>'+
      '<nav class="tabs">'+tabs.map((name,i)=>'<button class="tab '+(name===active?'active':'')+
      '" data-tab="'+name+'">'+labels[i]+'</button>').join('')+'</nav>'+
      '<main class="body">'+content+'</main><div class="footer">'+
      'Estimates only · API cached · Never auto-trades · '+esc(state.status)+'</div></div>';
    lastRenderedTab=active;
    const body=shell.querySelector('.body'),nav=shell.querySelector('.tabs');
    if(body)body.scrollTop=scrollPositions[active]||0;
    if(nav)nav.scrollLeft=tabScroll;
    if(edit&&edit.tab===active){
      const replacementForm=edit.formId?shell.querySelector('#'+edit.formId):null;
      if(replacementForm)for(const entry of edit.fields){
        const input=[...replacementForm.elements].find(x=>x.name===entry.name);
        if(input){input.value=entry.value;if(entry.checked!==null)input.checked=entry.checked;}
      }
      const replacement=[...shell.querySelectorAll('input,textarea,select')].find(x=>edit.id?x.id===edit.id:x.name===edit.name);
      if(replacement){replacement.value=edit.value;if(edit.checked!==null)replacement.checked=edit.checked;
        replacement.focus({preventScroll:true});
        if(Number.isInteger(edit.start)&&Number.isInteger(edit.end)&&typeof replacement.setSelectionRange==='function'){
          try{replacement.setSelectionRange(edit.start,edit.end);}catch(_){}}
      }
    }
    if(state.alertFocus){const focus='ps-alert-'+String(state.alertFocus);const target=[...shell.querySelectorAll('[id]')].find(x=>x.id===focus);
      if(target){target.style.outline='2px solid #54d7fa';target.scrollIntoView?.({block:'nearest'});}state.alertFocus='';}
  }
  async function exportFile(name,text,mime){
    const blob=new Blob([text],{type:mime});const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=name;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function exportCSV(){
    const header=['date','side','item_id','name','quantity','unit_price','fee_percent','method'];
    const quote=x=>'"'+String(x==null?'':x).replace(/"/g,'""')+'"';
    return [header.join(','),...state.trades.map(t=>[new Date(t.at).toISOString(),t.side,t.itemId,t.name,t.qty,t.price,t.fee,t.method].map(quote).join(','))].join('\n');
  }
  async function importBackup(){
    const input=document.createElement('input');input.type='file';input.accept='.json,application/json';
    input.onchange=async()=>{
      try{
        const file=input.files&&input.files[0];if(!file)return;
        const parsed=JSON.parse(await file.text());
        if(!Array.isArray(parsed.trades)||typeof parsed.settings!=='object')throw new Error('Not a valid ProfitStaxx backup.');
        if(!confirm('Replace your current local ledger and settings with this backup?'))return;
        if(Array.isArray(parsed.income))putMoney(parsed.income.filter(x=>x&&Number.isFinite(Number(x.net))&&Number(x.at)>0));
        if(parsed.dailyReviews&&typeof parsed.dailyReviews==='object'&&!Array.isArray(parsed.dailyReviews))state.dailyReviews=parsed.dailyReviews;
         state.trades=parsed.trades.filter(t=>t&&Number.isInteger(Number(t.itemId))&&['buy','sell'].includes(t.side)&&Number(t.qty)>0&&Number(t.price)>0);
        state.settings=Object.assign({},DEFAULTS,parsed.settings,{key:state.settings.key});
        await persist();render();
      }catch(e){alert('Import failed: '+e.message);}
    };
    input.click();
  }
  function onClick(event){
    const el=event.target.closest('button[data-action],button[data-tab],button[data-delete],button[data-owned],button[data-income-id],button[data-stock-clear],button[data-rank-filter],button[data-chart-days],button[data-daily-review]');
    if(!el)return;
    if(el.dataset.dailyReview){const id=el.dataset.dailyReview,d=new Date().toISOString().slice(0,10);
      const keys=Object.keys(state.dailyReviews||{}).filter(k=>k>=new Date(now()-8*86400000).toISOString().slice(0,10));
      state.dailyReviews=Object.fromEntries(keys.map(k=>[k,state.dailyReviews[k]]));
      const record=state.dailyReviews[d]||{};record[id]=!record[id];state.dailyReviews[d]=record;
      persist();render();return;}
    if(el.dataset.chartDays){state.chartDays=[7,30,90].includes(Number(el.dataset.chartDays))?Number(el.dataset.chartDays):30;render();return;}
    if(el.dataset.rankFilter){state.rankFilter=['all','active','passive'].includes(el.dataset.rankFilter)?el.dataset.rankFilter:'all';render();return;}
    if(el.dataset.tab){state.tab=el.dataset.tab;render();if(state.tab==='stocks'&&now()-stockState.at>300000)refreshStocks();return;}
    if(el.dataset.owned){const name=el.dataset.owned;const owned=state.settings.museumOwned||{};
      owned[name]=Math.max(0,Math.floor(number(owned[name])+Number(el.dataset.delta||0)));
      state.settings.museumOwned=owned;persist();render();return;}
    if(el.dataset.stockClear){delete state.settings.stockTargets[el.dataset.stockClear];persist();render();return;}
    if(el.dataset.incomeId){if(confirm('Delete income record?')){putMoney(moneyRecords().filter(x=>x.id!==el.dataset.incomeId));render();}return;}
    if(el.dataset.delete){
      if(confirm('Remove this manual ledger entry? Later sales may depend on it.')){
        state.trades=state.trades.filter(t=>t.id!==el.dataset.delete);persist();render();
      }
      return;
    }
    switch(el.dataset.action){
      case 'market-buy':{
        const id=Number(el.dataset.id),d=activeDealAlerts().find(x=>Number(x.id)===id);
        if(!d||!Number.isInteger(Math.floor(d.qty))||d.qty<1){state.error='Opportunity expired; refresh the scan.';render();return;}
        try{sessionStorage.setItem('profitstaxx-market-intent-v1',JSON.stringify({id,qty:Math.floor(d.qty),maxPrice:Number(d.buy),name:String(d.name||'Item').slice(0,80),at:now()}));}
        catch(_){state.error='Cannot save the quantity for this navigation. Enter it manually.';render();return;}
        location.assign(linkToItem(id));break;
      }
      case 'market-view':{
        const id=Number(el.dataset.id);
        if(Number.isSafeInteger(id)&&id>0)location.assign(linkToItem(id));
        break;
      }
      case 'close':state.open=false;render();break;
      case 'scan':scan({manual:true});break;
      case 'quickscan':scan({manual:true,quick:true});break;
      case 'stopscan':if(state.busy){state.cancelScan=true;state.status='Stopping after current request…';render();}break;
      case 'diagcheck':document.dispatchEvent(new CustomEvent('staxx:ping'));document.dispatchEvent(new CustomEvent('staxx:diagnostics-request'));render();break;
      case 'diagcopy':{const text=JSON.stringify(safeProfitDiagnosticsV111(),null,2);
        if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).catch(()=>{alert('Clipboard unavailable; use StaxxHub diagnostics to view the report.');});
        else alert('Clipboard unavailable; use StaxxHub diagnostics to view the report.');break;}
      case 'stockrefresh':refreshStocks();break;
      case 'travelscan':scanTravel();break;
      case 'inventoryscan':refreshInventoryV112();break;
      case 'rank-open':{
        const r=incomeCandidates().find(x=>x.id===el.dataset.rankId);if(!r)return;
        if(r.kind==='market'){
          const d=activeDealAlerts().find(x=>x.id===r.itemId);
          if(!d){state.tab='scan';render();break;}
          try{sessionStorage.setItem('profitstaxx-market-intent-v1',JSON.stringify({id:d.id,qty:Math.floor(d.qty),maxPrice:d.buy,name:d.name,at:now()}));}
          catch(_){state.error='Could not prepare quantity; confirm it yourself.';}
          location.assign(linkToItem(r.itemId));break;
        }
        if(r.route==='museum'){state.tab='museum';render();break;}
        const src=incomeRoutes.find(x=>x[0]===r.route);if(src)location.assign('https://www.torn.com'+src[2]);break;
      }
      case 'allocation-open':{const src=incomeRoutes.find(x=>x[0]===el.dataset.source);if(src)location.assign('https://www.torn.com'+src[2]);break;}
      case 'stockpage':location.assign('https://www.torn.com/page.php?sid=stocks');break;
      case 'incomepage':{const row=incomeRoutes.find(x=>x[0]===el.dataset.source);if(row)location.assign('https://www.torn.com'+row[2]);break;}
      case 'export':exportFile('profitstaxx-trades.csv',exportCSV(),'text/csv;charset=utf-8');break;
      case 'backup':exportFile('profitstaxx-backup.json',JSON.stringify({
        version:VERSION,trades:state.trades,income:moneyRecords(),dailyReviews:state.dailyReviews,settings:Object.assign({},state.settings,{key:''})},null,2),'application/json');break;
      case 'import':importBackup();break;
      case 'savekey':{
        const key=shell.querySelector('#ps_key').value.trim();
        if(!key){alert('Enter an API key first.');return;}
        state.settings.key=key;persist();render();break;
      }
      case 'clearkey':state.settings.key='';persist();render();break;
    }
  }
  function onSubmit(event){
    if(event.target.id==='ps_trade'){
      event.preventDefault();
      const f=new FormData(event.target),side=f.get('side'),method=f.get('method');
      const item=getItem(f.get('item'));
      try{
        if(!item)throw new Error('Item not recognised. Load the catalog via a scan first.');
        addTrade({side,itemId:item.id,qty:f.get('qty'),price:f.get('price'),
          fee:method==='market'?5:0,method});
      }catch(e){alert(e.message);}
    }else if(event.target.id==='ps_revenue'){
      event.preventDefault();const f=new FormData(event.target),a=Number(f.get('received')),b=Number(f.get('spent')),minutes=Number(f.get('minutes'));
      if(![a,b,minutes].every(n=>Number.isFinite(n)&&n>=0&&n<=1e12)){alert('Use non-negative figures.');return;}
      const source=String(f.get('source'));if(!incomeRoutes.some(x=>x[0]===source))return;
      const records=moneyRecords();records.push({id:now()+'_'+Math.random().toString(36).slice(2,6),at:now(),source,net:a-b,minutes,note:String(f.get('note')||'').slice(0,100)});
      putMoney(records);render();
    }else if(event.target.id==='ps_daily_limits'){
      event.preventDefault();const f=new FormData(event.target),minutes=Number(f.get('dailyReviewMinutes'));
      if(!Number.isFinite(minutes)||minutes<1||minutes>240){alert('Enter between 1 and 240 minutes.');return;}
      state.settings.dailyReviewMinutes=minutes;persist();render();
    }else if(event.target.id==='ps_allocation'){
      event.preventDefault();const f=new FormData(event.target),keys=['allocMarket','allocTravel','allocStock','allocBank'];
      const inputs=keys.map(k=>Number(f.get(k)));
      if(!inputs.every(x=>Number.isFinite(x)&&x>=0&&x<=100)||inputs.reduce((a,b)=>a+b,0)<=0){alert('Enter non-negative weights with a positive total.');return;}
      keys.forEach((k,i)=>state.settings[k]=inputs[i]);persist();render();
    }else if(event.target.id==='ps_stocktargets'){
      event.preventDefault();const f=new FormData(event.target),id=String(f.get('stockId')),
        buy=Number(f.get('stockBuy')),sell=Number(f.get('stockSell'));
      if(!stockRows().some(x=>String(x.id)===id)||![buy,sell].every(x=>Number.isFinite(x)&&x>=0&&x<=1e15)){alert('Invalid price target');return;}
      state.settings.stockTargets=state.settings.stockTargets||{};
      if(!buy&&!sell)delete state.settings.stockTargets[id];else state.settings.stockTargets[id]={buy,sell};persist();render();
      if(Object.keys(state.settings.stockTargets).length&&now()-stockState.at>10*60000)refreshStocks();
    }else if(event.target.id==='ps_travelsettings'){
      event.preventDefault();const f=new FormData(event.target);
      state.settings.travelCapacity=clamp(Math.floor(number(f.get('travelCapacity'))||10),1,200);
      state.settings.travelMinProfit=clamp(number(f.get('travelMinProfit')),0,1e12);
      state.settings.travelMinutes=String(f.get('travelMinutes')||'').slice(0,1500);persist();render();
    }else if(event.target.id==='ps_passive'){
      event.preventDefault();const f=new FormData(event.target);
      for(const key of ['bankPrincipal','bankApr','rentalAssetValue','rentalNetWeekly']){
        const v=Number(f.get(key));if(!Number.isFinite(v)||v<0||v>1e15){alert('Enter a valid non-negative value for '+key);return;}
        state.settings[key]=key==='bankApr'?clamp(v,0,100):v;
      }
      persist();render();
    }else if(event.target.id==='ps_settings'){
      event.preventDefault();
      const f=new FormData(event.target),s=state.settings;
      for(const key of ['capital','maxTradePct','maxItemPct','reservePct','minRoi','minProfit',
        'bazaarDiscount','pointFee','alertThreshold','scanInterval','museumBatch','reviewMinutes'])s[key]=number(f.get(key));
      s.maxTradePct=clamp(s.maxTradePct,0.1,100);s.maxItemPct=clamp(s.maxItemPct,0.1,100);
      s.reservePct=clamp(s.reservePct,0,99);s.bazaarDiscount=clamp(s.bazaarDiscount,0,99);
      s.pointFee=clamp(s.pointFee,0,50);s.scanInterval=clamp(s.scanInterval,90,3600);s.museumBatch=clamp(Math.floor(s.museumBatch||1),1,25);s.reviewMinutes=clamp(s.reviewMinutes||3,0.5,60);
      s.method=['best','bazaar','market'].includes(f.get('method'))?f.get('method'):'best';
      s.watchNames=[...new Set(String(f.get('watchNames')||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean))].slice(0,40);
      persist();state.status='Settings saved';render();
    }
  }
  function mount(){
    if(document.getElementById('profitstaxx-host'))return;
    const host=document.createElement('div');host.id='profitstaxx-host';
    document.documentElement.appendChild(host);
    root=host.attachShadow({mode:'open'});
    const style=document.createElement('style');style.textContent=css();root.appendChild(style);
    fab=document.createElement('button');fab.className='fab';fab.textContent='PS';fab.style.display='none';fab.setAttribute('aria-label','Open ProfitStaxx');
    badge=document.createElement('span');badge.className='bubble';badge.style.display='none';fab.appendChild(badge);
    fab.addEventListener('click',()=>{state.open=!state.open;render();});
    root.appendChild(fab);
    shell=document.createElement('div');shell.className='overlay';
    shell.addEventListener('click',e=>{if(e.target===shell){state.open=false;render();}else onClick(e);});
    shell.addEventListener('submit',onSubmit);
    root.appendChild(shell);
    render();
  }
  document.addEventListener('staxx:open',e=>{if(e.detail?.id==='profit'){state.open=true;if(e.detail.alertId){state.tab=e.detail.alertId==='stock-claim'?'stocks':e.detail.alertId==='daily-plan'?'daily':'alerts';state.alertFocus=['stock-claim','daily-plan'].includes(e.detail.alertId)?'':String(e.detail.alertId);}render();}else if(state.open){state.open=false;render();}});
  document.addEventListener('staxx:closeall',()=>{if(state.open){state.open=false;render();}});
  document.addEventListener('staxx:ping',()=>document.dispatchEvent(new CustomEvent('staxx:register',{detail:{id:'profit',label:'ProfitStaxx',icon:'PS',desc:'Daily profit · Markets · Stocks',trendMetric:'Fresh deals',freshnessMs:600000}})));
  document.addEventListener('staxx:diagnostics-request',()=>{
    document.dispatchEvent(new CustomEvent('staxx:diagnostics',{detail:{id:'profit',version:VERSION,
      api:!apiKey()?'missing':!state.lastScan||now()-state.lastScan>900000?'stale':'ready',
      storage:state.storage==='TornPDA'?'ready':'unknown',ui:root&&shell?'ready':'missing',
      detail:state.busy?'Market scan in progress':'Market quotes '+(state.lastScan?'last checked '+age(state.lastScan):'not yet fully scanned')}}));
  });
  function marketAssist(){
    if(!/\/page\.php$/i.test(location.pathname)||!location.search.includes('sid=ItemMarket'))return;
    let p;try{p=JSON.parse(sessionStorage.getItem('profitstaxx-market-intent-v1')||'null');}catch(_){return;}
    const correctItem=()=>{const match=String(location.hash||'').match(/(?:^|[&#])itemID=(\d+)(?:&|$)/);return match&&Number(match[1])===p.id;};
    if(!p||!Number.isInteger(p.id)||!Number.isInteger(p.qty)||p.qty<1||p.qty>1000000||now()-p.at>600000||!correctItem())return;
    const box=document.createElement('div');box.id='ps-market-assist';box.style.cssText='position:fixed;z-index:2147483639;right:12px;bottom:12px;max-width:310px;background:#08192d;color:#e8f7ff;border:1px solid #54d7fa;border-radius:12px;padding:12px;font:13px system-ui;box-shadow:0 5px 28px #000a';
    const title=document.createElement('b');title.textContent='ProfitStaxx · '+p.name+' × '+p.qty;
    const status=document.createElement('p');status.textContent='Check live listing price (modeled cap $'+Math.round(p.maxPrice).toLocaleString('en-US')+'/unit). Looking for Buy quantity field…';
    const copy=document.createElement('button');copy.textContent='Copy quantity';copy.onclick=()=>{const v=String(p.qty);if(navigator.clipboard?.writeText)navigator.clipboard.writeText(v).then(()=>status.textContent='Copied '+v).catch(()=>status.textContent='Quantity: '+v);else status.textContent='Quantity: '+v;};
    const close=document.createElement('button');close.textContent='Close ×';close.style.marginLeft='10px';
    box.append(title,status,copy,close);document.body.appendChild(box);
    let filled=false,count=0,observer,timer;
    const stop=()=>{observer?.disconnect();clearInterval(timer);sessionStorage.removeItem('profitstaxx-market-intent-v1');};
    close.onclick=()=>{stop();box.remove();};
    const attempt=()=>{
      if(filled)return;
      if(!correctItem()){stop();box.remove();return;}
      if(++count>120){stop();status.textContent='Buy field not detected. Copy quantity and enter it manually.';return;}
      const found=[...document.querySelectorAll('input')].filter(el=>{
        if(box.contains(el)||el.disabled||!el.getClientRects?.().length)return false;
        const hint=[el.name,el.id,el.placeholder,el.getAttribute('aria-label')].join(' ').toLowerCase();
        const parent=(el.closest('[role=dialog],[class*=buy],[class*=purchase]')?.textContent||'').slice(0,400).toLowerCase();
        return /qty|quantity|amount/.test(hint)&&(/buy|purchase/.test(parent)||/buy|purchase/.test(hint));
      });
      if(found.length!==1||found[0].value&&Number(found[0].value)!==1)return;
      const el=found[0],set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set;
      if(set)set.call(el,String(p.qty));else el.value=String(p.qty);
      el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));
      filled=true;stop();status.textContent='Quantity '+p.qty+' filled. Verify price and press Buy yourself.';
    };
    observer=new MutationObserver(attempt);observer.observe(document.body,{childList:true,subtree:true});
    timer=setInterval(attempt,800);attempt();
  }
  const autoChecksV112={full:0,quick:0,travel:0,stocks:0,inventory:0};
  let autoTickRunningV112=false;
  async function autoTickV112(){
    if(autoTickRunningV112||document.hidden||!apiKey()||state.busy||travelState.busy||stockState.loading)return;
    autoTickRunningV112=true;
    try{
      const time=now();
      // Full scans may be lengthy: never repeat faster than 45 minutes, including failures.
      if((!state.lastScan||time-state.lastScan>=60*60000)&&time-autoChecksV112.full>=45*60000){
        autoChecksV112.full=time;await scan({manual:false});return;
      }
      if(time-travelState.at>=20*60000&&time-autoChecksV112.travel>=20*60000){
        autoChecksV112.travel=time;await scanTravel();return;
      }
      if(time-stockState.at>=10*60000&&time-autoChecksV112.stocks>=10*60000){
        autoChecksV112.stocks=time;await refreshStocks();return;
      }
      if(time-state.inventoryAt>=30*60000&&time-autoChecksV112.inventory>=30*60000){
        autoChecksV112.inventory=time;await refreshInventoryV112();return;
      }
      if(time-Math.max(autoChecksV112.quick,state.lastScan)>=12*60000){
        autoChecksV112.quick=time;await scan({manual:false,quick:true});
      }
    }catch(e){state.error='Automatic data check failed: '+String(e?.message||e);render();}
    finally{autoTickRunningV112=false;}
  }
  async function init(){
    mount();
    marketAssist();
    document.dispatchEvent(new CustomEvent('staxx:register',{detail:{id:'profit',label:'ProfitStaxx',icon:'PS',desc:'Daily profit · Markets · Stocks',trendMetric:'Fresh deals',freshnessMs:600000}}));
    try{
      const loaded=await readStore();
      state.settings=Object.assign({},DEFAULTS,loaded.settings||{});
      state.trades=Array.isArray(loaded.trades)?loaded.trades:[];
       state.income=Array.isArray(loaded.income)?loaded.income:[];
       travelState.rows=Array.isArray(loaded.travelRows)?loaded.travelRows:[];
       travelState.at=number(loaded.travelAt);
       state.stockHistory=loaded.stockHistory&&typeof loaded.stockHistory==='object'&&!Array.isArray(loaded.stockHistory)?loaded.stockHistory:{};
       state.stockCache=Array.isArray(loaded.stockCache)?loaded.stockCache:[];
       state.stockCacheAt=number(loaded.stockCacheAt);
       state.dailyReviews=loaded.dailyReviews&&typeof loaded.dailyReviews==='object'&&!Array.isArray(loaded.dailyReviews)?loaded.dailyReviews:{};
       state.inventoryOwned=loaded.inventoryOwned&&typeof loaded.inventoryOwned==='object'&&!Array.isArray(loaded.inventoryOwned)?loaded.inventoryOwned:{};
       state.inventoryAt=number(loaded.inventoryAt);
       stockState.all=state.stockCache;stockState.at=state.stockCacheAt;
       if(!state.income.length){try{const prev=JSON.parse(localStorage.getItem('profitstaxx_income_v1')||'[]');if(Array.isArray(prev)&&prev.length){state.income=prev.slice(-1000);persist();}}catch(_){}}
      state.catalog=loaded.catalog||{};
      state.quotes=loaded.quotes||{};
      state.snapshots=loaded.snapshots||{};
      state.pointsPrice=number(loaded.pointsPrice);
      state.lastScan=number(loaded.lastScan);
      state.status='Ready · '+state.storage+' storage';
    }catch(e){state.error='Could not restore local data: '+e.message;}
    render();
    // Read-only autopilot: one bounded data task at a time, while Torn is foregrounded.
    // Prioritise missing/old full scans, then travel, stocks and short incremental quotes.
    scanTimer=setInterval(()=>{void autoTickV112();},60000);
    setTimeout(()=>{void autoTickV112();},10000);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){render();void autoTickV112();}});

  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
