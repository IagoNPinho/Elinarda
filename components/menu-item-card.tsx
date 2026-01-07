"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/components/cart-provider"
import type { MenuItem } from "@/lib/menu-data"

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem } = useCart()

  const isWeightItem = item.soldByWeight === true

  // 🔹 tamanho selecionado (itens normais)
  const [selectedSize, setSelectedSize] = useState(item.sizes[0])

  // 🔹 quantidade (itens normais)
  const [quantity, setQuantity] = useState(1)

  // 🔹 peso em gramas (itens por peso)
  const [weight, setWeight] = useState(100)

  // 🔥 preço exibido (mantém layout)
  const displayedPrice = isWeightItem
    ? (weight / 1000) * (item.pricePerKg ?? 0)
    : selectedSize.price * quantity

  const handleAddToCart = () => {
    if (isWeightItem) {
      addItem({
        itemId: item.id,
        name: item.name,
        size: "U",
        sizeLabel: `${weight}g`,
        price: displayedPrice,
        quantity: 1,
        weightInGrams: weight,
      })
      setWeight(100)
    } else {
      addItem({
        itemId: item.id,
        name: item.name,
        size: selectedSize.size,
        sizeLabel: selectedSize.label,
        price: selectedSize.price,
        quantity,
      })
      setQuantity(1)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg text-foreground">
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* TAMANHOS (somente itens normais) */}
        {!isWeightItem && item.sizes.length > 1 && (
          <div className="flex gap-2 mb-3">
            {item.sizes.map((size) => (
              <button
                key={size.size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  selectedSize.size === size.size
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {size.size}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            R$ {displayedPrice.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* CONTROLE */}
            <div className="flex items-center bg-secondary rounded-lg">
              <button
                onClick={() =>
                  isWeightItem
                    ? setWeight(Math.max(50, weight - 50))
                    : setQuantity(Math.max(1, quantity - 1))
                }
                className="p-2 hover:bg-secondary/80 rounded-l-lg transition-colors"
                aria-label="Diminuir"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-12 text-center font-medium">
                {isWeightItem ? `${weight}g` : quantity}
              </span>

              <button
                onClick={() =>
                  isWeightItem
                    ? setWeight(weight + 50)
                    : setQuantity(quantity + 1)
                }
                className="p-2 hover:bg-secondary/80 rounded-r-lg transition-colors"
                aria-label="Aumentar"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <Button onClick={handleAddToCart} size="lg" className="font-semibold">
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </div>


      </CardContent>
    </Card>
  )
}
