"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
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
  is_active?: boolean
}

export interface MenuSalad {
  id: string
  name: string
  is_active?: boolean
}

export interface MenuOptional {
  id: string
  name: string
  price: number
  is_active?: boolean
}

export function useMenuData(dayIndex?: number) {
  const [proteins, setProteins] = useState<MenuProtein[] | null>(null)
  const [bases, setBases] = useState<MenuBase[] | null>(null)
  const [salads, setSalads] = useState<MenuSalad[] | null>(null)
  const [optionals, setOptionals] = useState<MenuOptional[] | null>(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      const [proteinsRes, basesRes, saladsRes, optionalsRes] = await Promise.all(
        [
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
        ],
      )

      if (!mounted) return

      if (
        proteinsRes.error ||
        basesRes.error ||
        saladsRes.error ||
        optionalsRes.error
      ) {
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

      let proteinsData = (proteinsRes.data ?? []) as any[]

      if (typeof dayIndex === "number") {
        const { data: dailyData, error: dailyError } = await supabase
          .from("menu_item_daily")
          .select("item_id")
          .eq("item_type", "protein")
          .eq("day_of_week", dayIndex)
          .eq("is_active", true)

        if (dailyError) {
          console.error("Erro ao carregar menu_item_daily (protein):", dailyError)
          proteinsData = []
        } else if (dailyData && dailyData.length > 0) {
          const allowedIds = new Set(dailyData.map((row: any) => row.item_id))
          proteinsData = proteinsData.filter((p) => allowedIds.has(p.id))
        } else {
          // Restaurante fechado nesses dias (ex: ter/qua). Não fazer fallback.
          proteinsData = []
        }
      }

      setProteins(proteinsData as MenuProtein[])
      setBases((basesRes.data ?? []) as MenuBase[])
      setSalads((saladsRes.data ?? []) as MenuSalad[])
      setOptionals((optionalsRes.data ?? []) as MenuOptional[])
    }

    load()

    return () => {
      mounted = false
    }
  }, [dayIndex])

  return { proteins, bases, salads, optionals }
}

