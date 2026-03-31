# Regras de Negócio — Lá na Calçada

## 1. Objetivo deste documento

Este documento define as regras oficiais de funcionamento do produto **Lá na Calçada**.

Ele deve responder, de forma clara:

- como um pedido nasce
- como um pedido evolui
- quais dados são obrigatórios em cada fluxo
- como o delivery funciona
- como o cardápio do dia deve funcionar
- como pagamento, impressão e status devem ser tratados

Este documento deve ser atualizado sempre que houver:
- mudança de fluxo operacional
- mudança de status
- mudança de regra de cálculo
- mudança de campos obrigatórios
- mudança no comportamento do delivery, cardápio ou impressão

---

## 2. Princípios operacionais do sistema

### 2.1 O sistema deve ser simples para operação
As telas e fluxos devem reduzir atrito para quem está atendendo no restaurante.

### 2.2 O sistema deve refletir a operação real do restaurante
As regras devem seguir como o restaurante realmente trabalha, e não impor burocracia desnecessária.

### 2.3 O sistema deve ter uma única fonte de verdade por regra
Sempre que possível, cada regra deve depender de uma única fonte oficial.

Exemplos:
- taxa por bairro → `delivery_zones`
- cardápio do dia → banco de dados
- status do pedido → campo `status` oficial da ordem

### 2.4 O sistema deve preservar consistência operacional
Mesmo quando a modelagem ainda não for ideal, o fluxo não pode gerar confusão na cozinha, no balcão ou no delivery.

---

## 3. Tipos de pedido

O sistema atualmente trabalha com três contextos principais:

- balcão
- mesa
- delivery

### 3.1 Balcão
Pedido feito para atendimento direto no restaurante, sem entrega.

### 3.2 Mesa
Pedido associado a uma mesa.

### 3.3 Delivery
Pedido com entrega em endereço informado pelo cliente.

---

## 4. Ciclo de vida do pedido

## 4.1 Status oficiais
Os status operacionais atuais são:

- `pending`
- `preparing`
- `ready`
- `out_for_delivery`
- `delivered`
- `closed`
- `cancelled`

Esses status devem ser tratados como oficiais até nova revisão.

---

## 4.2 Regras do ciclo

### Ao criar um pedido
Todo pedido nasce com:

- `status = pending`

### Durante a produção
O pedido pode evoluir para:

- `preparing`
- `ready`

### Durante a entrega
Se for delivery, o pedido pode evoluir para:

- `out_for_delivery`
- `delivered`

### Finalização
O pedido é considerado encerrado quando estiver em:

- `closed`
ou
- `cancelled`

### Pedido aberto
Um pedido é considerado aberto quando **não** estiver em:

- `closed`
- `cancelled`

---

## 4.3 Regras por tipo de pedido

### Balcão
Fluxo esperado:
1. pedido criado
2. status `pending`
3. pode ir para `preparing`
4. pode ir para `ready`
5. deve ir para `closed`

### Mesa
Fluxo esperado:
1. pedido criado vinculado à mesa
2. status `pending`
3. pode ir para `preparing`
4. pode ir para `ready`
5. depois deve ser encerrado conforme fluxo operacional da mesa

### Delivery
Fluxo esperado:
1. pedido criado com dados do cliente
2. status `pending`
3. pode ir para `preparing`
4. pode ir para `ready`
5. pode ir para `out_for_delivery`
6. pode ir para `delivered`
7. deve ir para `closed`

---

## 5. Regras de criação de pedido

## 5.1 Regra geral
Todo pedido deve conter itens válidos e total calculável.

---

## 5.2 Pedido de balcão
No pedido de balcão:
- não é obrigatório informar dados de cliente
- não existe taxa de entrega
- não existe endereço de entrega

Campos mínimos esperados:
- origem do pedido
- itens
- subtotal
- total
- status

---

## 5.3 Pedido de mesa
No pedido de mesa:
- deve existir associação com o número/id da mesa
- não existe taxa de entrega
- não existe endereço de entrega

Campos mínimos esperados:
- origem do pedido
- mesa
- itens
- subtotal
- total
- status

---

## 5.4 Pedido de delivery
No pedido de delivery:
- deve existir identificação mínima do cliente
- deve existir endereço operacional mínimo
- deve existir definição de taxa ou fallback operacional
- deve existir forma de pagamento antes da confirmação

Campos obrigatórios no fluxo atual:
- nome
- telefone
- rua
- número
- bairro
- forma de pagamento

Campos que **não** devem ser exigidos no fluxo atual:
- CEP
- UF

---

## 6. Regras do formulário de delivery

## 6.1 Campos obrigatórios
O formulário de delivery deve conter:

- nome
- telefone
- rua
- número
- bairro

### Campo recomendado futuramente
- complemento

---

## 6.2 Campos removidos do fluxo
Os seguintes campos não devem fazer parte do fluxo operacional do delivery:

- CEP
- UF

### Motivo
Esses campos aumentam atrito e não representam a forma como o restaurante pensa a entrega no dia a dia.

---

## 6.3 Bairro no delivery
O bairro é um campo crítico no fluxo de delivery.

### Regra
O bairro deve continuar no formulário porque ele é a principal referência para calcular a taxa de entrega.

### Comportamento esperado
Ao selecionar o bairro:
- a taxa deve ser resolvida automaticamente, quando houver configuração
- o total do pedido deve ser recalculado
- o operador deve conseguir ver o impacto da taxa

---

## 6.4 Fallback de taxa
Se o bairro não tiver taxa definida:
- a taxa pode ficar como `null`
- o sistema deve tratar isso operacionalmente como **“a consultar”**

---

## 7. Regras de taxa de entrega

## 7.1 Fonte de verdade da taxa
A taxa por bairro deve ter como fonte principal a tabela de zonas de entrega (`delivery_zones`).

---

## 7.2 Configuração geral de delivery
Configurações gerais de delivery podem existir em `delivery_settings`, mas não devem conflitar com a taxa por bairro.

---

## 7.3 Regra oficial atual
A taxa do delivery deve ser definida assim:

1. se houver taxa configurada para o bairro → usar a taxa do bairro  
2. se não houver taxa configurada → marcar como “a consultar”

---

## 7.4 Exibição ao operador
O sistema deve exibir o bairro e a taxa de forma clara no momento da criação do pedido.

Exemplo desejado:
- Araturi — R$ 5,00
- Centro — R$ 4,00
- Outro — a consultar

---

## 8. Regras de pagamento

## 8.1 Balcão e mesa
O fluxo de pagamento pode seguir a operação existente, desde que não quebre o fechamento atual.

---

## 8.2 Delivery
No delivery, a forma de pagamento deve ser definida **antes de confirmar o pedido**.

### Motivo
Isso evita retrabalho e garante que a cozinha/operação já saibam como o pedido será pago.

### Campos esperados
- `payment_method`
- `payment_details` quando necessário

### Exemplos de `payment_method`
- dinheiro
- pix
- cartão
- pago antecipado

### Exemplos de `payment_details`
- troco para 50
- pix confirmado
- cartão na entrega

---

## 9. Regras de cardápio

## 9.1 Cardápio do dia
O sistema deve exibir apenas os itens válidos para o dia atual.

---

## 9.2 Fonte de verdade do cardápio do dia
O sistema deve evoluir para usar o banco de dados como fonte oficial do cardápio diário.

### Regra desejada
Não deve existir conflito entre:
- regras hardcoded em código
- regras configuradas no banco

### Direção oficial
A fonte oficial do cardápio do dia deve ser a estrutura persistida no banco.

---

## 9.3 Itens ativos
Itens inativos não devem aparecer para operação normal.

Isso vale para:
- proteínas
- bases
- saladas
- opcionais

---

## 9.4 Consistência entre telas
Balcão, mesa e delivery devem respeitar a mesma lógica de disponibilidade do dia, salvo regra futura explícita em contrário.

---

## 10. Regras de precificação

## 10.1 Pratinho
O preço do pratinho depende:
- do tamanho
- das proteínas selecionadas
- das regras específicas de composição

As regras atuais de cálculo existentes no código permanecem válidas até revisão formal.

---

## 10.2 Porção
As porções seguem as regras de tamanho e composição atualmente implementadas.

---

## 10.3 Itens por peso
Itens vendidos por peso devem continuar usando:
- peso informado
- preço por quilo
- separação correta no carrinho por configuração

---

## 11. Regras de impressão

## 11.1 Objetivo
A impressão deve servir bem ao contexto físico real do restaurante.

---

## 11.2 Modos de impressão
O sistema deve suportar pelo menos dois modos distintos:

- impressão A4
- impressão térmica 58mm

---

## 11.3 Regra de arquitetura para impressão
Não é desejável manter um único layout genérico tentando servir:
- A4
- PDF
- bobina térmica

Cada modo deve ter apresentação adequada ao seu contexto.

---

## 11.4 A4
A impressão em A4 deve:
- ocupar melhor a folha
- usar tipografia maior
- ter boa legibilidade
- funcionar bem ao salvar/imprimir em papel comum

---

## 11.5 Térmica 58mm
A impressão térmica deve:
- respeitar largura real da bobina
- ter margens mínimas
- usar tipografia adequada
- evitar visual minúsculo causado por layout A4 reduzido

---

## 12. Regras de WhatsApp

## 12.1 Pedido de delivery
O fluxo atual usa WhatsApp para finalizar ou comunicar o pedido.

---

## 12.2 Conteúdo da mensagem
A mensagem do pedido deve conter:
- cliente
- endereço operacional relevante
- itens
- subtotal
- taxa de entrega
- total
- pagamento, quando aplicável

---

## 12.3 Dados que não devem mais ser destacados
Como regra atual do produto:
- CEP não precisa compor o fluxo principal
- UF não precisa compor o fluxo principal

---

## 12.4 Dados de endereço relevantes
No delivery, devem ser considerados relevantes:
- rua
- número
- bairro

---

## 13. Regras de numeração diária

## 13.1 Regra atual
O sistema atualmente gera `daily_order_number` por contagem diária.

---

## 13.2 Aceitação provisória
Essa regra continua aceita provisoriamente enquanto não houver melhoria estrutural.

---

## 13.3 Restrição conhecida
A implementação atual pode gerar colisão em concorrência e deve ser tratada como débito técnico.

---

## 14. Regras da cozinha

## 14.1 Lista de pedidos
A cozinha deve visualizar pedidos abertos.

### Pedido aberto
Todo pedido com status diferente de:
- `closed`
- `cancelled`

---

## 14.2 Impressão e preparo
A mudança de status durante impressão/preparo deve respeitar o fluxo operacional e evitar saltos indevidos de estado.

---

## 14.3 Clareza operacional
A tela da cozinha deve permitir entender rapidamente:
- número do pedido
- tipo do pedido
- itens
- situação atual
- pagamento, quando relevante
- destino de entrega, quando delivery

---

## 15. Regras de legado e transição

## 15.1 Campos legados
Campos antigos podem permanecer temporariamente no banco para compatibilidade, mas novos fluxos não devem depender deles.

Exemplo:
- `customer_address`
- `customer_cep`

---

## 15.2 Transição segura
Mudanças de regra devem:
- evitar quebrar pedidos antigos
- evitar quebrar relatórios atuais
- evitar quebrar impressão atual antes do novo modelo estar pronto

---

## 16. Lista de decisões oficiais vigentes

Até segunda ordem, ficam estabelecidas as seguintes decisões:

1. o bairro permanece no fluxo de delivery  
2. CEP sai do fluxo de delivery  
3. UF sai do fluxo de delivery  
4. a taxa de entrega será definida principalmente pelo bairro  
5. quando não houver taxa definida, usar “a consultar”  
6. o pagamento do delivery deve ser informado antes da confirmação do pedido  
7. o cardápio do dia deve caminhar para ter uma única fonte de verdade no banco  
8. a impressão deve evoluir para separar modo A4 e modo térmico 58mm

---

## 17. Próximos passos

1. alinhar este documento com `docs/02-banco/banco.md`  
2. usar este documento como base para backlog técnico  
3. implementar primeiro as mudanças de menor risco e maior impacto operacional  
4. revisar este documento sempre que uma regra nova entrar em produção

## Fluxo de checkout remoto

O checkout remoto deve ocorrer em 3 etapas:

### Etapa 1 — Dados do cliente
- nome
- telefone

### Etapa 2 — Tipo de recebimento
- retirada
- entrega

Se entrega:
- rua
- número
- complemento (opcional)
- bairro

Se retirada:
- endereço não é obrigatório
- taxa de entrega não se aplica

### Etapa 3 — Fechamento
- total
- taxa de entrega, se aplicável
- forma de pagamento
- detalhes opcionais
- confirmação do pedido

## Tipo de recebimento

O sistema deve suportar:
- retirada
- entrega

Retirada não exige endereço nem taxa.
Entrega exige bairro para cálculo da taxa.

## Fulfillment do pedido

Todo pedido deve possuir um tipo de atendimento final (`fulfillment_type`):

- `pickup`
- `delivery`

### Pickup
- não possui taxa de entrega
- não exige endereço completo

### Delivery
- exige endereço operacional
- pode possuir taxa de entrega

### Compatibilidade legada
Pedidos antigos sem `fulfillment_type` podem ser interpretados por fallback com base em `origin`.