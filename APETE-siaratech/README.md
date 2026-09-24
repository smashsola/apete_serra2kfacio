# APETÊ — Da Serra pra sua mesa

**Projeto desenvolvido por Max e Paulo.**

Plataforma demonstrativa de alimentação e comércio regional da Serra da Ibiapaba. Inclui catálogo, sacola, perfis e painel de comerciante demonstrativos, Última Fornada e a assistente Sabiá, que pode consultar o catálogo e conversar usando a API da Groq. A API do Gemini é opcional como reserva.

> **Atenção:** esta versão é uma demonstração. Os estabelecimentos e produtos são fictícios; pedidos e contas ficam no navegador de cada visitante e **não** são sincronizados entre dispositivos. Não há autenticação comercial, pagamentos reais nem garantias de capacidade da IA. Não utilizar para receber pedidos comerciais reais.

## Estrutura

```text
APETE/
├── public/               Site distribuído ao visitante
│   ├── assets/images/    Imagens WebP de produtos e estabelecimentos
│   ├── index.html
│   ├── app.js
│   ├── catalog-seed.js
│   └── styles.css
├── src/worker.js         API serverless da Sabiá + catálogo (NÃO é arquivo público)
├── wrangler.jsonc        Implantação Workers + arquivos estáticos
├── package.json
├── .gitignore
└── README.md
```

## Publicação pelo GitHub + Cloudflare (não selecionar **Static Assets only**)

1. Extraia o ZIP. Crie no GitHub um repositório **privado**, preferencialmente `apete-serra`, e envie **o conteúdo da pasta extraída** (incluindo `wrangler.jsonc`, `src/` e `public/`) na raiz do repositório. Nunca envie `.env`, `.dev.vars` ou suas chaves.
2. Na Cloudflare, entre em **Workers & Pages** e crie um **Worker** com importação do GitHub, não um projeto de arquivos estáticos. Conecte o repositório. Para a configuração de implantação use `npm install` como etapa de instalação (quando solicitada) e `npm run deploy` como comando de deploy; se a interface reconhecer automaticamente `wrangler.jsonc`, confira que o Worker foi implantado com o script `src/worker.js` e os assets da pasta `public/`. Não selecione somente `public/` como origem de *Static Assets only*.
3. Na área de configuração do **Worker executável**, em **Variables and Secrets**, adicione um Secret `GROQ_API_KEY` com sua chave NOVA da Groq; outro Secret `SABIA_SESSION_SECRET` com uma sequência aleatória e privada de 32+ caracteres; e, se tiver acesso, `GEMINI_API_KEY` com a chave do Gemini (opcional). Não exponha esses valores em frontend, código nem prints.
4. Faça a implantação/reimplantação e visite `https://SEU-WORKER.workers.dev/api/sabia/status`. O resultado deve informar `configured: true` e `mode: "generative"` com a Groq configurada. Esse endpoint **não garante** que exista cota disponível; teste uma pergunta na Sabiá.
5. Teste a página inicial, imagens, catálogo, sacola e chat num celular em outra rede. Sem Gemini, a IA dependerá apenas da Groq. Se o erro `Static Assets only` voltar, a implantação **não** utilizou `src/worker.js`: confira o `wrangler.jsonc` e a configuração da integração GitHub, não tente configurar Secrets no Worker estático.

### Execução local (opcional)

Com Node.js instalado: `npm install`, depois `npm run dev`. Para simular a IA localmente, crie `.dev.vars` **somente no seu computador**, com `GROQ_API_KEY=...` e `SABIA_SESSION_SECRET=...`; esse arquivo não deve ser publicado.

### Limitações de uso

A hospedagem e as APIs possuem cotas gratuitas, e não há garantia de milhares de conversas simultâneas. O fallback Groq → Gemini depende de ambos estarem configurados e terem capacidade disponível. O site e o catálogo continuam acessíveis quando a IA estiver indisponível. O código de demonstração contém senhas fictícias: nunca reutilize essas credenciais em produção.

### Autoria e proteção

Créditos do projeto: **Max e Paulo**. O registro de autoria não é realizado automaticamente por este README ou por um repositório privado. A titularidade do código, das imagens e de componentes de terceiros deve ser verificada antes de pedir registro, licenciar ou comercializar. O repositório é privado por padrão; nenhuma licença de código aberto é concedida neste pacote.
