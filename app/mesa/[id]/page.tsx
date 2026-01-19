"use client"

import { useEffect, use } from "react"
import { MenuItemCard } from "@/components/menu-item-card"
import { CartBar } from "@/components/cart-bar"
import { useCart } from "@/components/cart-provider"
import { menuItems, categories } from "@/lib/menu-data"
import { supabase } from "@/lib/supabase"

interface PageProps {
  params: Promise<{ id: string | string[] }>
}

export default function TableMenuPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const tableId = Array.isArray(id) ? id[0] : id
  const tableNumber = Number(tableId) || 1

  const { setTableNumber } = useCart()

  useEffect(() => {
    setTableNumber(tableNumber)
  }, [tableNumber, setTableNumber])


  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .then(({ error }) => {
        console.log(error)
      })
  }, [])


  return (
    <main className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 bg-primary text-primary-foreground p-4 shadow-md z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <img src="/logo.svg" alt="Restaurante" className="w-12 h-12" />
          <div>
            <h1 className="text-xl font-extrabold tracking-wide">Restaurante</h1>
            <p className="text-sm opacity-90">Mesa {tableNumber}</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-8">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="text-2xl font-extrabold tracking-tight">{category}</h2>
            <div className="space-y-4">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
            </div>
          </section>
        ))}
      </div>

      <CartBar />
    </main>
  )
}
