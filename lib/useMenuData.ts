"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { getDayProteinNames } from "@/lib/menu-data"
import type { ProteinType } from "@/lib/menu-components"

export interface MenuProtein {
  id: string
  name: string
  type: ProteinType
  price_p: number
  price_g: number
  is_active: boolean
}

export interface MenuBase {
  id: string
  name: string
}

export interface MenuSalad {
  id: string
  name: string
}

export interface MenuOptional {
  id: string
  name: string
  price: number
}

export function useMenuData(dayIndex?: number) {
  const [proteins, setProteins] = useState<MenuProtein[] | null>(null)
  const [bases, setBases] = useState<MenuBase[] | null>(null)
  const [salads, setSalads] = useState<MenuSalad[] | null>(null)
  const [optionals, setOptionals] = useState<MenuOptional[] | null>(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
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
            .order("name", { ascending: true }),
          supabase
            .from("menu_salads")
            .select("*")
            .order("name", { ascending: true }),
          supabase
            .from("menu_optionals")
            .select("*")
            .order("name", { ascending: true }),
        ])

      if (!mounted) return
      if (proteinsRes.error || basesRes.error || saladsRes.error || optionalsRes.error) {
        console.error("Erro ao carregar menu:", {
          proteins: proteinsRes.error,
          bases: basesRes.error,
          salads: saladsRes.error,
          optionals: optionalsRes.error,
        })
        setProteins([])
        setBases([])
        setSalads([])
        setOptionals([])
        return
      }

      let proteinsData = proteinsRes.data ?? []

      if (typeof dayIndex === "number") {
        const { data: dailyData, error: dailyError } = await supabase
          .from("menu_daily")
          .select("protein_id")
          .eq("day_of_week", dayIndex)
          .eq("is_active", true)

        if (!dailyError && dailyData && dailyData.length > 0) {
          const allowedIds = new Set(dailyData.map((row) => row.protein_id))
          proteinsData = proteinsData.filter((p) => allowedIds.has(p.id))
        } else {
          const names = getDayProteinNames(dayIndex)
          if (names.length > 0) {
            const normalize = (value: string) =>
              value
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/\bde\b/g, "")
                .replace(/\s+/g, " ")
                .trim()

            const allowedNames = new Set(names.map(normalize))
            proteinsData = proteinsData.filter((p) =>
              allowedNames.has(normalize(p.name)),
            )
          }
        }
      }

      setProteins(proteinsData)
      setBases(basesRes.data ?? [])
      setSalads(saladsRes.data ?? [])
      setOptionals(optionalsRes.data ?? [])
    }

    load()

    return () => {
      mounted = false
    }
  }, [dayIndex])

  return { proteins, bases, salads, optionals }
}
