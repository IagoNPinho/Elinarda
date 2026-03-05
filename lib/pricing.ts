import type { MenuProtein } from "@/lib/menu-components"

export type PratinhoSize = "P" | "G"

export function getProteinPrice(
  size: PratinhoSize,
  protein: MenuProtein,
) {
  return size === "P" ? protein.price_p : protein.price_g
}

function isLasagna(protein: MenuProtein) {
  return protein.type === "lasagna" || protein.is_lasagna === true
}

export function calculatePratinhoPrice(
  size: PratinhoSize,
  proteins: MenuProtein[],
) {
  if (!proteins.length) return 0

  if (proteins.length === 1) {
    return getProteinPrice(size, proteins[0])
  }

  const [p1, p2] = proteins
  const p1Price = getProteinPrice(size, p1)
  const p2Price = getProteinPrice(size, p2)

  const hasLasagna = isLasagna(p1) || isLasagna(p2)
  if (hasLasagna) {
    if (isLasagna(p1) && isLasagna(p2)) {
      return Math.max(p1Price, p2Price)
    }

    const base = isLasagna(p1) ? p1Price : p2Price
    const other = isLasagna(p1) ? p2 : p1

    if (other.type === "chicken" || other.type === "ground_meat") {
      return base + 1
    }
    if (other.type === "meat" || other.type === "shrimp") {
      return base + 2
    }
    return base + 1
  }

  const base = Math.max(p1Price, p2Price)

  const types = [p1.type, p2.type]
  const hasMeat = types.includes("meat")
  const hasShrimp = types.includes("shrimp")
  const hasChicken = types.includes("chicken")
  const hasGroundMeat = types.includes("ground_meat")

  if (hasGroundMeat && hasChicken && !hasMeat && !hasShrimp) {
    return base + 0
  }

  if (hasMeat && hasShrimp) return base + 2
  if (hasMeat && !hasShrimp && !hasChicken && !hasGroundMeat) return base + 2
  if (hasChicken && types[0] === "chicken" && types[1] === "chicken") return base + 1
  if (hasChicken && hasMeat) return base + 1
  if (hasChicken && hasShrimp) return base + 1

  return base + 1
}
