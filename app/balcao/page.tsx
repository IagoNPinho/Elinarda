"use client"

import { useEffect, use } from "react"
import { MenuItemCard } from "@/components/menu-item-card"
import { Card, CardContent } from "@/components/ui/card"
import { CartBar } from "@/components/cart-bar"
import { useCart } from "@/components/cart-provider"
import { supabase } from "@/lib/supabase"
import { getActiveMenu } from "@/lib/menu-data"


export default function BalcaoMenuPage() {
    const { addItem } = useCart()
    const { menu, categories, dayLabel } = getActiveMenu()


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
                        <p className="text-sm opacity-90">Balcão</p>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto p-4 space-y-8">
                <Card className="m-4 text-center">
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Cardápio do dia
                        </p>
                        <h1 className="text-xl font-bold">{dayLabel}</h1>
                    </CardContent>
                </Card>
                {categories.map((category) => (
                    <section key={category}>
                        <h2 className="text-2xl font-extrabold tracking-tight">{category}</h2>
                        <div className="space-y-4">
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
            <CartBar origin="balcao" />
        </main>
    )
}