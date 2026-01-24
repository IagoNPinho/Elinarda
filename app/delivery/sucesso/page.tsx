"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DeliverySuccessPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
          <Check className="w-10 h-10 text-green-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Pedido enviado com sucesso!
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Aguarde, estamos preparando seu pedido.
          </p>
        </div>

        <Button asChild size="lg" className="w-full font-semibold">
          <Link href="/delivery">Fazer novo pedido</Link>
        </Button>
      </div>
    </main>
  )
}
