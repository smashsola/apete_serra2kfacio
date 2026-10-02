import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../public/backend-client.js',import.meta.url),'utf8');
function run(hash,verify){
 const memory=new Map(), calls=[];
 const context={window:{},location:{hash,pathname:'/',search:''},history:{replaceState:(...args)=>calls.push(args)},
  localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)},
  fetch:verify,URLSearchParams,AbortController,setTimeout,clearTimeout};
 vm.runInNewContext(source,context);
 return {backend:context.window.APETE_BACKEND,memory,calls};
}
test('confirmation removes URL credentials and saves only a server-verified user',async()=>{
 let verifyDone;
 const pending=new Promise(resolve=>verifyDone=resolve);
 const {backend,memory,calls}=run('#access_token=callback-token&refresh_token=refresh&expires_in=3600',async(url,options)=>{
  assert.match(url,/\/auth\/v1\/user$/); assert.equal(options.headers.Authorization,'Bearer callback-token');
  await pending; return new Response(JSON.stringify({id:'confirmed-user'}));
 });
 assert.equal(calls[0][2],'/'); assert.equal(memory.size,0);
 const sessionPromise=backend.getSession(); verifyDone();
 assert.equal((await sessionPromise).user.id,'confirmed-user');
});
test('invalid confirmation and auth errors do not create sessions',async()=>{
 const failed=run('#access_token=expired&refresh_token=refresh',async()=>new Response('{}',{status:401}));
 await failed.backend.ready; assert.equal(failed.memory.size,0); assert.equal(failed.calls[0][2],'/');
 const error=run('#error=access_denied&error_description=Expired',()=>{throw Error('should not fetch')});
 await error.backend.ready; assert.equal(error.memory.size,0); assert.equal(error.calls[0][2],'/');
});
