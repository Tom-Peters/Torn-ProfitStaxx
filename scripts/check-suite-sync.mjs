#!/usr/bin/env node
// TornStaxx 4.0: standalone hub and lightweight module installation contract.
import {readFileSync} from 'node:fs';
import {exit} from 'node:process';

const roots=[
 ['Torn-ProfitStaxx','ProfitStaxx.user.js','profit','Profit-TornStaxx'],
 ['Torn-WarStaxx','WarStaxx.user.js','war','War-TornStaxx'],
 ['Torn-Happy-Jump-Helper','Torn-Happy-Jump-Helper-preview.user.js','happy','Training-TornStaxx'],
 ['Torn-Company-Helper','Torn-Company-Helper.user.js','company','Company-TornStaxx']
];
const base='https://raw.githubusercontent.com/Tom-Peters';
async function get(repo,path) {
 if(repo==='Torn-ProfitStaxx'&&path==='ProfitStaxx.user.js')return readFileSync(new URL('../'+path,import.meta.url),'utf8');
 const u=base+'/'+repo+'/main/'+path+'?cache='+Date.now();
 const r=await fetch(u,{signal:AbortSignal.timeout(20000),headers:{'Cache-Control':'no-cache'}});
 if(!r.ok)throw Error('HTTP '+r.status+' '+u);
 return r.text();
}
async function check(repo,path,verify){
 let message='unknown error';
 for(let i=0;i<4;i++){
   try{const code=await get(repo,path);verify(code);return code;}
   catch(e){message=e.message;if(i<3)await new Promise(r=>setTimeout(r,(i+1)*2200));}
 }
 throw Error(message);
}
let failures=0;
try{
 await check('TornStaxx','TornStaxx.user.js',src=>{
  if(!src.startsWith('// ==UserScript==\n')||!src.includes('/* TornStaxx v4.0')||!src.includes('staxx:open')||!src.includes('staxx:register'))throw Error('Standalone hub invalid');
  for(const [, , id,label] of roots)if(!src.includes('{id:"'+id+'",label:"'+label+'"'))throw Error('Hub registry missing '+id);
 });
 console.log('PASS TornStaxx dedicated command centre');
}catch(e){failures++;console.error('FAIL hub: '+e.message)}
for(const [repo,path,id,label] of roots){
 try{
   const src=await check(repo,path,c=>{
    if(!c.startsWith('// ==UserScript==\n')||!c.includes('/* TornStaxx 4.0 module fallback'))throw Error('Missing module header or fallback');
    if(c.includes('/* StaxxHub v3.5')||c.includes('root.id = "staxx-hub-root"'))throw Error('Embedded shared hub still present');
    for(const contract of ['staxx:open','staxx:notice','staxx:actions','staxx:diagnostics'])if(!c.includes(contract)&&!(id==='war'&&c.includes("event('"+contract.slice(6)+"'")))throw Error('Missing '+contract);
    if(!c.includes(label))throw Error('Display label not migrated');
    if(!(c.includes("id:'"+id+"'")||c.includes('id:"'+id+'"')))throw Error('Missing module registration');
   });
   if(id==='happy'){
     const v=src.match(/^\/\/ @version\s+(\S+)/m)?.[1];
     await check(repo,'Torn-Happy-Jump-Helper-v'+v+'-preview.user.js',snapshot=>{
      if(snapshot!==src)throw Error('Training preview snapshot drift');
     });
   }
   console.log('PASS '+repo+'/'+path+' standalone domain module');
 }catch(e){failures++;console.error('FAIL '+repo+'/'+path+': '+e.message)}
}
if(failures){console.error('Suite integrity errors: '+failures);exit(1);}
console.log('PASS hub and four self-contained modules');
