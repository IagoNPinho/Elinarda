"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { getActiveDayIndex } from "@/lib/menu-data"
import { useMenuData } from "@/lib/useMenuData"
import { calculatePratinhoPrice } from "@/lib/pricing"

interface PratinhoBuilderProps {
  onAdd: (item: {
    itemId: string
    name: string
    size: string
    sizeLabel: string
    price: number
    base?: string
    salad?: string
    optional?: string[]
    proteins?: { name: string; type: string }[]
    configKey?: string
  }) => void
}

export function PratinhoBuilder({ onAdd }: PratinhoBuilderProps) {
  const [size, setSize] = useState<"P" | "G">("P")
  const [base, setBase] = useState<string>("")
  const [salad, setSalad] = useState<string>("")
  const [selectedOptionals, setSelectedOptionals] = useState<string[]>([])
  const [selectedProteins, setSelectedProteins] = useState<{
    id: string
    name: string
    type: string
    price_p: number
    price_g: number
  }[]>([])

  const dayIndex = getActiveDayIndex()
  const { proteins, bases, salads, optionals } = useMenuData(dayIndex)

  useEffect(() => {
    if (bases && bases.length && !base) {
      setBase(bases[0].name)
    }
    if (salads && salads.length && !salad) {
      setSalad("")
    }
  }, [bases, salads, base, salad])

  const price = useMemo(
    () => calculatePratinhoPrice(size, selectedProteins as any),
    [size, selectedProteins],
  )

  const toggleProtein = (protein: {
    id: string
    name: string
    type: string
    price_p: number
    price_g: number
  }) => {
    const exists = selectedProteins.find((p) => p.id === protein.id)
    if (exists) {
      setSelectedProteins((prev) =>
        prev.filter((p) => p.id !== protein.id),
      )
      return
    }
    if (selectedProteins.length >= 2) return
    setSelectedProteins((prev) => [...prev, protein])
  }

  const canAdd =
    base &&
    selectedProteins.length >= 1 &&
    selectedProteins.length <= 2

  const handleAdd = () => {
    if (!canAdd) return

    const proteinEntries = selectedProteins.map((p) => ({
      name: p.name,
      type: p.type,
    }))
    const optional = selectedOptionals

    const configKey = [
      "pratinho",
      size,
      base,
      salad || "sem-salada",
      optional.join(","),
      proteinEntries.map((p) => p.name).join("|"),
    ].join(":")

    onAdd({
      itemId: "pratinho",
      name: "Pratinho",
      size,
      sizeLabel: size,
      price,
      base,
      salad: salad || undefined,
      optional,
      proteins: proteinEntries,
      configKey,
    })
  }

  if (!bases || !salads || !proteins || !optionals) {
    return <div className="text-sm text-muted-foreground">Carregando...</div>
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          Monte seu pratinho com base, salada e proteínas
        </div>
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
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold">Base</label>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={base}
          onChange={(e) => setBase(e.target.value)}
        >
          {bases.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold">Salada (opcional)</label>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={salad}
          onChange={(e) => setSalad(e.target.value)}
        >
          <option value="">Sem salada</option>
          {salads.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold">
          Proteínas (1 ou 2)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {proteins
            .filter((protein) => {
              const name = protein.name.toLowerCase()
              return name !== "sopa" && name !== "canja"
            })
            .map((protein) => {
            const selected = selectedProteins.some(
              (p) => p.id === protein.id,
            )
            return (
              <button
                key={protein.id}
                type="button"
                onClick={() => toggleProtein(protein)}
                className={`rounded-lg border px-2 py-2 text-left text-xs font-medium ${
                  selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground"
                }`}
              >
                <div className="font-semibold">{protein.name}</div>
                <div
                  className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold leading-4 ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {protein.price_p === protein.price_g ? (
                    <div>U - R$ {protein.price_p.toFixed(2).replace(".", ",")}</div>
                  ) : (
                    <>
                      <div>P - R$ {protein.price_p.toFixed(2).replace(".", ",")}</div>
                      <div>G - R$ {protein.price_g.toFixed(2).replace(".", ",")}</div>
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold">Opcionais</label>
        <div className="grid grid-cols-2 gap-2">
          {optionals.map((opt) => {
            const selected = selectedOptionals.includes(opt.name)
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  setSelectedOptionals((prev) =>
                    prev.includes(opt.name)
                      ? prev.filter((o) => o !== opt.name)
                      : [...prev, opt.name],
                  )
                }
                className={`rounded-lg border px-2 py-2 text-left text-xs font-medium ${
                  selected
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
