# Pedidos persistentes — preparação de publicação

Esta alteração parte de `ai-router-v1`. Não foi aplicada ao Supabase nem ao Worker em produção.

## Comportamento

- A tentativa de checkout usa UUID e hash da sacola na sessão do navegador. Reenvios após perda da resposta reutilizam a tentativa; detalhes de entrega e tokens não são gravados nesse registro.
- `create_order_once` calcula o pedido pelo RPC existente, bloqueia tentativas iguais dentro da transação e retorna o pedido já criado. Uma alteração do conteúdo com a mesma chave é rejeitada. Novo identificador representa um novo pedido.
- A confirmação limpa a sacola antes de atualizar o perfil e a lista. Falha na consulta posterior não incentiva outro envio.
- Cliente e comerciante consultam status a cada 15 segundos enquanto a página estiver visível. Falhas mantêm a lista e exibem aviso; formulários do comerciante não são reconstruídos automaticamente.
- A política de leitura de pedidos usa uma função privada para verificar o entregador, evitando recursão entre pedidos e entregas. As permissões de alteração de status permanecem restritas à equipe/admin.
- Aceites repetidos usam INSERT com conflito ignorado, compatível com as permissões existentes. PATCH sem linha alterada não informa sucesso.

## Ordem de publicação

1. Revisar o PR direcionado a `ai-router-v1` e consolidar essa base antes de promover para `main`.
2. Aplicar, nesta ordem, as migrações `20261002015103_reliable_order_checkout.sql` e `20261002015919_fix_recursive_order_reads.sql` ao projeto Supabase correto. Revisar primeiro o histórico remoto. Não reaplicar migrações já existentes.
3. Publicar o Worker com raiz `APETE-siaratech` após as migrações. O novo frontend depende de `create_order_once`; publicá-lo primeiro interromperia o checkout.
4. Verificar com contas de teste separadas: cliente cria pedido, comerciante da loja avança o status e cliente recebe a atualização. Verificar outra conta sem acesso ao pedido. Não usar pedidos de clientes reais para o teste.

O RPC antigo permanece para compatibilidade e não oferece idempotência a clientes antigos. A proteção atual cobre reenvios com a mesma chave, não pedidos com UUIDs diferentes ou uma sessão de navegador apagada. Pagamento continua como seleção de método; esta alteração não integra cobrança.

## Validação

`npm ci`, `npm run check`, `npm test`.

O teste de banco executa todas as migrações reais em PostgreSQL via PGlite, com usuários/roles fictícios: retry, conteúdo conflitante, estoque, rollback, isolamento, permissões e transições de status. O harness substitui somente a instalação de pgcrypto pelo UUID nativo disponível no PostgreSQL. Não usa dados ou credenciais de produção. É uma instância local; concorrência distribuída e Cloudflare/Supabase em produção ainda exigem verificação após a publicação.

A página inicial também foi aberta no navegador local e carregou o catálogo e a navegação. Não foi realizado checkout autenticado na produção.
