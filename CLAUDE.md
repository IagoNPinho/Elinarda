# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Comandos

```bash
pnpm dev       # servidor de desenvolvimento
pnpm build     # build de produção
pnpm lint      # ESLint
```

Não há testes automatizados neste projeto.

---

## O que é este sistema

**Lá na Calçada** — sistema de pedidos para restaurante. Clientes fazem pedidos por três origens: balcão, mesa ou delivery. A cozinha acompanha os pedidos em tempo real (polling a cada 3s).

---

## Arquitetura

### Rotas principais

| Rota | Propósito |
|---|---|
| `app/balcao/` | Pedido no balcão (sem mesa) |
| `app/mesa/[id]/` | Pedido por mesa (Mesas 1–9) |
| `app/delivery/` | Pedido delivery com taxa por bairro |
| `app/cozinha/` | Tela da cozinha — lista pedidos abertos |
| `app/cozinha/[id]/` | Detalhe de um pedido na cozinha |
| `app/print/[id]/` | Página de impressão de um pedido |
| `app/admin/` | Admin: cardápio e pedidos |
| `app/api/orders/[id]/status/` | API Route para atualizar status de pedido |

### Fluxo de pedido

1. Cliente monta o carrinho (React Context em `components/cart/`)
2. `createOrderInDB()` (`lib/orders.ts`) cria o pedido no Supabase com `status: "pending"`
3. Cozinha faz polling de `fetchOpenOrders()` e exibe pedidos pendentes
4. Staff atualiza status: `pending → preparing → ready → out_for_delivery → delivered → closed`
5. Cancelamento limpa dados de pagamento e define `status: "cancelled"`

### Status machine de pedidos

```
pending → preparing → ready → (out_for_delivery →) delivered → closed
                                                              ↓
                                                         cancelled
```

`out_for_delivery` é exclusivo de pedidos com `origin: "delivery"`.

---

## Banco de dados (Supabase)

### Tabela `orders`

Campos relevantes: `id`, `origin` (mesa/balcao/delivery), `fulfillment_type` (pickup/delivery), `table_number`, `daily_order_number`, `customer_*` (nome, telefone, endereço), `items` (JSON), `status`, `subtotal`, `delivery_fee`, `total`, `payment_method`, `payment_details`, `created_at`.

### Tabelas do cardápio dinâmico

- `menu_proteins` — proteínas disponíveis (`type`: chicken/meat/ground_meat/shrimp/lasagna)
- `menu_bases` — bases dos pratos (arroz, etc.)
- `menu_salads` — opções de salada
- `menu_optionals` — opcionais com preço extra
- `menu_item_daily` — mapeia quais itens estão disponíveis por `day_of_week` (0=domingo)
- `delivery_zones` — bairros e taxa de entrega
- `delivery_settings` — `is_open`, `delivery_open_time`, `delivery_close_time`

---

## Sistema de cardápio

O cardápio tem **dois layers**:

1. **Estático por dia da semana** (`lib/menu-data.ts`): `menuByDay[dayIndex]` — lista de `MenuItem` com `id`, `name`, `sizes` (P/G/U), `category`, e `kind` (standard/pratinho/porcao).
2. **Dinâmico do Supabase** (`lib/useMenuData.ts`, `lib/menu-components.ts`): proteínas, bases, saladas, opcionais — carregados em tempo real e filtrados por dia via `menu_item_daily`.

### Tipos de item (`MenuItem.kind`)

- **`standard`** — item simples com tamanhos e preço fixo
- **`pratinho`** — marmita customizável: proteína + base + salada + opcionais (builder em `components/pratinho-builder.tsx`)
- **`porcao`** — porção por peso: proteína + opcionais (builder em `components/porcao-builder.tsx`)

---

## Padrões importantes

- **`lib/orders.ts`** — todos os tipos (`Order`, `OrderItem`, `OrderStatus`, `PaymentMethod`) e todas as funções de CRUD com o Supabase
- **`lib/useMenuData.ts`** — hook client-side que carrega proteínas/bases/saladas/opcionais do Supabase; aceita `dayIndex` para filtrar por dia
- **`lib/whatsapp-message.ts`** — formatação de mensagens WhatsApp para notificação de pedidos
- **Alias `@/`** — aponta para a raiz do projeto (configurado no `tsconfig.json`)
- **`useVisibleMenu.ts`** — hook que retorna o menu do dia + `closedToday` para quando o restaurante não abre

---

## Restrições do projeto

- Nenhuma dependência nova sem verificar se já existe alternativa no projeto
- TypeScript strict — proibido usar `any` sem justificativa
- Componentes Shadcn/ui em `components/ui/` nunca são editados diretamente
- Variáveis de ambiente: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
