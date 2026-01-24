import { supabase } from "@/lib/supabase"

export interface DeliverySettings {
  id: string
  is_open: boolean
  delivery_fee: number
}

export async function fetchDeliverySettings(): Promise<DeliverySettings> {
  const { data, error } = await supabase
    .from("delivery_settings")
    .select("*")
    .single()

  if (error) throw error
  return data
}

export async function updateDeliverySettings(
  payload: Partial<Pick<DeliverySettings, "is_open" | "delivery_fee">>
) {
  const { error } = await supabase
    .from("delivery_settings")
    .update(payload)
    .neq("id", "") // garante update global

  if (error) throw error
}
