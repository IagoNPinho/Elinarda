import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await req.json()

  if (!status) {
    return NextResponse.json(
      { error: "Status obrigatório" },
      { status: 400 }
    )
  }

  const { error } = await supabaseServer
    .from("orders")
    .update({ status })
    .eq("id", params.id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
