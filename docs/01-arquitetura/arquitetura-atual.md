# Arquitetura - Lá na Calçada

## Visão geral
- Next.js (frontend + client-heavy)
- Supabase direto no client
- API mínima server-side
- WhatsApp via wa.me

## Módulos principais
- Pedidos
- Carrinho
- Cardápio
- Delivery
- WhatsApp
- Admin
- Impressão

## Fluxos principais
- Criar pedido balcão
- Criar pedido delivery
- Fluxo da cozinha
- Impressão

## Pontos críticos
- lógica no client
- polling cozinha
- numeração de pedidos
- duplicidade de menu
