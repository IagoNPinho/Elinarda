"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { fetchOrderById } from "@/lib/orders"
import type { Order } from "@/lib/orders"

const originLabel: Record<Order["origin"], string> = {
  mesa: "Mesa",
  balcao: "Balcão",
  delivery: "Delivery",
}

const paymentLabel: Record<string, string> = {
  dinheiro: "Dinheiro",
  pix: "PIX",
  credito: "Crédito",
  debito: "Débito",
}

const fmt = (value: number) =>
  `R$ ${value.toFixed(2).replace(".", ",")}`

function ReceiptContent({ order, formattedDate }: { order: Order; formattedDate: string }) {
  const fulfillmentType: "pickup" | "delivery" =
    (order.fulfillment_type as "pickup" | "delivery") ??
    (order.origin === "delivery" ? "delivery" : "pickup")

  const isDelivery = fulfillmentType === "delivery"

  const deliveryFeeText =
    order.delivery_fee == null
      ? "a consultar"
      : fmt(order.delivery_fee)

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="receipt">
      <div className="c bold receipt-title">Lá na Calçada - Restaurante</div>
      <div className="divider solid" />

      <div className="mt">
        <div className="receipt-order-num">Pedido: #{order.daily_order_number ?? order.id.slice(0, 6)}</div>
        <div>Data: {formattedDate}</div>
        <div>
          Origem: {originLabel[order.origin]}
          {order.origin === "mesa" && order.table_number ? ` ${order.table_number}` : ""}
        </div>
        <div>Tipo: {isDelivery ? "Entrega" : "Retirada"}</div>
        <div>Total de itens: {totalItems}</div>
      </div>

      {isDelivery && (
        <div className="mt">
          <div className="divider" />
          <div className="bold">CLIENTE</div>
          <div>{order.customer_name}</div>
          {order.customer_street && (
            <div>
              {order.customer_street}, {order.customer_number}
            </div>
          )}
          {order.customer_neighborhood && (
            <div>
              {order.customer_neighborhood}
              {order.customer_cep ? ` - ${order.customer_cep}` : ""}
            </div>
          )}
          {order.delivery_ordered_at && (
            <div>
              Pedido: {new Date(order.delivery_ordered_at).toLocaleString("pt-BR")}
            </div>
          )}
        </div>
      )}

      <div className="mt">
        <div className="divider" />
        <div className="bold">ITENS</div>
        {order.items.map((item, idx) => (
          <div key={idx}>
            {idx > 0 && <div className="divider dashed" />}
            <div className="row">
              <span className="item-name">
                {item.quantity}x {item.name}
                {item.sizeLabel ? ` ${item.sizeLabel}` : ""}
                {item.weightInGrams ? ` ${item.weightInGrams}g` : ""}
              </span>
              <span className="item-price">{fmt(item.price * item.quantity)}</span>
            </div>
            {item.base && <div className="detail">Base: {item.base}</div>}
            {item.salad && <div className="detail">Salada: {item.salad}</div>}
            {item.optional && item.optional.length > 0 && (
              <div className="detail">Opcionais: {item.optional.join(", ")}</div>
            )}
            {item.proteins && item.proteins.length > 0 && (
              <div className="detail">
                Proteínas: {item.proteins.map((p) => p.name).join(", ")}
              </div>
            )}
            {item.options && item.options.length > 0 && (
              <div className="detail">Opções: {item.options.join(", ")}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt">
        <div className="divider" />
        <div className="row">
          <span>Subtotal</span>
          <span>{fmt(order.subtotal)}</span>
        </div>
        {isDelivery && (
          <div className="row">
            <span>Taxa de entrega</span>
            <span>{deliveryFeeText}</span>
          </div>
        )}
        <div className="row bold receipt-grand-total">
          <span>TOTAL</span>
          <span>{fmt(order.total)}</span>
        </div>
      </div>

      {order.payment_method && (
        <div className="mt">
          <div className="divider" />
          <div className="row">
            <span>Pagamento</span>
            <span>{paymentLabel[order.payment_method] ?? order.payment_method}</span>
          </div>
          {order.payment_details && (
            <div className="detail">Obs: {order.payment_details}</div>
          )}
        </div>
      )}

      <div className="mt">
        <div className="divider solid" />
        <div className="c">Obrigado pela preferência!</div>
      </div>
    </div>
  )
}

export default function PrintOrderPage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const formattedDate = useMemo(() => {
    if (!order?.created_at) return ""
    return new Date(order.created_at).toLocaleString("pt-BR")
  }, [order?.created_at])

  useEffect(() => {
    if (!id) return
    fetchOrderById(id as string).then((data) => {
      setOrder(data)
      setLoading(false)
      if (data) {
        setTimeout(() => window.print(), 300)
      }
    })
  }, [id])

  if (loading) {
    return (
      <main className="p-4 text-center text-sm text-muted-foreground">
        Carregando...
      </main>
    )
  }

  if (!order) {
    return (
      <main className="p-4 text-center text-sm">
        <p>Pedido não encontrado.</p>
        <button
          className="no-print mt-3 rounded border px-3 py-1 text-xs"
          onClick={() => router.back()}
        >
          Voltar
        </button>
      </main>
    )
  }

  return (
    <main className="print-root">
      <div className="no-print flex gap-2 pb-4">
        <button
          className="rounded border px-3 py-1 text-xs"
          onClick={() => window.print()}
        >
          Imprimir
        </button>
        <button
          className="rounded border px-3 py-1 text-xs"
          onClick={() => window.close()}
        >
          Fechar
        </button>
      </div>

      <ReceiptContent order={order} formattedDate={formattedDate} />

      <div className="cut-line">✂</div>

      <ReceiptContent order={order} formattedDate={formattedDate} />

      <style>{`
        * { box-sizing: border-box; }
        .print-root {
          padding: 6px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 14px;
          line-height: 1.45;
          color: #000;
        }
        .receipt {
          width: 52mm;
        }
        .c { text-align: center; }
        .bold { font-weight: bold; }
        .mt { margin-top: 6px; }
        .row {
          display: flex;
          justify-content: space-between;
          gap: 4px;
          width: 100%;
        }
        .item-name {
          flex: 1;
          min-width: 0;
          word-break: break-word;
        }
        .item-price {
          white-space: nowrap;
          flex-shrink: 0;
        }
        .detail {
          padding-left: 6px;
          font-size: 12px;
        }
        .divider {
          border: none;
          border-top: 1px dashed #000;
          margin: 4px 0;
          width: 100%;
        }
        .divider.solid {
          border-top-style: solid;
        }
        .cut-line {
          width: 52mm;
          text-align: center;
          margin: 10px 0;
          font-size: 13px;
          border-top: 1px dashed #000;
          padding-top: 6px;
        }
        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm 10mm;
          }
          html, body {
            width: 100%;
            margin: 0;
            padding: 0;
            font-family: 'Courier New', Courier, monospace;
            font-size: 18pt;
            line-height: 1.6;
            color: #000;
            background: #fff;
          }
          .no-print {
            display: none !important;
          }
          .print-root {
            width: 100%;
            padding: 0;
            background: none;
            box-shadow: none;
          }
          .receipt {
            width: 100%;
            max-width: 180mm;
            margin: 0 auto;
            padding: 0 10mm;
            font-size: 18pt;
            line-height: 1.6;
            background: none;
            box-shadow: none;
          }
          .receipt-title {
            font-size: 28pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 4mm;
          }
          .receipt-order-num {
            font-size: 22pt;
            font-weight: bold;
          }
          .mt {
            margin-top: 5mm;
          }
          .divider {
            border-top: 2px dashed #000;
            margin: 4mm 0;
          }
          .divider.solid {
            border-top-style: solid;
            border-top-width: 2px;
          }
          .detail {
            font-size: 16pt;
            padding-left: 4mm;
          }
          .row {
            font-size: 20pt;
          }
          .receipt-grand-total {
            font-size: 22pt;
            font-weight: bold;
            margin-top: 2mm;
          }
          .cut-line {
            width: 100%;
            max-width: 180mm;
            margin: 8mm auto;
            font-size: 16pt;
            border-top: 2px dashed #000;
            padding-top: 4mm;
          }
        }
      `}</style>
    </main>
  )
}
