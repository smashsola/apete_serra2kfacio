-- APETÊ demo catalog seed
-- Safe to re-run: public_id is the stable demo key.
begin;

insert into public.stores (public_id,name,category,city,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values
(1,'Casa do Baião','Comida regional','Guaraciaba do Norte','Pratos regionais, baião de dois, almoço executivo e combinações para compartilhar.','Baião, galinha caipira e comida de casa com aquele tempero da Serra.',600,false,true,true,ARRAY['Guaraciaba do Norte']::text[],'assets/images/cover-casa.webp',true,true,true,'',''),
(2,'Forno & Afeto','Padaria artesanal','Guaraciaba do Norte','Pães, bolos, tapiocas, cafés e opções frescas para o café da manhã e da tarde.','Pães quentinhos, bolos e café passado na hora.',450,false,true,true,ARRAY['Guaraciaba do Norte']::text[],'assets/images/cover-forno.webp',true,true,true,'',''),
(3,'Quintal da Serra','Cozinha caseira','São Benedito','Comida caseira, marmitas, caldinhos e pratos bem servidos para o almoço ou jantar.','Receitas caseiras e porções que lembram comida de família.',700,false,true,true,ARRAY['São Benedito']::text[],'assets/images/cover-quintal.webp',true,true,true,'',''),
(4,'Sítio Boa Vista','Produtor local','Guaraciaba do Norte','Hortaliças, frutas e produtos artesanais colhidos na Serra e enviados com frescor.','Frutas, verduras e produtos da roça direto para a sua mesa.',500,true,true,true,ARRAY['Guaraciaba do Norte']::text[],'assets/images/cover-sitio.webp',true,true,true,'',''),
(5,'Serra Verde Orgânicos','Produtor local','Ibiapina','Cestas, legumes, mel e itens naturais de pequenos produtores da região.','Orgânicos selecionados e cestas prontas para a semana.',550,true,true,true,ARRAY['Ibiapina']::text[],'assets/images/cover-serraverde.webp',true,true,true,'','')
on conflict (public_id) do update set
  name=excluded.name,
  category=excluded.category,
  city=excluded.city,
  description=excluded.description,
  hero=excluded.hero,
  delivery_fee=excluded.delivery_fee,
  producer=excluded.producer,
  delivery=excluded.delivery,
  pickup=excluded.pickup,
  service_areas=excluded.service_areas,
  cover=excluded.cover,
  verified=excluded.verified,
  active=excluded.active,
  demo=excluded.demo,
  instagram=excluded.instagram,
  contact_phone=excluded.contact_phone;

insert into public.products (
  public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo
)
values
(1,(select id from public.stores where public_id=1),'Baião da casa para dois','Baião de dois, frango grelhado, macaxeira e salada.','Regional',6200,20,'assets/images/prod-baiao.webp',0,false,'{}'::text[],2,true,true),
(2,(select id from public.stores where public_id=1),'Galinha caipira com pirão','Prato completo com arroz, pirão e salada da casa.','Regional',3600,14,'assets/images/prod-galinha.webp',0,false,'{}'::text[],null,true,true),
(3,(select id from public.stores where public_id=1),'Escondidinho de carne','Purê de macaxeira, carne desfiada e queijo dourado.','Regional',3100,16,'assets/images/prod-escondidinho.webp',3900,true,'{}'::text[],null,true,true),
(4,(select id from public.stores where public_id=1),'Macaxeira dourada','Porção crocante para compartilhar.','Acompanhamentos',1600,22,'assets/images/prod-macaxeira.webp',0,false,'{}'::text[],null,true,true),
(5,(select id from public.stores where public_id=1),'Suco de acerola','Copo de 400 ml preparado na hora.','Bebidas',900,30,'assets/images/prod-acerola.webp',1200,true,'{}'::text[],null,true,true),
(6,(select id from public.stores where public_id=2),'Pão de fermentação lenta','Pão artesanal de 400 g, casca crocante e miolo macio.','Padaria',1800,18,'assets/images/prod-pao.webp',2400,true,'{}'::text[],null,true,true),
(7,(select id from public.stores where public_id=2),'Bolo de milho caseiro','Fatia generosa, fofinha e com gostinho de interior.','Doces',1500,20,'assets/images/prod-bolo-milho.webp',0,false,'{}'::text[],null,true,true),
(8,(select id from public.stores where public_id=2),'Tapioca com queijo coalho','Tapioca recheada, feita na chapa e servida quentinha.','Padaria',1300,24,'assets/images/prod-tapioca.webp',0,false,'{}'::text[],null,true,true),
(9,(select id from public.stores where public_id=2),'Café coado','Café passado na hora, copo de 200 ml.','Bebidas',600,35,'assets/images/prod-cafe-coado.webp',0,false,'{}'::text[],null,true,true),
(10,(select id from public.stores where public_id=2),'Combo café da manhã','Pão, bolo de milho e café para começar bem o dia.','Padaria',2400,10,'assets/images/prod-combo-cafe.webp',3200,true,'{}'::text[],null,true,true),
(11,(select id from public.stores where public_id=3),'Prato da Serra','Arroz, feijão, frango, legumes e salada.','Caseiro',2800,18,'assets/images/prod-prato-serra.webp',0,false,'{}'::text[],null,true,true),
(12,(select id from public.stores where public_id=3),'Caldinho de feijão','Porção de 350 ml, ideal para o fim da tarde.','Caseiro',1500,20,'assets/images/prod-caldinho.webp',0,false,'{}'::text[],null,true,true),
(13,(select id from public.stores where public_id=3),'Almoço vegetariano','Arroz, feijão verde, legumes e salada fresca.','Vegetariano',2600,16,'assets/images/prod-almoco-veg.webp',0,false,ARRAY['vegetariano']::text[],null,true,true),
(14,(select id from public.stores where public_id=3),'Panelada da Serra','Prato forte e bem temperado, servido com arroz.','Regional',3400,8,'assets/images/prod-panelada.webp',4300,true,'{}'::text[],null,true,true),
(15,(select id from public.stores where public_id=3),'Suco de cajá','Copo de 400 ml, preparado com fruta natural.','Bebidas',900,25,'assets/images/prod-caja.webp',0,false,'{}'::text[],null,true,true),
(16,(select id from public.stores where public_id=4),'Banana da estação','Um quilo de bananas frescas da região.','Do produtor',700,30,'assets/images/prod-banana.webp',0,false,'{}'::text[],null,true,true),
(17,(select id from public.stores where public_id=4),'Café da Serra','Café torrado e moído, pacote de 250 g.','Do produtor',2200,15,'assets/images/prod-cafe-serra.webp',0,false,'{}'::text[],null,true,true),
(18,(select id from public.stores where public_id=4),'Geleia de goiaba','Pote artesanal de 250 g, produção local.','Do produtor',1700,14,'assets/images/prod-geleia-goiaba.webp',0,false,'{}'::text[],null,true,true),
(19,(select id from public.stores where public_id=4),'Cesta de hortaliças','Mix com alface, tomate, coentro e cheiro-verde.','Do produtor',2900,10,'assets/images/prod-cesta-hortalicas.webp',0,false,'{}'::text[],null,true,true),
(20,(select id from public.stores where public_id=4),'Tomate da horta','Tomates selecionados, vendidos por quilo.','Do produtor',1000,24,'assets/images/prod-tomate.webp',0,false,'{}'::text[],null,true,true),
(21,(select id from public.stores where public_id=5),'Cesta orgânica semanal','Legumes e verduras da semana, pronta para a família.','Do produtor',3900,8,'assets/images/prod-cesta-organica.webp',0,false,'{}'::text[],null,true,true),
(22,(select id from public.stores where public_id=5),'Mel da região','Pote de mel puro com 300 g.','Do produtor',2000,16,'assets/images/prod-mel.webp',0,false,'{}'::text[],null,true,true),
(23,(select id from public.stores where public_id=5),'Alface crespa','Maço fresco, colhido no dia.','Do produtor',500,30,'assets/images/prod-alface.webp',0,false,'{}'::text[],null,true,true),
(24,(select id from public.stores where public_id=5),'Cenoura orgânica','Pacote com 500 g de cenouras selecionadas.','Do produtor',800,25,'assets/images/prod-cenoura.webp',0,false,'{}'::text[],null,true,true),
(25,(select id from public.stores where public_id=5),'Queijo coalho artesanal','Peça de 250 g produzida na região.','Do produtor',1800,12,'assets/images/prod-queijo-coalho.webp',0,false,'{}'::text[],null,true,true)
on conflict (public_id) do update set
  store_id=excluded.store_id,
  name=excluded.name,
  description=excluded.description,
  category=excluded.category,
  price=excluded.price,
  stock=excluded.stock,
  image=excluded.image,
  old_price=excluded.old_price,
  last_batch=excluded.last_batch,
  preferences=excluded.preferences,
  serves=excluded.serves,
  active=excluded.active,
  demo=excluded.demo;

select setval(pg_get_serial_sequence('public.stores','public_id'),coalesce((select max(public_id) from public.stores),1),true);
select setval(pg_get_serial_sequence('public.products','public_id'),coalesce((select max(public_id) from public.products),1),true);

commit;


-- Regional catalog v2: 18 perfis / 90 produtos
alter table public.stores add column if not exists address text not null default '';
grant update(address) on public.stores to authenticated;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(1,'Casa do Baião','Comida regional','Guaraciaba do Norte','Rua Senador Catunda, Centro','Pratos regionais, baião de dois, almoço executivo e combinações para compartilhar.','Baião, galinha caipira e comida de casa com aquele tempero da Serra.',600,false,true,true,ARRAY['Guaraciaba do Norte']::text[],'assets/images/cover-casa.webp',true,true,true,'@casadobaiao','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(2,'Forno & Afeto','Padaria artesanal','Guaraciaba do Norte','Rua Monsenhor Eurico, Centro','Pães, bolos, tapiocas, cafés e opções frescas para o café da manhã e da tarde.','Pães quentinhos, bolos e café passado na hora.',450,false,true,true,ARRAY['Guaraciaba do Norte']::text[],'assets/images/cover-forno.webp',true,true,true,'@fornoeafeto','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(3,'Quintal da Serra','Cozinha caseira','São Benedito','Rua Capitão Miranda, Centro','Comida caseira, marmitas, caldinhos e pratos bem servidos para o almoço ou jantar.','Receitas caseiras e porções que lembram comida de família.',700,false,true,true,ARRAY['São Benedito']::text[],'assets/images/cover-quintal.webp',true,true,true,'@quintaldaserra','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(4,'Sítio Boa Vista','Produtor local','Guaraciaba do Norte','Distrito Várzea dos Espinhos, Zona Rural','Hortaliças, frutas e produtos artesanais colhidos na Serra e enviados com frescor.','Frutas, verduras e produtos da roça direto para a sua mesa.',500,true,true,true,ARRAY['Guaraciaba do Norte']::text[],'assets/images/cover-sitio.webp',true,true,true,'@sitioboavista','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(5,'Serra Verde Orgânicos','Produtor local','Ibiapina','Rua Padre Ibiapina, Centro (ponto de retirada)','Cestas, legumes, mel e itens naturais de pequenos produtores da região.','Orgânicos selecionados e cestas prontas para a semana.',550,true,true,true,ARRAY['Ibiapina']::text[],'assets/images/cover-serraverde.webp',true,true,true,'@serraverdeorganicos','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(6,'Pão da Praça','Padaria','São Benedito','Praça 25 de Novembro, Centro','Padaria de bairro com pães do dia, salgados, bolos simples e café.','Pão quente cedo, lanche rápido e fornada promocional no fim do dia.',450,false,true,true,ARRAY['São Benedito']::text[],'assets/images/product-bakery.webp',true,true,true,'@paodapraca','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(7,'Padaria Neblina','Padaria e café','Ubajara','Avenida dos Constituintes, Centro','Pães macios, bolos regionais, café e itens de vitrine preparados diariamente.','Padaria de clima serrano com café, pães e bolos para manhã e tarde.',550,false,true,true,ARRAY['Ubajara']::text[],'assets/images/cover-forno.webp',true,true,true,'@padarianeblina','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(8,'Doce Encanto da Serra','Doceria','Guaraciaba do Norte','Rua Prefeito Valdemiro Ferreira Gomes, Centro','Doces individuais, bolo no pote, pudim e caixas para dividir ou presentear.','Sobremesas caseiras e porções pequenas para matar a vontade de doce.',400,false,true,true,ARRAY['Guaraciaba do Norte']::text[],'assets/images/product-artisanal.webp',true,true,true,'@doceencantodaserra','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(9,'Açúcar & Canela','Doceria e bolos','Tianguá','Rua 12 de Agosto, Centro','Bolos, churros, palha italiana e sobremesas montadas em porções individuais.','Doces de vitrine, bolos por fatia e sobremesas caprichadas.',600,false,true,true,ARRAY['Tianguá']::text[],'assets/images/product-artisanal.webp',true,true,true,'@acucarecanela','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(10,'Flor de Cacau','Café e doceria','Ubajara','Rua Juvêncio Pereira, Centro','Tortas, brownies, trufas e bebidas de café para lanche e sobremesa.','Chocolate, café e sobremesas para uma pausa no centro de Ubajara.',600,false,true,true,ARRAY['Ubajara']::text[],'assets/images/product-artisanal.webp',true,true,true,'@flordecacau','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(11,'Chapa do Norte','Lanchonete','Guaraciaba do Norte','Rua Capitão Ferreira, Centro','Hambúrgueres, sanduíches, cachorro-quente, batata e sucos para lanche rápido.','Lanches de chapa e porções para pedir à noite ou no fim da tarde.',450,false,true,true,ARRAY['Guaraciaba do Norte']::text[],'assets/images/product-regional.webp',true,true,true,'@chapadonorte','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(12,'Ponto do Cuscuz','Café regional','São Benedito','Avenida Tabajara, Centro','Cuscuz recheado, tapioca, café e bolos regionais em combinações de café da manhã.','Café regional simples, com cuscuz e tapioca preparados na hora.',500,false,true,true,ARRAY['São Benedito']::text[],'assets/images/product-caseiro.webp',true,true,true,'@pontodocuscuz','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(13,'Massa da Serra','Pizzaria','Tianguá','Avenida Prefeito Jacques Nunes, Centro','Pizzas tradicionais e vegetarianas, com tamanhos para uma pessoa ou para dividir.','Pizza assada na hora com sabores clássicos para jantar ou compartilhar.',700,false,true,true,ARRAY['Tianguá']::text[],'assets/images/product-caseiro.webp',true,true,true,'@massadaserra','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(14,'Panelinha Ibiapaba','Restaurante caseiro','Ibiapina','Avenida Pedro Ferreira de Assis, Centro','Marmitas e pratos feitos com opções de frango, carne, peixe e vegetariana.','Almoço de todo dia com comida caseira, porção bem servida e acompanhamentos.',650,false,true,true,ARRAY['Ibiapina']::text[],'assets/images/product-caseiro.webp',true,true,true,'@panelinhaibiapaba','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(15,'Café Jatobá','Cafeteria','Ubajara','Rua José Agapito Pereira, Centro','Café coado, cappuccino, pão de queijo, sanduíches e bolos para café e lanche.','Café da Serra com opções rápidas para manhã, tarde ou intervalo.',550,false,true,true,ARRAY['Ubajara']::text[],'assets/images/prod-cafe-serra.webp',true,true,true,'@cafejatoba','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(16,'Horta Pedra Branca','Produtor local','São Benedito','Sítio Jussara, Zona Rural','Folhas, temperos e legumes colhidos para cestas e compras da semana.','Hortaliças frescas e cesta de salada montada com produção local.',600,true,true,true,ARRAY['São Benedito']::text[],'assets/images/product-produce.webp',true,true,true,'@hortapedrabranca','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(17,'Mel & Raiz da Serra','Produtor artesanal','Ubajara','CE-187, Zona Rural','Mel, geleias, rapadura, farinha e outros produtos artesanais de origem local.','Itens da roça e produtos artesanais para café da manhã, receitas e despensa.',650,true,true,true,ARRAY['Ubajara']::text[],'assets/images/cover-sitio.webp',true,true,true,'@meleraiz','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.stores(public_id,name,category,city,address,description,hero,delivery_fee,producer,delivery,pickup,service_areas,cover,verified,active,demo,instagram,contact_phone)
values(18,'Roçado da Ibiapaba','Produtor local','Tianguá','Sítio Bom Jesus, acesso pela CE-187','Raízes, frutas, feijão e cestas sazonais vindas do roçado.','Produtos básicos da roça com entrega em lotes pequenos conforme a colheita.',700,true,true,true,ARRAY['Tianguá']::text[],'assets/images/product-produce.webp',true,true,true,'@rocadodaibiapaba','')
on conflict(public_id) do update set name=excluded.name,category=excluded.category,city=excluded.city,address=excluded.address,description=excluded.description,hero=excluded.hero,delivery_fee=excluded.delivery_fee,producer=excluded.producer,delivery=excluded.delivery,pickup=excluded.pickup,service_areas=excluded.service_areas,cover=excluded.cover,verified=excluded.verified,active=excluded.active,demo=excluded.demo,instagram=excluded.instagram;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(26,(select id from public.stores where public_id=6),'Pão francês da fornada','Pacote com 6 pães franceses assados no dia, casca leve e miolo macio.','Padaria',900,30,'assets/images/product-bakery.webp',0,false,'{}'::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(27,(select id from public.stores where public_id=6),'Sonho de creme','Massa macia recheada com creme de confeiteiro e finalizada com açúcar.','Doces',700,18,'assets/images/product-bakery.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(28,(select id from public.stores where public_id=6),'Bolo fofo de laranja','Fatia grande de bolo caseiro de laranja, úmido e sem recheio pesado.','Bolos',900,16,'assets/images/prod-bolo-milho.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(29,(select id from public.stores where public_id=6),'Cuscuz com queijo coalho','Cuscuz de milho feito na hora com queijo coalho dourado na chapa.','Café da manhã',1400,20,'assets/images/prod-tapioca.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(30,(select id from public.stores where public_id=6),'Kit fim de fornada','Seleção do fim do dia com 4 pães e 2 salgados ainda próprios para consumo no mesmo dia.','Última Fornada',1200,8,'assets/images/product-bakery.webp',1800,true,'{}'::text[],2,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(31,(select id from public.stores where public_id=7),'Pão de coco','Pão macio levemente adocicado com coco, bom para café da manhã ou lanche.','Padaria',1100,18,'assets/images/product-bakery.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(32,(select id from public.stores where public_id=7),'Croissant de queijo','Croissant amanteigado recheado com queijo, assado até ficar dourado.','Padaria',1300,14,'assets/images/product-bakery.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(33,(select id from public.stores where public_id=7),'Pão de queijo','Porção com 8 unidades pequenas de pão de queijo assadas na hora.','Padaria',1500,20,'assets/images/prod-queijo-coalho.webp',0,false,ARRAY['vegetariano']::text[],2,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(34,(select id from public.stores where public_id=7),'Bolo de macaxeira','Fatia de bolo de macaxeira com coco, textura cremosa e sabor caseiro.','Bolos',1000,15,'assets/images/product-bakery.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(35,(select id from public.stores where public_id=7),'Cesta da fornada do dia','Combo com pães e duas fatias de bolo selecionados entre os itens restantes da vitrine.','Última Fornada',1800,6,'assets/images/product-bakery.webp',2600,true,'{}'::text[],2,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(36,(select id from public.stores where public_id=8),'Brownie de chocolate','Quadrado de brownie úmido com chocolate intenso e casquinha fina.','Doces',1000,16,'assets/images/product-artisanal.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(37,(select id from public.stores where public_id=8),'Brigadeiro artesanal','Caixa com 6 brigadeiros tradicionais enrolados no dia.','Doces',1500,20,'assets/images/product-artisanal.webp',0,false,ARRAY['vegetariano']::text[],2,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(38,(select id from public.stores where public_id=8),'Bolo no pote de ninho','Camadas de massa branca, creme de leite em pó e cobertura suave.','Sobremesas',1400,14,'assets/images/product-artisanal.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(39,(select id from public.stores where public_id=8),'Pudim caseiro','Fatia generosa de pudim de leite com calda de caramelo.','Sobremesas',1200,12,'assets/images/product-artisanal.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(40,(select id from public.stores where public_id=8),'Caixa mini doces','Caixa com 12 mini doces variados para dividir ou presentear.','Doces',3200,8,'assets/images/product-artisanal.webp',0,false,ARRAY['vegetariano']::text[],4,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(41,(select id from public.stores where public_id=9),'Fatia red velvet','Fatia de bolo vermelho com recheio cremoso e cobertura leve.','Bolos',1600,12,'assets/images/product-artisanal.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(42,(select id from public.stores where public_id=9),'Churros com doce de leite','Porção com 6 mini churros polvilhados com açúcar e canela.','Doces',1500,16,'assets/images/product-artisanal.webp',0,false,ARRAY['vegetariano']::text[],2,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(43,(select id from public.stores where public_id=9),'Palha italiana','Doce de brigadeiro com biscoito em quadrados, porção com 4 unidades.','Doces',1300,18,'assets/images/product-artisanal.webp',0,false,ARRAY['vegetariano']::text[],2,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(44,(select id from public.stores where public_id=9),'Copo da felicidade','Copo com camadas de brownie, creme e chocolate para sobremesa individual.','Sobremesas',1800,12,'assets/images/product-artisanal.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(45,(select id from public.stores where public_id=9),'Bolo de cenoura com chocolate','Fatia de bolo de cenoura fofinho com cobertura de chocolate.','Bolos',1100,14,'assets/images/product-artisanal.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(46,(select id from public.stores where public_id=10),'Torta de chocolate','Fatia de torta com base macia e creme de chocolate.','Sobremesas',1700,12,'assets/images/product-artisanal.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(47,(select id from public.stores where public_id=10),'Cheesecake de frutas vermelhas','Fatia cremosa com base de biscoito e calda de frutas vermelhas.','Sobremesas',1900,10,'assets/images/product-artisanal.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(48,(select id from public.stores where public_id=10),'Cappuccino da casa','Bebida quente de café com leite e espuma, copo de 250 ml.','Bebidas',1200,20,'assets/images/prod-cafe-serra.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(49,(select id from public.stores where public_id=10),'Brownie com sorvete','Brownie aquecido acompanhado de uma bola de sorvete de creme.','Sobremesas',1900,10,'assets/images/product-artisanal.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(50,(select id from public.stores where public_id=10),'Caixa de trufas','Caixa com 8 trufas de chocolate em sabores variados.','Doces',2800,10,'assets/images/product-artisanal.webp',0,false,ARRAY['vegetariano']::text[],3,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(51,(select id from public.stores where public_id=11),'X-burger da casa','Pão, carne bovina, queijo, alface, tomate e molho da casa.','Lanches',1900,20,'assets/images/product-regional.webp',0,false,'{}'::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(52,(select id from public.stores where public_id=11),'Sanduíche de frango','Pão tostado com frango desfiado, queijo, salada e molho.','Lanches',1800,18,'assets/images/product-regional.webp',0,false,'{}'::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(53,(select id from public.stores where public_id=11),'Batata frita crocante','Porção de batata frita com sal e molho separado.','Porções',1600,24,'assets/images/product-regional.webp',0,false,ARRAY['vegetariano']::text[],2,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(54,(select id from public.stores where public_id=11),'Cachorro-quente completo','Pão, salsicha, molho, milho, batata palha e queijo ralado.','Lanches',1400,20,'assets/images/product-regional.webp',0,false,'{}'::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(55,(select id from public.stores where public_id=11),'Suco de cajá 400 ml','Suco de cajá preparado gelado, sem mistura de outras frutas.','Bebidas',900,24,'assets/images/prod-caja.webp',0,false,ARRAY['vegano','vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(56,(select id from public.stores where public_id=12),'Cuscuz com carne de sol','Cuscuz de milho com carne de sol desfiada e queijo coalho.','Café regional',1900,18,'assets/images/product-caseiro.webp',0,false,'{}'::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(57,(select id from public.stores where public_id=12),'Cuscuz com ovo e queijo','Cuscuz com ovo mexido e queijo coalho, opção sem carne.','Café regional',1500,20,'assets/images/product-caseiro.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(58,(select id from public.stores where public_id=12),'Tapioca de frango','Tapioca na chapa recheada com frango desfiado e queijo.','Tapiocas',1500,20,'assets/images/prod-tapioca.webp',0,false,'{}'::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(59,(select id from public.stores where public_id=12),'Café com leite','Café coado com leite, servido quente em copo de 250 ml.','Bebidas',700,30,'assets/images/prod-cafe-coado.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(60,(select id from public.stores where public_id=12),'Bolo pé de moleque','Fatia de bolo regional de massa de mandioca com castanha e especiarias.','Bolos',1100,12,'assets/images/product-caseiro.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(61,(select id from public.stores where public_id=13),'Pizza muçarela média','Pizza média com molho de tomate, muçarela, tomate e orégano.','Pizzas',3600,12,'assets/images/product-caseiro.webp',0,false,ARRAY['vegetariano']::text[],2,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(62,(select id from public.stores where public_id=13),'Pizza calabresa média','Pizza média com molho, muçarela, calabresa e cebola.','Pizzas',3900,12,'assets/images/product-caseiro.webp',0,false,'{}'::text[],2,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(63,(select id from public.stores where public_id=13),'Pizza frango cremosa média','Pizza média com frango desfiado, queijo e creme de queijo.','Pizzas',4200,10,'assets/images/product-caseiro.webp',0,false,'{}'::text[],2,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(64,(select id from public.stores where public_id=13),'Pizza marguerita média','Pizza média com muçarela, tomate, manjericão e orégano.','Pizzas',3800,10,'assets/images/product-caseiro.webp',0,false,ARRAY['vegetariano']::text[],2,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(65,(select id from public.stores where public_id=13),'Combo pizza e refrigerante','Uma pizza média de muçarela e refrigerante de 1 litro.','Combos',4500,8,'assets/images/product-caseiro.webp',0,false,ARRAY['vegetariano']::text[],3,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(66,(select id from public.stores where public_id=14),'Marmita de frango grelhado','Arroz, feijão, frango grelhado, macaxeira e salada do dia.','Almoço',2600,18,'assets/images/prod-prato-serra.webp',0,false,'{}'::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(67,(select id from public.stores where public_id=14),'Carne de panela completa','Arroz, feijão, carne de panela com legumes e farofa.','Almoço',3000,16,'assets/images/product-caseiro.webp',0,false,'{}'::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(68,(select id from public.stores where public_id=14),'Peixe grelhado com legumes','Filé de peixe grelhado com arroz, legumes e salada.','Almoço',3200,12,'assets/images/product-caseiro.webp',0,false,'{}'::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(69,(select id from public.stores where public_id=14),'Marmita vegetariana','Arroz, feijão verde, legumes refogados, macaxeira e salada.','Vegetariano',2400,16,'assets/images/prod-almoco-veg.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(70,(select id from public.stores where public_id=14),'Feijoada individual','Feijoada com arroz, farofa e couve, porção individual.','Almoço',2900,10,'assets/images/product-caseiro.webp',0,false,'{}'::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(71,(select id from public.stores where public_id=15),'Café coado da Serra','Café filtrado servido na hora, 250 ml.','Bebidas',700,30,'assets/images/prod-cafe-serra.webp',0,false,ARRAY['vegano','vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(72,(select id from public.stores where public_id=15),'Cappuccino cremoso','Café com leite vaporizado e espuma, 250 ml.','Bebidas',1200,20,'assets/images/prod-cafe-serra.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(73,(select id from public.stores where public_id=15),'Pão de queijo grande','Porção com 3 pães de queijo grandes, assados no dia.','Lanches',1300,18,'assets/images/prod-queijo-coalho.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(74,(select id from public.stores where public_id=15),'Sanduíche natural de frango','Pão macio com frango, cenoura, alface e creme leve.','Lanches',1600,15,'assets/images/product-bakery.webp',0,false,'{}'::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(75,(select id from public.stores where public_id=15),'Bolo de banana com canela','Fatia de bolo caseiro de banana com canela.','Bolos',1000,14,'assets/images/prod-banana.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(76,(select id from public.stores where public_id=16),'Alface crespa','Unidade de alface crespa colhida recentemente e higienizada externamente.','Hortaliças',500,30,'assets/images/prod-alface.webp',0,false,ARRAY['vegano','vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(77,(select id from public.stores where public_id=16),'Cheiro-verde','Maço de cebolinha e coentro para temperos e finalizações.','Hortaliças',400,35,'assets/images/product-produce.webp',0,false,ARRAY['vegano','vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(78,(select id from public.stores where public_id=16),'Tomate da Serra 1 kg','Quilo de tomates selecionados para salada, molho ou preparo quente.','Hortaliças',900,24,'assets/images/prod-tomate.webp',0,false,ARRAY['vegano','vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(79,(select id from public.stores where public_id=16),'Cenoura 1 kg','Quilo de cenouras selecionadas, boas para salada, sopa e refogado.','Hortaliças',800,24,'assets/images/prod-cenoura.webp',0,false,ARRAY['vegano','vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(80,(select id from public.stores where public_id=16),'Cesta de salada','Cesta com alface, tomate, cenoura, pepino e cheiro-verde para a semana.','Cestas',2400,12,'assets/images/prod-cesta-hortalicas.webp',0,false,ARRAY['vegano','vegetariano']::text[],3,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(81,(select id from public.stores where public_id=17),'Mel artesanal 500 g','Pote de mel artesanal de 500 g, indicado para café da manhã e receitas.','Artesanais',2600,16,'assets/images/prod-mel.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(82,(select id from public.stores where public_id=17),'Geleia de goiaba 250 g','Geleia artesanal de goiaba para pães, bolos e acompanhamentos.','Artesanais',1600,18,'assets/images/prod-geleia-goiaba.webp',0,false,ARRAY['vegano','vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(83,(select id from public.stores where public_id=17),'Rapadura tradicional','Tablete de rapadura artesanal, sabor intenso de cana.','Artesanais',900,20,'assets/images/product-artisanal.webp',0,false,ARRAY['vegano','vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(84,(select id from public.stores where public_id=17),'Farinha de mandioca 1 kg','Farinha de mandioca torrada para acompanhamentos e receitas regionais.','Despensa',1200,18,'assets/images/product-artisanal.webp',0,false,ARRAY['vegano','vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(85,(select id from public.stores where public_id=17),'Queijo coalho artesanal 500 g','Peça de queijo coalho para café da manhã, tapioca ou preparo na chapa.','Artesanais',2800,12,'assets/images/prod-queijo-coalho.webp',0,false,ARRAY['vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(86,(select id from public.stores where public_id=18),'Banana prata 1 kg','Quilo de banana prata selecionada conforme maturação do lote.','Frutas',800,28,'assets/images/prod-banana.webp',0,false,ARRAY['vegano','vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(87,(select id from public.stores where public_id=18),'Macaxeira 1 kg','Raiz de macaxeira descascada e pronta para cozinhar.','Raízes',900,24,'assets/images/prod-macaxeira.webp',0,false,ARRAY['vegano','vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(88,(select id from public.stores where public_id=18),'Batata-doce 1 kg','Quilo de batata-doce selecionada para cozimento, forno ou purê.','Raízes',800,24,'assets/images/product-produce.webp',0,false,ARRAY['vegano','vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(89,(select id from public.stores where public_id=18),'Feijão verde 1 kg','Feijão verde fresco para baião, saladas e acompanhamentos.','Grãos',1400,18,'assets/images/product-produce.webp',0,false,ARRAY['vegano','vegetariano']::text[],null,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

insert into public.products(public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,demo)
values(90,(select id from public.stores where public_id=18),'Cesta da roça','Cesta com banana, macaxeira, batata-doce, feijão verde e item sazonal do dia.','Cestas',3200,10,'assets/images/prod-cesta-organica.webp',0,false,ARRAY['vegano','vegetariano']::text[],3,true,true)
on conflict(public_id) do update set store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,serves=excluded.serves,active=excluded.active,demo=excluded.demo;

select setval(pg_get_serial_sequence('public.stores','public_id'),coalesce((select max(public_id) from public.stores),1),true);
select setval(pg_get_serial_sequence('public.products','public_id'),coalesce((select max(public_id) from public.products),1),true);


