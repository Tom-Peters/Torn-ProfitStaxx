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
const targets=[
  ['Torn-ProfitStaxx','ProfitStaxx.user.js'],
  ['Torn-Company-Helper','Torn-Company-Helper.user.js'],
  ['Torn-Happy-Jump-Helper','Torn-Happy-Jump-Helper-preview.user.js']
];
let failures=0;
async function get(repo,path){
  const url=base+'/'+repo+'/main/'+path;
  const response=await fetch(url,{headers:{'User-Agent':'StaxxSuite-Parity-Check','Cache-Control':'no-cache'},signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw Error('HTTP '+response.status+' '+url);
  return await response.text();
}
for(const [repo,path] of targets){
  try{
    const body=repo==='Torn-ProfitStaxx'?readFileSync(new URL('../'+path,import.meta.url),'utf8'):await get(repo,path);
    const embedded=hubRegion(body);
    if(embedded!==canonical)throw Error('Bundled StaxxHub does not match canonical shared/staxx-hub.js');
    console.log('PASS '+repo+'/'+path+' — canonical match');
    if(path.endsWith('-preview.user.js')){
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
