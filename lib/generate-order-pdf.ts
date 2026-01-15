import jsPDF from "jspdf"
import type { Order } from "@/lib/orders"

export function generateOrderPDF(order: Order) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  let y = 20

  /* ===== HEADER ===== */
  doc.setFontSize(16)
  doc.text("PEDIDO", 105, y, { align: "center" })

  y += 10
  doc.setFontSize(11)
  doc.text(`Pedido: #${order.id}`, 20, y)
  doc.text(`Mesa: ${order.table_number}`, 150, y)

  y += 6
  doc.text(`Data: ${new Date().toLocaleString("pt-BR")}`, 20, y)

  y += 8
  doc.line(20, y, 190, y)
  y += 6

  /* ===== TABELA HEADER ===== */
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")

  doc.text("Item", 20, y)
  doc.text("Peso / Qtd", 110, y, { align: "center" })
  doc.text("Valor", 180, y, { align: "right" })

  doc.setFont("helvetica", "normal")
  y += 4
  doc.line(20, y, 190, y)
  y += 6

  /* ===== ITENS ===== */
  order.items.forEach((item) => {
    const itemLabel = item.name
    const amountLabel = item.weightInGrams
      ? `${item.weightInGrams} g`
      : `${item.quantity} un`

    const priceLabel = `R$ ${item.price.toFixed(2).replace(".", ",")}`

    doc.text(itemLabel, 20, y)
    doc.text(amountLabel, 110, y, { align: "center" })
    doc.text(priceLabel, 180, y, { align: "right" })

    y += 6

    // observação automática para itens por peso
    if (item.weightInGrams) {
      doc.setFontSize(9)
      doc.setTextColor(120)
      doc.text("• Vendido por peso", 22, y)
      doc.setTextColor(0)
      doc.setFontSize(11)
      y += 5
    }

    // quebra de página
    if (y > 270) {
      doc.addPage()
      y = 20
    }
  })

  /* ===== TOTAL ===== */
  y += 6
  doc.line(20, y, 190, y)
  y += 8

  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.text("TOTAL", 140, y)
  doc.text(
    `R$ ${order.total.toFixed(2).replace(".", ",")}`,
    180,
    y,
    { align: "right" },
  )

  /* ===== FOOTER ===== */
  y += 15
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text(
    "Documento gerado automaticamente pelo sistema do restaurante.",
    105,
    y,
    { align: "center" },
  )

  doc.save(`pedido-${order.id}.pdf`)
}
