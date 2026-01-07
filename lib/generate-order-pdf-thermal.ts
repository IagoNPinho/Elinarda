import jsPDF from "jspdf"
import type { Order } from "@/components/cart-provider"

interface ThermalOptions {
  width: 58 | 80
}

export function generateOrderThermalPDF(
  order: Order,
  options: ThermalOptions = { width: 58 },
) {
  const pageWidth = options.width
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [pageWidth, 300], // altura grande, ajusta depois
  })

  let y = 8
  const left = 4
  const right = pageWidth - 4

  /* ===== HEADER ===== */
  doc.setFontSize(12)
  doc.text("PEDIDO", pageWidth / 2, y, { align: "center" })

  y += 6
  doc.setFontSize(9)
  doc.text(`Pedido #${order.id}`, left, y)
  y += 4
  doc.text(`Mesa ${order.mesa}`, left, y)
  y += 4
  doc.text(new Date().toLocaleString("pt-BR"), left, y)

  y += 4
  doc.line(left, y, right, y)
  y += 4

  /* ===== ITENS ===== */
  doc.setFontSize(9)

  order.items.forEach((item) => {
    // Linha 1: nome
    doc.text(item.name, left, y)
    y += 4

    // Linha 2: detalhe
    let detail = ""

    if (item.weightInGrams) {
      detail = `${item.weightInGrams}g (vendido por peso)`
    } else {
      detail = `${item.quantity}x ${item.sizeLabel}`
    }

    doc.text(detail, left + 2, y)
    y += 4

    // Linha 3: valor
    doc.text(
      `R$ ${item.price.toFixed(2).replace(".", ",")}`,
      right,
      y,
      { align: "right" },
    )

    y += 5

    if (y > 280) {
      doc.addPage()
      y = 8
    }
  })

  /* ===== TOTAL ===== */
  y += 2
  doc.line(left, y, right, y)
  y += 5

  doc.setFontSize(11)
  doc.text("TOTAL", left, y)
  doc.text(
    `R$ ${order.total.toFixed(2).replace(".", ",")}`,
    right,
    y,
    { align: "right" },
  )

  y += 8
  doc.setFontSize(8)
  doc.text(
    "Documento gerado automaticamente",
    pageWidth / 2,
    y,
    { align: "center" },
  )

  doc.save(`pedido-${order.id}-termica.pdf`)
}
