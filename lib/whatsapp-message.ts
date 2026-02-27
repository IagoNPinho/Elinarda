// lib/whatsapp-message.ts

import type { CartItem } from "@/components/cart-provider"
import type { Order } from "@/lib/orders"

const RESTAURANT_WHATSAPP = "558587147033"

interface WhatsAppOrderPayload {
    customer: {
        name: string
        phone: string
        street: string
        number: string
        neighborhood: string
        cep: string
    }
    items: CartItem[]
    subtotal: number
    deliveryFee: number
    total: number
}

export function generateWhatsAppMessage({
    customer,
    items,
    subtotal,
    deliveryFee,
    total,
}: WhatsAppOrderPayload) {
    const itemsText = items
        .map((item) =>
            item.weightInGrams
                ? `- ${item.name} (${item.weightInGrams}g) — R$ ${(item.price * item.quantity)
                    .toFixed(2)
                    .replace(".", ",")}`
                : `- ${item.quantity}x ${item.name} (${item.sizeLabel}) — R$ ${(item.price * item.quantity)
                    .toFixed(2)
                    .replace(".", ",")}`
        )
        .join("\n")

    return `
*NOVO PEDIDO - DELIVERY*

*Cliente:* ${customer.name}
*Telefone:* ${customer.phone}
*Rua:* ${customer.street}, Nº ${customer.number}
*Bairro:* ${customer.neighborhood}
*CEP:* ${customer.cep}

*Itens do Pedido:*
${itemsText}

*Subtotal:* R$ ${subtotal.toFixed(2).replace(".", ",")}
*Taxa de Entrega:* R$ ${deliveryFee.toFixed(2).replace(".", ",")}
*Total:* R$ ${total.toFixed(2).replace(".", ",")}

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
Olá!  
Seu pedido *#${order.id.slice(0, 6)}* está com o status:

*${statusMessage[order.status]}*

Qualquer dúvida, estamos à disposição.
`.trim()

    const encoded = encodeURIComponent(message)
    const phone = order.customer_phone.replace(/\D/g, "")
    const url = `https://wa.me/${phone}?text=${encoded}`

    window.open(url, "_blank")
}
