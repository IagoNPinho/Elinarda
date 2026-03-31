"use client"

import { use, useEffect, useState } from "react"
import { CartBar } from "@/components/cart-bar"
import { useCart } from "@/components/cart-provider"
import { MenuItemCard } from "@/components/menu-item-card"
import { Card, CardContent } from "@/components/ui/card"
import { useVisibleMenu } from "@/lib/useVisibleMenu"

interface PageProps {
  params: Promise<{ id: string | string[] }>
}

export default function TableMenuPage({ params }: PageProps) {
  const { id } = use(params)
  const tableId = Array.isArray(id) ? id[0] : id
  const tableNumber = Number(tableId)

  const { setTableNumber, addItem } = useCart()
  const { menu, categories, dayLabel, loading, error, closedToday } =
    useVisibleMenu()
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const compactCategories = new Set([
    "Porções",
    "Sobremesas",
    "Copos 500 ml",
    "Jarra 1L",
    "Refrigerantes",
  ])

  useEffect(() => {
    if (Number.isFinite(tableNumber)) {
      setTableNumber(tableNumber)
    }
  }, [tableNumber, setTableNumber])

  return (
    <main className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 bg-primary text-primary-foreground p-4 shadow-md z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <img src="/logo.jpeg" alt="Restaurante" className="w-12 h-12" />
          <div>
            <h1 className="text-xl font-extrabold tracking-wide">
              Restaurante
            </h1>
            <p className="text-sm opacity-90">Mesa {tableId}</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-8">
        <p className="text-center text-sm text-muted-foreground italic">
          Tu me cercaste em volta, e puseste sobre mim a tua mão. Salmos 139:5
        </p>

        <Card className="m-4 text-center">
          <CardContent>
            <p className="text-sm text-muted-foreground">Cardápio do dia</p>
            <h1 className="text-xl font-bold">{dayLabel}</h1>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center text-sm text-muted-foreground">
            Carregando...
          </div>
        ) : closedToday ? (
          <div className="text-center text-sm text-muted-foreground">
            Fechado hoje
          </div>
        ) : error ? (
          <div className="text-center text-sm text-destructive">{error}</div>
        ) : (
          categories.map((category) => (
            <section key={category}>
              <button
                className="w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left text-lg font-bold"
                onClick={() =>
                  setOpenCategory((prev) => (prev === category ? null : category))
                }
              >
                <span>{category}</span>
                <span className="text-muted-foreground">
                  {openCategory === category ? "-" : "+"}
                </span>
              </button>

              {openCategory === category && (
                <div
                  className={
                    compactCategories.has(category)
                      ? "mt-3 rounded-lg border bg-card p-3"
                      : "mt-3 space-y-3"
                  }
                >
                  <div
                    className={
                      compactCategories.has(category)
                        ? "grid gap-2 sm:grid-cols-2"
                        : "space-y-3"
                    }
                  >
                    {menu
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          onAddItem={addItem}
                        />
                      ))}
                  </div>
                </div>
              )}
            </section>
          ))
        )}
      </div>

      {!closedToday && <CartBar origin="mesa" />}
    </main>
  )
}
