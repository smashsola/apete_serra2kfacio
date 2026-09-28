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
