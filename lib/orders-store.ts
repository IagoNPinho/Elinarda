import type { CartItem } from "@/components/cart-provider"

export interface Order {
  id: string
  orderNumber: number
  tableNumber: number
  items: CartItem[]
  total: number
  createdAt: Date
  status: "pending" | "preparing" | "ready"
}

// Simple in-memory store for MVP (in production, use a database)
let orders: Order[] = []
let orderCounter = 1

export function addOrder(tableNumber: number, items: CartItem[], total: number): Order {
  const order: Order = {
    id: crypto.randomUUID(),
    orderNumber: orderCounter++,
    tableNumber,
    items,
    total,
    createdAt: new Date(),
    status: "pending",
  }
  orders.push(order)
  return order
}

export function getOrders(): Order[] {
  return [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function updateOrderStatus(id: string, status: Order["status"]): void {
  const order = orders.find((o) => o.id === id)
  if (order) {
    order.status = status
  }
}

export function removeOrder(id: string): void {
  orders = orders.filter((o) => o.id !== id)
}
