import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: settings, error } = await supabaseServer
    .from("delivery_settings")
    .select("id, is_open, delivery_open_time, delivery_close_time")
    .single()

  if (error || !settings) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }

  // Horário atual em Fortaleza (UTC-3, sem horário de verão)
  const nowInFortaleza = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Fortaleza" }),
  )
  const currentMin = nowInFortaleza.getHours() * 60 + nowInFortaleza.getMinutes()

  const openTime  = settings.delivery_open_time  ?? "16:30"
  const closeTime = settings.delivery_close_time ?? "23:00"
  const shouldBeOpen = isWithinHours(currentMin, openTime, closeTime)

  if (settings.is_open === shouldBeOpen) {
    return NextResponse.json({
      ok: true,
      changed: false,
      is_open: settings.is_open,
      current_time: `${nowInFortaleza.getHours().toString().padStart(2, "0")}:${nowInFortaleza.getMinutes().toString().padStart(2, "0")}`,
    })
  }

  const { error: updateError } = await supabaseServer
    .from("delivery_settings")
    .update({ is_open: shouldBeOpen })
    .eq("id", settings.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    changed: true,
    is_open: shouldBeOpen,
    message: shouldBeOpen ? "Delivery aberto automaticamente" : "Delivery fechado automaticamente",
  })
}

function isWithinHours(currentMin: number, open: string, close: string): boolean {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number)
    return h * 60 + m
  }
  const openMin  = toMin(open)
  const closeMin = toMin(close)

  // Suporte a faixas que cruzam meia-noite (ex: 22:00 → 02:00)
  if (closeMin <= openMin) {
    return currentMin >= openMin || currentMin <= closeMin
  }
  return currentMin >= openMin && currentMin <= closeMin
}
