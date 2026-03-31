"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

type PortionOption = {
  id: string
  name: string
  price_p: number
  price_g: number
}

interface PorcaoBuilderProps {
  onAdd: (item: {
    itemId: string
    name: string
    size: string
    sizeLabel: string
    price: number
    options?: string[]
    configKey?: string
  }) => void
}

export function PorcaoBuilder({ onAdd }: PorcaoBuilderProps) {
  const [size, setSize] = useState<"P" | "G">("P")
  const [selected, setSelected] = useState<string[]>([])
  const [options, setOptions] = useState<PortionOption[] | null>(null)

  useEffect(() => {
    let mounted = true
    const dayIndex = new Date().getDay()

    const load = async () => {
      const { data: daily, error: dailyError } = await supabase
        .from("menu_item_daily")
        .select("item_id")
        .eq("item_type", "portion")
        .eq("day_of_week", dayIndex)
        .eq("is_active", true)

      if (dailyError) {
        console.error("Erro ao carregar menu_item_daily (portion):", dailyError)
        if (mounted) setOptions([])
        return
      }

      const ids = (daily ?? []).map((r: any) => r.item_id)
      if (!ids.length) {
        if (mounted) setOptions([])
        return
      }

      const { data, error } = await supabase
        .from("menu_portions")
        .select("id,name,price_p,price_g,pricing_mode,is_active")
        .in("id", ids)
        .eq("is_active", true)
        .eq("pricing_mode", "size")
        .order("name", { ascending: true })

      if (error) {
        console.error("Erro ao carregar menu_portions (size):", error)
        if (mounted) setOptions([])
        return
      }

      if (!mounted) return
      setOptions(
        (data ?? []).map((row: any) => ({
          id: row.id,
          name: row.name,
          price_p: Number(row.price_p ?? 0),
          price_g: Number(row.price_g ?? 0),
        })),
      )
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const toggle = (value: string) => {
    setSelected((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value)
      if (prev.length >= 2) return prev
      return [...prev, value]
    })
  }

  const selectedOptions = useMemo(() => {
    return (options ?? []).filter((opt) => selected.includes(opt.name))
  }, [options, selected])

  const basePrice = useMemo(() => {
    if (!selectedOptions.length) return 0
    const prices = selectedOptions.map((opt) =>
      size === "P" ? opt.price_p : opt.price_g,
    )
    return Math.max(...prices)
  }, [selectedOptions, size])

  const price = useMemo(() => {
    if (selected.length >= 2) return basePrice + 1
    if (selected.length === 1) return basePrice
    return 0
  }, [basePrice, selected.length])

  const canAdd = selected.length >= 1 && selected.length <= 2

  const handleAdd = () => {
    if (!canAdd) return
    const configKey = ["porcao", size, selected.join("|")].join(":")
    onAdd({
      itemId: "porcao-creme-vatapa",
      name: "Porção",
      size,
      sizeLabel: size,
      price,
      options: selected,
      configKey,
    })
  }

  if (!options) {
    return <div className="text-sm text-muted-foreground">Carregando...</div>
  }

  if (options.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Nenhuma porção disponível hoje.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["P", "G"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              size === s
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold">Opções (1 ou 2)</label>
        <div className="grid grid-cols-2 gap-2">
          {options.map((opt) => {
            const selectedOpt = selected.includes(opt.name)
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggle(opt.name)}
                className={`rounded-lg border px-2 py-2 text-left text-xs font-medium ${
                  selectedOpt
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground"
                }`}
              >
                {opt.name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-primary">
          R$ {price.toFixed(2).replace(".", ",")}
        </span>
        <Button onClick={handleAdd} disabled={!canAdd}>
          Adicionar
        </Button>
      </div>
    </div>
  )
}

