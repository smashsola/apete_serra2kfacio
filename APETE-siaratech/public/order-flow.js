/* Shared checkout logic; exercised without production data. */
(() => {
function createCheckoutController({storage,crypto}) {
  const storageKey='apete-checkout-attempt-v1';
  let inFlight=null;
  return {
    async submit(backend,payload) {
      if(inFlight)return inFlight;
      inFlight=(async()=>{
        const session=await backend.getSession();
        const owner=session?.user?.id;
        if(!owner)throw new Error('authentication_required');
        const request={...payload,items:[...payload.items].sort((a,b)=>a.productId-b.productId)};
        const canonical=JSON.stringify({...request,owner});
        const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical));
        const fingerprint=Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
        let attempt;
        try{attempt=JSON.parse(storage.getItem(storageKey)||'null');}catch{}
        if(attempt?.owner!==owner||attempt?.fingerprint!==fingerprint){
          attempt={owner,fingerprint,requestId:crypto.randomUUID()};
          // Store only a hash and identifier, never delivery details or access tokens.
          storage.setItem(storageKey,JSON.stringify(attempt));
        }
        const result=await backend.createOrder({...request,requestId:attempt.requestId});
        if(!result?.order_id||!result?.public_number)throw new Error('invalid_order_confirmation');
        return result;
      })();
      try{return await inFlight;}finally{inFlight=null;}
    },
    complete(){try{storage.removeItem(storageKey);}catch{}}
  };
}

function createSingleFlight() {
  const pending=new Map();
  return async(key,work)=>{
    if(pending.has(key))return pending.get(key);
    const task=Promise.resolve().then(work);
    pending.set(key,task);
    try{return await task;}finally{if(pending.get(key)===task)pending.delete(key);}
  };
}

if(typeof window!=='undefined')window.APETE_ORDER_FLOW={createCheckoutController,createSingleFlight};
})();
