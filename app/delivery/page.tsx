"use client"

import { useEffect, useState } from "react"
import { CartBar } from "@/components/cart-bar"
import { useCart } from "@/components/cart-provider"
import { DeliveryClosedBar } from "@/components/delivery-closed-bar"
import { MenuItemCard } from "@/components/menu-item-card"
import { Card, CardContent } from "@/components/ui/card"
import { fetchDeliverySettings, type DeliverySettings } from "@/lib/delivery-setting"
import { useVisibleMenu } from "@/lib/useVisibleMenu"

export default function DeliveryPageContent() {
  const { addItem } = useCart()
  const { menu, categories, dayLabel, loading, error, closedToday } =
    useVisibleMenu()
  const [settings, setSettings] = useState<DeliverySettings | null>(null)
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now())
  const compactCategories = new Set([
    "Porções",
    "Sobremesas",
    "Copos 500 ml",
    "Jarra 1L",
    "Refrigerantes",
  ])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      const data = await fetchDeliverySettings()
      if (mounted) setSettings(data)
    }

    load()

    const intervalMs = 60_000
    const interval = setInterval(load, intervalMs)
    const clock = setInterval(() => setNow(Date.now()), 30_000)

    return () => {
      mounted = false
      clearInterval(interval)
      clearInterval(clock)
    }
  }, [])

  const isWithinDeliveryHours = () => {
    if (!settings?.delivery_open_time || !settings?.delivery_close_time) {
      return true
    }

    const [openH, openM] = settings.delivery_open_time.split(":").map(Number)
    const [closeH, closeM] = settings.delivery_close_time.split(":").map(Number)

    const nowDate = new Date(now)
    const open = new Date(nowDate)
    open.setHours(openH, openM, 0, 0)
    const close = new Date(nowDate)
    close.setHours(closeH, closeM, 0, 0)

    // cross-midnight range
    if (close <= open) {
      return nowDate >= open || nowDate <= close
    }

    return nowDate >= open && nowDate <= close
  }

  const isDeliveryOpen = !!settings?.is_open && isWithinDeliveryHours()

  return (
    <main className="min-h-screen bg-background pb-40">
      <header className="sticky top-0 bg-primary text-primary-foreground p-4 shadow-md z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <img src="/logo.jpeg" alt="Restaurante" className="w-12 h-12" />
          <div>
            <h1 className="text-xl font-extrabold tracking-wide">Delivery</h1>
            <p className="text-sm opacity-90">Faça seu pedido</p>
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

        <div className="px-4 space-y-8">
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
                  className="w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left font-bold text-lg"
                  onClick={() =>
                    setOpenCategory((prev) =>
                      prev === category ? null : category,
                    )
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
      </div>

      {closedToday ? (
        <DeliveryClosedBar />
      ) : isDeliveryOpen ? (
        <CartBar origin="delivery" />
      ) : (
        <DeliveryClosedBar />
      )}
    </main>
  )
}
