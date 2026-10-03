# Catálogo atualizado da Sabiá

A publicação consulta o catálogo público no Supabase a cada pergunta e a cada revisão de produto. Usa somente a chave publicável e as permissões de leitura existentes; não acessa contas, pedidos ou documentos privados. Preço e estoque correspondem aos mesmos campos usados no checkout do banco.

As tabelas são paginadas, com limite explícito e timeout de quatro segundos. Falha de leitura devolve indisponibilidade; não troca para o catálogo estático. Catálogos simultâneos usam mapas separados, enquanto o cooldown dos provedores continua compartilhado por isolate. Sem configuração Supabase, os testes locais conservam o catálogo demonstrativo original.

Variáveis públicas: SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY no wrangler.jsonc. As chaves privadas de IA e o segredo de sessão permanecem em Worker Secrets.

Verificação em 2 de outubro: 171 testes, incluindo mudança de preço/estoque entre consultas, requisições simultâneas, catálogo vazio, falha de banco, paginação, ofertas com prazo e cidade não atendida. A leitura real retornou 30 lojas e 153 produtos demonstrativos, cobrindo as nove cidades; são exemplos, não parceiros comerciais.

Última Fornada: o banco armazena início e fim em timestamptz. Comerciantes informam horários no fuso do aparelho, convertidos para UTC. Antes do início e a partir do término, o preço normal vale e o item sai da vitrine de ofertas. Ofertas antigas sem datas também usam o preço normal. A validação no banco exige datas e desconto ao criar ou alterar uma oferta. O checkout compara o preço exibido com o preço calculado na transação e rejeita mudanças sem registrar pedido nem reduzir estoque. Prazos de desconto não comprovam segurança alimentar; condições de consumo continuam sendo informadas pela loja.

A vitrine pública filtra os estabelecimentos pela cidade e pela área de atendimento cadastrada. Sugestões para várias pessoas preservam a quantidade calculada também nos cartões e na revisão para adicionar à sacola.

As alterações no painel local de apresentação não são publicadas nem sincronizadas com a IA. Alterações de comerciantes autenticados persistidas no banco são lidas pela próxima consulta. Isso não comprova adesão ou vendas comerciais.
