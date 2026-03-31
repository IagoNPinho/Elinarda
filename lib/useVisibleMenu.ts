"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { MenuItem } from "@/lib/menu-data"

type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

const DAY_LABELS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const

const PREFERRED_CATEGORY_ORDER = [
  "Pratinhos",
  "Porções",
  "Sobremesas",
  "Copos 500 ml",
  "Jarra 1L",
  "Refrigerantes",
]

function todayDayIndex(): DayIndex {
  return new Date().getDay() as DayIndex
}

function singleSizeU(price: number) {
  return [{ size: "U" as const, label: "Único", price }]
}

export function useVisibleMenu() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [desserts, setDesserts] = useState<MenuItem[]>([])
  const [glasses, setGlasses] = useState<MenuItem[]>([])
  const [jars, setJars] = useState<MenuItem[]>([])
  const [refrigerantes, setRefrigerantes] = useState<MenuItem[]>([])
  const [weightPortions, setWeightPortions] = useState<MenuItem[]>([])
  const [hasSizePortions, setHasSizePortions] = useState(false)
  const [hasDailyProteins, setHasDailyProteins] = useState(true)
  const [hasDailyPortions, setHasDailyPortions] = useState(true)

  const dayIndex = useMemo(() => todayDayIndex(), [])
  const dayLabel = DAY_LABELS[dayIndex]

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const [portionDailyRes, proteinDailyRes] = await Promise.all([
          supabase
            .from("menu_item_daily")
            .select("item_id")
            .eq("item_type", "portion")
            .eq("day_of_week", dayIndex)
            .eq("is_active", true),
          supabase
            .from("menu_item_daily")
            .select("item_id")
            .eq("item_type", "protein")
            .eq("day_of_week", dayIndex)
            .eq("is_active", true),
        ])

        if (portionDailyRes.error) throw portionDailyRes.error
        if (proteinDailyRes.error) throw proteinDailyRes.error

        const portionIds = (portionDailyRes.data ?? []).map((r: any) => r.item_id)
        const proteinIds = (proteinDailyRes.data ?? []).map((r: any) => r.item_id)
        const portionsPromise =
          portionIds.length > 0
            ? supabase
                .from("menu_portions")
                .select("*")
                .in("id", portionIds)
                .eq("is_active", true)
                .order("name", { ascending: true })
            : Promise.resolve({ data: [], error: null } as any)

        const [dessertsRes, glassesRes, jarsRes, refrigerantesRes, portionsRes] =
          await Promise.all([
            supabase
              .from("menu_desserts")
              .select("*")
              .eq("is_active", true)
              .order("name", { ascending: true }),
            supabase
              .from("menu_glasses")
              .select("*")
              .eq("is_active", true)
              .order("name", { ascending: true }),
            supabase
              .from("menu_jars")
              .select("*")
              .eq("is_active", true)
              .order("name", { ascending: true }),
            supabase
              .from("menu_refrigerantes")
              .select("*")
              .eq("is_active", true)
              .order("name", { ascending: true }),
            portionsPromise,
          ])

        if (dessertsRes.error) throw dessertsRes.error
        if (glassesRes.error) throw glassesRes.error
        if (jarsRes.error) throw jarsRes.error
        if (refrigerantesRes.error) throw refrigerantesRes.error
        if (portionsRes.error) throw portionsRes.error

        const dessertsItems: MenuItem[] = (dessertsRes.data ?? []).map(
          (row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description ?? row.name,
            sizes: singleSizeU(Number(row.price ?? 0)),
            category: "Sobremesas",
            soldByWeight: false,
            kind: "standard",
          }),
        )

        const glassesItems: MenuItem[] = (glassesRes.data ?? []).map(
          (row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description ?? row.name,
            sizes: singleSizeU(Number(row.price ?? 0)),
            category: "Copos 500 ml",
            soldByWeight: false,
            kind: "standard",
          }),
        )

        const jarsItems: MenuItem[] = (jarsRes.data ?? []).map((row: any) => ({
          id: row.id,
          name: row.name,
          description: row.description ?? row.name,
          sizes: singleSizeU(Number(row.price ?? 0)),
          category: "Jarra 1L",
          soldByWeight: false,
          kind: "standard",
        }))

        const refrigerantesItems: MenuItem[] = (refrigerantesRes.data ?? []).map(
          (row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description ?? row.name,
            sizes: singleSizeU(Number(row.price ?? 0)),
            category: "Refrigerantes",
            soldByWeight: false,
            kind: "standard",
          }),
        )

        const portions = portionsRes.data ?? []
        const sizePortions = portions.filter((p: any) => p.pricing_mode === "size")
        const weightPortionsData = portions.filter(
          (p: any) => p.pricing_mode === "weight",
        )

        const weightPortionItems: MenuItem[] = weightPortionsData.map(
          (row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description ?? row.name,
            sizes: [{ size: "U", label: "Por grama", price: 0 }],
            category: "Porções",
            soldByWeight: true,
            pricePerKg: Number(row.price_per_kg ?? 0),
            kind: "standard",
          }),
        )

        if (!mounted) return
        setDesserts(dessertsItems)
        setGlasses(glassesItems)
        setJars(jarsItems)
        setRefrigerantes(refrigerantesItems)
        setWeightPortions(weightPortionItems)
        setHasSizePortions(sizePortions.length > 0)
        setHasDailyPortions(portionIds.length > 0)
        setHasDailyProteins(proteinIds.length > 0)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message ?? "Falha ao carregar cardápio")
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [dayIndex])

  const menu: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = []

    items.push({
      id: "pratinho",
      name: "Pratinho",
      description: "Monte seu pratinho com base, salada e proteínas",
      sizes: [
        { size: "P", label: "P", price: 0 },
        { size: "G", label: "G", price: 0 },
      ],
      category: "Pratinhos",
      kind: "pratinho",
    })

    if (hasSizePortions) {
      items.push({
        id: "porcao-builder",
        name: "Porções",
        description: "Escolha 1 ou 2 opções",
        sizes: [
          { size: "P", label: "P", price: 0 },
          { size: "G", label: "G", price: 0 },
        ],
        category: "Porções",
        kind: "porcao",
      })
    }

    items.push(...weightPortions)
    items.push(...desserts)
    items.push(...glasses)
    items.push(...jars)
    items.push(...refrigerantes)

    return items
  }, [desserts, glasses, hasSizePortions, jars, refrigerantes, weightPortions])

  const categories = useMemo(() => {
    const present = new Set(menu.map((m) => m.category))
    return [
      ...PREFERRED_CATEGORY_ORDER.filter((c) => present.has(c)),
      ...Array.from(present).filter((c) => !PREFERRED_CATEGORY_ORDER.includes(c)),
    ]
  }, [menu])

  const closedToday = !hasDailyProteins && !hasDailyPortions

  return {
    loading,
    error,
    dayIndex,
    dayLabel,
    menu,
    categories,
    closedToday,
  }
}
