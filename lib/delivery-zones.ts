import { supabase } from "@/lib/supabase"

export interface DeliveryZone {
  id: string
  neighborhood: string
  fee: number
}

export async function fetchDeliveryZones(): Promise<DeliveryZone[]> {
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("*")
    .order("neighborhood", { ascending: true })

  if (error) throw error
  return data ?? []
}
