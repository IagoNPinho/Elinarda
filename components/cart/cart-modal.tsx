"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Trash2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/components/cart-provider"
import { createOrderInDB } from "@/lib/orders"
import { generateWhatsAppMessage, openWhatsAppOrder } from "@/lib/whatsapp-message"
import { DeliverySettings, fetchDeliverySettings } from "@/lib/delivery-setting"

interface CartModalProps {
    open: boolean
    onClose: () => void
    origin: "mesa" | "balcao" | "delivery"
}

export function CartModal({ open, onClose, origin }: CartModalProps) {
    const router = useRouter()
    const {
        items,
        tableNumber,
        total,
        updateQuantity,
        removeItem,
        clearCart,
    } = useCart()

    const [settings, setSettings] = useState<DeliverySettings | null>(null)
    const [step, setStep] = useState<"cart" | "customer">("cart")
    const [loading, setLoading] = useState(false)

    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        street: "",
        number: "",
        neighborhood: "",
        cep: "",
    })

    useEffect(() => {
        fetchDeliverySettings().then(setSettings)
    }, [])

    if (!open) return null

    const deliveryFee = origin === "delivery" ? settings?.delivery_fee ?? 0 : 0
    const finalTotal = total + deliveryFee

    function formatPhone(value: string) {
        return value
            .replace(/\D/g, "")
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .slice(0, 15)
    }

    const isCustomerValid =
        customer.name.trim().length >= 3 &&
        customer.phone.replace(/\D/g, "").length === 11 &&
        customer.street &&
        customer.number &&
        customer.neighborhood &&
        customer.cep.length === 8

    async function handleConfirmCart() {
        if (!items.length) return

        if (origin === "delivery") {
            setStep("customer")
            return
        }

        setLoading(true)

        await createOrderInDB({
            origin,
            tableNumber: origin === "mesa" ? tableNumber : undefined,
            items,
            subtotal: total,
        })

        clearCart()
        setLoading(false)
        onClose()
    }

    async function handleConfirmDelivery() {
        if (!isCustomerValid) return

        setLoading(true)


        await createOrderInDB({
            origin: "delivery",
            customerName: customer.name,
            customerPhone: customer.phone,
            customerStreet: customer.street,
            customerNumber: customer.number,
            customerNeighborhood: customer.neighborhood,
            customerCep: customer.cep,
            items,
            subtotal: total,
            deliveryFee,
        })

        const message = generateWhatsAppMessage({
            customer: {
                name: customer.name,
                phone: customer.phone,
                street: customer.street,
                number: customer.number,
                neighborhood: customer.neighborhood,
                cep: customer.cep
            },
            items,
            subtotal: total,
            deliveryFee,
            total: finalTotal,
        })

        openWhatsAppOrder(message)

        clearCart()
        setLoading(false)
        onClose()
        router.push("/delivery/sucesso")
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
            <Card className="w-full max-w-md rounded-t-2xl sm:rounded-xl">
                <CardContent className="p-4 space-y-4">

                    {/* HEADER */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold">
                                {step === "cart" ? "Seu carrinho" : "Dados para entrega"}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {origin === "mesa" && `Mesa ${tableNumber}`}
                                {origin === "balcao" && "Balcão"}
                                {origin === "delivery" && "Delivery"}
                            </p>
                        </div>
                        <button onClick={onClose}>
                            <X />
                        </button>
                    </div>

                    {/* STEP 1 — CARRINHO */}
                    {step === "cart" && (
                        <>
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.sizeLabel}
                                        </p>
                                        <p className="font-bold text-primary">
                                            R$ {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                            <Minus size={16} />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                            <Plus size={16} />
                                        </button>
                                        <button onClick={() => removeItem(item.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="border-t pt-3 space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>R$ {total.toFixed(2)}</span>
                                </div>

                                {origin === "delivery" && (
                                    <div className="flex justify-between">
                                        <span>Taxa de entrega</span>
                                        <span>R$ {deliveryFee.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>R$ {finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {origin === "delivery" && settings && !settings.is_open && (
                                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    Delivery está fechado no momento. Assim que reabrirmos, você poderá confirmar seu pedido por aqui.
                                </div>
                            )}

                            <Button
                                className="w-full"
                                onClick={handleConfirmCart}
                                disabled={loading || (origin === "delivery" && !settings?.is_open)}
                            >
                                {loading
                                    ? "Processando..."
                                    : origin === "delivery" && settings && !settings.is_open
                                        ? "Delivery fechado"
                                        : "Confirmar pedido"}
                            </Button>
                        </>
                    )}

                    {/* STEP 2 — DADOS DO CLIENTE */}
                    {step === "customer" && (
                        <>
                            <p className="text-sm text-muted-foreground">
                                Confira seus dados.<br />Ao confirmar, o WhatsApp será aberto para finalizar o pedido.
                            </p>

                            <Label>Nome</Label>
                            <Input value={customer.name} onChange={(e) =>
                                setCustomer({ ...customer, name: e.target.value })}
                            />

                            <Label>Telefone</Label>
                            <Input value={customer.phone} onChange={(e) =>
                                setCustomer({ ...customer, phone: formatPhone(e.target.value) })}
                            />

                            <Label>Rua</Label>
                            <Input value={customer.street} onChange={(e) =>
                                setCustomer({ ...customer, street: e.target.value })}
                            />

                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Label>Número</Label>
                                    <Input value={customer.number} onChange={(e) =>
                                        setCustomer({ ...customer, number: e.target.value })}
                                    />
                                </div>

                                <div className="flex-1">
                                    <Label>Bairro</Label>
                                    <Input value={customer.neighborhood} onChange={(e) =>
                                        setCustomer({ ...customer, neighborhood: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Label>CEP</Label>
                            <Input value={customer.cep} onChange={(e) =>
                                setCustomer({ ...customer, cep: e.target.value.replace(/\D/g, "").slice(0, 8) })}
                            />

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" className="flex-1"
                                    onClick={() => setStep("cart")}>
                                    Voltar
                                </Button>

                                <Button
                                    className="flex-[2]"
                                    disabled={!isCustomerValid || loading}
                                    onClick={handleConfirmDelivery}
                                >
                                    {loading ? "Enviando..." : "Confirmar e ir para WhatsApp"}
                                </Button>
                            </div>
                        </>
                    )}

                </CardContent>
            </Card>
        </div>
    )
}
