import { supabase } from "@/lib/supabase"
import type { Order, PaymentMethod } from "@/lib/orders"


export interface AdminReport {
  totalSold: number
  byPayment: Record<PaymentMethod, number>
  byOrigin: Record<"mesa" | "balcao" | "delivery", number>
  orders: Order[]
}

export async function fetchAdminReportByDate(
  date: Date
): Promise<AdminReport> {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)

  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString())
    .eq("status", "closed")
    .order("created_at", { ascending: false })

  if (error) throw error

  const orders = (data ?? []) as Order[]

  const totalSold = orders.reduce((sum, o) => sum + o.total, 0)

  const byPayment = orders.reduce((acc, o) => {
    if (!o.payment_method) return acc
    acc[o.payment_method] =
      (acc[o.payment_method] || 0) + o.total
    return acc
  }, {} as Record<PaymentMethod, number>)

  const byOrigin = orders.reduce((acc, o) => {
    acc[o.origin] = (acc[o.origin] || 0) + o.total
    return acc
  }, {} as Record<"mesa" | "balcao" | "delivery", number>)

  return {
    totalSold,
    byPayment,
    byOrigin,
    orders,
  }
}

export async function fetchAdminOrdersByDate(
  date: Date,
): Promise<Order[]> {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)

  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString())
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data ?? []) as Order[]
}
