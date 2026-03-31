// lib/whatsapp-message.ts

import type { CartItem } from "@/components/cart-provider"
import type { Order } from "@/lib/orders"

const RESTAURANT_WHATSAPP = "558587147033"

interface WhatsAppOrderPayload {
    fulfillmentType: "pickup" | "delivery"
    customer: {
        name: string
        phone: string
        street?: string
        number?: string
        neighborhood?: string
    }
    items: CartItem[]
    subtotal: number
    deliveryFee: number | null
    total: number
    paymentMethod?: Order["payment_method"] | null
    paymentDetails?: string | null
}

export function generateWhatsAppMessage({
    fulfillmentType,
    customer,
    items,
    subtotal,
    deliveryFee,
    total,
    paymentMethod,
    paymentDetails,
}: WhatsAppOrderPayload) {
    const itemsText = items
        .map((item) => {
            const line = item.weightInGrams
                ? `- ${item.name} (${item.weightInGrams}g)`
                : `- ${item.quantity}x ${item.name} ${item.sizeLabel}`

            const details: string[] = []

            if (item.base) details.push(`${item.base}`)
            if (item.salad) details.push(`${item.salad}`)
            if (item.optional && item.optional.length > 0) {
                details.push(`${item.optional.join(", ")}`)
            }
            if (item.proteins && item.proteins.length > 0) {
                details.push(`${item.proteins.map((p) => p.name).join(", ")}`)
            }
            if (item.options && item.options.length > 0) {
                details.push(`${item.options.join(", ")}`)
            }

            return details.length
                ? `${line}\n${details.map((d) => `  ${d}`).join("\n")}`
                : line
        })
        .join("\n")

    const deliveryFeeText =
        deliveryFee == null
            ? "a consultar"
            : `R$ ${deliveryFee.toFixed(2).replace(".", ",")}`

    const paymentLabel = paymentMethod
        ? paymentMethod.toUpperCase()
        : "NAO INFORMADO"

    const paymentDetailsText =
        paymentDetails && paymentDetails.trim().length > 0
            ? paymentDetails
            : "-"

    const title =
        fulfillmentType === "delivery"
            ? "NOVO PEDIDO - DELIVERY"
            : "NOVO PEDIDO - RETIRADA"

    const addressText =
        fulfillmentType === "delivery"
            ? `
*Rua:* ${customer.street ?? "-"}, No ${customer.number ?? "-"}
*Bairro:* ${customer.neighborhood ?? "-"}
`
            : ""

    return `
*${title}*

*Cliente:* ${customer.name}
*Telefone:* ${customer.phone}
${addressText}
*Itens do Pedido:*
${itemsText}

*Subtotal:* R$ ${subtotal.toFixed(2).replace(".", ",")}
${fulfillmentType === "delivery" ? `*Taxa de Entrega:* ${deliveryFeeText}
` : ""}*Total:* R$ ${total.toFixed(2).replace(".", ",")}
*Pagamento:* ${paymentLabel}
*Detalhes:* ${paymentDetailsText}

Pedido realizado pelo sistema
`.trim()
}

export function openWhatsAppOrder(message: string) {
    const encoded = encodeURIComponent(message)
    const url = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encoded}`
    window.open(url, "_blank")
}


// Status messages for orders
const statusMessage: Record<Order["status"], string> = {
    pending: "Aguardando preparo",
    preparing: "Em preparo",
    ready: "Pronto",
    out_for_delivery: "Saiu para entrega",
    delivered: "Entregue",
    closed: "Finalizado",
    cancelled: "Cancelado",
}

// Function para abrir o wpp do cliente com status do pedido
export function openWhatsAppWithOrderStatus(order: Order) {
    if (!order.customer_phone) return

    const message = `
Ola!  
Seu pedido *#${order.id.slice(0, 6)}* esta com o status:

*${statusMessage[order.status]}*

Qualquer duvida, estamos a disposicao.
`.trim()

    const encoded = encodeURIComponent(message)
    const phone = order.customer_phone.replace(/\D/g, "")
    const url = `https://wa.me/${phone}?text=${encoded}`

    window.open(url, "_blank")
}
