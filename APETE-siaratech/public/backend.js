(() => {
  const CONFIG={
    url:'https://inmpyytgyitqtcaococm.supabase.co',
    key:'sb_publishable_L82vbDaHqkFdqplNgi1XtA_34Pus6MH'
  };
  let client=null;
  const configured=()=>Boolean(CONFIG.url&&CONFIG.key);
  const requireClient=()=>{
    if(!configured()) throw new Error('Backend não configurado.');
    if(!window.supabase?.createClient) throw new Error('Cliente Supabase não carregado.');
    if(!client) client=window.supabase.createClient(CONFIG.url,CONFIG.key,{
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
    });
    return client;
  };
  const fail=(error,fallback='Não foi possível concluir a operação.')=>{
    const message=String(error?.message||fallback);
    if(/Invalid login credentials/i.test(message)) return new Error('E-mail/telefone ou senha incorretos.');
    if(/Email not confirmed/i.test(message)) return new Error('Confirme seu e-mail antes de entrar.');
    if(/User already registered/i.test(message)) return new Error('Já existe uma conta com este e-mail.');
    if(/insufficient_stock/i.test(message)) return new Error('Um dos produtos ficou sem estoque suficiente.');
    if(/mixed_store_order/i.test(message)) return new Error('O pedido precisa conter produtos de um único estabelecimento.');
    if(/city_unavailable/i.test(message)) return new Error('Este estabelecimento não atende a cidade selecionada.');
    if(/store_unavailable|product_unavailable/i.test(message)) return new Error('Loja ou produto indisponível no momento.');
    if(/invalid_order_status_transition/i.test(message)) return new Error('Essa mudança de status não é permitida.');
    return new Error(message||fallback);
  };
  async function session(){
    const {data,error}=await requireClient().auth.getSession();
    if(error) throw fail(error);
    return data.session||null;
  }
  async function currentUser(){
    const current=await session();
    return current?.user||null;
  }
  async function profile(){
    const user=await currentUser();
    if(!user) return null;
    const {data,error}=await requireClient().from('profiles').select('*').eq('id',user.id).maybeSingle();
    if(error) throw fail(error);
    return data||null;
  }
  async function updateProfile(values){
    const user=await currentUser();
    if(!user) throw new Error('Faça login primeiro.');
    const allowed=['full_name','phone','address','neighborhood','city'];
    const payload=Object.fromEntries(Object.entries(values||{}).filter(([key])=>allowed.includes(key)));
    const {data,error}=await requireClient().from('profiles').update(payload).eq('id',user.id).select('*').single();
    if(error) throw fail(error);
    return data;
  }
  async function signUpCustomer({email,password,fullName,phone,address,neighborhood,city}){
    const {data,error}=await requireClient().auth.signUp({
      email,password,
      options:{data:{full_name:fullName||'',phone:phone||''}}
    });
    if(error) throw fail(error);
    if(data.session){
      await updateProfile({full_name:fullName,phone,address,neighborhood,city});
    }
    return {user:data.user,session:data.session,needsEmailConfirmation:Boolean(data.user&&!data.session)};
  }
  async function signIn(identifier,password){
    const credentials=String(identifier||'').includes('@')
      ? {email:String(identifier).trim(),password}
      : {phone:String(identifier).replace(/\D/g,''),password};
    const {data,error}=await requireClient().auth.signInWithPassword(credentials);
    if(error) throw fail(error);
    return data;
  }
  async function signOut(){
    const {error}=await requireClient().auth.signOut();
    if(error) throw fail(error);
  }
  async function createOrder(payload){
    const {data,error}=await requireClient().rpc('create_order',{
      p_store_public_id:Number(payload.storeId),
      p_city:payload.city,
      p_mode:payload.mode||'delivery',
      p_customer_name:payload.customerName,
      p_customer_phone:payload.customerPhone,
      p_address:payload.address||'',
      p_neighborhood:payload.neighborhood||'',
      p_note:payload.note||'',
      p_payment_method:payload.paymentMethod||'pix',
      p_items:(payload.items||[]).map(item=>({productId:Number(item.productId),quantity:Number(item.quantity)}))
    });
    if(error) throw fail(error);
    return Array.isArray(data)?data[0]:data;
  }
  const statusToUi=status=>({
    pending:'pendente',accepted:'preparando',preparing:'preparando',ready:'pronto',
    out_for_delivery:'pronto',delivered:'concluido',cancelled:'cancelado'
  }[status]||status);
  const statusToDb=status=>({
    pendente:'pending',preparando:'preparing',pronto:'ready',concluido:'delivered',cancelado:'cancelled'
  }[status]||status);
  function mapOrder(row){
    return {
      id:Number(row.public_number),
      backendId:row.id,
      createdAt:row.created_at,
      storeId:Number(row.store?.public_id||row.store_public_id||0),
      status:statusToUi(row.status),
      items:(row.order_items||[]).map(item=>({
        productId:Number(item.product?.public_id||0),name:item.product_name,price:item.unit_price,qty:item.quantity
      })),
      subtotal:row.subtotal,deliveryFee:row.delivery_fee,total:row.total,
      payment:row.payment_method,
      paymentLabel:{pix:'Pix',card:'Cartão',card_on_delivery:'Cartão na entrega'}[row.payment_method]||row.payment_method,
      note:row.note,
      customer:{name:row.customer_name,phone:row.customer_phone,address:row.address,neighborhood:row.neighborhood}
    };
  }
  async function myOrders(){
    const {data,error}=await requireClient().from('orders')
      .select('*,store:stores(public_id,name),order_items(*,product:products(public_id))')
      .order('created_at',{ascending:false});
    if(error) throw fail(error);
    return (data||[]).map(mapOrder);
  }
  async function memberships(){
    const {data,error}=await requireClient().from('store_members')
      .select('role,store:stores(id,public_id,name,city,category,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active)');
    if(error) throw fail(error);
    return data||[];
  }
  async function storeOrders(storePublicId){
    const member=(await memberships()).find(entry=>Number(entry.store?.public_id)===Number(storePublicId));
    if(!member) throw new Error('Sua conta não está vinculada a este estabelecimento.');
    const {data,error}=await requireClient().from('orders')
      .select('*,store:stores(public_id,name),order_items(*,product:products(public_id))')
      .eq('store_id',member.store.id).order('created_at',{ascending:false});
    if(error) throw fail(error);
    return (data||[]).map(mapOrder);
  }
  async function updateOrderStatus(orderBackendId,nextStatus){
    const {data,error}=await requireClient().from('orders')
      .update({status:statusToDb(nextStatus)}).eq('id',orderBackendId)
      .select('id,status,public_number').single();
    if(error) throw fail(error);
    return data;
  }
  async function submitMerchantApplication({storeName,phone,city,document,instagram}){
    const user=await currentUser();
    if(!user) throw new Error('Faça login antes de solicitar acesso comercial.');
    const {data,error}=await requireClient().from('merchant_applications').insert({
      user_id:user.id,store_name:storeName,phone,city,document,instagram,status:'pending'
    }).select('*').single();
    if(error) throw fail(error);
    return data;
  }
  async function updateStore(storeId,values){
    const allowed=['name','category','city','description','hero','delivery_fee','producer','delivery','pickup','service_areas','cover'];
    const payload=Object.fromEntries(Object.entries(values||{}).filter(([key])=>allowed.includes(key)));
    const {data,error}=await requireClient().from('stores').update(payload).eq('id',storeId).select('*').single();
    if(error) throw fail(error);
    return data;
  }
  async function saveProduct(storeId,product){
    const payload={
      store_id:storeId,
      name:product.name,
      description:product.description||'',
      category:product.category||'',
      price:Number(product.price),
      stock:Number(product.stock),
      image:product.image||'',
      old_price:Number(product.oldPrice||0),
      last_batch:Boolean(product.lastBatch),
      preferences:Array.isArray(product.preferences)?product.preferences:[],
      serves:product.serves||null,
      active:product.active!==false
    };
    if(product.backendId){
      delete payload.store_id;
      const {data,error}=await requireClient().from('products').update(payload).eq('id',product.backendId).select('*').single();
      if(error) throw fail(error);
      return data;
    }
    const {data,error}=await requireClient().from('products').insert(payload).select('*').single();
    if(error) throw fail(error);
    return data;
  }
  async function deleteProduct(productBackendId){
    const {error}=await requireClient().from('products').delete().eq('id',productBackendId);
    if(error) throw fail(error);
  }
  async function productsForStore(storeId){
    const {data,error}=await requireClient().from('products').select('*').eq('store_id',storeId).order('public_id');
    if(error) throw fail(error);
    return data||[];
  }
  window.APETE_BACKEND={
    configured,session,currentUser,profile,updateProfile,signUpCustomer,signIn,signOut,
    createOrder,myOrders,memberships,storeOrders,updateOrderStatus,submitMerchantApplication,
    updateStore,productsForStore,saveProduct,deleteProduct,statusToUi,statusToDb
  };
})();