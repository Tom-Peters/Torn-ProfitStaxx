'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','ProfitStaxx.user.js'),'utf8');
test('alerts route to a specific market opportunity',()=>{
 assert.match(source,/function renderAlerts\(/);assert.match(source,/id:'deal-'\+Number\(d\.id\)/);
 assert.match(source,/state\.tab=e\.detail\.alertId==='stock-claim'\?'stocks':e\.detail\.alertId==='daily-plan'\?'daily':'alerts'/);
 assert.match(source,/state\.alertFocus=\['stock-claim','daily-plan'\]\.includes\(e\.detail\.alertId\)/);assert.match(source,/data-action="market-buy"/);
});
test('purchase preparation is user-led and never submits a Torn purchase',()=>{
 assert.match(source,/case 'market-buy':/);assert.match(source,/sessionStorage\.setItem\('profitstaxx-market-intent-v1'/);
 assert.match(source,/location\.assign\(linkToItem\(id\)\)/);assert.match(source,/found\.length!==1/);
 assert.match(source,/dispatchEvent\(new Event\('input'/);assert.doesNotMatch(source,/\bfetch\s*\(\s*['"]https:\/\/www\.torn\.com/);
});
