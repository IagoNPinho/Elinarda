"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FileText, Check, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { generateOrderThermalPDF } from "@/lib/generate-order-pdf-thermal"

interface Order {
  id: string
  origin: "mesa" | "balcao" | "delivery"
  table_number?: number
  status: string
  items: any[]
  total: number
}

export default function KitchenOrderPage() {
  const { id } = useParams()
  const router = useRouter()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single()

    if (!error) {
      setOrder(data)
    }

    setLoading(false)
  }

  const updateStatus = async (status: string) => {
    await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)

    fetchOrder()
  }

  useEffect(() => {
    if (id) fetchOrder()
  }, [id])

  if (loading) {
    return (
      <main className="p-6 text-center text-muted-foreground">
        Carregando pedido...
      </main>
    )
  }

  if (!order) {
    return (
      <main className="p-6 text-center">
        <p>Pedido não encontrado.</p>
        <Button onClick={() => router.push("/cozinha")}>
          Voltar
        </Button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* HEADER PADRÃO */}
      <header className="sticky top-0 bg-primary text-primary-foreground p-4 shadow-md z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/cozinha")}
          >
            <ArrowLeft />
          </Button>

          <div>
            <h1 className="text-xl font-bold">
              Pedido #{order.id.slice(0, 6)}
            </h1>
            {order.origin === "mesa" && (
              <p className="text-sm opacity-90">
                Mesa {order.table_number}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <ul className="border rounded-lg p-4 space-y-2">
          {order.items.map((item, idx) => (
            <li key={idx} className="text-sm">
              {item.weightInGrams ? (
                <>
                  {item.name} – {item.weightInGrams}g
                  <span className="text-muted-foreground">
                    {" "}• vendido por peso
                  </span>
                </>
              ) : (
                <>
                  {item.quantity}x {item.name} ({item.sizeLabel})
                </>
              )}
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total</span>
          <span>R$ {order.total.toFixed(2)}</span>
        </div>

        {/* AÇÕES */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            onClick={() => generateOrderThermalPDF(order, { width: 58 })}
          >
            <FileText className="w-4 h-4 mr-2" />
            Imprimir Pedido
          </Button>

          {order.status === "aberto" && (
            <Button onClick={() => updateStatus("preparando")}>
              <ChefHat className="w-4 h-4 mr-2" />
              Iniciar Preparo
            </Button>
          )}

          {order.status === "preparando" && (
            <Button onClick={() => updateStatus("pronto")}>
              <Check className="w-4 h-4 mr-2" />
              Marcar como Pronto
            </Button>
          )}

          {order.status === "pronto" && (
            <Button
              variant="destructive"
              onClick={() => updateStatus("finalizado")}
            >
              Finalizar Pedido
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
