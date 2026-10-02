import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
const imageCode=source.slice(source.indexOf('function fallbackImage('),source.indexOf('\nfunction pageHead('));
const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
test('imagem de apoio preserva cores e rótulos com aspas sem quebrar a URI',()=>{
 const ctx={esc:escape};vm.createContext(ctx);vm.runInContext(imageCode,ctx);
 const uri=ctx.fallbackImage('D\'água <Serra> & café');
 assert.equal(new URL(uri).hash,'');
 const svg=decodeURIComponent(uri.split(',').slice(1).join(','));
 assert.match(svg,/#D68044/);assert.match(svg,/&lt;Serra&gt; &amp; café/);
 const html=ctx.imgTag('https://example.invalid/broken.jpg','D\'água');
 assert.doesNotMatch(html,/onerror=/);assert.match(html,/data-fallback-src=/);
});
test('fechar modal restaura foco sem acessar a referência zerada e tolera elemento removido',()=>{
 const code=source.slice(source.indexOf('function closeModal('),source.indexOf('\nfunction openModal('));
 let focusCalls=0;const target={isConnected:true,focus:()=>focusCalls++};let pending;
 const modal={hidden:false,classList:{remove(){}},setAttribute(){}};
 const ctx={$:id=>id==='#modal'?modal:{innerHTML:''},document:{body:{classList:{remove(){}}}},requestAnimationFrame:fn=>pending=fn,modalReturnFocus:target};
 vm.createContext(ctx);vm.runInContext(code,ctx);ctx.closeModal();assert.equal(ctx.modalReturnFocus,null);pending();assert.equal(focusCalls,1);
 modal.hidden=false;ctx.modalReturnFocus=target;ctx.closeModal();target.isConnected=false;assert.doesNotThrow(()=>pending());assert.equal(focusCalls,1);
});
