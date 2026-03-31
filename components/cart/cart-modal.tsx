"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Trash2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/components/cart-provider"
import { createOrderInDB, type PaymentMethod } from "@/lib/orders"
import { generateWhatsAppMessage, openWhatsAppOrder } from "@/lib/whatsapp-message"
import { DeliverySettings, fetchDeliverySettings } from "@/lib/delivery-setting"
import { DeliveryFee, fetchDeliveryFeeByNeighborhood, fetchDeliveryFees } from "@/lib/delivery-fees"

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
    const [fees, setFees] = useState<DeliveryFee[]>([])
    const [deliveryFee, setDeliveryFee] = useState<number | null>(0)
    const [step, setStep] = useState<"cart" | "customer" | "fulfillment" | "confirm">("cart")
    const [loading, setLoading] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [now, setNow] = useState(Date.now())
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
    const [paymentDetails, setPaymentDetails] = useState("")
    const [fulfillmentType, setFulfillmentType] = useState<"pickup" | "delivery">("delivery")

    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
    })

    useEffect(() => {
        let mounted = true

        fetchDeliverySettings().then((data) => {
            if (mounted) setSettings(data)
        })
        fetchDeliveryFees().then((data) => {
            if (mounted) setFees(data)
        })

        const clock = setInterval(() => setNow(Date.now()), 30_000)
        return () => {
            mounted = false
            clearInterval(clock)
        }
    }, [])

    if (!open) return null

    const OTHER_NEIGHBORHOOD = "Outro (consultar)"
    const sortedFees = fees
        .slice()
        .sort((a, b) => a.neighborhood.localeCompare(b.neighborhood))
    const effectiveDeliveryFee =
        origin === "delivery" && fulfillmentType === "delivery"
            ? deliveryFee ?? 0
            : 0
    const finalTotal =
        origin === "delivery" ? total + effectiveDeliveryFee : total

    function formatPhone(value: string) {
        return value
            .replace(/\D/g, "")
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .slice(0, 15)
    }

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

    const stepTitle =
        step === "cart"
            ? "Seu carrinho"
            : step === "customer"
                ? "Dados do cliente"
                : step === "fulfillment"
                    ? "Tipo de atendimento"
                    : "Finalizar pedido"

    const isCustomerValid =
        customer.name.trim().length >= 3 &&
        customer.phone.replace(/\D/g, "").length === 11

    const isDeliveryAddressValid =
        fulfillmentType === "delivery"
            ? !!customer.street && !!customer.number && !!customer.neighborhood
            : true

    const isPaymentValid = !!paymentMethod

    async function handleNeighborhoodChange(value: string) {
        setCustomer({ ...customer, neighborhood: value })

        if (origin !== "delivery") return
        if (fulfillmentType !== "delivery") return

        if (!value || value === OTHER_NEIGHBORHOOD) {
            setDeliveryFee(null)
            return
        }

        const fee = await fetchDeliveryFeeByNeighborhood(value)
        setDeliveryFee(fee)
    }

    function handleFulfillmentChange(value: "pickup" | "delivery") {
        setFulfillmentType(value)
        if (value === "pickup") {
            setDeliveryFee(null)
        }
        if (value === "delivery" && customer.neighborhood) {
            handleNeighborhoodChange(customer.neighborhood)
        }
    }

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
        if (!isCustomerValid || !isDeliveryAddressValid || !isPaymentValid) return

        setLoading(true)
        setSubmitError(null)

        try {
            const finalCustomerNumber = customer.complement
                ? `${customer.number} - ${customer.complement}`
                : customer.number

            const orderOrigin =
                fulfillmentType === "delivery" ? "delivery" : "balcao"

            await createOrderInDB({
                origin: orderOrigin,
                fulfillmentType,
                customerName: customer.name,
                customerPhone: customer.phone,
                customerStreet:
                    fulfillmentType === "delivery" ? customer.street : undefined,
                customerNumber:
                    fulfillmentType === "delivery" ? finalCustomerNumber : undefined,
                customerNeighborhood:
                    fulfillmentType === "delivery" ? customer.neighborhood : undefined,
                paymentMethod: paymentMethod ?? undefined,
                paymentDetails: paymentDetails || undefined,
                items,
                subtotal: total,
                deliveryFee: fulfillmentType === "delivery" ? deliveryFee : null,
            })

            const message = generateWhatsAppMessage({
                fulfillmentType,
                customer: {
                    name: customer.name,
                    phone: customer.phone,
                    street: customer.street,
                    number: finalCustomerNumber,
                    neighborhood: customer.neighborhood,
                },
                items,
                subtotal: total,
                deliveryFee: fulfillmentType === "delivery" ? deliveryFee : null,
                total: finalTotal,
                paymentMethod,
                paymentDetails: paymentDetails || null,
            })

            openWhatsAppOrder(message)

            clearCart()
            onClose()
            router.push("/delivery/sucesso")
        } catch (err) {
            console.error("Erro ao confirmar delivery:", err)
            setSubmitError("Não foi possível enviar o pedido. Verifique o banco e tente novamente.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
            <Card className="w-full max-w-md rounded-t-2xl sm:rounded-xl">
                <CardContent className="p-4 space-y-4">

                    {/* HEADER */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold">
                                {stepTitle}
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
                                        {(item.base || item.salad || item.optional || item.proteins || item.options) && (
                                            <div className="text-xs text-muted-foreground space-y-0.5">
                                                {item.base && <p>Base: {item.base}</p>}
                                                {item.salad && <p>Salada: {item.salad}</p>}
                                                {item.optional && item.optional.length > 0 && (
                                                    <p>Opcional: {item.optional.join(", ")}</p>
                                                )}
                                                {item.proteins && item.proteins.length > 0 && (
                                                    <p>
                                                        Proteínas: {item.proteins.map((p) => p.name).join(", ")}
                                                    </p>
                                                )}
                                                {item.options && item.options.length > 0 && (
                                                    <p>Opções: {item.options.join(", ")}</p>
                                                )}
                                            </div>
                                        )}
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

                        {origin === "delivery" && fulfillmentType === "delivery" && (
                                    <div className="flex justify-between">
                                        <span>Taxa de entrega</span>
                                        {deliveryFee == null ? (
                                            <span>A consultar</span>
                                        ) : (
                                            <span>R$ {deliveryFee.toFixed(2)}</span>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>R$ {finalTotal.toFixed(2)}</span>
                                </div>
                            </div>


                            <Button
                                className="w-full"
                                onClick={handleConfirmCart}
                                disabled={loading}
                            >
                                {loading
                                    ? "Processando..."
                                    : "Confirmar pedido"}
                            </Button>
                        </>
                    )}

                    {/* STEP 2 - DADOS DO CLIENTE */}
                    {step === "customer" && (
                        <>
                            <p className="text-sm text-muted-foreground">
                                Informe seus dados para continuarmos.
                            </p>

                            <Label>Nome</Label>
                            <Input
                                value={customer.name}
                                onChange={(e) =>
                                    setCustomer({ ...customer, name: e.target.value })}
                            />

                            <Label>Telefone</Label>
                            <Input
                                value={customer.phone}
                                onChange={(e) =>
                                    setCustomer({ ...customer, phone: formatPhone(e.target.value) })}
                            />

                            <div className="flex gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setStep("cart")}
                                >
                                    Voltar
                                </Button>

                                <Button
                                    className="flex-[2]"
                                    disabled={!isCustomerValid || loading}
                                    onClick={() => setStep("fulfillment")}
                                >
                                    Continuar
                                </Button>
                            </div>
                        </>
                    )}

                    {/* STEP 3 - TIPO DE ATENDIMENTO */}
                    {step === "fulfillment" && (
                        <>
                            <p className="text-sm text-muted-foreground">
                                Escolha como o pedido sera atendido.
                            </p>

                            <Label>Tipo de atendimento</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    variant={fulfillmentType === "pickup" ? "default" : "outline"}
                                    onClick={() => handleFulfillmentChange("pickup")}
                                >
                                    Retirada
                                </Button>
                                <Button
                                    type="button"
                                    variant={fulfillmentType === "delivery" ? "default" : "outline"}
                                    onClick={() => handleFulfillmentChange("delivery")}
                                >
                                    Delivery
                                </Button>
                            </div>

                            {fulfillmentType === "delivery" && (
                                <>
                                    <Label>Rua</Label>
                                    <Input
                                        value={customer.street}
                                        onChange={(e) =>
                                            setCustomer({ ...customer, street: e.target.value })}
                                    />

                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Label>Numero</Label>
                                            <Input
                                                value={customer.number}
                                                onChange={(e) =>
                                                    setCustomer({ ...customer, number: e.target.value })}
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <Label>Complemento (opcional)</Label>
                                            <Input
                                                value={customer.complement}
                                                onChange={(e) =>
                                                    setCustomer({ ...customer, complement: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <Label>Bairro</Label>
                                    <select
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={customer.neighborhood}
                                        onChange={(e) => handleNeighborhoodChange(e.target.value)}
                                    >
                                        <option value="">Selecione um bairro</option>
                                        {sortedFees.map((fee) => (
                                            <option key={fee.id} value={fee.neighborhood}>
                                                {fee.neighborhood} - R$ {fee.fee.toFixed(2)}
                                            </option>
                                        ))}
                                        <option value={OTHER_NEIGHBORHOOD}>
                                            Outro (consultar)
                                        </option>
                                    </select>
                                </>
                            )}

                            <div className="flex gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setStep("customer")}
                                >
                                    Voltar
                                </Button>

                                <Button
                                    className="flex-[2]"
                                    disabled={!isDeliveryAddressValid || loading}
                                    onClick={() => setStep("confirm")}
                                >
                                    Continuar
                                </Button>
                            </div>
                        </>
                    )}

                    {/* STEP 4 - FINALIZAR */}
                    {step === "confirm" && (
                        <>
                            <div className="border rounded-lg p-3 space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Atendimento</span>
                                    <span>{fulfillmentType === "delivery" ? "Delivery" : "Retirada"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>R$ {total.toFixed(2)}</span>
                                </div>
                                {fulfillmentType === "delivery" && (
                                    <div className="flex justify-between">
                                        <span>Taxa de entrega</span>
                                        {deliveryFee == null ? (
                                            <span>A consultar</span>
                                        ) : (
                                            <span>R$ {deliveryFee.toFixed(2)}</span>
                                        )}
                                    </div>
                                )}
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>R$ {finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Forma de pagamento</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(["dinheiro", "pix", "credito", "debito"] as const).map(
                                        (method) => (
                                            <Button
                                                key={method}
                                                type="button"
                                                variant={paymentMethod === method ? "default" : "outline"}
                                                onClick={() => setPaymentMethod(method)}
                                            >
                                                {method.toUpperCase()}
                                            </Button>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Detalhes do pagamento (opcional)</Label>
                                <Input
                                    value={paymentDetails}
                                    onChange={(e) => setPaymentDetails(e.target.value)}
                                    placeholder="Ex: troco para 50"
                                />
                            </div>

                            {fulfillmentType === "delivery" && settings && !isDeliveryOpen && (
                                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    Delivery esta fechado no momento. Voce pode trocar para retirada ou aguardar a reabertura.
                                </div>
                            )}

                            <div className="flex gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setStep("fulfillment")}
                                >
                                    Voltar
                                </Button>

                                <Button
                                    className="flex-[2]"
                                    disabled={
                                        loading ||
                                        !isPaymentValid ||
                                        (fulfillmentType === "delivery" && !!settings && !isDeliveryOpen)
                                    }
                                    onClick={handleConfirmDelivery}
                                >
                                    {loading ? "Enviando..." : "Confirmar pedido"}
                                </Button>
                            </div>

                            {submitError && (
                                <p className="text-xs text-red-600">{submitError}</p>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
