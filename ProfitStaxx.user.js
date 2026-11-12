// ==UserScript==
// @name         Profit-TornStaxx - Trading & Income
// @namespace    https://github.com/Tom-Peters/Torn-ProfitStaxx
// @homepageURL  https://github.com/Tom-Peters/Torn-ProfitStaxx
// @supportURL   https://github.com/Tom-Peters/Torn-ProfitStaxx/issues
// @version      2.4.0
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
/* TornStaxx 4.0 module fallback — compact, local-only and no remote dependencies. */
(function(){
  'use strict';
  if(typeof window==='undefined'||typeof document==='undefined'||typeof location==='undefined'||window.top!==window.self||
     !/^(www\.)?torn\.com$/i.test(location.hostname)||window.__TornStaxxFallbackBooted)return;
  window.__TornStaxxFallbackBooted=true;
  function mount(){
    if(!document.body||typeof document.body.append!=='function'||typeof document.getElementById!=='function'||typeof document.createElement!=='function')return;
    if(document.getElementById('staxx-hub-root')||document.getElementById('staxx-fallback-root'))return;
    const entries=new Map(),root=document.createElement('div'),button=document.createElement('button'),menu=document.createElement('div');
    root.id='staxx-fallback-root';
    root.style.cssText='position:fixed;left:5px;top:42%;z-index:2147483645;font:13px system-ui,sans-serif;color:#effaff;';
    button.type='button';button.textContent='S';button.title='Open TornStaxx tools (install TornStaxx for the full hub)';
    button.setAttribute('aria-label','Open installed TornStaxx tools');
    button.style.cssText='width:42px;height:48px;border-radius:0 12px 12px 0;border:1px solid #55d7fa;background:#0a4d76;color:#c9f5ff;font-size:22px;font-weight:900;';
    menu.hidden=true;
    menu.style.cssText='position:absolute;top:0;left:49px;width:min(246px,calc(100vw - 62px));padding:12px;background:#08192d;border:1px solid #396e93;border-radius:12px;box-shadow:0 10px 24px #0009;max-height:65vh;overflow:auto;';
    const title=document.createElement('strong');title.textContent='TornStaxx · module mode';title.style.color='#65d9ff';menu.append(title);
    const note=document.createElement('p');note.textContent='Install the separate TornStaxx script for the full dashboard and shared alerts.';note.style.cssText='font-size:11px;color:#b6d0e6;line-height:1.4';menu.append(note);
    const links=document.createElement('div');menu.append(links);
    function draw(){
      links.replaceChildren();
      for(const [id,entry] of entries){
        const item=document.createElement('button');item.type='button';item.textContent=entry.label;
        item.style.cssText='display:block;width:100%;text-align:left;margin:6px 0;padding:10px;background:#113452;border:1px solid #34749a;border-radius:8px;color:#e8f6ff;font:inherit;';
        item.addEventListener('click',()=>{menu.hidden=true;document.dispatchEvent(new CustomEvent('staxx:open',{detail:{id}}));});
        links.append(item);
      }
    }
    button.addEventListener('click',()=>{menu.hidden=!menu.hidden;if(!menu.hidden)draw();});
    root.append(button,menu);
    document.body.append(root);
    document.addEventListener('staxx:register',e=>{
      const d=e.detail||{};
      if(!/^[a-z][a-z0-9-]{0,31}$/.test(d.id||''))return;
      entries.set(d.id,{label:String(d.label||d.id).slice(0,64)});if(!menu.hidden)draw();
    });
    document.addEventListener('staxx:panel',e=>{root.style.display=e.detail?.open?'none':'';});
    document.dispatchEvent(new CustomEvent('staxx:ping'));
    const timer=setInterval(()=>{if(document.getElementById('staxx-hub-root'))root.remove();if(!root.isConnected)clearInterval(timer);},2500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();







(function () {
  'use strict';
  if (window.top !== window.self || window.__profitStaxxBooted) return;
  window.__profitStaxxBooted = true;

  const VERSION = '2.4.0';
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
    key:'',alertThreshold:100000,tab:'daily',allocMarket:55,allocTravel:20,allocStock:20,allocBank:5,bankPrincipal:0,bankApr:0,rentalAssetValue:0,rentalNetWeekly:0,stockTargets:{},stockClaimReminders:false,stockLogSync:true,
    travelCapacity:10,travelMinProfit:100000,travelMinutes:'',dailyReviewMinutes:15};
  const state={alertFocus:'',settings:Object.assign({},DEFAULTS),catalog:{},quotes:{},snapshots:{},
    trades:[],income:[],stockHistory:{},stockCache:[],stockCacheAt:0,stockReceipts:[],stockLogCheckedAt:0,stockLogRetryAt:0,status:'Ready',error:'',busy:false,cancelScan:false,scanMode:'full',lastScan:0,pointsPrice:0,pointsCheckedAt:0,inventoryOwned:{},inventoryAt:0,inventoryBusy:false,inventoryError:'',walletCash:null,walletAt:0,walletError:'',walletBusy:false,
    tab:'daily',walkthrough:null,dailyReviews:{},rankFilter:'all',chartDays:30,open:false,storage:'browser',watchCount:0,scanDone:0,scanTotal:0};
  let routeStoreReady=false;
  let root, fab, badge, shell, routeBar, routeBarHost, saveChain=Promise.resolve(), scanTimer=null, lastHubPanelState=null;
  const scrollPositions=Object.create(null);
  let lastRenderedTab=null;
  const fmt=n=>Number.isFinite(Number(n)) ? '$'+Math.round(Number(n)).toLocaleString('en-US') : '—';
  const pct=n=>Number.isFinite(n) ? n.toFixed(1)+'%' : '—';
  const number=n=>Math.max(0,Number(n)||0);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const now=()=>Date.now();
  // Wallet is an optional read-only safety limit. Never assume the API returned a zero balance.
  function parseMoneyV113(payload){
    const value=payload?.money?.money_onhand??payload?.money_onhand;
    const amount=Number(value);
    return value!==undefined&&value!==null&&value!==''&&Number.isFinite(amount)&&amount>=0?amount:null;
  }
  function liveWalletCashV113(){
    return state.walletAt>0&&Number.isFinite(state.walletCash)&&now()-state.walletAt<15*60000?state.walletCash:null;
  }
  async function refreshWalletV113(){
    if(state.walletBusy||!apiKey()||document.hidden)return;
    state.walletBusy=true;
    try{
      const cash=parseMoneyV113(await api('user/money'));
      if(cash===null)throw Error('Torn returned no verified cash-on-hand field.');
      state.walletCash=cash;state.walletAt=now();state.walletError='';
    }catch(e){state.walletError='Live wallet unavailable: '+String(e.message||e).slice(0,110);}
    finally{state.walletBusy=false;render();}
  }
  const age=ms=>ms?Math.max(0,Math.floor((now()-ms)/60000))+'m ago':'Never';
  const human=n=>{if(!Number.isFinite(n))return '—'; const a=Math.abs(n);
    return (n<0?'-':'')+'$'+(a>=1e9?(a/1e9).toFixed(2)+'b':a>=1e6?(a/1e6).toFixed(2)+'m':a>=1e3?(a/1e3).toFixed(1)+'k':Math.round(a));};

  async function readStore() {
    try {
      if (typeof PDA_storage!=='undefined' && typeof PDA_storage.getMany==='function') {
        const data=await PDA_storage.getMany(['settings','quotes','snapshots','trades','catalog','pointsPrice','lastScan','income','travelRows','travelAt','stockHistory','stockCache','stockCacheAt','stockReceipts','stockLogCheckedAt','stockLogRetryAt','dailyReviews','inventoryOwned','inventoryAt','walkthrough','pointsCheckedAt']);
        state.storage='TornPDA';
        return data||{};
      }
    } catch(e){console.warn('[ProfitStaxx] Native storage unavailable; falling back');}
    state.storage='browser';
    const data={};
    for(const key of ['settings','quotes','snapshots','trades','catalog','pointsPrice','lastScan','income','travelRows','travelAt','stockHistory','stockCache','stockCacheAt','stockReceipts','stockLogCheckedAt','stockLogRetryAt','dailyReviews','inventoryOwned','inventoryAt','walkthrough','pointsCheckedAt']){
      try{data[key]=JSON.parse(localStorage.getItem(KEY_PREFIX+key)||'null');}catch(e){data[key]=null;}
    }
    return data;
  }
  function persist() {
    const data={settings:state.settings,quotes:state.quotes,snapshots:state.snapshots,
      trades:state.trades,income:state.income,catalog:state.catalog,pointsPrice:state.pointsPrice,pointsCheckedAt:state.pointsCheckedAt,lastScan:state.lastScan,
      travelRows:travelState.rows,travelAt:travelState.at,
      stockHistory:state.stockHistory,stockCache:state.stockCache,stockCacheAt:state.stockCacheAt,stockReceipts:state.stockReceipts,stockLogCheckedAt:state.stockLogCheckedAt,stockLogRetryAt:state.stockLogRetryAt,dailyReviews:state.dailyReviews,inventoryOwned:state.inventoryOwned,inventoryAt:state.inventoryAt,walkthrough:state.walkthrough};
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
      const shops=Array.isArray(entry.value?.shops)?entry.value.shops.filter(shop=>shop?.country==='Torn'):[];
      const buys=shops.map(shop=>Number(shop.buy_price)).filter(price=>Number.isFinite(price)&&price>0);
      const sells=shops.map(shop=>Number(shop.sell_price)).filter(price=>Number.isFinite(price)&&price>0);
      output[String(entry.name).toLowerCase()]={id,name:entry.name,
        value:number(entry.value?.market_price||entry.market_value||entry.marketValue||0),type:entry.type||'',
        tradable:entry.is_tradable!==false,shopBuy:buys.length?Math.min(...buys):null,
        shopSell:sells.length?Math.max(...sells):null};
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
    const funds=Math.min(cashCap,Math.max(0,itemCap-exposure(q.id)),Math.max(0,number(state.settings.capital)*(1-number(state.settings.reservePct)/100)-openCost()),liveWalletCashV113()??Infinity);
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
    const recorded=state.trades[state.trades.length-1];
    document.dispatchEvent?.(new CustomEvent('staxx:activity',{detail:{id:'profit',events:[{
      id:'trade-'+String(recorded.id).replace(/[^a-z0-9_-]/gi,'').slice(0,64),at:recorded.at,
      source:'recorded',section:'portfolio',title:'Manual '+side+' recorded in ProfitStaxx',
      detail:qty+' × '+item.name+' · Ledger entry only, not a verified Torn trade'
    }]}}));
    persist();render();
  }
  function normalizeMarket(payload,id,name){
    const offers=parseOffers(payload,'itemmarket');
    return {id,name,offers,reference:listingReference(offers),at:now(),
      cacheTimestamp:Number(payload.itemmarket&&payload.itemmarket.cache_timestamp)||0};
  }
  function getWatchList(){
    // Track recorded open holdings automatically, including items the user removed from the manual list.
    const recorded=(state.trades||[]).length?positions().filter(p=>p.qty>0&&p.itemId>0):[];
    const names=[...(state.settings.watchNames||[]),...RECIPES.flatMap(r=>r.items),...recorded.map(p=>p.name)];
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
      state.pointsCheckedAt=now();
    }catch(e){state.error='Points pricing unavailable: '+e.message;}
  }
  async function scan({manual=false,quick=false}={}){
    if(state.busy)return;
    if(!apiKey()){state.status='API key needed';render();return;}
    if(!manual&&document.hidden)return;
    if(!manual&&!quick&&now()-state.lastScan<number(state.settings.scanInterval)*1000)return;
    state.busy=true;state.cancelScan=false;state.scanMode=quick?'quick':'full';state.error='';state.status='Loading catalog...';render();
    try{
      await loadCatalog();
      const all=getWatchList();
      // Fast mode prioritises stale and never-priced items, with a small bounded API budget.
      const held=new Set(positions().filter(p=>p.qty>0).map(p=>Number(p.itemId)));
      // First refresh stale owned positions; then the oldest watched opportunities.
      const list=quick?all.slice().sort((a,b)=>{
        const aAge=Number(state.quotes[a.id]?.at)||0,bAge=Number(state.quotes[b.id]?.at)||0;
        const aHeld=held.has(Number(a.id))&&now()-aAge>5*60000;
        const bHeld=held.has(Number(b.id))&&now()-bAge>5*60000;
        return Number(bHeld)-Number(aHeld)||aAge-bAge;
      }).slice(0,10):all;
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
      const names=new Map([...RECIPES.flatMap(r=>r.items),...CORE_ITEMS].map(n=>[n.toLowerCase(),n]));
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
    ['travel','Travel importing','/travelagency.php'],['crimes','Solo crimes','/loader.php?sid=crimes'],
    ['bounty','Bounty hunting','/bounties.php'],['revive','Reviving / services','/hospitalview.php'],
    ['museum','Museum arbitrage','/museum.php'],['points','Points trading','/pmarket.php'],['city','City map finds','/city.php'],['inventory','Sell spare inventory','/item.php'],
    ['blood','Fill and sell blood bags','/item.php'],['forgery','Forgery and Print Store','/loader.php?sid=crimes'],
    ['oc','Organised crime payouts','/factions.php?step=your#/tab=crimes'],['war','Ranked war payouts','/factions.php?step=your'],
    ['shop','City shop resale','/city.php'],['auction','Auction House','/city.php'],
    ['other','Other earned income','/city.php']];
  // Each route keeps its own instructions and destinations. Results are recorded
  // only after the player confirms what happened in Torn.
  const routeGuides={
    market:{group:'Trading and travel',steps:[
      ['Choose a listing','Compare cash needed, price cap and resale margin in Deals.','scan'],
      ['Buy the selected lot','Check the current listing, total cost and quantity in Torn. Log the actual buy in My money.'],
      ['Sell and settle','Compare competing listings, check the sale fee, and wait for the actual fill.'],
      ['Record the sale','Enter the actual sell price and quantity in My money. Your trade ledger calculates realised profit.','portfolio']]},
    travel:{group:'Trading and travel',steps:[
      ['Choose an import run','Check recent shelf stock, round-trip time, carry capacity and cash in Travel.','travel'],
      ['Fly and buy','Check the destination, actual stock and carry space in Torn before buying.'],
      ['Return and sell','Check the local market and wait for proceeds to arrive.','@market'],
      ['Record the trip','Enter the actual cash received, stock cost and any travel costs.']]},
    museum:{group:'Trading and travel',steps:[
      ['Check a complete set','Verify Museum access in Torn. Compare existing inventory, missing pieces and the live points price.','museum'],
      ['Complete and exchange the set','Buy only the missing pieces you can afford. Confirm the conversion in the Museum.'],
      ['Sell the points','Check the Points Market and wait for a completed sale.','@points'],
      ['Record proceeds','Enter point sale proceeds and costs. Include the basis of any set pieces you already owned when measuring profit.']]},
    points:{group:'Trading and travel',steps:[
      ['Check both sides','Compare the available lot price with the resale price and any fees.'],
      ['Buy within your cash limit','Check the full cost and quantity on the Points Market.'],
      ['Wait for the sale','List at a price that covers your costs and verify the actual fill.'],
      ['Record settled proceeds','Enter what you received and the full cost of the points sold.']]},
    shop:{group:'Trading and travel',steps:[
      ['Compare shop and market','Check the shop shelf price and buying limit. In Deals, compare the resale price after fees.','scan'],
      ['Buy a small batch','Find the shop in the City and verify the current shelf price and available quantity.'],
      ['Sell the batch','Check comparable listings and wait until the batch sells.','@market'],
      ['Record the margin','Enter net sale proceeds and your total shop spend.']]},
    auction:{group:'Trading and travel',steps:[
      ['Choose an eligible item','Compare comparable listings or recent sales. Check whether the item qualifies for auction.'],
      ['List or set a bid ceiling','Check the rules, fees and timing in the Auction House. Avoid exceeding your bid ceiling.'],
      ['Settle the auction','Wait for the result and check for a cashier check or delivery.'],
      ['Record the settled result','For a completed sale, enter money received and the original item cost plus any fees.']]},
    city:{group:'Items you can turn into cash',steps:[
      ['Look for city finds','Open the City map and check for visible item finds. Availability varies.'],
      ['Collect visible finds','Collect the items you can actually see and check that they appear in Items.'],
      ['Choose what to sell','Compare market prices and any available shop offer. Wait for the sale.','@market'],
      ['Record sold finds','Enter only cash received, plus any direct costs.']]},
    inventory:{group:'Items you can turn into cash',steps:[
      ['Pick items you can spare','Open Items and choose a tradable item you own. Check that you do not need it for training, war or a set.'],
      ['Compare sale options','Check market fees, similar listings and any shop offer.','@market'],
      ['Sell and check proceeds','Confirm how many sold and the cash actually received.','@market'],
      ['Record the sale','Use the trade ledger if the purchase is already recorded. Otherwise enter the original cost and net proceeds here.']]},
    blood:{group:'Items you can turn into cash',steps:[
      ['Check access and margin','Requires Intravenous Therapy. Check the cost of an empty bag and the after-fee sale price of your blood type.','@market'],
      ['Fill bags when ready','In Items, check your life and medical cooldown before filling a bag. A normal withdrawal costs 30% of maximum life and adds an hour of medical cooldown.'],
      ['Sell the filled bags','Check the correct blood type and wait for the sale.','@market'],
      ['Record actual cash','Enter proceeds after fees and the cost of the empty bags used.']]},
    forgery:{group:'Crimes and faction payouts',resource:'Nerve',steps:[
      ['Pick a project you can finish','Check Forgery skill, required tools, consumables, nerve and steps. Compare the current Print Store payout with the material cost.'],
      ['Complete the project','Follow the project in Crimes and count extra consumables or nerve from failed attempts.'],
      ['Sell the finished item','Check the Print Store in the City and confirm the amount received.','@city'],
      ['Record the project result','Enter the actual payout and cost of consumed supplies.']]},
    crimes:{group:'Crimes and faction payouts',resource:'Nerve',steps:[
      ['Choose a crime','Review your skill, nerve, consumables and the risk of failure.'],
      ['Do the crime in Torn','Track nerve and any items or cash consumed on all attempts.'],
      ['Settle the reward','Record cash received. Sell any items you want to count as cash and wait for settlement.','@market'],
      ['Record the session','Enter the settled proceeds and actual direct costs.']]},
    oc:{group:'Crimes and faction payouts',steps:[
      ['Check the faction payout terms','Ask which scenarios are available and how your faction handles the split, wallet payment and faction balance.'],
      ['Join a suitable scenario','Check the role, required items and your availability.'],
      ['Check your personal payout','After completion, verify what was credited to you. Sell any item rewards separately if you count their cash proceeds.'],
      ['Record your share','Enter the amount you actually received. Avoid entering a faction credit again when withdrawing it.']]},
    war:{group:'Crimes and faction payouts',steps:[
      ['Check the war pay agreement','Review faction rules, what hits count, and how personal payouts are determined. Faction cache values are separate.'],
      ['Take part under faction orders','Track actual war costs such as consumables you used.'],
      ['Verify your own payout','Check your wallet or faction balance after your faction settles rewards.'],
      ['Record your share','Enter the actual payout and direct costs. Count a faction credit only once.']]},
    bounty:{group:'Paid services',resource:'Energy',steps:[
      ['Choose a bounty','Check the payout, target availability, location and matchup. WarStaxx can show any available strength estimates on Bounties.'],
      ['Check the energy cost','Allow for failed attempts, supplies and energy you need for training or war.'],
      ['Verify the bounty paid','A qualifying hospitalize can collect the bounty. Check the actual payout before recording it.'],
      ['Record the result','Enter the payout, direct costs and active time, including failed attempts.']]},
    revive:{group:'Paid services',resource:'Energy',steps:[
      ['Check unlock and agree payment','Reviving requires the Brain Surgeon rank in the medical starter job. Agree payment and check the actual energy cost in Torn.'],
      ['Check the patient and revive chance','Confirm the patient accepts revives and account for failed attempts.'],
      ['Check payment received','Verify that the agreed payment arrived before logging it.'],
      ['Record the service','Enter the actual payment, direct costs and active time.']]},
    company:{group:'Recurring income',steps:[
      ['Check the pay arrangement','Confirm wages or company income and distinguish personal cash from company revenue.'],
      ['Review ongoing costs','If you own the company, account for wages, advertising and other operating costs.'],
      ['Check what was paid','Verify the actual wage or personal withdrawal.'],
      ['Record personal income','Enter the amount you actually received and the costs attributable to it.']]},
    bank:{group:'Recurring income',steps:[
      ['Read the current offer','Confirm the principal, maturity date, quoted payout and cash you can lock away.'],
      ['Place the investment in Torn','Check the final amount and term before confirming.'],
      ['Wait for maturity','Return to the bank when the investment ends and check the settled amount.'],
      ['Record interest only','Subtract returned principal from the payout before entering interest as cash received.']]},
    stocks:{group:'Recurring income',steps:[
      ['Choose a benefit block','Check the current share shortfall, cost, holding period and payout terms.','stocks'],
      ['Buy and check eligibility','Confirm the live share price and required shares before buying.'],
      ['Verify the cash credit','Check Torn and compare against verified receipts in Income.','income'],
      ['Review the receipt','Use synced stock cash receipts for verified dividends. If you enter one manually in Income, keep that record separate from the synced receipt.','income']]},
    rent:{group:'Recurring income',steps:[
      ['Check a rentable property','Compare expected rent with upkeep, vacancy and the value tied up in the property.'],
      ['List or agree terms','Confirm the duration, rent and upkeep responsibility in Torn.'],
      ['Verify receipt','Check what rent actually reached your wallet.'],
      ['Record the rent','Enter rent received and any attributable costs for the period.']]},
    other:{group:'Other',steps:[
      ['Define the activity','Identify what will pay you and what it will cost.'],
      ['Confirm the terms','Check the deal and what counts as completed.'],
      ['Verify cash received','Check the result and actual direct costs.'],
      ['Record it','Enter only the amount received and direct costs.']]}
  };

  const bloodTypes=['A+','A-','B+','B-','AB+','AB-','O+','O-'];
  const itemPriceRoutes=new Set(['city','inventory','blood','forgery','shop','auction']);
  const routePricing={busy:false,key:'',attempt:0,error:'',retry:null};
  const quoteWindow=8*60000;

  function selectedRouteItem(w){
    if(w.route==='blood'){
      const type=state.settings.routeBloodType;
      return Object.values(state.catalog).find(item=>bloodTypes.includes(type)&&
        item.name.replace(/\s+/g,'').toUpperCase()==='BLOODBAG:'+type)||null;
    }
    return Object.values(state.catalog).find(item=>item.id===w.itemId)||null;
  }

  function freshRouteQuote(id){
    const quote=state.quotes[id];
    if(!quote)return null;
    const cached=Number(quote.cacheTimestamp)||0;
    const age=now()-(cached?(cached<1e12?cached*1000:cached):quote.at);
    return age>=0&&age<quoteWindow?quote:null;
  }

  function routePricingKey(w){
    return JSON.stringify([w.id,w.itemId,state.settings.routeBloodType||'',state.settings.forgeryMaterials?.[w.itemId]||null]);
  }

  async function refreshRoutePrices(force=false){
    const w=state.walkthrough;
    if(!w||w.step>=3||document.hidden||!apiKey()||routePricing.busy)return;
    if(state.busy||travelState.busy||stockState.loading||autoTickRunningV112){
      if(!routePricing.retry)routePricing.retry=setTimeout(()=>{
        routePricing.retry=null;
        if(state.open&&state.tab==='walkthrough')void refreshRoutePrices(force);
      },3000);
      return;
    }
    const key=routePricingKey(w);
    const relevant=itemPriceRoutes.has(w.route)||['points','travel','stocks','museum'].includes(w.route)||
      w.route==='market'&&w.itemId;
    if(!relevant||routePricing.key===key&&now()-routePricing.attempt<(force?15000:60000))return;
    routePricing.busy=true;routePricing.key=key;routePricing.attempt=now();routePricing.error='';render();
    const stillSelected=()=>state.walkthrough&&routePricingKey(state.walkthrough)===key&&state.walkthrough.step<3&&!document.hidden;
    let lastRequest=0;
    async function routeGet(path){
      if(lastRequest)await sleep(Math.max(0,2500-(now()-lastRequest)));
      if(!stillSelected())return null;
      lastRequest=now();
      return api(path);
    }
    async function quoteItem(id,name){
      if(!id||(!force&&freshRouteQuote(id)))return;
      const result=await routeGet('market/'+id+'/itemmarket');
      if(result)state.quotes[id]=normalizeMarket(result,id,name);
    }
    try{
      if(w.route==='stocks'){
        if(force||now()-stockState.at>=quoteWindow||now()-stockState.ownedAt>=quoteWindow)await refreshStocks();
      }else if(w.route==='travel'){
        if(force||now()-travelState.at>=quoteWindow||w.target&&!walkthroughQuote(w))await scanTravel();
      }else{
        if(itemPriceRoutes.has(w.route)||w.route==='museum'){
          // Older cached catalogues do not contain shop prices. Upgrade only
          // when a route needs them, then reuse the on-device catalogue.
          if(!state.settings.routeCatalogAt||now()-state.settings.routeCatalogAt>=86400000||
              Object.keys(state.catalog).length<100){
            const result=await routeGet('torn/items');
            if(!result)return;
            const catalog=normalizeItems(result);
            if(!Object.keys(catalog).length)throw Error('Torn returned no item catalogue.');
            state.catalog=catalog;state.settings.routeCatalogAt=now();
          }
        }
        if(w.route==='blood')await quoteItem(731,'Empty Blood Bag');
        const item=selectedRouteItem(w);
        if(item&&item.tradable!==false)await quoteItem(item.id,item.name);
        else if(w.route==='market'&&w.itemId)await quoteItem(w.itemId,w.name||'Selected item');
        if(w.route==='forgery'&&item){
          const materials=state.settings.forgeryMaterials?.[item.id];
          if(Array.isArray(materials))for(const material of materials.slice(0,6)){
            if(!stillSelected())break;
            const component=Object.values(state.catalog).find(x=>x.id===material?.id);
            if(component?.tradable)await quoteItem(component.id,component.name);
          }
        }
        if(w.route==='points'||w.route==='museum'){
          if(force||!state.pointsCheckedAt||now()-state.pointsCheckedAt>=quoteWindow){
            const result=await routeGet('market/pointsmarket');
            if(result){
              state.pointsPrice=parseOffers(result,'pointsmarket')[0]?.price||0;
              state.pointsCheckedAt=now();
            }
          }
        }
        if(w.route==='museum'){
          const recipe=RECIPES.find(r=>'museum-'+r.name===w.target);
          if(recipe)for(const name of recipe.items){
            if(!stillSelected())break;
            const component=getItem(name);
            if(component)await quoteItem(component.id,component.name);
          }
        }
      }
      persist();
    }catch(e){routePricing.error=String(e.message||e).slice(0,180);}
    finally{
      routePricing.busy=false;render();
      if(state.walkthrough&&routePricingKey(state.walkthrough)!==key&&state.open)void refreshRoutePrices();
    }
  }

  const recurringRoutes=new Set(['bank','rent','stocks','company']);
  const routeCostNeeds={
    market:'A fresh qualifying listing and resale quote',
    travel:'Fresh shelf stock and a resale quote',
    museum:'A set with all components and points priced',
    points:'A buy lot, expected resale proceeds and fees',
    city:'A priced find you plan to sell',
    inventory:'An item price and original purchase cost',
    blood:'Your Torn blood type and current bag prices',
    forgery:'The project payout and prices for its consumed materials',
    shop:'A selected item with shop cost and resale price',
    auction:'The item cost, expected winning bid and fees',
    crimes:'Cash payout and consumed supplies for your session',
    oc:'Your expected share and consumed supplies',
    war:'Your expected share and direct war costs',
    bounty:'Expected bounty payout and supplies for the attempt',
    revive:'Agreed payment and direct costs',
    company:'Your personal receipts and costs over 30 days',
    bank:'Your actual investment terms',
    stocks:'A fresh priced benefit block and ownership',
    rent:'Your net weekly rental income and property value',
    other:'Expected cash proceeds and direct costs'
  };

  function routeItemCosts(w){
    const item=selectedRouteItem(w);
    const quote=item?freshRouteQuote(item.id):null;
    const ask=quote?.offers?.[0]?.price||0;
    const sale=ask?Math.floor(ask*.95):null;
    const emptyAsk=w.route==='blood'?freshRouteQuote(731)?.offers?.[0]?.price||0:0;
    const shopPrice=w.route==='blood'?getItem('Empty Blood Bag')?.shopBuy:w.route==='shop'?item?.shopBuy:null;
    const shelf=shopPrice>0?shopPrice:null;
    const costs=w.route==='blood'?[emptyAsk,shelf].filter(x=>x>0):w.route==='shop'&&shelf?[shelf]:[];
    return {item,quote,ask,sale,emptyAsk,shelf,cost:costs.length?Math.min(...costs):null};
  }

  function forgeryCosts(w){
    const recipe=state.settings.forgeryMaterials?.[w.itemId];
    if(!Array.isArray(recipe)||!recipe.length||recipe.length>6||recipe.some(row=>
      !row||!Number.isSafeInteger(row.id)||row.id<=0||!Number.isSafeInteger(row.qty)||row.qty<1||row.qty>6000))return null;
    const lines=recipe.map(({id,qty})=>{
      const item=Object.values(state.catalog).find(x=>x.id===id);
      const quote=freshRouteQuote(id);
      const market=quote?bookCost(quote.offers,qty):null;
      const shelf=item?.shopBuy>0?item.shopBuy*qty:null;
      const prices=[market,shelf].filter(Number.isFinite);
      return {label:qty+' × '+(item?.name||'Item '+id),amount:prices.length?Math.min(...prices):null};
    });
    const complete=lines.every(x=>x.amount!==null);
    return {lines,cost:complete?lines.reduce((sum,x)=>sum+x.amount,0):null};
  }

  function hasTripPricing(trip){
    return trip.observationAge>=-5*60000&&trip.observationAge<=30*60000&&trip.quantityBuy>0&&
      Number.isFinite(trip.net)&&Boolean(freshRouteQuote(trip.id));
  }

  function routeProfitModels(){
    const models=new Map();
    const add=(id,model)=>{
      if(!Number.isFinite(model.net))return;
      const previous=models.get(id);
      if(!previous||model.net>previous.net)models.set(id,model);
    };
    for(const deal of deals()){
      if(!freshRouteQuote(deal.id))continue;
      add('market',{net:deal.profit,cost:deal.buy*deal.qty,label:deal.name,
        period:deal.qty+' units',target:{id:'market-'+deal.id,label:deal.name,itemId:deal.id},
        basis:'Trade cost and modeled resale fees included'});
    }
    for(const trip of travelRows()){
      if(!hasTripPricing(trip))continue;
      add('travel',{net:trip.net,cost:trip.spent,label:trip.countryName+' / '+trip.name,period:'one trip',
        basis:'Stock and sale fee included. Add any fare or other trip costs in your estimate.',
        target:{id:'travel-'+trip.country+'-'+trip.id,label:trip.countryName+' / '+trip.name,itemId:trip.id}});
    }
    for(const r of recipeResults()){
      const target={id:'museum-'+r.name,label:r.name};
      const q=walkthroughQuote({route:'museum',target:target.id});
      if(q)add('museum',{net:q.net,cost:r.cost,capital:q.cost,label:r.name,period:r.batch+' set(s)',target,
        basis:'Full component cost, including owned pieces, and configured points fees'});
    }
    for(const row of incomeCandidates()){
      if(!['stocks','rent','bank'].includes(row.route))continue;
      if(row.route==='stocks'&&(!stockState.ownedAt||now()-stockState.at>=quoteWindow||now()-stockState.ownedAt>=quoteWindow))continue;
      add(row.route,{net:row.net,capital:row.cost,label:row.label,period:'30-day equivalent',
        target:row,basis:row.summary});
    }
    for(const route of itemPriceRoutes){
      const savedId=Number(state.settings.routeItems?.[route])||0;
      const current=state.walkthrough?.route===route?state.walkthrough:null;
      const w=current||{route,itemId:savedId};
      const prices=routeItemCosts(w);
      const {item,ask,sale,cost}=prices;
      if((route==='blood'||route==='shop')&&cost!==null&&sale!==null){
        add(route,{net:sale-cost,cost,fee:ask-sale,label:item.name,period:'one item',
          basis:'Lowest shown purchase cost and standard market sale fee. Shop availability can vary.'});
      }else if(route==='city'){
        const proceeds=Math.max(sale||0,item?.shopSell||0);
        if(proceeds>0)add(route,{net:proceeds,cost:0,fee:proceeds===sale?ask-sale:0,label:item.name,period:'one found item',
          basis:'Assumes the item was collected at no cash cost'});
      }else if(route==='inventory'&&item){
        const holding=positions().find(x=>x.itemId===item.id&&x.qty>0);
        const proceeds=Math.max(sale||0,item.shopSell||0);
        if(holding&&proceeds>0){
          const unit=holding.cost/holding.qty;
          add(route,{net:proceeds-unit,cost:unit,fee:proceeds===sale?ask-sale:0,
            label:item.name,period:'one item',basis:'Original unit cost from the trade ledger'});
        }
      }else if(route==='forgery'&&item){
        const materials=forgeryCosts(w);
        const proceeds=Math.max(sale||0,item.shopSell||0);
        if(proceeds>0&&materials?.cost!==null&&materials?.cost!==undefined){
          add(route,{net:proceeds-materials.cost,cost:materials.cost,fee:proceeds===sale?ask-sale:0,
            label:item.name,period:'one successful project',basis:'Saved recipe quantities. Reusable tools and failed attempts are excluded.'});
        }
      }
    }
    for(const [route] of incomeRoutes){
      const plan=state.settings.routePlans?.[route];
      if(!plan||![plan.gross,plan.cost].every(x=>Number.isFinite(x)&&x>=0))continue;
      models.set(route,{net:plan.gross-plan.cost,cost:plan.cost,period:recurringRoutes.has(route)?'30 days':'one run',
        basis:'Your saved estimate, including the costs you entered',label:typeof plan.label==='string'?plan.label:''});
    }
    return models;
  }

  function routeRankingSummary(model){
    const money='<strong class="'+(model.net<0?'negative':'positive')+'">'+fmt(model.net)+'</strong>';
    const costs=[
      model.cost!==undefined?'Costs '+fmt(model.cost):'',
      model.fee!==undefined?'Sale fee '+fmt(model.fee):'',
      model.capital!==undefined?'Cash required '+fmt(model.capital):''
    ].filter(Boolean).join(' · ');
    return money+' <small>/ '+esc(model.period)+'</small>'+
      '<p class="muted">'+esc([model.label,costs,model.basis].filter(Boolean).join(' · '))+'</p>';
  }

  function routePricePanel(w){
    if(w.step>=3)return '';
    const itemRoute=itemPriceRoutes.has(w.route);
    if(!itemRoute&&!['market','points','museum','travel','stocks'].includes(w.route))return '';
    const item=itemRoute?selectedRouteItem(w):null;
    const catalog=Object.values(state.catalog);
    let picker='';
    if(w.route==='blood'){
      picker='<label>In-game blood type <select id="ps-route-blood"><option value="">Select once</option>'+
        bloodTypes.map(type=>'<option value="'+type+'"'+(type===state.settings.routeBloodType?' selected':'')+'>'+type+'</option>').join('')+
        '</select></label><p class="muted">Select the type shown in Torn so ProfitStaxx prices the correct filled bag.</p>';
    }else if(itemRoute&&catalog.length){
      picker='<form id="ps_route_item"><label>Item name <input name="routeItem" list="ps-route-items" value="'+esc(item?.name||'')+'" required autocomplete="off"></label> '+
        '<button class="btn secondary" type="submit">Get price</button><datalist id="ps-route-items">'+
        catalog.filter(x=>w.route==='shop'?x.shopBuy>0:w.route==='forgery'?x.shopSell>0||x.tradable!==false:x.tradable!==false||x.shopSell>0)
          .map(x=>'<option value="'+esc(x.name)+'"></option>').join('')+'</datalist></form>';
    }
    const costs=routeItemCosts(w);
    const quote=w.route==='market'?freshRouteQuote(w.itemId):costs.quote;
    const ask=quote?.offers?.[0]?.price||0;
    const afterFee=ask?Math.floor(ask*.95):null;
    const {emptyAsk,shelf,cost:unitCost}=costs;
    const line=(label,value)=>'<div class="line"><span>'+esc(label)+'</span><b>'+fmt(value)+'</b></div>';
    let prices='';
    if(emptyAsk)prices+=line('Empty bag · lowest market ask',emptyAsk);
    if(shelf)prices+=line('Listed shop buy price · check stock',shelf);
    if(ask)prices+=line('Lowest resale ask · '+age(quote.at),ask)+line('Standard market sale fee',ask-afterFee)+
      line('Estimated proceeds after sale fee',afterFee);
    if(item?.shopSell>0&&['city','inventory','forgery','auction'].includes(w.route))prices+=line('Listed City shop sale price',item.shopSell);
    if(unitCost!==null&&afterFee!==null)prices+=line('Estimated margin per item at the cheapest shown cost',afterFee-unitCost);
    if(['points','museum'].includes(w.route)&&now()-state.pointsCheckedAt<quoteWindow&&state.pointsCheckedAt>0&&state.pointsPrice>0)
      prices+=line('Lowest Points Market ask · '+age(state.pointsCheckedAt),state.pointsPrice);
    if(w.route==='museum'&&!w.target)prices+='<div class="toolbar">'+RECIPES.map(recipe=>
      '<button class="btn secondary" data-action="route-museum" data-target="'+esc(recipe.name)+'">Price '+esc(recipe.name)+'</button>').join('')+'</div>';
    if(w.route==='travel'&&!w.target){
      const row=travelRows().find(x=>x.valid&&freshRouteQuote(x.id));
      if(row)prices+='<p>Current trip estimate · '+esc(row.countryName+' / '+row.name)+' · '+fmt(row.net)+' net.</p>'+
        '<button class="btn secondary" data-action="route-travel" data-target="'+esc('travel-'+row.country+'-'+row.id)+'">Choose this trip</button>';
    }
    if(w.route==='stocks'&&!w.target&&now()-stockState.at<quoteWindow&&now()-stockState.ownedAt<quoteWindow){
      const block=stockBlockOpportunities().find(x=>x.affordable&&x.annual!==null);
      if(block)prices+='<p>Available benefit block · '+esc(block.acronym)+' · '+fmt(block.cost)+' for '+block.need+' more shares.</p>';
    }
    if(w.route==='forgery'&&item){
      const materialCosts=forgeryCosts(w);
      const recipe=state.settings.forgeryMaterials?.[w.itemId];
      const values=Array.isArray(recipe)?recipe.filter(m=>m&&m.id&&m.qty).map(m=>m.qty+' x '+(catalog.find(x=>x.id===m.id)?.name||'')).join('\n'):'';
      prices+='<form id="ps_forgery_materials"><label>Consumed materials for one project'+
        '<textarea name="materials" rows="3" maxlength="400" placeholder="26 x Bond Paper">'+esc(values)+'</textarea></label>'+
        '<p class="muted">Enter one quantity and item name per line, up to six materials. Include every consumed item.</p>'+
        '<button class="btn secondary" type="submit">Price these materials</button></form>';
      if(materialCosts){
        prices+=materialCosts.lines.map(x=>x.amount===null?'<p>'+esc(x.label)+' · Price unavailable</p>':line(x.label,x.amount)).join('');
        if(materialCosts.cost!==null){
          prices+=line('Total consumable cost',materialCosts.cost);
          const proceeds=Math.max(afterFee||0,item.shopSell||0);
          if(proceeds>0)prices+=line('Estimated project profit',proceeds-materialCosts.cost);
        }
      }
    }
    if(!prices&&!routePricing.busy&&apiKey()&&(item||w.itemId||w.route==='blood'))prices='<p class="muted">No current price available for this selection.</p>';
    return '<section class="card ps-route-prices"><h3>Current prices</h3>'+picker+
      (!apiKey()?'<p>Connect your Torn API key in Settings to fetch prices.</p>':'')+prices+
      (ask?'<p class="muted">Asking prices show current listings. Actual sale proceeds may differ.</p>':'')+
      (routePricing.busy?'<p role="status">Checking prices…</p>':'')+
      (routePricing.key===routePricingKey(w)&&routePricing.error?notice(routePricing.error,true):'')+
      '<button class="btn secondary" data-action="route-prices"'+(routePricing.busy||!apiKey()?' disabled':'')+'>Refresh prices</button></section>';
  }

  function syncRouteBar(){
    if(!routeBar||!routeBarHost)return;
    const w=state.walkthrough;
    routeBarHost.hidden=!w||w.step>=4||w.barHidden||state.open;
    if(routeBarHost.hidden)return;
    const page=document.querySelector('#mainContainer .content-wrapper')||
      document.querySelector('main[role="main"], #mainContainer, main')||document.body;
    if(page&&routeBarHost.parentElement!==page)page.prepend(routeBarHost);

    const label=w.name||incomeRoutes.find(r=>r[0]===w.route)[1];
    const step=routeGuides[w.route].steps[w.step][0];
    const signature=w.id+':'+w.step;
    if(routeBar.dataset.step===signature)return;
    routeBar.dataset.step=signature;
    routeBar.querySelector('.ps-route-bar-label').textContent=label;
    routeBar.querySelector('.ps-route-bar-step').textContent='Step '+(w.step+1)+'/4 · '+step;
  }

  function loadWalkthrough(value){
    if(!value||typeof value!=='object'||!Object.hasOwn(routeGuides,value.route)||
        !/^[a-z0-9-]{1,50}$/.test(value.id||'')||!Number.isInteger(value.step)||value.step<0||value.step>4)return null;
    const plan=value.plan&&['gross','cost','minutes','resource'].every(key=>Number.isFinite(value.plan[key])&&value.plan[key]>=0&&value.plan[key]<=1e12)
      ?{gross:value.plan.gross,cost:value.plan.cost,minutes:value.plan.minutes,resource:value.plan.resource}:null;
    return {id:value.id,route:value.route,step:value.step,
      target:typeof value.target==='string'?value.target.slice(0,160):'',
      name:typeof value.name==='string'?value.name.slice(0,100):'',
      itemId:Number.isSafeInteger(value.itemId)&&value.itemId>0?value.itemId:0,barHidden:value.barHidden===true,plan};
  }

  function startWalkthrough(route,target=null){
    if(!Object.hasOwn(routeGuides,route)||!routeStoreReady)return;
    const current=state.walkthrough,targetId=target?.id||'';
    if(current&&current.step<4&&(current.route!==route||current.target!==targetId)&&
        !confirm('Replace the current walkthrough? Your saved income and trades stay in the ledger.'))return;
    if(!current||current.step>=4||current.route!==route||current.target!==targetId){
      state.error='';
      state.walkthrough=loadWalkthrough({id:now()+'-'+Math.random().toString(36).slice(2,10),route,step:0,
        target:targetId,name:target?.label||'',itemId:target?.itemId||Number(state.settings.routeItems?.[route])||0,plan:target?null:state.settings.routePlans?.[route]});
      persist();
    }
    state.tab='walkthrough';
    render();
    void refreshRoutePrices();
  }

  function walkthroughQuote(w){
    if(!w.target)return null;
    if(w.route==='market'){
      const deal=deals().find(d=>Number(d.id)===w.itemId&&freshRouteQuote(d.id));
      return deal?{cost:deal.buy*deal.qty,net:deal.profit,period:'one trade',deal}:null;
    }
    if(w.route==='travel'){
      const row=travelRows().find(r=>'travel-'+r.country+'-'+r.id===w.target&&hasTripPricing(r));
      return row?{cost:row.spent,net:row.net,period:'one round trip',travel:row}:null;
    }
    if(w.route==='museum'){
      const set=recipeResults().find(r=>'museum-'+r.name===w.target);
      return set?.ready&&set.profit!==null&&state.pointsCheckedAt>0&&now()-state.pointsCheckedAt>=0&&
        now()-state.pointsCheckedAt<quoteWindow&&set.rows.every(r=>freshRouteQuote(r.id))?
        {cost:set.missingCost,net:set.profit,period:'one conversion'}:null;
    }
    return incomeCandidates().find(r=>r.id===w.target)||null;
  }

  async function openWalkthroughTorn(){
    const w=state.walkthrough;
    if(!w||w.step>=4)return;
    const destination=routeGuides[w.route].steps[w.step][2];
    if(destination&&!destination.startsWith('@'))return;
    const source=destination?destination.slice(1):w.route;
    const route=incomeRoutes.find(r=>r[0]===source);
    if(!route)return;
    let url='https://www.torn.com'+route[2];
    if(source==='market'&&w.itemId){
      url=linkToItem(w.itemId);
      if(w.route==='market'&&w.step===1){
        const deal=walkthroughQuote(w)?.deal;
        if(deal)try{
          sessionStorage.setItem('profitstaxx-market-intent-v1',JSON.stringify({
            id:w.itemId,qty:Math.floor(deal.qty),maxPrice:Number(deal.buy),
            name:String(deal.name).slice(0,80),at:now(),quoteAt:deal.at
          }));
        }catch(_){/* The market can still open without quantity assistance. */}
      }
    }
    await saveChain;
    if(state.walkthrough!==w)return;
    state.open=false;render();
    if(location.href===url){marketAssist();return;}
    location.assign(url);
  }

  function saveWalkthroughForm(form){
    const w=state.walkthrough,planning=form.id==='ps_route_plan';
    if(!w||(planning?w.step!==0:w.step!==3||['market','stocks'].includes(w.route)))return;
    const fields=new FormData(form);
    const first=planning?'gross':'received',second=planning?'cost':'spent';
    const gross=Number(fields.get(first)),cost=Number(fields.get(second));
    const minutes=Number(fields.get('minutes')),resource=Number(fields.get('resource'));
    if(!String(fields.get(first)??'').trim()||!String(fields.get(second)??'').trim()||
       ![gross,cost,minutes,resource].every(v=>Number.isFinite(v)&&v>=0&&v<=1e12)){
      alert('Enter non-negative cash amounts and optional time or energy. Enter 0 for no costs.');return;
    }
    if(planning){
      const plan={gross,cost,minutes,resource};
      state.walkthrough={...w,plan};
      state.settings.routePlans={...state.settings.routePlans,[w.route]:{...plan,label:w.name||selectedRouteItem(w)?.name||''}};
      persist();
    }else{
      const id='route-'+w.id,records=moneyRecords();
      state.walkthrough={...w,step:4};
      const next=records.some(x=>x.id===id)?records:[...records,{id,at:now(),source:w.route,net:gross-cost,minutes,
        note:String(fields.get('note')||w.name||'Walkthrough result').slice(0,100)}];
      putMoney(next);
    }
    render();
  }

  function startRouteButton(route,label='Start walkthrough'){
    return '<button class="btn secondary" data-action="route-start" data-source="'+esc(route)+'">'+esc(label)+'</button>';
  }

  function renderRouteDirectory(){
    const models=routeProfitModels(),recent=new Map(),cutoff=now()-30*86400000;
    for(const record of moneyRecords()){
      if(record.at<cutoff||record.at>now()||!Number.isFinite(record.at)||!Number.isFinite(record.net))continue;
      recent.set(record.source,(recent.get(record.source)||0)+record.net);
    }
    const rows=incomeRoutes.map(([id,label])=>({id,label,model:models.get(id)}));
    const renderRow=(row,index)=>{
      const {id,label,model}=row;
      const button=model?.target?
        '<button class="btn secondary" data-action="route-ranked" data-source="'+esc(id)+'">Choose</button>':
        startRouteButton(id,'Choose');
      return '<div class="ps-rank-row"><div><strong>'+(index===null?'':(index+1)+'. ')+esc(label)+'</strong>'+
        (model?'<div>'+routeRankingSummary(model)+'</div>':'<p class="muted">'+esc(routeCostNeeds[id])+'</p>')+
        (recent.has(id)?'<small>Recorded in 30 days: '+fmt(recent.get(id))+' net</small>':'')+'</div>'+button+'</div>';
    };
    const ranked=(label,filter)=>{
      const priced=rows.filter(row=>row.model&&filter(row.id)).sort((a,b)=>b.model.net-a.model.net||a.label.localeCompare(b.label));
      return '<section class="card"><h3>'+label+'</h3>'+
        (priced.length?priced.map(renderRow).join(''):'<p class="muted">No complete estimates yet.</p>')+'</section>';
    };
    return '<p class="muted">Ranked by estimated net profit. Run sizes are shown on each row.</p>'+
      ranked('Profit per run',id=>!recurringRoutes.has(id))+ranked('Recurring profit per 30 days',id=>recurringRoutes.has(id))+
      '<section class="card"><h3>More figures needed</h3>'+rows.filter(row=>!row.model).map(row=>renderRow(row,null)).join('')+'</section>';
  }

  function renderWalkthrough(){
    const w=state.walkthrough;
    if(!w)return '<h2>Choose a money-making route</h2>'+(routeStoreReady?renderRouteDirectory():'<p>Restoring saved routes…</p>');
    const guide=routeGuides[w.route],label=incomeRoutes.find(row=>row[0]===w.route)[1];
    const top='<h2>'+esc(w.name||label)+'</h2>'+(w.name?'<p>'+esc(label)+'</p>':'');
    const switcher='<details data-view-key="route-switch"><summary>Choose a different route</summary>'+renderRouteDirectory()+'</details>';
    const result=w.step===4?moneyRecords().find(x=>x.id==='route-'+w.id):null;
    if(w.step===4)return top+'<div class="card"><h3>Walkthrough complete</h3>'+
      (result?'<p>Saved result · '+fmt(result.net)+' net'+(w.plan?' · '+fmt(w.plan.gross-w.plan.cost)+' estimated':'')+'</p>':'')+'<button class="btn" data-tab="portfolio">View my money</button> '+
      '<button class="btn secondary" data-action="route-repeat">Start another run</button></div>'+switcher;

    const [title,detail,destination]=guide.steps[w.step];
    const quote=w.step<2?walkthroughQuote(w):null;
    const cash=liveWalletCashV113();
    let evidence='';
    if(w.target&&w.step<2){
      evidence=quote?'<p>Current estimate for '+esc(quote.period)+' · '+fmt(quote.cost)+' needed · '+fmt(quote.net)+' estimated net.</p>':
        '<p class="muted">The saved opportunity has no current qualifying quote. Refresh its source and check the live terms in Torn.</p>';
      if(quote?.travel)evidence+='<p>Check '+quote.travel.quantityBuy+' × '+esc(quote.travel.name)+' at '+fmt(quote.travel.cost)+' in '+esc(quote.travel.countryName)+'.</p>';
      if(quote&&cash!==null&&quote.cost>cash)evidence+='<p class="negative">The estimated cost exceeds your last checked Torn cash balance.</p>';
    }
    const action=destination&&!destination.startsWith('@')?'<button class="btn" data-tab="'+destination+'">Open '+({scan:'Deals',portfolio:'My money',stocks:'Stocks',travel:'Travel',museum:'Museum planner',income:'Income'}[destination])+'</button>':
      '<button class="btn" data-action="route-torn">Open '+esc(({market:'Item Market',points:'Points Market',city:'City map',inventory:'Items',
        blood:'Items',travel:'Travel Agency',oc:'Faction crimes',war:'Faction',forgery:'Crimes',crimes:'Crimes',revive:'Hospital',
        bounty:'Bounties',auction:'City',shop:'City',other:'City',stocks:'Stock Market',bank:'Bank',rent:'Properties',
        company:'Company',museum:'Museum'})[destination?.slice(1)||w.route]||'Torn')+'</button>';
    const showReceipt=w.step===3&&w.route!=='market'&&w.route!=='stocks';
    const plan=w.plan,net=plan?plan.gross-plan.cost:null;
    const estimate=plan?'<p>Saved estimate · '+fmt(net)+' net'+(plan.minutes?' · '+fmt(net*60/plan.minutes)+'/active hour':'')+
      (plan.resource&&guide.resource?' · '+fmt(net/plan.resource)+'/'+esc(guide.resource):'')+'</p>':'';
    const calculator=w.step===0?'<details data-view-key="route-estimate"><summary>Estimate '+(recurringRoutes.has(w.route)?'30 days':'this run')+'</summary>'+
      '<form id="ps_route_plan"><div class="duo">'+field('gross','Expected cash after fees ($)',plan?.gross??'')+
      field('cost','Expected total costs ($)',plan?.cost??'')+'</div><div class="duo">'+
      field('minutes','Active minutes (optional)',plan?.minutes??'')+(guide.resource?field('resource',guide.resource+' budget (optional)',plan?.resource??''):'')+
      '</div><button class="btn secondary" type="submit">Save estimate</button></form></details>':'';
    const receipt=showReceipt?'<form id="ps_route_receipt"><div class="duo">'+field('received','Cash actually received ($)','','number','required min="0" step="1"')+
      field('spent','Actual costs ($)','','number','required min="0" step="1"')+'</div><div class="duo">'+field('minutes','Active minutes (optional)','')+
      field('note','Note','','text','maxlength="100"')+'</div><button class="btn" type="submit">Save result and finish</button></form>':'';
    return top+(state.error?notice(state.error,true):'')+'<div class="ps-desk-next"><small>STEP '+(w.step+1)+' OF 4</small><h2 class="ps-route-current" tabindex="-1">'+esc(title)+'</h2><p>'+esc(detail)+'</p>'+evidence+
      estimate+calculator+'<div class="toolbar">'+(showReceipt?'':action)+
      (w.step>0?'<button class="btn secondary" data-action="route-back">Back a step</button>':'')+
      (w.step<3?'<button class="btn secondary" data-action="route-next">'+['Plan checked · continue','Action done · continue','Result checked · continue'][w.step]+'</button>':
       '<button class="btn secondary" data-action="route-next">'+(showReceipt?'Finish without recording':'Mark complete')+'</button>')+'</div>'+receipt+'</div>'+routePricePanel(w)+
      '<ol class="ps-route-steps">'+guide.steps.map(([name],i)=>'<li'+(i===w.step?' aria-current="step"':'')+'>'+esc(name)+(i<w.step?' · done':'')+'</li>').join('')+'</ol>'+
      '<button class="btn secondary" data-action="route-bar-toggle">'+(w.barHidden?'Show route bar':'Hide route bar')+'</button> '+
      '<button class="btn secondary" data-action="route-cancel">Clear walkthrough</button>'+switcher;
  }

  const stockState={all:[],owned:[],at:0,ownedAt:0,loading:false,error:''};

  const stockLogStatus={busy:false,error:'',partial:false,unparsed:0};
  // User/log category 134 = Stock special events. Benefits merely flagged available are not receipts.
  function parseStockCashReceipt(entry){
    if(!entry||!entry.id||!Number.isFinite(Number(entry.timestamp)))return null;
    const title=String(entry.details?.title||'');
    if(!/(?:dividend|stock benefit|stock reward)/i.test(title))return null;
    const d=entry.data||{},cashKeys=['money_received','cash_received','dividend_amount','cash_amount','money','cash','dividend','payout'];
    let amount=null;
    for(const key of cashKeys)if(typeof d[key]==='number'&&Number.isSafeInteger(d[key])&&d[key]>0){amount=d[key];break;}
    if(amount===null&&/cash|money|dividend/i.test(title)&&
      (d.currency==='USD'||d.currency==='$'||d.currency==='money')&&
      Number.isSafeInteger(d.amount)&&d.amount>0)amount=d.amount;
    const at=Number(entry.timestamp)*1000,id=String(entry.id);
    if(amount===null||amount>1e12||!/^[a-z0-9_-]{1,90}$/i.test(id)||
      at<now()-90*86400000||at>now()+60000)return null;
    return {id,at,amount,stock:String(d.stock_name||d.stock||d.stock_acronym||'').slice(0,45)};
  }
  function stockCashReceipts(days=30){
    return (Array.isArray(state.stockReceipts)?state.stockReceipts:[]).filter(x=>Number(x.at)>=now()-days*86400000&&Number(x.amount)>0);
  }
  function stockBlockOpportunities(){
    if(!stockState.at||!stockState.ownedAt||now()-stockState.at>=30*60000||
      now()-stockState.ownedAt>=30*60000)return [];
    const modelCap=Math.max(0,number(state.settings.capital)*(1-number(state.settings.reservePct)/100)-openCost());
    const wallet=liveWalletCashV113(),cap=Math.min(modelCap,wallet===null?Infinity:wallet);
    return stockRows().filter(x=>x.block>0&&x.need>0&&x.need<1e10&&Number.isFinite(x.p)&&x.p>0)
      .map(x=>{
        const cost=x.need*x.p,dividend=dividendCash[x.acronym];
        const annual=dividend?dividend[0]*365/dividend[1]:null;
        return {id:Number(x.id),acronym:String(x.acronym),name:String(x.name),need:Math.ceil(x.need),
          owned:Math.floor(x.shares),nextShares:Math.ceil(x.shares+x.need),cost,
          cashCap:cap,affordable:cost>0&&cost<=cap,annual,
          marginalYield:annual!==null&&cost>0?100*annual/cost:null,fullYield:x.annualYield};
      }).filter(x=>Number.isFinite(x.cost)&&x.cost>0)
      .sort((a,b)=>Number(b.affordable)-Number(a.affordable)||
        (b.marginalYield??-1)-(a.marginalYield??-1)||a.cost-b.cost).slice(0,30);
  }
  async function refreshStockCashLogs(manual=false){
    if(stockLogStatus.busy||!apiKey()||document.hidden||state.settings.stockLogSync===false)return;
    if(!manual&&(now()-state.stockLogCheckedAt<3600000||now()<state.stockLogRetryAt))return;
    stockLogStatus.busy=true;stockLogStatus.error='';state.stockLogCheckedAt=now();render();
    let cursor='user/log?cat=134&limit=100&from='+Math.floor((now()-90*86400000)/1000);
    const existing=new Set((state.stockReceipts||[]).map(x=>x.id)),added=[];
    try{
      let pages=0;stockLogStatus.partial=false;stockLogStatus.unparsed=0;
      while(cursor&&pages<3){
        const response=await api(cursor);pages++;
        if(!Array.isArray(response.log))throw Error('Torn returned no stock-log list.');
        for(const log of response.log){
          const receipt=parseStockCashReceipt(log);
          if(receipt&&!existing.has(receipt.id)){existing.add(receipt.id);added.push(receipt);}
          else if(/dividend|cash/i.test(String(log?.details?.title||''))&&!receipt)stockLogStatus.unparsed++;
        }
        const next=response._metadata?.links?.next;
        if(!next||!response.log.length){cursor='';break;}
        const u=new URL(next,'https://api.torn.com');
        if(u.origin!=='https://api.torn.com'||u.pathname!=='/v2/user/log'||
          u.searchParams.get('cat')!=='134')throw Error('Unsafe stock-log cursor rejected');
        cursor=u.pathname.slice(4)+u.search;
      }
      stockLogStatus.partial=!!cursor;
      state.stockReceipts=[...(state.stockReceipts||[]),...added]
        .filter(x=>x&&Number(x.at)>=now()-90*86400000&&Number(x.amount)>0)
        .sort((a,b)=>b.at-a.at).slice(0,180);
      state.stockLogRetryAt=0;persist();
      if(added.length)document.dispatchEvent?.(new CustomEvent('staxx:activity',{detail:{id:'profit',events:added.slice(0,20).map(x=>({
        id:'stock-dividend-'+x.id.slice(0,70),at:x.at,source:'api',section:'income',
        title:'Cash stock dividend received · '+fmt(x.amount),
        detail:(x.stock||'Torn stock benefit')+' · Matched cash receipt in user/log'
      }))}}));
    }catch(e){
      stockLogStatus.error='Dividend log sync unavailable: '+String(e.message||e).slice(0,145);
      state.stockLogRetryAt=now()+24*3600000;persist();
    }finally{stockLogStatus.busy=false;render();}
  }

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
  // An API 'available' flag is a benefit status, not proof the player must click Claim.
  // Passive stock perks apply automatically. Manual withdrawal reminders are explicitly opt-in.
  function reportedReadyDividends(){
    return stockState.ownedAt&&now()-stockState.ownedAt<1800000
      ?stockRows().filter(x=>x.bonus?.passive===false&&x.own?.bonus?.available===true):[];
  }
  function dueDividends(){return state.settings.stockClaimReminders===true?reportedReadyDividends():[];}
  async function refreshStocks(){
    if(stockState.loading||!apiKey())return;
    stockState.loading=true;stockState.error='';render();
    try{
      const rows=await api('torn/stocks');
      if(!Array.isArray(rows.stocks))throw Error('Invalid stock quote response.');
      stockState.all=rows.stocks;stockState.at=now();
      document.dispatchEvent?.(new CustomEvent('staxx:activity',{detail:{id:'profit',events:[{
        id:'stock-quotes-'+Math.floor(stockState.at/(6*3600000)),at:stockState.at,
        source:'snapshot',section:'stocks',title:'Torn stock quotes observed',
        detail:stockState.all.length+' reported stock entries · Price observation, not a completed trade'
      }]}}));
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

  function renderStockCashReceipts(){
    const rows=stockCashReceipts(30),total=rows.reduce((n,x)=>n+Number(x.amount),0);
    let html='<div class="card"><h3>Verified cash stock dividends · last 30 days</h3>'+
      '<div class="statrow"><div class="stat"><small>Matched Torn log receipts</small><b>'+rows.length+'</b></div>'+
      '<div class="stat"><small>Cash from matched logs</small><b>'+(rows.length?fmt(total):'No verified receipts')+'</b></div></div>'+
      '<p class="muted">Only money receipts from Torn user/log stock category 134 count here. Full access (or matching custom log permission) is needed. Unavailable data is not proof of zero income.</p>'+
      '<div class="toolbar"><button class="btn secondary" data-action="stock-log-sync" '+(stockLogStatus.busy||state.settings.stockLogSync===false?'disabled':'')+'>'+
        (stockLogStatus.busy?'Reading logs…':'Sync stock cash logs')+'</button>'+
      '<button class="btn secondary" data-action="stock-log-toggle">'+(state.settings.stockLogSync===false?'Enable':'Disable')+' log checks</button></div>';
    if(stockLogStatus.error)html+=notice(stockLogStatus.error,true);
    else if(state.stockLogCheckedAt)html+='<p class="muted">Last checked '+age(state.stockLogCheckedAt)+(stockLogStatus.partial?' · partial log coverage (3-page cap)':'')+(stockLogStatus.unparsed?' · '+stockLogStatus.unparsed+' entries not safely parsed':'')+'.</p>';
    else html+='<p class="muted">No verified dividend log check yet.</p>';
    for(const x of rows.slice(0,6))html+='<div class="line"><span>'+esc(x.stock||'Cash dividend')+' · '+new Date(x.at).toLocaleDateString('en-GB')+'</span><b>'+fmt(x.amount)+'</b></div>';
    return html+'</div>';
  }
  function renderStockBlockRanking(){
    const rows=stockBlockOpportunities();
    let h='<div class="card"><h3>Best next stock benefit blocks</h3>'+
      '<p class="muted">Fresh holdings and stock quotes, protected capital reserve, and verified cash-on-hand when available. Marginal shares are the difference to the next block, not a new full-block purchase.</p>';
    if(!rows.length)return h+'<p class="muted">Current holdings and quotes are needed. Refresh Stocks to rank without guessing.</p></div>';
    h+='<p class="muted">Spendable cap '+fmt(rows[0].cashCap)+' · '+(liveWalletCashV113()===null?'based on saved trading capital (wallet not verified)':'also capped by observed Torn cash')+'.</p>';
    for(const x of rows.slice(0,6)){
      h+='<div class="line"><strong>'+esc(x.acronym)+' · '+fmt(x.cost)+'</strong><span class="pill">'+(x.affordable?'Within cap':'Over cap')+'</span></div>'+
        '<p class="muted">Owned '+x.owned.toLocaleString('en-GB')+' · next increment needs '+x.need.toLocaleString('en-GB')+
        ' shares · '+(x.annual===null?'Benefit value unpriced':'Modelled annual cash per earned increment '+fmt(x.annual)+
        ' · marginal cash yield '+pct(x.marginalYield))+
        ' · excludes eligibility delay and share-price movements.</p>';
    }
    return h+'<button class="btn secondary" data-action="stockpage">Inspect stock exchange</button></div>';
  }

  function renderStockPanel(){
    const rows=stockRows(),reported=reportedReadyDividends(),due=dueDividends();
    let h='<div class="toolbar"><button class="btn" data-action="stockrefresh" '+(stockState.loading?'disabled':'')+'>'+(stockState.loading?'Refreshing…':'Refresh stocks')+
      '</button><button class="btn secondary" data-action="stockpage">Open Torn stock exchange</button></div>'+
      notice('Block costs and share prices are from Torn API v2. Annual yield is shown only for fixed cash dividends; price appreciation is excluded. Selling shares incurs a 0.1% fee.');
    if(stockState.error)h+=notice(stockState.error,true);
    h+=stockWatchPanel();
    h+=renderStockBlockRanking();
    h+=renderStockCashReceipts();
    if(stockSignals().length)h+='<div class="card"><h3>Stock price targets reached</h3>'+stockSignals().map(x=>'<div class="line" id="ps-alert-'+esc(x.id)+'"><span>'+esc(x.title)+' · '+esc(x.why)+'</span><button class="btn secondary" data-action="stockpage">Inspect</button></div>').join('')+'</div>';
    if(!rows.length)return h+'<div class="empty">Press Refresh to load live stocks.</div>';
    h+='<div class="statrow"><div class="stat"><small>Market value of owned shares</small><b>'+(stockState.ownedAt?fmt(rows.reduce((n,x)=>n+x.shares*x.p,0)):'Limited key needed')+'</b></div>'+
      '<div class="stat"><small>API-reported active benefits</small><b>'+(stockState.ownedAt?reported.length:'—')+'</b></div></div>';
    h+='<div class="card"><div class="line"><b>Manual stock withdrawal reminders</b><button class="btn secondary" data-action="stock-reminders">'+(state.settings.stockClaimReminders===true?'On · disable':'Off · enable')+'</button></div>'+
      '<p class="muted">Off by default. Torn API can report a benefit as available even when no action is needed. Passive stock perks are automatic and never trigger a claim reminder. Turning this on only reminds you to verify active payouts on Torn.</p></div>';
    if(due.length)h+='<div class="card" id="ps-alert-stock-claim"><h3>Review reported stock benefits</h3><p>'+due.map(x=>esc(x.acronym)).join(', ')+' · Torn API reports available; check whether already credited.</p><button class="btn" data-action="stockpage">Verify on Torn</button></div>';
    for(const x of rows)h+='<div class="card"><div class="line"><strong>'+esc(x.acronym)+' · '+esc(x.name)+'</strong><span class="pill">'+(x.annualYield===null?'Unpriced bonus':pct(x.annualYield)+' cash yield')+'</span></div>'+
      '<div class="line"><span>Share / first benefit block</span><b>'+fmt(x.p)+' / '+fmt(x.p*x.block)+'</b></div>'+
      '<p class="muted">'+esc(x.bonus?.description||'No benefit description')+(stockChange(x)===null?' · 24h trend unavailable':' · sampled 24h '+pct(stockChange(x)))+'</p>'+
      (stockState.ownedAt?'<p>Owned '+Math.floor(x.shares).toLocaleString('en-US')+' · active increments '+x.increment+
        (x.bonus?.passive===false&&x.own?.bonus?.available===true?' · <b class="positive">API: benefit available</b>':'')+'</p><p class="muted">Next benefit: '+Math.floor(x.need).toLocaleString('en-US')+' more shares, about '+fmt(x.need*x.p)+'.</p>':'')+
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
      const q=state.quotes[x.id],fresh=q&&now()-q.at>=0&&now()-q.at<8*60000&&q.reference>0;
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
        '<button class="btn secondary" data-action="route-travel" data-target="'+esc('travel-'+x.country+'-'+x.id)+'">Start this trip</button></div>';
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
    const stocks=stockBlockOpportunities().filter(x=>x.affordable&&x.annual!==null);
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
      (top?'<div class="line"><span>Highest fixed-cash stock yield within cash cap</span><b>'+esc(top.acronym)+' · '+pct(top.marginalYield)+'</b></div>'+
        '<p class="muted">Next increment: '+top.need.toLocaleString('en-GB')+' shares for '+fmt(top.cost)+'. Marginal yield is based on additional cash only; eligibility delay and share-price losses are excluded.</p>':
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
    const receipts=stockCashReceipts(30),cash=receipts.reduce((n,x)=>n+Number(x.amount),0);
    const trades=portfolio();
    let h='<div class="card"><h3>Actual versus estimated · separate evidence</h3>'+
      '<div class="statrow"><div class="stat"><small>Verified stock cash receipts · 30d</small><b>'+fmt(cash)+'</b></div>'+
      '<div class="stat"><small>Manual income entries · 30d</small><b>'+fmt(sum(30))+'</b></div>'+
      '<div class="stat"><small>Recorded completed trade P/L (ledger)</small><b>'+fmt(trades.realised)+'</b></div></div>'+
      '<p class="muted">Torn API-verified cash receipts are separate from locally recorded figures. Manually recorded stock income may duplicate synced dividends; totals are deliberately NOT added together. All buy opportunities and future benefit yields are estimates, not actual income.</p></div>'+
      '<div class="statrow"><div class="stat"><small>7-day manually recorded net</small><b>'+fmt(sum(7))+'</b></div><div class="stat"><small>30-day manually recorded net</small><b>'+fmt(sum(30))+'</b></div></div>'+
      '<div class="card"><h3>Record completed income or losses</h3><form id="ps_revenue"><div class="field"><label>Income source</label><select name="source">'+incomeRoutes.map(r=>'<option value="'+esc(r[0])+'">'+esc(r[1])+'</option>').join('')+'</select></div>'+
      '<div class="duo">'+field('received','Received ($)',0)+field('spent','Spent ($)',0)+'</div><div class="duo">'+field('minutes','Minutes of active work',0)+field('note','Note','','text','maxlength="100"')+'</div><button class="btn" type="submit">Save income</button></form></div>'+
      '';
    h+=renderStockCashReceipts();
    h+=incomeComparisonPanel();
    h+='<div class="card"><h3>Money-making routes</h3><button class="btn" data-tab="walkthrough">Open walkthroughs</button></div>';
    h+='<h3>Income history</h3>';
    for(const x of records.slice(-30).reverse())h+='<div class="card"><div class="line"><b>'+esc(incomeRoutes.find(r=>r[0]===x.source)?.[1]||'Other')+'</b><span>'+fmt(x.net)+'</span></div>'+
      '<div class="line"><span class="muted">'+esc(x.note||new Date(x.at).toLocaleDateString())+'</span><button class="btn red" data-income-id="'+esc(x.id)+'">Delete</button></div></div>';
    return h+notice('Manual income and ledger entries are not API-verified; independently matched dividend receipts are. Future stock cashflows, unsold items, asks and bank scenarios do not count as earned income.');
  }


  // Cross-category ranking deliberately distinguishes one-off spreads from recurring cash benefits.
  function incomeCandidates(){
    const remaining=Math.min(Math.max(0,number(state.settings.capital)*(1-number(state.settings.reservePct)/100)-openCost()),liveWalletCashV113()??Infinity);
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
        period:'one round trip',route:'travel',itemId:Number(r.id),summary:r.roundTripMinutes?'Round-trip minutes: '+r.roundTripMinutes:'Enter travel minutes for hourly comparison'});
    }
    if(state.pointsPrice>0){
      for(const r of recipeResults())if(r.ready&&r.profit>0&&r.missingCost>0){
        add({id:'museum-'+r.name,kind:'museum',label:r.name+' × '+r.batch,category:'active',
          cost:r.missingCost,net:r.profit,minutes:activeMin*2,confidence:38,period:'one conversion',route:'museum',
          summary:'Components and point proceeds are asking-price estimates'});
      }
    }
    for(const block of stockBlockOpportunities().filter(x=>x.affordable&&x.annual!==null)){
      if(block.cost>remaining)continue;
      add({id:'stock-'+block.id,kind:'stock',label:block.acronym+' next cash benefit increment',category:'passive',
        cost:block.cost,net:block.annual*30/365,minutes:0,confidence:65,period:'modelled 30 days after benefit eligibility',
        route:'stocks',summary:'Extra '+block.need+' shares · fixed cash payout only · excludes share-price risk and eligibility delay'});
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
  function hubPlayMinutes(){
    try{const n=JSON.parse(localStorage.getItem('staxx-hub-session-minutes-v1')||'0');return [5,10,15,30,60].includes(n)?n:0;}
    catch(_){return 0;}
  }
  function dailyPlanV111(){
    const day=new Date().toISOString().slice(0,10),settings=state.settings,
      budget=hubPlayMinutes()||Math.max(1,number(settings.dailyReviewMinutes)||15),
      spendable=Math.min(Math.max(0,number(settings.capital)*(1-number(settings.reservePct)/100)-openCost()),liveWalletCashV113()??Infinity),
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
  // Decision workspace: forecast opportunities and recorded outcomes stay separate.
  function profitDeskModel(){
    const money=portfolio(),plan=dailyPlanV111(),fresh=deals().filter(x=>now()-x.at>=0&&now()-x.at<8*60000);
    const affordable=fresh.filter(x=>x.qty*x.buy<=plan.spendable&&dealRisk(x).level!=='High').sort((a,b)=>b.profit-a.profit);
    const exits=exitSignals(),receipts=stockCashReceipts(30);
    return {money,plan,fresh,affordable,exits,receipts,cash:liveWalletCashV113(),
      lastQuote:Math.max(0,...Object.values(state.quotes).map(x=>Number(x.at)||0))};
  }
  function deskMetric(label,value,note){return '<div class="ps-desk-metric"><small>'+esc(label)+'</small><strong>'+esc(value)+'</strong><span>'+esc(note)+'</span></div>';}
  function renderProfitHome(){
    const d=profitDeskModel(),sell=d.exits[0],buy=d.affordable[0];
    let title,reason,action;
    if(!apiKey()){title='Connect your Torn data';reason='Add your key in Settings or enable Torn PDA key substitution to price opportunities.';action='<button class="btn" data-tab="settings">Open settings</button>';}
    else if(sell){title='Review selling '+sell.name;reason=fmt(sell.upside)+' indicative after-fee upside on '+sell.qty+' recorded units. Check actual bids before selling.';action='<button class="btn" data-action="market-view" data-id="'+sell.itemId+'">Inspect live market</button>';}
    else if(buy){title='Review '+buy.name;reason='Up to '+Math.floor(buy.qty)+' units / '+fmt(buy.qty*buy.buy)+' cash / '+fmt(buy.profit)+' estimated gain. Asking-price model, not guaranteed resale.';action='<button class="btn" data-action="route-market" data-id="'+buy.id+'">Start walkthrough</button>';}
    else {title=d.fresh.length?'Keep your reserve intact':'No priced move to recommend';reason=d.fresh.length?'Current deals exceed the available budget or have high risk flags. You do not need to force a purchase.':'Refresh opportunities, then compare costs and evidence before committing cash.';action='<button class="btn" data-action="quickscan" '+(state.busy?'disabled':'')+'>Check opportunities</button>';}
    return '<header class="ps-page-heading"><div><small>PROFIT WORKSPACE</small><h2>Your next money decision</h2></div><div class="toolbar"><button class="btn secondary" data-tab="capital">Budget & reserve</button><button class="btn" data-action="quickscan" '+(state.busy?'disabled':'')+'>Refresh opportunities</button></div></header>'+
      (state.error?notice(state.error,true):'')+(state.busy?'<div class="notice" role="status">'+esc(state.status)+' <button class="btn secondary" data-action="stopscan">Stop scan</button></div>':'')+
      '<div class="card"><div class="line"><div><strong>'+esc(state.walkthrough&&state.walkthrough.step<4?
        'Continue '+(state.walkthrough.name||incomeRoutes.find(r=>r[0]===state.walkthrough.route)[1]):'Choose a money-making route')+
        '</strong><p class="muted">'+(state.walkthrough&&state.walkthrough.step<4?
        'Step '+(state.walkthrough.step+1)+' of 4 · '+esc(routeGuides[state.walkthrough.route].steps[state.walkthrough.step][0]):
        'Follow the steps and record the settled result.')+'</p></div><button class="btn" data-tab="walkthrough">'+
        (state.walkthrough&&state.walkthrough.step<4?'Resume':'Browse routes')+'</button></div></div>'+
      '<section class="ps-desk-next"><small>NEXT REVIEW</small><h2>'+esc(title)+'</h2><p>'+esc(reason)+'</p>'+action+'</section>'+
      '<div class="ps-desk-metrics">'+deskMetric('Spendable model',fmt(d.plan.spendable),'After reserve and recorded exposure')+
        deskMetric('Recorded holdings',fmt(d.money.invested),d.money.positions.filter(x=>x.qty>0).length+' open positions')+
        deskMetric('Torn cash',d.cash===null?'Unverified':fmt(d.cash),d.cash===null?'Saved budget limits still apply':'Last wallet check '+age(state.walletAt))+'</div>'+
      '<div class="ps-desk-columns"><section><h3>Opportunities to inspect</h3>'+
      (d.affordable.length?d.affordable.slice(0,3).map(x=>'<button class="ps-opportunity" data-action="market-buy" data-id="'+x.id+'"><span><b>'+esc(x.name)+'</b><small>'+fmt(x.qty*x.buy)+' cash / '+age(x.at)+'</small></span><span><b>~'+fmt(x.profit)+'</b><small>'+pct(x.roi)+' estimated ROI</small></span></button>').join(''):'<p class="muted">No fresh opportunity fits the current cash and risk limits.</p>')+
      '<div class="toolbar"><button class="btn secondary" data-tab="scan">All item deals</button><button class="btn secondary" data-tab="travel">Travel</button><button class="btn secondary" data-tab="museum">Museum</button></div></section>'+
      '<section><h3>Recorded results</h3>'+deskMetric('Trade ledger P/L',fmt(d.money.realised),'From recorded buy/sell transactions')+
      deskMetric('Verified stock cash / 30 days',d.receipts.length?fmt(d.receipts.reduce((sum,x)=>sum+Number(x.amount),0)):'No matched receipts','Separate from trading P/L; no projected income added')+
      '<button class="btn secondary" data-tab="portfolio">My money & records</button></section></div>'+
      '<section class="ps-research-links"><button data-tab="stocks"><b>Stock benefits</b><small>Compare costs, ownership and cash yields</small></button><button data-tab="best"><b>Other income</b><small>Active and passive options, with their own time periods</small></button><button data-tab="history"><b>Price evidence</b><small>Observed asking-price history</small></button></section>'+
      '<details data-view-key="daily-plan"><summary>Daily shortlist and time budget</summary>'+renderDailyPlanV111()+'</details>';
  }
  let stockViewFilter='all',stockViewQuery='';
  function renderStockWorkspace(){
    const all=stockRows(),budget=dailyPlanV111().spendable,fresh=stockState.at>0&&now()-stockState.at<10*60000;
    const ownedFresh=stockState.ownedAt>0&&now()-stockState.ownedAt<30*60000;
    const rows=all.filter(x=>(x.acronym+' '+x.name).toLowerCase().includes(stockViewQuery.toLowerCase())&&
      (stockViewFilter==='owned'?ownedFresh&&x.shares>0:stockViewFilter==='cash'?x.annualYield!==null:stockViewFilter==='budget'?fresh&&ownedFresh&&x.block>0&&x.need>0&&x.need*x.p<=budget:true));
    return '<header class="ps-page-heading"><div><small>LONGER-TERM MONEY</small><h2>Stock benefits</h2></div><button class="btn" data-action="stockrefresh" '+(stockState.loading?'disabled':'')+'>'+(stockState.loading?'Checking...':'Refresh stocks')+'</button></header>'+
      '<p class="muted">'+(fresh?'Prices checked '+age(stockState.at):'Saved or missing prices; refresh before acting')+'. Fixed-cash yields are estimates; share-price changes and sale fees are excluded.</p>'+
      '<div class="ps-filterbar"><label>Find stock<input id="ps-stock-query" type="search" maxlength="80" value="'+esc(stockViewQuery)+'" placeholder="Name or ticker"></label><label>Show<select id="ps-stock-filter">'+[['all','All stocks'],['owned','Owned / fresh holdings'],['cash','Cash dividends'],['budget','Next block within budget']].map(([v,l])=>'<option value="'+v+'"'+(stockViewFilter===v?' selected':'')+'>'+l+'</option>').join('')+'</select></label></div>'+
      (stockState.error?notice(stockState.error,true):'')+
      '<div class="ps-stock-head"><span>Stock</span><span>First block</span><span>Cash yield / yr</span></div>'+
      (rows.length?rows.map(x=>'<details class="ps-stock-row" data-view-key="stock-'+x.id+'"><summary><span><b>'+esc(x.acronym)+'</b><small>'+esc(x.name)+'</small></span><span>'+(x.block>0?fmt(x.p*x.block):'Unknown')+'</span><span>'+(x.annualYield===null?'Unpriced perk':pct(x.annualYield))+'</span></summary><div class="ps-stock-detail"><p>'+esc(x.bonus?.description||'Benefit not supplied')+'</p><p>Share price '+fmt(x.p)+'. '+(ownedFresh?'Owned '+x.shares+' shares / next increment requires '+x.need+' more (~'+fmt(x.need*x.p)+').':'Fresh ownership unavailable; no affordability claim.')+'</p><button class="btn" data-action="stockpage">Inspect on Torn</button></div></details>').join(''):'<p class="empty">'+(all.length?'No stocks match this filter. Owned and budget filters require fresh ownership data.':'No stock prices loaded. Refresh stocks to compare.')+'</p>')+
      '<details data-view-key="stock-tools"><summary>Targets, receipts and detailed stock analysis</summary>'+renderStockPanel()+'</details>';
  }
  function renderMoneyWorkspace(){
    const p=portfolio(),holdings=p.positions.filter(x=>x.qty>0),exits=exitSignals();
    return '<header class="ps-page-heading"><div><small>YOUR RECORDS</small><h2>My money</h2></div><button class="btn secondary" data-tab="capital">Capital plan</button></header>'+
      '<div class="ps-desk-metrics">'+deskMetric('Recorded realised P/L',fmt(p.realised),'Only recorded transactions')+deskMetric('Open cost basis',fmt(p.invested),'Capital in recorded item holdings')+deskMetric('Open positions',String(holdings.length),'Not an automatic inventory ledger')+'</div>'+
      '<h3>Holdings to review</h3>'+(holdings.length?holdings.map(x=>{const exit=exits.find(r=>r.itemId===x.itemId);return '<div class="ps-holding"><span><b>'+esc(x.name)+'</b><small>'+x.qty+' units / '+fmt(x.cost)+' cost basis</small></span><span>'+(exit?'~'+fmt(exit.upside)+' after-fee upside':'No fresh profitable exit flagged')+'</span><button class="btn secondary" data-action="market-view" data-id="'+x.itemId+'">Market</button></div>';}).join(''):'<p class="empty">No item positions recorded. Add a completed trade below to track its cost and eventual result.</p>')+
      '<details data-view-key="money-entry"><summary>Record a completed trade / manage ledger</summary>'+renderPortfolio()+'</details>'+
      '<details data-view-key="money-income"><summary>Income records and sources</summary>'+renderRevenuePanel()+'</details>';
  }
  function renderDailyPlanV111(){
    const plan=dailyPlanV111(),done=plan.items.filter(x=>x.reviewed).length;
    let html='<div class="card" id="ps-alert-daily-plan"><h3>Today · five profit decisions</h3>'+
      '<p class="muted">A short, risk-aware review queue across priced income sources. Scores are heuristics. Passive options show a 30-day cashflow equivalent, whereas item flips and travel are one-off opportunities; they cannot be summed as a daily income forecast.</p>'+
      '<form id="ps_daily_limits"><div class="duo">'+field('dailyReviewMinutes','Time available today (min)',state.settings.dailyReviewMinutes||15)+
      field('dailyReviewCap','Maximum reviewed opportunities',5,'number','disabled')+'</div><button class="btn secondary" type="submit">Save time budget</button></form>'+
      '<div class="statrow"><div class="stat"><small>Reviewed today</small><b>'+done+'/'+plan.items.length+'</b></div>'+
      '<div class="stat"><small>Modelled active time</small><b>'+plan.activeMinutes+' / '+plan.budget+' min</b></div></div>'+
      '<p class="muted">Working cash model: '+fmt(plan.spendable)+' · selected short-list commitments '+fmt(plan.committed)+'. '+(liveWalletCashV113()!==null?'Torn cash on hand '+fmt(liveWalletCashV113())+' · checked '+age(state.walletAt)+'.':'Cash-on-hand API not verified; using your saved capital cap.')+' Real purchases and sales still require confirmation.</p></div>';
    if(!plan.items.length)html+='<div class="empty">No supported candidates fit your time and protected cash. Refresh the separate Deals, Travel or Stocks data; never trade just to fill a quota.</div>';
    for(const [i,x] of plan.items.entries()){
      const mark=x.reviewed?'Reviewed (not bought)':'Mark reviewed';
      html+='<div class="card"><div class="line"><h3>'+(i+1)+'. '+esc(x.label)+'</h3><span class="pill">'+x.score+'/100</span></div>'+
        '<div class="line"><span>Cash exposure</span><b>'+fmt(x.cost)+'</b></div>'+
        '<div class="line"><span>Indicative net · '+esc(x.period)+'</span><b class="positive">'+fmt(x.net)+'</b></div>'+
        '<p class="muted">'+esc(x.summary)+' · '+(x.minutes?x.minutes+' active minutes estimated':'No active duration confirmed')+'</p>'+
        '<div class="toolbar"><button class="btn" data-action="rank-open" data-rank-id="'+esc(x.id)+'">Start walkthrough</button>'+
        '<button class="btn secondary" data-daily-review="'+esc(x.id)+'">'+mark+'</button></div></div>';
    }
    return html+notice('ProfitStaxx uses the Hub time budget when selected. Review markers never prove a trade was completed. Only an exact Torn stock cash log is labelled independently verified.');
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
        '<button class="btn secondary" data-action="rank-open" data-rank-id="'+esc(x.id)+'">Start walkthrough</button></div>';
    }
    return h+'<div class="card"><button class="btn secondary" data-tab="walkthrough">Browse all income routes</button></div>';
  }
  // Buckets share only deployable cash; the unspent cash reserve and item cost basis are protected.
  function multiCapitalPlan(){
    const s=state.settings,capital=number(s.capital),liquid=Math.min(Math.max(0,capital*(1-number(s.reservePct)/100)-openCost()),liveWalletCashV113()??Infinity);
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
    let out=renderStockCashReceipts()+'<div class="card"><h3>Locally recorded realised profit history</h3>'+
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
    out+='</div><div class="card"><h3>What counts?</h3><p class="muted">These charts are locally recorded income and completed ledger sales, NOT independently verified. Synced stock cash receipts appear separately above; do not re-enter the same stock dividend manually or you may double-count it. No unsold positions or modelled returns are included.</p>'+
      '<div class="toolbar"><button class="btn secondary" data-tab="income">Record income</button><button class="btn secondary" data-tab="portfolio">Trade ledger</button></div></div>';
    return out;
  }

  function css(){
    return [
      '.ps-rank-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid #294e67}.ps-rank-row p{margin:4px 0}.ps-route-prices select,.ps-route-prices input,.ps-route-prices textarea{max-width:100%;background:#0b2034;color:#fff;border:1px solid #3d617a;border-radius:6px;padding:8px}.ps-route-prices textarea{display:block;width:100%}',
      '.ps-route-steps{padding-left:26px;color:#a8c9de}.ps-route-steps li{padding:5px}.ps-route-steps [aria-current="step"]{font-weight:700;color:#86e1ff}.ps-desk-next .toolbar{flex-wrap:wrap;margin-top:12px}',
      ':host{all:initial;font:14px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#e7f2ff}',
      '*{box-sizing:border-box}button,input,select{font:inherit}button{cursor:pointer}',
      '.ps-page-heading{display:flex;justify-content:space-between;gap:12px;align-items:center;margin:4px 0 18px}.ps-page-heading h2{margin:5px 0;font-size:24px}.ps-page-heading small,.ps-desk-next>small{letter-spacing:.12em;font-size:10px;color:#8bdcff}.ps-desk-next{border-left:4px solid #49c9ff;padding:20px;background:linear-gradient(110deg,#123a59,#0b2136);border-radius:0 12px 12px 0;margin-bottom:18px}.ps-desk-next h2{font-size:24px;margin:8px 0}.ps-desk-next p{line-height:1.6;color:#bad3e5}.ps-desk-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:16px 0}.ps-desk-metric{padding:12px;border-bottom:1px solid #31516a;min-width:0}.ps-desk-metric small,.ps-desk-metric span{display:block;font-size:11px;color:#a6c2d8}.ps-desk-metric strong{display:block;font-size:22px;margin:7px 0;overflow-wrap:anywhere}.ps-desk-columns{display:grid;grid-template-columns:1.2fr 1fr;gap:24px}.ps-opportunity{width:100%;display:flex;justify-content:space-between;gap:12px;text-align:left;background:transparent;border:0;border-bottom:1px solid #31516a;padding:14px 0;color:#eff8ff}.ps-opportunity small,.ps-holding small{display:block;margin-top:5px;color:#abc7da;font-size:11px}.ps-opportunity>span:last-child{text-align:right;color:#86dfcd}.ps-research-links{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:20px 0}.ps-research-links button{background:#102e46;border:1px solid #345971;color:#eef8ff;padding:12px;text-align:left;border-radius:8px}.ps-research-links small{display:block;color:#a6c4d8;margin-top:6px}.body>details>summary{padding:14px 4px;cursor:pointer;color:#94ddff;border-bottom:1px solid #31516a}.ps-filterbar{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:15px 0}.ps-filterbar label{font-size:12px;color:#a8c9de}.ps-filterbar input,.ps-filterbar select{display:block;width:100%;min-width:0;margin-top:6px;background:#0b2034;border:1px solid #3d617a;color:#fff;padding:10px;border-radius:6px}.ps-stock-head,.ps-stock-row>summary{display:grid;grid-template-columns:minmax(0,1.4fr) 1fr 1fr;gap:8px;align-items:center;padding:13px 7px}.ps-stock-head{color:#9cbdcf;font-size:11px}.ps-stock-row{border-top:1px solid #31516a}.ps-stock-row summary{cursor:pointer;font-size:13px}.ps-stock-row small{display:block;font-size:11px;color:#a4c1d3}.ps-stock-detail{padding:0 12px 15px;background:#0d2439}.ps-holding{display:grid;grid-template-columns:1fr 1fr auto;gap:12px;align-items:center;padding:14px 0;border-bottom:1px solid #31516a;font-size:12px}.btn,button{touch-action:manipulation}button:focus-visible,summary:focus-visible{outline:2px solid #71d9ff;outline-offset:2px}@media(max-width:600px){.ps-desk-columns{grid-template-columns:1fr;gap:12px}.ps-desk-metrics{grid-template-columns:1fr 1fr}.ps-desk-metrics>.ps-desk-metric:last-child{grid-column:1/-1}.ps-research-links{grid-template-columns:1fr}.ps-page-heading h2,.ps-desk-next h2{font-size:21px}.ps-holding{grid-template-columns:1fr auto}.ps-holding>span:nth-child(2){grid-row:2;grid-column:1/-1}.ps-stock-row summary{font-size:12px}}',
      '.ps-toolbox{padding:8px 14px;border-bottom:1px solid #31516a}.ps-toolbox summary,.ps-analysis summary{cursor:pointer;padding:8px;color:#a9dfff}.ps-tool-groups{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ps-tool-groups section>div{display:grid;gap:5px;margin-top:7px}.ps-tool-groups button{text-align:left;white-space:normal}.tabs>.tab{flex:1}.ps-deal-head,.ps-deal-row>summary{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr);gap:8px;align-items:center;padding:12px 8px}.ps-deal-head{font-size:11px;color:#9fbed3}.ps-deal-row{border-top:1px solid #31516a}.ps-deal-row summary{cursor:pointer;font-size:13px;overflow-wrap:anywhere}.ps-deal-row small{display:block;font-size:11px;color:#b4cedf;margin-top:4px}.ps-deal-evidence{padding:0 10px 12px;background:#0a2035}.ps-analysis{border-bottom:1px solid #31516a;margin:12px 0}',
      '.fab{position:fixed;right:16px;bottom:86px;z-index:2147483645;border:1px solid #5de2fd80;',
      'background:linear-gradient(145deg,#0a84db,#073e7c);color:white;border-radius:18px;',
      'min-width:58px;height:55px;box-shadow:0 7px 28px #0009;font-weight:900;letter-spacing:.3px}',
      '.bubble{position:absolute;right:-4px;top:-7px;background:#2cdeaa;color:#052922;min-width:21px;',
      'border-radius:12px;font-size:11px;padding:3px 5px;border:2px solid #06162a}',
      '.overlay{position:fixed;inset:0;z-index:2147483646;background:#0009;display:none;align-items:flex-end;',
      'justify-content:center}.overlay.active{display:flex}',
      '.panel{width:min(1040px,100vw);height:min(93dvh,900px);background:#08192d;',
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
    const route=state.walkthrough;
    if(route&&route.step<4)actions.push({id:'route-resume',title:'Continue your profit walkthrough',
      detail:routeGuides[route.route].steps[route.step][0],status:'review',priority:82});
    const topStock=stockBlockOpportunities().find(x=>x.affordable&&x.annual!==null);
    if(topStock)actions.push({id:'stock-block-'+topStock.id,title:'Review '+topStock.acronym+' next benefit block',
      detail:topStock.need.toLocaleString('en-GB')+' more shares · '+fmt(topStock.cost)+' modeled cash · '+fmt(topStock.annual)+'/year expected cash before risks',
      status:'review',priority:67});
    if(daily.items.length)actions.push({id:'daily-plan',title:'Review '+daily.items.length+' best money-making options today',
      detail:daily.items.filter(x=>!x.reviewed).length+' not yet reviewed · '+daily.activeMinutes+' modelled active minutes · manual checks only',status:'review',priority:76});
    if(dueDividends().length)actions.push({id:'stock-claim',title:'Verify available stock benefits on Torn',detail:dueDividends().map(x=>x.acronym).join(', ')+' · API status only; may already be credited',status:'review',priority:68});
    for(const x of stockSignals().slice(0,4))actions.push({id:x.id,title:x.title,detail:x.why,status:'review',priority:x.priority});
    // Quick scans can verify individual quotes while an expensive full scan is overdue.
    // Never suppress genuinely fresh candidates merely because the last full scan is old.
    if(!fresh.length)actions.push({id:'refresh-scan',title:'Recheck market before trading',detail:'No qualifying item has a market quote newer than 8 minutes; automatic foreground checks continue.',status:'now',priority:90});
    for(const d of fresh.slice(0,3))actions.push({
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
    const available=Math.min(
      Math.max(0,number(state.settings.capital)*(1-number(state.settings.reservePct)/100)-openCost()),
      liveWalletCashV113()??Infinity
    );
    let remaining=available;
    const ranked=deals().filter(d=>now()-d.at>=0&&now()-d.at<8*60000).map(d=>{
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
      if(profit<number(state.settings.minProfit))continue;
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
      '<div><button class="btn secondary" data-action="market-buy" data-allocation="1" data-quantity="'+d.allocQty+'" data-id="'+Number(d.id)+'">Inspect and prepare '+d.allocQty+'</button></div>';
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
    const bestStock=stockBlockOpportunities().find(x=>x.affordable&&x.annual!==null);
    return (bestStock?'<div class="card" id="ps-alert-stock-block-'+bestStock.id+'"><h3>Next stock benefit block · '+esc(bestStock.acronym)+'</h3><p>Review '+bestStock.need.toLocaleString('en-GB')+' additional shares, costing '+fmt(bestStock.cost)+' at observed prices. Modelled payout is not earned income.</p><button class="btn" data-action="stockpage">Review Torn stocks</button></div>':'')+
      (stockSignals().length?stockSignals().map(x=>'<div class="card" id="ps-alert-'+esc(x.id)+'"><h3>'+esc(x.title)+'</h3><p>'+esc(x.why)+'</p><button class="btn" data-action="stockpage">Inspect stock</button></div>').join(''):'')+(dueDividends().length?'<div class="card" id="ps-alert-stock-claim"><h3>Reported stock benefits · verify on Torn</h3><p>'+dueDividends().map(x=>esc(x.acronym)).join(', ')+'</p><button class="btn" data-action="stockpage">Verify status on Torn</button></div>':'')+'<div class="card" id="ps-alert-refresh-scan"><h3>What should I do next?</h3><p>'+esc(state.lastScan?'Last market scan '+age(state.lastScan):'No confirmed scan yet')+'. Check prices on Torn before deciding to trade.</p><button class="btn secondary" data-action="scan">↻ Refresh opportunities</button></div>'+
      (list.length?list.slice(0,30).map(x=>'<div class="card" id="ps-alert-deal-'+Number(x.id)+'"><h3>BUY · '+esc(x.name)+'</h3><p><b>Quantity:</b> up to '+Math.floor(x.qty)+' · <b>maximum:</b> '+fmt(x.buy)+'/unit.</p><p><b>Capital required:</b> '+fmt(x.buy*x.qty)+' · <b>Score:</b> '+Math.floor(x.score)+'/100</p><p class="positive">Potential profit '+fmt(x.profit)+' · '+pct(x.roi)+' estimated ROI after modelled fees</p><p class="muted">Buy only at or below the suggested cap. Re-check inventory, listings and prices.</p><button class="btn" data-action="market-buy" data-id="'+Number(x.id)+'">Open market · prepare '+Math.floor(x.qty)+'</button></div>').join(''):'<div class="empty">No fresh qualifying buy opportunities — do not force a trade.</div>')+
      (exits.length?'<div class="card"><h3>Positions worth reviewing for sale</h3><p class="muted">Estimated from current asking prices, less a 5% market selling fee. Not an executable bid.</p></div>'+exits.slice(0,10).map(x=>'<div class="card" id="ps-alert-exit-'+Number(x.itemId)+'"><h3>SELL REVIEW · '+esc(x.name)+'</h3><p><b>Recorded holdings:</b> '+Math.floor(x.qty)+' · <b>breakeven ask:</b> '+fmt(x.breakeven)+'/unit</p><p class="positive">Indicative gain '+fmt(x.upside)+' · '+pct(x.roi)+' based on asking prices</p><button class="btn secondary" data-action="market-view" data-id="'+Number(x.itemId)+'">Inspect live market listings</button></div>').join(''):'');
  }
  function verifiedOwnedV114(name){return state.inventoryAt>0&&now()-state.inventoryAt<60*60000?Math.floor(number(state.inventoryOwned[name])):null;}

  // Asking-price observations, never completed sales or guaranteed opportunities.
  function renderMarketPulseV115(){
    const movements=Object.entries(state.snapshots||{}).flatMap(([id,history])=>{
      const rows=(Array.isArray(history)?history:[]).filter(x=>Number(x?.price)>0&&Number(x?.at)>0).sort((a,b)=>a.at-b.at);
      const last=rows[rows.length-1];if(!last||now()-last.at>6*3600000)return [];
      const previous=rows.slice(0,-1).reverse().find(x=>last.at-x.at>=2*60000&&last.at-x.at<=7*86400000);
      if(!previous)return [];
      const change=100*(Number(last.price)-Number(previous.price))/Number(previous.price);
      if(!Number.isFinite(change)||Math.abs(change)<3)return [];
      const item=Object.values(state.catalog||{}).find(x=>Number(x.id)===Number(id));
      return [{id:Number(id),name:item?.name||state.quotes[id]?.name||'Item '+id,before:Number(previous.price),after:Number(last.price),change,at:last.at}];
    }).filter(x=>Number.isFinite(x.id)&&x.id>0).sort((a,b)=>Math.abs(b.change)-Math.abs(a.change)).slice(0,5);
    let h='<div class="card"><h3>Market Pulse · biggest movements</h3><p class="muted">Scanned lowest ASK changes, not actual sale prices. Only swings of 3%+ observed within the last 6 hours are shown.</p>';
    if(!movements.length)return h+'<p class="muted">No qualifying movements yet. More verified scans will build the comparison.</p><button class="btn secondary" data-action="quickscan">Scan watched prices</button></div>';
    for(const x of movements)h+='<div class="line"><span><b>'+esc(x.name)+'</b><small> · '+esc(age(x.at))+' · '+fmt(x.before)+' → '+fmt(x.after)+'</small></span><b class="'+(x.change<0?'negative':'positive')+'">'+(x.change>0?'+':'')+x.change.toFixed(1)+'%</b></div>'+
      '<button class="btn secondary" data-action="market-view" data-id="'+x.id+'">Check '+esc(x.name)+' listings</button>';
    return h+'<p class="muted">Falling offers can also mean weaker demand. Recheck live listing depth and risk before buying.</p></div>';
  }
  function renderTradeStressV115(d){
    if(!d||!(d.buy>0&&d.qty>0&&d.reference>0))return '';
    const qty=Math.floor(d.qty),capital=qty*d.buy;
    const cases=[0,5,10].map(drop=>({drop,net:Math.floor(Math.floor(d.reference*(1-drop/100))*.95)*qty-capital}));
    return '<div class="card"><h3>Trade stress test · '+esc(d.name)+'</h3>'+
      '<p class="muted">Proposed '+qty+' units. Profit/loss after a 5% market fee if resale ASK prices fall. Bazaar may differ; none of these are executable bids.</p>'+
      cases.map(x=>'<div class="line"><span>Resale ASK -'+x.drop+'%</span><b class="'+(x.net<0?'negative':'positive')+'">'+(x.net>=0?'+':'')+fmt(x.net)+'</b></div>').join('')+
      '<p class="muted">Break-even market ASK ≈ '+fmt(Math.ceil(d.buy/.95))+'/unit · cash exposure '+fmt(capital)+'. Time-to-sale and actual buyer demand unknown.</p>'+
      '<button class="btn" data-action="market-buy" data-id="'+Number(d.id)+'">Check live listing &amp; prepare quantity</button></div>';
  }

  function autopilotPanelV117(){
    const watch=getWatchList(),held=positions().filter(p=>p.qty>0),time=now();
    const fresh=watch.filter(x=>time-Number(state.quotes[x.id]?.at||0)<8*60000).length;
    const staleHeld=held.filter(p=>time-Number(state.quotes[p.itemId]?.at||0)>=8*60000).length;
    const last=state.lastScan?'Full catalog: '+age(state.lastScan):'Full catalog: not yet completed';
    const quick=autoChecksV112.quick?'Last quick attempt: '+age(autoChecksV112.quick):'Quick scan: not yet attempted';
    return '<div class="card"><h3>Autopilot · market freshness</h3>'+
      '<p><b>'+fresh+'/'+watch.length+'</b> watched items checked in the past 8 minutes · <b>'+staleHeld+'</b> held position(s) due for a new quote.</p>'+
      '<p class="muted">'+esc(last)+' · '+esc(quick)+'. Automatic checks run only while Torn is foregrounded, with rate-limit backoff.</p>'+
      '<button class="btn secondary" data-action="quickscan" '+(state.busy?'disabled':'')+'>Check priority quotes now</button></div>';
  }
  let dealQuery='',dealSort='profit',dealFilter='all';
  function renderScan(){
    const spendable=dailyPlanV111().spendable;
    const d=deals().filter(x=>now()-x.at>=0&&now()-x.at<8*60000&&String(x.name||'').toLowerCase().includes(dealQuery.toLowerCase())&&
      (dealFilter==='budget'?x.qty*x.buy<=spendable:dealFilter==='risk'?dealRisk(x).level!=='High':true));
    d.sort((a,b)=>dealSort==='roi'?b.roi-a.roi:dealSort==='capital'?a.qty*a.buy-b.qty*b.buy:b.profit-a.profit);
    const pick=d.find(x=>x.qty*x.buy<=spendable&&dealRisk(x).level!=='High');
    let html='<header class="ps-page-heading"><div><small>ITEM MARKET</small><h2>Find a trade worth checking</h2></div><button class="btn secondary" data-tab="settings">Trade limits</button></header>';
    html+=pick?'<div class="card"><h3>Best opportunity to review</h3><p><b>'+esc(pick.name)+'</b> · up to '+Math.floor(pick.qty)+' units</p><p>Capital '+fmt(pick.qty*pick.buy)+' · modeled gain <span class="positive">'+fmt(pick.profit)+'</span> · '+pct(pick.roi)+' ROI</p><button class="btn" data-action="market-buy" data-id="'+Number(pick.id)+'">Review live listing and prepare quantity</button></div>':'';
    html+='<details class="ps-analysis"><summary>Risk, allocation and market evidence</summary>';
    html+=renderTradeStressV115(pick);
    html+=renderMarketPulseV115();
    html+=autopilotPanelV117();
    html+=allocationPanel()+'</details>';
    html+='<div class="statrow"><div class="stat"><small>Spendable model</small><b>'+human(spendable)+'</b></div>'+
      '<div class="stat"><small>Matching fresh deals</small><b>'+d.length+'</b></div></div>';
    html+='<div class="toolbar"><button class="btn" data-action="scan" '+(state.busy?'disabled':'')+'>'+
      (state.busy?'Scanning '+state.scanDone+'/'+state.scanTotal:'Refresh opportunities')+'</button>'+
      '<button class="btn secondary" data-action="quickscan" '+(state.busy?'disabled':'')+'>Fast scan · 10</button>'+
      (state.busy?'<button class="btn secondary" data-action="stopscan">Stop scan</button>':'')+
      '<button class="btn secondary" data-tab="museum">Museum</button></div>';
    html+=notice(state.status+' · Last full scan: '+age(state.lastScan));
    if(state.error)html+=notice(state.error,true);
    if(!apiKey())html+=notice('Torn API key not available. Open Settings to provide one or configure TornPDA.',true);
    if(!d.length)html+='<div class="empty">No qualifying fresh deals. That is a valid result: do not force a trade. Adjust thresholds in Settings if needed.</div>';
    html+='<div class="ps-filterbar"><label>Find item<input id="ps-deal-query" type="search" maxlength="80" value="'+esc(dealQuery)+'" placeholder="Item name"></label><label>Sort deals<select id="ps-deal-sort">'+[['profit','Estimated gain'],['roi','Return %'],['capital','Lowest cash needed']].map(([v,l])=>'<option value="'+v+'"'+(dealSort===v?' selected':'')+'>'+l+'</option>').join('')+'</select></label><label>Filter<select id="ps-deal-filter">'+[['all','All qualifying deals'],['budget','Within spendable cash'],['risk','Exclude high risk flags']].map(([v,l])=>'<option value="'+v+'"'+(dealFilter===v?' selected':'')+'>'+l+'</option>').join('')+'</select></label></div>';
    html+='<div class="ps-deal-head"><span>Item / quantity</span><span>Cash needed</span><span>Est. gain</span></div>';
    for(const x of d.slice(0,30)){
      const risk=dealRisk(x);
      html+='<details class="ps-deal-row" data-deal="'+Number(x.id)+'"><summary><span><b>'+esc(x.name)+'</b><small>'+Math.floor(x.qty)+' units / '+age(x.at)+'</small></span><span>'+fmt(x.qty*x.buy)+'<small>'+fmt(x.buy)+'/unit cap</small></span><span class="positive">'+fmt(x.profit)+'<small>'+pct(x.roi)+' ROI</small></span></summary>'+
       '<div class="ps-deal-evidence"><p>'+(verifiedOwnedV114(x.name)===null?'Inventory quantity unverified':'Verified Torn inventory: '+verifiedOwnedV114(x.name)+' owned')+'</p><p>'+esc(risk.level)+' risk / '+esc(risk.confidence)+' evidence. '+esc(risk.flags.join(' / ')||'No additional historical flags')+'</p>'+
       '<p>Reference ask '+fmt(x.reference)+' / depth '+x.depth+' units. These are asking prices, not completed sales.</p>'+
       '<button class="btn" data-action="market-buy" data-id="'+Number(x.id)+'">Inspect listing / prepare '+Math.floor(x.qty)+'</button> <button class="btn secondary" data-action="route-market" data-id="'+Number(x.id)+'">Walk through this trade</button></div></details>';
    }
    html+=notice('Expected resale is inferred from active asking prices, not confirmed completed sales. Listings may disappear before you buy.');
    return html;
  }
  function renderMuseum(){
    let html='<div class="statrow"><div class="stat"><small>Cheapest point ask</small><b>'+fmt(state.pointsPrice)+'</b></div>'+
      '<div class="stat"><small>Museum access</small><b>Check in Torn</b></div></div>';
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
      html+='</details><button class="btn secondary" data-action="route-museum" data-target="'+esc(r.name)+'">Walk through this set</button></div>';
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
      const q=state.quotes[x.itemId];const estimate=q&&q.reference&&now()-Number(q.at)<8*60000?x.qty*q.reference*.95-x.cost:null;
      html+='<div class="card"><div class="line"><strong>'+esc(x.name)+'</strong><span>'+x.qty+' units</span></div>'+
        '<div class="line"><span>Cost basis</span><span>'+fmt(x.cost)+'</span></div>'+
        '<div class="line"><span>Open market estimate after 5% fee</span><span>'+(estimate===null?'Stale or unavailable':fmt(estimate))+'</span></div></div>';
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
  let profitTabsExpanded=false;
  const simpleProfitTabs=new Set(['alerts','daily','best','scan','stocks','income']);
  function profitNavigation(active){
    const primary=[['daily','Overview'],['scan','Deals'],['stocks','Stocks'],['portfolio','My money'],['walkthrough','Routes']];
    const groups=[['Explore',[['best','Compare opportunities'],['travel','Travel'],['income','Income'],['museum','Museum']]],
      ['Review',[['capital','Capital plan'],['history','Price history'],['alerts','Alerts'],['settings','Settings'],['diagnostics','Diagnostics']]]];
    const button=([id,label])=>'<button class="tab '+(active===id?'active':'')+'" data-tab="'+id+'">'+label+'</button>';
    return '<nav class="tabs" aria-label="Profit workspace">'+primary.map(button).join('')+'</nav>'+
      '<details class="ps-toolbox"'+(!primary.some(([id])=>id===active)?' open':'')+'><summary>Profit tools</summary><div class="ps-tool-groups">'+groups.map(([name,items])=>'<section><b>'+name+'</b><div>'+items.map(button).join('')+'</div></section>').join('')+'</div></details>';
  }
  function render(){
    if(!root)return;
    syncRouteBar();
    if(lastHubPanelState!==state.open){lastHubPanelState=state.open;
      document.dispatchEvent?.(new CustomEvent('staxx:panel',{detail:{id:'profit',open:state.open}}));}
    const valid=activeDealAlerts(),claims=dueDividends(),stockNotices=stockSignals(),noticeCount=valid.length+claims.length+stockNotices.length;
    if(badge){badge.textContent=noticeCount?String(Math.min(99,noticeCount)):'';badge.style.display=noticeCount?'block':'none';}
    document.dispatchEvent?.(new CustomEvent('staxx:notice',{detail:{id:'profit',count:noticeCount,level:claims.length||stockNotices.length||valid.length?'warning':'info',summary:claims.length+' stock reviews · '+stockNotices.length+' stock targets · '+valid.length+' market deals',items:claims.slice(0,2).map(x=>'Verify '+x.acronym+' benefit').concat(stockNotices.slice(0,2).map(x=>x.title)).concat(valid.slice(0,2).map(d=>String(d.name||d.itemName||'Market opportunity'))),alerts:[...claims.map(x=>({id:'stock-claim',title:'Verify '+x.acronym+' stock benefit',detail:'API reports available; may already be applied on Torn'})),...stockNotices.map(x=>({id:x.id,title:x.title,detail:x.why})),...valid.slice(0,25).map(d=>({id:'deal-'+Number(d.id),title:'Buy up to '+Math.floor(d.qty)+' '+String(d.name||'items'),detail:'Estimated profit '+fmt(d.profit)+' · max '+fmt(d.buy)+'/unit'}))]}}));
    document.dispatchEvent?.(new CustomEvent('staxx:actions',{detail:{id:'profit',items:profitNextActions().map(a=>({
      ...a,reviewMinutes:a.id==='daily-plan'?5:a.id==='refresh-scan'?2:a.id==='stock-claim'?2:3
    })),updated:state.lastScan||now()}}));
    const summaryPortfolio=portfolio();
    document.dispatchEvent?.(new CustomEvent('staxx:summary',{detail:{id:'profit',headline:state.lastScan?'Last scan '+age(state.lastScan):'Awaiting market scan',metrics:[
      {label:'Fresh deals',value:state.lastScan?String(valid.length):'Not scanned'},
      {label:'Recorded invested',value:human(summaryPortfolio.invested)},
      {label:'Recorded trade P/L',value:fmt(summaryPortfolio.realised)},
      {label:'30d verified stock cash',value:stockCashReceipts(30).length?fmt(stockCashReceipts(30).reduce((n,x)=>n+Number(x.amount),0)):'No matched receipts'}
    ],updated:state.lastScan||now()}}));
    nativeMarketQuote();
    if(!state.open){shell.classList.remove('active');return;}
    shell.classList.add('active');
    const tabs=['alerts','daily','best','scan','travel','stocks','capital','history','income','museum','portfolio','settings','diagnostics'];
    const labels=['Alerts '+noticeCount,'Today','Best','Deals','Travel','Stocks','Capital','Charts','Income','Museum','Ledger','Settings','Diagnostics'];
    const simpleProfitMode=(()=>{try{return JSON.parse(localStorage.getItem('staxx-hub-mode-v1')||'"simple"')!=='advanced';}catch(_){return true;}})();
    const visibleProfitTabs=!simpleProfitMode||profitTabsExpanded?tabs:tabs.filter(name=>simpleProfitTabs.has(name)||name===state.tab);
    const active=state.tab;
    const content=active==='walkthrough'?renderWalkthrough():active==='alerts'?renderAlerts():active==='scan'?renderScan():active==='museum'?renderMuseum():
      active==='portfolio'?renderMoneyWorkspace():active==='daily'?renderProfitHome():active==='stocks'?renderStockWorkspace():active==='travel'?renderTravel():active==='best'?renderRankings():active==='capital'?renderCapital():active==='history'?renderHistory():active==='income'?renderRevenuePanel():active==='diagnostics'?renderProfitDiagnosticsV111():renderSettings();
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
    const disclosed=[...shell.querySelectorAll('details[data-deal][open]')].map(x=>x.dataset.deal);
    const openedViews=[...shell.querySelectorAll('details[data-view-key][open]')].map(x=>x.dataset.viewKey);
    const toolboxOpen=shell.querySelector('.ps-toolbox')?.open,analysisOpen=shell.querySelector('.ps-analysis')?.open;
    shell.innerHTML='<div class="panel" role="dialog" aria-modal="true" aria-label="ProfitStaxx">'+
      '<div class="heading"><div><div class="brand">Profit<span style="color:#54d7fa">Staxx</span></div><div class="sub">Profit intelligence · v'+VERSION+'</div></div>'+
      '<div style="display:flex;gap:5px;align-items:center"><button class="close" data-action="staxx-find" aria-label="Find tools, sections and actions">⌕ Find</button><button class="close" data-action="close">Close ×</button></div></div>'+
      profitNavigation(active)+
      '<main class="body">'+content+'</main><div class="footer">'+
      'Estimates only · API cached · Never auto-trades · '+esc(state.status)+'</div></div>';
    if(lastRenderedTab===active)for(const d of shell.querySelectorAll("details[data-deal]"))d.open=disclosed.includes(d.dataset.deal);
    if(lastRenderedTab===active){if(toolboxOpen!==undefined&&shell.querySelector(".ps-toolbox"))shell.querySelector(".ps-toolbox").open=toolboxOpen;if(analysisOpen!==undefined&&shell.querySelector(".ps-analysis"))shell.querySelector(".ps-analysis").open=analysisOpen;}
    if(lastRenderedTab===active)for(const el of shell.querySelectorAll("details[data-view-key]"))el.open=openedViews.includes(el.dataset.viewKey);
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
    if(el.dataset.action==='staxx-find'){state.open=false;render();document.dispatchEvent(new CustomEvent('staxx:find'));return;}
    if(el.dataset.action==='staxx-more-tabs'){profitTabsExpanded=!profitTabsExpanded;render();return;}
    if(el.dataset.tab){state.tab=el.dataset.tab;
      if(['alerts','daily','best','scan','travel','stocks','capital','history','income','museum','portfolio','settings','diagnostics','walkthrough'].includes(state.tab))
        document.dispatchEvent?.(new CustomEvent('staxx:visit',{detail:{id:'profit',section:state.tab}}));
      render();if(state.tab==='walkthrough')void refreshRoutePrices();else if(state.tab==='stocks'&&!routePricing.busy&&now()-stockState.at>300000)refreshStocks();return;}
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
        const id=Number(el.dataset.id),d=deals().find(x=>Number(x.id)===id&&now()-x.at>=0&&now()-x.at<8*60000);
        if(!d||!Number.isInteger(Math.floor(d.qty))||d.qty<1){state.error='Opportunity expired; refresh the scan.';render();return;}
        let qty=Math.floor(d.qty);
        if(el.dataset.allocation==='1'){
          const allocation=allocationPlan().allocations.find(row=>Number(row.id)===id);
          if(!allocation||allocation.allocQty!==Number(el.dataset.quantity)){
            state.error='Allocation changed. Review the updated quantity and cash limits.';render();return;
          }
          qty=allocation.allocQty;
        }
        try{sessionStorage.setItem('profitstaxx-market-intent-v1',JSON.stringify({id,qty,maxPrice:Number(d.buy),name:String(d.name||'Item').slice(0,80),at:now(),quoteAt:d.at}));}
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
      case 'stock-log-sync':refreshStockCashLogs(true);break;
      case 'stock-log-toggle':state.settings.stockLogSync=state.settings.stockLogSync===false;state.stockLogRetryAt=0;state.stockLogCheckedAt=0;persist();render();if(state.settings.stockLogSync)void refreshStockCashLogs(true);break;
      case 'stock-reminders':state.settings.stockClaimReminders=state.settings.stockClaimReminders!==true;persist();render();break;
      case 'travelscan':scanTravel();break;
      case 'inventoryscan':refreshInventoryV112();break;
      case 'rank-open':{
        const row=incomeCandidates().find(x=>x.id===el.dataset.rankId);
        if(row)startWalkthrough(row.route,row);
        else{state.error='That opportunity has changed. Refresh the quote or choose the route without a quote.';render();}
        break;
      }
      case 'route-start':startWalkthrough(el.dataset.source);break;
      case 'route-ranked':{
        const model=routeProfitModels().get(el.dataset.source);
        startWalkthrough(el.dataset.source,model?.target||null);break;
      }
      case 'route-prices':void refreshRoutePrices(true);break;
      case 'route-bar-toggle':
        if(state.walkthrough){state.walkthrough={...state.walkthrough,barHidden:!state.walkthrough.barHidden};persist();render();}
        break;
      case 'route-museum':{
        const recipe=RECIPES.find(r=>r.name===el.dataset.target);
        if(recipe)startWalkthrough('museum',{id:'museum-'+recipe.name,label:recipe.name});
        break;
      }
      case 'route-market':{
        const deal=deals().find(d=>Number(d.id)===Number(el.dataset.id)&&now()-d.at>=0&&now()-d.at<8*60000);
        if(deal)startWalkthrough('market',{id:'market-'+deal.id,label:deal.name,itemId:Number(deal.id)});
        else{state.error='This listing has expired. Refresh Deals before choosing it.';render();}
        break;
      }
      case 'route-travel':{
        const row=travelRows().find(r=>'travel-'+r.country+'-'+r.id===el.dataset.target&&r.valid);
        if(row)startWalkthrough('travel',{id:el.dataset.target,label:row.countryName+' · '+row.name,itemId:Number(row.id)});
        else{state.error='This trip estimate has expired. Check current stock and resale prices.';render();}
        break;
      }
      case 'route-next':
      case 'route-back':{
        const w=state.walkthrough;if(!w||w.step>=4)return;
        const direction=el.dataset.action==='route-next'?1:-1;
        state.walkthrough={...w,step:clamp(w.step+direction,0,4)};persist();render();
        shell.querySelector('.ps-route-current')?.focus({preventScroll:true});
        break;
      }
      case 'route-repeat':{
        const w=state.walkthrough;
        if(w?.step===4)startWalkthrough(w.route,w.target?{id:w.target,label:w.name,itemId:w.itemId}:null);
        break;
      }
      case 'route-cancel':
        if(confirm('Clear this walkthrough?')){state.walkthrough=null;persist();render();}
        break;
      case 'route-torn':void openWalkthroughTorn();break;
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
    if(event.target.id==='ps_forgery_materials'){
      event.preventDefault();
      const w=state.walkthrough;if(w?.route!=='forgery'||!w.itemId||w.step>=3)return;
      const input=String(new FormData(event.target).get('materials')||'').trim();
      const rows=input?input.split(/\r?\n/).filter(line=>line.trim()):[];
      const recipe=new Map();
      for(const row of rows){
        const match=row.match(/^\s*(\d+)\s*[x×]\s+(.+?)\s*$/i);
        const item=match?getItem(match[2]):null;
        const quantity=match?Number(match[1]):0;
        if(!item||!Number.isSafeInteger(quantity)||quantity<1||quantity>1000||rows.length>6){
          alert('Enter up to six lines in the form 2 x Item Name.');return;
        }
        recipe.set(item.id,(recipe.get(item.id)||0)+quantity);
      }
      state.settings.forgeryMaterials={...state.settings.forgeryMaterials,[w.itemId]:[...recipe].map(([id,qty])=>({id,qty}))};
      persist();render();void refreshRoutePrices();
    }else if(event.target.id==='ps_route_item'){
      event.preventDefault();
      const w=state.walkthrough;
      if(!w||!itemPriceRoutes.has(w.route)||w.route==='blood'||w.step>=3)return;
      const name=String(new FormData(event.target).get('routeItem')||'').trim();
      const item=getItem(name);
      if(!item||w.route==='shop'&&!item.shopBuy){alert('Choose a matching item from the list.');return;}
      state.walkthrough={...w,itemId:item.id};
      state.settings.routeItems={...state.settings.routeItems,[w.route]:item.id};
      persist();render();void refreshRoutePrices();
    }else if(['ps_route_plan','ps_route_receipt'].includes(event.target.id)){
      event.preventDefault();
      saveWalkthroughForm(event.target);
    }else if(event.target.id==='ps_trade'){
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
      putMoney(records);
      const entry=records[records.length-1];
      document.dispatchEvent?.(new CustomEvent('staxx:activity',{detail:{id:'profit',events:[{
        id:'income-'+String(entry.id).replace(/[^a-z0-9_-]/gi,'').slice(0,64),at:entry.at,
        source:'recorded',section:'income',title:'Income entry recorded locally',
        detail:String(entry.source)+' · User-entered amount, not verified Torn income'
      }]}}));
      render();
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
    routeBar=document.createElement('aside');
    routeBar.className='ps-route-bar';
    routeBar.setAttribute('aria-label','Active ProfitStaxx route');
    routeBar.innerHTML='<button type="button" class="ps-route-bar-open"><b class="ps-route-bar-label"></b><span class="ps-route-bar-step"></span></button>'+
      '<button type="button" class="ps-route-bar-hide" aria-label="Hide route bar">Hide</button>';
    routeBar.querySelector('.ps-route-bar-open').onclick=()=>{
      document.dispatchEvent(new CustomEvent('staxx:closeall'));
      state.open=true;state.tab='walkthrough';render();void refreshRoutePrices();
    };
    routeBar.querySelector('.ps-route-bar-hide').onclick=()=>{
      if(state.walkthrough){state.walkthrough={...state.walkthrough,barHidden:true};persist();render();}
    };
    routeBarHost=document.createElement('div');routeBarHost.id='profitstaxx-route-top';routeBarHost.hidden=true;
    const routeRoot=routeBarHost.attachShadow({mode:'open'});
    const routeStyle=document.createElement('style');
    routeStyle.textContent='.ps-route-bar{box-sizing:border-box;display:flex;align-items:stretch;width:min(100%,620px);margin:6px auto 10px;border:1px solid #559bbf;border-radius:8px;background:#102b41;color:#eef9ff;overflow:hidden;font:13px system-ui,sans-serif}.ps-route-bar button{color:inherit;background:transparent;border:0;padding:7px 12px;min-height:44px;font:inherit;cursor:pointer}.ps-route-bar-open{flex:1;min-width:0;text-align:left}.ps-route-bar-label,.ps-route-bar-step{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ps-route-bar-step{font-size:11px;color:#a6dbef}.ps-route-bar .ps-route-bar-hide{border-left:1px solid #559bbf}';
    routeRoot.append(routeStyle,routeBar);
    shell=document.createElement('div');shell.className='overlay';
    shell.addEventListener('click',e=>{if(e.target===shell){state.open=false;render();}else onClick(e);});
    shell.addEventListener('submit',onSubmit);
    shell.addEventListener('input',event=>{if(event.target.id==='ps-stock-query'){stockViewQuery=event.target.value.slice(0,80);render();return;}if(event.target.id==='ps-deal-query'){dealQuery=event.target.value.slice(0,80);render();}});
    shell.addEventListener('change',event=>{
      if(event.target.id==='ps-route-blood'){
        state.settings.routeBloodType=bloodTypes.includes(event.target.value)?event.target.value:'';
        persist();render();void refreshRoutePrices();return;
      }
      if(event.target.id==='ps-deal-filter'&&['all','budget','risk'].includes(event.target.value)){dealFilter=event.target.value;render();return;}if(event.target.id==='ps-stock-filter'&&['all','owned','cash','budget'].includes(event.target.value)){stockViewFilter=event.target.value;render();return;}if(event.target.id==='ps-deal-sort'&&['profit','roi','capital'].includes(event.target.value)){dealSort=event.target.value;render();}});
    root.appendChild(shell);
    render();
  }
  document.addEventListener('staxx:open',e=>{if(e.detail?.id==='profit'){
    state.open=true;
    if(e.detail.alertId==='route-resume'){state.tab='walkthrough';state.alertFocus='';}
    else if(e.detail.alertId){state.tab=e.detail.alertId==='stock-claim'?'stocks':e.detail.alertId==='daily-plan'?'daily':'alerts';state.alertFocus=['stock-claim','daily-plan'].includes(e.detail.alertId)?'':String(e.detail.alertId);}
    else if(['daily','alerts','best','scan','travel','stocks','capital','history','income','museum','portfolio','settings','diagnostics','walkthrough'].includes(e.detail.section)){state.tab=e.detail.section;state.alertFocus='';}
    render();
    if(state.tab==='walkthrough')void refreshRoutePrices();
  }else if(state.open){state.open=false;render();}});
  document.addEventListener('staxx:closeall',()=>{if(state.open){state.open=false;render();}});
  document.addEventListener('staxx:ping',()=>document.dispatchEvent(new CustomEvent('staxx:register',{detail:{id:'profit',label:'Profit-TornStaxx',icon:'PS',desc:'Daily profit · Markets · Stocks',trendMetric:'Fresh deals',freshnessMs:600000}})));
  document.addEventListener('staxx:diagnostics-request',()=>{
    document.dispatchEvent(new CustomEvent('staxx:diagnostics',{detail:{id:'profit',version:VERSION,
      api:!apiKey()?'missing':!state.lastScan||now()-state.lastScan>900000?'stale':'ready',
      storage:state.storage==='TornPDA'?'ready':'unknown',ui:root&&shell?'ready':'missing',
      detail:state.busy?'Market scan in progress':'Market quotes '+(state.lastScan?'last checked '+age(state.lastScan):'not yet fully scanned')}}));
  });
  function nativeWalkthroughButton(itemId){
    const walk=state.walkthrough;
    if(!walk||walk.step>=4||walk.itemId!==itemId||!['market','travel'].includes(walk.route))return null;
    const button=document.createElement('button');
    button.type='button';button.textContent='Resume ProfitStaxx walkthrough';
    button.onclick=()=>{state.tab='walkthrough';state.open=true;render();};
    return button;
  }
  function nativeMarketQuote(){
    let box=document.getElementById('ps-native-quote');
    const match=String(location.hash||'').match(/(?:^|[&#])itemID=(\d+)(?:&|$)/),id=match?Number(match[1]):0;
    let enabled=true;try{enabled=JSON.parse(localStorage.getItem('staxx-hub-context-v1')||'true')!==false;}catch(_){}
    const quote=state.quotes[id];
    if(document.hidden)return;
    if(!enabled||location.pathname!=='/page.php'||(new URLSearchParams(location.search).get('sid')||'').toLowerCase()!=='itemmarket'||!id||!quote||document.getElementById('ps-market-assist')){box?.remove();return;}
    const fields=Array.from(document.querySelectorAll('input')).filter(el=>{
      if(el.disabled||!el.getClientRects?.().length)return false;
      const hint=[el.name,el.id,el.placeholder,el.getAttribute('aria-label')].join(' ');
      const parent=el.closest('[role=dialog],[class*=buy],[class*=purchase]');
      return /qty|quantity|amount/i.test(hint)&&(/buy|purchase/i.test(hint)||parent&&/buy|purchase/i.test(parent.textContent||''));
    });
    if(fields.length!==1){box?.remove();return;}
    const fresh=Number(quote.at)>0&&now()-quote.at>=0&&now()-quote.at<8*60000;
    const deal=fresh?deals().find(x=>Number(x.id)===id):null;
    const held=positions().find(x=>x.itemId===id);
    const message=(fresh?'Quote checked ':'Saved quote / ')+age(quote.at)+' / reference ask '+fmt(quote.reference)+
      (deal?' / modelled buy cap '+fmt(deal.buy)+' / up to '+Math.floor(deal.qty):' / no current qualified buy recommendation')+
      (held?' / ledger holdings '+held.qty:'');
    const signature=JSON.stringify([id,message,quote.at,state.walkthrough?.id,state.walkthrough?.step]);
    if(box?.dataset.signature===signature&&box.previousElementSibling===fields[0])return;
    box?.remove();box=document.createElement('details');box.id='ps-native-quote';box.dataset.signature=signature;
    box.style.cssText='display:block;clear:both;margin:8px 0;padding:8px;border:1px solid #355d7a;border-radius:6px;background:#10283f;color:#eaf6ff;font:12px/1.5 system-ui';
    const title=document.createElement('summary');title.textContent='ProfitStaxx / '+String(quote.name||'Selected item');
    const info=document.createElement('p');info.textContent=message;
    const note=document.createElement('small');note.textContent='Reference asking prices are not completed sales. Verify the current listing; this helper does not change the quantity.';
    const button=document.createElement('button');button.type='button';button.textContent='Inspect this item';
    button.onclick=()=>{dealQuery=String(quote.name||'');state.tab='scan';state.open=true;render();};
    box.append(title,info,note,button);
    const resume=nativeWalkthroughButton(id);if(resume)box.append(resume);
    fields[0].insertAdjacentElement('afterend',box);
  }
  let activeMarketAssist=null;
  function marketAssist(){
    if(!/\/page\.php$/i.test(location.pathname)||!location.search.includes('sid=ItemMarket'))return;
    const intentKey='profitstaxx-market-intent-v1';
    let p,raw;try{raw=sessionStorage.getItem(intentKey);p=JSON.parse(raw||'null');}catch(_){return;}
    const correctItem=()=>{
      if(location.pathname!=='/page.php'||new URLSearchParams(location.search).get('sid')!=='ItemMarket')return false;
      const match=String(location.hash||'').match(/(?:^|[&#])itemID=(\d+)(?:&|$)/);
      return match&&Number(match[1])===p.id;
    };
    const expired=()=>now()-p.at<0||now()-p.at>600000||
      (p.quoteAt!==undefined&&(!Number.isFinite(p.quoteAt)||now()-p.quoteAt<0||now()-p.quoteAt>=8*60000));
    if(!p||!Number.isInteger(p.id)||!Number.isInteger(p.qty)||p.qty<1||p.qty>1000000||!Number.isFinite(p.at)||expired()||!correctItem())return;
    if(activeMarketAssist?.raw===raw)return;
    activeMarketAssist?.cleanup();
    const box=document.createElement('div');box.id='ps-market-assist';box.style.cssText='position:static;max-width:100%;margin:8px 0;background:#08192d;color:#e8f7ff;border:1px solid #54d7fa;border-radius:12px;padding:12px;font:13px system-ui;box-shadow:0 5px 28px #000a';
    const title=document.createElement('b');title.textContent='ProfitStaxx · '+p.name+' × '+p.qty;
    const status=document.createElement('p');status.textContent='Check live listing price (modeled cap $'+Math.round(p.maxPrice).toLocaleString('en-US')+'/unit). Looking for Buy quantity field…';
    const copy=document.createElement('button');copy.textContent='Copy quantity';copy.onclick=()=>{const v=String(p.qty);if(navigator.clipboard?.writeText)navigator.clipboard.writeText(v).then(()=>status.textContent='Copied '+v).catch(()=>status.textContent='Quantity: '+v);else status.textContent='Quantity: '+v;};
    const close=document.createElement('button');close.textContent='Close ×';close.style.marginLeft='10px';
    box.append(title,status,copy,close); // Insert only beside an unambiguous buy field.
    const resume=nativeWalkthroughButton(p.id);if(resume)box.append(resume);
    let filled=false,count=0,observer,timer;
    const stop=()=>{
      observer?.disconnect();clearInterval(timer);
      try{if(sessionStorage.getItem(intentKey)===raw)sessionStorage.removeItem(intentKey);}catch(_){}
    };
    const cleanup=()=>{
      stop();box.remove();window.removeEventListener('hashchange',checkRoute);
      window.removeEventListener('popstate',checkRoute);
      if(activeMarketAssist?.raw===raw)activeMarketAssist=null;
    };
    const checkRoute=()=>{if(!correctItem())cleanup();};
    window.addEventListener('hashchange',checkRoute);
    window.addEventListener('popstate',checkRoute);
    close.onclick=cleanup;
    activeMarketAssist={raw,cleanup};
    const attempt=()=>{
      if(!correctItem()){cleanup();return;}
      if(filled)return;
      if(expired()){cleanup();return;}
      if(++count>120){stop();status.textContent='Buy field not detected. Copy quantity and enter it manually.';return;}
      const found=[...document.querySelectorAll('input')].filter(el=>{
        if(box.contains(el)||el.disabled||!el.getClientRects?.().length)return false;
        const hint=[el.name,el.id,el.placeholder,el.getAttribute('aria-label')].join(' ').toLowerCase();
        const parent=(el.closest('[role=dialog],[class*=buy],[class*=purchase]')?.textContent||'').slice(0,400).toLowerCase();
        return /qty|quantity|amount/.test(hint)&&(/buy|purchase/.test(parent)||/buy|purchase/.test(hint));
      });
      if(found.length!==1||found[0].value&&Number(found[0].value)!==1)return;
      found[0].insertAdjacentElement('afterend',box);
      const el=found[0],set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set;
      if(set)set.call(el,String(p.qty));else el.value=String(p.qty);
      el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));
      filled=true;stop();status.textContent='Quantity '+p.qty+' filled. Verify price and press Buy yourself.';
    };
    observer=new MutationObserver(attempt);observer.observe(document.body,{childList:true,subtree:true});
    timer=setInterval(attempt,800);attempt();
  }
  // Only timestamps are retained across reloads. No keys, trades or balances in this scheduler record.
  const autoChecksV112={full:0,quick:0,travel:0,stocks:0,inventory:0,wallet:0};
  const automaticAttemptKeyV116='profitstaxx-auto-attempts-v116';
  try{
    const previous=JSON.parse(localStorage.getItem(automaticAttemptKeyV116)||'{}');
    for(const k of Object.keys(autoChecksV112)){
      const v=Number(previous[k]);
      if(Number.isFinite(v)&&v>0&&v<=now()&&now()-v<2*86400000)autoChecksV112[k]=v;
    }
  }catch(_){}
  function noteAutoAttemptV116(kind,time){
    autoChecksV112[kind]=time;
    try{localStorage.setItem(automaticAttemptKeyV116,JSON.stringify(autoChecksV112));}catch(_){}
  }
  let autoTickRunningV112=false;
  async function autoTickV112(){
    if(autoTickRunningV112||document.hidden||routePricing.busy||!apiKey()||state.busy||travelState.busy||stockState.loading)return;
    autoTickRunningV112=true;
    try{
      const time=now();
      if(time-state.walletAt>=10*60000&&time-autoChecksV112.wallet>=10*60000){
        noteAutoAttemptV116('wallet',time);await refreshWalletV113();return;
      }
      // Full scans may be lengthy: never repeat faster than 45 minutes, including failures.
      // Keep owned positions and market opportunities fresh even if a full scan is long-running or overdue.
      const staleHeld=positions().some(p=>p.qty>0&&time-Number(state.quotes[p.itemId]?.at||0)>=8*60000);
      if(staleHeld&&time-autoChecksV112.quick>=8*60000){
        noteAutoAttemptV116('quick',time);await scan({manual:false,quick:true});return;
      }
      if((!state.lastScan||time-state.lastScan>=60*60000)&&time-autoChecksV112.full>=45*60000){
        noteAutoAttemptV116('full',time);await scan({manual:false});return;
      }
      if(time-travelState.at>=20*60000&&time-autoChecksV112.travel>=20*60000){
        noteAutoAttemptV116('travel',time);await scanTravel();return;
      }
      if(time-stockState.at>=10*60000&&time-autoChecksV112.stocks>=10*60000){
        noteAutoAttemptV116('stocks',time);await refreshStocks();return;
      }
      if(state.settings.stockLogSync!==false&&time-state.stockLogCheckedAt>=3600000&&time>=state.stockLogRetryAt){
        await refreshStockCashLogs(false);return;
      }
      if(time-state.inventoryAt>=30*60000&&time-autoChecksV112.inventory>=30*60000){
        noteAutoAttemptV116('inventory',time);await refreshInventoryV112();return;
      }
      if(time-Math.max(autoChecksV112.quick,state.lastScan)>=8*60000){
        noteAutoAttemptV116('quick',time);await scan({manual:false,quick:true});
      }
    }catch(e){state.error='Automatic data check failed: '+String(e?.message||e);render();}
    finally{autoTickRunningV112=false;}
  }
  async function init(){
    mount();
    window.addEventListener("hashchange",()=>{nativeMarketQuote();marketAssist();});
    setInterval(()=>{nativeMarketQuote();syncRouteBar();},2000);
    document.dispatchEvent(new CustomEvent('staxx:register',{detail:{id:'profit',label:'Profit-TornStaxx',icon:'PS',desc:'Daily profit · Markets · Stocks',trendMetric:'Fresh deals',freshnessMs:600000}}));
    try{
      const loaded=await readStore();
      state.settings=Object.assign({},DEFAULTS,loaded.settings||{});
      state.walkthrough=loadWalkthrough(loaded.walkthrough);
      state.trades=Array.isArray(loaded.trades)?loaded.trades:[];
       state.income=Array.isArray(loaded.income)?loaded.income:[];
       travelState.rows=Array.isArray(loaded.travelRows)?loaded.travelRows:[];
       travelState.at=number(loaded.travelAt);
       state.stockHistory=loaded.stockHistory&&typeof loaded.stockHistory==='object'&&!Array.isArray(loaded.stockHistory)?loaded.stockHistory:{};
       state.stockCache=Array.isArray(loaded.stockCache)?loaded.stockCache:[];
       state.stockCacheAt=number(loaded.stockCacheAt);
       state.stockReceipts=Array.isArray(loaded.stockReceipts)?loaded.stockReceipts.filter(x=>x&&/^[a-z0-9_-]{1,90}$/i.test(String(x.id||''))&&Number.isSafeInteger(Number(x.amount))&&Number(x.amount)>0&&Number(x.amount)<=1e12&&Number(x.at)>now()-90*86400000&&Number(x.at)<=now()+60000).slice(0,180):[];
       state.stockLogCheckedAt=number(loaded.stockLogCheckedAt);
       state.stockLogRetryAt=number(loaded.stockLogRetryAt);
       state.dailyReviews=loaded.dailyReviews&&typeof loaded.dailyReviews==='object'&&!Array.isArray(loaded.dailyReviews)?loaded.dailyReviews:{};
       state.inventoryOwned=loaded.inventoryOwned&&typeof loaded.inventoryOwned==='object'&&!Array.isArray(loaded.inventoryOwned)?loaded.inventoryOwned:{};
       state.inventoryAt=number(loaded.inventoryAt);
       stockState.all=state.stockCache;stockState.at=state.stockCacheAt;
       if(!state.income.length){try{const prev=JSON.parse(localStorage.getItem('profitstaxx_income_v1')||'[]');if(Array.isArray(prev)&&prev.length){state.income=prev.slice(-1000);persist();}}catch(_){}}
      state.catalog=loaded.catalog||{};
      state.quotes=loaded.quotes||{};
      state.snapshots=loaded.snapshots||{};
      state.pointsPrice=number(loaded.pointsPrice);
      state.pointsCheckedAt=number(loaded.pointsCheckedAt);
      state.lastScan=number(loaded.lastScan);
      state.status='Ready · '+state.storage+' storage';
    }catch(e){state.error='Could not restore local data: '+e.message;}
    routeStoreReady=true;
    marketAssist();
    render();
    // Read-only autopilot: one bounded data task at a time, while Torn is foregrounded.
    // Prioritise missing/old full scans, then travel, stocks and short incremental quotes.
    scanTimer=setInterval(()=>{void autoTickV112();},60000);
    setTimeout(()=>{void autoTickV112();},10000);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){render();void autoTickV112();}});
    document.addEventListener('staxx:refresh-request',()=>{void autoTickV112();});
    document.addEventListener('staxx:mode',()=>{profitTabsExpanded=false;if(state.open)render();});
    document.addEventListener('staxx:time-budget',()=>{if(state.open&&state.tab==='daily')render();});

  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
