'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const KEY = 'apete_serra_v14';
const REGIONAL_CITIES = ['Guaraciaba do Norte','Tianguá','São Benedito','Ubajara','Ibiapina','Viçosa do Ceará','Carnaubal','Croatá','Ipu'];

const money = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((cents || 0) / 100);
const dateTime = (iso) => new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const asset = (name) => `assets/images/${name}`;
const img = (tag, lock, w = 1200, h = 800) => asset('cover-casa.webp');

const STORES = [
  { id: 1, name: 'Casa do Baião', category: 'Comida regional', city: 'Guaraciaba do Norte', fee: 600, time: '28–40 min', rating: 4.9, open: true, producer: false, verified: true, panelPassword: '1234', officialRef: '@casadobaiao', cover: asset('cover-casa.webp'), desc: 'Pratos regionais, baião de dois, almoço executivo e combinações para compartilhar.', hero: 'Baião, galinha caipira e comida de casa com aquele tempero da Serra.' },
  { id: 2, name: 'Forno & Afeto', category: 'Padaria artesanal', city: 'Guaraciaba do Norte', fee: 450, time: '22–35 min', rating: 4.8, open: true, producer: false, verified: true, panelPassword: '1234', officialRef: '@fornoeafeto', cover: asset('cover-forno.webp'), desc: 'Pães, bolos, tapiocas, cafés e opções frescas para o café da manhã e da tarde.', hero: 'Pães quentinhos, bolos e café passado na hora.' },
  { id: 3, name: 'Quintal da Serra', category: 'Cozinha caseira', city: 'São Benedito', fee: 700, time: '32–48 min', rating: 4.7, open: true, producer: false, verified: true, panelPassword: '1234', officialRef: '@quintaldaserra', cover: asset('cover-quintal.webp'), desc: 'Comida caseira, marmitas, caldinhos e pratos bem servidos para o almoço ou jantar.', hero: 'Receitas caseiras e porções que lembram comida de família.' },
  { id: 4, name: 'Sítio Boa Vista', category: 'Produtor local', city: 'Guaraciaba do Norte', fee: 500, time: '30–45 min', rating: 4.9, open: true, producer: true, verified: true, panelPassword: '1234', officialRef: '@sitioboavista', cover: asset('cover-sitio.webp'), desc: 'Hortaliças, frutas e produtos artesanais colhidos na Serra e enviados com frescor.', hero: 'Frutas, verduras e produtos da roça direto para a sua mesa.' },
  { id: 5, name: 'Serra Verde Orgânicos', category: 'Produtor local', city: 'Ibiapina', fee: 550, time: '35–50 min', rating: 4.8, open: true, producer: true, verified: true, panelPassword: '1234', officialRef: '@serraverdeorganicos', cover: asset('cover-serraverde.webp'), desc: 'Cestas, legumes, mel e itens naturais de pequenos produtores da região.', hero: 'Orgânicos selecionados e cestas prontas para a semana.' }
];

const PRODUCTS = [
  { id: 1, storeId: 1, name: 'Baião da casa para dois', desc: 'Baião de dois, frango grelhado, macaxeira e salada.', cat: 'Regional', price: 6200, stock: 20, image: asset('prod-baiao.webp'), oldPrice: 0, lastBatch: false },
  { id: 2, storeId: 1, name: 'Galinha caipira com pirão', desc: 'Prato completo com arroz, pirão e salada da casa.', cat: 'Regional', price: 3600, stock: 14, image: asset('prod-galinha.webp'), oldPrice: 0, lastBatch: false },
  { id: 3, storeId: 1, name: 'Escondidinho de carne', desc: 'Purê de macaxeira, carne desfiada e queijo dourado.', cat: 'Regional', price: 3100, stock: 16, image: asset('prod-escondidinho.webp'), oldPrice: 3900, lastBatch: true },
  { id: 4, storeId: 1, name: 'Macaxeira dourada', desc: 'Porção crocante para compartilhar.', cat: 'Acompanhamentos', price: 1600, stock: 22, image: asset('prod-macaxeira.webp'), oldPrice: 0, lastBatch: false },
  { id: 5, storeId: 1, name: 'Suco de acerola', desc: 'Copo de 400 ml preparado na hora.', cat: 'Bebidas', price: 900, stock: 30, image: asset('prod-acerola.webp'), oldPrice: 1200, lastBatch: true },
  { id: 6, storeId: 2, name: 'Pão de fermentação lenta', desc: 'Pão artesanal de 400 g, casca crocante e miolo macio.', cat: 'Padaria', price: 1800, stock: 18, image: asset('prod-pao.webp'), oldPrice: 2400, lastBatch: true },
  { id: 7, storeId: 2, name: 'Bolo de milho caseiro', desc: 'Fatia generosa, fofinha e com gostinho de interior.', cat: 'Doces', price: 1500, stock: 20, image: asset('prod-bolo-milho.webp'), oldPrice: 0, lastBatch: false },
  { id: 8, storeId: 2, name: 'Tapioca com queijo coalho', desc: 'Tapioca recheada, feita na chapa e servida quentinha.', cat: 'Padaria', price: 1300, stock: 24, image: asset('prod-tapioca.webp'), oldPrice: 0, lastBatch: false },
  { id: 9, storeId: 2, name: 'Café coado', desc: 'Café passado na hora, copo de 200 ml.', cat: 'Bebidas', price: 600, stock: 35, image: asset('prod-cafe-coado.webp'), oldPrice: 0, lastBatch: false },
  { id: 10, storeId: 2, name: 'Combo café da manhã', desc: 'Pão, bolo de milho e café para começar bem o dia.', cat: 'Padaria', price: 2400, stock: 10, image: asset('prod-combo-cafe.webp'), oldPrice: 3200, lastBatch: true },
  { id: 11, storeId: 3, name: 'Prato da Serra', desc: 'Arroz, feijão, frango, legumes e salada.', cat: 'Caseiro', price: 2800, stock: 18, image: asset('prod-prato-serra.webp'), oldPrice: 0, lastBatch: false },
  { id: 12, storeId: 3, name: 'Caldinho de feijão', desc: 'Porção de 350 ml, ideal para o fim da tarde.', cat: 'Caseiro', price: 1500, stock: 20, image: asset('prod-caldinho.webp'), oldPrice: 0, lastBatch: false },
  { id: 13, storeId: 3, name: 'Almoço vegetariano', desc: 'Arroz, feijão verde, legumes e salada fresca.', cat: 'Vegetariano', price: 2600, stock: 16, image: asset('prod-almoco-veg.webp'), oldPrice: 0, lastBatch: false },
  { id: 14, storeId: 3, name: 'Panelada da Serra', desc: 'Prato forte e bem temperado, servido com arroz.', cat: 'Regional', price: 3400, stock: 8, image: asset('prod-panelada.webp'), oldPrice: 4300, lastBatch: true },
  { id: 15, storeId: 3, name: 'Suco de cajá', desc: 'Copo de 400 ml, preparado com fruta natural.', cat: 'Bebidas', price: 900, stock: 25, image: asset('prod-caja.webp'), oldPrice: 0, lastBatch: false },
  { id: 16, storeId: 4, name: 'Banana da estação', desc: 'Um quilo de bananas frescas da região.', cat: 'Do produtor', price: 700, stock: 30, image: asset('prod-banana.webp'), oldPrice: 0, lastBatch: false },
  { id: 17, storeId: 4, name: 'Café da Serra', desc: 'Café torrado e moído, pacote de 250 g.', cat: 'Do produtor', price: 2200, stock: 15, image: asset('prod-cafe-serra.webp'), oldPrice: 0, lastBatch: false },
  { id: 18, storeId: 4, name: 'Geleia de goiaba', desc: 'Pote artesanal de 250 g, produção local.', cat: 'Do produtor', price: 1700, stock: 14, image: asset('prod-geleia-goiaba.webp'), oldPrice: 0, lastBatch: false },
  { id: 19, storeId: 4, name: 'Cesta de hortaliças', desc: 'Mix com alface, tomate, coentro e cheiro-verde.', cat: 'Do produtor', price: 2900, stock: 10, image: asset('prod-cesta-hortalicas.webp'), oldPrice: 0, lastBatch: false },
  { id: 20, storeId: 4, name: 'Tomate da horta', desc: 'Tomates selecionados, vendidos por quilo.', cat: 'Do produtor', price: 1000, stock: 24, image: asset('prod-tomate.webp'), oldPrice: 0, lastBatch: false },
  { id: 21, storeId: 5, name: 'Cesta orgânica semanal', desc: 'Legumes e verduras da semana, pronta para a família.', cat: 'Do produtor', price: 3900, stock: 8, image: asset('prod-cesta-organica.webp'), oldPrice: 0, lastBatch: false },
  { id: 22, storeId: 5, name: 'Mel da região', desc: 'Pote de mel puro com 300 g.', cat: 'Do produtor', price: 2000, stock: 16, image: asset('prod-mel.webp'), oldPrice: 0, lastBatch: false },
  { id: 23, storeId: 5, name: 'Alface crespa', desc: 'Maço fresco, colhido no dia.', cat: 'Do produtor', price: 500, stock: 30, image: asset('prod-alface.webp'), oldPrice: 0, lastBatch: false },
  { id: 24, storeId: 5, name: 'Cenoura orgânica', desc: 'Pacote com 500 g de cenouras selecionadas.', cat: 'Do produtor', price: 800, stock: 25, image: asset('prod-cenoura.webp'), oldPrice: 0, lastBatch: false },
  { id: 25, storeId: 5, name: 'Queijo coalho artesanal', desc: 'Peça de 250 g produzida na região.', cat: 'Do produtor', price: 1800, stock: 12, image: asset('prod-queijo-coalho.webp'), oldPrice: 0, lastBatch: false }
];


// Pedidos ilustrativos para a apresentação: separados dos pedidos feitos no navegador.
// Dois pedidos por etapa para cada um dos cinco perfis (inclusive produtores).
const DEMO_TEMPLATES = {
  1: [
    {ids:[1,5], qty:[1,2], note:'Sem cebola no baião; mandar o suco bem gelado.', address:'Rua das Flores, 12', neighborhood:'Centro'},
    {ids:[2,4], qty:[1,1], note:'Separar o pirão da galinha e enviar talheres.', address:'Rua da Feira, 24', neighborhood:'Santa Luzia'},
    {ids:[3,5], qty:[2,1], note:'Deixar o escondidinho bem dourado; ligar ao chegar.', address:'Rua do Mercado, 36', neighborhood:'Centro'},
    {ids:[1,4], qty:[1,2], note:'Mandar a salada em embalagem separada.', address:'Rua do Sol, 48', neighborhood:'Alto da Boa Vista'}
  ],
  2: [
    {ids:[6,9], qty:[1,2], note:'Cortar o pão em fatias; café sem açúcar.', address:'Rua do Mercado, 21', neighborhood:'Centro'},
    {ids:[8,7], qty:[2,1], note:'Tapiocas com queijo bem derretido e bolo em embalagem separada.', address:'Rua das Flores, 33', neighborhood:'Santa Luzia'},
    {ids:[10,9], qty:[1,1], note:'Café bem quente; deixar com a portaria.', address:'Rua da Praça, 16', neighborhood:'Centro'},
    {ids:[6,7], qty:[2,2], note:'Embalar os pães separados dos bolos.', address:'Rua do Sol, 53', neighborhood:'São José'}
  ],
  3: [
    {ids:[11,15], qty:[1,1], note:'Arroz e feijão em potes separados; suco sem gelo.', address:'Rua da Serra, 17', neighborhood:'Centro'},
    {ids:[13,12], qty:[1,2], note:'Refeição vegetariana sem queijo; identificar os potes.', address:'Rua das Acácias, 29', neighborhood:'Planalto'},
    {ids:[14,15], qty:[1,1], note:'Mandar a panelada com pouca pimenta.', address:'Rua da Praça, 31', neighborhood:'Centro'},
    {ids:[11,12], qty:[2,1], note:'Enviar colher para o caldinho e dividir em duas embalagens.', address:'Rua das Palmeiras, 46', neighborhood:'São José'}
  ],
  4: [
    {ids:[16,19], qty:[2,1], note:'Bananas mais maduras; se possível, alface bem fresquinha.', address:'Rua do Campo, 14', neighborhood:'Centro'},
    {ids:[17,18], qty:[1,2], note:'Geleia bem embalada para não vazar; café moído fino.', address:'Rua das Flores, 27', neighborhood:'Santa Luzia'},
    {ids:[19,20], qty:[1,2], note:'Preferência por tomates mais firmes.', address:'Rua da Feira, 39', neighborhood:'Centro'},
    {ids:[16,20], qty:[3,1], note:'Deixar na recepção e avisar pelo telefone.', address:'Rua do Sol, 51', neighborhood:'Planalto'}
  ],
  5: [
    {ids:[21,22], qty:[1,1], note:'Cesta com folhas bem selecionadas; mel embalado à parte.', address:'Rua da Serra, 18', neighborhood:'Centro'},
    {ids:[23,24], qty:[3,2], note:'Alfaces grandes, cenouras sem machucados.', address:'Rua do Mercado, 30', neighborhood:'São José'},
    {ids:[25,22], qty:[1,1], note:'Queijo em embalagem térmica; tocar a campainha.', address:'Rua da Praça, 42', neighborhood:'Centro'},
    {ids:[21,24], qty:[1,2], note:'Trocar folhas murchas, se houver; entregar no período da tarde.', address:'Rua das Palmeiras, 54', neighborhood:'Planalto'}
  ]
};
function makeDemoOrders() {
  const statuses=['pendente','preparando','pronto','concluido'];
  const names=['Ana Lima','Bruno Alves','Camila Sousa','Diego Rocha','Elisa Martins','Felipe Costa','Gabi Melo','Hugo Silva'];
  const orders=[];
  for(const store of STORES){
    for(let stage=0;stage<statuses.length;stage++){
      for(let sequence=0;sequence<2;sequence++){
        const index=stage*2+sequence;
        const template=DEMO_TEMPLATES[store.id][index%4];
        const items=template.ids.map((id,i)=>{
          const product=PRODUCTS.find(p=>p.id===id);
          return {productId:id,name:product.name,price:product.price,qty:template.qty[i]};
        });
        const subtotal=items.reduce((sum,item)=>sum+item.price*item.qty,0);
        orders.push({
          id:1000+store.id*100+index+1, demo:true, storeId:store.id,
          createdAt:new Date(Date.now()-(stage*4+sequence+1)*60*60*1000).toISOString(),
          status:statuses[stage],items,subtotal,deliveryFee:store.fee,total:subtotal+store.fee,
          paymentLabel:index%2?'Cartão na entrega (exemplo)':'Pix (exemplo)',
          note:template.note,
          customer:{name:names[(store.id+index)%names.length]+' (exemplo)',phone:'(88) 90000-0000',address:'Endereço fictício: '+template.address,neighborhood:template.neighborhood}
        });
      }
    }
  }
  return orders;
}

// Pedidos novos de apresentação: +2 aguardando aceite em CADA perfil.
// IDs novos garantem que o histórico salvo no navegador não seja apagado.
const EXTRA_PENDING_TEMPLATES = {
  1: [
    {ids:[1,3,5],qty:[1,1,2],note:'Cliente pediu o baião sem cebola, escondidinho separado e dois sucos sem gelo.',address:'Rua da Igreja, 72',neighborhood:'Centro'},
    {ids:[2,4],qty:[2,1],note:'Duas galinhas caipiras: pirão em potes separados e macaxeira bem crocante.',address:'Rua das Palmeiras, 81',neighborhood:'São José'}
  ],
  2: [
    {ids:[6,7,9],qty:[2,1,2],note:'Pães fatiados, bolo sem cobertura e cafés sem açúcar, por favor.',address:'Rua do Comércio, 44',neighborhood:'Centro'},
    {ids:[8,10],qty:[2,1],note:'Tapioca com pouco queijo e combo embalado em sacola separada.',address:'Rua dos Girassóis, 19',neighborhood:'Santa Luzia'}
  ],
  3: [
    {ids:[11,12],qty:[2,1],note:'Separar feijão do arroz em ambas as marmitas e mandar uma colher para o caldinho.',address:'Rua da Serra, 62',neighborhood:'Centro'},
    {ids:[13,15],qty:[1,2],note:'Almoço vegetariano sem queijo; dois sucos de cajá sem açúcar.',address:'Rua da Paz, 91',neighborhood:'Planalto'}
  ],
  4: [
    {ids:[16,19,20],qty:[2,1,1],note:'Escolher bananas maduras, tomates mais firmes e deixar a cesta bem fechada.',address:'Rua do Campo, 63',neighborhood:'Centro'},
    {ids:[17,18],qty:[1,2],note:'Geleia de goiaba em dois potes protegidos e café moído para coador.',address:'Rua das Flores, 85',neighborhood:'Santa Luzia'}
  ],
  5: [
    {ids:[21,23,24],qty:[1,2,1],note:'Selecionar alfaces grandes, cenouras firmes e cesta com bastante variedade.',address:'Rua do Açude, 28',neighborhood:'Centro'},
    {ids:[22,25],qty:[2,1],note:'Dois potes de mel separados e queijo coalho conservado em embalagem térmica.',address:'Rua da Feira, 57',neighborhood:'São José'}
  ]
};
function extraPendingOrders() {
  const names=['Rafaela Monteiro','Lucas Ferreira','Marina Oliveira','João Vitor','Beatriz Carvalho','Pedro Ribeiro','Natália Sousa','André Martins','Lara Araújo','Caio Nunes'];
  return STORES.flatMap(store=>EXTRA_PENDING_TEMPLATES[store.id].map((sample,index)=>{
    const items=sample.ids.map((id,i)=>{
      const p=PRODUCTS.find(p=>p.id===id);
      return {productId:id,name:p.name,price:p.price,qty:sample.qty[i]};
    });
    const subtotal=items.reduce((sum,item)=>sum+item.price*item.qty,0);
    return {
      id:6000+store.id*100+index+1,demo:true,storeId:store.id,
      createdAt:new Date(Date.now()-(index+1)*12*60*1000).toISOString(),status:'pendente',
      items,subtotal,deliveryFee:store.fee,total:subtotal+store.fee,
      paymentLabel:index?'Cartão na entrega (exemplo)':'Pix (exemplo)',
      note:sample.note,
      customer:{name:names[(store.id-1)*2+index]+' (exemplo)',phone:'(88) 90000-0000',address:'Endereço fictício: '+sample.address,neighborhood:sample.neighborhood}
    };
  }));
}

const PAGE_TITLES = {
  inicio: 'Início',
  estabelecimentos: 'Estabelecimentos',
  cardapio: 'Cardápio',
  fornada: 'Última Fornada',
  produtores: 'Do produtor',
  sabia: 'Sabiá',
  pedidos: 'Meus pedidos',
  entrar: 'Entrar',
  cliente: 'Minha conta',
  comerciante: 'Painel do comerciante',
  loja: 'Perfil'
};

function initialState() {
  return {
    stores: JSON.parse(JSON.stringify(STORES)),
    products: JSON.parse(JSON.stringify(PRODUCTS)),
    cart: [],
    orders: [],
    demoOrders: makeDemoOrders(),
    customer: { logged: false, name: '', email: '', phone: '', address: '', neighborhood: '', password: '' },
    merchant: { logged: false, owner: '', storeId: 1, phone: '', email: '', password: '', document: '', officialProof: '', verified: false },
    location: '',
    page: 'inicio',
    storeViewId: 1,
    filters: { query: '', category: 'Todos', storeId: '0', sort: 'relevancia' },
    ui: { accountTab: 'entrar', accountRole: 'cliente', merchantAuthTab: 'entrar', merchantPanelTab: 'pendentes', presentationMerchant: false, productEditor: 0 },
    sabiaContext: {budget: null, people: 1, preference: '', exclude: [], storeId: 0},
    chat: [{ me: false, text: 'Oi! Sou a Sabiá. Posso te ajudar com produtos, preços, Última Fornada, produtores e sugestões do cardápio.' }]
  };
}

let state;
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem('apete_serra_v13') || 'null');
  state = saved?.products?.length ? saved : initialState();
  for (const fresh of PRODUCTS) {
    const item = state.products.find((p) => p.id === fresh.id);
    if (item && (!item.image || /^https?:/i.test(item.image))) item.image = fresh.image;
  }
  for (const fresh of STORES) {
    const item = state.stores.find((s) => s.id === fresh.id);
    if (item) {
      item.cover = fresh.cover;
      item.verified = fresh.verified;
      item.panelPassword = item.panelPassword || fresh.panelPassword;
      item.officialRef = item.officialRef || fresh.officialRef;
    }
  }
  if (!Array.isArray(state.demoOrders)) state.demoOrders = makeDemoOrders();
  // Não reinicia pedidos que já foram aceitos ou concluídos em versões anteriores.
  const savedDemoIds = new Set(state.demoOrders.map(order => order.id));
  for (const order of extraPendingOrders()) {
    if (!savedDemoIds.has(order.id)) state.demoOrders.push(order);
  }
  state.ui = { ...initialState().ui, ...(state.ui || {}), orderSuccessId: state.ui?.orderSuccessId || null };
  state.ui.presentationMerchant = false; // temporary presentation view is not an authenticated login
  state.sabiaContext = { ...initialState().sabiaContext, ...(state.sabiaContext || {}) };
  if (!state.chat?.length || !state.sabiaChatV13) {state.chat=initialState().chat; state.sabiaChatV13=true;}
  // Invalid test accounts from earlier versions should not appear as signed in.
  if (!state.customer || !/^[A-Za-zÀ-ÿ' ]{2,}$/.test(String(state.customer.name||'').trim())
      || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(state.customer.email||''))
      || String(state.customer.phone||'').replace(/\D/g,'').length < 10
      || !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(String(state.customer.password||''))) {
    state.customer = initialState().customer;
  }
} catch {
  state = initialState();
}

// Authentication lives in separate HTML documents, not in the customer profile view.
// Visão de vídeo: um cliente ilustrativo pronto sem preencher login.
// Este perfil não representa autenticação real; a conta cadastrada é preservada.
const VIDEO_CUSTOMER = Object.freeze({
  logged:true, name:'Cliente APETÊ', email:'cliente.apete@exemplo.com',
  phone:'88999990000', address:'Rua das Flores, 15', neighborhood:'Centro',
  password:'DemoAPETE2026', demo:true
});
const AUTH_ROUTES = {
  entrar: 'entrar.html', cadastro: 'cadastro.html',
  'comerciante-entrar': 'comerciante-entrar.html',
  'comerciante-cadastro': 'comerciante-cadastro.html'
};
const documentName = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
const AUTH_PAGE = Object.entries(AUTH_ROUTES).find(([,file]) => file === documentName)?.[0] || null;
if (AUTH_PAGE) {
  state.page = AUTH_PAGE;
  if (AUTH_PAGE === 'cadastro') state.ui.accountTab = 'cadastro';
  if (AUTH_PAGE === 'entrar') state.ui.accountTab = 'entrar';
  if (AUTH_PAGE === 'comerciante-cadastro') state.ui.merchantAuthTab = 'cadastro';
  if (AUTH_PAGE === 'comerciante-entrar') state.ui.merchantAuthTab = 'entrar';
} else {
  const pageFromHash = location.hash.replace(/^#/, '');
  state.page = ['inicio','estabelecimentos','cardapio','fornada','produtores','sabia','pedidos','cliente','comerciante','loja'].includes(pageFromHash)
    ? pageFromHash
    : (!state.page || AUTH_ROUTES[state.page] ? 'inicio' : state.page);
  if (state.page === 'cliente' && !state.customer.logged) state.page = 'inicio';
  if (state.page === 'comerciante' && !state.merchant.logged) state.page = 'inicio';
}
let cartStep = 'cart';
let selectedPayment = 'pix';
let toastTimer;
let locating = false;
let sabiaBusy = false;
let sabiaResearch = false;
let sabiaMode = 'checking';
let sabiaStatusMessage = 'Verificando a conexão com o servidor…';
let sabiaChat = [];
let sabiaSession = null;
let sabiaError = '';
let sabiaRetryAfter = 0;
let sabiaLastQuestion = '';
let sabiaDraft = '';
let sabiaPendingProduct = null;
let sabiaSessionPromise = null;
state.city = REGIONAL_CITIES.includes(state.city) ? state.city : 'Guaraciaba do Norte';

const getStore = (id) => state.stores.find((item) => item.id === Number(id));
const getProduct = (id) => state.products.find((item) => item.id === Number(id));
const activeMerchantStore = () => getStore(state.merchant.storeId || 1);
const isCustomerLogged = () => Boolean(state.customer.logged && state.customer.phone);
const isMerchantLogged = () => Boolean(state.merchant.logged && state.merchant.storeId);
const merchantAccess = () => isMerchantLogged() || (state.ui.presentationMerchant && !AUTH_PAGE);
const isMerchantView = () => state.page === 'comerciante' && merchantAccess();

function prepareClientForVideo() {
  state.ui.presentationMerchant = false;
  // Ativar apenas pelo seletor de apresentação, nunca usar a senha da conta real.
  if (!isCustomerLogged()) {
    if (state.customer && !state.customer.demo && state.customer.password) {
      state.ui.savedCustomerBeforeDemo = {...state.customer};
    }
    state.customer = {...VIDEO_CUSTOMER};
  }
  save();
}
// Na abertura da vitrine para gravação, mostrar Minha conta, mantendo os
// arquivos entrar.html e cadastro.html para quem desejar usar o fluxo comum.
if (!AUTH_PAGE && !isCustomerLogged() && !state.ui.demoOptOut && !state.customer?.password) {
  prepareClientForVideo();
}

// Direct links to login should open the existing account when already signed in.
if (AUTH_PAGE === 'entrar' || AUTH_PAGE === 'cadastro') {
  if (isCustomerLogged()) location.replace('index.html#cliente');
}

function save() { localStorage.setItem(KEY, JSON.stringify({...state,chat:[]})); }
function toast(message, tone = 'normal') {
  const el = $('#toast');
  el.textContent = message;
  el.classList.toggle('success', tone === 'success');
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.classList.remove('show', 'success'); }, tone === 'success' ? 4900 : 2600);
}

function fallbackImage(label, mode = 'food') {
  const pal = { food:['#D68044','#FFF3E7'], producer:['#52785a','#eef6ef'], store:['#174d40','#eff7f3'] }[mode] || ['#D68044','#FFF3E7'];
  const text = encodeURIComponent(label || 'APETÊ');
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 640'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='${pal[0]}'/><stop offset='1' stop-color='${pal[1]}'/></linearGradient></defs><rect width='960' height='640' rx='28' fill='url(%23g)'/><text x='50%25' y='48%25' text-anchor='middle' fill='white' font-size='60' font-family='Arial' font-weight='700'>${text}</text><text x='50%25' y='58%25' text-anchor='middle' fill='white' font-size='24' font-family='Arial'>Imagem de apoio</text></svg>`;
}

function imgTag(src, alt, mode='food') {
  return `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${fallbackImage(alt, mode)}'">`;
}

function pageHead(title, desc) {
  return `<div class="page-head"><h2>${title}</h2><p>${desc}</p></div>`;
}

function verifiedBadge() {
  return '';
}

function instagramHandle(value) {
  const handle=String(value||'').trim().replace(/^https?:\/\/(?:www\.)?instagram\.com\//i,'').replace(/^@/,'').replace(/\/.*$/,'');
  return /^[a-zA-Z0-9._]{1,30}$/.test(handle) ? handle : '';
}
function instagramBadge(store) {
  const handle=instagramHandle(store.instagram || store.officialRef);
  if(!handle) return '';
  const label=`Instagram: @${handle}`;
  // Seed profiles are fictional. Do not link an unverified example account to a real person.
  return store.instagram ? `<a class="instagram-badge" href="https://www.instagram.com/${encodeURIComponent(handle)}/" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${esc(label)}">${esc(label)} ↗</a>` : `<span class="instagram-badge">${esc(label)}</span>`;
}


function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d{0,4})(\d{0,4})/, (_, a, b, c) => [a && `(${a})`, b, c && `-${c}`].filter(Boolean).join(' ')).trim();
  return digits.replace(/(\d{2})(\d{0,5})(\d{0,4})/, (_, a, b, c) => [a && `(${a})`, b, c && `-${c}`].filter(Boolean).join(' ')).trim();
}
function onlyDigits(value) { return String(value || '').replace(/\D/g, ''); }
function validCustomerName(value) { return /^[A-Za-zÀ-ÿ' ]{2,}$/.test(String(value || '').trim()); }
function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim()); }
function strongPassword(value) { return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(String(value || '')); }

function setPage(next, storeId = null) {
  closeModal();
  closeSidebar();
  if (isCustomerLogged() && (next === 'entrar' || next === 'cadastro')) next = 'cliente';
  if (isMerchantLogged() && (next === 'comerciante-entrar' || next === 'comerciante-cadastro')) next = 'comerciante';
  if (AUTH_ROUTES[next]) {
    location.assign(AUTH_ROUTES[next]);
    return;
  }
  if (next === 'cliente' && !isCustomerLogged()) {
    location.assign(AUTH_ROUTES.entrar);
    return;
  }
  if (next === 'comerciante' && !merchantAccess()) {
    location.assign(AUTH_ROUTES['comerciante-entrar']);
    return;
  }
  if (next !== 'pedidos') state.ui.orderSuccessId = null;
  state.page = next;
  if (storeId) state.storeViewId = Number(storeId);
  save();
  if (AUTH_PAGE) {
    location.assign(`index.html#${encodeURIComponent(next)}`);
    return;
  }
  if (location.hash !== `#${next}`) history.replaceState(null, '', `#${next}`);
  render();
  if(next==='sabia')detectSabiaMode();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function closeSidebar() {
  $('#sidebar').classList.remove('is-open');
  $('#scrim').hidden = true;
}
function openSidebar() {
  $('#sidebar').classList.add('is-open');
  $('#scrim').hidden = false;
}
function closeModal() {
  $('#modal').hidden = true;
  $('#modal').classList.remove('is-open');
  $('#modal-body').innerHTML = '';
}
function openModal(title, html) {
  $('#modal-title').textContent = title;
  $('#modal-body').innerHTML = html;
  $('#modal').hidden = false;
  requestAnimationFrame(() => $('#modal').classList.add('is-open'));
}

function productCard(product) {
  const store = getStore(product.storeId);
  return `
    <article class="product-card ${store.producer ? 'producer-tone' : 'merchant-tone'}">
      <div class="product-image">
        ${imgTag(product.image, product.name, store.producer ? 'producer' : 'food')}
        <div class="image-top-row">
          <span class="chip dark">${esc(product.cat)}</span>
          ${product.lastBatch ? '<span class="chip plum">Oferta</span>' : ''}
        </div>
      </div>
      <div class="product-body">
        <div class="store-line"><span class="store-dot"></span><small>${esc(store.name)}</small><span class="subtle">${esc(store.city)}</span></div>
        <h3>${esc(product.name)}</h3>
        <p>${esc(product.desc)}</p>
        <div class="price-line"><strong>${money(product.price)}</strong>${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ''}<span class="subtle">${product.stock} disponíveis</span></div>
        <div class="product-foot">
          ${isMerchantView() ? `<button class="profile-btn" data-action="edit-product" data-id="${product.id}">Editar produto</button><span class="chip ${product.lastBatch?'orange':'soft'}">${product.lastBatch?'Última Fornada':'No cardápio'}</span>` : `${state.page==='loja' && Number(state.storeViewId)===store.id ? `<span class="product-profile-context">${esc(store.name)} · ${esc(store.city)}</span>` : `<button class="profile-btn" data-action="goto-store" data-id="${store.id}">Ver perfil</button>`}<button class="add-btn" data-action="add-cart" data-id="${product.id}" aria-label="Adicionar à sacola">+</button>`}
        </div>
      </div>
    </article>
  `;
}

function offerCard(product) {
  return `<article class="offer-card"><div><strong>${esc(product.name)}</strong><p>${money(product.price)} ${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ''}</p></div><button class="ghost-btn strong" data-action="add-cart" data-id="${product.id}">Pegar</button></article>`;
}

function storeCard(store) {
  const items = state.products.filter((product) => product.storeId === store.id).slice(0, 3).map((product) => `
    <div class="mini-product">
      <div class="mini-thumb">${imgTag(product.image, product.name, 'food')}</div>
      <span>${esc(product.name)}</span>
    </div>`).join('');
  return `
    <article class="store-card merchant-tone">
      <div class="store-cover">
        ${imgTag(store.cover, store.name, 'store')}
        <div class="cover-overlay"></div>
        <div class="cover-copy">
          <span class="cover-kicker">${esc(store.category)}</span>
          <h4>${esc(store.name)}</h4>
          <div class="cover-meta"><span>${esc(store.city)}</span><span>★ ${store.rating.toFixed(1)}</span><span>${esc(store.time)}</span></div>
        </div>
      </div>
      <div class="store-body">
        <div class="chip-row"><span class="chip orange">${store.open ? 'Aberto agora' : 'Fechado'}</span><span class="chip soft">Entrega ${money(store.fee)}</span></div>
        <p>${esc(store.desc)}</p>
        <div class="fact-row">${instagramBadge(store)}<span>${esc(store.city)}</span></div>
        <div class="mini-products-row">${items}</div>
        <div class="row" style="margin-top:16px"><button class="primary-btn" data-action="goto-store" data-id="${store.id}">Ver cardápio</button><button class="ghost-btn strong" data-action="filter-store" data-id="${store.id}">Filtrar no catálogo</button></div>
      </div>
    </article>
  `;
}

function producerCard(store) {
  const products = state.products.filter((product) => product.storeId === store.id).slice(0, 5).map((product) => `
    <li>
      <div class="producer-item-main">
        <div class="mini-thumb round">${imgTag(product.image, product.name, 'producer')}</div>
        <div><strong>${esc(product.name)}</strong><small>${esc(product.desc)}</small></div>
      </div>
      <span>${money(product.price)}</span>
    </li>`).join('');
  return `
    <article class="producer-card producer-tone">
      <div class="producer-cover">
        ${imgTag(store.cover, store.name, 'producer')}
        <div class="cover-overlay producer"></div>
        <div class="cover-copy">
          <span class="cover-kicker">${esc(store.category)}</span>
          <h4>${esc(store.name)}</h4>
          <div class="cover-meta"><span>${esc(store.city)}</span><span>${esc(store.time)}</span></div>
        </div>
      </div>
      <div class="producer-body">
        <div class="chip-row"><span class="chip soft producer-chip">Colheita local</span><span class="chip producer-alt">Entrega ${money(store.fee)}</span></div>
        <p>${esc(store.desc)}</p>
        <ul class="kv producer-list with-thumbs">${products}</ul>
        <div class="row" style="margin-top:16px"><button class="primary-btn producer-btn" data-action="goto-store" data-id="${store.id}">Ver produtos</button></div>
      </div>
    </article>
  `;
}

function orderCard(order, merchantView = false) {
  const store = getStore(order.storeId);
  const statusLabel = { pendente: 'Pendente', preparando: 'Em preparo', pronto: 'Pronto', concluido: 'Concluído', cancelado: 'Cancelado' }[order.status] || order.status;
  return `
    <article class="order-card">
      <div class="order-body">
        <div class="order-top"><div><div class="order-title-line"><h3>Pedido #${String(order.id).padStart(3, '0')} · ${esc(store?.name || '')}</h3>${order.demo ? '<span class="demo-order-badge">Exemplo</span>' : '<span class="live-order-badge">Pedido do cliente</span>'}</div><p>${dateTime(order.createdAt)}</p></div><span class="status ${order.status}">${statusLabel}</span></div>
        <div class="order-items"><ul>${order.items.map((item) => `<li><span>${item.qty}x ${esc(item.name)}</span><strong>${money(item.qty * item.price)}</strong></li>`).join('')}</ul></div>
        <div class="order-detail-grid">
          <div class="order-detail"><b>Cliente</b><span>${esc(order.customer.name)}<br>${esc(order.customer.phone)}</span></div>
          <div class="order-detail"><b>Pagamento</b><span>${esc(order.paymentLabel)}</span></div>
          <div class="order-detail"><b>Endereço</b><span>${esc(order.customer.address)}${order.customer.neighborhood ? `<br>${esc(order.customer.neighborhood)}` : ''}</span></div>
          <div class="order-detail"><b>Total</b><span>${money(order.total)} · entrega ${money(order.deliveryFee)}</span></div>
        </div>
        <div class="customer-instructions"><strong>Observações do cliente</strong><p>${esc(order.note?.trim() || 'Nenhuma observação informada.')}</p></div>
        ${merchantView ? `<div class="order-steps" aria-label="Andamento do pedido">${['pendente','preparando','pronto','concluido'].map((step,i)=>`<span class="order-step ${['pendente','preparando','pronto','concluido'].indexOf(order.status)>=i?'done':''} ${order.status===step?'current':''}">${i+1}. ${['Recebido','Em preparo','Pronto','Concluído'][i]}</span>`).join('')}</div><div class="row" style="margin-top:14px">${merchantActions(order)}</div>` : ''}
      </div>
    </article>
  `;
}

function merchantActions(order) {
  if (order.status === 'pendente') return `<button class="primary-btn" data-action="advance-order" data-id="${order.id}">Aceitar pedido</button><button class="ghost-btn strong" data-action="cancel-order" data-id="${order.id}">Recusar</button>`;
  if (order.status === 'preparando') return `<button class="primary-btn" data-action="advance-order" data-id="${order.id}">Marcar como pronto</button>`;
  if (order.status === 'pronto') return `<button class="primary-btn" data-action="advance-order" data-id="${order.id}">Concluir pedido</button>`;
  return '';
}

function homePage() {
  const stores = state.stores.filter((store) => !store.producer);
  const producers = state.stores.filter((store) => store.producer);
  const featured = state.products.filter((product) => !product.lastBatch).slice(0, 6);
  const offers = state.products.filter((product) => product.lastBatch).slice(0, 5);
  const heroImage = asset('cover-casa.webp');
  return `
    ${pageHead('Peça sem complicação', 'Escolha seu próximo pedido entre os restaurantes, padarias e produtores da região.')}
    <section class="hero-mini home-hero-alt">
      <article class="hero-card">${imgTag(heroImage, 'Destaque APETÊ', 'store')}<div class="hero-copy"><h2>Escolha onde pedir hoje.</h2><p>Explore o cardápio, entre na sua conta só quando precisar comprar e acompanhe seus pedidos sem enrolação.</p><div class="hero-actions"><button class="primary-btn" data-action="go-page" data-page="cardapio">Explorar cardápio</button><button class="ghost-btn strong" data-action="go-page" data-page="estabelecimentos">Ver perfis</button></div></div></article>
      <article class="hero-panel">
        <h3>O que você encontra aqui</h3>
        <p>Três atalhos realmente úteis para começar mais rápido.</p>
        <div class="quick-list">
          <div class="quick-pill"><div><strong>Entrega local</strong><small>Restaurantes, padaria e produtores da região</small></div><span>→</span></div>
          <div class="quick-pill"><div><strong>Pagamento por Pix ou cartão</strong><small>Finalize o pedido do jeito que for melhor para você</small></div><span>→</span></div>
          <div class="quick-pill"><div><strong>Acompanhe seus pedidos</strong><small>Entre na conta para revisar e acompanhar tudo</small></div><span>→</span></div>
        </div>
      </article>
    </section>
    <section class="home-calls">
      <article class="call-card warm-card"><h3>Última Fornada</h3><p>Pães e refeições do dia com desconto: aproveite o que ainda está fresquinho e ajude a evitar desperdício.</p><div class="offer-grid compact-offers">${offers.slice(0,3).map(offerCard).join('')}</div></article>
      <article class="call-card merchant-tone"><span class="chip soft">Comerciantes</span><h3>Peça refeições e lanches</h3><p>Perfis com cardápio, tempo de entrega e itens em destaque.</p><button class="ghost-btn strong" data-action="go-page" data-page="estabelecimentos">Abrir estabelecimentos</button></article>
      <article class="call-card producer-tone"><span class="chip producer-alt">Produtores</span><h3>Compre direto de quem produz</h3><p>Hortaliças, cestas, mel e outros itens locais com entrega.</p><button class="ghost-btn strong" data-action="go-page" data-page="produtores">Ver produtores</button></article>

    </section>
    <section style="margin-bottom:24px"><div class="section-head"><div><h3>Estabelecimentos em destaque</h3><p>Três perfis para pedir almoço, lanche ou café.</p></div><button class="section-link" data-action="go-page" data-page="estabelecimentos">Ver todos</button></div><div class="store-grid">${stores.map(storeCard).join('')}</div></section>
    <section style="margin-bottom:24px"><div class="section-head"><div><h3>Do produtor para sua mesa</h3><p>Dois perfis com produtos frescos e itens artesanais.</p></div><button class="section-link" data-action="go-page" data-page="produtores">Abrir seção</button></div><div class="producer-grid">${producers.map(producerCard).join('')}</div></section>
    <section style="margin-bottom:24px"><div class="section-head"><div><h3>Produtos em destaque</h3><p>Escolha seu próximo favorito e adicione à sacola.</p></div><button class="section-link" data-action="go-page" data-page="cardapio">Abrir catálogo</button></div><div class="product-grid">${featured.map(productCard).join('')}</div></section>
  `;
}

function storesPage() {
  const merchants = state.stores.filter((store) => !store.producer);
  const producers = state.stores.filter((store) => store.producer);
  return `${pageHead('Estabelecimentos', 'Explore restaurantes, padaria e produtores da região.')}<section style="margin-bottom:24px"><div class="section-head"><div><h3>Comerciantes</h3><p>Restaurantes e padaria com capa própria e miniaturas dos itens.</p></div></div><div class="store-grid">${merchants.map(storeCard).join('')}</div></section><section><div class="section-head"><div><h3>Produtores locais</h3><p>Perfis em cor diferente, com lista de produtos e miniaturas.</p></div></div><div class="producer-grid">${producers.map(producerCard).join('')}</div></section>`;
}

function menuFilters() {
  const storeOptions = ['<option value="0">Todos os perfis</option>'].concat(state.stores.map((store) => `<option value="${store.id}" ${String(store.id) === state.filters.storeId ? 'selected' : ''}>${esc(store.name)}</option>`)).join('');
  const categories = ['Todos', ...new Set(state.products.map((item) => item.cat))];
  return `
    <section class="filter-box">
      <div class="field"><label>Buscar</label><input id="filter-query" class="input" placeholder="Ex.: baião, café, cesta" value="${esc(state.filters.query)}"></div>
      <div class="field"><label>Categoria</label><select id="filter-category" class="select">${categories.map((category) => `<option value="${esc(category)}" ${state.filters.category === category ? 'selected' : ''}>${esc(category)}</option>`).join('')}</select></div>
      <div class="field"><label>Perfil</label><select id="filter-store" class="select">${storeOptions}</select></div>
      <div class="field"><label>Ordenar</label><select id="filter-sort" class="select"><option value="relevancia" ${state.filters.sort === 'relevancia' ? 'selected' : ''}>Relevância</option><option value="preco-menor" ${state.filters.sort === 'preco-menor' ? 'selected' : ''}>Menor preço</option><option value="preco-maior" ${state.filters.sort === 'preco-maior' ? 'selected' : ''}>Maior preço</option></select></div>
    </section>`;
}

function filteredProducts() {
  let items = [...state.products];
  if (state.filters.query) {
    const q = state.filters.query.toLowerCase();
    items = items.filter((item) => `${item.name} ${item.desc}`.toLowerCase().includes(q));
  }
  if (state.filters.category !== 'Todos') items = items.filter((item) => item.cat === state.filters.category);
  if (state.filters.storeId !== '0') items = items.filter((item) => String(item.storeId) === state.filters.storeId);
  if (state.filters.sort === 'preco-menor') items.sort((a,b) => a.price - b.price);
  if (state.filters.sort === 'preco-maior') items.sort((a,b) => b.price - a.price);
  return items;
}

function catalogPage() {
  const items = filteredProducts();
  return `${pageHead('Cardápio', 'Catálogo com filtros, botões mais legíveis e perfis dos empreendimentos.')}${menuFilters()}<div class="product-grid">${items.map(productCard).join('')}</div>`;
}

function lastBatchPage() {
  const items = state.products.filter((item) => item.lastBatch);
  return `${pageHead('Última Fornada', 'Alimentos preparados hoje, ainda fresquinhos, oferecidos com desconto para evitar desperdício. Confira as ofertas enquanto durarem.')}<div class="product-grid">${items.map(productCard).join('')}</div>`;
}

function producersPage() {
  const items = state.stores.filter((store) => store.producer);
  return `${pageHead('Do produtor', 'Frutas, verduras e produtos feitos por quem vive e produz na região.')}<div class="producer-grid">${items.map(producerCard).join('')}</div>`;
}

function renderSabiaHistory() {
  if (!sabiaChat.length) return '<div class="chat-bubble system-message"><b>Bem-vindo à Sabiá</b><p>Pergunte sobre alimentação, produtos e comércio da Serra. As respostas da IA aparecem aqui. Os dados do catálogo são demonstrativos.</p></div>';
  return sabiaChat.map((entry,index) => `<div class="chat-bubble ${entry.role==='user'?'me':''}">
    <div>${esc(entry.content).replace(/\n/g,'<br>')}</div>
    ${entry.products?.length ? `<div class="sabia-results">${entry.products.map(p=>{
      const image = getProduct(p.id)?.image;
      return `<article class="sabia-product-card">
        <div class="sabia-result"><span class="mini-thumb">${image?imgTag(image,p.name):''}</span><span><b>${esc(p.name)}</b><small>${esc(p.storeName)} · ${esc(p.city)}</small><small>Preço unitário: ${money(p.price)}</small></span></div>
        <p class="note">${p.recommendation?`${p.quantity} unidade(s) · porção cadastrada para ${p.servesTotal} pessoa(s)<br>`:''}Produtos: ${money(p.subtotal??p.price)} + entrega: ${money(p.fee)}<br><strong>Total: ${money(p.total)}</strong></p>
        ${p.offerValid?`<p class="note">Desconto: ${money(p.discountCents)} · oferta válida até ${dateTime(p.offerEndsAt)}</p>`:''}
        <div class="row"><button class="primary-btn" data-action="sabia-review" data-entry="${index}" data-id="${p.id}">Revisar para adicionar</button><button class="ghost-btn strong" data-action="goto-store" data-id="${p.storeId}">Ver estabelecimento</button></div>
      </article>`;
    }).join('')}</div>`:''}
    ${entry.stores?.length?`<div class="sabia-results">${entry.stores.map(store=>`<button class="sabia-result" data-action="goto-store" data-id="${store.id}"><span><b>${esc(store.name)}</b><small>${esc(store.city)} · estabelecimento demonstrativo</small></span></button>`).join('')}</div>`:''}
    ${entry.role==='assistant'?'<small class="sabia-attribution">Resposta de IA · dados comerciais consultados no servidor</small>':''}
  </div>`).join('');
}

function sabiaPage() {
  return `${pageHead('Sabiá', 'Converse sobre os sabores e o comércio da Serra. Recomendações consultam o catálogo do APETÊ.')}
    <section class="sabia-layout">
      <article class="sabia-side">
        <span class="chip orange">Assistente do APETÊ</span><h3>O que combina com sua fome?</h3>
        <p>Uma conversa de verdade, com produtos do catálogo e valores conferidos pelo sistema.</p>
        <label for="sabia-city">Cidade para entrega</label><select id="sabia-city" class="select" ${sabiaBusy?'disabled':''}>${REGIONAL_CITIES.map(city=>`<option ${state.city===city?'selected':''}>${esc(city)}</option>`).join('')}</select>
        <p class="note">Preparado para os nove municípios. Só sugerimos lojas com atendimento cadastrado na cidade selecionada.</p>
        <div class="sabia-suggest">
          <button class="ghost-btn strong" data-action="send-suggestion" data-text="Quero pedir almoço para duas pessoas. O que cabe em R$ 80 com a entrega?" ${sabiaBusy?'disabled':''}>Almoço para dois até R$ 80</button>
          <button class="ghost-btn strong" data-action="send-suggestion" data-text="Tem alguma opção vegetariana no cardápio?" ${sabiaBusy?'disabled':''}>Opções vegetarianas</button>
          <button class="ghost-btn strong" data-action="send-suggestion" data-text="O que é a Última Fornada? Há ofertas válidas?" ${sabiaBusy?'disabled':''}>Última Fornada</button>
          <button class="ghost-btn strong" data-action="send-suggestion" data-text="Como posso valorizar os produtores locais nas minhas refeições?" ${sabiaBusy?'disabled':''}>Conversar sobre a Serra</button>
        </div>
        <div class="sabia-mode"><span>${sabiaMode==='generative'?'IA generativa configurada':sabiaMode==='checking'?'Verificando conexão':'IA indisponível'}</span><small id="sabia-mode-label">${esc(sabiaStatusMessage)}</small><button class="ghost-btn strong" data-action="sabia-check">Verificar conexão</button></div>
        <p class="note">As mensagens são enviadas ao provedor de IA. Não informe senhas, documentos ou dados pessoais. A conversa desta sessão expira no servidor após seis horas.</p>
        <p class="note">O catálogo da IA é o catálogo cadastrado no servidor. Alterações locais no painel de demonstração ainda não sincronizam com ele.</p>
      </article>
      <article class="sabia-chat"><div class="sabia-head"><strong>Sabiá</strong><button class="ghost-btn strong" data-action="sabia-new" ${sabiaBusy?'disabled':''}>Nova conversa</button></div>
        <div id="chat-log" class="chat-log" role="log" aria-live="polite" aria-label="Conversa com a Sabiá">${renderSabiaHistory()}${sabiaBusy?'<div class="chat-bubble sabia-thinking" role="status">Sabiá está consultando e preparando sua resposta…</div>':''}</div>
        ${sabiaError?`<div class="sabia-error" role="alert"><p>${esc(sabiaError)}</p>${sabiaRetryAfter?`<small>Aguarde aproximadamente ${sabiaRetryAfter} segundo(s).</small>`:''}<button class="ghost-btn strong" data-action="sabia-retry" ${sabiaBusy?'disabled':''}>Tentar novamente</button></div>`:''}
        <form id="sabia-form" class="chat-send"><label class="sr-only" for="sabia-input">Sua mensagem para a Sabiá</label><input id="sabia-input" class="input" value="${esc(sabiaDraft)}" placeholder="Pergunte à Sabiá…" maxlength="1200" autocomplete="off" ${sabiaBusy?'disabled':''}><button class="primary-btn" type="submit" ${sabiaBusy?'disabled':''}>${sabiaBusy?'Aguarde…':'Enviar'}</button></form>
      </article>
    </section>`;
}

function customerAuthPage(mode = 'entrar') {
  if (isCustomerLogged()) return `${pageHead('Você já entrou', 'Sua conta está pronta para acompanhar pedidos e finalizar compras.')}<section class="auth-form-card"><h3>Olá, ${esc(state.customer.name.split(' ')[0])}</h3><p>Você pode continuar navegando no APETÊ.</p><button class="primary-btn" data-action="go-page" data-page="cliente">Abrir minha conta</button><button class="ghost-btn strong" data-action="logout-customer">Sair desta conta</button></section>`;
  const cadastro = mode === 'cadastro';
  return `${pageHead(cadastro ? 'Criar conta' : 'Entrar na sua conta', cadastro ? 'Preencha seus dados para finalizar pedidos e acompanhar suas compras.' : 'Entre para acompanhar seus pedidos ou finalizar sua sacola.')}
    <section class="auth-form-card">
      <div class="auth-kicker">${cadastro ? 'Cadastro de cliente' : 'Acesso do cliente'}</div><p class="auth-required-note"><span class="required-mark">*</span> Campos obrigatórios</p>
      ${cadastro ? `<div class="field-grid">
        <div class="field"><label for="customer-name-field">Nome completo <span class="required-mark" aria-label="obrigatório">*</span></label><input id="customer-name-field" class="input name-only" autocomplete="name" placeholder="Seu nome, sem números" value="${esc(state.customer.name)}"></div>
        <div class="field"><label for="customer-email-field">E-mail <span class="required-mark" aria-label="obrigatório">*</span></label><input id="customer-email-field" class="input" type="email" autocomplete="email" placeholder="voce@email.com" value="${esc(state.customer.email)}"></div>
        <div class="field"><label for="customer-phone-field">Telefone <span class="required-mark" aria-label="obrigatório">*</span></label><input id="customer-phone-field" class="input phone-only" inputmode="numeric" autocomplete="tel" maxlength="11" placeholder="Digite apenas os números (DDD + telefone)" value="${esc(onlyDigits(state.customer.phone))}"></div>
        <div class="field"><label for="customer-neighborhood-field">Bairro</label><input id="customer-neighborhood-field" class="input" autocomplete="address-level3" placeholder="Seu bairro" value="${esc(state.customer.neighborhood)}"></div>
        <div class="field"><label for="customer-password-field">Senha <span class="required-mark" aria-label="obrigatório">*</span></label><input id="customer-password-field" class="input" type="password" autocomplete="new-password" placeholder="8 caracteres, letras e números"></div>
        <div class="field"><label for="customer-password-confirm">Confirmar senha <span class="required-mark" aria-label="obrigatório">*</span></label><input id="customer-password-confirm" class="input" type="password" autocomplete="new-password" placeholder="Repita a senha"><small id="customer-password-feedback" class="field-hint" aria-live="polite"></small></div>
        <div class="field auth-wide"><label for="customer-address-field">Endereço de entrega <span class="required-mark" aria-label="obrigatório">*</span></label><input id="customer-address-field" class="input" autocomplete="street-address" placeholder="Rua, número e referência" value="${esc(state.customer.address)}"></div>
        </div><button class="primary-btn auth-submit" data-action="save-customer">Criar conta</button>` : `<div class="field-grid">
        <div class="field"><label for="login-identifier">Telefone ou e-mail <span class="required-mark" aria-label="obrigatório">*</span></label><input id="login-identifier" class="input" type="text" autocomplete="username" placeholder="DDD + número ou voce@email.com" value="" required><small class="field-hint">Use o telefone ou e-mail informado no cadastro.</small></div>
        <div class="field"><label for="login-password">Senha <span class="required-mark" aria-label="obrigatório">*</span></label><input id="login-password" class="input" type="password" autocomplete="current-password" placeholder="Sua senha"></div>
        </div><button class="primary-btn auth-submit" data-action="login-customer">Entrar</button>`}
      <div class="auth-links">
        <p>${cadastro ? 'Já tem conta?' : 'Ainda não tem conta?'} <a href="${cadastro ? 'entrar.html' : 'cadastro.html'}">${cadastro ? 'Fazer login' : 'Criar conta'}</a></p>
        <a href="comerciante-entrar.html">Área do comerciante ↗</a>
      </div>
    </section>`;
}

function merchantAuthPage(mode = 'entrar') {
  if (isMerchantLogged()) return `${pageHead('Loja conectada', 'Acesse seu painel ou entre com outra loja.')}<section class="auth-form-card"><h3>${esc(activeMerchantStore().name)}</h3><button class="primary-btn" data-action="go-page" data-page="comerciante">Abrir painel</button><button class="ghost-btn strong" data-action="logout-merchant">Sair da loja</button></section>`;
  const cadastro = mode === 'cadastro';
  return `${pageHead(cadastro ? 'Cadastrar estabelecimento' : 'Entrar como comerciante', cadastro ? 'Cadastre o responsável e os dados da loja.' : 'Acesse os pedidos e os produtos do seu estabelecimento.')}
    <section class="auth-form-card auth-merchant">
      <div class="auth-kicker">${cadastro ? 'Cadastro de estabelecimento' : 'Acesso do comerciante'}</div><p class="auth-required-note"><span class="required-mark">*</span> Campos obrigatórios</p>
      ${cadastro ? `<div class="field-grid">
        <div class="field"><label>Nome da loja <span class="required-mark">*</span></label><input id="merchant-register-store" class="input" placeholder="Nome do empreendimento"></div>
        <div class="field"><label>Responsável <span class="required-mark">*</span></label><input id="merchant-register-owner" class="input" placeholder="Seu nome"></div>
        <div class="field"><label>Telefone <span class="required-mark">*</span></label><input id="merchant-register-phone" class="input phone-only" inputmode="numeric" maxlength="11" placeholder="DDD + número, sem símbolos"></div><div class="field"><label>E-mail do responsável</label><input id="merchant-register-email" class="input" type="email" autocomplete="email" placeholder="contato@loja.com (opcional)"></div>
        <div class="field"><label>Cidade</label><input id="merchant-register-city" class="input" placeholder="Sua cidade"></div>
        <div class="field"><label>Senha do painel <span class="required-mark">*</span></label><input id="merchant-register-password" class="input" type="password" autocomplete="new-password" placeholder="8 caracteres, letras e números"></div>
        <div class="field"><label>Confirmar senha <span class="required-mark">*</span></label><input id="merchant-register-password-confirm" class="input" type="password" autocomplete="new-password" placeholder="Repita a senha"><small id="merchant-password-feedback" class="field-hint" aria-live="polite"></small></div>
        <div class="field"><label>Documento do empreendimento <span class="required-mark">*</span></label><input id="merchant-register-document" class="input" placeholder="CNPJ ou documento comercial"></div>
        <div class="field"><label>Instagram da loja <span class="required-mark">*</span></label><input id="merchant-register-proof" class="input" placeholder="@sualoja"></div>
        <div class="field auth-wide"><label>Perfil de referência <span class="required-mark">*</span></label><select id="merchant-register-base" class="select">${state.stores.map(store=>`<option value="${store.id}">${esc(store.name)}</option>`).join('')}</select></div>
      </div><label class="check-line"><input id="merchant-register-confirm" type="checkbox"> <span>Confirmo que represento o empreendimento informado. <span class="required-mark">*</span></span></label><button class="primary-btn auth-submit" data-action="register-merchant">Criar acesso</button>` : `<div class="field-grid">
        <div class="field"><label>Responsável <span class="required-mark">*</span></label><input id="merchant-owner" class="input" placeholder="Seu nome"></div>
        <div class="field"><label>Telefone ou e-mail <span class="required-mark">*</span></label><input id="merchant-identifier" class="input" autocomplete="username" placeholder="DDD + número ou contato@loja.com"><small class="field-hint">Nos perfis de apresentação, entre com um telefone de teste e a senha indicada abaixo.</small></div>
        <div class="field"><label>Estabelecimento <span class="required-mark">*</span></label><select id="merchant-store" class="select">${state.stores.map(store=>`<option value="${store.id}">${esc(store.name)}</option>`).join('')}</select></div>
        <div class="field"><label>Senha do painel <span class="required-mark">*</span></label><input id="merchant-password" class="input" type="password" autocomplete="current-password" placeholder="Senha do estabelecimento"></div>
      </div><div class="demo-access"><strong>Acesso para a apresentação</strong><span>Escolha um estabelecimento, informe um telefone de teste e utilize a senha <b>1234</b> para abrir o painel.</span></div><button class="primary-btn auth-submit" data-action="login-merchant">Entrar no painel</button>`}
      <div class="auth-links"><p>${cadastro ? 'Já cadastrou seu estabelecimento?' : 'Quer cadastrar outro estabelecimento?'} <a href="${cadastro ? 'comerciante-entrar.html' : 'comerciante-cadastro.html'}">${cadastro ? 'Entrar no painel' : 'Cadastrar loja'}</a></p><a href="entrar.html">Área do cliente ↗</a></div>
    </section>`;
}

function accountPage() {
  if (!isCustomerLogged()) return customerAuthPage('entrar');
  const customer = state.customer;
  if (isCustomerLogged()) {
    return `${pageHead('Minha conta', 'Área do cliente separada do painel do comerciante.')}
      <section class="account-layout single-col">
        <article class="account-box accent-box"><div class="account-body"><span class="chip soft">Conta do cliente</span><h3>Olá, ${esc(customer.name.split(' ')[0])}</h3><p>Quando você estiver logado, a compra pode ser finalizada com endereço, forma de pagamento e observações do pedido.</p><ul class="kv"><li><strong>Nome</strong><span>${esc(customer.name)}</span></li><li><strong>E-mail</strong><span>${esc(customer.email || 'Ainda não informado')}</span></li><li><strong>Telefone</strong><span>${esc(customer.phone)}</span></li><li><strong>Endereço</strong><span>${esc(customer.address || 'Ainda não informado')}</span></li><li><strong>Status</strong><span>Conta pronta para comprar</span></li></ul><div class="row" style="margin-top:14px"><button class="ghost-btn strong" data-action="go-page" data-page="pedidos">Meus pedidos</button><button class="primary-btn" data-action="go-page" data-page="cardapio">Ir ao cardápio</button><button class="ghost-btn strong" data-action="logout-customer">Sair</button></div></div></article>
      </section>`;
  }
  const activeTab = state.ui.accountTab;
  return `${pageHead('Área do cliente', 'Entre ou crie sua conta para comprar, acompanhar pedidos e finalizar com seus dados salvos.')}
    <section class="account-layout single-col">
      <article class="account-box"><div class="account-body"><div class="tabs"><button class="tab-btn ${activeTab === 'entrar' ? 'active' : ''}" data-action="switch-account-tab" data-tab="entrar">Entrar</button><button class="tab-btn ${activeTab === 'cadastro' ? 'active' : ''}" data-action="switch-account-tab" data-tab="cadastro">Cadastrar</button></div>${activeTab === 'entrar' ? `<div class="field-grid"><div class="field"><label>Telefone</label><input id="login-phone" class="input phone-only" inputmode="numeric" placeholder="(88) 99999-9999" value="${esc(customer.phone)}"></div><div class="field"><label>Senha</label><input id="login-password" class="input" type="password" placeholder="Sua senha"></div></div><div class="row" style="margin-top:14px"><button class="primary-btn" data-action="login-customer">Entrar</button></div>` : `<div class="field-grid"><div class="field"><label>Nome</label><input id="customer-name-field" class="input name-only" placeholder="Seu nome completo" value="${esc(customer.name)}"></div><div class="field"><label>E-mail</label><input id="customer-email-field" class="input" type="email" placeholder="voce@email.com" value="${esc(customer.email)}"></div><div class="field"><label>Telefone</label><input id="customer-phone-field" class="input phone-only" inputmode="numeric" placeholder="(88) 99999-9999" value="${esc(customer.phone)}"></div><div class="field"><label>Bairro</label><input id="customer-neighborhood-field" class="input" placeholder="Seu bairro" value="${esc(customer.neighborhood)}"></div><div class="field"><label>Senha</label><input id="customer-password-field" class="input" type="password" placeholder="Mínimo 8 caracteres, com letras e números"></div><div class="field"><label>Confirmar senha <span class="required-mark">*</span></label><input id="customer-password-confirm" class="input" type="password" placeholder="Repita a senha"></div></div><div class="field" style="margin-top:12px"><label>Endereço</label><input id="customer-address-field" class="input" placeholder="Rua, número e referência" value="${esc(customer.address)}"></div><div class="row" style="margin-top:14px"><button class="primary-btn" data-action="save-customer">Salvar cadastro</button></div>`}</div></article>
    </section>`;
}

function merchantEntry() {
  if (isMerchantLogged()) return `<section class="merchant-box"><div class="merchant-body"><div class="chip-row"><span class="chip soft">Loja conectada</span>${verifiedBadge(activeMerchantStore())}</div><h3>${esc(activeMerchantStore().name)}</h3><p>Seu painel está disponível para conferir pedidos e atualizar o andamento.</p><div class="row" style="margin-top:16px"><button class="primary-btn" data-action="go-page" data-page="comerciante">Abrir painel da loja</button><button class="ghost-btn strong" data-action="logout-merchant">Trocar de loja</button></div></div></section>`;
  const tab = state.ui.merchantAuthTab;
  return `
    <section class="merchant-layout">
      <article class="merchant-box"><div class="merchant-body"><div class="tabs"><button class="tab-btn ${tab === 'entrar' ? 'active' : ''}" data-action="switch-merchant-tab" data-tab="entrar">Entrar no painel</button><button class="tab-btn ${tab === 'cadastro' ? 'active' : ''}" data-action="switch-merchant-tab" data-tab="cadastro">Cadastrar loja</button></div>${tab === 'entrar' ? `<div class="field-grid"><div class="field"><label>Responsável <span class="required-mark">*</span></label><input id="merchant-owner" class="input" placeholder="Nome do responsável"></div><div class="field"><label>Telefone ou e-mail <span class="required-mark">*</span></label><input id="merchant-identifier" class="input" autocomplete="username" placeholder="DDD + número ou contato@loja.com"><small class="field-hint">Nos perfis de apresentação, entre com um telefone de teste e a senha indicada abaixo.</small></div><div class="field"><label>Escolha a loja</label><select id="merchant-store" class="select">${state.stores.map((store) => `<option value="${store.id}">${esc(store.name)}</option>`).join('')}</select></div><div class="field"><label>Senha do painel <span class="required-mark">*</span></label><input id="merchant-password" class="input" type="password" placeholder="Digite a senha do painel"></div></div><p class="note" style="margin-top:12px">Para os perfis base desta apresentação, use a senha <strong>1234</strong>.</p><div class="row" style="margin-top:14px"><button class="primary-btn" data-action="login-merchant">Entrar no painel</button></div>` : `<div class="field-grid"><div class="field"><label>Nome da loja <span class="required-mark">*</span></label><input id="merchant-register-store" class="input" placeholder="Minha loja da Serra"></div><div class="field"><label>Responsável <span class="required-mark">*</span></label><input id="merchant-register-owner" class="input" placeholder="Seu nome"></div><div class="field"><label>Telefone <span class="required-mark">*</span></label><input id="merchant-register-phone" class="input phone-only" inputmode="numeric" maxlength="11" placeholder="DDD + número, sem símbolos"></div><div class="field"><label>E-mail do responsável</label><input id="merchant-register-email" class="input" type="email" autocomplete="email" placeholder="contato@loja.com (opcional)"></div><div class="field"><label>Cidade</label><input id="merchant-register-city" class="input" placeholder="Guaraciaba do Norte"></div><div class="field"><label>Senha do painel <span class="required-mark">*</span></label><input id="merchant-register-password" class="input" type="password" placeholder="Mínimo 8 caracteres, com letras e números"></div><div class="field"><label>Confirmar senha <span class="required-mark">*</span></label><input id="merchant-register-password-confirm" class="input" type="password" placeholder="Repita a senha"></div></div><div class="field-grid" style="margin-top:12px"><div class="field"><label>CNPJ ou documento do empreendimento</label><input id="merchant-register-document" class="input" placeholder="CNPJ ou documento comercial"></div><div class="field"><label>Instagram da loja <span class="required-mark">*</span></label><input id="merchant-register-proof" class="input" placeholder="@sualoja" inputmode="text"></div></div><div class="field" style="margin-top:12px"><label>Base do painel</label><select id="merchant-register-base" class="select">${state.stores.map((store) => `<option value="${store.id}">${esc(store.name)}</option>`).join('')}</select></div><label class="check-line"><input id="merchant-register-confirm" type="checkbox"> <span>Confirmo que sou responsável oficial pelo empreendimento.</span></label><div class="row" style="margin-top:14px"><button class="primary-btn" data-action="register-merchant">Cadastrar e entrar</button></div>`}</div></article>
      <article class="merchant-box accent-box"><div class="merchant-body"><span class="chip plum">Área do comerciante</span><h3>Painel separado do cliente</h3><p>Pedidos pendentes, em preparo, prontos e concluídos ficam aqui, com todas as informações: itens, pagamento, endereço, telefone e observações.</p><ul class="kv"><li><strong>Abas</strong><span>Pendentes, Em preparo, Prontos, Concluídos, Produtos e Cadastro</span></li><li><strong>Pedidos</strong><span>Atualização de status em um clique</span></li><li><strong>Confirmação</strong><span>Senha do painel + identificação oficial do empreendimento</span></li></ul></div></article>
    </section>`;
}

function loginPage() { return customerAuthPage('entrar'); }

function ordersPage() {
  if (!isCustomerLogged()) return `${pageHead('Meus pedidos', 'Faça login para acompanhar seus pedidos e conferir o andamento das compras realizadas.')}<div class="empty"><b>Entre na sua conta</b> Você precisa fazer login para ver seus pedidos. <div class="row" style="justify-content:center;margin-top:16px"><button class="primary-btn" data-action="go-page" data-page="cliente">Ir para minha conta</button></div></div>`;
  const orders = state.orders.filter((order) => order.customer.phone === state.customer.phone).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  const inProgress = orders.filter((order) => ['pendente','preparando','pronto'].includes(order.status)).length;
  const concluded = orders.filter((order) => order.status === 'concluido').length;
  const totalSpent = orders.filter((order) => order.status !== 'cancelado').reduce((sum, order) => sum + order.total, 0);
  return `${pageHead('Meus pedidos', 'Seu espaço como cliente: pedidos ativos, pedidos concluídos e todos os dados do que foi comprado.')}${state.ui.orderSuccessId ? `<div class="order-success-banner" role="status"><span class="success-check" aria-hidden="true">✓</span><div><strong>Pedido enviado!</strong><p>Pedido #${String(state.ui.orderSuccessId).padStart(3,'0')} registrado. Você pode acompanhar o andamento nesta página.</p></div><button class="success-dismiss" data-action="dismiss-order-success" aria-label="Fechar confirmação">×</button></div>` : ''}<section class="history-stats"><article class="history-stat"><strong>${orders.length}</strong><span>Pedidos no total</span></article><article class="history-stat"><strong>${inProgress}</strong><span>Em andamento</span></article><article class="history-stat"><strong>${concluded}</strong><span>Concluídos</span></article><article class="history-stat"><strong>${money(totalSpent)}</strong><span>Valor acumulado</span></article></section>${orders.length ? orders.map((order) => orderCard(order, false)).join('') : `<div class="empty"><b>Nenhum pedido ainda</b> Quando você finalizar uma compra, ela vai aparecer aqui.</div>`}`;
}

function merchantProductForm(product = null) {
  const store = activeMerchantStore();
  const title = product ? 'Editar produto' : 'Adicionar produto';
  const categories = store.producer ? ['Do produtor','Frutas','Verduras','Artesanal','Orgânicos'] : ['Regional','Caseiro','Padaria','Doces','Bebidas','Vegetariano','Acompanhamentos'];
  const chosen = product?.cat || (store.producer ? 'Do produtor' : 'Regional');
  return `<section class="merchant-editor" id="merchant-product-editor"><div class="merchant-section-heading"><div><span class="merchant-eyebrow">Cardápio · ${esc(store.name)}</span><h3>${title}</h3><p>Preencha os campos e escolha uma foto do produto. A imagem será salva neste navegador para a apresentação.</p></div></div>
    <form id="merchant-product-form" class="merchant-edit-form">
      <div class="field-grid">
        <div class="field"><label for="mp-name">Nome do produto *</label><input class="input" id="mp-name" maxlength="70" required value="${esc(product?.name||'')}" placeholder="Ex.: Bolo de milho"></div>
        <div class="field"><label for="mp-category">Categoria *</label><select class="select" id="mp-category">${[...new Set([...categories,chosen])].map(cat=>`<option value="${esc(cat)}" ${cat===chosen?'selected':''}>${esc(cat)}</option>`).join('')}</select></div>
        <div class="field"><label for="mp-price">Preço (R$) *</label><input class="input" id="mp-price" inputmode="decimal" required placeholder="Ex.: 18,90" value="${product?((product.oldPrice||product.price)/100).toFixed(2).replace('.',','):''}"></div>
        <div class="field"><label for="mp-stock">Quantidade disponível *</label><input class="input" id="mp-stock" type="number" min="0" max="9999" step="1" required value="${product?.stock ?? 10}"></div>
      </div>
      <div class="field"><label for="mp-desc">Descrição do produto *</label><textarea class="textarea" id="mp-desc" maxlength="240" required placeholder="Ingredientes, tamanho, detalhes de preparo...">${esc(product?.desc||'')}</textarea></div>
      <div class="field"><label for="mp-photo">Foto do produto ${product?'(opcional: manter foto atual)':'*'}</label><input class="input" id="mp-photo" type="file" accept="image/png,image/jpeg,image/webp" ${product?'':'required'}><small class="merchant-helper">PNG, JPG ou WebP, até 5 MB. A foto fica neste navegador.</small></div>
      ${product ? `<div class="merchant-image-preview">${imgTag(product.image, product.name, store.producer?'producer':'food')}<span>Imagem atual</span></div>` : ''}
      <label class="merchant-check"><input id="mp-offer" type="checkbox" ${product?.lastBatch?'checked':''}><span>Publicar também na <strong>Última Fornada</strong></span></label>
      <div class="field" id="mp-offer-price-field" ${product?.lastBatch?'':'hidden'}><label for="mp-offer-price">Preço especial (R$) *</label><input class="input" id="mp-offer-price" inputmode="decimal" placeholder="Ex.: 14,90" value="${product?.lastBatch?(product.price/100).toFixed(2).replace('.',','):''}"><small class="merchant-helper">O preço normal fica riscado e o desconto aparece ao cliente.</small></div>
      <div class="merchant-form-actions"><button class="primary-btn" type="submit">${product?'Salvar alterações':'Publicar produto'}</button>${product?'<button class="ghost-btn strong" type="button" data-action="cancel-product-edit">Cancelar edição</button>':''}</div>
    </form></section>`;
}
function merchantProductsView(products) {
  const editing = state.ui.productEditor && products.find(p=>p.id===Number(state.ui.productEditor));
  return `<div class="merchant-section-heading"><div><span class="merchant-eyebrow">Gestão de produtos</span><h3>Seu cardápio</h3><p>Adicione um item ou edite preços, fotos e disponibilidade. Alterações aparecem na visão do cliente neste navegador.</p></div><button class="ghost-btn strong" data-action="new-product">+ Novo produto</button></div>
    ${merchantProductForm(editing || null)}<div class="merchant-section-heading below"><h3>Produtos publicados</h3><span>${products.length} itens</span></div><div class="product-grid">${products.map(productCard).join('')}</div>`;
}
function merchantOffersView(products) {
  const offers = products.filter(p=>p.lastBatch);
  return `<div class="merchant-section-heading"><div><span class="merchant-eyebrow">Ofertas do dia</span><h3>Última Fornada</h3><p>Coloque produtos do seu cardápio em oferta. Assim que salvar, o cliente vê o desconto na aba Última Fornada.</p></div></div>
    <section class="merchant-editor"><h3>Criar oferta</h3><form id="merchant-offer-form" class="merchant-edit-form"><div class="field-grid"><div class="field"><label for="mo-product">Produto do seu cardápio *</label><select id="mo-product" class="select" required><option value="">Selecione o produto</option>${products.filter(p=>!p.lastBatch).map(p=>`<option value="${p.id}">${esc(p.name)} · ${money(p.price)}</option>`).join('')}</select></div><div class="field"><label for="mo-price">Novo preço promocional (R$) *</label><input id="mo-price" class="input" inputmode="decimal" placeholder="Ex.: 12,90" required></div></div><div class="merchant-form-actions"><button class="primary-btn" type="submit" ${products.every(p=>p.lastBatch)?'disabled':''}>Publicar na Última Fornada</button><button type="button" class="ghost-btn strong" data-action="merchant-panel-tab" data-tab="produtos">+ Novo produto</button></div></form></section>
    <div class="merchant-section-heading below"><h3>Ofertas ativas</h3><span>${offers.length} ${offers.length===1?'item':'itens'}</span></div>
    ${offers.length?`<div class="merchant-offers-list">${offers.map(p=>`<article class="merchant-offer-item"><div class="merchant-offer-image">${imgTag(p.image,p.name)}</div><div><strong>${esc(p.name)}</strong><p><del>${money(p.oldPrice)}</del> <b>${money(p.price)}</b></p></div><button class="ghost-btn strong" data-action="end-offer" data-id="${p.id}">Encerrar oferta</button></article>`).join('')}</div>`:'<div class="empty">Nenhuma oferta ativa. Selecione um produto do cardápio acima.</div>'}`;
}
function parsePrice(raw) {
  const clean=String(raw||'').trim().replace(/\s|R\$/gi,'');
  if(!/^\d{1,5}(?:[.,]\d{1,2})?$/.test(clean)) return null;
  const cents=Math.round(Number(clean.replace(',','.'))*100);
  return Number.isFinite(cents)&&cents>0?cents:null;
}
async function optimizeProductPhoto(file) {
  if(!file || !['image/png','image/jpeg','image/webp'].includes(file.type) || file.size>5*1024*1024) throw Error('Escolha uma imagem JPG, PNG ou WebP de até 5 MB.');
  const url=URL.createObjectURL(file);
  try {
    const image=new Image();
    await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=url;});
    const ratio=Math.min(1,760/image.naturalWidth,570/image.naturalHeight);
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(image.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(image.naturalHeight*ratio));
    canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
    return canvas.toDataURL('image/webp',.77);
  } finally { URL.revokeObjectURL(url); }
}
async function saveMerchantProduct(form) {
  if(!merchantAccess()) return;
  const store=activeMerchantStore();
  const existing=state.products.find(p=>p.id===Number(state.ui.productEditor)&&p.storeId===store.id);
  const name=$('#mp-name')?.value.trim(); const desc=$('#mp-desc')?.value.trim();
  const basePrice=parsePrice($('#mp-price')?.value); const stock=Number($('#mp-stock')?.value);
  const discounted=$('#mp-offer')?.checked; const offerPrice=discounted?parsePrice($('#mp-offer-price')?.value):null;
  const file=$('#mp-photo')?.files?.[0];
  if(!name||!desc||!basePrice||!Number.isInteger(stock)||stock<0||stock>9999) return toast('Preencha nome, descrição, preço e estoque válidos.');
  if(discounted && (!offerPrice||offerPrice>=basePrice)) return toast('O preço da oferta precisa ser menor que o preço normal.');
  if(!file&&!existing) return toast('Escolha uma foto para o novo produto.');
  let photo=existing?.image;
  if(file) {try{photo=await optimizeProductPhoto(file);}catch(e){return toast(e.message||'Não foi possível ler a foto.');}}
  const next={ id:existing?.id||Math.max(...state.products.map(p=>p.id),0)+1,storeId:store.id,name,desc,cat:$('#mp-category').value,
    price:discounted?offerPrice:basePrice,stock,image:photo,oldPrice:discounted?basePrice:0,lastBatch:!!discounted };
  if(existing) Object.assign(existing,next); else state.products.push(next);
  state.ui.productEditor=0;
  try{save();}catch(e){return toast('Espaço do navegador insuficiente para salvar a foto. Tente uma imagem menor.');}
  render();toast(existing?'Produto atualizado no cardápio.':'Produto publicado no cardápio.','success');
}
function publishMerchantOffer() {
  if(!merchantAccess())return;
  const product=state.products.find(p=>p.id===Number($('#mo-product')?.value)&&p.storeId===activeMerchantStore().id);
  const newPrice=parsePrice($('#mo-price')?.value);
  if(!product||product.lastBatch||!newPrice||newPrice>=product.price) return toast('Escolha um produto e um preço menor que o valor atual.');
  product.oldPrice=product.price;product.price=newPrice;product.lastBatch=true;
  save();render();toast('Oferta publicada na Última Fornada.','success');
}
function endMerchantOffer(id) {
  if(!merchantAccess())return;
  const p=state.products.find(p=>p.id===Number(id)&&p.storeId===activeMerchantStore().id&&p.lastBatch);
  if(!p)return;
  p.price=p.oldPrice||p.price;p.oldPrice=0;p.lastBatch=false;
  save();render();toast('Oferta encerrada. Preço normal restaurado.','success');
}

function merchantPage() {
  if (!merchantAccess()) return merchantAuthPage('entrar');
  const store=activeMerchantStore();
  const tab=state.ui.merchantPanelTab;
  const allOrders=[...state.orders.filter(o=>o.storeId===store.id),...state.demoOrders.filter(o=>o.storeId===store.id)]
    .sort((a,b)=>Number(!!a.demo)-Number(!!b.demo)||new Date(b.createdAt)-new Date(a.createdAt));
  const pending=allOrders.filter(o=>o.status==='pendente');
  const preparing=allOrders.filter(o=>o.status==='preparando');
  const ready=allOrders.filter(o=>o.status==='pronto');
  const concluded=allOrders.filter(o=>['concluido','cancelado'].includes(o.status));
  const products=state.products.filter(p=>p.storeId===store.id);
  const offerCount=products.filter(p=>p.lastBatch).length;
  const panels={pendentes:pending,preparando:preparing,prontos:ready,concluidos:concluded};
  let body='';
  if(panels[tab]) body=panels[tab].length?panels[tab].map(o=>orderCard(o,true)).join(''):`<div class="empty"><b>Nenhum pedido nesta etapa</b> Você pode avançar um pedido pela etapa anterior.</div>`;
  if(tab==='produtos')body=merchantProductsView(products);
  if(tab==='fornada')body=merchantOffersView(products);
  if(tab==='cadastro')body=`<section class="merchant-editor"><div class="merchant-section-heading"><div><span class="merchant-eyebrow">Configurações do perfil</span><h3>Dados de ${esc(store.name)}</h3><p>Personalize as informações exibidas na vitrine do estabelecimento.</p></div></div><form id="merchant-profile-form" class="merchant-edit-form"><div class="field-grid"><div class="field"><label>Nome da loja *</label><input id="merchant-edit-name" class="input" required value="${esc(store.name)}"></div><div class="field"><label>Categoria</label><input id="merchant-edit-category" class="input" value="${esc(store.category)}"></div><div class="field"><label>Cidade</label><input id="merchant-edit-city" class="input" value="${esc(store.city)}"></div><div class="field"><label>Telefone</label><input id="merchant-edit-phone" class="input" value="${esc(state.merchant.phone)}"></div><div class="field"><label>Instagram da loja *</label><input id="merchant-edit-instagram" class="input" value="${esc(store.instagram||store.officialRef||'')}" placeholder="@sualoja"></div></div><div class="field"><label>Descrição</label><textarea id="merchant-edit-desc" class="textarea">${esc(store.desc)}</textarea></div><div class="merchant-form-actions"><button class="primary-btn" type="submit">Salvar perfil</button></div></form></section>`;
  const stageList=[['pendentes','Recebidos',pending.length],['preparando','Em preparo',preparing.length],['prontos','Prontos',ready.length],['concluidos','Finalizados',concluded.length]];
  return `${state.ui.presentationMerchant?'<div class="merchant-demo-notice">Visão de apresentação · Os pedidos e produtos são salvos apenas neste navegador.</div>':''}
   <section class="merchant-cover-card ${store.producer?'producer-cover-theme':''}"><div class="merchant-cover-picture">${imgTag(store.cover,store.name,store.producer?'producer':'store')}</div><div class="merchant-cover-copy"><span class="merchant-eyebrow">PAINEL DO ${store.producer?'PRODUTOR':'COMERCIANTE'}</span><h2>${esc(store.name)}</h2><p>${esc(store.category)} · ${esc(store.city)}</p><div class="merchant-cover-actions"><button class="merchant-cover-action" data-action="merchant-panel-tab" data-tab="pendentes">Ver pedidos <span>${pending.length}</span></button><button class="merchant-cover-action" data-action="merchant-panel-tab" data-tab="produtos">+ Produto</button><button class="merchant-cover-action" data-action="merchant-panel-tab" data-tab="fornada">Última Fornada <span>${offerCount}</span></button></div></div></section>
   ${state.ui.presentationMerchant?`<div class="merchant-store-select"><label for="demo-merchant-store">Trocar estabelecimento no vídeo</label><select id="demo-merchant-store" class="select">${state.stores.map(s=>`<option value="${s.id}" ${s.id===store.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></div>`:''}
   <div class="merchant-workflow" aria-label="Etapas do pedido">${stageList.map(([key,label,count])=>`<button class="merchant-stage ${tab===key?'selected':''}" data-action="merchant-panel-tab" data-tab="${key}" aria-pressed="${tab===key}" aria-label="${label}: ${count} ${count===1?'pedido':'pedidos'}"><span class="stage-label">${label}</span>${tab===key?`<span class="stage-count">${count} ${count===1?'pedido':'pedidos'}</span>`:''}</button>`).join('')}</div>
   <div class="merchant-tabs" role="group" aria-label="Áreas do painel"><button class="merchant-tab ${['pendentes','preparando','prontos','concluidos'].includes(tab)?'selected':''}" data-action="merchant-panel-tab" data-tab="pendentes">Pedidos</button><button class="merchant-tab ${tab==='produtos'?'selected':''}" data-action="merchant-panel-tab" data-tab="produtos">Cardápio</button><button class="merchant-tab ${tab==='fornada'?'selected':''}" data-action="merchant-panel-tab" data-tab="fornada">Última Fornada</button><button class="merchant-tab ${tab==='cadastro'?'selected':''}" data-action="merchant-panel-tab" data-tab="cadastro">Meu perfil</button></div>
   <div class="merchant-main-body">${body}</div>`;
}

function storeDetailPage() {
  const store = getStore(state.storeViewId);
  const products = state.products.filter((product) => product.storeId === store.id);
  return `${pageHead(store.name, store.hero)}<section class="store-detail"><article class="detail-hero ${store.producer ? 'producer-tone' : 'merchant-tone'}"><div class="detail-cover">${imgTag(store.cover, store.name, store.producer ? 'producer' : 'store')}<div class="cover-overlay ${store.producer ? 'producer' : ''}"></div><div class="cover-copy"><span class="cover-kicker">${esc(store.category)}</span><h4>${esc(store.name)}</h4><div class="cover-meta"><span>${esc(store.city)}</span><span>★ ${store.rating.toFixed(1)}</span><span>${esc(store.time)}</span></div></div></div><div class="detail-info"><div class="chip-row"><span class="chip ${store.producer ? 'producer-alt' : 'orange'}">Entrega ${money(store.fee)}</span>${instagramBadge(store)}</div><p>${esc(store.desc)}</p><div class="row detail-actions" style="margin-top:18px"><button class="primary-btn" data-action="filter-store" data-id="${store.id}">Ver tudo no catálogo</button><button class="ghost-btn strong" data-action="go-page" data-page="estabelecimentos">Voltar</button></div></div></article><div class="product-grid">${products.map(productCard).join('')}</div></section>`;
}

function render() {
  const content = $('#content');
  const page = state.page;
  $('#location-label').textContent = state.city || 'Guaraciaba do Norte';
  $('#customer-name').textContent = (isMerchantView() || isCustomerLogged()) ? 'Minha conta' : 'Entrar';
  $('#user-button').setAttribute('aria-label', (isMerchantView() || isCustomerLogged()) ? 'Minha conta' : 'Entrar');
  $('#cart-count').textContent = String(state.cart.reduce((sum, item) => sum + item.qty, 0));
  $('#demo-client-tab')?.classList.toggle('active',!isMerchantView());
  $('#demo-merchant-tab')?.classList.toggle('active',isMerchantView());

  let html = '';
  if (page === 'inicio') html = homePage();
  else if (page === 'estabelecimentos') html = storesPage();
  else if (page === 'cardapio') html = catalogPage();
  else if (page === 'fornada') html = lastBatchPage();
  else if (page === 'produtores') html = producersPage();
  else if (page === 'sabia') html = sabiaPage();
  else if (page === 'pedidos') html = ordersPage();
  else if (page === 'entrar') html = isCustomerLogged() ? accountPage() : customerAuthPage('entrar');
  else if (page === 'cadastro') html = isCustomerLogged() ? accountPage() : customerAuthPage('cadastro');
  else if (page === 'comerciante-entrar') html = isMerchantLogged() ? merchantPage() : merchantAuthPage('entrar');
  else if (page === 'comerciante-cadastro') html = isMerchantLogged() ? merchantPage() : merchantAuthPage('cadastro');
  else if (page === 'cliente') html = accountPage();
  else if (page === 'comerciante') html = merchantPage();
  else if (page === 'loja') html = storeDetailPage();
  else html = homePage();

  content.innerHTML = html;
  const visualPage = ((page === 'entrar' || page === 'cadastro') && isCustomerLogged()) ? 'cliente' : (((page === 'comerciante-entrar' || page === 'comerciante-cadastro') && isMerchantLogged()) ? 'comerciante' : page);
  $('#page-title').textContent = visualPage === 'loja' ? getStore(state.storeViewId).name : (PAGE_TITLES[visualPage] || 'APETÊ');
  const enterLink = $('#customer-nav-link');
  if (enterLink) {
    const profileReady = isMerchantView();
    const logged = profileReady || isCustomerLogged();
    enterLink.dataset.page = profileReady ? 'comerciante' : (logged ? 'cliente' : 'entrar');
    enterLink.href = profileReady ? 'index.html#comerciante' : (logged ? 'index.html#cliente' : 'entrar.html');
    const label = enterLink.querySelector('.customer-nav-label');
    if (label) label.textContent = logged ? 'Minha conta' : 'Entrar';
    enterLink.setAttribute('aria-label', logged ? 'Minha conta' : 'Entrar');
  }
  $$('.side-nav a').forEach((link) => link.classList.toggle('active', link.dataset.page === visualPage));
}

function addToCart(productId) {
  const product = getProduct(productId);
  if (!product) return;
  if (product.stock <= 0) return toast('Produto indisponível no momento.');
  const firstProduct = state.cart.length ? getProduct(state.cart[0].productId) : null;
  if (firstProduct && firstProduct.storeId !== product.storeId) {
    toast(`Sua sacola já tem produtos de ${getStore(firstProduct.storeId).name}. Finalize esse pedido antes de comprar de outro perfil.`);
    return;
  }
  const line = state.cart.find((item) => item.productId === product.id);
  if (line && line.qty >= product.stock) return toast('Quantidade máxima disponível para este produto.');
  if (line) line.qty += 1;
  else state.cart.push({ productId: product.id, qty: 1 });
  save();
  render();
  toast(`${product.name} adicionado à sacola`);
}
function updateCartQty(productId, step) {
  const line = state.cart.find((item) => item.productId === Number(productId));
  if (!line) return;
  line.qty += Number(step);
  if (line.qty <= 0) state.cart = state.cart.filter((item) => item.productId !== Number(productId));
  save();
  renderCartModal();
  render();
}
function removeCartItem(productId) {
  state.cart = state.cart.filter((entry) => entry.productId !== Number(productId));
  save();
  renderCartModal();
  render();
}
function openCartModal() { cartStep = 'cart'; renderCartModal(); }
function goCheckout() {
  if (!isCustomerLogged()) {
    closeModal();
    state.ui.accountRole = 'cliente';
    state.ui.accountTab = 'entrar';
    save();
    setPage('entrar');
    toast('Faça login ou cadastro para concluir a compra');
    return;
  }
  cartStep = 'checkout';
  renderCartModal();
}

function renderCartModal() {
  const items = state.cart.map((item) => ({ ...item, product: getProduct(item.productId) })).filter((item) => item.product);
  if (!items.length) {
    openModal('Sua sacola', `<div class="empty"><b>Sua sacola está vazia</b> Adicione produtos para montar seu pedido.<div class="row" style="justify-content:center;margin-top:14px"><button class="primary-btn" data-action="go-catalog">Ver produtos</button></div></div>`);
    return;
  }
  const store = getStore(items[0].product.storeId);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const deliveryFee = store.fee;
  const total = subtotal + deliveryFee;

  if (cartStep === 'checkout') {
    openModal('Finalizar pedido', `
      <div class="checkout-summary">
        <div class="summary-card"><h4>Entrega e pagamento</h4><div class="field-grid"><div class="field"><label>Nome</label><input id="checkout-name" class="input" value="${esc(state.customer.name)}"></div><div class="field"><label>Telefone</label><input id="checkout-phone" class="input" value="${esc(onlyDigits(state.customer.phone))}"></div><div class="field"><label>Bairro</label><input id="checkout-neighborhood" class="input" value="${esc(state.customer.neighborhood)}"></div><div class="field"><label>Endereço</label><input id="checkout-address" class="input" value="${esc(state.customer.address)}"></div></div></div>
        <div class="summary-card"><h4>Como você vai pagar?</h4><div class="payment-box"><button class="payment-option ${selectedPayment === 'pix' ? 'active' : ''}" data-action="select-payment" data-pay="pix"><strong>Pix</strong><span>Pagamento rápido</span></button><button class="payment-option ${selectedPayment === 'cartao' ? 'active' : ''}" data-action="select-payment" data-pay="cartao"><strong>Cartão</strong><span>Crédito ou débito</span></button><button class="payment-option ${selectedPayment === 'cartao-entrega' ? 'active' : ''}" data-action="select-payment" data-pay="cartao-entrega"><strong>Cartão na entrega</strong><span>Máquina no recebimento</span></button></div></div>
        <div class="summary-card"><h4>Resumo do pedido</h4><div class="total-row"><span>Estabelecimento</span><strong>${esc(store.name)}</strong></div><div class="total-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="total-row"><span>Entrega</span><strong>${money(deliveryFee)}</strong></div><div class="total-row final"><span>Total</span><strong>${money(total)}</strong></div><div class="field" style="margin-top:12px"><label>Observações do pedido</label><textarea id="checkout-note" class="textarea" placeholder="Ex.: sem cebola, entregar na portaria, chamar no WhatsApp"></textarea></div><div class="row" style="margin-top:14px"><button class="ghost-btn strong" data-action="back-to-cart">Voltar</button><button class="primary-btn" data-action="place-order">Confirmar pedido</button></div></div>
      </div>`);
    return;
  }

  openModal('Sua sacola', `${items.map((item) => `<div class="cart-line"><div class="cart-thumb">${imgTag(item.product.image, item.product.name, getStore(item.product.storeId).producer ? 'producer' : 'food')}</div><div><strong>${esc(item.product.name)}</strong><p class="note">${esc(getStore(item.product.storeId).name)}</p><div class="qty-row"><button data-action="qty-cart" data-id="${item.productId}" data-step="-1">−</button><strong>${item.qty}</strong><button data-action="qty-cart" data-id="${item.productId}" data-step="1">+</button><button class="link-danger" data-action="remove-cart" data-id="${item.productId}">Remover</button></div></div><strong>${money(item.product.price * item.qty)}</strong></div>`).join('')}<div class="summary-card"><div class="total-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="total-row"><span>Entrega</span><strong>${money(deliveryFee)}</strong></div><div class="total-row final"><span>Total</span><strong>${money(total)}</strong></div><div class="row" style="margin-top:16px"><button class="ghost-btn strong" data-action="close">Continuar navegando</button><button class="primary-btn" data-action="go-checkout">Finalizar compra</button></div></div>`);
}

function placeOrder() {
  const name = $('#checkout-name')?.value.trim();
  const phone = $('#checkout-phone')?.value.trim();
  const neighborhood = $('#checkout-neighborhood')?.value.trim();
  const address = $('#checkout-address')?.value.trim();
  const note = $('#checkout-note')?.value.trim();
  if (!name || !phone || !address) return toast('Preencha nome, telefone e endereço para finalizar');
  const items = state.cart.map((item) => ({ ...item, product: getProduct(item.productId) })).filter((item) => item.product);
  const store = getStore(items[0].product.storeId);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const total = subtotal + store.fee;
  const paymentLabel = { pix: 'Pix', cartao: 'Cartão', 'cartao-entrega': 'Cartão na entrega' }[selectedPayment];
  const order = {
    id: state.orders.length ? Math.max(...state.orders.map((item) => item.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
    storeId: store.id,
    items: items.map((item) => ({ productId: item.product.id, name: item.product.name, price: item.product.price, qty: item.qty })),
    subtotal,
    deliveryFee: store.fee,
    total,
    status: 'pendente',
    note,
    payment: selectedPayment,
    paymentLabel,
    customer: { name, phone, address, neighborhood }
  };
  state.customer = { ...state.customer, logged: true, name, phone, address, neighborhood };
  state.orders.unshift(order);
  state.ui.orderSuccessId=order.id;
  state.cart = [];
  save();
  closeModal();
  setPage('pedidos');
  toast('✓ Pedido enviado! Acompanhe em Meus pedidos.', 'success');
}

function saveCustomer() {
  const name = $('#customer-name-field')?.value.trim();
  const email = $('#customer-email-field')?.value.trim();
  const phone = normalizePhone($('#customer-phone-field')?.value.trim());
  const neighborhood = $('#customer-neighborhood-field')?.value.trim();
  const address = $('#customer-address-field')?.value.trim();
  const password = $('#customer-password-field')?.value || '';
  const confirmPassword = $('#customer-password-confirm')?.value || '';
  if (!validCustomerName(name)) return toast('Digite um nome válido, sem números');
  if (!validEmail(email)) return toast('Digite um e-mail válido com @');
  if (onlyDigits(phone).length < 10) return toast('Digite um telefone válido');
  if (!address) return toast('Preencha o endereço');
  if (!strongPassword(password)) return toast('A senha precisa ter no mínimo 8 caracteres, com letras e números');
  if (password !== confirmPassword) return toast('As senhas do cadastro não conferem');
  state.customer = { logged: true, name, email, phone, address, neighborhood, password };
  save();
  setPage('cliente');
  toast('Cadastro salvo. Você já pode comprar');
}
function loginCustomer() {
  const identifier = ($('#login-identifier')?.value || '').trim();
  const password = $('#login-password')?.value || '';
  if (!identifier || !password) return toast('Informe o telefone ou e-mail e a senha');
  const usingEmail = identifier.includes('@');
  if (usingEmail ? !validEmail(identifier) : onlyDigits(identifier).length < 10 || onlyDigits(identifier).length > 11)
    return toast('Informe um telefone com DDD ou e-mail válido');
  if (!state.customer.password) return toast('Conta ainda não cadastrada neste navegador. Clique em Criar conta.');
  const matches = usingEmail
    ? identifier.toLowerCase() === String(state.customer.email || '').toLowerCase()
    : onlyDigits(identifier) === onlyDigits(state.customer.phone);
  if (!matches || password !== state.customer.password) return toast('Telefone, e-mail ou senha incorretos');
  state.customer.logged = true;
  save();
  setPage('cliente');
  toast('Login realizado');
}

function loginMerchant() {
  const owner = $('#merchant-owner')?.value.trim();
  const identifier = ($('#merchant-identifier')?.value || '').trim();
  const storeId = Number($('#merchant-store')?.value || 1);
  const password = $('#merchant-password')?.value || '';
  const store = getStore(storeId);
  if (!owner) return toast('Informe o nome do responsável');
  if (!identifier) return toast('Informe um telefone ou e-mail');
  const usingEmail = identifier.includes('@');
  if (usingEmail ? !validEmail(identifier) : onlyDigits(identifier).length < 10 || onlyDigits(identifier).length > 11)
    return toast('Informe um telefone com DDD ou e-mail válido');
  if (!store || !password) return toast('Selecione a loja e informe a senha');
  const isRegisteredStore = Boolean(store.contactEmail);
  if (usingEmail && (!isRegisteredStore || identifier.toLowerCase() !== store.contactEmail.toLowerCase()))
    return toast('E-mail não cadastrado para este estabelecimento. Use o telefone de apresentação.');
  if (isRegisteredStore && !usingEmail && store.contactPhone && onlyDigits(identifier) !== onlyDigits(store.contactPhone))
    return toast('Telefone não cadastrado para este estabelecimento');
  if (password !== (store.panelPassword || '1234')) return toast('Senha do painel incorreta');
  const phone = usingEmail ? (store.contactPhone || '') : normalizePhone(identifier);
  state.merchant = { ...state.merchant, logged: true, owner, phone, email: isRegisteredStore ? store.contactEmail : '', storeId, password, verified: !!store.verified, document: store.officialRef || '', officialProof: store.officialRef || '' };
  state.ui.merchantPanelTab = 'pendentes';
  save();
  setPage('comerciante');
  toast('Painel do comerciante liberado');
}

function registerMerchant() {
  const storeName = $('#merchant-register-store')?.value.trim();
  const owner = $('#merchant-register-owner')?.value.trim();
  const phone = normalizePhone($('#merchant-register-phone')?.value.trim());
  const city = $('#merchant-register-city')?.value.trim();
  const merchantEmail = $('#merchant-register-email')?.value.trim() || '';
  const password = $('#merchant-register-password')?.value || '';
  const confirmPassword = $('#merchant-register-password-confirm')?.value || '';
  const documentId = $('#merchant-register-document')?.value.trim();
  const officialProof = $('#merchant-register-proof')?.value.trim();
  const confirmed = $('#merchant-register-confirm')?.checked;
  const baseId = Number($('#merchant-register-base')?.value || 1);
  if (!storeName || !owner) return toast('Preencha nome da loja e responsável');
  if (onlyDigits(phone).length < 10) return toast('Digite um telefone válido');
  if (merchantEmail && !validEmail(merchantEmail)) return toast('Digite um e-mail comercial válido');
  if (!strongPassword(password)) return toast('A senha do painel precisa ter no mínimo 8 caracteres, com letras e números');
  if (password !== confirmPassword) return toast('As senhas do painel não conferem');
  if (!documentId || !instagramHandle(officialProof) || !confirmed) return toast('Informe o documento, Instagram da loja e a confirmação');
  const store = getStore(baseId);
  store.name = storeName;
  if (city) store.city = city;
  store.panelPassword = password;
  store.contactEmail = merchantEmail.toLowerCase();
  store.contactPhone = phone;
  store.verified = false; // Self-declaration is not real verification.
  store.instagram = '@' + instagramHandle(officialProof);
  store.officialRef = store.instagram;
  state.merchant = { logged: true, owner, phone, email: merchantEmail, storeId: store.id, password, document: documentId, officialProof, verified: false };
  state.ui.merchantPanelTab = 'cadastro';
  save();
  setPage('comerciante');
  toast('Cadastro da loja concluído');
}

function saveMerchantProfile() {
  const store = activeMerchantStore();
  store.name = $('#merchant-edit-name')?.value.trim() || store.name;
  store.category = $('#merchant-edit-category')?.value.trim() || store.category;
  store.city = $('#merchant-edit-city')?.value.trim() || store.city;
  store.desc = $('#merchant-edit-desc')?.value.trim() || store.desc;
  state.merchant.phone = $('#merchant-edit-phone')?.value.trim() || state.merchant.phone;
  const handle=instagramHandle($('#merchant-edit-instagram')?.value);
  if(handle) {store.instagram='@'+handle; store.officialRef=store.instagram;}
  save();
  render();
  toast('Dados da loja atualizados');
}

function findMerchantOrder(orderId) {
  const id=Number(orderId);
  const storeId=activeMerchantStore().id;
  return state.orders.find(o=>o.id===id && o.storeId===storeId)
    || state.demoOrders.find(o=>o.id===id && o.storeId===storeId);
}

function advanceOrder(orderId) {
  if (!merchantAccess()) return;
  const order = findMerchantOrder(orderId);
  if (!order) return;
  if (order.status === 'pendente') order.status = 'preparando';
  else if (order.status === 'preparando') order.status = 'pronto';
  else if (order.status === 'pronto') order.status = 'concluido';
  save();
  render();
  toast(`Pedido #${String(order.id).padStart(3,'0')} atualizado`);
}
function cancelOrder(orderId) {
  if (!merchantAccess()) return;
  const order = findMerchantOrder(orderId);
  if (!order) return;
  order.status = 'cancelado';
  save();
  render();
  toast(`Pedido #${String(order.id).padStart(3,'0')} cancelado`);
}

async function useMyLocation() {
  if (locating) return;
  if (!navigator.geolocation) return toast('Seu navegador não oferece geolocalização.');
  locating = true;
  $('#locate').disabled = true;
  $('#location-label').textContent = 'Localizando...';
  const finish = () => {
    locating = false;
    $('#locate').disabled = false;
    $('#location-label').textContent = state.city || 'Guaraciaba do Norte';
  };
  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    const latitude = coords.latitude;
    const longitude = coords.longitude;
    let label = '';
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 4500);
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=pt-BR`, { signal: controller.signal });
      clearTimeout(t);
      if (res.ok) {
        const data = await res.json();
        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || data.address?.county;
        const neighborhood = data.address?.suburb || data.address?.neighbourhood || data.address?.quarter || '';
        label = city ? `${city}${neighborhood ? ` • ${neighborhood}` : ''}` : '';
      }
    } catch {}
    state.location = label || 'Entrega definida';
    save();
    render();
    finish();
    toast('Localização atualizada');
  }, (error) => {
    finish();
    toast(error.code === 1 ? 'Permissão de localização não concedida' : 'Localização indisponível.');
  }, { enableHighAccuracy: false, timeout: 7000, maximumAge: 60000 });
}

async function sabiaRequest(path, body, authenticated=true) {
  if (!navigator.onLine) throw new Error('Você está sem conexão. O catálogo local e a sacola continuam disponíveis.');
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),65000);
  try {
    const response=await fetch(path,{method:body===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',signal:controller.signal,
      headers:body===undefined?{}:{'Content-Type':'application/json',...(authenticated&&sabiaSession?{'X-CSRF-Token':sabiaSession.csrfToken}:{})},
      body:body===undefined?undefined:JSON.stringify(body)});
    let data; try {data=await response.json();} catch {throw new Error('A Sabiá não respondeu. O catálogo continua acessível.');}
    if(!response.ok){const error=new Error(data.error?.message||'Não foi possível consultar a IA.');error.retryAfter=data.error?.retryAfter||0;error.status=response.status;throw error;}
    return data;
  } catch(error) {
    if(error.name==='AbortError')throw new Error('A IA demorou demais. Você pode tentar novamente.');
    if(error instanceof TypeError)throw new Error('Não foi possível conectar ao servidor da Sabiá. O restante do site continua funcionando.');
    throw error;
  } finally {clearTimeout(timer);}
}
async function ensureSabiaSession(fresh=false) {
  if(sabiaSession&&!fresh)return sabiaSession;
  if(sabiaSessionPromise&&!fresh)return sabiaSessionPromise;
  sabiaSessionPromise=(async()=>{
    let conversationId=fresh?null:sessionStorage.getItem('apete-sabia-conversation');
    let data;
    try{data=await sabiaRequest('/api/sabia/session',conversationId?{conversationId}:{},false);}
    catch(error){if(error.status!==404)throw error;data=await sabiaRequest('/api/sabia/session',{},false);}
    sabiaSession=data;sessionStorage.setItem('apete-sabia-conversation',data.conversationId);sabiaChat=fresh?[]:(JSON.parse(sessionStorage.getItem('apete-sabia-history')||'[]')); 
    return data;
  })();
  try{return await sabiaSessionPromise;}finally{sabiaSessionPromise=null;}
}
async function sendToSabia(text) {
  const clean=String(text||'').trim();
  if(!clean||sabiaBusy)return;
  sabiaBusy=true;sabiaError='';sabiaRetryAfter=0;sabiaLastQuestion=clean;sabiaDraft='';
  if(state.page==='sabia')render();
  try {
    await ensureSabiaSession();
    if(sabiaChat.at(-1)?.role==='user')sabiaChat.pop();
    sabiaChat.push({role:'user',content:clean});if(state.page==='sabia')render();
    const result=await sabiaRequest('/api/sabia',{question:clean,conversationId:sabiaSession.conversationId,city:state.city,mode:'delivery',history:sabiaChat.slice(-7,-1).map(({role,content})=>({role,content}))});
    sabiaChat.push({role:'assistant',content:result.text,products:result.products||[],stores:result.stores||[]});sessionStorage.setItem('apete-sabia-history',JSON.stringify(sabiaChat.slice(-12)));
    sabiaMode='generative';sabiaStatusMessage='Conectada à '+result.provider+' · '+result.model;
  } catch(error) {sabiaError=error.message;sabiaRetryAfter=error.retryAfter||0;sabiaDraft=clean;if(error.status===401)sabiaSession=null;}
  finally {sabiaBusy=false;if(state.page==='sabia'){render();const log=$('#chat-log');if(log)log.scrollTop=log.scrollHeight;$('#sabia-input')?.focus();}}
}
async function detectSabiaMode() {
  try {
    const status=await sabiaRequest('/api/sabia/status');
    sabiaMode=status.mode;sabiaStatusMessage=status.message;
    if(state.page==='sabia')await ensureSabiaSession();
  }catch(error){sabiaMode='unavailable';sabiaStatusMessage=error.message;}
  if(state.page==='sabia')render();
}
async function reviewSabiaProduct(entryIndex,id) {
  const candidate=sabiaChat[Number(entryIndex)]?.products?.find(p=>p.id===Number(id));
  if(!candidate)return;
  try {
    await ensureSabiaSession();
    const current=await sabiaRequest('/api/sabia/product',{productId:candidate.id,city:state.city,mode:'delivery'});
    const local=getProduct(current.id),store=getStore(current.storeId),qty=candidate.quantity||1;
    if(!local||local.price!==current.price||store.fee!==current.fee)throw new Error('O catálogo local está diferente do servidor. Este item não foi adicionado. Confira o cadastro antes de pedir.');
    if(current.stock<qty||local.stock<qty)throw new Error('Quantidade indisponível no momento.');
    if(candidate.recommendation&&qty*current.price+current.fee>candidate.budget)throw new Error('O preço mudou e ultrapassa o orçamento. Peça uma nova sugestão.');
    sabiaPendingProduct={...current,quantity:qty};
    openModal('Adicionar sugestão à sacola',`<p><strong>${esc(current.name)}</strong></p><p>${qty} unidade(s) · ${money(current.price*qty)} em produtos + ${money(current.fee)} de entrega.</p><p><strong>Total da sugestão: ${money(current.price*qty+current.fee)}</strong></p><p class="note">A sacola pode ter outros itens. Revise o total no checkout. Nenhum pedido ou pagamento será enviado agora.</p><div class="row"><button class="ghost-btn strong" data-action="close">Voltar</button><button class="primary-btn" data-action="sabia-confirm-add">Confirmar adição</button></div>`);
  } catch(error){toast(error.message);sabiaError=error.message;if(state.page==='sabia')render();}
}
function confirmSabiaAdd(){
  const p=sabiaPendingProduct;if(!p)return;
  const local=getProduct(p.id),first=state.cart.length?getProduct(state.cart[0].productId):null;
  if(first&&first.storeId!==p.storeId)return toast('Sua sacola pertence a outro estabelecimento. Finalize ou esvazie antes.');
  const current=state.cart.find(i=>i.productId===p.id)?.qty||0;
  if(!local||local.stock<current+p.quantity)return toast('Quantidade indisponível.');
  closeModal();for(let i=0;i<p.quantity;i++)addToCart(p.id);sabiaPendingProduct=null;
}
function selectRegion(){
  openModal('Onde você quer receber?',`<p>Escolha o município. Não presumimos entregas entre cidades.</p><label for="regional-city">Município</label><select id="regional-city" class="select">${REGIONAL_CITIES.map(city=>`<option ${state.city===city?'selected':''}>${esc(city)}</option>`).join('')}</select><p class="note">Os estabelecimentos são fictícios. As áreas de atendimento da Sabiá são cadastradas no servidor.</p><button class="primary-btn" data-action="save-region">Confirmar cidade</button>`);
}

render();
detectSabiaMode();
$('#content').addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'go-page') setPage(button.dataset.page);
  if (action === 'goto-store') setPage('loja', button.dataset.id);
  if (action === 'filter-store') { state.filters.storeId = String(button.dataset.id); save(); setPage('cardapio'); }
  if (action === 'add-cart') addToCart(button.dataset.id);
  if (action === 'choose-login-role') { setPage(button.dataset.role === 'comerciante' ? 'comerciante' : 'cliente'); }
  if (action === 'switch-account-tab') { setPage(button.dataset.tab === 'cadastro' ? 'cadastro' : 'entrar'); }
  if (action === 'switch-merchant-tab') { setPage(button.dataset.tab === 'cadastro' ? 'comerciante-cadastro' : 'comerciante-entrar'); }
  if (action === 'merchant-panel-tab') { state.ui.merchantPanelTab=button.dataset.tab;state.ui.productEditor=0;save();render(); }
  if (action === 'edit-product' && merchantAccess()) {const item=getProduct(button.dataset.id);if(item?.storeId===activeMerchantStore().id){state.ui.merchantPanelTab='produtos';state.ui.productEditor=item.id;save();render();$('#merchant-product-editor')?.scrollIntoView({behavior:'smooth',block:'start'});}}
  if (action === 'new-product' || action === 'cancel-product-edit') {state.ui.productEditor=0;save();render();}
  if (action === 'end-offer') endMerchantOffer(button.dataset.id);
  if (action === 'dismiss-order-success') { state.ui.orderSuccessId = null; save(); render(); }
  if (action === 'save-customer') saveCustomer();
  if (action === 'login-customer') loginCustomer();
  if (action === 'login-merchant') loginMerchant();
  if (action === 'register-merchant') registerMerchant();
  if (action === 'save-merchant-profile') saveMerchantProfile();
  if (action === 'advance-order') advanceOrder(button.dataset.id);
  if (action === 'cancel-order') cancelOrder(button.dataset.id);
  if (action === 'logout-merchant') { state.merchant.logged = false; save(); setPage('comerciante-entrar'); }
  if (action === 'logout-customer') {
    state.customer = state.customer.demo && state.ui.savedCustomerBeforeDemo
      ? {...state.ui.savedCustomerBeforeDemo, logged:false}
      : {...state.customer, logged:false};
    state.ui.savedCustomerBeforeDemo=null;
    state.ui.demoOptOut=true;
    save();setPage('entrar');
  }
  if (action === 'send-suggestion') sendToSabia(button.dataset.text || '');
  if (action === 'sabia-check') detectSabiaMode();
  if (action === 'sabia-review') reviewSabiaProduct(button.dataset.entry,button.dataset.id);
  if (action === 'sabia-retry') sendToSabia(sabiaLastQuestion);
  if (action === 'sabia-new'&&!sabiaBusy) {sabiaSession=null;sabiaError='';sabiaDraft='';sessionStorage.removeItem('apete-sabia-history');ensureSabiaSession(true).then(()=>render()).catch(e=>{sabiaError=e.message;render();});}
});

$('#content').addEventListener('change', (event) => {
  const t = event.target;
  if(t.id==='demo-merchant-store' && state.ui.presentationMerchant){state.merchant.storeId=Number(t.value);state.ui.demoStoreId=state.merchant.storeId;state.ui.productEditor=0;state.ui.merchantPanelTab='pendentes';save();render();return;}
  if(t.id==='mp-offer'){const box=$('#mp-offer-price-field');if(box)box.hidden=!t.checked;return;}
  if(t.id==='sabia-city') {state.city=t.value;state.location=t.value;save();render();return;}
  if (t.id === 'filter-category') state.filters.category = t.value;
  if (t.id === 'filter-store') state.filters.storeId = t.value;
  if (t.id === 'filter-sort') state.filters.sort = t.value;
  save();
  if (['filter-category','filter-store','filter-sort'].includes(t.id)) render();
});
$('#content').addEventListener('submit', event=>{
  if(event.target.id==='merchant-product-form'){event.preventDefault();saveMerchantProduct(event.target);return;}
  if(event.target.id==='merchant-offer-form'){event.preventDefault();publishMerchantOffer();return;}
  if(event.target.id==='merchant-profile-form'){event.preventDefault();saveMerchantProfile();return;}
  if(event.target.id!=='sabia-form')return;
  event.preventDefault();
  const input=$('#sabia-input');
  if(input) sendToSabia(input.value);
});
$('#content').addEventListener('input', (event) => {
  const t = event.target;
  if (t.id === 'sabia-input') sabiaDraft=t.value;
  if (t.id === 'filter-query') { state.filters.query = t.value; save(); render(); }
  if (t.classList.contains('phone-only')) t.value = onlyDigits(t.value).slice(0, 11);
  if (t.id === 'customer-password-confirm' || t.id === 'merchant-register-password-confirm') {
    const first = $(t.id === 'customer-password-confirm' ? '#customer-password-field' : '#merchant-register-password');
    const feedback = $(t.id === 'customer-password-confirm' ? '#customer-password-feedback' : '#merchant-password-feedback');
    if (feedback) feedback.textContent = t.value && first?.value !== t.value ? 'As senhas não conferem.' : (t.value ? 'As senhas conferem.' : '');
  }
  if (t.classList.contains('name-only')) t.value = t.value.replace(/[^A-Za-zÀ-ÿ' ]+/g, '');
});

$('#demo-client-tab')?.addEventListener('click', () => {prepareClientForVideo();setPage('inicio');});
$('#demo-merchant-tab')?.addEventListener('click', () => {state.ui.presentationMerchant=true;state.merchant.storeId=state.ui.demoStoreId||1;state.ui.merchantPanelTab='pendentes';state.ui.productEditor=0;setPage('comerciante');});
$('#cart-button').addEventListener('click', openCartModal);
$('#user-button').addEventListener('click', () => {
  if (isMerchantView()) {state.ui.merchantPanelTab='cadastro';save();setPage('comerciante');}
  else setPage(isCustomerLogged() ? 'cliente' : 'entrar');
});
$('#locate').addEventListener('click', selectRegion);
$('#menu-toggle').addEventListener('click', openSidebar);
$('#sidebar-close').addEventListener('click', closeSidebar);
$('#scrim').addEventListener('click', closeSidebar);
$$('.side-nav a, .brand').forEach((link) => link.addEventListener('click', (event) => {
  const page = link.dataset.page;
  if (!page) return;
  event.preventDefault();
  if (page==='comerciante' && isMerchantView() && link.id==='customer-nav-link') {
    state.ui.merchantPanelTab='cadastro';save();
  }
  setPage(page);
}));

$('#modal').addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'close') closeModal();
  if (action === 'go-catalog') { state.filters = { query:'', category:'Todos', storeId:'0', sort:'relevancia' }; setPage('cardapio'); }
  if (action === 'qty-cart') updateCartQty(button.dataset.id, button.dataset.step);
  if (action === 'remove-cart') removeCartItem(button.dataset.id);
  if (action === 'go-checkout') goCheckout();
  if (action === 'back-to-cart') { cartStep = 'cart'; renderCartModal(); }
  if (action === 'place-order') placeOrder();
  if (action === 'sabia-confirm-add') confirmSabiaAdd();
  if (action === 'save-region') {const city=$('#regional-city')?.value;if(REGIONAL_CITIES.includes(city)){state.city=city;state.location=city;save();closeModal();render();}}
  if (action === 'select-payment') { selectedPayment = button.dataset.pay; renderCartModal(); }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!$('#modal').hidden) closeModal();
    else closeSidebar();
  }
});
