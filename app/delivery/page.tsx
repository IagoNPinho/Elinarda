"use client"

import { MenuItemCard } from "@/components/menu-item-card"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/components/cart-provider"
import { getActiveMenu } from "@/lib/menu-data"
import { CartBar } from "@/components/cart-bar"
import { useEffect, useState } from "react"
import { DeliverySettings, fetchDeliverySettings } from "@/lib/delivery-setting"
import { DeliveryClosedBar } from "@/components/delivery-closed-bar"

export default function DeliveryPageContent() {
    const { menu, categories, dayLabel } = getActiveMenu()
    const { addItem } = useCart()
    const [settings, setSettings] = useState<DeliverySettings | null>(null)
    const [openCategory, setOpenCategory] = useState<string | null>(null)
    const [now, setNow] = useState(Date.now())

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

        if (close <= open) {
            return nowDate >= open || nowDate <= close
        }

        return nowDate >= open && nowDate <= close
    }

    const isDeliveryOpen = settings?.is_open && isWithinDeliveryHours()


    // WHATSAPP MENSAGE GENERATION
    return (
        <main className="min-h-screen bg-background pb-40">
            {/* HEADER */}
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

                {/* MENU SECTION */}
                <div>
                    {/* CARDAPIO DO DIA */}
                    <Card className="m-4 text-center">
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Cardápio do dia
                            </p>
                            <h1 className="text-xl font-bold">{dayLabel}</h1>
                        </CardContent>
                    </Card>
                    <div className="px-4 space-y-8">
                        {categories.map((category) => (
                            <section key={category}>
                                <button
                                    className="w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left font-bold text-lg"
                                    onClick={() =>
                                        setOpenCategory((prev) =>
                                            prev === category ? null : category
                                        )
                                    }
                                >
                                    <span>{category}</span>
                                    <span className="text-muted-foreground">
                                        {openCategory === category ? "−" : "+"}
                                    </span>
                                </button>

                                {openCategory === category && (
                                    <div className="mt-3 space-y-3">
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
                                )}
                            </section>
                        ))}
                    </div>
                </div>
            </div>

            {isDeliveryOpen ? (
                <CartBar origin="delivery" />
            ) : (
                <DeliveryClosedBar />
            )}
        </main>
    )
}
