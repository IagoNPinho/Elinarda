import { supabase } from "@/lib/supabase"

export interface DeliverySettings {
  id: string
  is_open: boolean
  delivery_fee: number
  delivery_open_time?: string | null
  delivery_close_time?: string | null
}

export async function fetchDeliverySettings(): Promise<DeliverySettings> {
  console.log("Buscando no banco de dados")
  const { data, error } = await supabase
    .from("delivery_settings")
    .select("*")
    .single()

  if (error) throw error

  console.log("Encontrado!")
  console.log(data)
  return data
}

export async function updateDeliverySettings(
  payload: Partial<Pick<DeliverySettings, "is_open" | "delivery_fee" | "delivery_open_time" | "delivery_close_time">> & {
    id: string
  }
) {
  const { error } = await supabase
    .from("delivery_settings")
    .update({
      is_open: payload.is_open,
      delivery_fee: payload.delivery_fee,
      delivery_open_time: payload.delivery_open_time,
      delivery_close_time: payload.delivery_close_time,
    })
    .eq("id", payload.id)

  if (error) throw error
}
