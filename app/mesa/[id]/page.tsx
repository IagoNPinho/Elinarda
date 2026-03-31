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

  const categoryIcon: Record<string, string> = {
    "Pratinhos": "🍽️",
    "Porções": "🥘",
    "Sobremesas": "🍮",
    "Copos 500 ml": "🥤",
    "Jarra 1L": "🫙",
    "Refrigerantes": "🥫",
  }

  const categorySubtitle: Record<string, string> = {
    "Pratinhos": "Monte com base, salada e proteínas",
    "Porções": "Creme, Vatapá e mais — P ou G",
    "Sobremesas": "Pudim, pavê, mousses",
    "Copos 500 ml": "Sucos naturais",
    "Jarra 1L": "Para a mesa toda",
    "Refrigerantes": "Coca, Guaraná e mais",
  }

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
          categories.map((category) => {
            const isOpen = openCategory === category
            return (
              <section key={category}>
                <button
                  className={`w-full flex items-center gap-3 rounded-[14px] border px-4 py-3 text-left transition-colors duration-[320ms] ${
                    isOpen ? "border-[rgba(194,59,50,0.35)]" : "border-border"
                  }`}
                  onClick={() =>
                    setOpenCategory((prev) => (prev === category ? null : category))
                  }
                >
                  <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-[rgba(194,59,50,0.08)] flex items-center justify-center text-lg">
                    {categoryIcon[category] ?? "🍴"}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] font-medium leading-tight">{category}</span>
                    {categorySubtitle[category] && (
                      <span className="block text-[12px] text-muted-foreground leading-tight mt-0.5">
                        {categorySubtitle[category]}
                      </span>
                    )}
                  </span>
                  <svg
                    className={`flex-shrink-0 w-4 h-4 text-muted-foreground transition-transform duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? "rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <div
                  className={`grid transition-all duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
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
                  </div>
                </div>
              </section>
            )
          })
        )}
      </div>

      {!closedToday && <CartBar origin="mesa" />}
    </main>
  )
}
