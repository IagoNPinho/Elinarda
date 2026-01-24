"use client"

import { Card } from "@/components/ui/card"

export function DeliveryClosedBar() {
    return (

        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg">
            <div className="max-w-2xl mx-auto">
                <Card className="p-4 text-center">
                    <p className="font-semibold text-foreground">
                        Delivery fechado no momento
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Não estamos aceitando pedidos via delivery no momento.
                    </p>
                </Card>
            </div>
        </div>
    )
}