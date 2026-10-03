'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const KEY = 'apete_serra_v14';
const REGIONAL_CITIES = ['Guaraciaba do Norte','Tianguá','São Benedito','Ubajara','Ibiapina','Viçosa do Ceará','Carnaubal','Croatá','Ipu'];
const REGIONAL_CITY_CENTERS = Object.freeze({
  'Guaraciaba do Norte':[-4.16694,-40.7475],
  'Tianguá':[-3.73222,-40.99167],
  'São Benedito':[-4.0496,-40.9459],
  'Ubajara':[-3.8534,-40.9186],
  'Ibiapina':[-3.92333,-40.88944],
  'Viçosa do Ceará':[-3.5652,-41.0919],
  'Carnaubal':[-4.1624,-40.9421],
  'Croatá':[-4.41317,-40.90254],
  'Ipu':[-4.32222,-40.71083]
});

const money = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((cents || 0) / 100);
const dateTime = (iso) => new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const asset = (name) => `assets/images/${name}`;
const img = (tag, lock, w = 1200, h = 800) => asset('cover-casa.webp');

const STORES = [
  {
    "id": 1,
    "name": "Casa do Baião",
    "category": "Comida regional",
    "city": "Guaraciaba do Norte",
    "address": "Rua Senador Catunda, Centro",
    "fee": 600,
    "time": "28–40 min",
    "rating": 4.9,
    "open": true,
    "producer": false,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@casadobaiao",
    "instagram": "@casadobaiao",
    "cover": "assets/images/cover-casa.webp",
    "desc": "Pratos regionais, baião de dois, almoço executivo e combinações para compartilhar.",
    "hero": "Baião, galinha caipira e comida de casa com aquele tempero da Serra.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "Guaraciaba do Norte"
    ],
    "demo": true
  },
  {
    "id": 2,
    "name": "Forno & Afeto",
    "category": "Padaria artesanal",
    "city": "Guaraciaba do Norte",
    "address": "Rua Monsenhor Eurico, Centro",
    "fee": 450,
    "time": "22–35 min",
    "rating": 4.8,
    "open": true,
    "producer": false,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@fornoeafeto",
    "instagram": "@fornoeafeto",
    "cover": "assets/images/cover-forno.webp",
    "desc": "Pães, bolos, tapiocas, cafés e opções frescas para o café da manhã e da tarde.",
    "hero": "Pães quentinhos, bolos e café passado na hora.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "Guaraciaba do Norte"
    ],
    "demo": true
  },
  {
    "id": 3,
    "name": "Quintal da Serra",
    "category": "Cozinha caseira",
    "city": "São Benedito",
    "address": "Rua Capitão Miranda, Centro",
    "fee": 700,
    "time": "32–48 min",
    "rating": 4.7,
    "open": true,
    "producer": false,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@quintaldaserra",
    "instagram": "@quintaldaserra",
    "cover": "assets/images/cover-quintal.webp",
    "desc": "Comida caseira, marmitas, caldinhos e pratos bem servidos para o almoço ou jantar.",
    "hero": "Receitas caseiras e porções que lembram comida de família.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "São Benedito"
    ],
    "demo": true
  },
  {
    "id": 4,
    "name": "Sítio Boa Vista",
    "category": "Produtor local",
    "city": "Guaraciaba do Norte",
    "address": "Distrito Várzea dos Espinhos, Zona Rural",
    "fee": 500,
    "time": "30–45 min",
    "rating": 4.9,
    "open": true,
    "producer": true,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@sitioboavista",
    "instagram": "@sitioboavista",
    "cover": "assets/images/cover-sitio.webp",
    "desc": "Hortaliças, frutas e produtos artesanais colhidos na Serra e enviados com frescor.",
    "hero": "Frutas, verduras e produtos da roça direto para a sua mesa.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "Guaraciaba do Norte"
    ],
    "demo": true
  },
  {
    "id": 5,
    "name": "Serra Verde Orgânicos",
    "category": "Produtor local",
    "city": "Ibiapina",
    "address": "Rua Padre Ibiapina, Centro (ponto de retirada)",
    "fee": 550,
    "time": "35–50 min",
    "rating": 4.8,
    "open": true,
    "producer": true,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@serraverdeorganicos",
    "instagram": "@serraverdeorganicos",
    "cover": "assets/images/cover-serraverde.webp",
    "desc": "Cestas, legumes, mel e itens naturais de pequenos produtores da região.",
    "hero": "Orgânicos selecionados e cestas prontas para a semana.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "Ibiapina"
    ],
    "demo": true
  },
  {
    "id": 6,
    "name": "Pão da Praça",
    "category": "Padaria",
    "city": "São Benedito",
    "address": "Praça 25 de Novembro, Centro",
    "fee": 450,
    "time": "20–35 min",
    "rating": null,
    "open": true,
    "producer": false,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@paodapraca",
    "instagram": "@paodapraca",
    "cover": "assets/images/product-bakery.webp",
    "desc": "Padaria de bairro com pães do dia, salgados, bolos simples e café.",
    "hero": "Pão quente cedo, lanche rápido e fornada promocional no fim do dia.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "São Benedito"
    ],
    "demo": true
  },
  {
    "id": 7,
    "name": "Padaria Neblina",
    "category": "Padaria e café",
    "city": "Ubajara",
    "address": "Avenida dos Constituintes, Centro",
    "fee": 550,
    "time": "25–40 min",
    "rating": null,
    "open": true,
    "producer": false,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@padarianeblina",
    "instagram": "@padarianeblina",
    "cover": "assets/images/cover-forno.webp",
    "desc": "Pães macios, bolos regionais, café e itens de vitrine preparados diariamente.",
    "hero": "Padaria de clima serrano com café, pães e bolos para manhã e tarde.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "Ubajara"
    ],
    "demo": true
  },
  {
    "id": 8,
    "name": "Doce Encanto da Serra",
    "category": "Doceria",
    "city": "Guaraciaba do Norte",
    "address": "Rua Prefeito Valdemiro Ferreira Gomes, Centro",
    "fee": 400,
    "time": "20–35 min",
    "rating": null,
    "open": true,
    "producer": false,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@doceencantodaserra",
    "instagram": "@doceencantodaserra",
    "cover": "assets/images/product-artisanal.webp",
    "desc": "Doces individuais, bolo no pote, pudim e caixas para dividir ou presentear.",
    "hero": "Sobremesas caseiras e porções pequenas para matar a vontade de doce.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "Guaraciaba do Norte"
    ],
    "demo": true
  },
  {
    "id": 9,
    "name": "Açúcar & Canela",
    "category": "Doceria e bolos",
    "city": "Tianguá",
    "address": "Rua 12 de Agosto, Centro",
    "fee": 600,
    "time": "25–40 min",
    "rating": null,
    "open": true,
    "producer": false,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@acucarecanela",
    "instagram": "@acucarecanela",
    "cover": "assets/images/product-artisanal.webp",
    "desc": "Bolos, churros, palha italiana e sobremesas montadas em porções individuais.",
    "hero": "Doces de vitrine, bolos por fatia e sobremesas caprichadas.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "Tianguá"
    ],
    "demo": true
  },
  {
    "id": 10,
    "name": "Flor de Cacau",
    "category": "Café e doceria",
    "city": "Ubajara",
    "address": "Rua Juvêncio Pereira, Centro",
    "fee": 600,
    "time": "25–40 min",
    "rating": null,
    "open": true,
    "producer": false,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@flordecacau",
    "instagram": "@flordecacau",
    "cover": "assets/images/product-artisanal.webp",
    "desc": "Tortas, brownies, trufas e bebidas de café para lanche e sobremesa.",
    "hero": "Chocolate, café e sobremesas para uma pausa no centro de Ubajara.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "Ubajara"
    ],
    "demo": true
  },
  {
    "id": 11,
    "name": "Chapa do Norte",
    "category": "Lanchonete",
    "city": "Guaraciaba do Norte",
    "address": "Rua Capitão Ferreira, Centro",
    "fee": 450,
    "time": "20–35 min",
    "rating": null,
    "open": true,
    "producer": false,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@chapadonorte",
    "instagram": "@chapadonorte",
    "cover": "assets/images/product-regional.webp",
    "desc": "Hambúrgueres, sanduíches, cachorro-quente, batata e sucos para lanche rápido.",
    "hero": "Lanches de chapa e porções para pedir à noite ou no fim da tarde.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "Guaraciaba do Norte"
    ],
    "demo": true
  },
  {
    "id": 12,
    "name": "Ponto do Cuscuz",
    "category": "Café regional",
    "city": "São Benedito",
    "address": "Avenida Tabajara, Centro",
    "fee": 500,
    "time": "20–35 min",
    "rating": null,
    "open": true,
    "producer": false,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@pontodocuscuz",
    "instagram": "@pontodocuscuz",
    "cover": "assets/images/product-caseiro.webp",
    "desc": "Cuscuz recheado, tapioca, café e bolos regionais em combinações de café da manhã.",
    "hero": "Café regional simples, com cuscuz e tapioca preparados na hora.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "São Benedito"
    ],
    "demo": true
  },
  {
    "id": 13,
    "name": "Massa da Serra",
    "category": "Pizzaria",
    "city": "Tianguá",
    "address": "Avenida Prefeito Jacques Nunes, Centro",
    "fee": 700,
    "time": "35–50 min",
    "rating": null,
    "open": true,
    "producer": false,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@massadaserra",
    "instagram": "@massadaserra",
    "cover": "assets/images/product-caseiro.webp",
    "desc": "Pizzas tradicionais e vegetarianas, com tamanhos para uma pessoa ou para dividir.",
    "hero": "Pizza assada na hora com sabores clássicos para jantar ou compartilhar.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "Tianguá"
    ],
    "demo": true
  },
  {
    "id": 14,
    "name": "Panelinha Ibiapaba",
    "category": "Restaurante caseiro",
    "city": "Ibiapina",
    "address": "Avenida Pedro Ferreira de Assis, Centro",
    "fee": 650,
    "time": "30–45 min",
    "rating": null,
    "open": true,
    "producer": false,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@panelinhaibiapaba",
    "instagram": "@panelinhaibiapaba",
    "cover": "assets/images/product-caseiro.webp",
    "desc": "Marmitas e pratos feitos com opções de frango, carne, peixe e vegetariana.",
    "hero": "Almoço de todo dia com comida caseira, porção bem servida e acompanhamentos.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "Ibiapina"
    ],
    "demo": true
  },
  {
    "id": 15,
    "name": "Café Jatobá",
    "category": "Cafeteria",
    "city": "Ubajara",
    "address": "Rua José Agapito Pereira, Centro",
    "fee": 550,
    "time": "20–35 min",
    "rating": null,
    "open": true,
    "producer": false,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@cafejatoba",
    "instagram": "@cafejatoba",
    "cover": "assets/images/prod-cafe-serra.webp",
    "desc": "Café coado, cappuccino, pão de queijo, sanduíches e bolos para café e lanche.",
    "hero": "Café da Serra com opções rápidas para manhã, tarde ou intervalo.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "Ubajara"
    ],
    "demo": true
  },
  {
    "id": 16,
    "name": "Horta Pedra Branca",
    "category": "Produtor local",
    "city": "São Benedito",
    "address": "Sítio Jussara, Zona Rural",
    "fee": 600,
    "time": "35–55 min",
    "rating": null,
    "open": true,
    "producer": true,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@hortapedrabranca",
    "instagram": "@hortapedrabranca",
    "cover": "assets/images/product-produce.webp",
    "desc": "Folhas, temperos e legumes colhidos para cestas e compras da semana.",
    "hero": "Hortaliças frescas e cesta de salada montada com produção local.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "São Benedito"
    ],
    "demo": true
  },
  {
    "id": 17,
    "name": "Mel & Raiz da Serra",
    "category": "Produtor artesanal",
    "city": "Ubajara",
    "address": "CE-187, Zona Rural",
    "fee": 650,
    "time": "40–60 min",
    "rating": null,
    "open": true,
    "producer": true,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@meleraiz",
    "instagram": "@meleraiz",
    "cover": "assets/images/cover-sitio.webp",
    "desc": "Mel, geleias, rapadura, farinha e outros produtos artesanais de origem local.",
    "hero": "Itens da roça e produtos artesanais para café da manhã, receitas e despensa.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "Ubajara"
    ],
    "demo": true
  },
  {
    "id": 18,
    "name": "Roçado da Ibiapaba",
    "category": "Produtor local",
    "city": "Tianguá",
    "address": "Sítio Bom Jesus, acesso pela CE-187",
    "fee": 700,
    "time": "40–60 min",
    "rating": null,
    "open": true,
    "producer": true,
    "verified": true,
    "panelPassword": "1234",
    "officialRef": "@rocadodaibiapaba",
    "instagram": "@rocadodaibiapaba",
    "cover": "assets/images/product-produce.webp",
    "desc": "Raízes, frutas, feijão e cestas sazonais vindas do roçado.",
    "hero": "Produtos básicos da roça com entrega em lotes pequenos conforme a colheita.",
    "delivery": true,
    "pickup": true,
    "serviceAreas": [
      "Tianguá"
    ],
    "demo": true
  },
  {
    "id": 101,
    "name": "Cozinha de Viçosa · Demo",
    "category": "Restaurante caseiro",
    "city": "Viçosa do Ceará",
    "address": "Endereço não cadastrado — demonstração",
    "fee": 600,
    "open": true,
    "producer": false,
    "cover": "assets/images/product-caseiro.webp",
    "desc": "Estabelecimento fictício para demonstrar a busca e os pedidos em Viçosa do Ceará.",
    "hero": "Exemplo demonstrativo do comércio local.",
    "demo": true,
    "verified": false,
    "serviceAreas": [
      "Viçosa do Ceará"
    ],
    "delivery": true,
    "pickup": true
  },
  {
    "id": 102,
    "name": "Forno de Viçosa · Demo",
    "category": "Padaria e café",
    "city": "Viçosa do Ceará",
    "address": "Endereço não cadastrado — demonstração",
    "fee": 450,
    "open": true,
    "producer": false,
    "cover": "assets/images/product-bakery.webp",
    "desc": "Estabelecimento fictício para demonstrar a busca e os pedidos em Viçosa do Ceará.",
    "hero": "Exemplo demonstrativo do comércio local.",
    "demo": true,
    "verified": false,
    "serviceAreas": [
      "Viçosa do Ceará"
    ],
    "delivery": true,
    "pickup": true
  },
  {
    "id": 103,
    "name": "Horta de Viçosa · Demo",
    "category": "Produtor local",
    "city": "Viçosa do Ceará",
    "address": "Endereço não cadastrado — demonstração",
    "fee": 600,
    "open": true,
    "producer": true,
    "cover": "assets/images/product-produce.webp",
    "desc": "Estabelecimento fictício para demonstrar a busca e os pedidos em Viçosa do Ceará.",
    "hero": "Exemplo demonstrativo do comércio local.",
    "demo": true,
    "verified": false,
    "serviceAreas": [
      "Viçosa do Ceará"
    ],
    "delivery": true,
    "pickup": true
  },
  {
    "id": 104,
    "name": "Mesa de Carnaubal · Demo",
    "category": "Restaurante caseiro",
    "city": "Carnaubal",
    "address": "Endereço não cadastrado — demonstração",
    "fee": 600,
    "open": true,
    "producer": false,
    "cover": "assets/images/product-caseiro.webp",
    "desc": "Estabelecimento fictício para demonstrar a busca e os pedidos em Carnaubal.",
    "hero": "Exemplo demonstrativo do comércio local.",
    "demo": true,
    "verified": false,
    "serviceAreas": [
      "Carnaubal"
    ],
    "delivery": true,
    "pickup": true
  },
  {
    "id": 105,
    "name": "Pão de Carnaubal · Demo",
    "category": "Padaria e café",
    "city": "Carnaubal",
    "address": "Endereço não cadastrado — demonstração",
    "fee": 450,
    "open": true,
    "producer": false,
    "cover": "assets/images/product-bakery.webp",
    "desc": "Estabelecimento fictício para demonstrar a busca e os pedidos em Carnaubal.",
    "hero": "Exemplo demonstrativo do comércio local.",
    "demo": true,
    "verified": false,
    "serviceAreas": [
      "Carnaubal"
    ],
    "delivery": true,
    "pickup": true
  },
  {
    "id": 106,
    "name": "Roça de Carnaubal · Demo",
    "category": "Produtor local",
    "city": "Carnaubal",
    "address": "Endereço não cadastrado — demonstração",
    "fee": 600,
    "open": true,
    "producer": true,
    "cover": "assets/images/product-produce.webp",
    "desc": "Estabelecimento fictício para demonstrar a busca e os pedidos em Carnaubal.",
    "hero": "Exemplo demonstrativo do comércio local.",
    "demo": true,
    "verified": false,
    "serviceAreas": [
      "Carnaubal"
    ],
    "delivery": true,
    "pickup": true
  },
  {
    "id": 107,
    "name": "Cozinha de Croatá · Demo",
    "category": "Restaurante caseiro",
    "city": "Croatá",
    "address": "Endereço não cadastrado — demonstração",
    "fee": 600,
    "open": true,
    "producer": false,
    "cover": "assets/images/product-caseiro.webp",
    "desc": "Estabelecimento fictício para demonstrar a busca e os pedidos em Croatá.",
    "hero": "Exemplo demonstrativo do comércio local.",
    "demo": true,
    "verified": false,
    "serviceAreas": [
      "Croatá"
    ],
    "delivery": true,
    "pickup": true
  },
  {
    "id": 108,
    "name": "Café de Croatá · Demo",
    "category": "Padaria e café",
    "city": "Croatá",
    "address": "Endereço não cadastrado — demonstração",
    "fee": 450,
    "open": true,
    "producer": false,
    "cover": "assets/images/product-bakery.webp",
    "desc": "Estabelecimento fictício para demonstrar a busca e os pedidos em Croatá.",
    "hero": "Exemplo demonstrativo do comércio local.",
    "demo": true,
    "verified": false,
    "serviceAreas": [
      "Croatá"
    ],
    "delivery": true,
    "pickup": true
  },
  {
    "id": 109,
    "name": "Colheita de Croatá · Demo",
    "category": "Produtor local",
    "city": "Croatá",
    "address": "Endereço não cadastrado — demonstração",
    "fee": 600,
    "open": true,
    "producer": true,
    "cover": "assets/images/product-produce.webp",
    "desc": "Estabelecimento fictício para demonstrar a busca e os pedidos em Croatá.",
    "hero": "Exemplo demonstrativo do comércio local.",
    "demo": true,
    "verified": false,
    "serviceAreas": [
      "Croatá"
    ],
    "delivery": true,
    "pickup": true
  },
  {
    "id": 110,
    "name": "Mesa do Ipu · Demo",
    "category": "Restaurante caseiro",
    "city": "Ipu",
    "address": "Endereço não cadastrado — demonstração",
    "fee": 600,
    "open": true,
    "producer": false,
    "cover": "assets/images/product-caseiro.webp",
    "desc": "Estabelecimento fictício para demonstrar a busca e os pedidos em Ipu.",
    "hero": "Exemplo demonstrativo do comércio local.",
    "demo": true,
    "verified": false,
    "serviceAreas": [
      "Ipu"
    ],
    "delivery": true,
    "pickup": true
  },
  {
    "id": 111,
    "name": "Forno do Ipu · Demo",
    "category": "Padaria e café",
    "city": "Ipu",
    "address": "Endereço não cadastrado — demonstração",
    "fee": 450,
    "open": true,
    "producer": false,
    "cover": "assets/images/product-bakery.webp",
    "desc": "Estabelecimento fictício para demonstrar a busca e os pedidos em Ipu.",
    "hero": "Exemplo demonstrativo do comércio local.",
    "demo": true,
    "verified": false,
    "serviceAreas": [
      "Ipu"
    ],
    "delivery": true,
    "pickup": true
  },
  {
    "id": 112,
    "name": "Horta do Ipu · Demo",
    "category": "Produtor local",
    "city": "Ipu",
    "address": "Endereço não cadastrado — demonstração",
    "fee": 600,
    "open": true,
    "producer": true,
    "cover": "assets/images/product-produce.webp",
    "desc": "Estabelecimento fictício para demonstrar a busca e os pedidos em Ipu.",
    "hero": "Exemplo demonstrativo do comércio local.",
    "demo": true,
    "verified": false,
    "serviceAreas": [
      "Ipu"
    ],
    "delivery": true,
    "pickup": true
  }
];

const PRODUCTS = [
  {
    "id": 1,
    "storeId": 1,
    "name": "Baião da casa para dois",
    "desc": "Baião de dois, frango grelhado, macaxeira e salada.",
    "cat": "Regional",
    "price": 6200,
    "stock": 20,
    "image": "assets/images/prod-baiao.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": 2,
    "available": true,
    "demo": true
  },
  {
    "id": 2,
    "storeId": 1,
    "name": "Galinha caipira com pirão",
    "desc": "Prato completo com arroz, pirão e salada da casa.",
    "cat": "Regional",
    "price": 3600,
    "stock": 14,
    "image": "assets/images/prod-galinha.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 3,
    "storeId": 1,
    "name": "Escondidinho de carne",
    "desc": "Purê de macaxeira, carne desfiada e queijo dourado.",
    "cat": "Regional",
    "price": 3100,
    "stock": 16,
    "image": "assets/images/prod-escondidinho.webp",
    "oldPrice": 3900,
    "lastBatch": true,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 4,
    "storeId": 1,
    "name": "Macaxeira dourada",
    "desc": "Porção crocante para compartilhar.",
    "cat": "Acompanhamentos",
    "price": 1600,
    "stock": 22,
    "image": "assets/images/prod-macaxeira.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 5,
    "storeId": 1,
    "name": "Suco de acerola",
    "desc": "Copo de 400 ml preparado na hora.",
    "cat": "Bebidas",
    "price": 900,
    "stock": 30,
    "image": "assets/images/prod-acerola.webp",
    "oldPrice": 1200,
    "lastBatch": true,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 6,
    "storeId": 2,
    "name": "Pão de fermentação lenta",
    "desc": "Pão artesanal de 400 g, casca crocante e miolo macio.",
    "cat": "Padaria",
    "price": 1800,
    "stock": 18,
    "image": "assets/images/prod-pao.webp",
    "oldPrice": 2400,
    "lastBatch": true,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 7,
    "storeId": 2,
    "name": "Bolo de milho caseiro",
    "desc": "Fatia generosa, fofinha e com gostinho de interior.",
    "cat": "Doces",
    "price": 1500,
    "stock": 20,
    "image": "assets/images/prod-bolo-milho.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 8,
    "storeId": 2,
    "name": "Tapioca com queijo coalho",
    "desc": "Tapioca recheada, feita na chapa e servida quentinha.",
    "cat": "Padaria",
    "price": 1300,
    "stock": 24,
    "image": "assets/images/prod-tapioca.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 9,
    "storeId": 2,
    "name": "Café coado",
    "desc": "Café passado na hora, copo de 200 ml.",
    "cat": "Bebidas",
    "price": 600,
    "stock": 35,
    "image": "assets/images/prod-cafe-coado.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 10,
    "storeId": 2,
    "name": "Combo café da manhã",
    "desc": "Pão, bolo de milho e café para começar bem o dia.",
    "cat": "Padaria",
    "price": 2400,
    "stock": 10,
    "image": "assets/images/prod-combo-cafe.webp",
    "oldPrice": 3200,
    "lastBatch": true,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 11,
    "storeId": 3,
    "name": "Prato da Serra",
    "desc": "Arroz, feijão, frango, legumes e salada.",
    "cat": "Caseiro",
    "price": 2800,
    "stock": 18,
    "image": "assets/images/prod-prato-serra.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 12,
    "storeId": 3,
    "name": "Caldinho de feijão",
    "desc": "Porção de 350 ml, ideal para o fim da tarde.",
    "cat": "Caseiro",
    "price": 1500,
    "stock": 20,
    "image": "assets/images/prod-caldinho.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 13,
    "storeId": 3,
    "name": "Almoço vegetariano",
    "desc": "Arroz, feijão verde, legumes e salada fresca.",
    "cat": "Vegetariano",
    "price": 2600,
    "stock": 16,
    "image": "assets/images/prod-almoco-veg.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 14,
    "storeId": 3,
    "name": "Panelada da Serra",
    "desc": "Prato forte e bem temperado, servido com arroz.",
    "cat": "Regional",
    "price": 3400,
    "stock": 8,
    "image": "assets/images/prod-panelada.webp",
    "oldPrice": 4300,
    "lastBatch": true,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 15,
    "storeId": 3,
    "name": "Suco de cajá",
    "desc": "Copo de 400 ml, preparado com fruta natural.",
    "cat": "Bebidas",
    "price": 900,
    "stock": 25,
    "image": "assets/images/prod-caja.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 16,
    "storeId": 4,
    "name": "Banana da estação",
    "desc": "Um quilo de bananas frescas da região.",
    "cat": "Do produtor",
    "price": 700,
    "stock": 30,
    "image": "assets/images/prod-banana.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 17,
    "storeId": 4,
    "name": "Café da Serra",
    "desc": "Café torrado e moído, pacote de 250 g.",
    "cat": "Do produtor",
    "price": 2200,
    "stock": 15,
    "image": "assets/images/prod-cafe-serra.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 18,
    "storeId": 4,
    "name": "Geleia de goiaba",
    "desc": "Pote artesanal de 250 g, produção local.",
    "cat": "Do produtor",
    "price": 1700,
    "stock": 14,
    "image": "assets/images/prod-geleia-goiaba.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 19,
    "storeId": 4,
    "name": "Cesta de hortaliças",
    "desc": "Mix com alface, tomate, coentro e cheiro-verde.",
    "cat": "Do produtor",
    "price": 2900,
    "stock": 10,
    "image": "assets/images/prod-cesta-hortalicas.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 20,
    "storeId": 4,
    "name": "Tomate da horta",
    "desc": "Tomates selecionados, vendidos por quilo.",
    "cat": "Do produtor",
    "price": 1000,
    "stock": 24,
    "image": "assets/images/prod-tomate.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 21,
    "storeId": 5,
    "name": "Cesta orgânica semanal",
    "desc": "Legumes e verduras da semana, pronta para a família.",
    "cat": "Do produtor",
    "price": 3900,
    "stock": 8,
    "image": "assets/images/prod-cesta-organica.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 22,
    "storeId": 5,
    "name": "Mel da região",
    "desc": "Pote de mel puro com 300 g.",
    "cat": "Do produtor",
    "price": 2000,
    "stock": 16,
    "image": "assets/images/prod-mel.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 23,
    "storeId": 5,
    "name": "Alface crespa",
    "desc": "Maço fresco, colhido no dia.",
    "cat": "Do produtor",
    "price": 500,
    "stock": 30,
    "image": "assets/images/prod-alface.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 24,
    "storeId": 5,
    "name": "Cenoura orgânica",
    "desc": "Pacote com 500 g de cenouras selecionadas.",
    "cat": "Do produtor",
    "price": 800,
    "stock": 25,
    "image": "assets/images/prod-cenoura.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 25,
    "storeId": 5,
    "name": "Queijo coalho artesanal",
    "desc": "Peça de 250 g produzida na região.",
    "cat": "Do produtor",
    "price": 1800,
    "stock": 12,
    "image": "assets/images/prod-queijo-coalho.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 26,
    "storeId": 6,
    "name": "Pão francês da fornada",
    "desc": "Pacote com 6 pães franceses assados no dia, casca leve e miolo macio.",
    "cat": "Padaria",
    "price": 900,
    "stock": 30,
    "image": "assets/images/product-bakery.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 27,
    "storeId": 6,
    "name": "Sonho de creme",
    "desc": "Massa macia recheada com creme de confeiteiro e finalizada com açúcar.",
    "cat": "Doces",
    "price": 700,
    "stock": 18,
    "image": "assets/images/product-bakery.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 28,
    "storeId": 6,
    "name": "Bolo fofo de laranja",
    "desc": "Fatia grande de bolo caseiro de laranja, úmido e sem recheio pesado.",
    "cat": "Bolos",
    "price": 900,
    "stock": 16,
    "image": "assets/images/prod-bolo-milho.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 29,
    "storeId": 6,
    "name": "Cuscuz com queijo coalho",
    "desc": "Cuscuz de milho feito na hora com queijo coalho dourado na chapa.",
    "cat": "Café da manhã",
    "price": 1400,
    "stock": 20,
    "image": "assets/images/prod-tapioca.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 30,
    "storeId": 6,
    "name": "Kit fim de fornada",
    "desc": "Seleção do fim do dia com 4 pães e 2 salgados ainda próprios para consumo no mesmo dia.",
    "cat": "Última Fornada",
    "price": 1200,
    "stock": 8,
    "image": "assets/images/product-bakery.webp",
    "oldPrice": 1800,
    "lastBatch": true,
    "preferences": [],
    "serves": 2,
    "available": true,
    "demo": true
  },
  {
    "id": 31,
    "storeId": 7,
    "name": "Pão de coco",
    "desc": "Pão macio levemente adocicado com coco, bom para café da manhã ou lanche.",
    "cat": "Padaria",
    "price": 1100,
    "stock": 18,
    "image": "assets/images/product-bakery.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 32,
    "storeId": 7,
    "name": "Croissant de queijo",
    "desc": "Croissant amanteigado recheado com queijo, assado até ficar dourado.",
    "cat": "Padaria",
    "price": 1300,
    "stock": 14,
    "image": "assets/images/product-bakery.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 33,
    "storeId": 7,
    "name": "Pão de queijo",
    "desc": "Porção com 8 unidades pequenas de pão de queijo assadas na hora.",
    "cat": "Padaria",
    "price": 1500,
    "stock": 20,
    "image": "assets/images/prod-queijo-coalho.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": 2,
    "available": true,
    "demo": true
  },
  {
    "id": 34,
    "storeId": 7,
    "name": "Bolo de macaxeira",
    "desc": "Fatia de bolo de macaxeira com coco, textura cremosa e sabor caseiro.",
    "cat": "Bolos",
    "price": 1000,
    "stock": 15,
    "image": "assets/images/product-bakery.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 35,
    "storeId": 7,
    "name": "Cesta da fornada do dia",
    "desc": "Combo com pães e duas fatias de bolo selecionados entre os itens restantes da vitrine.",
    "cat": "Última Fornada",
    "price": 1800,
    "stock": 6,
    "image": "assets/images/product-bakery.webp",
    "oldPrice": 2600,
    "lastBatch": true,
    "preferences": [],
    "serves": 2,
    "available": true,
    "demo": true
  },
  {
    "id": 36,
    "storeId": 8,
    "name": "Brownie de chocolate",
    "desc": "Quadrado de brownie úmido com chocolate intenso e casquinha fina.",
    "cat": "Doces",
    "price": 1000,
    "stock": 16,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 37,
    "storeId": 8,
    "name": "Brigadeiro artesanal",
    "desc": "Caixa com 6 brigadeiros tradicionais enrolados no dia.",
    "cat": "Doces",
    "price": 1500,
    "stock": 20,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": 2,
    "available": true,
    "demo": true
  },
  {
    "id": 38,
    "storeId": 8,
    "name": "Bolo no pote de ninho",
    "desc": "Camadas de massa branca, creme de leite em pó e cobertura suave.",
    "cat": "Sobremesas",
    "price": 1400,
    "stock": 14,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 39,
    "storeId": 8,
    "name": "Pudim caseiro",
    "desc": "Fatia generosa de pudim de leite com calda de caramelo.",
    "cat": "Sobremesas",
    "price": 1200,
    "stock": 12,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 40,
    "storeId": 8,
    "name": "Caixa mini doces",
    "desc": "Caixa com 12 mini doces variados para dividir ou presentear.",
    "cat": "Doces",
    "price": 3200,
    "stock": 8,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": 4,
    "available": true,
    "demo": true
  },
  {
    "id": 41,
    "storeId": 9,
    "name": "Fatia red velvet",
    "desc": "Fatia de bolo vermelho com recheio cremoso e cobertura leve.",
    "cat": "Bolos",
    "price": 1600,
    "stock": 12,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 42,
    "storeId": 9,
    "name": "Churros com doce de leite",
    "desc": "Porção com 6 mini churros polvilhados com açúcar e canela.",
    "cat": "Doces",
    "price": 1500,
    "stock": 16,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": 2,
    "available": true,
    "demo": true
  },
  {
    "id": 43,
    "storeId": 9,
    "name": "Palha italiana",
    "desc": "Doce de brigadeiro com biscoito em quadrados, porção com 4 unidades.",
    "cat": "Doces",
    "price": 1300,
    "stock": 18,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": 2,
    "available": true,
    "demo": true
  },
  {
    "id": 44,
    "storeId": 9,
    "name": "Copo da felicidade",
    "desc": "Copo com camadas de brownie, creme e chocolate para sobremesa individual.",
    "cat": "Sobremesas",
    "price": 1800,
    "stock": 12,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 45,
    "storeId": 9,
    "name": "Bolo de cenoura com chocolate",
    "desc": "Fatia de bolo de cenoura fofinho com cobertura de chocolate.",
    "cat": "Bolos",
    "price": 1100,
    "stock": 14,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 46,
    "storeId": 10,
    "name": "Torta de chocolate",
    "desc": "Fatia de torta com base macia e creme de chocolate.",
    "cat": "Sobremesas",
    "price": 1700,
    "stock": 12,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 47,
    "storeId": 10,
    "name": "Cheesecake de frutas vermelhas",
    "desc": "Fatia cremosa com base de biscoito e calda de frutas vermelhas.",
    "cat": "Sobremesas",
    "price": 1900,
    "stock": 10,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 48,
    "storeId": 10,
    "name": "Cappuccino da casa",
    "desc": "Bebida quente de café com leite e espuma, copo de 250 ml.",
    "cat": "Bebidas",
    "price": 1200,
    "stock": 20,
    "image": "assets/images/prod-cafe-serra.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 49,
    "storeId": 10,
    "name": "Brownie com sorvete",
    "desc": "Brownie aquecido acompanhado de uma bola de sorvete de creme.",
    "cat": "Sobremesas",
    "price": 1900,
    "stock": 10,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 50,
    "storeId": 10,
    "name": "Caixa de trufas",
    "desc": "Caixa com 8 trufas de chocolate em sabores variados.",
    "cat": "Doces",
    "price": 2800,
    "stock": 10,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": 3,
    "available": true,
    "demo": true
  },
  {
    "id": 51,
    "storeId": 11,
    "name": "X-burger da casa",
    "desc": "Pão, carne bovina, queijo, alface, tomate e molho da casa.",
    "cat": "Lanches",
    "price": 1900,
    "stock": 20,
    "image": "assets/images/product-regional.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 52,
    "storeId": 11,
    "name": "Sanduíche de frango",
    "desc": "Pão tostado com frango desfiado, queijo, salada e molho.",
    "cat": "Lanches",
    "price": 1800,
    "stock": 18,
    "image": "assets/images/product-regional.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 53,
    "storeId": 11,
    "name": "Batata frita crocante",
    "desc": "Porção de batata frita com sal e molho separado.",
    "cat": "Porções",
    "price": 1600,
    "stock": 24,
    "image": "assets/images/product-regional.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": 2,
    "available": true,
    "demo": true
  },
  {
    "id": 54,
    "storeId": 11,
    "name": "Cachorro-quente completo",
    "desc": "Pão, salsicha, molho, milho, batata palha e queijo ralado.",
    "cat": "Lanches",
    "price": 1400,
    "stock": 20,
    "image": "assets/images/product-regional.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 55,
    "storeId": 11,
    "name": "Suco de cajá 400 ml",
    "desc": "Suco de cajá preparado gelado, sem mistura de outras frutas.",
    "cat": "Bebidas",
    "price": 900,
    "stock": 24,
    "image": "assets/images/prod-caja.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 56,
    "storeId": 12,
    "name": "Cuscuz com carne de sol",
    "desc": "Cuscuz de milho com carne de sol desfiada e queijo coalho.",
    "cat": "Café regional",
    "price": 1900,
    "stock": 18,
    "image": "assets/images/product-caseiro.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 57,
    "storeId": 12,
    "name": "Cuscuz com ovo e queijo",
    "desc": "Cuscuz com ovo mexido e queijo coalho, opção sem carne.",
    "cat": "Café regional",
    "price": 1500,
    "stock": 20,
    "image": "assets/images/product-caseiro.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 58,
    "storeId": 12,
    "name": "Tapioca de frango",
    "desc": "Tapioca na chapa recheada com frango desfiado e queijo.",
    "cat": "Tapiocas",
    "price": 1500,
    "stock": 20,
    "image": "assets/images/prod-tapioca.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 59,
    "storeId": 12,
    "name": "Café com leite",
    "desc": "Café coado com leite, servido quente em copo de 250 ml.",
    "cat": "Bebidas",
    "price": 700,
    "stock": 30,
    "image": "assets/images/prod-cafe-coado.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 60,
    "storeId": 12,
    "name": "Bolo pé de moleque",
    "desc": "Fatia de bolo regional de massa de mandioca com castanha e especiarias.",
    "cat": "Bolos",
    "price": 1100,
    "stock": 12,
    "image": "assets/images/product-caseiro.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 61,
    "storeId": 13,
    "name": "Pizza muçarela média",
    "desc": "Pizza média com molho de tomate, muçarela, tomate e orégano.",
    "cat": "Pizzas",
    "price": 3600,
    "stock": 12,
    "image": "assets/images/product-caseiro.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": 2,
    "available": true,
    "demo": true
  },
  {
    "id": 62,
    "storeId": 13,
    "name": "Pizza calabresa média",
    "desc": "Pizza média com molho, muçarela, calabresa e cebola.",
    "cat": "Pizzas",
    "price": 3900,
    "stock": 12,
    "image": "assets/images/product-caseiro.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": 2,
    "available": true,
    "demo": true
  },
  {
    "id": 63,
    "storeId": 13,
    "name": "Pizza frango cremosa média",
    "desc": "Pizza média com frango desfiado, queijo e creme de queijo.",
    "cat": "Pizzas",
    "price": 4200,
    "stock": 10,
    "image": "assets/images/product-caseiro.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": 2,
    "available": true,
    "demo": true
  },
  {
    "id": 64,
    "storeId": 13,
    "name": "Pizza marguerita média",
    "desc": "Pizza média com muçarela, tomate, manjericão e orégano.",
    "cat": "Pizzas",
    "price": 3800,
    "stock": 10,
    "image": "assets/images/product-caseiro.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": 2,
    "available": true,
    "demo": true
  },
  {
    "id": 65,
    "storeId": 13,
    "name": "Combo pizza e refrigerante",
    "desc": "Uma pizza média de muçarela e refrigerante de 1 litro.",
    "cat": "Combos",
    "price": 4500,
    "stock": 8,
    "image": "assets/images/product-caseiro.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": 3,
    "available": true,
    "demo": true
  },
  {
    "id": 66,
    "storeId": 14,
    "name": "Marmita de frango grelhado",
    "desc": "Arroz, feijão, frango grelhado, macaxeira e salada do dia.",
    "cat": "Almoço",
    "price": 2600,
    "stock": 18,
    "image": "assets/images/prod-prato-serra.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 67,
    "storeId": 14,
    "name": "Carne de panela completa",
    "desc": "Arroz, feijão, carne de panela com legumes e farofa.",
    "cat": "Almoço",
    "price": 3000,
    "stock": 16,
    "image": "assets/images/product-caseiro.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 68,
    "storeId": 14,
    "name": "Peixe grelhado com legumes",
    "desc": "Filé de peixe grelhado com arroz, legumes e salada.",
    "cat": "Almoço",
    "price": 3200,
    "stock": 12,
    "image": "assets/images/product-caseiro.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 69,
    "storeId": 14,
    "name": "Marmita vegetariana",
    "desc": "Arroz, feijão verde, legumes refogados, macaxeira e salada.",
    "cat": "Vegetariano",
    "price": 2400,
    "stock": 16,
    "image": "assets/images/prod-almoco-veg.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 70,
    "storeId": 14,
    "name": "Feijoada individual",
    "desc": "Feijoada com arroz, farofa e couve, porção individual.",
    "cat": "Almoço",
    "price": 2900,
    "stock": 10,
    "image": "assets/images/product-caseiro.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 71,
    "storeId": 15,
    "name": "Café coado da Serra",
    "desc": "Café filtrado servido na hora, 250 ml.",
    "cat": "Bebidas",
    "price": 700,
    "stock": 30,
    "image": "assets/images/prod-cafe-serra.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 72,
    "storeId": 15,
    "name": "Cappuccino cremoso",
    "desc": "Café com leite vaporizado e espuma, 250 ml.",
    "cat": "Bebidas",
    "price": 1200,
    "stock": 20,
    "image": "assets/images/prod-cafe-serra.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 73,
    "storeId": 15,
    "name": "Pão de queijo grande",
    "desc": "Porção com 3 pães de queijo grandes, assados no dia.",
    "cat": "Lanches",
    "price": 1300,
    "stock": 18,
    "image": "assets/images/prod-queijo-coalho.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 74,
    "storeId": 15,
    "name": "Sanduíche natural de frango",
    "desc": "Pão macio com frango, cenoura, alface e creme leve.",
    "cat": "Lanches",
    "price": 1600,
    "stock": 15,
    "image": "assets/images/product-bakery.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 75,
    "storeId": 15,
    "name": "Bolo de banana com canela",
    "desc": "Fatia de bolo caseiro de banana com canela.",
    "cat": "Bolos",
    "price": 1000,
    "stock": 14,
    "image": "assets/images/prod-banana.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 76,
    "storeId": 16,
    "name": "Alface crespa",
    "desc": "Unidade de alface crespa colhida recentemente e higienizada externamente.",
    "cat": "Hortaliças",
    "price": 500,
    "stock": 30,
    "image": "assets/images/prod-alface.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 77,
    "storeId": 16,
    "name": "Cheiro-verde",
    "desc": "Maço de cebolinha e coentro para temperos e finalizações.",
    "cat": "Hortaliças",
    "price": 400,
    "stock": 35,
    "image": "assets/images/product-produce.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 78,
    "storeId": 16,
    "name": "Tomate da Serra 1 kg",
    "desc": "Quilo de tomates selecionados para salada, molho ou preparo quente.",
    "cat": "Hortaliças",
    "price": 900,
    "stock": 24,
    "image": "assets/images/prod-tomate.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 79,
    "storeId": 16,
    "name": "Cenoura 1 kg",
    "desc": "Quilo de cenouras selecionadas, boas para salada, sopa e refogado.",
    "cat": "Hortaliças",
    "price": 800,
    "stock": 24,
    "image": "assets/images/prod-cenoura.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 80,
    "storeId": 16,
    "name": "Cesta de salada",
    "desc": "Cesta com alface, tomate, cenoura, pepino e cheiro-verde para a semana.",
    "cat": "Cestas",
    "price": 2400,
    "stock": 12,
    "image": "assets/images/prod-cesta-hortalicas.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "serves": 3,
    "available": true,
    "demo": true
  },
  {
    "id": 81,
    "storeId": 17,
    "name": "Mel artesanal 500 g",
    "desc": "Pote de mel artesanal de 500 g, indicado para café da manhã e receitas.",
    "cat": "Artesanais",
    "price": 2600,
    "stock": 16,
    "image": "assets/images/prod-mel.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 82,
    "storeId": 17,
    "name": "Geleia de goiaba 250 g",
    "desc": "Geleia artesanal de goiaba para pães, bolos e acompanhamentos.",
    "cat": "Artesanais",
    "price": 1600,
    "stock": 18,
    "image": "assets/images/prod-geleia-goiaba.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 83,
    "storeId": 17,
    "name": "Rapadura tradicional",
    "desc": "Tablete de rapadura artesanal, sabor intenso de cana.",
    "cat": "Artesanais",
    "price": 900,
    "stock": 20,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 84,
    "storeId": 17,
    "name": "Farinha de mandioca 1 kg",
    "desc": "Farinha de mandioca torrada para acompanhamentos e receitas regionais.",
    "cat": "Despensa",
    "price": 1200,
    "stock": 18,
    "image": "assets/images/product-artisanal.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 85,
    "storeId": 17,
    "name": "Queijo coalho artesanal 500 g",
    "desc": "Peça de queijo coalho para café da manhã, tapioca ou preparo na chapa.",
    "cat": "Artesanais",
    "price": 2800,
    "stock": 12,
    "image": "assets/images/prod-queijo-coalho.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 86,
    "storeId": 18,
    "name": "Banana prata 1 kg",
    "desc": "Quilo de banana prata selecionada conforme maturação do lote.",
    "cat": "Frutas",
    "price": 800,
    "stock": 28,
    "image": "assets/images/prod-banana.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 87,
    "storeId": 18,
    "name": "Macaxeira 1 kg",
    "desc": "Raiz de macaxeira descascada e pronta para cozinhar.",
    "cat": "Raízes",
    "price": 900,
    "stock": 24,
    "image": "assets/images/prod-macaxeira.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 88,
    "storeId": 18,
    "name": "Batata-doce 1 kg",
    "desc": "Quilo de batata-doce selecionada para cozimento, forno ou purê.",
    "cat": "Raízes",
    "price": 800,
    "stock": 24,
    "image": "assets/images/product-produce.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 89,
    "storeId": 18,
    "name": "Feijão verde 1 kg",
    "desc": "Feijão verde fresco para baião, saladas e acompanhamentos.",
    "cat": "Grãos",
    "price": 1400,
    "stock": 18,
    "image": "assets/images/product-produce.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "serves": null,
    "available": true,
    "demo": true
  },
  {
    "id": 90,
    "storeId": 18,
    "name": "Cesta da roça",
    "desc": "Cesta com banana, macaxeira, batata-doce, feijão verde e item sazonal do dia.",
    "cat": "Cestas",
    "price": 3200,
    "stock": 10,
    "image": "assets/images/prod-cesta-organica.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "serves": 3,
    "available": true,
    "demo": true
  },
  {
    "id": 1001,
    "storeId": 101,
    "name": "Arroz de galinha",
    "desc": "Arroz com frango desfiado e legumes. Porção individual demonstrativa.",
    "cat": "Almoço",
    "price": 2500,
    "stock": 20,
    "image": "assets/images/prod-galinha.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [],
    "offer": null
  },
  {
    "id": 1002,
    "storeId": 101,
    "name": "Carne de panela com arroz",
    "desc": "Carne de panela com arroz, feijão e legumes. Porção individual demonstrativa.",
    "cat": "Almoço",
    "price": 2800,
    "stock": 20,
    "image": "assets/images/prod-carne-panela.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [],
    "offer": null
  },
  {
    "id": 1003,
    "storeId": 101,
    "name": "Almoço vegetariano de legumes",
    "desc": "Porção individual de arroz, feijão, legumes e salada, sem carne. Receita demonstrativa.",
    "cat": "Vegetariano",
    "price": 2300,
    "stock": 20,
    "image": "assets/images/prod-almoco-veg.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1004,
    "storeId": 101,
    "name": "Peixe com purê de macaxeira",
    "desc": "Filé de peixe com purê de macaxeira e salada. Porção individual demonstrativa.",
    "cat": "Almoço",
    "price": 3200,
    "stock": 20,
    "image": "assets/images/prod-peixe-pure.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [],
    "offer": null
  },
  {
    "id": 1005,
    "storeId": 101,
    "name": "Suco de cajá 400 ml",
    "desc": "Suco de cajá em copo de 400 ml. Produto demonstrativo.",
    "cat": "Bebidas",
    "price": 800,
    "stock": 20,
    "image": "assets/images/prod-caja.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [],
    "offer": null
  },
  {
    "id": 1006,
    "storeId": 102,
    "name": "Cuscuz com ovo",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Café da manhã",
    "price": 1200,
    "stock": 20,
    "image": "assets/images/prod-cuscuz-ovo.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1007,
    "storeId": 102,
    "name": "Tapioca com queijo coalho",
    "desc": "Tapioca com queijo coalho, unidade individual. Produto demonstrativo.",
    "cat": "Tapiocas",
    "price": 1300,
    "stock": 20,
    "image": "assets/images/prod-tapioca.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1008,
    "storeId": 102,
    "name": "Pão de queijo — 3 unidades",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Lanches",
    "price": 1100,
    "stock": 20,
    "image": "assets/images/prod-pao-queijo.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1009,
    "storeId": 102,
    "name": "Bolo de milho — fatia",
    "desc": "Fatia individual de bolo de milho. Produto demonstrativo.",
    "cat": "Bolos",
    "price": 800,
    "stock": 20,
    "image": "assets/images/prod-bolo-milho.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1010,
    "storeId": 102,
    "name": "Café coado 200 ml",
    "desc": "Café coado sem leite, copo de 200 ml. Produto demonstrativo.",
    "cat": "Bebidas",
    "price": 600,
    "stock": 20,
    "image": "assets/images/prod-cafe-coado.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1011,
    "storeId": 103,
    "name": "Cesta de hortaliças",
    "desc": "Cesta demonstrativa com alface, tomate, cenoura e cheiro-verde.",
    "cat": "Cestas",
    "price": 2400,
    "stock": 20,
    "image": "assets/images/prod-cesta-hortalicas.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1012,
    "storeId": 103,
    "name": "Banana prata 1 kg",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Frutas",
    "price": 800,
    "stock": 20,
    "image": "assets/images/prod-banana.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1013,
    "storeId": 103,
    "name": "Abóbora 1 kg",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Legumes",
    "price": 700,
    "stock": 20,
    "image": "assets/images/prod-abobora.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1014,
    "storeId": 103,
    "name": "Geleia de goiaba 250 g",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Artesanais",
    "price": 1600,
    "stock": 20,
    "image": "assets/images/prod-geleia-goiaba.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1015,
    "storeId": 103,
    "name": "Feijão verde 500 g",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Grãos",
    "price": 800,
    "stock": 20,
    "image": "assets/images/prod-feijao-verde.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1016,
    "storeId": 104,
    "name": "Baião vegetariano",
    "desc": "Porção individual de arroz, feijão, legumes e salada, sem carne. Receita demonstrativa.",
    "cat": "Vegetariano",
    "price": 2300,
    "stock": 20,
    "image": "assets/images/prod-almoco-veg.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1017,
    "storeId": 104,
    "name": "Carne de panela com arroz",
    "desc": "Carne de panela com arroz, feijão e legumes. Porção individual demonstrativa.",
    "cat": "Almoço",
    "price": 2800,
    "stock": 20,
    "image": "assets/images/prod-carne-panela.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [],
    "offer": null
  },
  {
    "id": 1018,
    "storeId": 104,
    "name": "Almoço vegetariano de legumes",
    "desc": "Porção individual de arroz, feijão, legumes e salada, sem carne. Receita demonstrativa.",
    "cat": "Vegetariano",
    "price": 2300,
    "stock": 20,
    "image": "assets/images/prod-almoco-veg.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1019,
    "storeId": 104,
    "name": "Peixe com purê de macaxeira",
    "desc": "Filé de peixe com purê de macaxeira e salada. Porção individual demonstrativa.",
    "cat": "Almoço",
    "price": 3200,
    "stock": 20,
    "image": "assets/images/prod-peixe-pure.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [],
    "offer": null
  },
  {
    "id": 1020,
    "storeId": 104,
    "name": "Suco de cajá 400 ml",
    "desc": "Suco de cajá em copo de 400 ml. Produto demonstrativo.",
    "cat": "Bebidas",
    "price": 800,
    "stock": 20,
    "image": "assets/images/prod-caja.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [],
    "offer": null
  },
  {
    "id": 1021,
    "storeId": 105,
    "name": "Cuscuz com ovo",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Café da manhã",
    "price": 1200,
    "stock": 20,
    "image": "assets/images/prod-cuscuz-ovo.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1022,
    "storeId": 105,
    "name": "Tapioca com queijo coalho",
    "desc": "Tapioca com queijo coalho, unidade individual. Produto demonstrativo.",
    "cat": "Tapiocas",
    "price": 1300,
    "stock": 20,
    "image": "assets/images/prod-tapioca.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1023,
    "storeId": 105,
    "name": "Pão de queijo — 3 unidades",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Lanches",
    "price": 1100,
    "stock": 20,
    "image": "assets/images/prod-pao-queijo.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1024,
    "storeId": 105,
    "name": "Tapioca de banana e canela",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Tapiocas",
    "price": 1200,
    "stock": 20,
    "image": "assets/images/prod-tapioca-banana.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1025,
    "storeId": 105,
    "name": "Café coado 200 ml",
    "desc": "Café coado sem leite, copo de 200 ml. Produto demonstrativo.",
    "cat": "Bebidas",
    "price": 600,
    "stock": 20,
    "image": "assets/images/prod-cafe-coado.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1026,
    "storeId": 106,
    "name": "Cesta de hortaliças",
    "desc": "Cesta demonstrativa com alface, tomate, cenoura e cheiro-verde.",
    "cat": "Cestas",
    "price": 2400,
    "stock": 20,
    "image": "assets/images/prod-cesta-hortalicas.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1027,
    "storeId": 106,
    "name": "Banana prata 1 kg",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Frutas",
    "price": 800,
    "stock": 20,
    "image": "assets/images/prod-banana.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1028,
    "storeId": 106,
    "name": "Batata-doce 1 kg",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Raízes",
    "price": 800,
    "stock": 20,
    "image": "assets/images/prod-batata-doce.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1029,
    "storeId": 106,
    "name": "Geleia de goiaba 250 g",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Artesanais",
    "price": 1600,
    "stock": 20,
    "image": "assets/images/prod-geleia-goiaba.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1030,
    "storeId": 106,
    "name": "Feijão verde 500 g",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Grãos",
    "price": 800,
    "stock": 20,
    "image": "assets/images/prod-feijao-verde.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1031,
    "storeId": 107,
    "name": "Escondidinho de legumes",
    "desc": "Porção individual de purê de macaxeira com legumes, preparada sem carne, leite ou queijo. Receita demonstrativa.",
    "cat": "Vegetariano",
    "price": 2500,
    "stock": 20,
    "image": "assets/images/prod-escondidinho-veg.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1032,
    "storeId": 107,
    "name": "Carne de panela com arroz",
    "desc": "Carne de panela com arroz, feijão e legumes. Porção individual demonstrativa.",
    "cat": "Almoço",
    "price": 2800,
    "stock": 20,
    "image": "assets/images/prod-carne-panela.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [],
    "offer": null
  },
  {
    "id": 1033,
    "storeId": 107,
    "name": "Almoço vegetariano de legumes",
    "desc": "Porção individual de arroz, feijão, legumes e salada, sem carne. Receita demonstrativa.",
    "cat": "Vegetariano",
    "price": 2300,
    "stock": 20,
    "image": "assets/images/prod-almoco-veg.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1034,
    "storeId": 107,
    "name": "Peixe com purê de macaxeira",
    "desc": "Filé de peixe com purê de macaxeira e salada. Porção individual demonstrativa.",
    "cat": "Almoço",
    "price": 3200,
    "stock": 20,
    "image": "assets/images/prod-peixe-pure.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [],
    "offer": null
  },
  {
    "id": 1035,
    "storeId": 107,
    "name": "Suco de cajá 400 ml",
    "desc": "Suco de cajá em copo de 400 ml. Produto demonstrativo.",
    "cat": "Bebidas",
    "price": 800,
    "stock": 20,
    "image": "assets/images/prod-caja.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [],
    "offer": null
  },
  {
    "id": 1036,
    "storeId": 108,
    "name": "Cuscuz com ovo",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Café da manhã",
    "price": 1200,
    "stock": 20,
    "image": "assets/images/prod-cuscuz-ovo.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1037,
    "storeId": 108,
    "name": "Tapioca com queijo coalho",
    "desc": "Tapioca com queijo coalho, unidade individual. Produto demonstrativo.",
    "cat": "Tapiocas",
    "price": 1300,
    "stock": 20,
    "image": "assets/images/prod-tapioca.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1038,
    "storeId": 108,
    "name": "Pão de queijo — 3 unidades",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Lanches",
    "price": 1100,
    "stock": 20,
    "image": "assets/images/prod-pao-queijo.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1039,
    "storeId": 108,
    "name": "Sanduíche de queijo e tomate",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Lanches",
    "price": 1400,
    "stock": 20,
    "image": "assets/images/prod-sanduiche-queijo.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1040,
    "storeId": 108,
    "name": "Café coado 200 ml",
    "desc": "Café coado sem leite, copo de 200 ml. Produto demonstrativo.",
    "cat": "Bebidas",
    "price": 600,
    "stock": 20,
    "image": "assets/images/prod-cafe-coado.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1041,
    "storeId": 109,
    "name": "Cesta de hortaliças",
    "desc": "Cesta demonstrativa com alface, tomate, cenoura e cheiro-verde.",
    "cat": "Cestas",
    "price": 2400,
    "stock": 20,
    "image": "assets/images/prod-cesta-hortalicas.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1042,
    "storeId": 109,
    "name": "Banana prata 1 kg",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Frutas",
    "price": 800,
    "stock": 20,
    "image": "assets/images/prod-banana.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1043,
    "storeId": 109,
    "name": "Tomate 1 kg",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Hortaliças",
    "price": 900,
    "stock": 20,
    "image": "assets/images/prod-tomate.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1044,
    "storeId": 109,
    "name": "Geleia de goiaba 250 g",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Artesanais",
    "price": 1600,
    "stock": 20,
    "image": "assets/images/prod-geleia-goiaba.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1045,
    "storeId": 109,
    "name": "Feijão verde 500 g",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Grãos",
    "price": 800,
    "stock": 20,
    "image": "assets/images/prod-feijao-verde.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1046,
    "storeId": 110,
    "name": "Frango com cuscuz",
    "desc": "Frango acompanhado de cuscuz de milho e salada. Porção individual demonstrativa.",
    "cat": "Almoço",
    "price": 2400,
    "stock": 20,
    "image": "assets/images/prod-galinha.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [],
    "offer": null
  },
  {
    "id": 1047,
    "storeId": 110,
    "name": "Carne de panela com arroz",
    "desc": "Carne de panela com arroz, feijão e legumes. Porção individual demonstrativa.",
    "cat": "Almoço",
    "price": 2800,
    "stock": 20,
    "image": "assets/images/prod-carne-panela.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [],
    "offer": null
  },
  {
    "id": 1048,
    "storeId": 110,
    "name": "Almoço vegetariano de legumes",
    "desc": "Porção individual de arroz, feijão, legumes e salada, sem carne. Receita demonstrativa.",
    "cat": "Vegetariano",
    "price": 2300,
    "stock": 20,
    "image": "assets/images/prod-almoco-veg.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1049,
    "storeId": 110,
    "name": "Peixe com purê de macaxeira",
    "desc": "Filé de peixe com purê de macaxeira e salada. Porção individual demonstrativa.",
    "cat": "Almoço",
    "price": 3200,
    "stock": 20,
    "image": "assets/images/prod-peixe-pure.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [],
    "offer": null
  },
  {
    "id": 1050,
    "storeId": 110,
    "name": "Suco de cajá 400 ml",
    "desc": "Suco de cajá em copo de 400 ml. Produto demonstrativo.",
    "cat": "Bebidas",
    "price": 800,
    "stock": 20,
    "image": "assets/images/prod-caja.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [],
    "offer": null
  },
  {
    "id": 1051,
    "storeId": 111,
    "name": "Cuscuz com ovo",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Café da manhã",
    "price": 1200,
    "stock": 20,
    "image": "assets/images/prod-cuscuz-ovo.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1052,
    "storeId": 111,
    "name": "Tapioca com queijo coalho",
    "desc": "Tapioca com queijo coalho, unidade individual. Produto demonstrativo.",
    "cat": "Tapiocas",
    "price": 1300,
    "stock": 20,
    "image": "assets/images/prod-tapioca.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1053,
    "storeId": 111,
    "name": "Pão de queijo — 3 unidades",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Lanches",
    "price": 1100,
    "stock": 20,
    "image": "assets/images/prod-pao-queijo.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1054,
    "storeId": 111,
    "name": "Bolo de banana — fatia",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Bolos",
    "price": 900,
    "stock": 20,
    "image": "assets/images/prod-bolo-banana.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1055,
    "storeId": 111,
    "name": "Café coado 200 ml",
    "desc": "Café coado sem leite, copo de 200 ml. Produto demonstrativo.",
    "cat": "Bebidas",
    "price": 600,
    "stock": 20,
    "image": "assets/images/prod-cafe-coado.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1056,
    "storeId": 112,
    "name": "Cesta de hortaliças",
    "desc": "Cesta demonstrativa com alface, tomate, cenoura e cheiro-verde.",
    "cat": "Cestas",
    "price": 2400,
    "stock": 20,
    "image": "assets/images/prod-cesta-hortalicas.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1057,
    "storeId": 112,
    "name": "Banana prata 1 kg",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Frutas",
    "price": 800,
    "stock": 20,
    "image": "assets/images/prod-banana.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1058,
    "storeId": 112,
    "name": "Cenoura 1 kg",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Hortaliças",
    "price": 800,
    "stock": 20,
    "image": "assets/images/prod-cenoura.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1059,
    "storeId": 112,
    "name": "Geleia de goiaba 250 g",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Artesanais",
    "price": 1600,
    "stock": 20,
    "image": "assets/images/prod-geleia-goiaba.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1060,
    "storeId": 112,
    "name": "Feijão verde 500 g",
    "desc": "Produto de exemplo. O tamanho ou a quantidade estão indicados no nome.",
    "cat": "Grãos",
    "price": 800,
    "stock": 20,
    "image": "assets/images/prod-feijao-verde.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": null,
    "preferences": [
      "vegano",
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1061,
    "storeId": 1,
    "name": "Marmita vegetariana da casa",
    "desc": "Porção individual de arroz, feijão, legumes e salada, sem carne. Receita demonstrativa.",
    "cat": "Vegetariano",
    "price": 2300,
    "stock": 20,
    "image": "assets/images/prod-almoco-veg.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1062,
    "storeId": 1,
    "name": "Baião vegetariano individual",
    "desc": "Porção individual de arroz, feijão, legumes e salada, sem carne. Receita demonstrativa.",
    "cat": "Vegetariano",
    "price": 2400,
    "stock": 20,
    "image": "assets/images/prod-almoco-veg.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  },
  {
    "id": 1063,
    "storeId": 1,
    "name": "Escondidinho de legumes",
    "desc": "Porção individual de purê de macaxeira com legumes, preparada sem carne, leite ou queijo. Receita demonstrativa.",
    "cat": "Vegetariano",
    "price": 2600,
    "stock": 20,
    "image": "assets/images/prod-escondidinho-veg.webp",
    "oldPrice": 0,
    "lastBatch": false,
    "demo": true,
    "available": true,
    "serves": 1,
    "preferences": [
      "vegetariano"
    ],
    "offer": null
  }
];


const DEMO_CUSTOMERS = Object.freeze([
  'Ana Lima','Bruno Alves','Camila Sousa','Diego Rocha','Elisa Martins','Felipe Costa',
  'Gabi Melo','Hugo Silva','Rafaela Monteiro','Lucas Ferreira','Marina Oliveira','João Vitor'
]);
const DEMO_NEIGHBORHOODS = Object.freeze(['Centro','Santa Luzia','São José','Planalto']);
const DEMO_ADDRESSES = Object.freeze([
  'Rua das Flores, 12','Rua do Mercado, 24','Rua da Praça, 36','Rua do Sol, 48',
  'Rua da Serra, 17','Rua das Palmeiras, 29'
]);

function demoOrderItems(storeId,offset=0,count=2){
  const products=PRODUCTS.filter(product=>Number(product.storeId)===Number(storeId)&&product.available!==false);
  if(!products.length)return [];
  return Array.from({length:Math.min(count,products.length)},(_,index)=>{
    const product=products[(offset+index)%products.length];
    return {productId:product.id,name:product.name,price:product.price,qty:index===0?1:Math.min(2,Math.max(1,product.stock||1))};
  });
}

function buildDemoOrder({store,status,index,idBase,ageMinutes,note}){
  const items=demoOrderItems(store.id,index,2);
  const subtotal=items.reduce((sum,item)=>sum+item.price*item.qty,0);
  const customerIndex=(store.id*3+index)%DEMO_CUSTOMERS.length;
  return {
    id:idBase+store.id*100+index,
    demo:true,
    storeId:store.id,
    createdAt:new Date(Date.now()-ageMinutes*60*1000).toISOString(),
    status,
    items,
    subtotal,
    deliveryFee:Number(store.fee)||0,
    total:subtotal+(Number(store.fee)||0),
    paymentLabel:index%2?'Cartão na entrega (exemplo)':'Pix (exemplo)',
    note:note||'Pedido fictício usado apenas para demonstrar o fluxo do painel.',
    customer:{
      name:DEMO_CUSTOMERS[customerIndex]+' (exemplo)',
      phone:'(88) 90000-0000',
      address:'Endereço fictício: '+DEMO_ADDRESSES[(store.id+index)%DEMO_ADDRESSES.length],
      neighborhood:DEMO_NEIGHBORHOODS[(store.id+index)%DEMO_NEIGHBORHOODS.length]
    }
  };
}

function makeDemoOrders(){
  const statuses=['pendente','preparando','pronto','concluido'];
  return STORES.flatMap(store=>statuses.map((status,index)=>buildDemoOrder({
    store,status,index:index+1,idBase:1000,ageMinutes:(index+1)*75+store.id,
    note:index===0?'Pedido novo aguardando análise do comerciante.':'Pedido fictício usado para demonstrar esta etapa do atendimento.'
  })));
}

function extraPendingOrders(){
  return STORES.flatMap(store=>[1,2].map(index=>buildDemoOrder({
    store,status:'pendente',index:index+10,idBase:6000,ageMinutes:index*12+store.id,
    note:index===1
      ? 'Cliente pediu atenção à embalagem e para avisar ao chegar.'
      : 'Pedido fictício adicional aguardando aceite no painel.'
  })));
}

const PAGE_TITLES = Object.freeze({
  inicio:'Início',
  estabelecimentos:'Estabelecimentos',
  cardapio:'Cardápio',
  fornada:'Última Fornada',
  produtores:'Do produtor',
  sabia:'Sabiá',
  pedidos:'Meus pedidos',
  entrar:'Entrar',
  cadastro:'Criar conta',
  cliente:'Minha conta',
  'comerciante-entrar':'Entrar como comerciante',
  'comerciante-cadastro':'Cadastro de comerciante',
  comerciante:'Painel do comerciante',
  loja:'Perfil',
  termos:'Termos de Uso',
  privacidade:'Privacidade',
  cookies:'Cookies e armazenamento',
  cancelamentos:'Cancelamentos e reembolsos',
  'regras-comerciante':'Regras do comerciante',
  admin:'Administração'
});

function initialState() {
  return {
    stores: JSON.parse(JSON.stringify(STORES)),
    products: JSON.parse(JSON.stringify(PRODUCTS)),
    cart: [],
    orders: [],
    merchantOrders: [],
    adminApplications: [],
    demoOrders: makeDemoOrders(),
    customer: { logged: false, name: '', email: '', phone: '', address: '', neighborhood: '', password: '' },
    merchant: { logged: false, owner: '', storeId: 1, phone: '', email: '', password: '', document: '', officialProof: '', verified: false },
    location: '',
    city: 'Guaraciaba do Norte',
    page: 'inicio',
    storeViewId: 1,
    filters: { query: '', category: 'Todos', storeId: '0', sort: 'relevancia' },
    ui: { catalogScope: 'region', accountTab: 'entrar', accountRole: 'cliente', merchantAuthTab: 'entrar', merchantPanelTab: 'pendentes', presentationMerchant: false, productEditor: 0 },
    sabiaContext: {budget: null, people: 1, preference: '', exclude: [], storeId: 0},
    chat: [{ me: false, text: 'Oi! Sou a Sabiá. Posso te ajudar com produtos, preços, Última Fornada, produtores e sugestões do cardápio.' }]
  };
}

let state;
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem('apete_serra_v13') || 'null');
  state = saved?.products?.length ? saved : initialState();
  if(!Array.isArray(state.products))state.products=[];
  if(!Array.isArray(state.stores))state.stores=[];
  for (const fresh of PRODUCTS) {
    const item = state.products.find((p) => Number(p.id) === Number(fresh.id));
    if (!item) state.products.push(JSON.parse(JSON.stringify(fresh)));
    else if (!item.image || /^https?:/i.test(item.image)) item.image = fresh.image;
  }
  for (const fresh of STORES) {
    const item = state.stores.find((s) => Number(s.id) === Number(fresh.id));
    if (!item) state.stores.push(JSON.parse(JSON.stringify(fresh)));
    else {
      item.cover = fresh.cover;
      item.verified = fresh.verified;
      item.panelPassword = item.panelPassword || fresh.panelPassword;
      item.officialRef = item.officialRef || fresh.officialRef;
      item.address = item.address || fresh.address || '';
      item.serviceAreas = Array.isArray(item.serviceAreas)&&item.serviceAreas.length ? item.serviceAreas : [...(fresh.serviceAreas||[])];
      if(typeof item.delivery!=='boolean')item.delivery=fresh.delivery;
      if(typeof item.pickup!=='boolean')item.pickup=fresh.pickup;
    }
  }
  if (!Array.isArray(state.demoOrders)) state.demoOrders = makeDemoOrders();
  else {
    const knownDemoIds=new Set(state.demoOrders.map(order=>Number(order.id)));
    for(const order of makeDemoOrders())if(!knownDemoIds.has(Number(order.id)))state.demoOrders.push(order);
  }
  if (!Array.isArray(state.merchantOrders)) state.merchantOrders = [];
  if (!Array.isArray(state.adminApplications)) state.adminApplications = [];
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
      || String(state.customer.phone||'').replace(/\D/g,'').length < 10) {
    state.customer = initialState().customer;
  } else if (!window.APETE_BACKEND?.hasStoredSession?.() && !state.customer.demo) {
    state.customer.logged = false;
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
const VALID_PAGES = new Set([
  'inicio','estabelecimentos','cardapio','fornada','produtores','sabia','pedidos',
  'entrar','cadastro','comerciante-entrar','comerciante-cadastro','cliente','comerciante',
  'loja','termos','privacidade','cookies','cancelamentos','regras-comerciante','admin'
]);
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
  state.page = VALID_PAGES.has(pageFromHash)
    ? pageFromHash
    : (!state.page || AUTH_ROUTES[state.page] || !VALID_PAGES.has(state.page) ? 'inicio' : state.page);
  if (state.page === 'cliente' && !(state.customer.logged && !state.customer.demo && window.APETE_BACKEND?.hasStoredSession?.())) state.page = 'inicio';
  if (state.page === 'comerciante' && !state.merchant.logged) state.page = 'inicio';
}
let cartStep = 'cart';
let selectedPayment = 'pix';
let toastTimer;
let locating = false;
let checkoutDraft = null;
let checkoutPrices=new Map();
let modalReturnFocus = null;
let storageWarningShown = false;
const busyActions = new Set();
const checkoutController=window.APETE_ORDER_FLOW.createCheckoutController({storage:sessionStorage,crypto:window.crypto});
const syncSingleFlight=window.APETE_ORDER_FLOW.createSingleFlight();
const orderSync={customer:{error:'',updatedAt:null},merchant:{error:'',updatedAt:null}};
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
let sabiaDiagnostic = null;
let sabiaDiagnosticBusy = '';
state.city = REGIONAL_CITIES.includes(state.city) ? state.city : 'Guaraciaba do Norte';

const getStore = (id) => state.stores.find((item) => item.id === Number(id));
const getProduct = (id) => {const product=state.products.find(item=>item.id===Number(id));return product?globalThis.APETE_OFFERS.project(product):undefined;};
const activeMerchantStore = () => getStore(state.merchant.storeId || 1) || state.stores[0] || STORES[0];
const storeCategoryLabel = (store) => String(store?.category||'').trim() || (store?.producer ? 'Produtor local' : 'Estabelecimento local');
const storeDescription = (store) => String(store?.desc||'').trim() || 'Novo estabelecimento cadastrado no APETÊ. Informações do perfil em atualização.';
const storeHeroText = (store) => String(store?.hero||'').trim() || storeDescription(store);
const storeEta = (store) => String(store?.time||'').trim() || 'Prazo a confirmar';
const storeRating = (store) => {
  const rating=Number(store?.rating);
  return Number.isFinite(rating)&&rating>0?rating:null;
};
const isCustomerLogged = () => Boolean(state.customer.logged && state.customer.phone);
const isRealCustomerLogged = () => Boolean(state.customer.logged && !state.customer.demo && window.APETE_BACKEND?.hasStoredSession?.());
const isMerchantLogged = () => Boolean(state.merchant.logged && state.merchant.storeId);
const isAdmin = () => Boolean(isRealCustomerLogged() && state.customer.role === 'admin');
const merchantAccess = () => isMerchantLogged() || (state.ui.presentationMerchant && !AUTH_PAGE);
const isMerchantView = () => state.page === 'comerciante' && merchantAccess();

function prepareClientForVideo() {
  state.ui.presentationMerchant=false;
  if(!isRealCustomerLogged())state.customer={...VIDEO_CUSTOMER};
  save();
}

// A conta ilustrativa só existe quando o usuário ativa manualmente a demonstração.
// Identidades de apresentação salvas por versões anteriores nunca contam como login.
if(state.customer?.demo && !window.APETE_BACKEND?.hasStoredSession?.()){
  state.customer={...initialState().customer};
  state.ui.savedCustomerBeforeDemo=null;
  save();
}

// Páginas de login/cadastro só redirecionam quando há sessão real do Supabase.
if(AUTH_PAGE==='entrar'||AUTH_PAGE==='cadastro'){
  if(isRealCustomerLogged())location.replace('index.html#cliente');
}

function save() {
  const customer={...(state.customer||{}),password:''};
  const merchant={...(state.merchant||{}),password:''};
  try {
    localStorage.setItem(KEY, JSON.stringify({...state,customer,merchant,chat:[]}));
    return true;
  } catch(error) {
    console.warn('apete_local_storage_unavailable',{message:String(error?.message||error).slice(0,180)});
    if(!storageWarningShown){
      storageWarningShown=true;
      setTimeout(()=>toast('Não foi possível salvar algumas preferências neste navegador. O backend continua protegido.'),0);
    }
    return false;
  }
}

async function hydrateCatalogFromBackend() {
  if(!window.APETE_BACKEND?.loadCatalog)return;
  try {
    const remote=await window.APETE_BACKEND.loadCatalog();
    if(!remote?.stores?.length||!remote?.products?.length)return;
    const localStores=new Map(state.stores.map(store=>[Number(store.id),store]));
    const localProducts=new Map(state.products.map(product=>[Number(product.id),product]));
    state.stores=remote.stores.map(store=>({...localStores.get(Number(store.id)),...store}));
    state.products=remote.products.map(product=>({...localProducts.get(Number(product.id)),...product}));
    const validIds=new Set(state.products.map(product=>Number(product.id)));
    state.cart=(state.cart||[]).filter(item=>validIds.has(Number(item.productId)));
    save();
    render();
  } catch(error) {
    console.warn('apete_backend_catalog_fallback',{message:String(error?.message||error).slice(0,180)});
  }
}

function applyBackendCustomer(profile) {
  if(!profile)return false;
  state.customer={
    logged:true,
    name:String(profile.full_name||profile.email?.split('@')[0]||'Cliente APETÊ').trim(),
    email:String(profile.email||'').trim(),
    phone:normalizePhone(profile.phone||''),
    address:String(profile.address||''),
    neighborhood:String(profile.neighborhood||''),
    password:'',
    demo:false,
    backend:true,
    userId:String(profile.id||''),
    role:String(profile.role||'customer')
  };
  state.ui.savedCustomerBeforeDemo=null;
  state.ui.demoOptOut=true;
  return true;
}

function friendlyBackendError(error,fallback='Não foi possível concluir agora.') {
  const message=String(error?.message||'').toLowerCase();
  if(/network_offline|network_unavailable/.test(message))return 'Sem conexão com o servidor. Confira sua internet e tente novamente.';
  if(/backend_timeout/.test(message))return 'O servidor demorou para responder. Tente novamente em alguns segundos.';
  if(/invalid login credentials/.test(message))return 'E-mail ou senha incorretos.';
  if(/email not confirmed/.test(message))return 'Confirme seu e-mail antes de entrar.';
  if(/user already registered|already been registered/.test(message))return 'Esse e-mail já possui cadastro.';
  if(/authentication_required|jwt|unauthorized/.test(message))return 'Sua sessão expirou. Entre novamente.';
  if(/price_changed/.test(message))return 'O preço mudou ou a oferta terminou. Confira o valor atualizado na sacola antes de confirmar.';
  if(/invalid_offer_window/.test(message))return 'Informe início e fim válidos para a oferta, com término no futuro.';
  if(/insufficient_stock/.test(message))return 'Um dos produtos não tem mais essa quantidade em estoque.';
  if(/product_unavailable/.test(message))return 'Um dos produtos não está mais disponível.';
  if(/store_unavailable|delivery_unavailable|city_unavailable/.test(message))return 'Esse pedido não está disponível para a entrega selecionada.';
  if(/legal_acceptance_required/.test(message))return 'Você precisa aceitar os Termos de Uso e a Política de Privacidade atuais antes de continuar.';
  if(/email.*rate limit|rate limit.*email/.test(message))return 'Muitas tentativas de e-mail em pouco tempo. Aguarde um pouco e tente novamente.';
  if(/signup.*disabled|signups? not allowed/.test(message))return 'O cadastro de novas contas está desativado no backend.';
  if(/error sending confirmation email|smtp/.test(message))return 'A conta não pôde ser criada porque o e-mail de confirmação não foi enviado.';
  if(/database error saving new user/.test(message))return 'O Auth criou a tentativa, mas houve erro ao salvar o perfil no banco.';
  if(/invalid api key|api key/.test(message))return 'O aplicativo não conseguiu autenticar com o backend. Atualize a página e tente novamente.';
  if(/password.*at least|weak password/.test(message))return 'A senha foi recusada pelo backend. Use pelo menos 8 caracteres com letras e números.';
  return fallback;
}

async function refreshCustomerOrders({rerender=false}={}) {
  if(!window.APETE_BACKEND?.loadOrders||!window.APETE_BACKEND?.hasStoredSession?.())return;
  const owner=state.customer.userId;
  return syncSingleFlight('customer:'+owner,async()=>{
    try {
      const orders=await window.APETE_BACKEND.loadOrders();
      if(!isRealCustomerLogged()||state.customer.userId!==owner)return;
      const changed=JSON.stringify(orders)!==JSON.stringify(state.orders);
      state.orders=orders;
      orderSync.customer={error:'',updatedAt:new Date()};
      save();
      if(changed&&rerender&&state.page==='pedidos'&&$('#modal').hidden&&!busyActions.size)render();
    } catch(error) {
      if(state.customer.userId===owner)orderSync.customer.error='Não foi possível atualizar. Os pedidos abaixo podem estar desatualizados.';
    }
    updateOrdersSyncView();
  });
}

async function restoreCustomerFromBackend() {
  await window.APETE_BACKEND?.ready;
  if(!window.APETE_BACKEND?.hasStoredSession?.())return;
  try {
    const profile=await window.APETE_BACKEND.getProfile();
    if(!applyBackendCustomer(profile))throw new Error('profile_unavailable');
    state.orders=await window.APETE_BACKEND.loadOrders();
    save();
    if(AUTH_PAGE==='entrar'||AUTH_PAGE==='cadastro'){
      location.replace('index.html#cliente');
      return;
    }
    render();
  } catch(error) {
    state.customer={...initialState().customer};
    state.orders=[];
    save();
  }
}

function applyMerchantMembership(membership,owner='') {
  const remote=membership?.store;
  if(!remote)return false;
  const current=getStore(remote.id);
  if(current)Object.assign(current,remote);
  else state.stores.push(remote);
  state.merchant={
    logged:true,
    backend:true,
    owner:owner||state.customer?.name||'Responsável',
    storeId:remote.id,
    backendStoreId:remote.backendId,
    phone:remote.contactPhone||state.customer?.phone||'',
    email:state.customer?.email||'',
    password:'',
    document:'',
    officialProof:remote.instagram||'',
    verified:Boolean(remote.verified),
    role:membership.role||'staff'
  };
  state.ui.presentationMerchant=false;
  state.ui.merchantPanelTab='pendentes';
  return true;
}

async function refreshMerchantBackend({rerender=false}={}) {
  if(!state.merchant?.backend||!state.merchant.backendStoreId||!window.APETE_BACKEND?.loadMerchantOrders)return;
  const owner=state.customer.userId,storeId=state.merchant.backendStoreId;
  return syncSingleFlight('merchant:'+owner+':'+storeId,async()=>{
    try{
      const orders=await window.APETE_BACKEND.loadMerchantOrders(storeId);
      if(!state.merchant?.backend||state.merchant.backendStoreId!==storeId||state.customer.userId!==owner)return;
      const changed=JSON.stringify(orders)!==JSON.stringify(state.merchantOrders);
      state.merchantOrders=orders;
      orderSync.merchant={error:'',updatedAt:new Date()};
      save();
      if(changed&&rerender&&state.page==='comerciante'&&$('#modal').hidden&&!busyActions.size&&!$('#merchant-product-form')&&!$('#merchant-profile-form')&&!$('#merchant-offer-form'))render();
    }catch(error){
      if(state.merchant?.backendStoreId===storeId)orderSync.merchant.error='Não foi possível atualizar. Os pedidos abaixo podem estar desatualizados.';
    }
    updateOrdersSyncView();
  });
}

function orderSyncText(kind){
  const info=orderSync[kind];
  if(info.error)return info.error;
  if(info.updatedAt)return 'Atualizado às '+info.updatedAt.toLocaleTimeString('pt-BR')+'. Atualização automática enquanto esta página estiver aberta.';
  return 'Consultando pedidos no servidor…';
}
function orderSyncMarkup(kind){
  return `<div class="orders-sync" data-orders-sync="${kind}"><span role="status">${esc(orderSyncText(kind))}</span><button class="ghost-btn strong" data-action="refresh-orders">Atualizar pedidos</button></div>`;
}
function updateOrdersSyncView(){
  for(const element of document.querySelectorAll('[data-orders-sync]')){
    element.querySelector('[role="status"]').textContent=orderSyncText(element.dataset.ordersSync);
    element.classList.toggle('has-error',Boolean(orderSync[element.dataset.ordersSync].error));
  }
}
async function refreshVisibleOrders(){
  if(document.visibilityState==='hidden'||navigator.onLine===false||busyActions.size)return;
  if(state.page==='pedidos'&&isRealCustomerLogged())await refreshCustomerOrders({rerender:true});
  if(state.page==='comerciante'&&state.merchant?.backend)await refreshMerchantBackend({rerender:true});
}

async function refreshAdminApplications({rerender=false}={}) {
  if(!isAdmin()||!window.APETE_BACKEND?.loadAdminMerchantApplications)return;
  try{
    state.adminApplications=await window.APETE_BACKEND.loadAdminMerchantApplications();
    save();
    if(rerender&&state.page==='admin')render();
  }catch(error){
    console.warn('apete_admin_applications',{message:String(error?.message||error).slice(0,180)});
  }
}

async function reviewMerchantApplication(applicationId,decision) {
  if(!isAdmin())return toast('Acesso de administrador necessário.');
  try{
    await window.APETE_BACKEND.reviewMerchantApplication(applicationId,decision);
    await refreshAdminApplications({rerender:true});
    await hydrateCatalogFromBackend();
    toast(decision==='approve'?'Comerciante aprovado e loja criada.':'Solicitação rejeitada.','success');
  }catch(error){
    toast(friendlyBackendError(error,'Não foi possível revisar a solicitação.'));
  }
}

async function restoreMerchantFromBackend() {
  await window.APETE_BACKEND?.ready;
  if(!state.merchant?.backend||!window.APETE_BACKEND?.hasStoredSession?.())return;
  try{
    const memberships=await window.APETE_BACKEND.getMerchantMemberships();
    const membership=memberships.find(item=>item.store.backendId===state.merchant.backendStoreId||item.store.id===state.merchant.storeId);
    if(!membership)throw new Error('merchant_access_revoked');
    applyMerchantMembership(membership,state.merchant.owner);
    state.merchantOrders=await window.APETE_BACKEND.loadMerchantOrders(state.merchant.backendStoreId);
    save();
    if(AUTH_PAGE==='comerciante-entrar'||AUTH_PAGE==='comerciante-cadastro'){
      location.replace('index.html#comerciante');
      return;
    }
    if(state.page==='comerciante')render();
  }catch(error){
    state.merchant={...initialState().merchant};
    state.merchantOrders=[];
    save();
  }
}
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
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640"><defs><linearGradient id="g"><stop stop-color="${pal[0]}"/><stop offset="1" stop-color="${pal[1]}"/></linearGradient></defs><rect width="960" height="640" rx="28" fill="url(#g)"/><text x="50%" y="48%" text-anchor="middle" fill="white" font-size="60" font-family="Arial" font-weight="700">${esc(label||'APETÊ')}</text><text x="50%" y="58%" text-anchor="middle" fill="white" font-size="24" font-family="Arial">Imagem de apoio</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

function imgTag(src, alt, mode='food') {
  const safeSrc=String(src||'').trim()||fallbackImage(alt,mode);
  return `<img src="${esc(safeSrc)}" alt="${esc(alt)}" loading="lazy" decoding="async" data-fallback-src="${esc(fallbackImage(alt,mode))}">`;
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
function validCustomerName(value) {
  const name=String(value||'').trim();
  if(!/^[A-Za-zÀ-ÿ' ]{2,}$/.test(name))return false;
  const letters=name.toLocaleLowerCase('pt-BR').replace(/[^A-Za-zÀ-ÿ]/g,'');
  return new Set([...letters]).size>=2;
}
function validAddress(value) { return String(value||'').trim().length>=5; }
function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim()); }
function strongPassword(value) { return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(String(value || '')); }

function fieldError(selector,message) {
  const el=$(selector);
  if(el){
    el.setAttribute('aria-invalid','true');
    try{el.focus({preventScroll:true});}catch{el.focus();}
    el.scrollIntoView({behavior:'smooth',block:'center'});
    const clear=()=>{el.removeAttribute('aria-invalid');el.removeEventListener('input',clear);el.removeEventListener('change',clear);};
    el.addEventListener('input',clear,{once:true});
    el.addEventListener('change',clear,{once:true});
  }
  toast(message);
  return false;
}

function setPage(next, storeId = null, options = {}) {
  const { fromHistory=false, replaceHistory=false, scroll=true } = options;
  closeRegionSelector();
  closeModal({restoreFocus:false});
  closeSidebar();

  if(!VALID_PAGES.has(next)) next='inicio';
  if (isRealCustomerLogged() && (next === 'entrar' || next === 'cadastro')) next = 'cliente';
  if (isMerchantLogged() && (next === 'comerciante-entrar' || next === 'comerciante-cadastro')) next = 'comerciante';

  const inlineAuthRoute = ['entrar','cadastro','comerciante-entrar','comerciante-cadastro'].includes(next);
  if (inlineAuthRoute && AUTH_PAGE) {
    location.assign(`index.html#${encodeURIComponent(next)}`);
    return;
  }

  if (next === 'cliente' && !isRealCustomerLogged()) next = 'entrar';
  if (next === 'comerciante' && !merchantAccess()) next = 'comerciante-entrar';
  if (next === 'admin' && !isAdmin()) next = isRealCustomerLogged() ? 'cliente' : 'entrar';

  if (next !== 'pedidos') state.ui.orderSuccessId = null;
  state.page = next;
  if (storeId && getStore(storeId)) state.storeViewId = Number(storeId);
  if (next === 'loja' && !getStore(state.storeViewId)) {
    state.page='estabelecimentos';
    next='estabelecimentos';
  }
  save();

  if (AUTH_PAGE) {
    location.assign(`index.html#${encodeURIComponent(next)}`);
    return;
  }

  const nextHash=`#${next}`;
  if(fromHistory){
    if(location.hash!==nextHash) history.replaceState({apetePage:next},'',nextHash);
  } else if(location.hash!==nextHash){
    const method=replaceHistory?'replaceState':'pushState';
    history[method]({apetePage:next},'',nextHash);
  }

  render();
  if(next==='sabia')detectSabiaMode();
  if(next==='pedidos')refreshCustomerOrders({rerender:true});
  if(next==='comerciante'&&state.merchant?.backend)refreshMerchantBackend({rerender:true});
  if(next==='admin'&&isAdmin())refreshAdminApplications({rerender:true});
  if(scroll&&next!=='sabia')window.scrollTo({ top: 0, behavior: 'instant' });
}

function closeSidebar() {
  $('#sidebar')?.classList.remove('is-open');
  $('#scrim').hidden = true;
  document.body.classList.remove('sidebar-open');
  $('#menu-toggle')?.setAttribute('aria-expanded','false');
}
function openSidebar() {
  closeRegionSelector();
  closeModal({restoreFocus:false});
  $('#sidebar')?.classList.add('is-open');
  $('#scrim').hidden = false;
  document.body.classList.add('sidebar-open');
  $('#menu-toggle')?.setAttribute('aria-expanded','true');
  requestAnimationFrame(()=>$('#sidebar-close')?.focus({preventScroll:true}));
}
function closeModal({restoreFocus=true}={}) {
  const modal=$('#modal');
  if(!modal)return;
  const wasOpen=!modal.hidden;
  modal.hidden = true;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden','true');
  $('#modal-body').innerHTML = '';
  document.body.classList.remove('modal-open');
  if(wasOpen&&restoreFocus&&modalReturnFocus?.isConnected){
    const focusTarget=modalReturnFocus;
    requestAnimationFrame(()=>{if(focusTarget.isConnected)focusTarget.focus({preventScroll:true});});
  }
  modalReturnFocus=null;
}
function openModal(title, html) {
  closeRegionSelector();
  const modal=$('#modal');
  if(!modal)return;
  const wasHidden=modal.hidden;
  const panel=modal.querySelector('.modal-panel');
  const previousScroll=wasHidden?0:(panel?.scrollTop||0);
  if(wasHidden&&document.activeElement instanceof HTMLElement)modalReturnFocus=document.activeElement;
  closeSidebar();
  $('#modal-title').textContent = title;
  $('#modal-body').innerHTML = html;
  modal.hidden = false;
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => {
    modal.classList.add('is-open');
    if(wasHidden)modal.querySelector('[data-action="close"]')?.focus({preventScroll:true});
    else if(panel)panel.scrollTop=previousScroll;
  });
}

async function runBusyAction(button,key,task) {
  const actionKey=String(key||'action');
  if(busyActions.has(actionKey))return;
  busyActions.add(actionKey);
  if(button){
    button.disabled=true;
    button.setAttribute('aria-busy','true');
    button.classList.add('is-busy');
  }
  try {
    return await task();
  } catch(error) {
    console.error('apete_action_error',{action:actionKey,error});
    toast(friendlyBackendError(error,'Algo deu errado. Tente novamente.'));
  } finally {
    busyActions.delete(actionKey);
    if(button?.isConnected){
      button.disabled=false;
      button.removeAttribute('aria-busy');
      button.classList.remove('is-busy');
    }
  }
}

function captureCheckoutDraft() {
  if(cartStep!=='checkout')return checkoutDraft;
  const name=$('#checkout-name')?.value;
  const phone=$('#checkout-phone')?.value;
  const neighborhood=$('#checkout-neighborhood')?.value;
  const address=$('#checkout-address')?.value;
  const note=$('#checkout-note')?.value;
  if([name,phone,neighborhood,address,note].some(value=>value!==undefined)){
    checkoutDraft={
      name:name??checkoutDraft?.name??state.customer.name??'',
      phone:phone??checkoutDraft?.phone??onlyDigits(state.customer.phone||''),
      neighborhood:neighborhood??checkoutDraft?.neighborhood??state.customer.neighborhood??'',
      address:address??checkoutDraft?.address??state.customer.address??'',
      note:note??checkoutDraft?.note??''
    };
  }
  return checkoutDraft;
}

function productCard(product) {
  product=globalThis.APETE_OFFERS.project(product);
  const store = getStore(product.storeId);
  if(!store)return '';
  return `
    <article class="product-card ${store.producer ? 'producer-tone' : 'merchant-tone'}">
      <div class="product-image">
        ${imgTag(product.image, product.name, store.producer ? 'producer' : 'food')}
        <div class="image-top-row">
          <span class="chip dark">${esc(product.cat)}</span>
          ${product.offerActive ? '<span class="chip plum">Oferta</span>' : ''}
        </div>
      </div>
      <div class="product-body">
        <div class="store-line"><span class="store-dot"></span><small>${esc(store.name)}</small><span class="subtle">${esc(store.city)}</span></div>
        <h3>${esc(product.name)}</h3>
        <p>${esc(product.desc)}</p>
        ${product.offerActive?`<p class="note">Oferta até ${esc(dateTime(product.offer.endsAt))}.</p>`:''}
        <div class="price-line"><strong>${money(product.price)}</strong>${product.offerActive ? `<del>${money(product.oldPrice)}</del>` : ''}<span class="subtle">${product.stock} disponíveis</span></div>
        <div class="product-foot">
          ${isMerchantView() ? `<button class="profile-btn" data-action="edit-product" data-id="${product.id}">Editar produto</button><span class="chip ${product.offerActive?'orange':'soft'}">${product.offerActive?'Última Fornada':'No cardápio'}</span>` : `${state.page==='loja' && Number(state.storeViewId)===store.id ? `<span class="product-profile-context">${esc(store.name)} · ${esc(store.city)}</span>` : `<button class="profile-btn" data-action="goto-store" data-id="${store.id}">Ver perfil</button>`}${storeServesSelectedCity(store)?`<button class="add-btn" data-action="add-cart" data-id="${product.id}" aria-label="Adicionar à sacola">+</button>`:`<button class="profile-btn" data-action="choose-store-city" data-id="${store.id}">Escolher ${esc(store.city)}</button>`}`}
        </div>
      </div>
    </article>
  `;
}

function offerCard(product) {
  product=globalThis.APETE_OFFERS.project(product);
  return `<article class="offer-card"><div><strong>${esc(product.name)}</strong><p>${money(product.price)} ${product.offerActive ? `<del>${money(product.oldPrice)}</del>` : ''}</p></div><button class="ghost-btn strong" data-action="add-cart" data-id="${product.id}">Pegar</button></article>`;
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
          <span class="cover-kicker">${esc(storeCategoryLabel(store))}</span>
          <h4>${esc(store.name)}</h4>
          <div class="cover-meta"><span>${esc(store.city)}</span>${storeRating(store)?`<span>★ ${storeRating(store).toFixed(1)}</span>`:'<span>Novo no APETÊ</span>'}<span>${esc(storeEta(store))}</span></div>
        </div>
      </div>
      <div class="store-body">
        <div class="chip-row"><span class="chip orange">${store.open ? 'Aberto agora' : 'Fechado'}</span><span class="chip soft">Entrega ${money(store.fee)}</span></div>
        <p>${esc(storeDescription(store))}</p>
        <div class="fact-row">${instagramBadge(store)}<span>${esc(store.address||store.city)}</span></div>
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
          <span class="cover-kicker">${esc(storeCategoryLabel(store))}</span>
          <h4>${esc(store.name)}</h4>
          <div class="cover-meta"><span>${esc(store.city)}</span><span>${esc(storeEta(store))}</span></div>
        </div>
      </div>
      <div class="producer-body">
        <div class="chip-row"><span class="chip soft producer-chip">Colheita local</span><span class="chip producer-alt">Entrega ${money(store.fee)}</span></div>
        <p>${esc(storeDescription(store))}</p>
        <p class="store-address">${esc(store.address||store.city)}</p>
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

function storeServesSelectedCity(store){return !!store&&store.open!==false&&(store.city===state.city||store.serviceAreas?.includes(state.city)===true);}
function publicStoreVisible(store){return !!store&&store.open!==false&&(state.ui.catalogScope!=='city'||storeServesSelectedCity(store));}
function publicProductAvailable(product){return product.available!==false&&product.stock>0&&publicStoreVisible(getStore(product.storeId));}
function catalogOverview(){
  const stores=state.stores.filter(store=>store.open!==false);
  const products=state.products.filter(product=>product.available!==false&&product.stock>0&&stores.some(store=>store.id===product.storeId));
  const localStores=stores.filter(storeServesSelectedCity);
  const localProducts=products.filter(product=>storeServesSelectedCity(getStore(product.storeId)));
  return `<section class="catalog-overview" aria-label="Abrangência do catálogo"><div><strong>${stores.length} estabelecimentos · ${products.length} produtos na Serra</strong><p>Em ${esc(state.city)}: ${localStores.length} estabelecimentos e ${localProducts.length} produtos. Catálogo demonstrativo com fotos ilustrativas.</p></div><div class="catalog-scope" role="group" aria-label="Onde explorar"><button class="ghost-btn strong" data-action="catalog-scope" data-scope="region" aria-pressed="${state.ui.catalogScope!=='city'}">Toda a Serra</button><button class="ghost-btn strong" data-action="catalog-scope" data-scope="city" aria-pressed="${state.ui.catalogScope==='city'}">Entrega em ${esc(state.city)}</button></div><p class="note">Explorar outras cidades não altera sua cidade de entrega. A Sabiá continua buscando opções para ${esc(state.city)}.</p></section>`;
}
function homePage() {
  const stores = state.stores.filter(store=>!store.producer&&storeServesSelectedCity(store));
  const producers = state.stores.filter(store=>store.producer&&storeServesSelectedCity(store));
  const featured = state.products.filter(product=>publicProductAvailable(product)&&!globalThis.APETE_OFFERS.isActive(product)).slice(0, 6);
  const offers = state.products.filter(product=>publicProductAvailable(product)&&globalThis.APETE_OFFERS.isActive(product)).slice(0, 5);
  const heroImage = asset('cover-casa.webp');
  return `
    ${pageHead('Peça sem complicação', 'Escolha seu próximo pedido entre os restaurantes, padarias e produtores da região.')}${catalogOverview()}
    <section class="hero-mini home-hero-alt">
      <article class="hero-card">${imgTag(heroImage, 'Destaque APETÊ', 'store')}<div class="hero-copy"><h2>Escolha onde pedir hoje.</h2><p>Explore o cardápio, entre na sua conta só quando precisar comprar e acompanhe seus pedidos sem enrolação.</p><div class="hero-actions"><button class="primary-btn" data-action="go-page" data-page="cardapio">Explorar cardápio</button><button class="ghost-btn strong" data-action="go-page" data-page="estabelecimentos">Ver perfis</button></div></div></article>
      <article class="hero-panel">
        <h3>O que você encontra aqui</h3>
        <p>Três atalhos realmente úteis para começar mais rápido.</p>
        <div class="quick-list">
          <div class="quick-pill"><div><strong>Entrega local</strong><small>Restaurantes, padaria e produtores da região</small></div><span>→</span></div>
          <div class="quick-pill"><div><strong>Combine o pagamento com a loja</strong><small>O APETÊ registra o método escolhido; a cobrança é feita pelo estabelecimento</small></div><span>→</span></div>
          <div class="quick-pill"><div><strong>Acompanhe seus pedidos</strong><small>Entre na conta para revisar e acompanhar tudo</small></div><span>→</span></div>
        </div>
      </article>
    </section>
    <section class="home-calls">
      <article class="call-card warm-card"><h3>Última Fornada</h3><p>Ofertas com prazo cadastrado para ajudar a reduzir o desperdício. Confira as condições de consumo com a loja.</p><button class="ghost-btn strong" data-action="go-page" data-page="fornada">Abrir Última Fornada</button>${offers.length?`<div class="offer-grid compact-offers">${offers.slice(0,3).map(offerCard).join('')}</div>`:'<p class="note">Nenhuma oferta válida para sua cidade agora. Você pode abrir a seção e consultar outras cidades.</p>'}</article>
      <article class="call-card merchant-tone"><span class="chip soft">Comerciantes</span><h3>Peça refeições e lanches</h3><p>Perfis com cardápio, tempo de entrega e itens em destaque.</p><button class="ghost-btn strong" data-action="go-page" data-page="estabelecimentos">Abrir estabelecimentos</button></article>
      <article class="call-card producer-tone"><span class="chip producer-alt">Produtores</span><h3>Compre direto de quem produz</h3><p>Hortaliças, cestas, mel e outros itens locais com entrega.</p><button class="ghost-btn strong" data-action="go-page" data-page="produtores">Ver produtores</button></article>

    </section>
    <section style="margin-bottom:24px"><div class="section-head"><div><h3>Estabelecimentos em destaque</h3><p>Perfis para pedir almoço, lanche ou café.</p></div><button class="section-link" data-action="go-page" data-page="estabelecimentos">Ver todos</button></div><div class="store-grid">${stores.map(storeCard).join('')}</div></section>
    <section style="margin-bottom:24px"><div class="section-head"><div><h3>Do produtor para sua mesa</h3><p>Produtos da região e itens artesanais.</p></div><button class="section-link" data-action="go-page" data-page="produtores">Abrir seção</button></div><div class="producer-grid">${producers.map(producerCard).join('')}</div></section>
    <section style="margin-bottom:24px"><div class="section-head"><div><h3>Produtos em destaque</h3><p>Escolha seu próximo favorito e adicione à sacola.</p></div><button class="section-link" data-action="go-page" data-page="cardapio">Abrir catálogo</button></div><div class="product-grid">${featured.map(productCard).join('')}</div></section>
  `;
}

function storesPage() {
  const merchants = state.stores.filter(store=>!store.producer&&publicStoreVisible(store));
  const producers = state.stores.filter(store=>store.producer&&publicStoreVisible(store));
  return `${pageHead('Estabelecimentos', 'Explore restaurantes, padaria e produtores da região.')}${catalogOverview()}<section style="margin-bottom:24px"><div class="section-head"><div><h3>Comerciantes</h3><p>Restaurantes e padaria com capa própria e miniaturas dos itens.</p></div></div><div class="store-grid">${merchants.map(storeCard).join('')}</div></section><section><div class="section-head"><div><h3>Produtores locais</h3><p>Perfis em cor diferente, com lista de produtos e miniaturas.</p></div></div><div class="producer-grid">${producers.map(producerCard).join('')}</div></section>`;
}

function menuFilters() {
  const storeOptions = ['<option value="0">Todos os perfis</option>'].concat(state.stores.filter(publicStoreVisible).map((store) => `<option value="${store.id}" ${String(store.id) === state.filters.storeId ? 'selected' : ''}>${esc(store.name)}</option>`)).join('');
  const categories = ['Todos', ...new Set(state.products.filter(publicProductAvailable).map((item) => item.cat))];
  return `
    <section class="filter-box">
      <div class="field"><label>Buscar</label><input id="filter-query" class="input" placeholder="Ex.: baião, café, cesta" value="${esc(state.filters.query)}"></div>
      <div class="field"><label>Categoria</label><select id="filter-category" class="select">${categories.map((category) => `<option value="${esc(category)}" ${state.filters.category === category ? 'selected' : ''}>${esc(category)}</option>`).join('')}</select></div>
      <div class="field"><label>Perfil</label><select id="filter-store" class="select">${storeOptions}</select></div>
      <div class="field"><label>Ordenar</label><select id="filter-sort" class="select"><option value="relevancia" ${state.filters.sort === 'relevancia' ? 'selected' : ''}>Relevância</option><option value="preco-menor" ${state.filters.sort === 'preco-menor' ? 'selected' : ''}>Menor preço</option><option value="preco-maior" ${state.filters.sort === 'preco-maior' ? 'selected' : ''}>Maior preço</option></select></div>
    </section>`;
}

function filteredProducts() {
  if(state.filters.storeId!=='0'&&!publicStoreVisible(getStore(state.filters.storeId)))state.filters.storeId='0';
  if(state.filters.category!=='Todos'&&!state.products.some(p=>publicProductAvailable(p)&&p.cat===state.filters.category))state.filters.category='Todos';
  let items = state.products.filter(publicProductAvailable).map(product=>globalThis.APETE_OFFERS.project(product));
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
  return `${pageHead('Cardápio', 'Explore comidas e produtos da Serra ou filtre pela sua cidade de entrega.')}${catalogOverview()}${menuFilters()}<p class="note">${items.length} produto(s) nesta seleção.</p><div class="product-grid">${items.length?items.map(productCard).join(''):'<div class="empty">Nenhum produto encontrado. Tente outro filtro ou outra busca.</div>'}</div>`;
}

function lastBatchPage() {
  const items = state.products.filter(item=>publicProductAvailable(item)&&globalThis.APETE_OFFERS.isActive(item));
  return `${pageHead('Última Fornada', 'Produtos selecionados pelos estabelecimentos para oferecer com desconto e ajudar a reduzir desperdício.')}${catalogOverview()}<p class="note">Só aparecem ofertas dentro do prazo cadastrado e com estoque. Confirme as condições de conservação com a loja. Os itens demonstrativos são exemplos.</p><div class="product-grid">${items.length?items.map(productCard).join(''):'<div class="empty">Nenhuma oferta dentro do prazo no momento.</div>'}</div>`;
}

function producersPage() {
  const items = state.stores.filter(store=>store.producer&&publicStoreVisible(store));
  return `${pageHead('Do produtor', 'Frutas, verduras e produtos feitos por quem vive e produz na região.')}${catalogOverview()}<div class="producer-grid">${items.map(producerCard).join('')}</div>`;
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
        ${new URLSearchParams(location.search).get('diagnostic')==='1'?`<div class="sabia-diagnostic">
          <strong>Diagnóstico temporário</strong>
          <small>Testa só um provedor usando a mensagem digitada no chat. Não usa os outros e não cai na Reserva.</small>
          <div class="row">
            ${['cloudflare','gemini','groq'].map(provider=>`<button class="ghost-btn strong" data-action="sabia-diagnostic" data-provider="${provider}" ${sabiaBusy||sabiaDiagnosticBusy?'disabled':''}>${sabiaDiagnosticBusy===provider?'Testando…':'Testar '+(provider==='cloudflare'?'Cloudflare':provider==='gemini'?'Gemini':'Groq')}</button>`).join('')}
          </div>
          ${sabiaDiagnostic?`<div class="sabia-diagnostic-result">
            <b>${esc(sabiaDiagnostic.provider||'provedor')} · ${sabiaDiagnostic.loading?'testando':sabiaDiagnostic.ok?'OK':'FALHOU'}</b>
            ${sabiaDiagnostic.model?`<small>Modelo: ${esc(sabiaDiagnostic.model)}</small>`:''}
            ${sabiaDiagnostic.elapsedMs!==undefined?`<small>Tempo: ${esc(sabiaDiagnostic.elapsedMs)} ms</small>`:''}
            ${!sabiaDiagnostic.loading?`<small>Stage: ${esc(sabiaDiagnostic.stage||'—')} · status: ${esc(sabiaDiagnostic.status??0)}</small>`:''}
            ${sabiaDiagnostic.detail?`<pre>${esc(sabiaDiagnostic.detail)}</pre>`:''}
            ${sabiaDiagnostic.raw?`<pre>${esc(sabiaDiagnostic.raw)}</pre>`:''}
            ${sabiaDiagnostic.validatedText?`<small><b>Validado pelo APETÊ:</b> ${esc(sabiaDiagnostic.validatedText)}</small>`:''}
          </div>`:''}
        </div>
        `:''}
        <p class="note">As mensagens são enviadas ao provedor de IA. Não informe senhas, documentos ou dados pessoais. A conversa desta sessão expira no servidor após seis horas.</p>
        <p class="note">A Sabiá consulta os produtos publicados pelas lojas. Alterações feitas somente no painel de demonstração deste navegador não são publicadas no catálogo.</p>
      </article>
      <article class="sabia-chat"><div class="sabia-head"><strong>Sabiá</strong><button class="ghost-btn strong" data-action="sabia-new" ${sabiaBusy?'disabled':''}>Nova conversa</button></div>
        <div id="chat-log" class="chat-log" role="log" aria-live="polite" aria-label="Conversa com a Sabiá">${renderSabiaHistory()}${sabiaBusy?'<div class="chat-bubble sabia-thinking" role="status">Sabiá está consultando e preparando sua resposta…</div>':''}</div>
        ${sabiaError?`<div class="sabia-error" role="alert"><p>${esc(sabiaError)}</p>${sabiaRetryAfter?`<small>Aguarde aproximadamente ${sabiaRetryAfter} segundo(s).</small>`:''}<button class="ghost-btn strong" data-action="sabia-retry" ${sabiaBusy?'disabled':''}>Tentar novamente</button></div>`:''}
        <form id="sabia-form" class="chat-send"><label class="sr-only" for="sabia-input">Sua mensagem para a Sabiá</label><input id="sabia-input" class="input" value="${esc(sabiaDraft)}" placeholder="Pergunte à Sabiá…" maxlength="1200" autocomplete="off" ${sabiaBusy?'disabled':''}><button class="primary-btn" type="submit" ${sabiaBusy?'disabled':''}>${sabiaBusy?'Aguarde…':'Enviar'}</button></form>
        <small class="sabia-attribution sabia-attribution-fixed">A Sabiá pode cometer erros. Confira informações importantes.</small>
        
      </article>
    </section>`;
}

function adminPage() {
  if(!isAdmin())return `${pageHead('Administração','Acesso restrito.')}<div class="empty"><b>Acesso não autorizado</b> Esta área é exclusiva para administradores do APETÊ.</div>`;
  const applications=[...(state.adminApplications||[])];
  const pending=applications.filter(item=>item.status==='pending');
  const reviewed=applications.filter(item=>item.status!=='pending').slice(0,20);
  const card=item=>`<article class="admin-application">
    <div class="admin-application-head"><div><span class="chip soft">${item.status==='pending'?'Aguardando análise':item.status==='approved'?'Aprovado':'Rejeitado'}</span><h3>${esc(item.store_name)}</h3><p>${esc(item.city)} · enviada em ${dateTime(item.created_at)}</p></div></div>
    <div class="order-detail-grid">
      <div class="order-detail"><b>Telefone</b><span>${esc(item.phone)}</span></div>
      <div class="order-detail"><b>Documento informado</b><span>${esc(item.document)}</span></div>
      <div class="order-detail"><b>Instagram</b><span>${esc(item.instagram)}</span></div>
      <div class="order-detail"><b>ID da conta</b><span class="admin-id">${esc(item.user_id)}</span></div>
    </div>
    ${item.status==='pending'? `<div class="row" style="margin-top:14px"><button class="primary-btn" data-action="admin-review-merchant" data-id="${item.id}" data-decision="approve">Aprovar e criar loja</button><button class="ghost-btn strong" data-action="admin-review-merchant" data-id="${item.id}" data-decision="reject">Rejeitar</button></div>` : ''}
  </article>`;
  return `${pageHead('Administração','Revise solicitações antes de liberar uma loja real no APETÊ.')}
    <section class="admin-summary"><article><strong>${pending.length}</strong><span>Aguardando análise</span></article><article><strong>${applications.filter(item=>item.status==='approved').length}</strong><span>Aprovadas</span></article><article><strong>${applications.filter(item=>item.status==='rejected').length}</strong><span>Rejeitadas</span></article></section>
    <div class="merchant-section-heading"><div><span class="merchant-eyebrow">Comerciantes</span><h3>Solicitações pendentes</h3><p>Aprovar cria a loja, vincula o solicitante como proprietário e libera o painel real.</p></div></div>
    <section class="admin-applications">${pending.length?pending.map(card).join(''):'<div class="empty"><b>Nenhuma solicitação pendente</b> Novos cadastros aparecerão aqui.</div>'}</section>
    ${reviewed.length?`<div class="merchant-section-heading below"><h3>Revisadas recentemente</h3></div><section class="admin-applications">${reviewed.map(card).join('')}</section>`:''}`;
}

function legalPage(kind) {
  const pages={
    termos:{
      title:'Termos de Uso',
      intro:'Regras gerais para usar o APETÊ como cliente.',
      sections:[
        ['1. Uso da plataforma','O APETÊ conecta clientes a estabelecimentos e produtores cadastrados. O usuário deve fornecer informações verdadeiras, manter sua conta segura e usar a plataforma de forma lícita.'],
        ['2. Pedidos e preços','Preços, disponibilidade, estoque, taxa de entrega e total são confirmados pelo sistema no momento do pedido. O estabelecimento é responsável pelas informações comerciais e pelo preparo ou fornecimento do produto que oferece.'],
        ['3. Conta e segurança','A conta é pessoal. O APETÊ pode limitar ou suspender acessos em caso de fraude, abuso, tentativa de burlar pagamentos, invasão de contas ou uso indevido da plataforma.'],
        ['4. Atendimento e direitos do consumidor','Nada nestes Termos elimina direitos obrigatórios previstos na legislação brasileira. Dúvidas sobre pedido, cancelamento ou reembolso devem ser tratadas pelos canais disponibilizados na plataforma.'],
        ['5. Alterações','Quando houver mudança relevante nestes Termos, uma nova versão poderá exigir novo aceite antes de continuar usando funções que dependam da conta.']
      ]
    },
    privacidade:{
      title:'Política de Privacidade',
      intro:'Como o APETÊ trata dados pessoais.',
      sections:[
        ['Dados tratados','Podemos tratar nome, e-mail, telefone, endereço de entrega, cidade, dados da conta, pedidos e informações necessárias para operar o serviço. Comerciantes também podem fornecer dados de contato e comprovação do estabelecimento.'],
        ['Finalidades','Os dados são usados para autenticação, processamento e acompanhamento de pedidos, comunicação, prevenção de fraude, segurança, atendimento, gestão de comerciantes e cumprimento de obrigações aplicáveis.'],
        ['Compartilhamento','Dados de um pedido podem ser disponibilizados ao estabelecimento e, quando necessário, ao responsável pela entrega. O APETÊ não deve vender dados pessoais para publicidade.'],
        ['Retenção e segurança','Os dados devem ser mantidos apenas pelo período necessário às finalidades do serviço, segurança e obrigações aplicáveis, com controles de acesso e proteção compatíveis com o risco.'],
        ['Direitos do titular','O usuário pode solicitar informações e exercer os direitos previstos na legislação de proteção de dados pelos canais oficiais do APETÊ.']
      ]
    },
    cookies:{
      title:'Cookies e armazenamento local',
      intro:'O que o site salva no navegador hoje.',
      sections:[
        ['Sem rastreamento publicitário nesta versão','O APETÊ não usa, nesta versão, cookies de publicidade, Pixel da Meta ou Google Analytics.'],
        ['Armazenamento necessário','O site usa armazenamento local e de sessão do navegador para manter sessão autenticada, sacola, preferências da interface e dados temporários da Sabiá. Esses recursos são necessários para o funcionamento atual do aplicativo.'],
        ['Se isso mudar','Se forem adicionadas ferramentas opcionais de analytics, publicidade ou rastreamento que dependam de escolha do usuário, o APETÊ deverá apresentar controles adequados antes de ativá-las.']
      ]
    },
    cancelamentos:{
      title:'Cancelamentos e reembolsos',
      intro:'Regras operacionais para problemas com pedidos.',
      sections:[
        ['Antes do preparo','Quando o pedido ainda não tiver avançado no preparo, o cancelamento poderá ser solicitado pelos canais disponibilizados.'],
        ['Depois do preparo ou entrega','A análise depende do motivo, do estágio do pedido e dos direitos aplicáveis ao consumidor. Produto incorreto, indisponível, não entregue ou com problema deve ser tratado com prioridade.'],
        ['Pagamento','Quando houver pagamento online real, o estorno deve seguir o meio de pagamento e o provedor utilizado. A seleção visual de Pix ou cartão na demonstração não representa pagamento confirmado.'],
        ['Registro','Pedidos, status, cancelamentos e valores devem permanecer registrados para permitir atendimento e auditoria do caso.']
      ]
    },
    merchant:{
      title:'Regras do comerciante',
      intro:'Condições para vender pelo APETÊ.',
      sections:[
        ['Cadastro e aprovação','Qualquer interessado pode enviar uma solicitação, mas a loja só recebe acesso real após análise e aprovação do APETÊ. Enviar cadastro não garante aprovação.'],
        ['Informações verdadeiras','O responsável deve fornecer dados verdadeiros do estabelecimento e manter nome, contato, preços, estoque, disponibilidade e demais informações comerciais atualizados.'],
        ['Produtos e alimentos','O comerciante é responsável pela qualidade, origem, conservação, preparo, descrição e entrega dos produtos que oferece, além de cumprir as exigências sanitárias e comerciais aplicáveis à sua atividade.'],
        ['Pedidos','Pedidos aceitos devem ser tratados de forma diligente. O comerciante só pode acessar dados de pedidos vinculados à própria loja e deve usar esses dados apenas para execução e atendimento do pedido.'],
        ['Suspensão','O APETÊ pode suspender ou remover estabelecimentos em caso de fraude, informações falsas, descumprimento reiterado, risco ao consumidor ou uso indevido da plataforma.'],
        ['Dados pessoais','Dados de clientes não podem ser reutilizados para finalidades incompatíveis com o pedido ou compartilhados indevidamente.']
      ]
    }
  };
  const page=pages[kind]||pages.termos;
  return `${pageHead(page.title,page.intro)}
    <section class="legal-page">
      <div class="legal-version">Versão 2026-09-28-v1 · conteúdo operacional sujeito a revisão antes de produção pública.</div>
      ${page.sections.map(([title,text])=>`<article class="legal-section"><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}
      <p class="legal-review-note">Este texto organiza as regras do produto e não substitui revisão jurídica profissional para lançamento comercial.</p>
    </section>`;
}

function customerAuthPage(mode = 'entrar') {
  if (isRealCustomerLogged()) return `${pageHead('Você já entrou', 'Sua conta está pronta para acompanhar pedidos e finalizar compras.')}<section class="auth-form-card"><h3>Olá, ${esc(state.customer.name.split(' ')[0])}</h3><p>Você pode continuar navegando no APETÊ.</p><button class="primary-btn" data-action="go-page" data-page="cliente">Abrir minha conta</button><button class="ghost-btn strong" data-action="logout-customer">Sair desta conta</button></section>`;
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
        </div>
        <label class="check-line legal-check"><input id="customer-accept-terms" type="checkbox"> <span>Li e aceito os <a href="index.html#termos" target="_blank" rel="noopener">Termos de Uso</a>. <span class="required-mark">*</span></span></label>
        <label class="check-line legal-check"><input id="customer-accept-privacy" type="checkbox"> <span>Li a <a href="index.html#privacidade" target="_blank" rel="noopener">Política de Privacidade</a>. <span class="required-mark">*</span></span></label>
        <button class="primary-btn auth-submit" data-action="save-customer">Criar conta</button>` : `<div class="field-grid">
        <div class="field"><label for="login-identifier">E-mail <span class="required-mark" aria-label="obrigatório">*</span></label><input id="login-identifier" class="input" type="email" autocomplete="username" placeholder="voce@email.com" value="" required><small class="field-hint">Use o e-mail informado no cadastro.</small></div>
        <div class="field"><label for="login-password">Senha <span class="required-mark" aria-label="obrigatório">*</span></label><input id="login-password" class="input" type="password" autocomplete="current-password" placeholder="Sua senha"></div>
        </div><button class="primary-btn auth-submit" data-action="login-customer">Entrar</button>`}
      <div class="auth-links">
        <p>${cadastro ? 'Já tem conta?' : 'Ainda não tem conta?'} <a href="${cadastro ? 'index.html#entrar' : 'index.html#cadastro'}" data-action="go-page" data-page="${cadastro ? 'entrar' : 'cadastro'}">${cadastro ? 'Fazer login' : 'Criar conta'}</a></p>
        <a href="index.html#comerciante-entrar" data-action="go-page" data-page="comerciante-entrar">Área do comerciante ↗</a>
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
        <div class="field"><label>Telefone <span class="required-mark">*</span></label><input id="merchant-register-phone" class="input phone-only" inputmode="numeric" maxlength="11" placeholder="DDD + número, sem símbolos"></div><div class="field"><label>E-mail do responsável <span class="required-mark">*</span></label><input id="merchant-register-email" class="input" type="email" autocomplete="email" placeholder="contato@loja.com"></div>
        <div class="field"><label>Cidade</label><input id="merchant-register-city" class="input" placeholder="Sua cidade"></div>
        <div class="field"><label>Senha do painel <span class="required-mark">*</span></label><input id="merchant-register-password" class="input" type="password" autocomplete="new-password" placeholder="8 caracteres, letras e números"></div>
        <div class="field"><label>Confirmar senha <span class="required-mark">*</span></label><input id="merchant-register-password-confirm" class="input" type="password" autocomplete="new-password" placeholder="Repita a senha"><small id="merchant-password-feedback" class="field-hint" aria-live="polite"></small></div>
        <div class="field"><label>Documento do empreendimento <span class="required-mark">*</span></label><input id="merchant-register-document" class="input" placeholder="CNPJ ou documento comercial"></div>
        <div class="field"><label>Instagram da loja <span class="required-mark">*</span></label><input id="merchant-register-proof" class="input" placeholder="@sualoja"></div>
      </div>
      <label class="check-line"><input id="merchant-register-confirm" type="checkbox"> <span>Confirmo que represento o empreendimento informado. <span class="required-mark">*</span></span></label>
      <label class="check-line legal-check"><input id="merchant-accept-terms" type="checkbox"> <span>Aceito os <a href="index.html#termos" target="_blank" rel="noopener">Termos de Uso</a>. <span class="required-mark">*</span></span></label>
      <label class="check-line legal-check"><input id="merchant-accept-privacy" type="checkbox"> <span>Li a <a href="index.html#privacidade" target="_blank" rel="noopener">Política de Privacidade</a>. <span class="required-mark">*</span></span></label>
      <label class="check-line legal-check"><input id="merchant-accept-rules" type="checkbox"> <span>Aceito as <a href="index.html#regras-comerciante" target="_blank" rel="noopener">Regras do Comerciante</a>. <span class="required-mark">*</span></span></label>
      <button class="primary-btn auth-submit" data-action="register-merchant">Enviar cadastro</button>` : `<div class="field-grid">
        <div class="field"><label>Responsável <span class="required-mark">*</span></label><input id="merchant-owner" class="input" placeholder="Seu nome"></div>
        <div class="field"><label>Telefone ou e-mail <span class="required-mark">*</span></label><input id="merchant-identifier" class="input" autocomplete="username" placeholder="DDD + número ou contato@loja.com"><small class="field-hint">Nos perfis de apresentação, entre com um telefone de teste e a senha indicada abaixo.</small></div>
        <div class="field"><label>Estabelecimento <span class="required-mark">*</span></label><select id="merchant-store" class="select">${state.stores.map(store=>`<option value="${store.id}">${esc(store.name)}</option>`).join('')}</select></div>
        <div class="field"><label>Senha do painel <span class="required-mark">*</span></label><input id="merchant-password" class="input" type="password" autocomplete="current-password" placeholder="Senha do estabelecimento"></div>
      </div><div class="demo-access"><strong>Acesso para a apresentação</strong><span>Escolha um estabelecimento, informe um telefone de teste e utilize a senha <b>1234</b> para abrir o painel.</span></div><button class="primary-btn auth-submit" data-action="login-merchant">Entrar no painel</button>`}
      <div class="auth-links"><p>${cadastro ? 'Já cadastrou seu estabelecimento?' : 'Quer cadastrar outro estabelecimento?'} <a href="${cadastro ? 'index.html#comerciante-entrar' : 'index.html#comerciante-cadastro'}" data-action="go-page" data-page="${cadastro ? 'comerciante-entrar' : 'comerciante-cadastro'}">${cadastro ? 'Entrar no painel' : 'Cadastrar loja'}</a></p><a href="index.html#entrar" data-action="go-page" data-page="entrar">Área do cliente ↗</a></div>
    </section>`;
}

function accountPage() {
  if (!isRealCustomerLogged()) return customerAuthPage('entrar');
  const customer = state.customer;
  if (isRealCustomerLogged()) {
    return `${pageHead('Minha conta', 'Área do cliente separada do painel do comerciante.')}
      <section class="account-layout single-col">
        <article class="account-box accent-box"><div class="account-body"><span class="chip soft">Conta do cliente</span><h3>Olá, ${esc(customer.name.split(' ')[0])}</h3><p>Quando você estiver logado, a compra pode ser finalizada com endereço, forma de pagamento e observações do pedido.</p><ul class="kv"><li><strong>Nome</strong><span>${esc(customer.name)}</span></li><li><strong>E-mail</strong><span>${esc(customer.email || 'Ainda não informado')}</span></li><li><strong>Telefone</strong><span>${esc(customer.phone)}</span></li><li><strong>Endereço</strong><span>${esc(customer.address || 'Ainda não informado')}</span></li><li><strong>Status</strong><span>Conta pronta para comprar</span></li></ul><div class="row" style="margin-top:14px"><button class="ghost-btn strong" data-action="go-page" data-page="pedidos">Meus pedidos</button><button class="primary-btn" data-action="go-page" data-page="cardapio">Ir ao cardápio</button>${isAdmin()?'<button class="ghost-btn strong" data-action="go-page" data-page="admin">Administração</button>':''}<button class="ghost-btn strong" data-action="logout-customer">Sair</button></div></div></article>
      </section>`;
  }
  const activeTab = state.ui.accountTab;
  return `${pageHead('Área do cliente', 'Entre ou crie sua conta para comprar, acompanhar pedidos e finalizar com seus dados salvos.')}
    <section class="account-layout single-col">
      <article class="account-box"><div class="account-body"><div class="tabs"><button class="tab-btn ${activeTab === 'entrar' ? 'active' : ''}" data-action="switch-account-tab" data-tab="entrar">Entrar</button><button class="tab-btn ${activeTab === 'cadastro' ? 'active' : ''}" data-action="switch-account-tab" data-tab="cadastro">Cadastrar</button></div>${activeTab === 'entrar' ? `<div class="field-grid"><div class="field"><label>Telefone</label><input id="login-phone" class="input phone-only" inputmode="numeric" placeholder="(88) 99999-9999" value="${esc(customer.phone)}"></div><div class="field"><label>Senha</label><input id="login-password" class="input" type="password" placeholder="Sua senha"></div></div><div class="row" style="margin-top:14px"><button class="primary-btn" data-action="login-customer">Entrar</button></div>` : `<div class="field-grid"><div class="field"><label>Nome</label><input id="customer-name-field" class="input name-only" placeholder="Seu nome completo" value="${esc(customer.name)}"></div><div class="field"><label>E-mail</label><input id="customer-email-field" class="input" type="email" placeholder="voce@email.com" value="${esc(customer.email)}"></div><div class="field"><label>Telefone</label><input id="customer-phone-field" class="input phone-only" inputmode="numeric" placeholder="(88) 99999-9999" value="${esc(customer.phone)}"></div><div class="field"><label>Bairro</label><input id="customer-neighborhood-field" class="input" placeholder="Seu bairro" value="${esc(customer.neighborhood)}"></div><div class="field"><label>Senha</label><input id="customer-password-field" class="input" type="password" placeholder="Mínimo 8 caracteres, com letras e números"></div><div class="field"><label>Confirmar senha <span class="required-mark">*</span></label><input id="customer-password-confirm" class="input" type="password" placeholder="Repita a senha"></div></div><div class="field" style="margin-top:12px"><label>Endereço</label><input id="customer-address-field" class="input" placeholder="Rua, número e referência" value="${esc(customer.address)}"></div><div class="row" style="margin-top:14px"><button class="primary-btn" data-action="save-customer">Salvar cadastro</button></div>`}</div></article>
    </section>`;
}

function loginPage() { return customerAuthPage('entrar'); }

function ordersPage() {
  if (!isRealCustomerLogged()) return `${pageHead('Meus pedidos', 'Faça login para acompanhar seus pedidos e conferir o andamento das compras realizadas.')}<div class="empty"><b>Entre na sua conta</b> Você precisa fazer login para ver seus pedidos. <div class="row" style="justify-content:center;margin-top:16px"><button class="primary-btn" data-action="go-page" data-page="cliente">Ir para minha conta</button></div></div>`;
  const orders = (window.APETE_BACKEND?.hasStoredSession?.()?state.orders:state.orders.filter((order) => order.customer.phone === state.customer.phone)).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  const inProgress = orders.filter((order) => ['pendente','preparando','pronto'].includes(order.status)).length;
  const concluded = orders.filter((order) => order.status === 'concluido').length;
  const totalSpent = orders.filter((order) => order.status !== 'cancelado').reduce((sum, order) => sum + order.total, 0);
  return `${pageHead('Meus pedidos', 'Seu espaço como cliente: pedidos ativos, pedidos concluídos e todos os dados do que foi comprado.')}${state.ui.orderSuccessId ? `<div class="order-success-banner" role="status"><span class="success-check" aria-hidden="true">✓</span><div><strong>Pedido enviado!</strong><p>Pedido #${String(state.ui.orderSuccessId).padStart(3,'0')} registrado. Você pode acompanhar o andamento nesta página.</p></div><button class="success-dismiss" data-action="dismiss-order-success" aria-label="Fechar confirmação">×</button></div>` : ''}${orderSyncMarkup('customer')}<section class="history-stats"><article class="history-stat"><strong>${orders.length}</strong><span>Pedidos no total</span></article><article class="history-stat"><strong>${inProgress}</strong><span>Em andamento</span></article><article class="history-stat"><strong>${concluded}</strong><span>Concluídos</span></article><article class="history-stat"><strong>${money(totalSpent)}</strong><span>Valor acumulado</span></article></section>${orders.length ? orders.map((order) => orderCard(order, false)).join('') : `<div class="empty"><b>Nenhum pedido ainda</b> Quando você finalizar uma compra, ela vai aparecer aqui.</div>`}`;
}

function merchantProductForm(product = null) {
  const store = activeMerchantStore();
  const title = product ? 'Editar produto' : 'Adicionar produto';
  const categories = store.producer ? ['Do produtor','Frutas','Verduras','Artesanal','Orgânicos'] : ['Regional','Caseiro','Padaria','Doces','Bebidas','Vegetariano','Acompanhamentos'];
  const chosen = product?.cat || (store.producer ? 'Do produtor' : 'Regional');
  return `<section class="merchant-editor" id="merchant-product-editor"><div class="merchant-section-heading"><div><span class="merchant-eyebrow">Cardápio · ${esc(store.name)}</span><h3>${title}</h3><p>Preencha os campos e escolha uma foto do produto. A imagem acompanha o produto; em conta real, a alteração é salva no backend.</p></div></div>
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
      <div class="field" id="mp-offer-price-field" ${product?.lastBatch?'':'hidden'}><label for="mp-offer-price">Preço especial (R$) *</label><input class="input" id="mp-offer-price" inputmode="decimal" placeholder="Ex.: 14,90" value="${product?.lastBatch?((product.discountPrice??product.price)/100).toFixed(2).replace('.',','):''}"><small class="merchant-helper">O desconto aparece apenas durante o prazo cadastrado.</small>${offerDateFields('mp',product)}</div>
      <div class="merchant-form-actions"><button class="primary-btn" type="submit">${product?'Salvar alterações':'Publicar produto'}</button>${product?'<button class="ghost-btn strong" type="button" data-action="cancel-product-edit">Cancelar edição</button>':''}</div>
    </form></section>`;
}
function merchantProductsView(products) {
  const editing = state.ui.productEditor && products.find(p=>p.id===Number(state.ui.productEditor));
  return `<div class="merchant-section-heading"><div><span class="merchant-eyebrow">Gestão de produtos</span><h3>Seu cardápio</h3><p>Adicione um item ou edite preços, fotos e disponibilidade. Em conta real, as alterações são persistidas no backend.</p></div><button class="ghost-btn strong" data-action="new-product">+ Novo produto</button></div>
    ${merchantProductForm(editing || null)}<div class="merchant-section-heading below"><h3>Produtos publicados</h3><span>${products.length} itens</span></div><div class="product-grid">${products.map(productCard).join('')}</div>`;
}
function merchantOffersView(products) {
  const offers = products.filter(p=>p.lastBatch);
  return `<div class="merchant-section-heading"><div><span class="merchant-eyebrow">Ofertas do dia</span><h3>Última Fornada</h3><p>Coloque produtos do seu cardápio em oferta. O cliente vê o desconto na Última Fornada durante o prazo cadastrado.</p></div></div>
    <section class="merchant-editor"><h3>Criar oferta</h3><form id="merchant-offer-form" class="merchant-edit-form"><div class="field-grid"><div class="field"><label for="mo-product">Produto do seu cardápio *</label><select id="mo-product" class="select" required><option value="">Selecione o produto</option>${products.filter(p=>!p.lastBatch).map(p=>`<option value="${p.id}">${esc(p.name)} · ${money(p.price)}</option>`).join('')}</select></div><div class="field"><label for="mo-price">Novo preço promocional (R$) *</label><input id="mo-price" class="input" inputmode="decimal" placeholder="Ex.: 12,90" required></div></div>${offerDateFields('mo')}<div class="merchant-form-actions"><button class="primary-btn" type="submit" ${products.every(p=>p.lastBatch)?'disabled':''}>Publicar na Última Fornada</button><button type="button" class="ghost-btn strong" data-action="merchant-panel-tab" data-tab="produtos">+ Novo produto</button></div></form></section>
    <div class="merchant-section-heading below"><h3>Ofertas cadastradas</h3><span>${offers.length} ${offers.length===1?'item':'itens'}</span></div>
    ${offers.length?`<div class="merchant-offers-list">${offers.map(p=>`<article class="merchant-offer-item"><div class="merchant-offer-image">${imgTag(p.image,p.name)}</div><div><strong>${esc(p.name)}</strong><p><del>${money(p.oldPrice)}</del> <b>${money(p.discountPrice??p.price)}</b></p><p>${globalThis.APETE_OFFERS.isActive(p)?'Dentro do prazo':'Fora do prazo ou sem datas'}${p.offer?.endsAt?' · Até '+esc(new Date(p.offer.endsAt).toLocaleString('pt-BR')):''}</p></div><button class="ghost-btn strong" data-action="end-offer" data-id="${p.id}">Encerrar oferta</button></article>`).join('')}</div>`:'<div class="empty">Nenhuma oferta ativa. Selecione um produto do cardápio acima.</div>'}`;
}
function offerDateFields(prefix,product=null) {
 const local=value=>{if(!value)return '';const d=new Date(value);if(!Number.isFinite(d.getTime()))return '';return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);};
 return `<div class="field-grid"><div class="field"><label for="${prefix}-offer-start">Início da oferta *</label><input class="input" id="${prefix}-offer-start" type="datetime-local" value="${local(product?.offer?.startsAt||new Date().toISOString())}"></div><div class="field"><label for="${prefix}-offer-end">Fim da oferta *</label><input class="input" id="${prefix}-offer-end" type="datetime-local" value="${local(product?.offer?.endsAt)}"></div></div><small class="merchant-helper">Horários no fuso deste aparelho. Informe quando o desconto começa e termina; confirme também as condições de consumo.</small>`;
}
function readOfferDates(prefix) {
 const start=Date.parse($('#'+prefix+'-offer-start')?.value),end=Date.parse($('#'+prefix+'-offer-end')?.value);
 if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start||end<=Date.now())return null;
 return {startsAt:new Date(start).toISOString(),endsAt:new Date(end).toISOString()};
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
  if(!merchantAccess())return;
  const store=activeMerchantStore();
  const existing=state.products.find(p=>p.id===Number(state.ui.productEditor)&&p.storeId===store.id);
  const name=$('#mp-name')?.value.trim(),desc=$('#mp-desc')?.value.trim();
  const basePrice=parsePrice($('#mp-price')?.value),stock=Number($('#mp-stock')?.value);
  const discounted=$('#mp-offer')?.checked,offerPrice=discounted?parsePrice($('#mp-offer-price')?.value):null;
  const offer=discounted?readOfferDates('mp'):null;
  if(discounted&&!offer)return toast('Informe início e fim da oferta, com término no futuro.');
  const file=$('#mp-photo')?.files?.[0];
  if(!name||!desc||!basePrice||!Number.isInteger(stock)||stock<0||stock>9999)return toast('Preencha nome, descrição, preço e estoque válidos.');
  if(discounted&&(!offerPrice||offerPrice>=basePrice))return toast('O preço da oferta precisa ser menor que o preço normal.');
  if(!file&&!existing)return toast('Escolha uma foto para o novo produto.');
  let photo=existing?.image||'';
  if(file){try{photo=await optimizeProductPhoto(file);}catch(error){return toast(error.message||'Não foi possível ler a foto.');}}
  const next={
    id:existing?.id||Math.max(...state.products.map(p=>p.id),0)+1,
    backendId:existing?.backendId,
    storeId:store.id,name,desc,cat:$('#mp-category').value,
    price:discounted?offerPrice:basePrice,stock,image:photo,
    oldPrice:discounted?basePrice:0,lastBatch:Boolean(discounted),offer,
    preferences:existing?.preferences||[],serves:existing?.serves??null,available:true
  };
  if(state.merchant?.backend){
    if(!store.backendId)return toast('Loja real ainda não sincronizada com o backend.');
    try{
      await window.APETE_BACKEND.saveMerchantProduct(store.backendId,next);
      state.ui.productEditor=0;
      await hydrateCatalogFromBackend();
      render();
      toast(existing?'Produto atualizado no banco.':'Produto publicado no banco.','success');
    }catch(error){toast(friendlyBackendError(error,'Não foi possível salvar o produto no banco.'));}
    return;
  }
  if(existing)Object.assign(existing,next);else state.products.push(next);
  state.ui.productEditor=0;
  try{save();}catch{return toast('Espaço do navegador insuficiente para salvar a foto. Tente uma imagem menor.');}
  render();toast(existing?'Produto atualizado no cardápio.':'Produto publicado no cardápio.','success');
}

async function publishMerchantOffer() {
  if(!merchantAccess())return;
  const product=state.products.find(p=>p.id===Number($('#mo-product')?.value)&&p.storeId===activeMerchantStore().id);
  const newPrice=parsePrice($('#mo-price')?.value);
  const offer=readOfferDates('mo');
  if(!offer)return toast('Informe início e fim da oferta, com término no futuro.');
  if(!product||product.lastBatch||!newPrice||newPrice>=product.price)return toast('Escolha um produto e um preço menor que o valor atual.');
  if(state.merchant?.backend){
    if(!product.backendId)return toast('Produto ainda não sincronizado com o backend.');
    try{
      await window.APETE_BACKEND.updateMerchantProduct(product.backendId,{oldPrice:product.price,price:newPrice,lastBatch:true,offerStartsAt:offer.startsAt,offerEndsAt:offer.endsAt});
      await hydrateCatalogFromBackend();render();toast('Oferta publicada no banco.','success');
    }catch(error){toast(friendlyBackendError(error,'Não foi possível publicar a oferta.'));}
    return;
  }
  product.oldPrice=product.price;product.price=newPrice;product.lastBatch=true;product.offer=offer;delete product.discountPrice;
  save();render();toast('Oferta publicada na Última Fornada.','success');
}

async function endMerchantOffer(id) {
  if(!merchantAccess())return;
  const product=state.products.find(p=>p.id===Number(id)&&p.storeId===activeMerchantStore().id&&p.lastBatch);
  if(!product)return;
  const normalPrice=product.oldPrice||product.price;
  if(state.merchant?.backend){
    if(!product.backendId)return toast('Produto ainda não sincronizado com o backend.');
    try{
      await window.APETE_BACKEND.updateMerchantProduct(product.backendId,{price:normalPrice,oldPrice:0,lastBatch:false,offerStartsAt:null,offerEndsAt:null});
      await hydrateCatalogFromBackend();render();toast('Oferta encerrada no banco.','success');
    }catch(error){toast(friendlyBackendError(error,'Não foi possível encerrar a oferta.'));}
    return;
  }
  product.price=normalPrice;product.oldPrice=0;product.lastBatch=false;product.offer=null;delete product.discountPrice;
  save();render();toast('Oferta encerrada. Preço normal restaurado.','success');
}
function merchantPage() {
  if (!merchantAccess()) return merchantAuthPage('entrar');
  const store=activeMerchantStore();
  const tab=state.ui.merchantPanelTab;
  const allOrders=(state.merchant?.backend
    ? [...state.merchantOrders]
    : [...state.orders.filter(o=>o.storeId===store.id),...state.demoOrders.filter(o=>o.storeId===store.id)])
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
  if(tab==='cadastro')body=`<section class="merchant-editor"><div class="merchant-section-heading"><div><span class="merchant-eyebrow">Configurações do perfil</span><h3>Dados de ${esc(store.name)}</h3><p>Personalize as informações exibidas na vitrine do estabelecimento.</p></div></div><form id="merchant-profile-form" class="merchant-edit-form"><div class="field-grid"><div class="field"><label>Nome da loja *</label><input id="merchant-edit-name" class="input" required value="${esc(store.name)}"></div><div class="field"><label>Categoria</label><input id="merchant-edit-category" class="input" value="${esc(storeCategoryLabel(store))}"></div><div class="field"><label>Cidade</label><input id="merchant-edit-city" class="input" value="${esc(store.city)}"></div><div class="field auth-wide"><label>Endereço / ponto de retirada</label><input id="merchant-edit-address" class="input" value="${esc(store.address||'')}" placeholder="Rua, bairro ou localidade"></div><div class="field"><label>Telefone</label><input id="merchant-edit-phone" class="input" value="${esc(state.merchant.phone)}"></div><div class="field"><label>Instagram da loja *</label><input id="merchant-edit-instagram" class="input" value="${esc(store.instagram||store.officialRef||'')}" placeholder="@sualoja"></div></div><div class="field"><label>Descrição</label><textarea id="merchant-edit-desc" class="textarea">${esc(storeDescription(store))}</textarea></div><div class="merchant-form-actions"><button class="primary-btn" type="submit">Salvar perfil</button><button class="ghost-btn strong" type="button" data-action="logout-merchant">Sair da loja</button></div></form></section>`;
  const stageList=[['pendentes','Recebidos',pending.length],['preparando','Em preparo',preparing.length],['prontos','Prontos',ready.length],['concluidos','Finalizados',concluded.length]];
  return `${state.ui.presentationMerchant?'<div class="merchant-demo-notice">Visão de apresentação · Os pedidos e produtos são salvos apenas neste navegador.</div>':''}
   <section class="merchant-cover-card ${store.producer?'producer-cover-theme':''}"><div class="merchant-cover-picture">${imgTag(store.cover,store.name,store.producer?'producer':'store')}</div><div class="merchant-cover-copy"><span class="merchant-eyebrow">PAINEL DO ${store.producer?'PRODUTOR':'COMERCIANTE'}</span><h2>${esc(store.name)}</h2><p>${esc(storeCategoryLabel(store))} · ${esc(store.city)}</p><div class="merchant-cover-actions"><button class="merchant-cover-action" data-action="merchant-panel-tab" data-tab="pendentes">Ver pedidos <span>${pending.length}</span></button><button class="merchant-cover-action" data-action="merchant-panel-tab" data-tab="produtos">+ Produto</button><button class="merchant-cover-action" data-action="merchant-panel-tab" data-tab="fornada">Última Fornada <span>${offerCount}</span></button></div></div></section>
   ${state.ui.presentationMerchant?`<div class="merchant-store-select"><label for="demo-merchant-store">Trocar estabelecimento de demonstração</label><select id="demo-merchant-store" class="select">${state.stores.map(s=>`<option value="${s.id}" ${s.id===store.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></div>`:''}
   ${state.merchant?.backend?orderSyncMarkup('merchant'):''}<div class="merchant-workflow" aria-label="Etapas do pedido">${stageList.map(([key,label,count])=>`<button class="merchant-stage ${tab===key?'selected':''}" data-action="merchant-panel-tab" data-tab="${key}" aria-pressed="${tab===key}" aria-label="${label}: ${count} ${count===1?'pedido':'pedidos'}"><span class="stage-label">${label}</span>${tab===key?`<span class="stage-count">${count} ${count===1?'pedido':'pedidos'}</span>`:''}</button>`).join('')}</div>
   <div class="merchant-tabs" role="group" aria-label="Áreas do painel"><button class="merchant-tab ${['pendentes','preparando','prontos','concluidos'].includes(tab)?'selected':''}" data-action="merchant-panel-tab" data-tab="pendentes">Pedidos</button><button class="merchant-tab ${tab==='produtos'?'selected':''}" data-action="merchant-panel-tab" data-tab="produtos">Cardápio</button><button class="merchant-tab ${tab==='fornada'?'selected':''}" data-action="merchant-panel-tab" data-tab="fornada">Última Fornada</button><button class="merchant-tab ${tab==='cadastro'?'selected':''}" data-action="merchant-panel-tab" data-tab="cadastro">Meu perfil</button></div>
   <div class="merchant-main-body">${body}</div>`;
}

function storeDetailPage() {
  const store = getStore(state.storeViewId);
  if(!store)return `${pageHead('Estabelecimento indisponível','Esse perfil não está mais disponível.')}<div class="empty"><b>Não encontramos essa loja</b> Volte para a lista de estabelecimentos.<div class="row" style="justify-content:center;margin-top:14px"><button class="primary-btn" data-action="go-page" data-page="estabelecimentos">Ver estabelecimentos</button></div></div>`;
  const products = state.products.filter((product) => product.storeId === store.id);
  return `${pageHead(store.name, storeHeroText(store))}<section class="store-detail"><article class="detail-hero ${store.producer ? 'producer-tone' : 'merchant-tone'}"><div class="detail-cover">${imgTag(store.cover, store.name, store.producer ? 'producer' : 'store')}<div class="cover-overlay ${store.producer ? 'producer' : ''}"></div><div class="cover-copy"><span class="cover-kicker">${esc(storeCategoryLabel(store))}</span><h4>${esc(store.name)}</h4><div class="cover-meta"><span>${esc(store.city)}</span>${storeRating(store)?`<span>★ ${storeRating(store).toFixed(1)}</span>`:'<span>Novo no APETÊ</span>'}<span>${esc(storeEta(store))}</span></div></div></div><div class="detail-info"><div class="chip-row"><span class="chip ${store.producer ? 'producer-alt' : 'orange'}">Entrega ${money(store.fee)}</span>${instagramBadge(store)}</div><p>${esc(storeDescription(store))}</p><p class="store-address"><strong>Local:</strong> ${esc(store.address||store.city)} · ${esc(store.city)}</p><div class="row detail-actions" style="margin-top:18px"><button class="primary-btn" data-action="filter-store" data-id="${store.id}">Ver tudo no catálogo</button><button class="ghost-btn strong" data-action="go-page" data-page="estabelecimentos">Voltar</button></div></div></article><div class="product-grid">${products.map(productCard).join('')}</div></section>`;
}

// Patch the existing Sabiá nodes so status updates never replace the active input.
let renderedSabiaMessages=[];
function updateSabiaView(html){
 const template=document.createElement('template');template.innerHTML=html;
 const oldLog=$('#chat-log'),newLog=template.content.querySelector('#chat-log');
 const messages=sabiaChat.map(entry=>entry.role+'\0'+entry.content);
 const added=messages.length>renderedSabiaMessages.length&&renderedSabiaMessages.every((entry,i)=>entry===messages[i]);
 const previousScroll=oldLog.scrollTop;
 if(oldLog.innerHTML!==newLog.innerHTML)oldLog.innerHTML=newLog.innerHTML;
 oldLog.scrollTop=added?oldLog.scrollHeight:previousScroll;
 renderedSabiaMessages=messages;
 const input=$('#sabia-input');
 if(input.value!==sabiaDraft)input.value=sabiaDraft;
 input.disabled=sabiaBusy;
 const formButton=$('#sabia-form button');formButton.disabled=sabiaBusy;formButton.textContent=sabiaBusy?'Aguarde…':'Enviar';
 for(const selector of ['.sabia-mode','.sabia-error']){
  const current=document.querySelector(selector),next=template.content.querySelector(selector);
  if(current&&next){if(current.innerHTML!==next.innerHTML)current.innerHTML=next.innerHTML;}
  else if(current)current.remove();
  else if(next)$('#sabia-form').before(next);
 }
 const city=$('#sabia-city');city.value=state.city;city.disabled=sabiaBusy;
 document.querySelectorAll('.sabia-suggest button,[data-action="sabia-new"]').forEach(button=>{button.disabled=sabiaBusy;});
}

function renderUnsafe() {
  const content = $('#content');
  const page = state.page;
  $('#location-label').textContent = state.city || 'Guaraciaba do Norte';
  $('#customer-name').textContent = (isMerchantView() || isRealCustomerLogged()) ? 'Minha conta' : 'Entrar';
  $('#user-button').setAttribute('aria-label', (isMerchantView() || isRealCustomerLogged()) ? 'Minha conta' : 'Entrar');
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
  else if (page === 'entrar') html = isRealCustomerLogged() ? accountPage() : customerAuthPage('entrar');
  else if (page === 'cadastro') html = isRealCustomerLogged() ? accountPage() : customerAuthPage('cadastro');
  else if (page === 'comerciante-entrar') html = isMerchantLogged() ? merchantPage() : merchantAuthPage('entrar');
  else if (page === 'comerciante-cadastro') html = isMerchantLogged() ? merchantPage() : merchantAuthPage('cadastro');
  else if (page === 'cliente') html = accountPage();
  else if (page === 'comerciante') html = merchantPage();
  else if (page === 'loja') html = storeDetailPage();
  else if (page === 'termos') html = legalPage('termos');
  else if (page === 'privacidade') html = legalPage('privacidade');
  else if (page === 'cookies') html = legalPage('cookies');
  else if (page === 'cancelamentos') html = legalPage('cancelamentos');
  else if (page === 'regras-comerciante') html = legalPage('merchant');
  else if (page === 'admin') html = adminPage();
  else html = homePage();

  if(page==='sabia'&&$('#sabia-form'))updateSabiaView(html);
  else {content.innerHTML = html;if(page==='sabia')renderedSabiaMessages=sabiaChat.map(entry=>entry.role+'\0'+entry.content);}
  const visualPage = ((page === 'entrar' || page === 'cadastro') && isRealCustomerLogged()) ? 'cliente' : (((page === 'comerciante-entrar' || page === 'comerciante-cadastro') && isMerchantLogged()) ? 'comerciante' : page);
  $('#page-title').textContent = visualPage === 'loja' ? (getStore(state.storeViewId)?.name || 'Estabelecimentos') : (PAGE_TITLES[visualPage] || 'APETÊ');
  const enterLink = $('#customer-nav-link');
  if (enterLink) {
    const profileReady = isMerchantView();
    const logged = profileReady || isRealCustomerLogged();
    enterLink.dataset.page = profileReady ? 'comerciante' : (logged ? 'cliente' : 'entrar');
    enterLink.href = profileReady ? 'index.html#comerciante' : (logged ? 'index.html#cliente' : 'index.html#entrar');
    const label = enterLink.querySelector('.customer-nav-label');
    if (label) label.textContent = logged ? 'Minha conta' : 'Entrar';
    enterLink.setAttribute('aria-label', logged ? 'Minha conta' : 'Entrar');
  }
  $$('.side-nav a').forEach((link) => link.classList.toggle('active', link.dataset.page === visualPage));
}

function render() {
  try {
    return renderUnsafe();
  } catch(error) {
    console.error('apete_render_error',error);
    const content=$('#content');
    if(content){
      content.innerHTML=`${pageHead('Algo saiu do lugar','O APETÊ protegeu esta tela para você não ficar preso em uma página quebrada.')}<div class="empty"><b>Não foi possível abrir esta área</b> Volte ao início e tente novamente.<div class="row" style="justify-content:center;margin-top:16px"><button class="primary-btn" data-action="go-page" data-page="inicio">Voltar ao início</button></div></div>`;
    }
    $('#page-title') && ($('#page-title').textContent='APETÊ');
  }
}
function addToCart(productId) {
  const product = getProduct(productId);
  if (!product) return;
  if (product.stock <= 0) return toast('Produto indisponível no momento.');
  if(!storeServesSelectedCity(getStore(product.storeId)))return toast('Este estabelecimento não atende sua cidade de entrega. Escolha a cidade da loja para continuar.');
  const firstProduct = state.cart.length ? getProduct(state.cart[0].productId) : null;
  if (firstProduct && firstProduct.storeId !== product.storeId) {
    const firstStore=getStore(firstProduct.storeId);
    toast(`Sua sacola já tem produtos de ${firstStore?.name||'outro estabelecimento'}. Finalize esse pedido antes de comprar de outro perfil.`);
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
function openCartModal() {
  cartStep='cart';
  renderCartModal();
}
function goCheckout() {
  if (!isRealCustomerLogged()) {
    closeModal();
    state.ui.accountRole = 'cliente';
    state.ui.accountTab = 'entrar';
    save();
    setPage('entrar');
    toast('Faça login ou cadastro para concluir a compra');
    return;
  }
  cartStep = 'checkout';
  checkoutDraft = checkoutDraft || {
    name:state.customer.name||'',
    phone:onlyDigits(state.customer.phone||''),
    neighborhood:state.customer.neighborhood||'',
    address:state.customer.address||'',
    note:''
  };
  renderCartModal();
}

function renderCartModal() {
  const items = state.cart.map((item) => ({ ...item, product: getProduct(item.productId) })).filter((item) => item.product);
  if (!items.length) {
    openModal('Sua sacola', `<div class="empty"><b>Sua sacola está vazia</b> Adicione produtos para montar seu pedido.<div class="row" style="justify-content:center;margin-top:14px"><button class="primary-btn" data-action="go-catalog">Ver produtos</button></div></div>`);
    return;
  }
  const store = getStore(items[0].product.storeId);
  if(!store){
    state.cart=[];
    save();
    openModal('Sua sacola','<div class="empty"><b>Este estabelecimento não está mais disponível</b> Sua sacola foi limpa para evitar um pedido inconsistente.<div class="row" style="justify-content:center;margin-top:14px"><button class="primary-btn" data-action="go-catalog">Ver produtos disponíveis</button></div></div>');
    return;
  }
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const deliveryFee = Number(store.fee)||0;
  const total = subtotal + deliveryFee;

  if (cartStep === 'checkout') {
    checkoutPrices=new Map(items.map(item=>[item.product.id,item.product.price]));
    openModal('Finalizar pedido', `
      <div class="checkout-summary">
        <div class="summary-card"><h4>Entrega e pagamento</h4><div class="field-grid"><div class="field"><label>Nome</label><input id="checkout-name" class="input" autocomplete="name" value="${esc(checkoutDraft?.name??state.customer.name??'')}"></div><div class="field"><label>Telefone</label><input id="checkout-phone" class="input phone-only" inputmode="numeric" autocomplete="tel" maxlength="11" value="${esc(checkoutDraft?.phone??onlyDigits(state.customer.phone||''))}"></div><div class="field"><label>Bairro</label><input id="checkout-neighborhood" class="input" autocomplete="address-level3" value="${esc(checkoutDraft?.neighborhood??state.customer.neighborhood??'')}"></div><div class="field"><label>Endereço</label><input id="checkout-address" class="input" autocomplete="street-address" value="${esc(checkoutDraft?.address??state.customer.address??'')}"></div></div></div>
        <div class="summary-card"><h4>Forma de pagamento a combinar</h4><p class="merchant-helper">O APETÊ não processa pagamentos nesta versão. Combine a cobrança e a disponibilidade do método com o estabelecimento.</p><div class="payment-box"><button class="payment-option ${selectedPayment === 'pix' ? 'active' : ''}" data-action="select-payment" data-pay="pix"><strong>Pix</strong><span>Combinado com a loja</span></button><button class="payment-option ${selectedPayment === 'cartao' ? 'active' : ''}" data-action="select-payment" data-pay="cartao"><strong>Cartão</strong><span>Consultar disponibilidade</span></button><button class="payment-option ${selectedPayment === 'cartao-entrega' ? 'active' : ''}" data-action="select-payment" data-pay="cartao-entrega"><strong>Cartão na entrega</strong><span>Máquina no recebimento</span></button></div></div>
        <div class="summary-card"><h4>Resumo do pedido</h4><div class="total-row"><span>Estabelecimento</span><strong>${esc(store.name)}</strong></div><div class="total-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="total-row"><span>Entrega</span><strong>${money(deliveryFee)}</strong></div><div class="total-row final"><span>Total</span><strong>${money(total)}</strong></div><div class="field" style="margin-top:12px"><label>Observações do pedido</label><textarea id="checkout-note" class="textarea" maxlength="500" placeholder="Ex.: sem cebola, entregar na portaria, chamar no WhatsApp">${esc(checkoutDraft?.note||'')}</textarea></div><div class="row" style="margin-top:14px"><button class="ghost-btn strong" data-action="back-to-cart">Voltar</button><button class="primary-btn" data-action="place-order">Confirmar pedido</button></div></div>
      </div>`);
    return;
  }

  openModal('Sua sacola', `${items.map((item) => {const itemStore=getStore(item.product.storeId);return `<div class="cart-line"><div class="cart-thumb">${imgTag(item.product.image, item.product.name, itemStore?.producer ? 'producer' : 'food')}</div><div><strong>${esc(item.product.name)}</strong><p class="note">${esc(itemStore?.name||'Estabelecimento')}</p><div class="qty-row"><button data-action="qty-cart" data-id="${item.productId}" data-step="-1">−</button><strong>${item.qty}</strong><button data-action="qty-cart" data-id="${item.productId}" data-step="1">+</button><button class="link-danger" data-action="remove-cart" data-id="${item.productId}">Remover</button></div></div><strong>${money(item.product.price * item.qty)}</strong></div>`}).join('')}<div class="summary-card"><div class="total-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="total-row"><span>Entrega</span><strong>${money(deliveryFee)}</strong></div><div class="total-row final"><span>Total</span><strong>${money(total)}</strong></div><div class="row" style="margin-top:16px"><button class="ghost-btn strong" data-action="close">Continuar navegando</button><button class="primary-btn" data-action="go-checkout">Finalizar compra</button></div></div>`);
}

async function placeOrder() {
  captureCheckoutDraft();
  if(!window.APETE_BACKEND?.createOrder||state.customer.demo||!window.APETE_BACKEND.hasStoredSession()) {
    closeModal();setPage('entrar');return toast('Entre na sua conta real para concluir a compra.');
  }
  const name=$('#checkout-name')?.value.trim();
  const phone=normalizePhone($('#checkout-phone')?.value.trim());
  const neighborhood=$('#checkout-neighborhood')?.value.trim();
  const address=$('#checkout-address')?.value.trim();
  const note=$('#checkout-note')?.value.trim();
  if(!name)return fieldError('#checkout-name','Informe o nome para entrega.');
  if(onlyDigits(phone).length<10)return fieldError('#checkout-phone','Informe um telefone válido com DDD.');
  if(!validAddress(address))return fieldError('#checkout-address','Digite um endereço mais completo para finalizar.');
  const items=state.cart.map(item=>({...item,product:getProduct(item.productId)})).filter(item=>item.product);
  if(!items.length)return toast('Sua sacola está vazia.');
  const store=getStore(items[0].product.storeId);
  if(!store)return toast('Estabelecimento indisponível.');
  try {
    const created=await checkoutController.submit(window.APETE_BACKEND,{
      storeId:store.id,city:state.city,mode:'delivery',
      customer:{name,phone,address,neighborhood},note,payment:selectedPayment,
      items:items.map(item=>({productId:item.product.id,qty:item.qty,expectedPrice:checkoutPrices.get(item.product.id)??item.product.price}))
    });
    state.customer={...state.customer,name,phone,address,neighborhood};
    state.ui.orderSuccessId=Number(created.public_number);
    state.cart=[];
    checkoutDraft=null;
    save();
    closeModal();
    setPage('pedidos');
    checkoutController.complete();
    toast('✓ Pedido enviado e salvo no APETÊ!', 'success');
    try{await window.APETE_BACKEND.updateProfile({full_name:name,phone,address,neighborhood,city:state.city});}catch{}
    await refreshCustomerOrders();
    if(state.page==='pedidos')render();
    hydrateCatalogFromBackend();
  } catch(error) {
    if(/price_changed/.test(String(error?.message))){await hydrateCatalogFromBackend();openCartModal();}
    toast(friendlyBackendError(error,'Não foi possível registrar o pedido. Confira os dados e tente novamente.'));
  }
}
async function saveCustomer() {
  const name=$('#customer-name-field')?.value.trim();
  const email=$('#customer-email-field')?.value.trim().toLowerCase();
  const phone=normalizePhone($('#customer-phone-field')?.value.trim());
  const neighborhood=$('#customer-neighborhood-field')?.value.trim();
  const address=$('#customer-address-field')?.value.trim();
  const password=$('#customer-password-field')?.value||'';
  const confirmPassword=$('#customer-password-confirm')?.value||'';
  if(!validCustomerName(name))return fieldError('#customer-name-field','Digite um nome válido, sem números.');
  if(!validEmail(email))return fieldError('#customer-email-field','Digite um e-mail válido.');
  if(onlyDigits(phone).length<10)return fieldError('#customer-phone-field','Digite um telefone válido com DDD.');
  if(!validAddress(address))return fieldError('#customer-address-field','Digite um endereço mais completo.');
  if(!strongPassword(password))return fieldError('#customer-password-field','A senha precisa ter no mínimo 8 caracteres, com letras e números.');
  if(password!==confirmPassword)return fieldError('#customer-password-confirm','As senhas do cadastro não conferem.');
  if(!$('#customer-accept-terms')?.checked||!$('#customer-accept-privacy')?.checked)return toast('Aceite os Termos de Uso e leia a Política de Privacidade para criar a conta.');
  if(!window.APETE_BACKEND?.signUpCustomer)return toast('Backend de cadastro indisponível.');
  try {
    const result=await window.APETE_BACKEND.signUpCustomer({email,password,name,phone,address,neighborhood,city:state.city,legalDocuments:['terms','privacy']});
    if(result.confirmationRequired){
      state.customer={...initialState().customer,name,email,phone,address,neighborhood};
      state.ui.pendingLegalAcceptances=['terms','privacy'];
      state.ui.demoOptOut=true;save();
      toast('Cadastro criado. Confirme seu e-mail e depois volte ao APETÊ para entrar.','success');
      setPage('entrar');
      return;
    }
    await window.APETE_BACKEND.acceptLegalDocuments(['terms','privacy']);
    const profile=await window.APETE_BACKEND.getProfile();
    applyBackendCustomer(profile||{full_name:name,email,phone,address,neighborhood,city:state.city});
    state.orders=[];
    save();
    setPage('cliente');
    toast('Cadastro criado e conta conectada.','success');
  } catch(error) {
    toast(friendlyBackendError(error,'Não foi possível criar a conta. Tente novamente.'));
  }
}

async function loginCustomer() {
  const email=($('#login-identifier')?.value||'').trim().toLowerCase();
  const password=$('#login-password')?.value||'';
  if(!validEmail(email))return fieldError('#login-identifier','Informe um e-mail válido.');
  if(!password)return fieldError('#login-password','Informe sua senha.');
  if(!window.APETE_BACKEND?.signInCustomer)return toast('Backend de login indisponível.');
  try {
    await window.APETE_BACKEND.signInCustomer({email,password});
    if(Array.isArray(state.ui.pendingLegalAcceptances)&&state.ui.pendingLegalAcceptances.length){
      await window.APETE_BACKEND.acceptLegalDocuments(state.ui.pendingLegalAcceptances);
      state.ui.pendingLegalAcceptances=null;
    }
    const profile=await window.APETE_BACKEND.getProfile();
    if(!profile)throw new Error('profile_unavailable');
    applyBackendCustomer(profile);
    state.orders=await window.APETE_BACKEND.loadOrders();
    save();
    setPage('cliente');
    toast('Login realizado.','success');
  } catch(error) {
    toast(friendlyBackendError(error,'Não foi possível entrar agora.'));
  }
}

async function logoutCustomer() {
  try{await window.APETE_BACKEND?.signOut?.();}catch{}
  state.customer={...initialState().customer};
  state.orders=[];
  state.ui.savedCustomerBeforeDemo=null;
  state.ui.demoOptOut=true;
  save();
  setPage('entrar');
}
async function loginMerchant() {
  const owner=$('#merchant-owner')?.value.trim();
  const identifier=($('#merchant-identifier')?.value||'').trim();
  const storeId=Number($('#merchant-store')?.value||1);
  const password=$('#merchant-password')?.value||'';
  const store=getStore(storeId);
  if(!owner)return toast('Informe o nome do responsável');
  if(!identifier||!password)return toast('Informe seu acesso e sua senha');

  // Presentation-only fallback. It never creates a real authenticated merchant.
  if(!identifier.includes('@')){
    if(onlyDigits(identifier).length<10||onlyDigits(identifier).length>11)return toast('Informe um telefone com DDD ou um e-mail válido');
    if(password!=='1234'||!store)return toast('Telefone de apresentação ou senha incorretos');
    state.merchant={...state.merchant,logged:true,backend:false,owner,phone:normalizePhone(identifier),email:'',storeId:store.id,password:'',verified:!!store.verified};
    state.ui.merchantPanelTab='pendentes';
    save();setPage('comerciante');toast('Painel de apresentação liberado');return;
  }

  const email=identifier.toLowerCase();
  if(!validEmail(email))return toast('Informe um e-mail válido');
  try{
    await window.APETE_BACKEND.signInCustomer({email,password});
    const profile=await window.APETE_BACKEND.getProfile();
    if(profile)applyBackendCustomer(profile);

    let memberships=await window.APETE_BACKEND.getMerchantMemberships();
    if(!memberships.length&&state.ui.merchantApplicationDraft){
      try{
        if(Array.isArray(state.ui.pendingLegalAcceptances)&&state.ui.pendingLegalAcceptances.length){
          await window.APETE_BACKEND.acceptLegalDocuments(state.ui.pendingLegalAcceptances);
          state.ui.pendingLegalAcceptances=null;
        }
        await window.APETE_BACKEND.submitMerchantApplication(state.ui.merchantApplicationDraft);
        state.ui.merchantApplicationDraft=null;
      }catch{}
    }
    memberships=await window.APETE_BACKEND.getMerchantMemberships();
    const membership=memberships.find(item=>item.store.id===storeId)||memberships[0];
    if(!membership){
      const application=await window.APETE_BACKEND.getMerchantApplication();
      save();
      if(application?.status==='pending')return toast('Seu cadastro de comerciante ainda está aguardando aprovação.');
      if(application?.status==='rejected')return toast('Seu cadastro de comerciante não foi aprovado. Revise os dados com a equipe do APETÊ.');
      return toast('Esta conta ainda não possui acesso a nenhum estabelecimento.');
    }
    applyMerchantMembership(membership,owner);
    state.merchantOrders=await window.APETE_BACKEND.loadMerchantOrders(state.merchant.backendStoreId);
    save();
    setPage('comerciante');
    toast('Painel real conectado.','success');
  }catch(error){
    toast(friendlyBackendError(error,'Não foi possível entrar no painel.'));
  }
}

async function registerMerchant() {
  const storeName=$('#merchant-register-store')?.value.trim();
  const owner=$('#merchant-register-owner')?.value.trim();
  const phone=normalizePhone($('#merchant-register-phone')?.value.trim());
  const city=$('#merchant-register-city')?.value.trim()||state.city;
  const email=($('#merchant-register-email')?.value||'').trim().toLowerCase();
  const password=$('#merchant-register-password')?.value||'';
  const confirmPassword=$('#merchant-register-password-confirm')?.value||'';
  const documentId=$('#merchant-register-document')?.value.trim();
  const proof=$('#merchant-register-proof')?.value.trim();
  const instagram=instagramHandle(proof);
  const confirmed=$('#merchant-register-confirm')?.checked;
  const legalDocuments=['terms','privacy','merchant_terms'];

  if(!storeName||!owner)return toast('Preencha nome da loja e responsável');
  if(onlyDigits(phone).length<10)return toast('Digite um telefone válido');
  if(!validEmail(email))return toast('Informe um e-mail válido do responsável');
  if(!strongPassword(password))return toast('A senha do painel precisa ter no mínimo 8 caracteres, com letras e números');
  if(password!==confirmPassword)return toast('As senhas do painel não conferem');
  if(!documentId||!instagram||!confirmed)return toast('Informe o documento, Instagram da loja e a confirmação');
  if(!$('#merchant-accept-terms')?.checked||!$('#merchant-accept-privacy')?.checked||!$('#merchant-accept-rules')?.checked)
    return toast('Aceite os Termos, a Política de Privacidade e as Regras do Comerciante.');

  const draft={storeName,phone,city,document:documentId,instagram:'@'+instagram};

  try{
    // Quem já tem conta de cliente pode solicitar acesso comercial com a mesma conta.
    let signedInExisting=false;
    try{
      await window.APETE_BACKEND.signInCustomer({email,password});
      signedInExisting=true;
    }catch(loginError){
      const message=String(loginError?.message||'').toLowerCase();
      if(/email not confirmed/.test(message)){
        state.ui.merchantApplicationDraft=draft;
        state.ui.pendingLegalAcceptances=legalDocuments;
        save();
        toast('Essa conta existe, mas o e-mail ainda não foi confirmado. Confirme o e-mail e volte para enviar a solicitação.');
        return;
      }
      if(!/invalid login credentials/.test(message))throw loginError;
    }

    if(signedInExisting){
      await window.APETE_BACKEND.acceptLegalDocuments(legalDocuments);
      const memberships=await window.APETE_BACKEND.getMerchantMemberships();
      if(memberships.length){
        await window.APETE_BACKEND.signOut();
        return toast('Essa conta já possui acesso a um estabelecimento. Entre pelo painel do comerciante.');
      }
      const previous=await window.APETE_BACKEND.getMerchantApplication();
      if(previous?.status==='pending'){
        await window.APETE_BACKEND.signOut();
        return toast('Essa conta já tem uma solicitação aguardando análise.');
      }
      await window.APETE_BACKEND.submitMerchantApplication(draft);
      await window.APETE_BACKEND.signOut();
      state.customer={...initialState().customer};
      state.merchant={...initialState().merchant};
      state.ui.merchantApplicationDraft=null;
      state.ui.pendingLegalAcceptances=null;
      save();
      toast('Solicitação enviada. Depois de aprovada, entre no painel com esta mesma conta.','success');
      setPage('comerciante-entrar');
      return;
    }

    const result=await window.APETE_BACKEND.signUpCustomer({
      email,password,name:owner,phone,address:'',neighborhood:'',city,legalDocuments
    });
    if(result.confirmationRequired){
      state.ui.merchantApplicationDraft=draft;
      state.ui.pendingLegalAcceptances=legalDocuments;
      state.merchant={...initialState().merchant};
      save();
      toast('Conta criada. Confirme o e-mail e depois entre no painel para enviar a solicitação.','success');
      setPage('comerciante-entrar');
      return;
    }

    await window.APETE_BACKEND.acceptLegalDocuments(legalDocuments);
    await window.APETE_BACKEND.submitMerchantApplication(draft);
    await window.APETE_BACKEND.signOut();
    state.customer={...initialState().customer};
    state.merchant={...initialState().merchant};
    state.ui.merchantApplicationDraft=null;
    state.ui.pendingLegalAcceptances=null;
    save();
    toast('Cadastro enviado para aprovação. Depois de aprovado, entre com seu e-mail e senha.','success');
    setPage('comerciante-entrar');
  }catch(error){
    toast(friendlyBackendError(error,'Não foi possível enviar o cadastro do estabelecimento.'));
  }
}
async function saveMerchantProfile() {
  const store=activeMerchantStore();
  const values={
    name:$('#merchant-edit-name')?.value.trim()||store.name,
    category:$('#merchant-edit-category')?.value.trim()||store.category,
    city:$('#merchant-edit-city')?.value.trim()||store.city,
    address:$('#merchant-edit-address')?.value.trim()||store.address||'',
    desc:$('#merchant-edit-desc')?.value.trim()||store.desc,
    contactPhone:normalizePhone($('#merchant-edit-phone')?.value.trim()||state.merchant.phone),
    instagram:'@'+instagramHandle($('#merchant-edit-instagram')?.value)
  };
  if(state.merchant?.backend){
    try{
      await window.APETE_BACKEND.updateStoreProfile(store.backendId,values);
      Object.assign(store,{name:values.name,category:values.category,city:values.city,address:values.address,desc:values.desc,contactPhone:values.contactPhone,instagram:values.instagram});
      state.merchant.phone=values.contactPhone;
      state.merchant.officialProof=values.instagram;
      save();render();toast('Dados da loja atualizados no banco.','success');
    }catch(error){toast(friendlyBackendError(error,'Não foi possível atualizar a loja.'));}
    return;
  }
  Object.assign(store,{name:values.name,category:values.category,city:values.city,address:values.address,desc:values.desc,instagram:values.instagram,officialRef:values.instagram});
  state.merchant.phone=values.contactPhone;
  save();render();toast('Dados da loja atualizados');
}

function findMerchantOrder(orderId) {
  const id=Number(orderId),storeId=activeMerchantStore().id;
  if(state.merchant?.backend)return state.merchantOrders.find(order=>order.id===id&&order.storeId===storeId);
  return state.orders.find(order=>order.id===id&&order.storeId===storeId)
    ||state.demoOrders.find(order=>order.id===id&&order.storeId===storeId);
}

async function advanceOrder(orderId) {
  if(!merchantAccess())return;
  const order=findMerchantOrder(orderId);
  if(!order)return;
  if(state.merchant?.backend){
    const next={pendente:'preparing',preparando:'ready',pronto:'delivered'}[order.status];
    if(!next)return;
    try{
      await window.APETE_BACKEND.updateOrderStatus(order.backendId,next);
      await refreshMerchantBackend();
      if(state.page==='comerciante')render();
      toast(`Pedido #${String(order.id).padStart(3,'0')} atualizado no banco`,'success');
    }catch(error){toast(friendlyBackendError(error,'Não foi possível atualizar o pedido.'));}
    return;
  }
  if(order.status==='pendente')order.status='preparando';
  else if(order.status==='preparando')order.status='pronto';
  else if(order.status==='pronto')order.status='concluido';
  save();render();toast(`Pedido #${String(order.id).padStart(3,'0')} atualizado`);
}

async function cancelOrder(orderId) {
  if(!merchantAccess())return;
  const order=findMerchantOrder(orderId);
  if(!order)return;
  if(state.merchant?.backend){
    try{
      await window.APETE_BACKEND.updateOrderStatus(order.backendId,'cancelled');
      await refreshMerchantBackend();
      if(state.page==='comerciante')render();
      toast(`Pedido #${String(order.id).padStart(3,'0')} cancelado no banco`,'success');
    }catch(error){toast(friendlyBackendError(error,'Não foi possível cancelar o pedido.'));}
    return;
  }
  order.status='cancelado';save();render();toast(`Pedido #${String(order.id).padStart(3,'0')} cancelado`);
}

async function logoutMerchant() {
  if(state.merchant?.backend){
    try{await window.APETE_BACKEND?.signOut?.();}catch{}
    if(state.customer?.backend){state.customer={...initialState().customer};state.orders=[];}
  }
  state.merchant={...initialState().merchant};
  state.merchantOrders=[];
  state.ui.presentationMerchant=false;
  save();
  setPage('comerciante-entrar');
}
let locationRequestId=0;
function cancelLocationRequest(){locationRequestId++;locating=false;}
async function useMyLocation() {
  if(locating)return;
  if(!navigator.geolocation)return toast('Seu navegador não oferece geolocalização.');
  const requestId=++locationRequestId;
  locating=true;updateGeolocationControl();
  try{
    const {coords}=await globalThis.APETE_LOCATION.requestPosition(navigator.geolocation);
    if(requestId!==locationRequestId)return;
    const nearest=globalThis.APETE_LOCATION.nearestCity(coords,REGIONAL_CITY_CENTERS);
    if(!nearest){toast('A localização não foi precisa o suficiente ou está fora da Serra. Escolha a cidade manualmente.');return;}
    if(state.cart.length&&state.city!==nearest.city){toast('Finalize ou esvazie sua sacola antes de trocar a cidade de entrega.');return;}
    state.city=nearest.city;state.location='Próximo de '+nearest.city;state.ui.catalogScope='city';
    save();closeRegionSelector();render();
    toast('Cidade sugerida: '+nearest.city+'. Você pode ajustar no seletor.','success');
  }catch(error){
    if(requestId!==locationRequestId)return;
    if(error.code===1)toast('Localização bloqueada. Escolha a cidade manualmente ou libere a permissão no navegador.');
    else if(error.code===3)toast('Não obtivemos a posição em 4 segundos. Escolha sua cidade para continuar.');
    else toast('Não foi possível obter sua localização. Escolha a cidade manualmente.');
  }finally{
    if(requestId===locationRequestId){locating=false;updateGeolocationControl();}
  }
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
  if(!isMerchantView())render();
  try {
    await ensureSabiaSession();
    if(sabiaChat.at(-1)?.role==='user')sabiaChat.pop();
    sabiaChat.push({role:'user',content:clean});if(!isMerchantView())render();
    const result=await sabiaRequest('/api/sabia',{question:clean,conversationId:sabiaSession.conversationId,city:state.city,mode:'delivery',history:sabiaChat.slice(-7,-1).map(({role,content})=>({role,content}))});
    sabiaChat.push({role:'assistant',content:result.text,products:result.products||[],stores:result.stores||[]});sessionStorage.setItem('apete-sabia-history',JSON.stringify(sabiaChat.slice(-12)));
    sabiaMode='generative';sabiaStatusMessage='Conectada à '+result.provider+' · '+result.model;
  } catch(error) {sabiaError=error.message;sabiaRetryAfter=error.retryAfter||0;sabiaDraft=clean;if(error.status===401)sabiaSession=null;}
  finally {sabiaBusy=false;if(state.page==='sabia'){render();$('#sabia-input')?.focus({preventScroll:true});}}
}
async function runSabiaDiagnostic(provider) {
  const clean=String($('#sabia-input')?.value||sabiaDraft||'quero almoço').trim();
  if(!clean||sabiaBusy||sabiaDiagnosticBusy)return;
  sabiaDiagnosticBusy=provider;
  sabiaDiagnostic={provider,question:clean,loading:true};
  if(!isMerchantView())render();
  try{
    await ensureSabiaSession();
    const result=await sabiaRequest('/api/sabia/diagnostic',{
      provider,question:clean,conversationId:sabiaSession.conversationId,city:state.city,mode:'delivery',
      history:sabiaChat.slice(-6).map(({role,content})=>({role,content}))
    });
    sabiaDiagnostic={...result,question:clean,loading:false};
  }catch(error){
    sabiaDiagnostic={ok:false,provider,question:clean,loading:false,stage:'client',status:error.status||0,detail:error.message};
  }finally{
    sabiaDiagnosticBusy='';
    if(!isMerchantView())render();
  }
}
async function detectSabiaMode() {
  try {
    const status=await sabiaRequest('/api/sabia/status');
    sabiaMode=status.mode;sabiaStatusMessage=status.message;
    if(state.page==='sabia')await ensureSabiaSession();
  }catch(error){sabiaMode='unavailable';sabiaStatusMessage=error.message;}
  if(!isMerchantView())render();
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
  } catch(error){toast(error.message);sabiaError=error.message;if(!isMerchantView())render();}
}
function confirmSabiaAdd(){
  const p=sabiaPendingProduct;if(!p)return;
  const local=getProduct(p.id),first=state.cart.length?getProduct(state.cart[0].productId):null;
  if(first&&first.storeId!==p.storeId)return toast('Sua sacola pertence a outro estabelecimento. Finalize ou esvazie antes.');
  const current=state.cart.find(i=>i.productId===p.id)?.qty||0;
  if(!local||local.stock<current+p.quantity)return toast('Quantidade indisponível.');
  closeModal();for(let i=0;i<p.quantity;i++)addToCart(p.id);sabiaPendingProduct=null;
}
function closeRegionSelector(){
  const popover=$('#region-popover');
  if(!popover)return;
  popover.hidden=true;
  $('#locate')?.setAttribute('aria-expanded','false');
}
async function updateGeolocationControl(){
  const button=$('#use-location-inline');
  const note=$('#region-location-note');
  if(!button||!note)return;
  if(!navigator.geolocation){
    button.hidden=true;
    note.textContent='Seu navegador não oferece localização. Escolha a cidade manualmente.';
    return;
  }
  button.hidden=false;
  button.disabled=locating;
  button.textContent=locating?'Localizando…':'Usar minha localização';
  if(locating){note.textContent='Tentando obter a cidade por até 4 segundos. A escolha manual continua disponível.';return;}
  if(!navigator.permissions?.query)return;
  try{
    const status=await navigator.permissions.query({name:'geolocation'});
    if(status.state==='denied'){
      button.disabled=true;
      button.textContent='Localização bloqueada';
      note.textContent='A permissão de localização está bloqueada no navegador. Você pode escolher a cidade acima.';
    }else if(status.state==='granted'){
      note.textContent='Permissão ativa. O APETÊ usa a posição apenas para escolher a cidade regional mais próxima.';
    }else{
      note.textContent='Ao tocar, o navegador pedirá permissão. A coordenada exata não é salva pelo APETÊ.';
    }
    status.onchange=()=>updateGeolocationControl();
  }catch{}
}

function selectRegion(){
  const popover=$('#region-popover');
  const select=$('#regional-city-inline');
  if(!popover||!select)return;
  const opening=popover.hidden;
  if(!opening){closeRegionSelector();return;}
  closeSidebar();
  select.innerHTML=REGIONAL_CITIES.map(city=>`<option value="${esc(city)}">${esc(city)}</option>`).join('');
  select.value=REGIONAL_CITIES.includes(state.city)?state.city:REGIONAL_CITIES[0];
  popover.hidden=false;
  $('#locate')?.setAttribute('aria-expanded','true');
  updateGeolocationControl();
  requestAnimationFrame(()=>select.focus({preventScroll:true}));
}

if(!AUTH_PAGE){
  const initialHash=`#${state.page}`;
  if(location.hash!==initialHash)history.replaceState({apetePage:state.page},'',initialHash);
  else history.replaceState({apetePage:state.page},'',location.href);
}
render();
hydrateCatalogFromBackend();
restoreCustomerFromBackend();
restoreMerchantFromBackend();
detectSabiaMode();
$('#content').addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  if(button.matches('a[href]'))event.preventDefault();
  const action = button.dataset.action;
  if(action==='catalog-scope'){
    state.ui.catalogScope=button.dataset.scope==='city'?'city':'region';
    state.filters={...state.filters,category:'Todos',storeId:'0'};
    save();render();return;
  }
  if(action==='choose-store-city'){
    const store=getStore(button.dataset.id);
    if(!store||!REGIONAL_CITIES.includes(store.city))return;
    if(state.cart.length)return toast('Finalize ou esvazie sua sacola antes de trocar a cidade de entrega.');
    cancelLocationRequest();state.city=store.city;state.location=store.city;state.ui.catalogScope='city';
    save();render();toast(`Cidade de entrega: ${store.city}`,'success');return;
  }
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
  if (action === 'end-offer') runBusyAction(button,`end-offer:${button.dataset.id}`,()=>endMerchantOffer(button.dataset.id));
  if (action === 'dismiss-order-success') { state.ui.orderSuccessId = null; save(); render(); }
  if (action === 'refresh-orders') refreshVisibleOrders();
  if (action === 'save-customer') runBusyAction(button,'save-customer',saveCustomer);
  if (action === 'login-customer') runBusyAction(button,'login-customer',loginCustomer);
  if (action === 'login-merchant') runBusyAction(button,'login-merchant',loginMerchant);
  if (action === 'register-merchant') runBusyAction(button,'register-merchant',registerMerchant);
  if (action === 'admin-review-merchant') runBusyAction(button,`admin-review:${button.dataset.id}`,()=>reviewMerchantApplication(button.dataset.id,button.dataset.decision));
  if (action === 'save-merchant-profile') runBusyAction(button,'save-merchant-profile',saveMerchantProfile);
  if (action === 'advance-order') runBusyAction(button,`advance-order:${button.dataset.id}`,()=>advanceOrder(button.dataset.id));
  if (action === 'cancel-order') runBusyAction(button,`cancel-order:${button.dataset.id}`,()=>cancelOrder(button.dataset.id));
  if (action === 'logout-merchant') runBusyAction(button,'logout-merchant',logoutMerchant);
  if (action === 'logout-customer') runBusyAction(button,'logout-customer',logoutCustomer);
  if (action === 'send-suggestion') sendToSabia(button.dataset.text || '');
  if (action === 'sabia-check') detectSabiaMode();
  if (action === 'sabia-diagnostic') runSabiaDiagnostic(button.dataset.provider);
  if (action === 'sabia-review') reviewSabiaProduct(button.dataset.entry,button.dataset.id);
  if (action === 'sabia-retry') sendToSabia(sabiaLastQuestion);
  if (action === 'sabia-new'&&!sabiaBusy) {sabiaSession=null;sabiaError='';sabiaDraft='';sessionStorage.removeItem('apete-sabia-history');ensureSabiaSession(true).then(()=>render()).catch(e=>{sabiaError=e.message;render();});}
});

$('#regional-city-inline')?.addEventListener('change',(event)=>{
  const city=event.target.value;
  if(!REGIONAL_CITIES.includes(city))return;
  cancelLocationRequest();
  state.city=city;
  state.location=city;
  state.ui.catalogScope='city';
  save();
  $('#location-label').textContent=city;
  closeRegionSelector();
  if(!isMerchantView())render();
  toast(`Cidade de entrega: ${city}`,'success');
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
  const form=event.target;
  const submitter=event.submitter||form.querySelector('[type="submit"]');
  if(form.id==='merchant-product-form'){event.preventDefault();runBusyAction(submitter,'form:merchant-product',()=>saveMerchantProduct(form));return;}
  if(form.id==='merchant-offer-form'){event.preventDefault();runBusyAction(submitter,'form:merchant-offer',publishMerchantOffer);return;}
  if(form.id==='merchant-profile-form'){event.preventDefault();runBusyAction(submitter,'form:merchant-profile',saveMerchantProfile);return;}
  if(form.id!=='sabia-form')return;
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

$('#content').addEventListener('keydown',(event)=>{
  if(event.key!=='Enter'||event.isComposing||event.target.matches('textarea,button,a'))return;
  const card=event.target.closest('.auth-form-card');
  if(!card)return;
  const actionButton=card.querySelector('[data-action="login-customer"],[data-action="save-customer"],[data-action="login-merchant"],[data-action="register-merchant"]');
  if(actionButton&&!actionButton.disabled){
    event.preventDefault();
    actionButton.click();
  }
});

$('#modal').addEventListener('keydown',(event)=>{
  if(event.key!=='Enter'||event.isComposing||event.target.matches('textarea,button'))return;
  if(cartStep!=='checkout')return;
  const confirm=$('#modal [data-action="place-order"]');
  if(confirm&&!confirm.disabled){
    event.preventDefault();
    confirm.click();
  }
});

$('#demo-client-tab')?.addEventListener('click', () => {prepareClientForVideo();setPage('inicio');});
$('#demo-merchant-tab')?.addEventListener('click', () => {state.ui.presentationMerchant=true;state.merchant.storeId=state.ui.demoStoreId||1;state.ui.merchantPanelTab='pendentes';state.ui.productEditor=0;setPage('comerciante');});
$('#cart-button').addEventListener('click', openCartModal);
$('#user-button').addEventListener('click', () => {
  if (isMerchantView()) {state.ui.merchantPanelTab='cadastro';save();setPage('comerciante');}
  else setPage(isRealCustomerLogged() ? 'cliente' : 'entrar');
});
$('#locate').addEventListener('click', selectRegion);
$('#use-location-inline')?.addEventListener('click', useMyLocation);
$('#menu-toggle').addEventListener('click', openSidebar);
$('#sidebar-close').addEventListener('click', closeSidebar);
$('#scrim').addEventListener('click', closeSidebar);
$$('.side-nav a, .brand, .site-footer [data-page]').forEach((link) => link.addEventListener('click', (event) => {
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
  event.preventDefault();
  const action = button.dataset.action;
  if (action === 'close') closeModal();
  if (action === 'go-catalog') { state.filters = { query:'', category:'Todos', storeId:'0', sort:'relevancia' }; setPage('cardapio'); }
  if (action === 'qty-cart') updateCartQty(button.dataset.id, button.dataset.step);
  if (action === 'remove-cart') removeCartItem(button.dataset.id);
  if (action === 'go-checkout') goCheckout();
  if (action === 'back-to-cart') { captureCheckoutDraft();cartStep = 'cart';renderCartModal(); }
  if (action === 'place-order') runBusyAction(button,'place-order',placeOrder);
  if (action === 'sabia-confirm-add') confirmSabiaAdd();
  if (action === 'select-payment') { captureCheckoutDraft();selectedPayment = button.dataset.pay;renderCartModal(); }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if(!$('#region-popover')?.hidden){event.preventDefault();closeRegionSelector();}
    else if (!$('#modal').hidden) {event.preventDefault();closeModal();}
    else if($('#sidebar')?.classList.contains('is-open')) {event.preventDefault();closeSidebar();}
  }
});

window.addEventListener('popstate', () => {
  const page=location.hash.replace(/^#/,'')||'inicio';
  if(VALID_PAGES.has(page))setPage(page,null,{fromHistory:true});
});

window.addEventListener('offline',()=>toast('Você está sem internet. Algumas ações ficarão indisponíveis.'));
window.addEventListener('online',()=>toast('Conexão restabelecida.','success'));

window.addEventListener('unhandledrejection',(event)=>{
  const message=String(event.reason?.message||event.reason||'');
  if(/abort|network|fetch/i.test(message))return;
  console.error('apete_unhandled_rejection',event.reason);
});


document.addEventListener('pointerdown',(event)=>{
  const control=event.target.closest?.('.location-control');
  if(!control&&!$('#region-popover')?.hidden)closeRegionSelector();
});

let offerWindowFingerprint='';
function refreshOfferWindows(){
 if(document.hidden||isMerchantView()||!$('#modal')?.hidden)return;
 const next=state.products.filter(product=>globalThis.APETE_OFFERS.isActive(product)).map(product=>product.id).join(',');
 if(next!==offerWindowFingerprint){offerWindowFingerprint=next;render();}
}
setInterval(refreshOfferWindows,15000);
window.addEventListener('focus',refreshOfferWindows);
setInterval(refreshVisibleOrders,15000);
window.addEventListener('focus',refreshVisibleOrders);
window.addEventListener('online',refreshVisibleOrders);
document.addEventListener('visibilitychange',refreshVisibleOrders);

document.addEventListener('error',(event)=>{
  const image=event.target;
  if(!(image instanceof HTMLImageElement)||!image.dataset.fallbackSrc)return;
  const fallback=image.dataset.fallbackSrc;
  delete image.dataset.fallbackSrc;
  if(image.getAttribute('src')!==fallback)image.src=fallback;
},true);
