'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'..','ProfitStaxx.user.js'),'utf8');
test('ProfitStaxx Find opens shared search and accepts only known sections',()=>{
 assert.match(src,/data-action="staxx-find"/);
 assert.match(src,/new CustomEvent\('staxx:find'\)/);
 assert.match(src,/e\.detail\.section/);
 assert.match(src,/\['daily','alerts','best','scan','travel','stocks','capital','history','income','museum','portfolio','settings','diagnostics'\]/);
 assert.match(src,/\/\/ @version\s+1\.25\.\d+/);
});
test('Find navigation is read-only and preserves current trading logic',()=>{
 assert.match(src,/staxx:actions/);
 assert.match(src,/staxx:notice/);
 assert.match(src,/state\.alertFocus/);
 assert.doesNotMatch(src,/PDA_http(?:Post|Put|Patch|Delete)\s*\(/);
});
