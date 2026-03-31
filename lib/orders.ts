import { supabase } from "@/lib/supabase"

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "closed"
  | "cancelled"

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
  base?: string
  salad?: string
  optional?: string[]
  proteins?: { name: string; type: string }[]
  options?: string[]
}

export interface Order {
  id: string
  origin: "mesa" | "balcao" | "delivery"
  fulfillment_type?: "pickup" | "delivery" | null
  table_number?: number | null
  daily_order_number?: number | null

  customer_name?: string | null
  customer_phone?: string | null
  customer_street?: string | null
  customer_number?: string | null
  customer_neighborhood?: string | null
  customer_cep?: string | null
  delivery_ordered_at?: string | null

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
  fulfillmentType,
  tableNumber,
  customerName,
  customerPhone,
  customerStreet,
  customerNumber,
  customerNeighborhood,
  customerCep,
  paymentMethod,
  paymentDetails,
  items,
  subtotal,
  deliveryFee = 0,
}: {
  origin: "mesa" | "balcao" | "delivery"
  fulfillmentType?: "pickup" | "delivery"
  tableNumber?: number
  customerName?: string
  customerPhone?: string
  customerStreet?: string
  customerNumber?: string
  customerNeighborhood?: string
  customerCep?: string
  paymentMethod?: PaymentMethod
  paymentDetails?: string
  items: any[]
  subtotal: number
  deliveryFee?: number | null
}) {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { count, error: countError } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .gte("created_at", todayStart.toISOString())

  if (countError) throw countError
  const dailyOrderNumber = (count ?? 0) + 1

  const deliveryOrderedAt =
    origin === "delivery" ? new Date().toISOString() : null

  const resolvedFulfillmentType =
    fulfillmentType ?? (origin === "delivery" ? "delivery" : "pickup")

  const total = subtotal + (deliveryFee ?? 0)

  console.log("Criando pedido no banco", {paymentMethod})
  
  const { error } = await supabase.from("orders").insert({
    origin,
    fulfillment_type: resolvedFulfillmentType,
    table_number: origin === "mesa" ? tableNumber : null,
    daily_order_number: dailyOrderNumber,

    customer_name: customerName ?? null,
    customer_phone: customerPhone ?? null,

    customer_street: customerStreet ?? null,
    customer_number: customerNumber ?? null,
    customer_neighborhood: customerNeighborhood ?? null,
    customer_cep: customerCep ?? null,
    delivery_ordered_at: deliveryOrderedAt,

    // manter por compatibilidade (derivado)
    customer_address:
      origin === "delivery" && customerStreet
        ? `${customerStreet}, ${customerNumber} - ${customerNeighborhood} | CEP ${customerCep}`
        : null,

    status: "pending",
    items,
    subtotal,
    delivery_fee: deliveryFee ?? null,
    total,
    payment_method: paymentMethod ?? null,
    payment_details: paymentDetails ?? null,
  })

  console.log("aqui")

  if (error) throw error
}


export async function fetchOpenOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .not("status", "in", '("closed","cancelled")')
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
    | "cancelled"
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

export async function cancelOrder(id: string) {
  const { error } = await supabase
    .from("orders")
    .update({
      status: "cancelled",
      payment_method: null,
      payment_details: null,
    })
    .eq("id", id)

  if (error) {
    console.error("Erro ao cancelar pedido:", error)
    throw error
  }
}

