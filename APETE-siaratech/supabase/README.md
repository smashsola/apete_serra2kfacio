# Backend Supabase do APETÊ

O schema real do APETÊ é versionado em `supabase/migrations/`.

## O que já está no banco

- autenticação via Supabase Auth;
- perfis de cliente/comerciante/entregador/admin;
- estabelecimentos e membros;
- produtos e estoque;
- pedidos e itens;
- solicitações de cadastro de comerciante;
- atribuições de entrega;
- RLS e privilégios por coluna;
- RPC `create_order`, que recalcula preços/taxa no servidor e baixa estoque dentro da transação.

O catálogo fictício usado na demonstração está em `seed.sql`.

## Segurança

O navegador usa apenas a **publishable key**. Nunca coloque uma `secret key` ou `service_role` neste repositório ou em arquivos públicos.

Pedidos não confiam em preço, subtotal, taxa ou total enviados pelo cliente. O servidor consulta o catálogo, valida loja/estoque/quantidade e calcula os valores.

O modo de apresentação do comerciante continua separado do acesso real. Uma conta real só acessa uma loja quando existe vínculo em `store_members`.

## Pagamento

O método escolhido é persistido no pedido, mas Pix/cartão online ainda precisam de um provedor de pagamento para cobrança e confirmação reais. Não trate a seleção visual como confirmação de pagamento.
