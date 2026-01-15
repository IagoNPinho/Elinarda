export interface MenuItem {
  id: string
  name: string
  description: string
  sizes: {
    size: "P" | "G" | "U"
    label: string
    price: number
  }[]
  category: string
  soldByWeight?: boolean
  pricePerKg?: number
}

export const menuByDay: Record<number, MenuItem[]> = {
  0: [/* domingo */],
  1: [/* segunda */],
  2: [/* terça */],
  3: [/* quarta */],
  4: [/* quinta */],
  5: [/* sexta */],
  6: [/* sábado */],
}

const today = new Date().getDay()
export const menuItems = menuByDay[today]


//export const menuItems: MenuItem[] = [
//  // 🍽️ PRATOS PRINCIPAIS
//  {
//    id: "creme-galinha",
//    name: "Creme de Galinha",
//    description: "Frango, milho e creme de leite (acompanha arroz, salada e farofa)",
//    sizes: [
//      { size: "P", label: "Pequeno", price: 13.0 },
//      { size: "G", label: "Grande", price: 16.0 },
//    ],
//    category: "Pratos",
//  },
//  {
//    id: "vatapa",
//    name: "Vatapá",
//    description: "Frango, azeite de dendê e leite de coco (acompanha arroz, salada e farofa)",
//    sizes: [
//      { size: "P", label: "Pequeno", price: 13.0 },
//      { size: "G", label: "Grande", price: 16.0 },
//    ],
//    category: "Pratos",
//  },
//  {
//    id: "galinha-escandalosa",
//    name: "Galinha Escandalosa",
//    description: "Frango, calabresa, milho, azeitona e molho de tomate (acompanha arroz, salada e farofa)",
//    sizes: [
//      { size: "P", label: "Pequeno", price: 15.0 },
//      { size: "G", label: "Grande", price: 18.0 },
//    ],
//    category: "Pratos",
//  },
//  {
//    id: "carne-trinchada",
//    name: "Carne Trinchada",
//    description: "Carne, cebola e pimentão (acompanha arroz, salada e farofa)",
//    sizes: [
//      { size: "P", label: "Pequeno", price: 15.0 },
//      { size: "G", label: "Grande", price: 18.0 },
//    ],
//    category: "Pratos",
//  },
//  {
//    id: "strogonoff-carne",
//    name: "Strogonoff de Carne",
//    description: "Carne ao molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
//    sizes: [
//      { size: "P", label: "Pequeno", price: 15.0 },
//      { size: "G", label: "Grande", price: 18.0 },
//    ],
//    category: "Pratos",
//  },
//  {
//    id: "bobo-camarao",
//    name: "Bobó de Camarão",
//    description: "Camarão, azeite de dendê, leite de coco e molho de macaxeira (acompanha arroz, salada e farofa)",
//    sizes: [
//      { size: "P", label: "Pequeno", price: 15.0 },
//      { size: "G", label: "Grande", price: 18.0 },
//    ],
//    category: "Pratos",
//  },
//  {
//    id: "fricasse-carne-sol",
//    name: "Fricassê de Carne do Sol",
//    description: "Carne do sol, molho branco, requeijão, queijo e batata palha (acompanha arroz, salada e farofa)",
//    sizes: [
//      { size: "P", label: "Pequeno", price: 15.0 },
//      { size: "G", label: "Grande", price: 18.0 },
//    ],
//    category: "Pratos",
//  },
//  {
//    id: "macarronada",
//    name: "Macarronada",
//    description: "Carne moída, molho de tomate, molho branco, milho, queijo, presunto e ovos",
//    sizes: [
//      { size: "P", label: "Pequeno", price: 15.0 },
//      { size: "G", label: "Grande", price: 18.0 },
//    ],
//    category: "Pratos",
//  },
//
//  // 🍝 LASANHAS
//  {
//    id: "lasanha-carne",
//    name: "Lasanha de Carne",
//    description: "Carne, queijo, presunto e molho branco",
//    sizes: [{ size: "U", label: "Única", price: 16.0 }],
//    category: "Lasanhas",
//  },
//  {
//    id: "lasanha-frango",
//    name: "Lasanha de Frango",
//    description: "Frango, queijo, presunto e molho branco",
//    sizes: [{ size: "U", label: "Única", price: 16.0 }],
//    category: "Lasanhas",
//  },
//  {
//    id: "lasanha-mista",
//    name: "Lasanha Mista",
//    description: "Frango, carne, queijo, presunto e molho branco",
//    sizes: [{ size: "U", label: "Única", price: 16.0 }],
//    category: "Lasanhas",
//  },
//  {
//    id: "lasanha-completa",
//    name: "Lasanha Completa",
//    description: "Lasanha acompanhada de arroz, salada e farofa",
//    sizes: [{ size: "U", label: "Única", price: 19.0 }],
//    category: "Lasanhas",
//  },
//
//  // 🍲 SOPAS
//  {
//    id: "canja",
//    name: "Canja",
//    description: "Frango, creme e arroz",
//    sizes: [{ size: "U", label: "Única", price: 13.0 }],
//    category: "Sopas",
//  },
//  {
//    id: "sopa",
//    name: "Sopa",
//    description: "Carne, arroz, macarrão e legumes",
//    sizes: [{ size: "U", label: "Única", price: 13.0 }],
//    category: "Sopas",
//  },
//
//  // 🍱 PORÇÕES
//  {
//    id: "porcao-creme",
//    name: "Porção de Creme",
//    description: "Porção de creme",
//    sizes: [
//      { size: "P", label: "Pequena", price: 15.0 },
//      { size: "G", label: "Grande", price: 18.0 },
//    ],
//    category: "Porções",
//  },
//  {
//    id: "porcao-vatapa",
//    name: "Porção de Vatapá",
//    description: "Porção de vatapá",
//    sizes: [
//      { size: "P", label: "Pequena", price: 15.0 },
//      { size: "G", label: "Grande", price: 18.0 },
//    ],
//    category: "Porções",
//  },
//  {
//    id: "porcao-escandalosa",
//    name: "Escandalosa",
//    description: "Porção vendida por peso",
//    soldByWeight: true,
//    pricePerKg: 68.0,
//    sizes: [
//      {
//        size: "U",
//        label: "Por grama",
//        price: 0, // preço calculado dinamicamente
//      },
//    ],
//    category: "Porções",
//  },
//  {
//    id: "porcao-strogonoff",
//    name: "Strogonoff",
//    description: "Porção vendida por peso",
//    soldByWeight: true,
//    pricePerKg: 68.0,
//    sizes: [
//      {
//        size: "U",
//        label: "Por grama",
//        price: 0, // preço calculado dinamicamente
//      },
//    ],
//    category: "Porções",
//  },
//]

export const categories = [
  ...new Set(menuItems.map((item) => item.category)),
]