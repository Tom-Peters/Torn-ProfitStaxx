/* StaxxHub v3.1 · shared Torn PDA launcher · IamEEKY · no external dependencies */
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
      '<header class="staxx-head"><div><strong>Staxx<span>Hub</span></strong><small>YOUR TORN COMMAND CENTRE</small></div><div class="staxx-head-actions"><button type="button" data-hub-find aria-label="Find tools, sections and actions" aria-expanded="false" title="Find tools and actions">⌕</button><button type="button" data-hub-close aria-label="Close sidebar">×</button></div></header>' +
      '<nav class="staxx-main-tabs" aria-label="StaxxHub sections"><button type="button" data-hub-view="today" aria-pressed="true">Today</button><button type="button" data-hub-view="dashboard" aria-pressed="false">Dashboard</button><button type="button" data-hub-view="activity" aria-pressed="false">Activity</button><button type="button" data-hub-view="tools" aria-pressed="false">Tools</button><button type="button" data-hub-view="alerts" aria-pressed="false">Alerts</button><button type="button" data-hub-view="more" aria-pressed="false">More</button></nav>' +
      '<section id="staxx-hub-find" aria-label="Find Staxx tools and actions" hidden><label for="staxx-hub-find-input">FIND TOOLS, ACTIONS &amp; ALERTS</label><input id="staxx-hub-find-input" type="search" maxlength="100" autocomplete="off" spellcheck="false" placeholder="e.g. trains, stocks, gym" aria-controls="staxx-hub-find-results"><p id="staxx-hub-find-status" role="status" aria-live="polite"></p><div id="staxx-hub-find-results" role="group" aria-label="Search results"></div></section>' +
      '<div class="staxx-scroll">' +
      '<section data-hub-section="today"><section id="staxx-hub-welcome" hidden></section><div class="staxx-label"><h3>BEST NEXT REVIEW</h3><span>From current tool evidence</span></div><section id="staxx-hub-best" aria-label="Best currently available review"></section><div class="staxx-label"><h3>OTHER NEXT STEPS</h3><span>Priority and estimated review time</span></div><div id="staxx-hub-task-filters" role="group" aria-label="Filter actions by urgency"></div><section id="staxx-hub-tasks" aria-label="Prioritised Torn actions"></section><div class="staxx-label"><h3>YOUR SHORTCUTS</h3><span>Learns from your taps</span></div><div id="staxx-hub-frequent"></div><div class="staxx-label"><h3>OPEN A TOOL</h3><span>One tap</span></div><div id="staxx-hub-quick-tools"></div><p class="staxx-trendnote">Recommendations are advisory. Confirm all gameplay actions yourself in Torn.</p></section>' +
      '<section data-hub-section="dashboard" hidden><div class="staxx-label"><h3>SUITE DASHBOARD</h3><span>All three helpers</span></div><section id="staxx-hub-dashboard"></section></section>' +
      '<section data-hub-section="activity" hidden><div class="staxx-label"><h3>RECENT ACTIVITY</h3><button type="button" data-activity-clear>Clear history</button></div><section id="staxx-hub-activity"></section></section>' +
      '<section data-hub-section="tools" hidden><div class="staxx-label"><h3>YOUR TOOLS</h3><button type="button" data-arrange aria-pressed="false">Reorder</button></div><div id="staxx-hub-tools"></div></section>' +
      '<section data-hub-section="alerts" hidden><div class="staxx-label"><h3>NOTIFICATIONS</h3><span id="staxx-hub-total"></span></div><div id="staxx-hub-alerts"></div></section>' +
      '<section data-hub-section="more" hidden><button class="staxx-overview-switch" type="button" data-overview>▦ &nbsp; Daily dashboard · all tools</button>' +
      '<section id="staxx-hub-overview" hidden></section><button class="staxx-overview-switch" type="button" data-diagnostics>⚙ &nbsp; Tool diagnostics</button><section id="staxx-hub-diagnostics" hidden></section>' +
      '<button class="staxx-context-control" type="button" data-usage-reset>Reset learned shortcuts</button><button class="staxx-context-control" type="button" data-hub-mode>Display: Simple</button><button class="staxx-context-control" type="button" data-hub-guide>Show getting-started guide</button>' +
      '<button class="staxx-context-control" type="button" data-context-toggle>On-page guidance: On</button><p class="staxx-foot">Alerts use last known data · Drag the S tab vertically to reposition · No gameplay actions are submitted automatically</p></section>' +
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
      '#staxx-page-tip{box-sizing:border-box;display:flex;flex-wrap:wrap;gap:7px;align-items:center;background:#0c2944;color:#e9f5ff;border:1px solid #345f7d;border-left:4px solid #54d7fa;border-radius:9px;padding:10px 12px;margin:10px 0;font:13px/1.4 system-ui,Arial,sans-serif;max-width:720px;min-width:0;overflow-wrap:anywhere}' +
      '@media (max-width:849px),(pointer:coarse){#staxx-page-tip{display:none!important}}' +
      '#staxx-page-tip strong{color:#84e0fb}#staxx-page-tip small{color:#a9cce5;flex-basis:100%}' +
      '#staxx-page-tip button{background:#0879bd;color:#fff;border:1px solid #69cef5;border-radius:8px;padding:7px 10px;font:inherit;font-weight:700;cursor:pointer}';
    css.textContent += [
      '#staxx-hub-drawer .staxx-main-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;padding:9px 10px;background:#08192d;border-bottom:1px solid #284b6b;flex-shrink:0}',
      '#staxx-hub-drawer .staxx-main-tabs button{min-width:0;min-height:42px;background:#102b46;border:1px solid #315d7d;border-radius:9px;font-size:11px;font-weight:800;padding:5px 2px;color:#cce9f7}',
      '#staxx-hub-drawer .staxx-main-tabs button[aria-pressed="true"]{background:#0879bd;border-color:#54d7fa;color:#fff}',
      '#staxx-hub-drawer #staxx-hub-quick-tools{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:4px 0 13px}',
      '#staxx-hub-drawer .staxx-quick-tool{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:5px;min-height:64px;min-width:0;padding:8px 3px;background:#103756;border:1px solid #366d94;border-radius:10px;text-align:center;font-weight:800;font-size:11px;line-height:1.25;overflow-wrap:anywhere}',
      '#staxx-hub-drawer .staxx-quick-tool small{color:#8ddfff;font-size:10px;font-weight:700}',
      '#staxx-hub-drawer .staxx-quick-tool:disabled{opacity:.52;cursor:not-allowed}',
      '#staxx-hub-drawer .staxx-more-tasks{width:100%;margin:2px 0 8px;padding:9px;border:1px solid #376a8c;background:#0e3452;border-radius:9px;color:#9edfff;font-size:11px;font-weight:800}',
      '#staxx-hub-drawer [data-hub-section]>.staxx-label:first-child{margin-top:2px}'
    ].join("");
    css.textContent += '#staxx-hub-welcome{border:1px solid #367194;background:#103552;border-radius:11px;padding:11px;margin:0 0 12px}#staxx-hub-welcome strong{display:block;color:#9ce7ff;font-size:13px}#staxx-hub-welcome p{font-size:11px;line-height:1.45;color:#c4dfed;margin:7px 0}#staxx-hub-welcome button{background:#0879bd;border:1px solid #64c6ea;border-radius:8px;padding:8px 10px;min-height:36px;font-size:11px;font-weight:800;width:100%}';
    css.textContent += [
      '#staxx-hub-drawer .staxx-head-actions{display:flex;align-items:center;gap:7px}',
      '#staxx-hub-drawer [data-hub-find]{background:#125074;color:#d1f5ff;border:1px solid #4a99bd;border-radius:9px;min-width:38px;height:38px;font-size:24px;line-height:1}',
      '#staxx-hub-drawer [data-hub-find][aria-expanded="true"]{background:#0879bd;border-color:#80d9ff}',
      '#staxx-hub-drawer #staxx-hub-find{display:flex;flex:1;flex-direction:column;min-height:0;padding:12px 10px 18px;gap:8px;overflow:hidden}',
      '#staxx-hub-drawer #staxx-hub-find>label{font-size:10px;font-weight:850;letter-spacing:.8px;color:#9fcbe1}',
      '#staxx-hub-drawer #staxx-hub-find-input{width:100%;min-height:44px;background:#112e48;color:#f1fbff;border:1px solid #5e96b8;border-radius:10px;padding:10px 12px;font-size:14px;outline-offset:2px}',
      '#staxx-hub-drawer #staxx-hub-find-input:focus-visible{outline:2px solid #54d7fa}',
      '#staxx-hub-drawer #staxx-hub-find-status{font-size:11px;color:#a7c8dc;margin:2px 0 0}',
      '#staxx-hub-drawer #staxx-hub-find-results{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding-bottom:12px}',
      '#staxx-hub-drawer .staxx-find-item{width:100%;display:flex;flex-direction:column;gap:4px;text-align:left;min-height:48px;margin:0 0 7px;padding:10px 11px;color:#e8f7ff;border:1px solid #366180;background:#10314f;border-radius:10px}',
      '#staxx-hub-drawer .staxx-find-item b{font-size:12px;line-height:1.3}',
      '#staxx-hub-drawer .staxx-find-item small{font-size:10px;color:#a8c8de;line-height:1.4;overflow-wrap:anywhere}',
      '#staxx-hub-drawer .staxx-find-item.urgent{border-color:#ff778d}',
      '#staxx-hub-drawer .staxx-find-item:disabled{opacity:.52;cursor:not-allowed}',
      '#staxx-hub-drawer .staxx-find-item:focus-visible{outline:2px solid #54d7fa}'
    ].join('');
    css.textContent += [
      '#staxx-hub-drawer #staxx-hub-best{padding:10px;margin-bottom:8px;border:1px solid #397fa3;border-radius:11px;background:#103756}',
      '#staxx-hub-drawer #staxx-hub-best .staxx-task{margin:0}',
      '#staxx-hub-drawer #staxx-hub-best .staxx-empty{margin:2px 0;color:#b4cbdb}',
      '#staxx-hub-drawer .staxx-advice{font-size:11px;color:#a7cde5;margin:7px 0 0;line-height:1.4}',
      '#staxx-hub-drawer #staxx-hub-task-filters{display:flex;gap:4px;flex-wrap:wrap;margin:6px 0 10px}',
      '#staxx-hub-drawer #staxx-hub-task-filters button{flex:1 0 auto;min-height:34px;padding:6px;background:#132d48;border:1px solid #345b7a;border-radius:8px;font-size:10px;font-weight:700}',
      '#staxx-hub-drawer #staxx-hub-task-filters button[aria-pressed=true]{background:#0879bd;border-color:#54d7fa}',
      '#staxx-hub-drawer #staxx-hub-dashboard .staxx-overview-card{margin-bottom:11px}',
      '#staxx-hub-drawer #staxx-hub-dashboard dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}',
      '#staxx-hub-drawer #staxx-hub-dashboard dt{font-size:10px;color:#a9c4d7}',
      '#staxx-hub-drawer #staxx-hub-dashboard dd{font-size:13px;font-weight:800;margin:2px 0;overflow-wrap:anywhere}',
      '#staxx-hub-drawer #staxx-hub-frequent{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}',
      '#staxx-hub-drawer #staxx-hub-frequent button{padding:10px 8px;min-height:48px;background:#102d49;border:1px solid #386788;border-radius:9px;text-align:left;font-size:11px;font-weight:800}',
      '#staxx-hub-drawer #staxx-hub-frequent small{display:block;margin-top:3px;font-size:10px;color:#96c2d9}',
      '#staxx-hub-drawer #staxx-hub-activity .staxx-overview-card{margin-bottom:8px}',
      '#staxx-hub-drawer #staxx-hub-activity time{display:block;margin-top:3px;font-size:10px;color:#9ebdcf}',
      '#staxx-hub-drawer .staxx-review-minutes{color:#9ce6fa;font-size:10px;font-weight:750}',
      '#staxx-hub-drawer .staxx-category{color:#d8edfa;font-size:10px;font-weight:850}'
    ].join('');
    document.documentElement.append(css, root);

    const entries = [
      {id:"profit",label:"ProfitStaxx",icon:"PS",desc:"Markets · Stocks · Income"},
      {id:"company",label:"Company Helper",icon:"CO",desc:"Staff · Training · Growth"},
      {id:"happy",label:"Happy Jump",icon:"HJ",desc:"Gym · Schedule · Recovery"}
    ];
    const sectionsByTool={
      profit:[["daily","Today"],["alerts","Alerts"],["best","Best opportunities"],["scan","Item deals"],["travel","Travel"],["stocks","Stock market"],["capital","Capital"],["history","Price charts"],["income","Income"],["museum","Museum"],["portfolio","Trading ledger"],["settings","Settings"],["diagnostics","Diagnostics"]],
      company:[["overview","Today"],["alerts","Alerts"],["employees","Staff"],["training","Training"],["growth","Growth"],["stock","Stock or services"],["settings","Settings"],["diagnostics","Diagnostics"]],
      happy:[["today","Today"],["alerts","Alerts"],["compare","Compare methods"],["plan","Schedule"],["supplies","Supplies"],["gyms","Gyms"],["perks","Perks and books"],["progress","Progress"],["lab","Upgrades"],["settings","Settings"],["diagnostics","Diagnostics"]]
    };
    const active = Object.create(null), notices = Object.create(null), summaries = Object.create(null), controls = Object.create(null), actionSets=Object.create(null), healthReports=Object.create(null);
    const registeredAt=Object.create(null);
    let trends=Object.create(null), arrangeShown=false;
    const toggle=root.querySelector("#staxx-hub-toggle"),veil=root.querySelector("#staxx-hub-veil"),drawer=root.querySelector("#staxx-hub-drawer");
    const tools=root.querySelector("#staxx-hub-tools"),alerts=root.querySelector("#staxx-hub-alerts"),bubble=root.querySelector("#staxx-hub-count");
    const overview=root.querySelector("#staxx-hub-overview"),overviewButton=root.querySelector("[data-overview]"),taskList=root.querySelector("#staxx-hub-tasks"),diagnostics=root.querySelector("#staxx-hub-diagnostics"),diagnosticButton=root.querySelector("[data-diagnostics]");
    let expanded=false, panelOpen=false, overviewShown=false, diagnosticsShown=false, moving=null, suppressClickUntil=0;
    let hubView="today", expandedTaskList=false, findOpen=false, taskFilter='all';
    const activityKey='staxx-hub-activity-v1',usageKey='staxx-hub-usage-v1';
    const validTab=/^[a-z][a-z0-9-]{0,31}$/;
    let activity=[],usage=[];
    let uiMode=safeRead('staxx-hub-mode-v1','simple')==='advanced'?'advanced':'simple';
    const findPanel=root.querySelector('#staxx-hub-find'),findInput=root.querySelector('#staxx-hub-find-input');
    const findResults=root.querySelector('#staxx-hub-find-results'),findStatus=root.querySelector('#staxx-hub-find-status');
    function setFindOpen(value){
      findOpen=Boolean(value);
      if(findPanel)findPanel.hidden=!findOpen;
      const content=root.querySelector('.staxx-scroll');if(content)content.hidden=findOpen;
      const btn=root.querySelector('[data-hub-find]');if(btn)btn.setAttribute('aria-expanded',String(findOpen));
      if(findOpen){renderFind();findInput?.focus?.();}
      else if(findInput){findInput.value='';}
    }
    function publishMode(){document.dispatchEvent(new CustomEvent('staxx:mode',{detail:{mode:uiMode}}));}
    function switchHubView(view){
      if(!["today","dashboard","activity","tools","alerts","more"].includes(view))return;
      hubView=view;
      for(const btn of root.querySelectorAll?.("[data-hub-view]")||[])
        btn.setAttribute("aria-pressed",String(btn.dataset.hubView===view));
      for(const section of root.querySelectorAll?.("[data-hub-section]")||[])
        section.hidden=section.dataset.hubSection!==view;
      const scroll=root.querySelector(".staxx-scroll");
      if(scroll)scroll.scrollTop=0; // Never scroll due to an event-driven data refresh.
    }
    let lastDataRequestV26=0;
    function refreshConnectedV26(force=false){
      if(document.hidden||!entries.some(x=>active[x.id]))return false;
      const time=Date.now();
      if(!force&&time-lastDataRequestV26<120000)return false;
      lastDataRequestV26=time;
      document.dispatchEvent(new CustomEvent("staxx:refresh-request",{detail:{reason:force?"manual":"hub-open",force}}));
      return true;
    }
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
    const storedActivity=safeRead(activityKey,[]);
    if(Array.isArray(storedActivity))activity=storedActivity.filter(x=>x&&typeof x.id==='string'&&typeof x.title==='string'&&Number(x.at)>Date.now()-30*86400000&&Number(x.at)<=Date.now()+60000).slice(-120);
    const storedUsage=safeRead(usageKey,[]);
    if(Array.isArray(storedUsage))usage=storedUsage.filter(x=>x&&idOk(x.tool)&&(!x.section||validTab.test(x.section))&&Number(x.count)>0&&Number(x.last)>Date.now()-30*86400000).slice(-50);
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
      if(value&&!expanded){expandedTaskList=false;switchHubView("today");renderTasks();}
      if(!value)setFindOpen(false);
      expanded=Boolean(value);veil.hidden=drawer.hidden=!expanded;launcherVisibility();renderContext();
    }
    function activeNotice(id){
      const n=notices[id];if(!n||!(n.count>0))return null;
      const control=controls[id]||{};
      if(control.dismissed===n.fingerprint || Number(control.snoozeUntil)>Date.now())return null;
      return n;
    }
    function recordUse(tool,section){
      const key=tool+'/'+(section||''),now=Date.now();
      usage=usage.filter(x=>x&&x.key!==key&&now-Number(x.last)<30*86400000);
      const old=storedUse(key),record={key,tool,section:section||'',count:Math.min(99,(old?.count||0)+1),last:now};
      usage.push(record);usage=usage.slice(-50);saveLocal(usageKey,usage);
    }
    function storedUse(key){return usage.find(x=>x.key===key);}
    function openTool(id,alertId,section){
      const routes=sectionsByTool[id]||entries.find(e=>e.id===id)?.sections||[];
      const validSection=routes.some(item=>item[0]===section)?section:null;
      if(entries.some(e=>e.id===id))recordUse(id,validSection);
      if(id==="company"&&!/^\/companies\.php$/i.test(location.pathname)){
        try{
          sessionStorage.setItem("staxx-open-company","1");
          sessionStorage.setItem("staxx-open-company-at",String(Date.now()));
          if(alertId)sessionStorage.setItem("staxx-open-company-alert",alertId);
          else sessionStorage.removeItem("staxx-open-company-alert");
          if(validSection&&!alertId)sessionStorage.setItem("staxx-open-company-section",validSection);
          else sessionStorage.removeItem("staxx-open-company-section");
        }catch(_){}
        location.assign(location.origin+"/companies.php");return;
      }
      if(!active[id]){
        alerts.replaceChildren(node("p","staxx-empty","This tool is not active on this page. Enable its script in Torn PDA and reload."));
        return;
      }
      panelOpen=true;setExpanded(false);launcherVisibility();
      document.dispatchEvent(new CustomEvent("staxx:closeall"));
      document.dispatchEvent(new CustomEvent("staxx:open",{detail:{id,alertId:alertId||null,section:alertId?null:validSection}}));
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
    function findCatalog(){
      const rows=[],hiddenAlertIds=new Set();
      for(const e of entries){
        const available=Boolean(active[e.id]);
        rows.push({kind:'tool',owner:e.id,title:e.label,detail:e.desc,available});
        const routes=sectionsByTool[e.id]||e.sections||[];
        for(const route of routes)rows.push({kind:'section',owner:e.id,section:route[0],title:route[1],detail:e.label+' · Section',available});
        const current=activeNotice(e.id),raw=notices[e.id];
        if(raw?.count>0&&!current)for(const item of raw.alerts||[])hiddenAlertIds.add(e.id+'/'+item.id);
        if(current){
          if(current.alerts?.length){
            for(const item of current.alerts.slice(0,24))
              rows.push({kind:'alert',owner:e.id,alertId:item.id,title:item.title,detail:e.label+' · '+item.detail+(current.cached?' · Last observed':''),available,cached:Boolean(current.cached)});
          }else rows.push({kind:'alert',owner:e.id,title:current.summary||'Review alerts',detail:e.label+(current.cached?' · Last observed':''),available,cached:Boolean(current.cached)});
        }
      }
      for(const task of taskRowsV25()){
        if(hiddenAlertIds.has(task.owner+'/'+task.id))continue;
        // A matching actionable alert is represented once, not twice.
        if(activeNotice(task.owner)?.alerts?.some(x=>x.id===task.id))continue;
        rows.push({kind:'action',owner:task.owner,alertId:task.id,title:task.title,
          detail:task.tool+' · '+task.detail+(task.cached?' · Last observed':''),available:Boolean(active[task.owner]),
          cached:Boolean(task.cached),status:task.status});
      }
      return rows;
    }
    function renderFind(){
      if(!findOpen||!findResults||!findInput)return;
      findResults.replaceChildren();
      const query=String(findInput.value||'').trim().toLocaleLowerCase().slice(0,100);
      const tokens=query.split(/\s+/).filter(Boolean);
      let results=findCatalog();
      if(tokens.length){
        results=results.filter(item=>{
          const hay=(item.title+' '+item.detail+' '+item.owner).toLocaleLowerCase();
          return tokens.every(word=>hay.includes(word)||(word.length>4&&word.endsWith('s')&&!word.endsWith('ss')&&hay.includes(word.slice(0,-1))));
        });
        results.sort((a,b)=>{
          const score=item=>(item.title.toLocaleLowerCase()===query?0:item.title.toLocaleLowerCase().startsWith(query)?1:2)*10+
            (item.kind==='action'?0:item.kind==='alert'?1:item.kind==='section'?2:3);
          return score(a)-score(b);
        });
      }else results=results.filter(x=>x.kind==='tool');
      if(findStatus)findStatus.textContent=tokens.length?results.length+' matching destination'+(results.length===1?'':'s')+' · Showing up to 12':'Select a tool or type to find a section, alert or recommendation';
      for(const item of results.slice(0,12)){
        const btn=node('button','staxx-find-item'+(item.status==='urgent'?' urgent':''));btn.type='button';
        if(item.kind==='section'){btn.dataset.hubSectionTool=item.owner;btn.dataset.hubSectionTab=item.section;}
        else if(item.alertId){btn.dataset.openAlertTool=item.owner;btn.dataset.openAlertId=item.alertId;}
        else btn.dataset.openStaxx=item.owner;
        if(!item.available&&item.owner!=='company'){btn.disabled=true;btn.title='Enable '+item.owner+' in TornPDA first';}
        const type=item.kind==='action'?'Action':item.kind==='alert'?'Alert':item.kind==='section'?'Section':'Tool';
        btn.append(node('b','',item.title),node('small','',type+' · '+item.detail+(btn.disabled?' · Script not active':'')));
        findResults.append(btn);
      }
      if(!results.length)findResults.append(node('p','staxx-empty','No matching active tool data. Try a shorter term or open a helper to refresh.'));
    }
    function diagnosticReportV25(){
      const time=Date.now();
      return {hub:"3.1",capturedAt:new Date(time).toISOString(),page:String(location.pathname||""),
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
      const syncButton=node("button","staxx-overview-switch","↻ Check current data across connected tools");
      syncButton.type="button";syncButton.dataset.syncAll="1";overview.append(syncButton);
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
      // TornPDA can display desktop-width pages within a narrow touch viewport.
      // Never insert guidance into a native heading on a touch device or small layout.
      const touch=typeof navigator!=="undefined"&&Number(navigator.maxTouchPoints)>0;
      const coarse=typeof window.matchMedia==="function"&&window.matchMedia("(pointer: coarse)").matches;
      const width=Math.min(Number(window.innerWidth)||9999,Number(document.documentElement.clientWidth)||9999);
      if(!ctx||!contextEnabled()||touch||coarse||width<850||!active[ctx.id]||openPanels.size||panelOpen||expanded){
        if(old)old.remove();return;
      }
      const anchor=document.querySelector?.("#gymroot h1, #mainContainer h1, .content-wrapper h1, h1");
      const safeParent=anchor?.parentElement;
      const parentWidth=typeof safeParent?.getBoundingClientRect==="function"?safeParent.getBoundingClientRect().width:0;
      if(!anchor||typeof anchor.insertAdjacentElement!=="function"||parentWidth<540||anchor.closest?.("#staxx-hub-root, [role=dialog], #hhj-compact-panel")){if(old)old.remove();return;}
      const set=actionSets[ctx.id],fresh=set&&!set.cached&&Date.now()-Number(set.updated)<(ctx.id==="company"?86400000:ctx.id==="happy"?900000:480000);
      const ranks={urgent:5,now:4,soon:3,review:2,optional:1};
      const items=fresh&&Array.isArray(set.items)?set.items.slice().sort((a,b)=>(ranks[b.status]||0)-(ranks[a.status]||0)||(b.priority||0)-(a.priority||0)):[];
      // Stale/missing data triggers automatic refresh inside each tool; never cover Torn
      // with a large "refresh" prompt or present cached recommendations as live.
      const first=items.find(x=>!/^((refresh|recheck|scan)(-|$))/i.test(String(x.id||"")));
      if(!first){if(old)old.remove();return;}
      const title=first.title;
      const detail=first.detail||"";
      // Reuse existing element to avoid mutating Torn's DOM during every heartbeat.
      const fingerprint=ctx.id+"|"+title+"|"+detail+"|"+String(first?.id||"");
      if(old&&old.dataset.fingerprint===fingerprint&&old.previousElementSibling===anchor)return;
      if(old)old.remove();
      const bar=node("div");bar.id="staxx-page-tip";bar.dataset.fingerprint=fingerprint;
      bar.setAttribute("role","region");bar.setAttribute("aria-label","Staxx contextual guidance");
      const heading=node("strong","",ctx.name+" · NEXT ACTION");
      const message=node("span","",title),sub=node("small","",detail);
      const button=node("button","","Review action ›");
      button.type="button";button.addEventListener("click",()=>openTool(ctx.id,first.id));
      bar.append(heading,message,button,sub);
      anchor.insertAdjacentElement("afterend",bar);
    }
    function renderWelcome(){
      const host=root.querySelector('#staxx-hub-welcome');if(!host)return;
      const done=safeRead('staxx-hub-onboarded-v1',false)===true;
      host.hidden=done;host.replaceChildren();if(done)return;
      host.append(node('strong','','Welcome to StaxxHub'),node('p','','1. Today shows your next verified action. 2. Tools opens each installed helper. 3. Alerts takes you to the exact issue.'));
      host.append(node('p','','Simple mode keeps the important tabs visible; Advanced restores every section. You can change this under More.'));
      const finish=node('button','','Got it · Start using Staxx');finish.type='button';finish.dataset.hubGuideDone='1';host.append(finish);
    }
    function renderTasks(){
      if(!taskList)return;
      taskList.replaceChildren();
      const rows=taskRowsV25();
      for(const item of rows.slice(0,(expandedTaskList||uiMode==='advanced')?6:2)){
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
      if(rows.length>2&&uiMode!=='advanced'){
        const more=node("button","staxx-more-tasks",expandedTaskList?"Show fewer actions":"Show "+Math.min(rows.length-2,4)+" more actions");
        more.type="button";more.dataset.toggleTasks="1";taskList.append(more);
      }
      if(rows.length>6&&(expandedTaskList||uiMode==='advanced'))taskList.append(node("p","staxx-foot",String(rows.length-6)+" further recommendations inside your tools"));
    }
    function render(){
      renderWelcome();
      const modeButton=root.querySelector('[data-hub-mode]');if(modeButton)modeButton.textContent='Display: '+(uiMode==='simple'?'Simple':'Advanced')+' · change';
      tools.replaceChildren();alerts.replaceChildren();
      const quick=root.querySelector("#staxx-hub-quick-tools");
      if(quick)quick.replaceChildren();
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
        if(quick&&index<3){
          const shortcut=node("button","staxx-quick-tool");
          shortcut.type="button";shortcut.dataset.openStaxx=e.id;
          shortcut.disabled=!active[e.id];
          shortcut.append(node("span","",e.label),node("small","",!active[e.id]?"Not active":count?count+" alerts":"Open"));
          quick.append(shortcut);
        }
      }
      toggle.classList.toggle("staxx-urgent",maxLevel===2);
      toggle.classList.toggle("staxx-warning",maxLevel===1);
      bubble.hidden=total===0;bubble.textContent=total>=100?"99+":String(total);
      toggle.setAttribute("aria-label",total?total+" Staxx notifications; open tools":"Open Staxx tools");
      root.querySelector("#staxx-hub-total").textContent=visible?visible+" tools":muted?muted+" muted":"All clear";
      const alertsTab=root.querySelector('[data-hub-view="alerts"]');
      if(alertsTab)alertsTab.textContent=total?"Alerts · "+(total>99?"99+":total):"Alerts";
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
      if(findOpen)renderFind();
      showOverview();
      showDiagnosticsV25();
      launcherVisibility();
      renderContext();
    }
    root.addEventListener("click",e=>{
      const b=e.target.closest("button");if(!b)return;
      if(b.dataset.hubView){setFindOpen(false);switchHubView(b.dataset.hubView);return;}
      if(b.hasAttribute('data-hub-find')){setFindOpen(!findOpen);return;}
      if(b.dataset.hubSectionTool){openTool(b.dataset.hubSectionTool,null,b.dataset.hubSectionTab);return;}
      if(b.dataset.hubGuideDone){saveLocal('staxx-hub-onboarded-v1',true);renderWelcome();return;}
      if(b.hasAttribute('data-hub-guide')){saveLocal('staxx-hub-onboarded-v1',false);switchHubView('today');renderWelcome();return;}
      if(b.hasAttribute('data-hub-mode')){uiMode=uiMode==='simple'?'advanced':'simple';saveLocal('staxx-hub-mode-v1',uiMode);expandedTaskList=false;publishMode();render();return;}
      if(b.dataset.toggleTasks){expandedTaskList=!expandedTaskList;renderTasks();return;}
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
      if(b.hasAttribute("data-overview")){overviewShown=!overviewShown;if(overviewShown){diagnosticsShown=false;refreshConnectedV26();}render();return;}
       if(b.dataset.syncAll){refreshConnectedV26(true);return;}
       if(b.hasAttribute("data-diagnostics")){diagnosticsShown=!diagnosticsShown;if(diagnosticsShown){overviewShown=false;
         document.dispatchEvent(new CustomEvent("staxx:diagnostics-request"));}render();return;}
       if(b.dataset.checkDiagnostics){document.dispatchEvent(new CustomEvent("staxx:ping"));
         document.dispatchEvent(new CustomEvent("staxx:diagnostics-request"));showDiagnosticsV25();return;}
       if(b.dataset.copyDiagnostics){const report=JSON.stringify(diagnosticReportV25(),null,2);
         const clipboard=window.navigator?.clipboard;
         if(clipboard?.writeText){clipboard.writeText(report).catch(()=>{const box=diagnostics.querySelector("#staxx-safe-report");if(box){box.hidden=false;box.value=report;}});}
         else{const box=diagnostics.querySelector("#staxx-safe-report");if(box){box.hidden=false;box.value=report;box.select?.();}}
         return;}
      if(b===toggle){if(Date.now()<suppressClickUntil)return;setExpanded(true);refreshConnectedV26();return;}
      if(b.hasAttribute("data-hub-close"))setExpanded(false);
    });
    veil.addEventListener("click",()=>setExpanded(false));
    findInput?.addEventListener?.('input',renderFind);
    findInput?.addEventListener?.('keydown',e=>{
      if(e.key==='Enter'){
        const first=findResults?.querySelector?.('button:not(:disabled)');
        if(first){e.preventDefault?.();first.click();}
      }
    });
    document.addEventListener('staxx:find',()=>{
      document.dispatchEvent(new CustomEvent('staxx:closeall'));
      openPanels.clear();panelOpen=false;
      setExpanded(true);setFindOpen(true);
    });
    document.addEventListener("keydown",e=>{
      if(e.key==='Escape'&&findOpen){e.preventDefault?.();setFindOpen(false);return;}
      if(e.key==='Escape'&&expanded){setExpanded(false);return;}
      if(expanded&&(e.ctrlKey||e.metaKey)&&String(e.key).toLowerCase()==='k'){
        e.preventDefault?.();setFindOpen(true);
      }
    });
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
    document.addEventListener('staxx:mode',e=>{const m=e.detail?.mode;if((m==='simple'||m==='advanced')&&m!==uiMode){uiMode=m;saveLocal('staxx-hub-mode-v1',m);expandedTaskList=false;render();}});
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
        if(Array.isArray(d.sections))entry.sections=d.sections.slice(0,20)
          .filter(x=>x&&/^[a-z][a-z0-9-]{0,31}$/.test(String(x.id||'')))
          .map(x=>[String(x.id),String(x.label||x.id).slice(0,45)]);
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
    window.addEventListener?.("resize",renderContext);
    window.setInterval?.(()=>{if(!document.hidden)renderContext();},15000);
    // Older v1 notifications cannot be trusted for dismiss-state comparisons.
    render();
    document.dispatchEvent(new CustomEvent("staxx:ping"));
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startHub,{once:true});else startHub();
})();
