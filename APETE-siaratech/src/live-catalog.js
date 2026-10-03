import '../public/offer-pricing.js';
const STORE_FIELDS='id,public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo';
const PRODUCT_FIELDS='id,public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,offer_starts_at,offer_ends_at,preferences,serves,active,demo';
export function hasLiveCatalog(env) {return Boolean(env.SUPABASE_URL&&env.SUPABASE_PUBLISHABLE_KEY);}
export async function loadLiveCatalog(env,cities) {
 const root=new URL(env.SUPABASE_URL);
 if(root.protocol!=='https:')throw Error('invalid_catalog_configuration');
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4000);
 try {
  async function rows(table,fields) {
   const result=[];
   for(let page=0;page<10;page++) {
    const res=await fetch(new URL(`/rest/v1/${table}?select=${fields}&active=eq.true&order=public_id.asc&limit=1000&offset=${page*1000}`,root),{
     signal:controller.signal,cache:'no-store',headers:{apikey:env.SUPABASE_PUBLISHABLE_KEY,Authorization:'Bearer '+env.SUPABASE_PUBLISHABLE_KEY,Prefer:'count=exact'}
    });
    if(!res.ok)throw Error('catalog_backend_unavailable');
    const values=await res.json();
    if(!Array.isArray(values))throw Error('invalid_catalog_response');
    result.push(...values);
    const total=Number(res.headers.get('content-range')?.split('/')[1]);
    if(values.length===0||(Number.isFinite(total)?result.length>=total:values.length<1000))return result;
    if(values.length<1000)throw Error('incomplete_catalog');
   }
   throw Error('catalog_size_limit');
  }
  const [storeRows,productRows]=await Promise.all([rows('stores',STORE_FIELDS),rows('products',PRODUCT_FIELDS)]);
  const idMap=new Map();
  const stores=storeRows.map(s=>{
   if(!Number.isSafeInteger(Number(s.public_id))||Number(s.public_id)<=0||!Number.isSafeInteger(s.delivery_fee)||s.delivery_fee<0)throw Error('invalid_catalog_store');
   idMap.set(s.id,Number(s.public_id));
   return {id:Number(s.public_id),name:s.name,category:s.category,city:s.city,address:s.address||'',desc:s.description||'',hero:s.hero||'',fee:s.delivery_fee,
    producer:s.producer===true,delivery:s.delivery===true,pickup:s.pickup===true,serviceAreas:Array.isArray(s.service_areas)?s.service_areas:[],cover:s.cover||'',verified:s.verified===true,open:s.active===true,demo:s.demo===true};
  });
  const products=productRows.filter(p=>idMap.has(p.store_id)).map(p=>{
   if(!Number.isSafeInteger(Number(p.public_id))||Number(p.public_id)<=0||!Number.isSafeInteger(p.price)||p.price<0||!Number.isSafeInteger(p.stock)||p.stock<0)throw Error('invalid_catalog_product');
   return globalThis.APETE_OFFERS.project({id:Number(p.public_id),storeId:idMap.get(p.store_id),name:p.name,desc:p.description||'',cat:p.category||'',price:p.price,stock:p.stock,image:p.image||'',oldPrice:p.old_price||0,lastBatch:p.last_batch===true,
    preferences:Array.isArray(p.preferences)?p.preferences:[],serves:Number.isInteger(p.serves)?p.serves:null,available:p.active===true,demo:p.demo===true,offer:{startsAt:p.offer_starts_at,endsAt:p.offer_ends_at},pricingSource:'database'});
  });
  return {stores,products,cities:[...cities],demo:stores.every(s=>s.demo)&&products.every(p=>p.demo),source:'database'};
 } catch {throw {code:'catalog_unavailable',message:'Não foi possível consultar o catálogo atualizado. Tente novamente; não vou recomendar produtos com dados antigos.',status:503};}
 finally {clearTimeout(timer);}
}
