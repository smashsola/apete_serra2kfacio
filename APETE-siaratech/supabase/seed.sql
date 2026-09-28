-- Optional, repeatable demo seed for APETÊ.
insert into public.stores(id,public_id,name,category,city,delivery_fee,producer,cover,description,hero,demo,service_areas,delivery,pickup,verified,active)
values
('00000000-0000-0000-0000-000000000001',1,'Casa do Baião','Comida regional','Guaraciaba do Norte',600,false,'assets/images/cover-casa.webp','Pratos regionais, baião de dois, almoço executivo e combinações para compartilhar.','Baião, galinha caipira e comida de casa com aquele tempero da Serra.',true,array['Guaraciaba do Norte'],true,true,true,true),
('00000000-0000-0000-0000-000000000002',2,'Forno & Afeto','Padaria artesanal','Guaraciaba do Norte',450,false,'assets/images/cover-forno.webp','Pães, bolos, tapiocas, cafés e opções frescas para o café da manhã e da tarde.','Pães quentinhos, bolos e café passado na hora.',true,array['Guaraciaba do Norte'],true,true,true,true),
('00000000-0000-0000-0000-000000000003',3,'Quintal da Serra','Cozinha caseira','São Benedito',700,false,'assets/images/cover-quintal.webp','Comida caseira, marmitas, caldinhos e pratos bem servidos para o almoço ou jantar.','Receitas caseiras e porções que lembram comida de família.',true,array['São Benedito'],true,true,true,true),
('00000000-0000-0000-0000-000000000004',4,'Sítio Boa Vista','Produtor local','Guaraciaba do Norte',500,true,'assets/images/cover-sitio.webp','Hortaliças, frutas e produtos artesanais colhidos na Serra e enviados com frescor.','Frutas, verduras e produtos da roça direto para a sua mesa.',true,array['Guaraciaba do Norte'],true,true,true,true),
('00000000-0000-0000-0000-000000000005',5,'Serra Verde Orgânicos','Produtor local','Ibiapina',550,true,'assets/images/cover-serraverde.webp','Cestas, legumes, mel e itens naturais de pequenos produtores da região.','Orgânicos selecionados e cestas prontas para a semana.',true,array['Ibiapina'],true,true,true,true)
on conflict(public_id) do update set
name=excluded.name,category=excluded.category,city=excluded.city,delivery_fee=excluded.delivery_fee,producer=excluded.producer,
cover=excluded.cover,description=excluded.description,hero=excluded.hero,demo=excluded.demo,service_areas=excluded.service_areas,
delivery=excluded.delivery,pickup=excluded.pickup,verified=excluded.verified,active=excluded.active;

insert into public.products(id,public_id,store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,demo,active)
values
('10000000-0000-0000-0000-000000000001',1,'00000000-0000-0000-0000-000000000001','Baião da casa para dois','Baião de dois, frango grelhado, macaxeira e salada.','Regional',6200,20,'assets/images/prod-baiao.webp',0,false,'{}',2,true,true),
('10000000-0000-0000-0000-000000000002',2,'00000000-0000-0000-0000-000000000001','Galinha caipira com pirão','Prato completo com arroz, pirão e salada da casa.','Regional',3600,14,'assets/images/prod-galinha.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000003',3,'00000000-0000-0000-0000-000000000001','Escondidinho de carne','Purê de macaxeira, carne desfiada e queijo dourado.','Regional',3100,16,'assets/images/prod-escondidinho.webp',3900,true,'{}',null,true,true),
('10000000-0000-0000-0000-000000000004',4,'00000000-0000-0000-0000-000000000001','Macaxeira dourada','Porção crocante para compartilhar.','Acompanhamentos',1600,22,'assets/images/prod-macaxeira.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000005',5,'00000000-0000-0000-0000-000000000001','Suco de acerola','Copo de 400 ml preparado na hora.','Bebidas',900,30,'assets/images/prod-acerola.webp',1200,true,'{}',null,true,true),
('10000000-0000-0000-0000-000000000006',6,'00000000-0000-0000-0000-000000000002','Pão de fermentação lenta','Pão artesanal de 400 g, casca crocante e miolo macio.','Padaria',1800,18,'assets/images/prod-pao.webp',2400,true,'{}',null,true,true),
('10000000-0000-0000-0000-000000000007',7,'00000000-0000-0000-0000-000000000002','Bolo de milho caseiro','Fatia generosa, fofinha e com gostinho de interior.','Doces',1500,20,'assets/images/prod-bolo-milho.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000008',8,'00000000-0000-0000-0000-000000000002','Tapioca com queijo coalho','Tapioca recheada, feita na chapa e servida quentinha.','Padaria',1300,24,'assets/images/prod-tapioca.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000009',9,'00000000-0000-0000-0000-000000000002','Café coado','Café passado na hora, copo de 200 ml.','Bebidas',600,35,'assets/images/prod-cafe-coado.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000010',10,'00000000-0000-0000-0000-000000000002','Combo café da manhã','Pão, bolo de milho e café para começar bem o dia.','Padaria',2400,10,'assets/images/prod-combo-cafe.webp',3200,true,'{}',null,true,true),
('10000000-0000-0000-0000-000000000011',11,'00000000-0000-0000-0000-000000000003','Prato da Serra','Arroz, feijão, frango, legumes e salada.','Caseiro',2800,18,'assets/images/prod-prato-serra.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000012',12,'00000000-0000-0000-0000-000000000003','Caldinho de feijão','Porção de 350 ml, ideal para o fim da tarde.','Caseiro',1500,20,'assets/images/prod-caldinho.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000013',13,'00000000-0000-0000-0000-000000000003','Almoço vegetariano','Arroz, feijão verde, legumes e salada fresca.','Vegetariano',2600,16,'assets/images/prod-almoco-veg.webp',0,false,array['vegetariano'],null,true,true),
('10000000-0000-0000-0000-000000000014',14,'00000000-0000-0000-0000-000000000003','Panelada da Serra','Prato forte e bem temperado, servido com arroz.','Regional',3400,8,'assets/images/prod-panelada.webp',4300,true,'{}',null,true,true),
('10000000-0000-0000-0000-000000000015',15,'00000000-0000-0000-0000-000000000003','Suco de cajá','Copo de 400 ml, preparado com fruta natural.','Bebidas',900,25,'assets/images/prod-caja.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000016',16,'00000000-0000-0000-0000-000000000004','Banana da estação','Um quilo de bananas frescas da região.','Do produtor',700,30,'assets/images/prod-banana.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000017',17,'00000000-0000-0000-0000-000000000004','Café da Serra','Café torrado e moído, pacote de 250 g.','Do produtor',2200,15,'assets/images/prod-cafe-serra.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000018',18,'00000000-0000-0000-0000-000000000004','Geleia de goiaba','Pote artesanal de 250 g, produção local.','Do produtor',1700,14,'assets/images/prod-geleia-goiaba.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000019',19,'00000000-0000-0000-0000-000000000004','Cesta de hortaliças','Mix com alface, tomate, coentro e cheiro-verde.','Do produtor',2900,10,'assets/images/prod-cesta-hortalicas.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000020',20,'00000000-0000-0000-0000-000000000004','Tomate da horta','Tomates selecionados, vendidos por quilo.','Do produtor',1000,24,'assets/images/prod-tomate.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000021',21,'00000000-0000-0000-0000-000000000005','Cesta orgânica semanal','Legumes e verduras da semana, pronta para a família.','Do produtor',3900,8,'assets/images/prod-cesta-organica.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000022',22,'00000000-0000-0000-0000-000000000005','Mel da região','Pote de mel puro com 300 g.','Do produtor',2000,16,'assets/images/prod-mel.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000023',23,'00000000-0000-0000-0000-000000000005','Alface crespa','Maço fresco, colhido no dia.','Do produtor',500,30,'assets/images/prod-alface.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000024',24,'00000000-0000-0000-0000-000000000005','Cenoura orgânica','Pacote com 500 g de cenouras selecionadas.','Do produtor',800,25,'assets/images/prod-cenoura.webp',0,false,'{}',null,true,true),
('10000000-0000-0000-0000-000000000025',25,'00000000-0000-0000-0000-000000000005','Queijo coalho artesanal','Peça de 250 g produzida na região.','Do produtor',1800,12,'assets/images/prod-queijo-coalho.webp',0,false,'{}',null,true,true)
on conflict(public_id) do update set
store_id=excluded.store_id,name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,
stock=excluded.stock,image=excluded.image,old_price=excluded.old_price,last_batch=excluded.last_batch,preferences=excluded.preferences,
serves=excluded.serves,demo=excluded.demo,active=excluded.active;

select setval(pg_get_serial_sequence('public.stores','public_id'),greatest((select max(public_id) from public.stores),1),true);
select setval(pg_get_serial_sequence('public.products','public_id'),greatest((select max(public_id) from public.products),1),true);
