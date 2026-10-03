# Catálogo atualizado da Sabiá

A publicação consulta o catálogo público no Supabase a cada pergunta e a cada revisão de produto. Usa somente a chave publicável e as permissões de leitura existentes; não acessa contas, pedidos ou documentos privados. Preço e estoque correspondem aos mesmos campos usados no checkout do banco.

As tabelas são paginadas, com limite explícito e timeout de quatro segundos. Falha de leitura devolve indisponibilidade; não troca para o catálogo estático. Catálogos simultâneos usam mapas separados, enquanto o cooldown dos provedores continua compartilhado por isolate. Sem configuração Supabase, os testes locais conservam o catálogo demonstrativo original.

Variáveis públicas: SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY no wrangler.jsonc. As chaves privadas de IA e o segredo de sessão permanecem em Worker Secrets.

Verificação: 167 testes, incluindo mudança de preço/estoque entre consultas, requisições simultâneas, catálogo vazio, falha de banco, paginação e cidade não atendida. A leitura real retornou 18 lojas e 90 produtos demonstrativos.

Última Fornada: removida a afirmação de produção "hoje" sem registro dessa informação. O banco atual armazena preço, preço anterior e sinalização da oferta, mas ainda não contém datas de início/fim ou dados de conservação. A Sabiá não confirma validade da promoção; a tela pede conferir condições com a loja. A etapa de cadastrar e fazer cumprir prazos de ofertas permanece pendente.

As alterações no painel local de apresentação não são publicadas nem sincronizadas com a IA. Alterações de comerciantes autenticados persistidas no banco são lidas pela próxima consulta. Isso não comprova adesão ou vendas comerciais.
