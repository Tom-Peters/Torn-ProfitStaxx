#!/usr/bin/env node
// Cross-repository StaxxHub bundle parity. Runs in CI only; no game API calls.
// Canonical code is local. Public downstream scripts are read directly from GitHub.
import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

const base = 'https://raw.githubusercontent.com/Tom-Peters';
const canonical = readFileSync(new URL('../shared/staxx-hub.js',import.meta.url),'utf8').trimEnd();
function hubRegion(body) {
  const start=body.indexOf('/* StaxxHub v');
  if(start<0)throw Error('Missing embedded StaxxHub');
  const end=body.indexOf('\n})();',start);
  if(end<0)throw Error('Unterminated embedded StaxxHub');
  return body.slice(start,end+6).trimEnd();
}
const manifest=JSON.parse(readFileSync(new URL('../suite/manifest.json',import.meta.url),'utf8'));
const targets=manifest.active.map(x=>[x.repository,x.entrypoint,Boolean(x.versioned_snapshot)]);
let failures=0;
async function get(repo,path){
  const url=base+'/'+repo+'/main/'+path+'?staxx_parity='+Date.now();
  const response=await fetch(url,{headers:{'User-Agent':'StaxxSuite-Parity-Check','Cache-Control':'no-cache'},signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw Error('HTTP '+response.status+' '+url);
  return await response.text();
}
for(const [repo,path,hasSnapshot] of targets){
  try{
    let body=repo==='Torn-ProfitStaxx'?readFileSync(new URL('../'+path,import.meta.url),'utf8'):await get(repo,path);
    let embedded=hubRegion(body);
    // The raw GitHub CDN can briefly serve an earlier main revision just after
    // downstream commits. Recheck before reporting a genuine cross-repo drift.
    if(repo!=='Torn-ProfitStaxx'){
      for(let retry=0;retry<3&&embedded!==canonical;retry++){
        await new Promise(resolve=>setTimeout(resolve,2500*(retry+1)));
        body=await get(repo,path);
        embedded=hubRegion(body);
      }
    }
    if(embedded!==canonical)throw Error('Bundled StaxxHub differs from canonical after refresh (embedded '+embedded.length+' bytes; canonical '+canonical.length+')');
    if(!body.includes('staxx-more-tabs')||!body.includes('staxx-hub-mode-v1')||!body.includes("staxx:mode"))
      throw Error('Tool does not implement the shared Simple/Advanced navigation contract');
    if(!body.includes('staxx:find')||!body.includes('data-hub-find')||!body.includes('e.detail.section'))
      throw Error('Tool does not implement the shared StaxxHub 3.0 Find contract');
    const control={ 'Torn-ProfitStaxx':'data-action="staxx-find"',
      'Torn-Company-Helper':'data-act="staxx-find"',
      'Torn-Happy-Jump-Helper':"data-act='staxx-find'" }[repo];
    if(!control||!body.includes(control))throw Error('Missing in-tool Find button: '+repo);
    const localSource=body.slice(body.indexOf('\n})();',body.indexOf('/* StaxxHub v'))+6);
    if(!canonical.includes('StaxxHub v3.4')||!canonical.includes("staxx:activity")||!canonical.includes('staxx-hub-reviewed-v1')||!canonical.includes('staxx-hub-session-minutes-v1')||!canonical.includes('completedActionId'))
      throw Error('Canonical Hub must include the v3.3 intelligence and activity contracts');
    if(!localSource.includes('staxx:activity')||!localSource.includes('reviewMinutes'))
      throw Error('Active tool must publish source-backed activity and review-time estimates: '+repo);
    if(!localSource.includes('staxx:visit'))
      throw Error('Active tool must publish user-clicked section visits: '+repo);
    if(!canonical.includes('staxx-hub-dashboard')||!canonical.includes('staxx-hub-activity')||!canonical.includes('staxx-hub-usage-v1')||!canonical.includes('staxx-hub-source-status')||!canonical.includes('staxx-hub-daily')||!canonical.includes('staxx-hub-feedback-v1'))
      throw Error('Canonical hub must preserve dashboard, activity and local adaptive shortcuts');
    console.log('PASS '+repo+'/'+path+' — canonical match');
    if(hasSnapshot){
      const version=body.match(/^\/\/ @version\s+(\S+)/m)?.[1];
      if(!version)throw Error('Preview has no version header');
      const snapshot='Torn-Happy-Jump-Helper-v'+version+'-preview.user.js';
      const snapBody=await get(repo,snapshot);
      if(snapBody!==body)throw Error('Preview and versioned snapshot differ: '+snapshot);
      console.log('PASS '+repo+'/'+snapshot+' — exact preview match');
    }
  }catch(error){failures++;console.error('FAIL '+repo+'/'+path+': '+error.message);}
}
if(failures){console.error('Staxx suite drift detected. Sync canonical source to ALL active bundles.');exit(1);}
console.log('All active Torn tools contain the current shared StaxxHub.');
