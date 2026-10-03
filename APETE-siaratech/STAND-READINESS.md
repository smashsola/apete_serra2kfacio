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
