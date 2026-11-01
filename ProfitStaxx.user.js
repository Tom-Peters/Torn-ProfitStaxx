// ==UserScript==
// @name         ProfitStaxx - Torn Trading Intelligence
// @namespace    https://github.com/Tom-Peters/Torn-ProfitStaxx
// @homepageURL  https://github.com/Tom-Peters/Torn-ProfitStaxx
// @supportURL   https://github.com/Tom-Peters/Torn-ProfitStaxx/issues
// @version      1.0.1
// @description  Read-only market intelligence, Museum arbitrage and manual profit ledger for TornPDA.
// @author       IamEEKY
// @match        https://www.torn.com/*
// @match        https://torn.com/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @updateURL    https://raw.githubusercontent.com/Tom-Peters/Torn-ProfitStaxx/main/ProfitStaxx.user.js
// @downloadURL  https://raw.githubusercontent.com/Tom-Peters/Torn-ProfitStaxx/main/ProfitStaxx.user.js
// ==/UserScript==

(function () {
  'use strict';
  if (window.top !== window.self || window.__profitStaxxBooted) return;
  window.__profitStaxxBooted = true;

  const VERSION = '1.0.1';
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
  const DEFAULTS = {capital:300000000,maxTradePct:3,maxItemPct:10,reservePct:40,minRoi:3,minProfit:40000,
    bazaarDiscount:2,pointFee:0,method:'best',scanInterval:180,watchNames:CORE_ITEMS.slice(),museumOwned:{},museumBatch:1,
    key:'',alertThreshold:100000,tab:'scan'};
  const state={settings:Object.assign({},DEFAULTS),catalog:{},quotes:{},snapshots:{},
    trades:[],status:'Ready',error:'',busy:false,lastScan:0,pointsPrice:0,
    tab:'scan',open:false,storage:'browser',watchCount:0,scanDone:0,scanTotal:0};
  let root, fab, badge, shell, saveChain=Promise.resolve(), scanTimer=null;
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
        const data=await PDA_storage.getMany(['settings','quotes','snapshots','trades','catalog','pointsPrice','lastScan']);
        state.storage='TornPDA';
        return data||{};
      }
    } catch(e){console.warn('[ProfitStaxx] Native storage unavailable; falling back');}
    state.storage='browser';
    const data={};
    for(const key of ['settings','quotes','snapshots','trades','catalog','pointsPrice','lastScan']){
      try{data[key]=JSON.parse(localStorage.getItem(KEY_PREFIX+key)||'null');}catch(e){data[key]=null;}
    }
    return data;
  }
  function persist() {
    const data={settings:state.settings,quotes:state.quotes,snapshots:state.snapshots,
      trades:state.trades,catalog:state.catalog,pointsPrice:state.pointsPrice,lastScan:state.lastScan};
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
  async function scan({manual=false}={}){
    if(state.busy)return;
    if(!apiKey()){state.status='API key needed';render();return;}
    if(!manual&&document.hidden)return;
    if(!manual&&now()-state.lastScan<number(state.settings.scanInterval)*1000)return;
    state.busy=true;state.error='';state.status='Loading catalog...';render();
    try{
      await loadCatalog();
      const list=getWatchList();state.scanTotal=list.length;state.scanDone=0;
      state.status='Scanning '+list.length+' items...';render();
      await refreshPoints();render();
      let firstFailure='';
      for(const item of list){
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
      state.lastScan=now();
      state.status='Last scan '+new Date().toLocaleTimeString();
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
  function recipeResults(){
    const batch=clamp(Math.floor(number(state.settings.museumBatch)||1),1,25);
    return RECIPES.map(r=>{
      const rows=r.items.map(name=>{const item=getItem(name),q=item&&state.quotes[item.id];
        const owned=Math.floor(number((state.settings.museumOwned||{})[name]));
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
      '.tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:7px;background:#0b223b}',
      '.tab{border:0;border-radius:8px;background:transparent;color:#91aac4;padding:10px 2px;font-size:12px}',
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
      'a{color:#66d5ff;text-decoration:none}a:hover{text-decoration:underline}',
      '@media(min-width:800px){.overlay{align-items:center}.panel{border-radius:18px;height:min(85vh,880px)}}'
    ].join('');
  }
  function field(name,label,value,type='number',attr=''){
    return '<div class="field"><label for="ps_'+esc(name)+'">'+esc(label)+'</label><input id="ps_'+esc(name)+'" name="'+esc(name)+'" type="'+esc(type)+'" value="'+esc(value)+'" '+attr+'></div>';
  }
  function notice(str,warning=false){return '<div class="notice'+(warning?' warning':'')+'">'+esc(str)+'</div>';}
  function linkToItem(id){return 'https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID='+encodeURIComponent(id);}
  function renderScan(){
    const d=deals().filter(x=>now()-x.at<8*60000),p=portfolio();
    let html='<div class="statrow"><div class="stat"><small>Working capital</small><b>'+human(state.settings.capital)+'</b></div>'+
      '<div class="stat"><small>Recorded invested</small><b>'+human(p.invested)+'</b></div></div>';
    html+='<div class="toolbar"><button class="btn" data-action="scan" '+(state.busy?'disabled':'')+'>'+
      (state.busy?'Scanning '+state.scanDone+'/'+state.scanTotal:'Refresh opportunities')+'</button>'+
      '<button class="btn secondary" data-tab="museum">Museum</button></div>';
    html+=notice(state.status+' · Last full scan: '+age(state.lastScan));
    if(state.error)html+=notice(state.error,true);
    if(!apiKey())html+=notice('Torn API key not available. Open Settings to provide one or configure TornPDA.',true);
    if(!d.length)html+='<div class="empty">No qualifying fresh deals. That is a valid result: do not force a trade. Adjust thresholds in Settings if needed.</div>';
    for(const x of d.slice(0,30)){
      html+='<div class="card"><div class="line"><h3>'+esc(x.name)+'</h3><span class="pill">Score '+x.score+'/100</span></div>'+
        '<div class="line"><span class="muted">Buy '+x.qty+' × '+fmt(x.buy)+'</span><strong class="positive">+'+fmt(x.profit)+'</strong></div>'+
        '<div class="line"><span class="muted">Reference ask '+fmt(x.reference)+'</span><span>'+pct(x.roi)+' estimated ROI</span></div>'+
        '<div class="line"><span class="muted">Best modeled exit</span><span>'+esc(x.method==='bazaar'?'Bazaar (slower sale possible)':'Item Market')+'</span></div>'+
        '<div class="line"><span class="muted">Market net / Bazaar net per unit</span><span>'+fmt(x.marketNet)+' / '+fmt(x.bazaarNet)+'</span></div>'+
        '<div class="line"><span class="muted">Competition depth: '+x.depth+' units · '+age(x.at)+'</span>'+
        '<a href="'+linkToItem(x.id)+'" target="_blank" rel="noopener">Open market</a></div>'+
        '<div class="meter"><i style="width:'+x.score+'%"></i></div></div>';
    }
    html+=notice('Expected resale is inferred from active asking prices, not confirmed completed sales. Listings may disappear before you buy.');
    return html;
  }
  function renderMuseum(){
    let html='<div class="statrow"><div class="stat"><small>Cheapest point ask</small><b>'+fmt(state.pointsPrice)+'</b></div>'+
      '<div class="stat"><small>Museum unlocked</small><b>Yes</b></div></div>';
    html+=notice('Each complete flower or plushie set = 10 points. Cash cost assumes buying one of every component on the Item Market. Points revenue uses the current lowest ASK, not guaranteed sale proceeds.');
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
        ' · Owned '+item.owned+' <button class="btn secondary" data-owned="'+esc(item.name)+'" data-delta="-1">−</button> '+
        '<button class="btn secondary" data-owned="'+esc(item.name)+'" data-delta="1">+</button></span></div>';
      html+='</details></div>';
    }
    html+=notice('This models full-set purchases only. Use +/− to record existing museum components locally. Cash needed reflects these holdings; profit includes their opportunity cost. Batch prices use available order-book quantities and are not guaranteed. Conversions stay manual.');
    return html;
  }
  function renderPortfolio(){
    const p=portfolio();
    let html='<div class="statrow"><div class="stat"><small>Realised profit</small><b class="'+(p.realised>=0?'positive':'negative')+'">'+fmt(p.realised)+'</b></div>'+
      '<div class="stat"><small>Open cost basis</small><b>'+fmt(p.invested)+'</b></div></div>';
    html+=notice('Realised P&L uses weighted-average cost for recorded buy/sell transactions. Estimates on open stock are excluded from realised profits.');
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
    const valid=deals().filter(d=>d.profit>=number(state.settings.alertThreshold)&&now()-d.at<8*60000);
    if(badge){badge.textContent=valid.length?String(Math.min(99,valid.length)):'';badge.style.display=valid.length?'block':'none';}
    if(!state.open){shell.classList.remove('active');return;}
    shell.classList.add('active');
    const tabs=['scan','museum','portfolio','settings'];
    const labels=['Deals','Museum','Ledger','Settings'];
    const active=state.tab;
    const content=active==='scan'?renderScan():active==='museum'?renderMuseum():
      active==='portfolio'?renderPortfolio():renderSettings();
    shell.innerHTML='<div class="panel" role="dialog" aria-modal="true" aria-label="ProfitStaxx">'+
      '<div class="heading"><div><div class="brand">Profit<span style="color:#54d7fa">Staxx</span></div><div class="sub">Profit intelligence · v'+VERSION+'</div></div>'+
      '<button class="close" data-action="close">Close ×</button></div>'+
      '<nav class="tabs">'+tabs.map((name,i)=>'<button class="tab '+(name===active?'active':'')+
      '" data-tab="'+name+'">'+labels[i]+'</button>').join('')+'</nav>'+
      '<main class="body">'+content+'</main><div class="footer">'+
      'Estimates only · API cached · Never auto-trades · '+esc(state.status)+'</div></div>';
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
        state.trades=parsed.trades.filter(t=>t&&Number.isInteger(Number(t.itemId))&&['buy','sell'].includes(t.side)&&Number(t.qty)>0&&Number(t.price)>0);
        state.settings=Object.assign({},DEFAULTS,parsed.settings,{key:state.settings.key});
        await persist();render();
      }catch(e){alert('Import failed: '+e.message);}
    };
    input.click();
  }
  function onClick(event){
    const el=event.target.closest('button[data-action],button[data-tab],button[data-delete],button[data-owned]');
    if(!el)return;
    if(el.dataset.tab){state.tab=el.dataset.tab;render();return;}
    if(el.dataset.owned){const name=el.dataset.owned;const owned=state.settings.museumOwned||{};
      owned[name]=Math.max(0,Math.floor(number(owned[name])+Number(el.dataset.delta||0)));
      state.settings.museumOwned=owned;persist();render();return;}
    if(el.dataset.delete){
      if(confirm('Remove this manual ledger entry? Later sales may depend on it.')){
        state.trades=state.trades.filter(t=>t.id!==el.dataset.delete);persist();render();
      }
      return;
    }
    switch(el.dataset.action){
      case 'close':state.open=false;render();break;
      case 'scan':scan({manual:true});break;
      case 'export':exportFile('profitstaxx-trades.csv',exportCSV(),'text/csv;charset=utf-8');break;
      case 'backup':exportFile('profitstaxx-backup.json',JSON.stringify({
        version:VERSION,trades:state.trades,settings:Object.assign({},state.settings,{key:''})},null,2),'application/json');break;
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
    }else if(event.target.id==='ps_settings'){
      event.preventDefault();
      const f=new FormData(event.target),s=state.settings;
      for(const key of ['capital','maxTradePct','maxItemPct','reservePct','minRoi','minProfit',
        'bazaarDiscount','pointFee','alertThreshold','scanInterval','museumBatch'])s[key]=number(f.get(key));
      s.maxTradePct=clamp(s.maxTradePct,0.1,100);s.maxItemPct=clamp(s.maxItemPct,0.1,100);
      s.reservePct=clamp(s.reservePct,0,99);s.bazaarDiscount=clamp(s.bazaarDiscount,0,99);
      s.pointFee=clamp(s.pointFee,0,50);s.scanInterval=clamp(s.scanInterval,90,3600);s.museumBatch=clamp(Math.floor(s.museumBatch||1),1,25);
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
    fab=document.createElement('button');fab.className='fab';fab.textContent='PS';fab.setAttribute('aria-label','Open ProfitStaxx');
    badge=document.createElement('span');badge.className='bubble';badge.style.display='none';fab.appendChild(badge);
    fab.addEventListener('click',()=>{state.open=!state.open;render();});
    root.appendChild(fab);
    shell=document.createElement('div');shell.className='overlay';
    shell.addEventListener('click',e=>{if(e.target===shell){state.open=false;render();}else onClick(e);});
    shell.addEventListener('submit',onSubmit);
    root.appendChild(shell);
    render();
  }
  async function init(){
    mount();
    try{
      const loaded=await readStore();
      state.settings=Object.assign({},DEFAULTS,loaded.settings||{});
      state.trades=Array.isArray(loaded.trades)?loaded.trades:[];
      state.catalog=loaded.catalog||{};
      state.quotes=loaded.quotes||{};
      state.snapshots=loaded.snapshots||{};
      state.pointsPrice=number(loaded.pointsPrice);
      state.lastScan=number(loaded.lastScan);
      state.status='Ready · '+state.storage+' storage';
    }catch(e){state.error='Could not restore local data: '+e.message;}
    render();
    // Pure API reads only, and only while the Torn tab is foreground/visible.
    scanTimer=setInterval(()=>{
      if(document.hidden||state.busy||!apiKey())return;
      scan({manual:false});
    },30000);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
