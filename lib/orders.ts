import { supabase } from "@/lib/supabase"

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "closed"

export type PaymentMethod =
  | "dinheiro"
  | "pix"
  | "credito"
  | "debito"

export interface OrderItem {
  id: string
  itemId: string
  name: string
  size: string
  sizeLabel: string
  price: number
  quantity: number
  weightInGrams?: number
}

export interface Order {
  id: string
  origin: "mesa" | "balcao" | "delivery"
  table_number?: number | null

  customer_name?: string | null
  customer_phone?: string | null
  customer_address?: string | null

  items: OrderItem[]

  subtotal: number
  delivery_fee?: number | null
  total: number

  payment_method?: PaymentMethod | null
  payment_details?: string | null

  status: OrderStatus
  created_at: string
}

export async function createOrderInDB({
  origin,
  tableNumber,
  customerName,
  customerPhone,
  customerAddress,
  items,
  subtotal,
  deliveryFee = 0,
}: {
  origin: "mesa" | "balcao" | "delivery"
  tableNumber?: number
  customerName?: string
  customerPhone?: string
  customerAddress?: string
  items: any[]
  subtotal: number
  deliveryFee?: number
}) {
  const total = subtotal + deliveryFee

  const { error } = await supabase.from("orders").insert({
    origin,
    table_number: origin === "mesa" ? tableNumber : null,
    customer_name: customerName ?? null,
    customer_phone: customerPhone ?? null,
    customer_address: customerAddress ?? null,
    status: "pending",
    items,
    subtotal,
    delivery_fee: deliveryFee,
    total,
  })


  if (error) throw error
}

export async function fetchOpenOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .neq("status", "closed")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function fetchOrderById(
  id: string
): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data
}

export async function updateOrderStatus(
  id: string,
  status:
    | "pending"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "closed"
) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)

  if (error) throw error
}

export async function closeOrder({
  id,
  paymentMethod,
  paymentDetails,
}: {
  id: string
  paymentMethod: PaymentMethod
  paymentDetails?: string
}) {
  const { error } = await supabase
    .from("orders")
    .update({
      status: "closed",
      payment_method: paymentMethod,
      payment_details: paymentDetails ?? null,
    })
    .eq("id", id)

  if (error) {
    console.error("Erro ao fechar pedido:", error)
    throw error
  }
}
