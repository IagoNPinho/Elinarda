import { supabase } from "@/lib/supabase"

export interface DeliverySettings {
  id: string
  is_open: boolean
  delivery_fee: number
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
  payload: Partial<Pick<DeliverySettings, "is_open" | "delivery_fee">> & {
    id: string
  }
) {
  const { error } = await supabase
    .from("delivery_settings")
    .update({
      is_open: payload.is_open,
      delivery_fee: payload.delivery_fee,
    })
    .eq("id", payload.id)

  if (error) throw error
}
