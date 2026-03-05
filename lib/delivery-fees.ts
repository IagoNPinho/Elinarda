import { supabase } from "@/lib/supabase"

export interface DeliveryFee {
  id: string
  neighborhood: string
  fee: number
}

export async function fetchDeliveryFees(): Promise<DeliveryFee[]> {
  // usando delivery_zones (tabela atual no banco)
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("*")
    .order("neighborhood", { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function fetchDeliveryFeeByNeighborhood(
  neighborhood: string,
): Promise<number | null> {
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("fee")
    .eq("neighborhood", neighborhood)
    .single()

  if (error) return null
  return data?.fee ?? null
}
