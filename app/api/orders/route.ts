import { NextResponse } from "next/server"
import { addOrder, getOrders, updateOrderStatus, type Order } from "@/lib/orders-store"

export async function GET() {
  const orders = getOrders()
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tableNumber, items, total } = body

    if (!tableNumber || !items || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const order = addOrder(tableNumber, items, total)
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    updateOrderStatus(id, status as Order["status"])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
