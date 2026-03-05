"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

const PORCAO_OPTIONS = ["Creme", "Vatapá"]

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

  const toggle = (value: string) => {
    setSelected((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value)
      }
      if (prev.length >= 2) return prev
      return [...prev, value]
    })
  }

  const basePrice = size === "P" ? 15 : 18
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
        <label className="text-sm font-semibold">
          Opções (1 ou 2)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PORCAO_OPTIONS.map((opt) => {
            const selectedOpt = selected.includes(opt)
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className={`rounded-lg border px-2 py-2 text-left text-xs font-medium ${
                  selectedOpt
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground"
                }`}
              >
                {opt}
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
