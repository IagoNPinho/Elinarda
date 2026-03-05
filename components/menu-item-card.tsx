"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { MenuItem } from "@/lib/menu-data"
import { PratinhoBuilder } from "@/components/pratinho-builder"
import { PorcaoBuilder } from "@/components/porcao-builder"

interface MenuItemCardProps {
  item: MenuItem
  onAddItem: (item: {
    itemId: string
    name: string
    size: string
    sizeLabel: string
    price: number
    weightInGrams?: number
    base?: string
    salad?: string
    optional?: string[]
    proteins?: { name: string; type: string }[]
    options?: string[]
    configKey?: string
  }) => void
}

export function MenuItemCard({
  item,
  onAddItem
}: MenuItemCardProps) {
  //const { addItem } = useCart()

  // 🔥 item vendido por peso (boolean)
  const isWeightItem = item.soldByWeight === true

  // 🔹 tamanho selecionado (itens normais)
  const [selectedSize, setSelectedSize] = useState(item.sizes[0])

  // 🔹 quantidade (itens normais)
  const [quantity, setQuantity] = useState(1)

  // 🔹 peso em gramas (itens por peso)
  const [weight, setWeight] = useState(100)

  // 🔥 preço exibido (mantém layout)
  const price = isWeightItem
    ? (weight / 1000) * (item.pricePerKg ?? 0)
    : selectedSize.price

  const handleAdd = () => {
    if (isWeightItem) {
      // item por peso: adiciona apenas uma vez
      onAddItem({
        itemId: item.id,
        name: item.name,
        size: "U",
        sizeLabel: `${weight}g`,
        price,
        weightInGrams: weight,
      })

      setWeight(100)
      return
    }

    // item normal: adiciona N vezes
    for (let i = 0; i < quantity; i++) {
      onAddItem({
        itemId: item.id,
        name: item.name,
        size: selectedSize.size,
        sizeLabel: selectedSize.label,
        price,
      })
    }

    setQuantity(1)
  }

  return (
    <Card className="overflow-hidden py-4 sm:py-6">
      <CardContent className="px-4">
        <div className="mb-1">
          <h3 className="font-semibold text-lg text-foreground">
            {item.name}
          </h3>
          {item.kind !== "pratinho" && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {item.kind === "pratinho" && (
          <PratinhoBuilder onAdd={onAddItem} />
        )}

        {item.kind === "porcao" && (
          <PorcaoBuilder onAdd={onAddItem} />
        )}

        {item.kind === "pratinho" || item.kind === "porcao" ? null : (
          <>
        {/* TAMANHOS (somente itens normais) */}
        {!isWeightItem && item.sizes.length > 1 && (
          <div className="flex gap-2 mb-3">
            {item.sizes.map((size) => (
              <button
                key={size.size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${selectedSize.size === size.size
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
              >
                {size.size}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xl font-bold text-primary">
            R$ {price.toFixed(2).replace(".", ",")}
          </span>

          <div className="flex items-center gap-2">
            {/* CONTROLE */}
            <div className="flex items-center bg-secondary rounded-lg">
              <button
                onClick={() =>
                  isWeightItem
                    ? setWeight(Math.max(50, weight - 50))
                    : setQuantity(Math.max(1, quantity - 1))
                }
                className="p-1 hover:bg-secondary/80 rounded-l-lg transition-colors text-white"
                aria-label="Diminuir"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-8 text-center text-white font-medium">
                {isWeightItem ? `${weight}g` : quantity}
              </span>

              <button
                onClick={() =>
                  isWeightItem
                    ? setWeight(weight + 50)
                    : setQuantity(quantity + 1)
                }
                className="p-2 hover:bg-secondary/80 rounded-r-lg transition-colors text-white"
                aria-label="Aumentar"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <Button onClick={handleAdd} size="lg" className="font-semibold px-3">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
        </div>
        </>
        )}


      </CardContent>
    </Card>
  )
}
