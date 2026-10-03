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

- 30 lojas e 153 produtos demonstrativos nas nove cidades; 9 exemplos de produtores. Viçosa, Carnaubal, Croatá e Ipu agora têm três perfis e 15 produtos cada. Guaraciaba recebeu três refeições vegetarianas.
- 171 testes passando. Migrações e seed exercitados em Postgres local, incluindo preço ativo, futuro e vencido e rejeição de preço antigo sem consumir estoque.
- Pedido com preço antigo também recusado no banco publicado; pedido com preço normal conferido em transação revertida, sem vendas ou alterações persistentes de estoque.
- Formulário de oferta criado e encerrado pela interface de demonstração, com início/fim e indicação de prazo. Nenhuma promoção fictícia permanente foi ativada.
- Groq e Gemini responderam na publicação. Cloudflare teve um timeout de 18 segundos e respondeu na repetição em cerca de 12,7 segundos; o resultado não garante disponibilidade futura.
- Advisor do Supabase: dois avisos de funções SECURITY DEFINER públicas autenticadas, tabela privada sem política por bloqueio deliberado e proteção de senhas vazadas desativada. [Referência das funções](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable) e [proteção de senhas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Nenhuma permissão de dados foi ampliada além das colunas de prazo protegidas pelas políticas existentes.
