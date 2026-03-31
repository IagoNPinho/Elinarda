# Banco de Dados — Lá na Calçada

## 1. Objetivo deste documento

Este documento descreve:

- o **estado atual** do banco, inferido a partir do código do projeto
- os **problemas estruturais** já identificados
- o **estado alvo** recomendado para evolução do produto sem quebrar a operação atual

Este documento deve ser atualizado sempre que houver:
- nova migration
- adição/remoção de colunas
- mudança de regra de persistência
- refatoração relevante de modelagem

---

## 2. Estado atual do banco

A análise do código indica que o sistema utiliza o Supabase como banco principal.

As entidades atualmente detectadas são:

- `orders`
- `delivery_settings`
- `delivery_zones`
- `menu_proteins`
- `menu_bases`
- `menu_salads`
- `menu_optionals`
- `menu_daily`

---

## 3. Tabelas atuais

### 3.1 `orders`

Tabela central dos pedidos.

#### Campos inferidos
- `id` (uuid)
- `origin` (text)
- `table_number` (int4)
- `daily_order_number` (int4)
- `customer_name` (text)
- `customer_phone` (text)
- `customer_street` (text)
- `customer_number` (text)
- `customer_neighborhood` (text)
- `customer_cep` (text)
- `customer_address` (text, legado)
- `delivery_ordered_at` (timestamptz)
- `items` (jsonb)
- `subtotal` (numeric)
- `delivery_fee` (numeric, nullable)
- `total` (numeric)
- `payment_method` (text)
- `payment_details` (text)
- `status` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `fulfillment_type` (text, nullable para compatibilidade)

#### Uso no sistema
A tabela `orders` é usada para:

- criação de pedidos
- listagem de pedidos abertos
- acompanhamento da cozinha
- relatórios administrativos
- impressão
- visualização de pedido individual

### Observações
- os itens do pedido estão armazenados dentro de `items` como JSON
- não há, no estado atual, uma tabela relacional de itens de pedido
- `customer_address` aparenta ser campo legado
- `daily_order_number` é gerado por contagem diária e pode colidir em concorrência
- `fulfillment_type` (text) - ESTADO ALVO (pickup/ delivery)
`origin` representa o canal/contexto do pedido.
`fulfillment_type` representa a forma final de atendimento do pedido.

---

### 3.2 `delivery_settings`

Tabela de configuração geral do delivery.

#### Campos inferidos
- `id` (uuid)
- `is_open` (bool)
- `delivery_fee` (numeric)
- `delivery_open_time` (text ou time)
- `delivery_close_time` (text ou time)
- `updated_at` (timestamptz)

#### Uso no sistema
Usada para:

- abrir/fechar delivery
- validar janela de horário
- exibir/editar configuração no admin
- controlar disponibilidade da página de delivery

#### Observações
- existe um campo `delivery_fee`, mas o cálculo real também depende de `delivery_zones`
- isso gera ambiguidade de fonte de verdade

---

### 3.3 `delivery_zones`

Tabela de bairros/regiões de entrega.

#### Campos inferidos
- `id` (uuid)
- `neighborhood` (text)
- `fee` (numeric)

#### Uso no sistema
Usada para:

- preencher o seletor de bairro
- calcular taxa de entrega por bairro
- resolver taxa no fluxo do delivery

#### Observações
- esta tabela tende a ser a melhor fonte de verdade para taxa por bairro
- deve permanecer ativa no fluxo operacional do delivery

---

### 3.4 `menu_proteins`

Tabela de proteínas do cardápio.

#### Campos inferidos
- `id` (uuid)
- `name` (text)
- `type` (text)
- `price_p` (numeric)
- `price_g` (numeric)
- `is_lasagna` (bool)
- `is_active` (bool)

#### Uso no sistema
Usada para:

- montagem do cardápio
- builder de pratinho
- precificação
- administração de menu
- seleção de itens do dia

---

### 3.5 `menu_bases`

Tabela de bases do cardápio.

#### Campos inferidos
- `id` (uuid)
- `name` (text)
- `is_active` (bool esperado pelo sistema)

#### Uso no sistema
Usada para:

- builder de pratinho
- administração de componentes do cardápio
- filtros de disponibilidade

#### Observações
- o código assume a existência de `is_active`

---

### 3.6 `menu_salads`

Tabela de saladas do cardápio.

#### Campos inferidos
- `id` (uuid)
- `name` (text)
- `is_active` (bool esperado pelo sistema)

#### Uso no sistema
Usada para:

- builder de pratinho
- administração de componentes do cardápio
- filtros de disponibilidade

---

### 3.7 `menu_optionals`

Tabela de opcionais do cardápio.

#### Campos inferidos
- `id` (uuid)
- `name` (text)
- `price` (numeric)
- `is_active` (bool esperado pelo sistema)

#### Uso no sistema
Usada para:

- adicionais do pratinho
- administração de menu
- cálculo de preço final

---

### 3.8 `menu_daily`

Tabela de proteínas do dia.

#### Campos inferidos
- `id` (uuid)
- `day_of_week` (int)
- `protein_id` (uuid)
- `is_active` (bool)

#### Relações inferidas
- `protein_id` referencia `menu_proteins`

#### Uso no sistema
Usada para:

- definir proteínas válidas por dia
- renderização do catálogo
- administração do menu diário

#### Observações
- hoje há conflito entre `menu_daily` e lógica hardcoded em código
- isso precisa ser resolvido para existir uma única fonte de verdade

---

## 4. Problemas estruturais do estado atual

### 4.1 Itens de pedido em JSON (`orders.items`)
Hoje os itens ficam embutidos em JSON.

### Vantagens
- implementação rápida
- flexível para composições complexas

### Problemas
- dificulta relatórios
- dificulta ranking de produtos
- dificulta analytics
- dificulta auditoria detalhada
- dificulta evolução para SaaS

---

### 4.2 Numeração diária frágil (`daily_order_number`)
O número diário do pedido é calculado por contagem de pedidos do dia.

### Problema
Em concorrência, dois pedidos podem receber o mesmo número.

### Impacto
- risco operacional
- confusão na cozinha
- inconsistência em impressão e atendimento

---

### 4.3 Campo legado `customer_address`
Existe indicação de que `customer_address` ainda é escrito, mas o modelo mais recente usa campos separados.

### Problema
- redundância
- risco de inconsistência
- manutenção mais difícil

---

### 4.4 Taxa de entrega em dois lugares
A taxa aparece em:

- `delivery_settings.delivery_fee`
- `delivery_zones.fee`

### Problema
Não está claro qual é a fonte oficial da taxa.

### Recomendação
Definir regra oficial:
- taxa padrão geral
- taxa por bairro
- fallback “a consultar”

---

### 4.5 Cardápio com duas fontes de verdade
Há sinais de uso de:

- dados hardcoded em código
- dados do banco (`menu_daily`)

### Problema
- catálogo inconsistente
- itens errados no dia
- comportamento imprevisível entre telas

---

## 5. Regras de modelagem — Estado atual vs Estado alvo
Estas regras devem orientar novas alterações.

### 5.1 Delivery

#### Estado atual (código)
- CEP é obrigatório (validação exige 8 dígitos)
- UF e cidade são opcionais
- CEP é usado para auto-preenchimento via ViaCEP
- cálculo da taxa depende do bairro

#### Estado alvo (produto)
- CEP será removido do fluxo
- UF será removido do fluxo
- bairro será a principal referência para taxa
- endereço será composto por:
  - rua
  - número
  - bairro

#### Observação
A remoção de CEP exige ajuste no fluxo de cálculo de taxa e remoção do lookup ViaCEP.

### 5.2 Pagamento

#### Estado atual (código)
- pagamento é definido na finalização do pedido (cozinha/admin)

#### Estado alvo (produto)
- pagamento deve ser definido no momento da criação do pedido (delivery)

#### Motivação
- evitar retrabalho
- melhorar fluxo operacional
- facilitar leitura na cozinha

### 5.3 Cardápio do dia
O sistema deve caminhar para ter apenas uma fonte de verdade para o cardápio diário, preferencialmente no banco.

### 5.4 Impressão

#### Estado atual (código)
- impressão térmica via `/print/[id]`
- largura aproximada de 52mm
- layout único

#### Estado alvo (produto)
- suporte a dois modos:
  - A4 (letras grandes, ocupar página)
  - térmica (layout otimizado)
- separar layout por contexto físico

#### Observação
não é desejável um único layout para múltiplos formatos

---

## 6. Estado alvo recomendado (sem ainda virar SaaS completo)

O objetivo do estado alvo é melhorar o produto sem exigir uma reconstrução total imediata.

### 6.1 `orders` (evolução)
Manter a tabela `orders`, mas com organização mais clara.

### Campos recomendados
- `id`
- `origin`
- `table_number`
- `daily_order_number`
- `order_date`
- `order_time`
- `customer_name`
- `customer_phone`
- `customer_street`
- `customer_number`
- `customer_neighborhood`
- `delivery_ordered_at`
- `subtotal`
- `delivery_fee`
- `total`
- `payment_method`
- `payment_details`
- `status`
- `created_at`
- `updated_at`

### Observações
- `customer_cep` pode deixar de ser usado
- `customer_state`/`UF` não deve entrar como campo obrigatório do fluxo
- `customer_address` deve ser tratado como legado e removido no momento adequado

---

### 6.2 Criar `order_items`
Tabela recomendada para evolução do produto.

### Campos sugeridos
- `id`
- `order_id`
- `item_type`
- `name`
- `quantity`
- `unit_price`
- `total_price`
- `config_json`
- `created_at`

### Benefícios
- melhora relatórios
- melhora auditoria
- simplifica impressão
- prepara melhor o sistema para BI e SaaS

### Estratégia de transição
- manter `orders.items` temporariamente
- criar `order_items`
- migrar leitura aos poucos
- remover dependência total do JSON depois

---

### 6.3 Evoluir `delivery_zones`
A tabela deve continuar sendo o centro da taxa por bairro.

### Campos sugeridos
- `id`
- `neighborhood`
- `fee`
- `is_active`
- `sort_order`
- `created_at`
- `updated_at`

### Benefícios
- melhor gestão operacional
- lista de bairros organizada
- desativação sem apagar histórico

---

### 6.4 Evoluir `menu_daily`
Deve virar a fonte oficial do cardápio por dia.

### Campos sugeridos
- `id`
- `day_of_week`
- `protein_id`
- `is_active`
- `created_at`
- `updated_at`

### Regra
Toda tela operacional deve ler o cardápio diário a partir do banco, e não de dados hardcoded.

---

## 7. Migrações recomendadas por prioridade

### Prioridade alta
- documentar schema real atual
- parar de depender de CEP/UF no fluxo de delivery
- oficializar `delivery_zones` como regra de taxa por bairro
- oficializar `menu_daily` como fonte de verdade do dia
- revisar `daily_order_number`

### Prioridade média
- adicionar `order_date`
- adicionar `order_time`
- adicionar `is_active` onde o código já espera esse campo
- organizar melhor campos legados

### Prioridade estrutural
- criar `order_items`
- reduzir dependência de JSON em `orders.items`
- preparar banco para futura multi-tenantização

---

## 8. Débitos técnicos relacionados ao banco

- `orders.items` em JSON
- `daily_order_number` sem proteção concorrente
- `customer_address` legado
- taxa de entrega ambígua
- CEP obrigatório no fluxo atual (será removido)
- duplicidade de lógica do cardápio do dia

---

## 9. Decisões provisórias (produto)

### Estado atual
- CEP obrigatório no delivery
- UF opcional (não persistido)

### Estado alvo
1. CEP será removido do fluxo de delivery  
2. UF será removido do fluxo de delivery
3. Cidade será removido do fluxo de delivery  
3. o bairro permanece como base da taxa  
4. tipo de pagamento deve ser capturado na criação do pedido  
5. o sistema deve evoluir para suportar múltiplos formatos de impressão  

---

## 10. Próximos passos

1. validar este documento contra o schema real do Supabase  
2. ajustar `regras.md` para refletir estas decisões  
3. criar backlog técnico das mudanças de banco e fluxo  
4. implementar primeiro as alterações de menor risco operacional