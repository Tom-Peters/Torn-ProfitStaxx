/* Shared Staxx Hub v1 · bundled into each Torn PDA script · IamEEKY */
(function(){
  "use strict";
  if(!/^(www\.)?torn\.com$/i.test(location.hostname)||window.top!==window.self)return;
  function boot(){
    if(document.getElementById("staxx-hub-root"))return;
    const root=document.createElement("div");
    root.id="staxx-hub-root";
    root.innerHTML='<button id="staxx-hub-toggle" aria-expanded="false" aria-label="Open Staxx tools and notifications"><b>S</b><span id="staxx-hub-count" hidden></span></button>'+
      '<div id="staxx-hub-veil" hidden></div><aside id="staxx-hub-drawer" aria-label="Staxx tools and notifications" hidden>'+
      '<header><div><strong>Staxx<span>Hub</span></strong><small>TORN COMMAND CENTRE</small></div><button data-hub-close aria-label="Close menu">×</button></header>'+
      '<div class="staxx-scroll"><h3>YOUR TOOLS</h3><div id="staxx-hub-tools"></div>'+
      '<div class="staxx-label"><h3>NOTIFICATIONS</h3><span id="staxx-hub-total"></span></div><div id="staxx-hub-alerts"></div>'+
      '<p class="staxx-foot">Read-only alerts · No automatic game actions</p></div></aside>';
    const css=document.createElement("style");
    css.id="staxx-hub-css";
    css.textContent=[
      '#staxx-hub-root{position:fixed!important;inset:0!important;z-index:2147483647!important;pointer-events:none!important;font:14px/1.45 system-ui,-apple-system,Segoe UI,sans-serif!important;color:#e7f2ff!important}',
      '#staxx-hub-root *{box-sizing:border-box}#staxx-hub-root button{font:inherit;color:inherit;cursor:pointer;touch-action:manipulation}',
      '#staxx-hub-root [hidden]{display:none!important}#staxx-hub-root button:focus-visible{outline:2px solid #73dfff;outline-offset:2px}',
      '#staxx-hub-toggle{position:fixed;left:5px;top:43%;width:47px;height:54px;pointer-events:auto;display:flex;align-items:center;justify-content:center;border:1px solid #69dfff99;border-radius:0 15px 15px 0;background:linear-gradient(150deg,#0b74ba,#082a4a);box-shadow:0 6px 24px #000b}',
      '#staxx-hub-toggle b{font-weight:900;font-size:24px;color:#baf1ff}#staxx-hub-count{position:absolute;top:-8px;right:-8px;background:#36d3a7;color:#052c25;border:2px solid #08192d;border-radius:20px;font-size:11px;font-weight:900;padding:2px 5px}',
      '#staxx-hub-veil{position:fixed;inset:0;pointer-events:auto;background:#020a17b9}',
      '#staxx-hub-drawer{position:fixed;inset:0 auto 0 0;width:min(360px,calc(100vw - 24px));height:100dvh;max-height:100vh;pointer-events:auto;background:#08192d;border-right:1px solid #28506e;box-shadow:10px 0 45px #000b;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top)}',
      '#staxx-hub-drawer header{display:flex;align-items:center;justify-content:space-between;padding:16px;background:linear-gradient(120deg,#0c3358,#0b203b);border-bottom:1px solid #28506e}',
      '#staxx-hub-drawer header strong{display:block;font-size:22px;font-weight:850;letter-spacing:-.5px}#staxx-hub-drawer header strong span{color:#54d7fa}',
      '#staxx-hub-drawer header small{font-size:10px;letter-spacing:1.4px;color:#8fabca}#staxx-hub-drawer [data-hub-close]{background:#1c3b59;border:0;border-radius:9px;width:36px;height:36px;font-size:24px}',
      '#staxx-hub-drawer .staxx-scroll{flex:1;overflow:auto;overscroll-behavior:contain;padding:14px 12px 30px}',
      '#staxx-hub-drawer h3{color:#8faec9;font-size:11px;letter-spacing:1px;margin:5px 3px 10px}',
      '#staxx-hub-drawer .staxx-tool{display:flex;align-items:center;gap:10px;text-align:left;width:100%;background:#102844;border:1px solid #284b6b;border-radius:12px;padding:12px 10px;min-height:67px;margin-bottom:9px}',
      '#staxx-hub-drawer .staxx-icon{width:40px;height:40px;display:grid;place-items:center;border-radius:10px;background:linear-gradient(135deg,#0b79b9,#123c65);border:1px solid #4f9dc8;color:#cff6ff;font-weight:900;flex-shrink:0}',
      '#staxx-hub-drawer .staxx-info{flex:1;min-width:0}#staxx-hub-drawer .staxx-info b{display:block;font-size:14px}#staxx-hub-drawer .staxx-info small{display:block;font-size:11px;color:#94b1c9;margin-top:3px}',
      '#staxx-hub-drawer .staxx-pill{border-radius:14px;background:#1b486c;padding:2px 7px;font-size:11px;font-weight:800;color:#bdeaff}#staxx-hub-drawer .staxx-pill.on{background:#145f58;color:#89edca}',
      '#staxx-hub-drawer .staxx-label{display:flex;align-items:center;justify-content:space-between;margin-top:18px}#staxx-hub-drawer .staxx-label span{color:#a4c1d8;font-size:11px}',
      '#staxx-hub-drawer .staxx-alert{display:block;width:100%;text-align:left;background:#0e2945;border:1px solid #315977;border-radius:11px;padding:12px;margin-bottom:8px}',
      '#staxx-hub-drawer .staxx-alert b{display:block;color:#81dbfa;font-size:12px}#staxx-hub-drawer .staxx-alert span{display:block;color:#daecf9;font-size:12px;margin:5px 0}#staxx-hub-drawer .staxx-alert small{display:block;color:#91aec6;font-size:11px;margin-top:3px}',
      '#staxx-hub-drawer .staxx-empty{color:#9db7cd;background:#0c243e;border:1px dashed #305473;border-radius:10px;font-size:12px;padding:17px 12px}',
      '#staxx-hub-drawer .staxx-foot{font-size:10px;color:#6d90ab;margin-top:20px}'
    ].join("");
    document.documentElement.append(css,root);
    const catalog=[{id:"profit",label:"ProfitStaxx",icon:"PS",desc:"Market · Museum · Ledger"},
      {id:"company",label:"Company Helper",icon:"CO",desc:"Staff · Training · Growth"},
      {id:"happy",label:"Happy Jump",icon:"HJ",desc:"Gym · Schedule · Recovery"}];
    const active=Object.create(null),notices=Object.create(null);
    const toggle=root.querySelector("#staxx-hub-toggle"),veil=root.querySelector("#staxx-hub-veil"),drawer=root.querySelector("#staxx-hub-drawer");
    const tools=root.querySelector("#staxx-hub-tools"),alerts=root.querySelector("#staxx-hub-alerts"),bubble=root.querySelector("#staxx-hub-count");
    let expanded=false;
    function el(tag,cls,value){const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=String(value);return n;}
    function expand(value){expanded=!!value;veil.hidden=drawer.hidden=!expanded;toggle.hidden=expanded;toggle.setAttribute("aria-expanded",String(expanded));}
    function openTool(id){
      if(id==="company"&&!/^\/companies\.php$/i.test(location.pathname)){
        try{sessionStorage.setItem("staxx-open-company","1");}catch(_){}
        location.assign(location.origin+"/companies.php");return;
      }
      if(!active[id]){const info=catalog.find(x=>x.id===id);alerts.replaceChildren(el("p","staxx-empty",(info?info.label:"Script")+" is not running. Enable it in Torn PDA, then reload this page."));return;}
      expand(false);
      document.dispatchEvent(new CustomEvent("staxx:closeall"));
      document.dispatchEvent(new CustomEvent("staxx:open",{detail:{id:id}}));
    }
    function render(){
      tools.replaceChildren();alerts.replaceChildren();
      let total=0;
      for(const info of catalog){
        const n=Math.min(99,Math.max(0,Number(notices[info.id]?.count)||0));total+=n;
        const btn=el("button","staxx-tool");btn.type="button";btn.dataset.openStaxx=info.id;
        const txt=el("span","staxx-info");txt.append(el("b","",info.label),el("small","",active[info.id]?info.desc:"Not loaded · enable in Torn PDA"));
        btn.append(el("span","staxx-icon",info.icon),txt,el("span","staxx-pill"+(n?" on":""),n||"›"));tools.append(btn);
      }
      bubble.hidden=total<1;bubble.textContent=total>=100?"99+":String(total);
      root.querySelector("#staxx-hub-total").textContent=total?total+" active":"All clear";
      let any=false;
      for(const info of catalog){
        const d=notices[info.id];if(!d||!(d.count>0))continue;any=true;
        const btn=el("button","staxx-alert");btn.type="button";btn.dataset.openStaxx=info.id;
        btn.append(el("b","",info.label+" · "+d.count+" alert"+(d.count===1?"":"s")),el("span","",d.summary||"Needs attention"));
        for(const item of d.items.slice(0,3))btn.append(el("small","",item));alerts.append(btn);
      }
      if(!any)alerts.append(el("p","staxx-empty","Nothing needs your attention right now."));
    }
    root.addEventListener("click",e=>{const target=e.target.closest("button[data-open-staxx]");if(target)openTool(target.dataset.openStaxx);else if(e.target.closest("#staxx-hub-toggle"))expand(true);else if(e.target===veil||e.target.closest("[data-hub-close]"))expand(false);});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&expanded)expand(false);});
    document.addEventListener("staxx:register",e=>{const id=e.detail?.id;if(catalog.some(x=>x.id===id)){active[id]=true;render();}});
    document.addEventListener("staxx:notice",e=>{const d=e.detail||{},id=d.id;if(!catalog.some(x=>x.id===id))return;
      const clean={count:Math.min(99,Math.max(0,Math.floor(Number(d.count)||0))),summary:String(d.summary||"").slice(0,160),
        items:Array.isArray(d.items)?d.items.slice(0,5).map(v=>String(v).slice(0,160)):[]};
      if(JSON.stringify(clean)!==JSON.stringify(notices[id])){notices[id]=clean;render();}
    });
    render();
    document.dispatchEvent(new CustomEvent("staxx:ping"));
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
