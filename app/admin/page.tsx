"use client"

import { useEffect, useState } from "react"
import { Check, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetchAdminOrdersByDate } from "@/lib/admin-reports"
import type { Order } from "@/lib/orders"
import { fetchDeliverySettings, updateDeliverySettings } from "@/lib/delivery-setting"
import { useRouter } from "next/navigation"


export default function AdminPage() {
  const router = useRouter()

  // Estados Delivery
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [isOpen, setIsOpen] = useState(true)
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [showSaved, setShowSaved] = useState(false)

  // Estados Relatório
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [totalSold, setTotalSold] = useState(0)
  const [byPayment, setByPayment] = useState<Record<string, number>>({})
  const [byOrigin, setByOrigin] = useState<Record<string, number>>({})

  // Estados de filtros
  const [originFilter, setOriginFilter] = useState<
    "all" | "mesa" | "balcao" | "delivery"
  >("all")

  const [statusFilter, setStatusFilter] = useState<
    "all" | Order["status"]
  >("all")

  // Filtro de pedidos
  const filteredOrders = orders.filter((order) => {
    const matchOrigin =
      originFilter === "all" || order.origin === originFilter

    const matchStatus =
      statusFilter === "all" || order.status === statusFilter

    return matchOrigin && matchStatus
  })


  // Carregar Orders por data
  useEffect(() => {
    const load = async () => {
      setLoading(true)

      try {
        const allOrders = await fetchAdminOrdersByDate(selectedDate)
        setOrders(allOrders)

        // 🔥 SOMENTE FECHADOS CONTAM NO CAIXA
        const closedOrders = allOrders.filter(
          (o) => o.status === "closed",
        )

        const total = closedOrders.reduce(
          (sum, o) => sum + o.total,
          0,
        )

        const byPayment = closedOrders.reduce((acc, o) => {
          if (!o.payment_method) return acc
          acc[o.payment_method] =
            (acc[o.payment_method] || 0) + o.total
          return acc
        }, {} as Record<string, number>)

        const byOrigin = closedOrders.reduce((acc, o) => {
          acc[o.origin] = (acc[o.origin] || 0) + o.total
          return acc
        }, {} as Record<string, number>)

        setTotalSold(total)
        setByPayment(byPayment)
        setByOrigin(byOrigin)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [selectedDate])


  // Carregar configurações de delivery
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchDeliverySettings()
        setDeliveryFee(settings.delivery_fee)
        setIsOpen(settings.is_open)
      } finally {
        setLoadingSettings(false)
      }
    }

    loadSettings()
  }, [])

  // Salvar Configurações de delivery
  const handleSave = async () => {
    await updateDeliverySettings({
      delivery_fee: deliveryFee,
      is_open: isOpen,
    })

    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 3000)
  }

  // Exportar CSV
  const handleExportCSV = () => {
    const rows: string[][] = []

    rows.push(["RELATÓRIO DE CAIXA"])
    rows.push([`Data: ${selectedDate.toLocaleDateString("pt-BR")}`])
    rows.push([])

    rows.push(["RESUMO"])
    rows.push(["Total Vendido", totalSold.toFixed(2)])
    rows.push([])

    rows.push(["POR FORMA DE PAGAMENTO"])
    Object.entries(byPayment).forEach(([method, value]) => {
      rows.push([method, value.toFixed(2)])
    })
    rows.push([])

    rows.push(["POR ORIGEM"])
    Object.entries(byOrigin).forEach(([origin, value]) => {
      rows.push([origin, value.toFixed(2)])
    })
    rows.push([])

    rows.push([
      "Pedido",
      "Origem",
      "Valor",
      "Pagamento",
      "Status",
      "Horário",
    ])

    orders.forEach((order) => {
      rows.push([
        order.id.slice(0, 6),
        order.origin,
        order.total.toFixed(2),
        order.payment_method ?? "-",
        order.status,
        new Date(order.created_at).toLocaleTimeString("pt-BR"),
      ])
    })

    const csv = rows.map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `caixa-${selectedDate
      .toISOString()
      .split("T")[0]}.csv`
    link.click()
  }


  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8 pb-8">
      {/* RESUMO DO CAIXA */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Resumo do Caixa</h2>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {selectedDate.toLocaleDateString("pt-BR")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
              />
            </PopoverContent>
          </Popover>

          <div className="text-3xl font-bold text-primary">
            <p className="text-3xl font-bold text-primary">
              {loading ? "Carregando..." : `R$ ${totalSold.toFixed(2)}`}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">
              Por forma de pagamento
            </p>

            {["dinheiro", "pix", "credito", "debito"].map((method) => (
              <div
                key={method}
                className="flex justify-between text-sm"
              >
                <span className="capitalize">{method}</span>
                <span className="font-medium">
                  R$ {(byPayment[method] || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t pt-4">
            <p className="text-sm font-semibold text-muted-foreground">
              Por origem do pedido
            </p>

            {["mesa", "balcao", "delivery"].map((origin) => (
              <div
                key={origin}
                className="flex justify-between text-sm"
              >
                <span className="capitalize">{origin}</span>
                <span className="font-medium">
                  R$ {(byOrigin[origin] || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>


          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* HISTÓRICO */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Histórico de Pedidos</h2>
          {/* FILTROS DO HISTÓRICO */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* FILTRO ORIGEM */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Origem:{" "}
                  {originFilter === "all"
                    ? "Todas"
                    : originFilter === "mesa"
                      ? "Mesa"
                      : originFilter === "balcao"
                        ? "Balcão"
                        : "Delivery"}{" "}
                  ▼
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-40 p-2 space-y-1">
                {[
                  { label: "Todas", value: "all" },
                  { label: "Mesa", value: "mesa" },
                  { label: "Balcão", value: "balcao" },
                  { label: "Delivery", value: "delivery" },
                ].map((opt) => (
                  <Button
                    key={opt.value}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() =>
                      setOriginFilter(opt.value as typeof originFilter)
                    }
                  >
                    {opt.label}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>

            {/* FILTRO STATUS */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Status:{" "}
                  {statusFilter === "all"
                    ? "Todos"
                    : statusFilter}{" "}
                  ▼
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-48 p-2 space-y-1">
                {[
                  { label: "Todos", value: "all" },
                  { label: "Aguardando", value: "pending" },
                  { label: "Em preparo", value: "preparing" },
                  { label: "Pronto", value: "ready" },
                  { label: "Saiu p/ entrega", value: "out_for_delivery" },
                  { label: "Finalizado", value: "closed" },
                ].map((opt) => (
                  <Button
                    key={opt.value}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() =>
                      setStatusFilter(opt.value as typeof statusFilter)
                    }
                  >
                    {opt.label}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Horário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => router.push(`/admin/pedidos/${order.id}`)}
                >
                  <TableCell className="font-medium">
                    #{order.id.slice(0, 6)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {order.origin}
                  </TableCell>
                  <TableCell>
                    R$ {order.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {order.payment_method ?? "-"}
                  </TableCell>
                  <TableCell>
                    {order.status}
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleTimeString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>

      {/* CONFIG DELIVERY */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-bold">Configurações do Delivery</h2>

          <div className="space-y-2">
            <Label>Taxa de entrega</Label>
            <Input
              type="number"
              step="0.01"
              value={deliveryFee}
              onChange={(e) =>
                setDeliveryFee(parseFloat(e.target.value) || 0)
              }
            />
          </div>

          <div className="space-y-3">
            <Label>Status do Delivery</Label>

            <div className="flex items-center justify-between gap-3 p-4 border rounded-lg">
              <div>
                <p className="font-semibold">
                  {isOpen ? "Delivery Aberto" : "Delivery Fechado"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isOpen
                    ? "Clientes podem realizar pedidos via delivery"
                    : "Pedidos via delivery estão temporariamente bloqueados"}
                </p>
              </div>

              <Button
                variant={isOpen ? "destructive" : "default"}
                onClick={() => setIsOpen((prev) => !prev)}
              >
                {isOpen ? "Fechar Delivery" : "Abrir Delivery"}
              </Button>
            </div>
          </div>


          <Button
            onClick={handleSave}
            className="w-full"
            disabled={loadingSettings}
          >
            Salvar
          </Button>

          {showSaved && (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-4 h-4" />
              Configuração salva
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
