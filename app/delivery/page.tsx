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

    useEffect(() => {
        fetchDeliverySettings().then(setSettings)
    }, [])


    // WHATSAPP MENSAGE GENERATION
    return (
        <main className="min-h-screen bg-background pb-40">
            {/* HEADER */}
            <header className="sticky top-0 bg-primary text-primary-foreground p-4 shadow-md z-10">
                <div className="max-w-2xl mx-auto flex items-center gap-3">
                    <img src="/logo.svg" alt="Restaurante" className="w-12 h-12" />
                    <div>
                        <h1 className="text-xl font-extrabold tracking-wide">Delivery</h1>
                        <p className="text-sm opacity-90">Faça seu pedido</p>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto p-4 space-y-8">

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
                                <h2 className="font-bold text-lg mb-2">
                                    {category}
                                </h2>

                                <div className="space-y-3">
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
                            </section>
                        ))}
                    </div>
                </div>
            </div>

            {settings?.is_open ? (
                <CartBar origin="delivery" />
            ) : (
                <DeliveryClosedBar />
            )}
        </main>
    )
}