"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { fetchOrderById } from "@/lib/orders"
import type { Order } from "@/lib/orders"

const statusLabel: Record<Order["status"], string> = {
    pending: "Aguardando",
    preparing: "Em preparo",
    ready: "Pronto",
    out_for_delivery: "Saiu para entrega",
    delivered: "Entregue",
    closed: "Finalizado",
    cancelled: "Cancelado",
}

export default function AdminOrderPage() {
    const { id } = useParams()
    const router = useRouter()

    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return

        fetchOrderById(id as string).then((data) => {
            setOrder(data)
            setLoading(false)
        })
    }, [id])

    if (loading) {
        return (
            <div className="p-6 text-center text-muted-foreground">
                Carregando pedido...
            </div>
        )
    }

    if (!order) {
        return (
            <div className="p-6 text-center">
                <p>Pedido não encontrado.</p>
                <Button onClick={() => router.push("/admin")}>
                    Voltar
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* VOLTAR */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin")}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
            </Button>

            {/* CABEÇALHO */}
            <Card>
                <CardContent className="p-4 space-y-2">
                    <h2 className="text-lg font-bold">
                        Pedido #{order.id.slice(0, 6)}
                    </h2>

                    <p className="text-sm text-muted-foreground capitalize">
                        Origem: {order.origin}
                    </p>

                    <p className="text-sm">
                        Status:{" "}
                        <span className="font-semibold">
                            {statusLabel[order.status]}
                        </span>
                    </p>

                    {order.origin === "mesa" && (
                        <p className="text-sm">
                            Mesa {order.table_number}
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* CLIENTE (DELIVERY) */}
            {order.origin === "delivery" && (
                <Card>
                    <CardContent className="p-4 space-y-1">
                        <h3 className="font-semibold text-orange-600">
                            Dados do Cliente
                        </h3>

                        <p className="text-sm">
                            <strong>Nome:</strong> {order.customer_name}
                        </p>

                        <p className="text-sm">
                            <strong>Telefone:</strong> {order.customer_phone}
                        </p>

                        <p className="text-sm">
                            <strong>Endereço:</strong><br />
                            {order.customer_street}, {order.customer_number}<br />
                            {order.customer_neighborhood} – CEP {order.customer_cep}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* ITENS */}
            <Card>
                <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold">Itens</h3>

                    <ul className="text-sm space-y-1">
                        {order.items.map((item: any, idx: number) => (
                            <li key={idx}>
                                {item.weightInGrams
                                    ? `${item.name} – ${item.weightInGrams}g`
                                    : `${item.quantity}x ${item.name} (${item.sizeLabel})`}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* TOTAL */}
            <Card>
                <CardContent className="p-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {order.total.toFixed(2)}</span>
                </CardContent>
            </Card>
        </div>
    )
}
