import { supabase } from "@/lib/supabase"

export type ProteinType =
  | "chicken"
  | "meat"
  | "ground_meat"
  | "shrimp"
  | "lasagna"

export interface MenuProtein {
  id: string
  name: string
  type: ProteinType
  price_p: number
  price_g: number
  is_lasagna?: boolean | null
  is_active?: boolean | null
}

export interface MenuBase {
  id: string
  name: string
  is_active?: boolean | null
}

export interface MenuSalad {
  id: string
  name: string
  is_active?: boolean | null
}

export interface MenuOptional {
  id: string
  name: string
  price: number
  is_active?: boolean | null
}

export interface MenuComponents {
  proteins: MenuProtein[]
  bases: MenuBase[]
  salads: MenuSalad[]
  optionals: MenuOptional[]
}

let cachedComponents: MenuComponents | null = null
let inflight: Promise<MenuComponents> | null = null
let dailyCache: Record<number, string[]> | null = null
let dailyInflight: Promise<Record<number, string[]>> | null = null

export async function fetchMenuComponents(): Promise<MenuComponents> {
  if (cachedComponents) return cachedComponents
  if (inflight) return inflight

  inflight = (async () => {
    const [proteinsRes, basesRes, saladsRes, optionalsRes] =
      await Promise.all([
        supabase
          .from("menu_proteins")
          .select("*")
          .eq("is_active", true)
          .order("name", { ascending: true }),
        supabase
          .from("menu_bases")
          .select("*")
          .eq("is_active", true)
          .order("name", { ascending: true }),
        supabase
          .from("menu_salads")
          .select("*")
          .eq("is_active", true)
          .order("name", { ascending: true }),
        supabase
          .from("menu_optionals")
          .select("*")
          .eq("is_active", true)
          .order("name", { ascending: true }),
      ])

    if (proteinsRes.error) throw proteinsRes.error
    if (basesRes.error) throw basesRes.error
    if (saladsRes.error) throw saladsRes.error
    if (optionalsRes.error) throw optionalsRes.error

    const data: MenuComponents = {
      proteins: proteinsRes.data ?? [],
      bases: basesRes.data ?? [],
      salads: saladsRes.data ?? [],
      optionals: optionalsRes.data ?? [],
    }

    cachedComponents = data
    inflight = null
    return data
  })()

  return inflight
}

export async function fetchDailyMenuMap(): Promise<Record<number, string[]>> {
  if (dailyCache) return dailyCache
  if (dailyInflight) return dailyInflight

  dailyInflight = (async () => {
    const { data, error } = await supabase
      .from("menu_item_daily")
      .select("day_of_week, item_id")
      .eq("item_type", "protein")
      .eq("is_active", true)

    if (error) throw error

    const map: Record<number, string[]> = {}
    ;(data ?? []).forEach((row: any) => {
      if (!map[row.day_of_week]) map[row.day_of_week] = []
      map[row.day_of_week].push(row.item_id)
    })

    dailyCache = map
    dailyInflight = null
    return map
  })()

  return dailyInflight
}

export async function fetchDailyProteinIds(dayOfWeek: number) {
  const map = await fetchDailyMenuMap()
  return map[dayOfWeek] ?? []
}

export function invalidateMenuComponents() {
  cachedComponents = null
  inflight = null
}

export function invalidateMenuDaily() {
  dailyCache = null
  dailyInflight = null
}
