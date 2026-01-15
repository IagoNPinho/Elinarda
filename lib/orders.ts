import { supabase } from "@/lib/supabase"

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
    table_number: tableNumber,
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_address: customerAddress,
    status: "aberto",
    items,
    subtotal,
    delivery_fee: deliveryFee,
    total,
  })

  if (error) throw error
}

export async function fetchOpenOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .neq("status", "finalizado")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)

  if (error) throw error
}
