(() => {
  const SUPABASE_URL='https://inmpyytgyitqtcaococm.supabase.co';
  const SUPABASE_KEY='sb_publishable_L82vbDaHqkFdqplNgi1XtA_34Pus6MH';

  async function api(path, options={}) {
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),8000);
    try {
      const response=await fetch(SUPABASE_URL+path,{
        ...options,
        cache:'no-store',
        signal:controller.signal,
        headers:{
          apikey:SUPABASE_KEY,
          'Content-Type':'application/json',
          ...(options.headers||{})
        }
      });
      if(!response.ok) {
        let detail='';try{detail=(await response.json())?.message||'';}catch{}
        throw new Error(detail||`Backend respondeu ${response.status}`);
      }
      return response.status===204?null:response.json();
    } finally { clearTimeout(timeout); }
  }

  async function loadCatalog() {
    const [stores,products]=await Promise.all([
      api('/rest/v1/stores?select=id,public_id,name,category,city,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo&active=eq.true&order=public_id.asc'),
      api('/rest/v1/products?select=id,public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo&active=eq.true&order=public_id.asc')
    ]);
    const publicStoreId=new Map(stores.map(store=>[store.id,Number(store.public_id)]));
    return {
      stores:stores.map(store=>({
        id:Number(store.public_id),
        name:store.name,
        category:store.category,
        city:store.city,
        desc:store.description||'',
        hero:store.hero||'',
        fee:Number(store.delivery_fee)||0,
        producer:Boolean(store.producer),
        delivery:Boolean(store.delivery),
        pickup:Boolean(store.pickup),
        serviceAreas:Array.isArray(store.service_areas)?store.service_areas:[],
        cover:store.cover||'',
        verified:Boolean(store.verified),
        open:Boolean(store.active),
        demo:Boolean(store.demo)
      })),
      products:products.map(product=>({
        id:Number(product.public_id),
        storeId:publicStoreId.get(product.store_id),
        name:product.name,
        desc:product.description||'',
        cat:product.category||'',
        price:Number(product.price)||0,
        stock:Number(product.stock)||0,
        image:product.image||'',
        oldPrice:Number(product.old_price)||0,
        lastBatch:Boolean(product.last_batch),
        preferences:Array.isArray(product.preferences)?product.preferences:[],
        serves:Number.isInteger(product.serves)?product.serves:null,
        available:Boolean(product.active),
        demo:Boolean(product.demo)
      })).filter(product=>Number.isInteger(product.storeId))
    };
  }

  window.APETE_BACKEND={loadCatalog};
})();
