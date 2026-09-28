(() => {
  const SUPABASE_URL='https://inmpyytgyitqtcaococm.supabase.co';
  const SUPABASE_KEY='sb_publishable_L82vbDaHqkFdqplNgi1XtA_34Pus6MH';
  const SESSION_KEY='apete-supabase-session-v1';

  const readSession=()=>{
    try{
      const value=JSON.parse(localStorage.getItem(SESSION_KEY)||'null');
      return value&&value.access_token&&value.refresh_token?value:null;
    }catch{return null;}
  };
  const writeSession=session=>{
    if(!session){localStorage.removeItem(SESSION_KEY);return;}
    const expiresAt=session.expires_at||Math.floor(Date.now()/1000)+(Number(session.expires_in)||3600);
    localStorage.setItem(SESSION_KEY,JSON.stringify({...session,expires_at:expiresAt}));
  };
  const hasStoredSession=()=>Boolean(readSession());

  async function request(path,{method='GET',body,accessToken,headers={}}={}) {
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),10000);
    try {
      const response=await fetch(SUPABASE_URL+path,{
        method,
        cache:'no-store',
        signal:controller.signal,
        headers:{
          apikey:SUPABASE_KEY,
          ...(body!==undefined?{'Content-Type':'application/json'}:{}),
          ...(accessToken?{Authorization:'Bearer '+accessToken}:{}),
          ...headers
        },
        body:body===undefined?undefined:JSON.stringify(body)
      });
      let data=null;
      if(response.status!==204){
        const raw=await response.text();
        if(raw){try{data=JSON.parse(raw);}catch{data=raw;}}
      }
      if(!response.ok){
        const message=typeof data==='object'?(data?.msg||data?.message||data?.error_description||data?.error):'';
        const error=new Error(message||`Backend respondeu ${response.status}`);
        error.status=response.status;error.data=data;throw error;
      }
      return data;
    } catch(error) {
      if(error.name==='AbortError')throw new Error('O backend demorou demais para responder.');
      throw error;
    } finally { clearTimeout(timeout); }
  }

  async function refreshSession(current=readSession()) {
    if(!current?.refresh_token)return null;
    try{
      const next=await request('/auth/v1/token?grant_type=refresh_token',{
        method:'POST',body:{refresh_token:current.refresh_token}
      });
      writeSession(next);
      return next;
    }catch(error){
      writeSession(null);
      return null;
    }
  }

  async function getSession() {
    const session=readSession();
    if(!session)return null;
    const expiresAt=Number(session.expires_at)||0;
    if(expiresAt>Date.now()/1000+60)return session;
    return refreshSession(session);
  }

  async function signUpCustomer({email,password,name,phone,address,neighborhood,city}) {
    const data=await request('/auth/v1/signup',{
      method:'POST',
      body:{email,password,data:{full_name:name,phone}}
    });
    const session=data?.access_token?data:data?.session;
    if(session){
      writeSession(session);
      await updateProfile({full_name:name,phone,address,neighborhood,city},session);
    }
    return {session:session||null,user:data?.user||session?.user||null,confirmationRequired:!session};
  }

  async function signInCustomer({email,password}) {
    const session=await request('/auth/v1/token?grant_type=password',{
      method:'POST',body:{email,password}
    });
    writeSession(session);
    return session;
  }

  async function signOut() {
    const session=await getSession();
    try{
      if(session?.access_token)await request('/auth/v1/logout',{method:'POST',accessToken:session.access_token});
    }finally{writeSession(null);}
  }

  async function authed(path,options={}) {
    const session=await getSession();
    if(!session?.access_token){const error=new Error('authentication_required');error.status=401;throw error;}
    try{return await request(path,{...options,accessToken:session.access_token});}
    catch(error){
      if(error.status!==401)throw error;
      const refreshed=await refreshSession(session);
      if(!refreshed?.access_token)throw error;
      return request(path,{...options,accessToken:refreshed.access_token});
    }
  }

  async function getProfile(sessionOverride=null) {
    const session=sessionOverride||await getSession();
    const user=session?.user;
    if(!session?.access_token||!user?.id)return null;
    const rows=await request('/rest/v1/profiles?select=id,role,full_name,phone,address,neighborhood,city&id=eq.'+encodeURIComponent(user.id)+'&limit=1',{
      accessToken:session.access_token
    });
    return rows?.[0]?{...rows[0],email:user.email||''}:null;
  }

  async function updateProfile(values,sessionOverride=null) {
    const session=sessionOverride||await getSession();
    const user=session?.user;
    if(!session?.access_token||!user?.id)throw new Error('authentication_required');
    const allowed={};
    for(const key of ['full_name','phone','address','neighborhood','city']){
      if(values[key]!==undefined)allowed[key]=values[key];
    }
    await request('/rest/v1/profiles?id=eq.'+encodeURIComponent(user.id),{
      method:'PATCH',body:allowed,accessToken:session.access_token,headers:{Prefer:'return=minimal'}
    });
    return getProfile(session);
  }

  async function loadOrders() {
    const session=await getSession();
    if(!session?.user?.id)return [];
    const select='id,public_number,store_id,status,mode,city,customer_name,customer_phone,address,neighborhood,note,payment_method,subtotal,delivery_fee,total,created_at,order_items(product_id,product_name,unit_price,quantity,line_subtotal),stores(public_id,name)';
    const rows=await authed('/rest/v1/orders?select='+encodeURIComponent(select)+'&customer_id=eq.'+encodeURIComponent(session.user.id)+'&order=created_at.desc');
    const statusMap={pending:'pendente',accepted:'preparando',preparing:'preparando',ready:'pronto',out_for_delivery:'pronto',delivered:'concluido',cancelled:'cancelado'};
    const paymentMap={pix:'Pix',card:'Cartão','card_on_delivery':'Cartão na entrega'};
    return (rows||[]).map(order=>({
      id:Number(order.public_number),
      backendId:order.id,
      createdAt:order.created_at,
      storeId:Number(order.stores?.public_id)||0,
      status:statusMap[order.status]||'pendente',
      backendStatus:order.status,
      items:(order.order_items||[]).map(item=>({
        productId:null,
        backendProductId:item.product_id,
        name:item.product_name,
        price:Number(item.unit_price)||0,
        qty:Number(item.quantity)||1
      })),
      subtotal:Number(order.subtotal)||0,
      deliveryFee:Number(order.delivery_fee)||0,
      total:Number(order.total)||0,
      payment:order.payment_method,
      paymentLabel:paymentMap[order.payment_method]||order.payment_method,
      note:order.note||'',
      customer:{
        name:order.customer_name||'',
        phone:order.customer_phone||'',
        address:order.address||'',
        neighborhood:order.neighborhood||''
      }
    }));
  }

  async function createOrder({storeId,city,mode='delivery',customer,note='',payment,items}) {
    const paymentMap={pix:'pix',cartao:'card','cartao-entrega':'card_on_delivery'};
    const rows=await authed('/rest/v1/rpc/create_order',{
      method:'POST',
      body:{
        p_store_public_id:Number(storeId),
        p_city:city,
        p_mode:mode,
        p_customer_name:customer.name,
        p_customer_phone:customer.phone,
        p_address:customer.address||'',
        p_neighborhood:customer.neighborhood||'',
        p_note:note||'',
        p_payment_method:paymentMap[payment]||payment,
        p_items:(items||[]).map(item=>({productId:Number(item.productId),quantity:Number(item.qty)}))
      }
    });
    return Array.isArray(rows)?rows[0]:rows;
  }

  async function loadCatalog() {
    const [stores,products]=await Promise.all([
      request('/rest/v1/stores?select=id,public_id,name,category,city,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo&active=eq.true&order=public_id.asc'),
      request('/rest/v1/products?select=id,public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo&active=eq.true&order=public_id.asc')
    ]);
    const publicStoreId=new Map(stores.map(store=>[store.id,Number(store.public_id)]));
    return {
      stores:stores.map(store=>({
        id:Number(store.public_id),backendId:store.id,name:store.name,category:store.category,city:store.city,
        desc:store.description||'',hero:store.hero||'',fee:Number(store.delivery_fee)||0,producer:Boolean(store.producer),
        delivery:Boolean(store.delivery),pickup:Boolean(store.pickup),serviceAreas:Array.isArray(store.service_areas)?store.service_areas:[],
        cover:store.cover||'',verified:Boolean(store.verified),open:Boolean(store.active),demo:Boolean(store.demo)
      })),
      products:products.map(product=>({
        id:Number(product.public_id),backendId:product.id,storeId:publicStoreId.get(product.store_id),name:product.name,
        desc:product.description||'',cat:product.category||'',price:Number(product.price)||0,stock:Number(product.stock)||0,
        image:product.image||'',oldPrice:Number(product.old_price)||0,lastBatch:Boolean(product.last_batch),
        preferences:Array.isArray(product.preferences)?product.preferences:[],serves:Number.isInteger(product.serves)?product.serves:null,
        available:Boolean(product.active),demo:Boolean(product.demo)
      })).filter(product=>Number.isInteger(product.storeId))
    };
  }

  async function submitMerchantApplication({storeName,phone,city,document,instagram}) {
    const session=await getSession();
    if(!session?.user?.id)throw new Error('authentication_required');
    const rows=await authed('/rest/v1/merchant_applications',{
      method:'POST',
      body:{user_id:session.user.id,store_name:storeName,phone,city,document,instagram,status:'pending'},
      headers:{Prefer:'return=representation'}
    });
    return Array.isArray(rows)?rows[0]:rows;
  }

  async function getMerchantApplication() {
    const session=await getSession();
    if(!session?.user?.id)return null;
    const rows=await authed('/rest/v1/merchant_applications?select=id,store_name,phone,city,document,instagram,status,reviewed_at,created_at&user_id=eq.'+encodeURIComponent(session.user.id)+'&order=created_at.desc&limit=1');
    return rows?.[0]||null;
  }

  async function getMerchantMemberships() {
    const session=await getSession();
    if(!session?.user?.id)return [];
    const select='store_id,role,stores(id,public_id,name,category,city,description,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,instagram,contact_phone)';
    const rows=await authed('/rest/v1/store_members?select='+encodeURIComponent(select)+'&user_id=eq.'+encodeURIComponent(session.user.id));
    return (rows||[]).filter(row=>row.stores).map(row=>({
      role:row.role,
      store:{
        backendId:row.stores.id,
        id:Number(row.stores.public_id),
        name:row.stores.name,
        category:row.stores.category||'',
        city:row.stores.city||'',
        desc:row.stores.description||'',
        fee:Number(row.stores.delivery_fee)||0,
        producer:Boolean(row.stores.producer),
        delivery:Boolean(row.stores.delivery),
        pickup:Boolean(row.stores.pickup),
        serviceAreas:Array.isArray(row.stores.service_areas)?row.stores.service_areas:[],
        cover:row.stores.cover||'',
        verified:Boolean(row.stores.verified),
        open:Boolean(row.stores.active),
        instagram:row.stores.instagram||'',
        contactPhone:row.stores.contact_phone||''
      }
    }));
  }

  function mapOrder(order) {
    const statusMap={pending:'pendente',accepted:'preparando',preparing:'preparando',ready:'pronto',out_for_delivery:'pronto',delivered:'concluido',cancelled:'cancelado'};
    const paymentMap={pix:'Pix',card:'Cartão','card_on_delivery':'Cartão na entrega'};
    return {
      id:Number(order.public_number),
      backendId:order.id,
      createdAt:order.created_at,
      storeId:Number(order.stores?.public_id)||0,
      status:statusMap[order.status]||'pendente',
      backendStatus:order.status,
      items:(order.order_items||[]).map(item=>({
        productId:null,backendProductId:item.product_id,name:item.product_name,
        price:Number(item.unit_price)||0,qty:Number(item.quantity)||1
      })),
      subtotal:Number(order.subtotal)||0,
      deliveryFee:Number(order.delivery_fee)||0,
      total:Number(order.total)||0,
      payment:order.payment_method,
      paymentLabel:paymentMap[order.payment_method]||order.payment_method,
      note:order.note||'',
      customer:{
        name:order.customer_name||'',phone:order.customer_phone||'',
        address:order.address||'',neighborhood:order.neighborhood||''
      }
    };
  }

  async function loadMerchantOrders(storeBackendId) {
    if(!storeBackendId)return [];
    const select='id,public_number,store_id,status,mode,city,customer_name,customer_phone,address,neighborhood,note,payment_method,subtotal,delivery_fee,total,created_at,order_items(product_id,product_name,unit_price,quantity,line_subtotal),stores(public_id,name)';
    const rows=await authed('/rest/v1/orders?select='+encodeURIComponent(select)+'&store_id=eq.'+encodeURIComponent(storeBackendId)+'&order=created_at.desc');
    return (rows||[]).map(mapOrder);
  }

  async function updateOrderStatus(orderBackendId,status) {
    const allowed=new Set(['pending','accepted','preparing','ready','out_for_delivery','delivered','cancelled']);
    if(!allowed.has(status))throw new Error('invalid_order_status');
    const rows=await authed('/rest/v1/orders?id=eq.'+encodeURIComponent(orderBackendId),{
      method:'PATCH',body:{status},headers:{Prefer:'return=representation'}
    });
    return Array.isArray(rows)?rows[0]:rows;
  }

  async function updateStoreProfile(storeBackendId,values) {
    const body={};
    const map={name:'name',category:'category',city:'city',desc:'description',instagram:'instagram',contactPhone:'contact_phone'};
    for(const [source,target] of Object.entries(map))if(values[source]!==undefined)body[target]=values[source];
    const rows=await authed('/rest/v1/stores?id=eq.'+encodeURIComponent(storeBackendId),{
      method:'PATCH',body,headers:{Prefer:'return=representation'}
    });
    return Array.isArray(rows)?rows[0]:rows;
  }

  async function saveMerchantProduct(storeBackendId,product) {
    const body={
      store_id:storeBackendId,
      name:product.name,
      description:product.desc||'',
      category:product.cat||'',
      price:Number(product.price)||0,
      stock:Number(product.stock)||0,
      image:product.image||'',
      old_price:Number(product.oldPrice)||0,
      last_batch:Boolean(product.lastBatch),
      preferences:Array.isArray(product.preferences)?product.preferences:[],
      serves:Number.isInteger(product.serves)&&product.serves>0?product.serves:null,
      active:product.available!==false
    };
    if(product.backendId){
      delete body.store_id;
      const rows=await authed('/rest/v1/products?id=eq.'+encodeURIComponent(product.backendId),{
        method:'PATCH',body,headers:{Prefer:'return=representation'}
      });
      return Array.isArray(rows)?rows[0]:rows;
    }
    const rows=await authed('/rest/v1/products',{
      method:'POST',body,headers:{Prefer:'return=representation'}
    });
    return Array.isArray(rows)?rows[0]:rows;
  }

  async function updateMerchantProduct(productBackendId,values) {
    const body={};
    const map={price:'price',stock:'stock',oldPrice:'old_price',lastBatch:'last_batch',active:'active'};
    for(const [source,target] of Object.entries(map))if(values[source]!==undefined)body[target]=values[source];
    const rows=await authed('/rest/v1/products?id=eq.'+encodeURIComponent(productBackendId),{
      method:'PATCH',body,headers:{Prefer:'return=representation'}
    });
    return Array.isArray(rows)?rows[0]:rows;
  }

  window.APETE_BACKEND={
    hasStoredSession,getSession,getProfile,updateProfile,signUpCustomer,signInCustomer,signOut,
    loadOrders,createOrder,loadCatalog,
    submitMerchantApplication,getMerchantApplication,getMerchantMemberships,loadMerchantOrders,
    updateOrderStatus,updateStoreProfile,saveMerchantProduct,updateMerchantProduct
  };
})();
