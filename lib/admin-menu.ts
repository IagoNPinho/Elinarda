import { supabase } from "@/lib/supabase"

export type ProteinType =
  | "chicken"
  | "meat"
  | "ground_meat"
  | "shrimp"
  | "lasagna"

export interface AdminProtein {
  id: string
  name: string
  type: ProteinType
  price_p: number
  price_g: number
  is_active: boolean
}

export interface AdminBase {
  id: string
  name: string
  is_active: boolean
}

export interface AdminSalad {
  id: string
  name: string
  is_active: boolean
}

export interface AdminOptional {
  id: string
  name: string
  price: number
  is_active: boolean
}

export interface DailyMenuRow {
  id: string
  day_of_week: number
  protein_id: string
  is_active: boolean
}

export async function fetchProteins(): Promise<AdminProtein[]> {
  const { data, error } = await supabase
    .from("menu_proteins")
    .select("*")
    .order("name", { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createProtein(payload: Omit<AdminProtein, "id">) {
  const { error } = await supabase
    .from("menu_proteins")
    .insert(payload)
  if (error) throw error
}

export async function updateProtein(
  id: string,
  payload: Partial<Omit<AdminProtein, "id">>,
) {
  const { error } = await supabase
    .from("menu_proteins")
    .update(payload)
    .eq("id", id)
  if (error) throw error
}

export async function toggleProteinActive(id: string, active: boolean) {
  await updateProtein(id, { is_active: active })
}

export async function fetchBases(): Promise<AdminBase[]> {
  const { data, error } = await supabase
    .from("menu_bases")
    .select("*")
    .order("name", { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createBase(payload: Omit<AdminBase, "id">) {
  const { error } = await supabase.from("menu_bases").insert(payload)
  if (error) throw error
}

export async function updateBase(
  id: string,
  payload: Partial<Omit<AdminBase, "id">>,
) {
  const { error } = await supabase
    .from("menu_bases")
    .update(payload)
    .eq("id", id)
  if (error) throw error
}

export async function fetchSalads(): Promise<AdminSalad[]> {
  const { data, error } = await supabase
    .from("menu_salads")
    .select("*")
    .order("name", { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createSalad(payload: Omit<AdminSalad, "id">) {
  const { error } = await supabase.from("menu_salads").insert(payload)
  if (error) throw error
}

export async function updateSalad(
  id: string,
  payload: Partial<Omit<AdminSalad, "id">>,
) {
  const { error } = await supabase
    .from("menu_salads")
    .update(payload)
    .eq("id", id)
  if (error) throw error
}

export async function fetchOptionals(): Promise<AdminOptional[]> {
  const { data, error } = await supabase
    .from("menu_optionals")
    .select("*")
    .order("name", { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createOptional(payload: Omit<AdminOptional, "id">) {
  const { error } = await supabase.from("menu_optionals").insert(payload)
  if (error) throw error
}

export async function updateOptional(
  id: string,
  payload: Partial<Omit<AdminOptional, "id">>,
) {
  const { error } = await supabase
    .from("menu_optionals")
    .update(payload)
    .eq("id", id)
  if (error) throw error
}

export async function fetchDailyMenu(): Promise<DailyMenuRow[]> {
  const { data, error } = await supabase
    .from("menu_daily")
    .select("*")
  if (error) throw error
  return data ?? []
}

export async function upsertDailyMenu(
  dayOfWeek: number,
  proteinId: string,
  active: boolean,
) {
  const { data, error } = await supabase
    .from("menu_daily")
    .select("id")
    .eq("day_of_week", dayOfWeek)
    .eq("protein_id", proteinId)
    .maybeSingle()

  if (error) throw error

  if (data?.id) {
    const { error: updateError } = await supabase
      .from("menu_daily")
      .update({ is_active: active })
      .eq("id", data.id)
    if (updateError) throw updateError
    return
  }

  const { error: insertError } = await supabase.from("menu_daily").insert({
    day_of_week: dayOfWeek,
    protein_id: proteinId,
    is_active: active,
  })
  if (insertError) throw insertError
}
