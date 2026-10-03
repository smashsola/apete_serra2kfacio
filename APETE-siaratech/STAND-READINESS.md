# Preparação do estande — Siará Tech, dia 9

## Atualização em 2 de outubro

- Sabiá ligada ao catálogo público atualizado do banco. Cada consulta e revisão de item confere preço, estoque e cidade; falha não reutiliza dados estáticos. 167 testes passaram. Detalhes em LIVE-CATALOG.md.
- Última Fornada não afirma produção no dia sem esse dado. O sistema aplica início e fim das ofertas; cada loja precisa cadastrar seus prazos e condições. Exemplos não são comprovação de promoções reais.

- Respostas da mentoria e perguntas adicionais em RESPOSTAS-MENTORIA.md. APETÊ não tem assinatura; o exemplo do áudio era de outra equipe.
- Retorno de confirmação de e-mail remove tokens da URL e verifica o usuário no Auth antes de salvar a sessão. Cadastro solicita retorno para o endereço público. Site URL e Redirect URLs estão configurados para https://apete-serra2kfacio.betaniaaa.workers.dev/. Cadastro público em caixa QA própria recebeu a confirmação: HTTP 303 para o endereço publicado e usuário confirmado no Auth. Logout efetuado, conta e caixa QA removidas. O teste de e-mail verificou o redirecionamento pela API; não repetiu o consumo da sessão pelo navegador.
- Primeiro APK Android em Java/WebView construído; lint sem avisos e assinatura v2 verificada. Usa o site publicado e requer internet. Não está na Play Store. Nenhum aparelho conectado foi detectado; instalação e teste físico permanecem pendentes.
- Script de instalação por USB recusa ausência, ambiguidade ou dispositivo não autorizado. Build e instruções estão em android/README.md.

## Verificado em 1 de outubro

- Login real do cliente pelo site publicado, usando conta QA temporária.
- Produto de teste adicionado à sacola; envio pelo checkout com confirmação #002 e histórico correto.
- Comerciante autenticado em origem local separada para evitar compartilhar a sessão do cliente. O código servido é o mesmo da publicação e acessa o Supabase real.
- Pedido recebido e avançado pelas telas: recebido → em preparo → pronto → concluído.
- Tela do cliente publicada recebeu automaticamente as mudanças, sem reload ou botão Atualizar. Histórico terminou com 1 pedido concluído e valor R$ 1,00.
- Não houve cobrança ou entrega. Loja, produto, pedido, sessões e contas QA removidos; limpeza confirmada no banco.
- Emulação DOM de 390 px sem transbordamento horizontal na página de pedidos. A captura móvel da ferramenta apresentou inconsistência; conferir visualmente em aparelho físico antes do evento.

## Correções encontradas durante o teste

- SVG de apoio tinha cores com # não codificado e aspas inseridas em JavaScript inline. Agora toda a imagem é codificada e a substituição usa listener com atributo escapado.
- Foco ao fechar modal usava uma variável zerada antes do próximo frame. Agora captura o elemento e verifica se ainda está conectado.
- Perfil do comerciante inclui Sair da loja, útil para trocar contas durante a demonstração.
- Início e checkout esclarecem que pagamento é combinado com a loja; esta versão não processa cobrança.

## Ainda falta antes do estande

- Exercitar o percurso de cadastro e aprovação de um comerciante com seus dados reais; o teste de pedidos anterior usou comerciantes QA provisionados.
- Conferir catálogo, checkout e Sabiá visualmente em um celular físico.
- Ensaiar a Sabiá com 3 pedidos simples e conferir resposta com preço/cidade corretos.
- Escolher o catálogo e as contas de apresentação; manter visível quando os dados forem demonstrativos.
- Preparar QR code do endereço público e uma demonstração curta repetível. Não depende de vídeo.

Comprovante local: outputs/stand-qa/pedido-cliente.png, na área de trabalho do Codex; não contém dados de usuários reais.

## Avanço em 2 de outubro

- Navegação regional: botão Abrir Última Fornada na página inicial, total regional visível e seleção entre Toda a Serra e entrega na cidade. Navegador publicado conferido com 30 cards de estabelecimentos e 153 cards de produtos; Croatá filtra 3 lojas e 15 produtos. Explorar outra cidade não altera a cidade usada pela Sabiá e pelo checkout.
- 27 produtos sem foto receberam 11 novas imagens ilustrativas geradas e otimizadas em WebP. Catálogo publicado com 153 produtos e nenhuma foto vazia; 46 arquivos distintos de imagens e capas verificados por HTTP 200 com tipo image. As imagens demonstrativas não comprovam produtos ou estabelecimentos reais.
- Localização reaproveita posição recente e encerra a espera após 4 segundos, mesmo se o navegador não responder. Posição imprecisa exige escolha manual; resultado atrasado não desfaz escolha manual. Coordenada exata não é salva nem enviada. Testes com posições simuladas; obtenção de GPS em aparelho físico permanece pendente.
- 178 testes passaram após estas mudanças; navegação e fotos também conferidas no navegador público.
- 30 lojas e 153 produtos demonstrativos nas nove cidades; 9 exemplos de produtores. Viçosa, Carnaubal, Croatá e Ipu agora têm três perfis e 15 produtos cada. Guaraciaba recebeu três refeições vegetarianas.
- 171 testes passando. Migrações e seed exercitados em Postgres local, incluindo preço ativo, futuro e vencido e rejeição de preço antigo sem consumir estoque.
- Pedido com preço antigo também recusado no banco publicado; pedido com preço normal conferido em transação revertida, sem vendas ou alterações persistentes de estoque.
- Formulário de oferta criado e encerrado pela interface de demonstração, com início/fim e indicação de prazo. Nenhuma promoção fictícia permanente foi ativada.
- Groq e Gemini responderam na publicação. Cloudflare teve um timeout de 18 segundos e respondeu na repetição em cerca de 12,7 segundos; o resultado não garante disponibilidade futura.
- Advisor do Supabase: dois avisos de funções SECURITY DEFINER públicas autenticadas, tabela privada sem política por bloqueio deliberado e proteção de senhas vazadas desativada. [Referência das funções](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable) e [proteção de senhas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Nenhuma permissão de dados foi ampliada além das colunas de prazo protegidas pelas políticas existentes.

## Fotos corrigidas e localização rápida — 2 de outubro

- Revisão visual de todas as associações: 123 fotos de produto e 25 capas substituídas. Os 153 produtos e 30 estabelecimentos têm arquivos distintos, verificados também por hash; imagens ilustrativas de demonstração.
- Associação preservada entre app, seed, Worker e banco. Atualizações do banco limitadas a registros demo, nome e imagem antiga esperados, sem substituir uploads posteriores dos comerciantes.
- Localização: limite total de 3 segundos, posição em cache de até dois minutos e uma tentativa de alta precisão quando a primeira resposta é imprecisa. Seleção manual permanece disponível e resultados atrasados são ignorados. Nenhuma coordenada exata é enviada ou persistida. GPS real em celular físico ainda exige conferência.
- 183 testes passaram, incluindo repetição de fotos e demora/recusa/imprecisão do GPS. CLI Supabase bloqueada pelo Controle de Aplicativo do Windows; DML aplicado e verificado pelo conector, com SQL correspondente versionado.
- Cloudflare: versão 0d1922b6-7849-439a-b2b0-d5080f1004c5.

## Revisão de aquisição de localização — 3 de outubro

- Corrigido timeout da primeira tentativa: agora uma tentativa rápida de 2 segundos pode ser seguida por alta precisão, dentro de um prazo total de 10 segundos. O prazo anterior de 3 segundos podia encerrar a busca cedo demais.
- Erro permanece no seletor com orientação para permissão/localização do aparelho; seleção manual continua disponível. Consulta assíncrona de permissão não substitui mensagem de busca ou falha.
- 184 testes passaram, incluindo primeira tentativa expirada seguida de segunda tentativa bem-sucedida. Isso verifica o comportamento do app; aquisição real depende do aparelho e navegador.

## Interface móvel e dock — 3 de outubro

- Caixa de aviso inativa agora oculta por visibility/opacity; corrigida a faixa verde vazia que aparecia no rodapé ao rolar.
- Sabiá: conversa primeiro em telas pequenas, cidade de entrega no próprio chat, campo de mensagem maior e botão Enviar ao lado. Sem rolagem horizontal nas larguras 320 e 390; dock some ao focar campos para liberar espaço na digitação.
- Dock React inspirado na referência fornecida, com Framer Motion e Lucide: ícones ampliam conforme a distância do mouse (44–72 px), links reais com indicação da página atual, rótulos visíveis e tamanho de toque estável no celular. Preferência de movimento reduzido respeitada. Rodapé tem espaço para a navegação fixa.
- Integração isolada em components/ui/dock.tsx; TypeScript e estrutura shadcn configurados. Tailwind compilado sem preflight para preservar as telas existentes. npm run build:dock recompila os arquivos publicados; npm run check:dock valida os tipos.
- 184 testes, sintaxe e tipos passaram; navegação, digitação, largura de tela e magnificação conferidas no navegador. Prévia de frontend por servidor estático porque o runtime local do Worker não iniciou neste Windows.

## Animação do cabeçalho — 3 de outubro
- Efeito de proximidade e mola do Framer Motion nos quatro botões existentes. Pressionar no celular anima o botão, soltá-lo restaura a escala, sem bloquear os cliques ou alterar as dimensões do layout.
- Preferência de movimento reduzido respeitada. Bundle independente de 56 KB; componente React original continua em components/ui/dock.tsx. Tipagem, sintaxe e 184 testes passaram.
- Conferido no site publicado em desktop e viewport de 390 px: escala visual de 1.14 e tamanho base preservado. Corrigido também o cabeçalho de seção que ultrapassava a largura no início mobile.

## Navegação somente no cabeçalho — 3 de outubro

- Removido o dock inferior da página e seus arquivos de execução/estilo da carga inicial. O componente fica guardado no código, sem aparecer ou alterar o rodapé.
- Mantidos os tamanhos, espaçamentos e altura do cabeçalho existentes. Cidade, conta e sacola usam efeito leve de hover sem mudar o layout; menu de três barrinhas disponível também no desktop.
- Chat responsivo e correção dos avisos vazios preservados. 184 testes e sintaxe passaram.

## Efeito habilitado explicitamente — 3 de outubro
- A pedido do usuário, a animação dos botões do cabeçalho funciona mesmo com preferência de movimento reduzido do sistema. Demais componentes mantêm suas preferências.
- Conferido no navegador original: movimento reduzido ativo, botão com escala 1.14, largura base 118 px e cabeçalho 79 px. Pressão e abertura do menu verificadas em 390 px. Build e TypeScript passaram.

## Visual, tema e menu lateral — 3 de outubro
- Ampliação do header reduzida de 14% para 5,5%, deslocamento de 3 px para 1,4 px e mola com menos oscilação. Links e controles do menu lateral animam com mouse, pressão e teclado (2,5%).
- Alternância claro/escuro no header com rótulo acessível, aria-pressed e preferência local salva. Tema aplicado também ao catálogo, filtros, Sabiá, formulários e sacola.
- Fundo em papel claro/verde profundo, bordas e sombras consistentes, melhores fotos, tipografia e composição da página inicial em duas colunas no desktop. Header mantém altura e dimensões dos botões.
- 184 testes, build, TypeScript e sintaxe passaram. Verificados persistência após reload, catálogo e Sabiá no tema escuro em 390 px, sem transbordamento horizontal.

## Quatro paletas e botões mais visíveis — 3 de outubro
- Serra, Caju, Amora e Oceano, todas com modo claro/escuro e preferência salva. Caju é a paleta inicial; seletor no menu lateral.
- Paletas aplicadas ao fundo, superfícies, header, sidebar, hero e ações. Vitrine com foto maior, selo da marca e destaques coloridos. Resumo regional mais compacto no desktop.
- Bordas de Ver perfil, Escolher cidade e ações secundárias reforçadas para 2 px com cores de maior contraste.
- 184 testes e sintaxe passaram. Quatro paletas conferidas em ambos os modos, persistência após reload e seleção no celular. Catálogo em 320 px sem overflow e borda computada de 2 px.


## Paletas combinadas e tabela regional experimental — 3 de outubro
- Serra + Caju e Serra + Oceano usam verde como principal. Broto combina #C8FFBE, #92AA83 e #E0EDC5; todas com claro/escuro e persistência local. Header mantém 79 px no desktop e 116 px no celular.
- Tabela demonstrativa central: R$5 até 3 km, mais R$1/km excedente. Representada em centavos por max(500,200+100*distância); 3,5 km = R$5,50, 10 km = R$12. Sem taxa adicional da plataforma nesta versão.
- Distância pela estrada informada e combinada com a loja; GPS só identifica cidade e NÃO calcula rota. Atendimento rural/entre cidades deve ser confirmado. Preços são hipóteses para validar com entregadores locais, não valores comprovados para a região.
- Banco recalcula frete, exige correspondência com o valor visto pelo cliente e salva distância/tarifa no pedido. Mantidos idempotência, estoque e isolamento por usuário. Comerciantes não têm permissão de alterar colunas de frete; a administração da plataforma controla a tabela.
- As 30 lojas demonstrativas usam a tabela. Inserções novas recebem o padrão no banco, inclusive aprovações de cadastro. Sabiá identifica totais iniciais e informa que o orçamento final depende da distância.
- 188 testes passaram. Conferidos três temas em ambos os modos, persistência após reload, frete no navegador publicado e telas 320/390 px sem overflow. Nenhum pedido real foi submetido no teste.
- Evidências: outputs/stand-qa/apete-broto-desktop.png e apete-frete-broto-mobile.png, no workspace pai.


## Identidade única de comida — 3 de outubro
- Removidos seletor, sete paletas e preferência antiga. Identidade única de creme, dourado e vermelho queimado, suavizada após feedback: vermelho #8B4230 nos destaques, CTA #EFB85D, menu #51352B. Modo escuro preservado em tons quentes.
- Cabeçalho e animações preservados; sem alteração de catálogo, frete, IA ou pedidos. Sintaxe conferida, modo escuro e catálogo verificados em 320/390 px sem overflow. Header permanece 79/116 px.
- Publicado no Cloudflare: versão 44e4e40e-95d8-4a8a-95f2-629f3e075b38. Evidência visual: outputs/stand-qa/apete-comida-suave-desktop.png no workspace pai.
