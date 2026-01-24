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
  0: [
    {
      id: "01",
      name: "Creme de galinha",
      description: "Frango, Milho e Creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 13.0 },
        { size: "G", label: "Grande", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "02",
      name: "Vatapá",
      description: "Frango, azeite de dendê e leite de coco (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 13.0 },
        { size: "G", label: "Grande", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "03",
      name: "Galinha Escandalosa",
      description: "Frango, calabresa, milho, azeitona, molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "04",
      name: "Carne Trinchada",
      description: "Carne, cebola e pimentão (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "05",
      name: "Strogonoff de Carne",
      description: "Carne ao molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
    },
    {
      id: "06",
      name: "bobo de camarão",
      description: "Camarão, azeite de dendê, leite de coco e molho de macaxeira (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "07",
      name: "Fricassé de carne do sol",
      description: "Carne do sol, molho branco, requeijão, queijo e batata palha (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "08",
      name: "Macarronada",
      description: "Carne moida, molho de tomate, molho branco, milho, queijo, presunto e ovos",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "09",
      name: "Lasanha de carne",
      description: "Carne, queijo, presunto e molho branco",
      sizes: [
        { size: "U", label: "Único", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "10",
      name: "Lasanha de frango",
      description: "Frango, queijo, presunto e molho branco",
      sizes: [
        { size: "U", label: "Único", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "11",
      name: "Lasanha de Mista",
      description: "Frango, carne, queijo, presunto e molho branco",
      sizes: [
        { size: "U", label: "Único", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "12",
      name: "Lasanha Completa",
      description: "Lasanha, arroz, salada e farofa",
      sizes: [
        { size: "U", label: "Único", price: 19.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "13",
      name: "Canja",
      description: "Frango, creme e arroz",
      sizes: [
        { size: "U", label: "Único", price: 13.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "14",
      name: "Sopa",
      description: "Carne, arroz, macarrão e legumes",
      sizes: [
        { size: "U", label: "Único", price: 13.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "15",
      name: "Creme",
      description: "Frango, Milho e Creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "16",
      name: "Vatapá",
      description: "Frango, azeite de dendê e leite de coco (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "17",
      name: "Galinha Escandalosa",
      description: "Frango, calabresa, milho, azeitona e molho de tomate (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "U", label: "Por grama", price: 0 },
      ],
      category: "Porções",
      soldByWeight: true,
      pricePerKg: 68.0,
    },
    {
      id: "18",
      name: "Strogonoff",
      description: "Carne ao molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "U", label: "Único", price: 0 },
      ],
      category: "Porções",
      soldByWeight: false,
    },
    {
      id: "19",
      name: "Maracujá",
      description: "Suco de maracujá",
      sizes: [
        { size: "U", label: "Único", price: 6.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "20",
      name: "Cajá",
      description: "Suco de cajá",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "21",
      name: "Acerola",
      description: "Suco de acerola",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "22",
      name: "Goiaba",
      description: "Suco de goiaba",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "23",
      name: "Manga",
      description: "Suco de manga",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "24",
      name: "Maracujá",
      description: "Suco de maracujá",
      sizes: [
        { size: "U", label: "Único", price: 13.0 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "25",
      name: "Cajá",
      description: "Suco de cajá",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "26",
      name: "Acerola",
      description: "Suco de acerola",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "27",
      name: "Goiaba",
      description: "Suco de goiaba",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "28",
      name: "Manga",
      description: "Suco de manga",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "29",
      name: "Pitchulinha",
      description: "Guaraná e pepsi",
      sizes: [
        { size: "U", label: "Único", price: 3.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "30",
      name: "Pitchulinha Coca",
      description: "Coca-cola 200ml",
      sizes: [
        { size: "U", label: "Único", price: 4.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "31",
      name: "Lata 350ml",
      description: "Refrigerantes 300ml",
      sizes: [
        { size: "U", label: "Único", price: 5.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "32",
      name: "Coca Cola 600ml",
      description: "Refrigerante Coca-cola 600ml",
      sizes: [
        { size: "U", label: "Único", price: 6.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "33",
      name: "Refrigerante 1l",
      description: "Refrigerante 1l",
      sizes: [
        { size: "U", label: "Único", price: 9.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "34",
      name: "Refrigerante 2l",
      description: "Refrigarante 2l",
      sizes: [
        { size: "U", label: "Único", price: 13.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "35",
      name: "Pavê",
      description: "Pavê",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "36",
      name: "Pudim",
      description: "Pudim de leite",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "37",
      name: "Mousse de morango",
      description: "Mousse de morango",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "38",
      name: "Mousse de maracujá",
      description: "Mousse de maracujá",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "39",
      name: "Delícia de abacaxi",
      description: "Delícia de abacaxi",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
  ],
  1: [
    {
      id: "01",
      name: "Creme de galinha",
      description: "Frango, Milho e Creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 13.0 },
        { size: "G", label: "Grande", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "02",
      name: "Vatapá",
      description: "Frango, azeite de dendê e leite de coco (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 13.0 },
        { size: "G", label: "Grande", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "03",
      name: "Galinha Escandalosa",
      description: "Frango, calabresa, milho, azeitona, molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "04",
      name: "Carne Trinchada",
      description: "Carne, cebola e pimentão (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "05",
      name: "Strogonoff de Carne",
      description: "Carne ao molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
    },
    {
      id: "06",
      name: "Maria Isabel",
      description: "Arroz, calabresa, bacon, carne, ovos",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "07",
      name: "Lasanha de carne",
      description: "Carne, queijo, presunto e molho branco",
      sizes: [
        { size: "U", label: "Único", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "08",
      name: "Lasanha de frango",
      description: "Frango, queijo, presunto e molho branco",
      sizes: [
        { size: "U", label: "Único", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "09",
      name: "Lasanha Completa",
      description: "Lasanha, arroz, salada e farofa",
      sizes: [
        { size: "U", label: "Único", price: 19.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "10",
      name: "Canja",
      description: "Frango, creme e arroz",
      sizes: [
        { size: "U", label: "Único", price: 13.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "11",
      name: "Sopa",
      description: "Carne, arroz, macarrão e legumes",
      sizes: [
        { size: "U", label: "Único", price: 13.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "12",
      name: "Creme",
      description: "Frango, Milho e Creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "13",
      name: "Vatapá",
      description: "Frango, azeite de dendê e leite de coco (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "14",
      name: "Galinha Escandalosa",
      description: "Frango, calabresa, milho, azeitona e molho de tomate (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "U", label: "Por grama", price: 0 },
      ],
      category: "Porções",
      soldByWeight: true,
      pricePerKg: 68.0,
    },
    {
      id: "15",
      name: "Strogonoff",
      description: "Carne ao molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "U", label: "Único", price: 0 },
      ],
      category: "Porções",
      soldByWeight: true,
      pricePerKg: 68.0,
    },
    {
      id: "16",
      name: "Maracujá",
      description: "Suco de maracujá",
      sizes: [
        { size: "U", label: "Único", price: 6.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "17",
      name: "Cajá",
      description: "Suco de cajá",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "18",
      name: "Acerola",
      description: "Suco de acerola",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "19",
      name: "Goiaba",
      description: "Suco de goiaba",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "20",
      name: "Manga",
      description: "Suco de manga",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "21",
      name: "Maracujá",
      description: "Suco de maracujá",
      sizes: [
        { size: "U", label: "Único", price: 13.0 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "22",
      name: "Cajá",
      description: "Suco de cajá",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "23",
      name: "Acerola",
      description: "Suco de acerola",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "24",
      name: "Goiaba",
      description: "Suco de goiaba",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "25",
      name: "Manga",
      description: "Suco de manga",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "26",
      name: "Pitchulinha",
      description: "Guaraná e pepsi",
      sizes: [
        { size: "U", label: "Único", price: 3.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "27",
      name: "Pitchulinha Coca",
      description: "Coca-cola 200ml",
      sizes: [
        { size: "U", label: "Único", price: 4.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "28",
      name: "Lata 350ml",
      description: "Refrigerantes 300ml",
      sizes: [
        { size: "U", label: "Único", price: 5.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "29",
      name: "Coca Cola 600ml",
      description: "Refrigerante Coca-cola 600ml",
      sizes: [
        { size: "U", label: "Único", price: 6.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "30",
      name: "Refrigerante 1l",
      description: "Refrigerante 1l",
      sizes: [
        { size: "U", label: "Único", price: 9.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "31",
      name: "Refrigerante 2l",
      description: "Refrigarante 2l",
      sizes: [
        { size: "U", label: "Único", price: 13.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "32",
      name: "Pavê",
      description: "Pavê",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "33",
      name: "Pudim",
      description: "Pudim de leite",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "34",
      name: "Mousse de morango",
      description: "Mousse de morango",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "35",
      name: "Mousse de maracujá",
      description: "Mousse de maracujá",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "36",
      name: "Delícia de abacaxi",
      description: "Delícia de abacaxi",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
  ],
  2: [/* terça */],
  3: [/* quarta */],
  4: [
    {
      id: "01",
      name: "Creme de galinha",
      description: "Frango, Milho e Creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 13.0 },
        { size: "G", label: "Grande", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "02",
      name: "Vatapá",
      description: "Frango, azeite de dendê e leite de coco (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 13.0 },
        { size: "G", label: "Grande", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "03",
      name: "Galinha Escandalosa",
      description: "Frango, calabresa, milho, azeitona, molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "04",
      name: "Carne Trinchada",
      description: "Carne, cebola e pimentão (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "05",
      name: "Strogonoff de Carne",
      description: "Carne ao molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
    },
    {
      id: "06",
      name: "Baião de dois c/ asinha de frango",
      description: "Arroz, feijão, asinha de frango",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "07",
      name: "Picadinho ao molho madeira",
      description: "Carne ao molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
    },
    {
      id: "08",
      name: "Lasanha de carne",
      description: "Carne, queijo, presunto e molho branco",
      sizes: [
        { size: "U", label: "Único", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "09",
      name: "Lasanha de frango",
      description: "Frango, queijo, presunto e molho branco",
      sizes: [
        { size: "U", label: "Único", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "10",
      name: "Lasanha Completa",
      description: "Lasanha, arroz, salada e farofa",
      sizes: [
        { size: "U", label: "Único", price: 19.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "11",
      name: "Canja",
      description: "Frango, creme e arroz",
      sizes: [
        { size: "U", label: "Único", price: 13.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "12",
      name: "Sopa",
      description: "Carne, arroz, macarrão e legumes",
      sizes: [
        { size: "U", label: "Único", price: 13.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "13",
      name: "Creme",
      description: "Frango, Milho e Creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "14",
      name: "Vatapá",
      description: "Frango, azeite de dendê e leite de coco (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "15",
      name: "Galinha Escandalosa",
      description: "Frango, calabresa, milho, azeitona e molho de tomate (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "U", label: "Por grama", price: 0 },
      ],
      category: "Porções",
      soldByWeight: true,
      pricePerKg: 68.0,
    },
    {
      id: "16",
      name: "Strogonoff",
      description: "Carne ao molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "U", label: "Único", price: 0 },
      ],
      category: "Porções",
      soldByWeight: true,
      pricePerKg: 68.0,
    },
    {
      id: "17",
      name: "Maracujá",
      description: "Suco de maracujá",
      sizes: [
        { size: "U", label: "Único", price: 6.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "18",
      name: "Cajá",
      description: "Suco de cajá",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "19",
      name: "Acerola",
      description: "Suco de acerola",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "20",
      name: "Goiaba",
      description: "Suco de goiaba",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "21",
      name: "Manga",
      description: "Suco de manga",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "22",
      name: "Maracujá",
      description: "Suco de maracujá",
      sizes: [
        { size: "U", label: "Único", price: 13.0 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "23",
      name: "Cajá",
      description: "Suco de cajá",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "24",
      name: "Acerola",
      description: "Suco de acerola",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "25",
      name: "Goiaba",
      description: "Suco de goiaba",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "26",
      name: "Manga",
      description: "Suco de manga",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "27",
      name: "Pitchulinha",
      description: "Guaraná e pepsi",
      sizes: [
        { size: "U", label: "Único", price: 3.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "28",
      name: "Pitchulinha Coca",
      description: "Coca-cola 200ml",
      sizes: [
        { size: "U", label: "Único", price: 4.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "29",
      name: "Lata 350ml",
      description: "Refrigerantes 300ml",
      sizes: [
        { size: "U", label: "Único", price: 5.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "30",
      name: "Coca Cola 600ml",
      description: "Refrigerante Coca-cola 600ml",
      sizes: [
        { size: "U", label: "Único", price: 6.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "31",
      name: "Refrigerante 1l",
      description: "Refrigerante 1l",
      sizes: [
        { size: "U", label: "Único", price: 9.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "32",
      name: "Refrigerante 2l",
      description: "Refrigarante 2l",
      sizes: [
        { size: "U", label: "Único", price: 13.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "33",
      name: "Pavê",
      description: "Pavê",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "34",
      name: "Pudim",
      description: "Pudim de leite",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "35",
      name: "Mousse de morango",
      description: "Mousse de morango",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "36",
      name: "Mousse de maracujá",
      description: "Mousse de maracujá",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "37",
      name: "Delícia de abacaxi",
      description: "Delícia de abacaxi",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
  ],
  5: [
    {
      id: "01",
      name: "Creme de galinha",
      description: "Frango, Milho e Creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 13.0 },
        { size: "G", label: "Grande", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "02",
      name: "Vatapá",
      description: "Frango, azeite de dendê e leite de coco (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 13.0 },
        { size: "G", label: "Grande", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "03",
      name: "Galinha Escandalosa",
      description: "Frango, calabresa, milho, azeitona, molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "04",
      name: "Carne Trinchada",
      description: "Carne, cebola e pimentão (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "05",
      name: "Strogonoff de Carne",
      description: "Carne ao molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
    },
    {
      id: "06",
      name: "Macarronada",
      description: "Carne moída, molho de tomate, molho branco, milho, queijo, presunto, ovos",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "07",
      name: "Lasanha de carne",
      description: "Carne, queijo, presunto e molho branco",
      sizes: [
        { size: "U", label: "Único", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "08",
      name: "Lasanha de frango",
      description: "Frango, queijo, presunto e molho branco",
      sizes: [
        { size: "U", label: "Único", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "09",
      name: "Lasanha Completa",
      description: "Lasanha, arroz, salada e farofa",
      sizes: [
        { size: "U", label: "Único", price: 19.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "10",
      name: "Canja",
      description: "Frango, creme e arroz",
      sizes: [
        { size: "U", label: "Único", price: 13.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "11",
      name: "Sopa",
      description: "Carne, arroz, macarrão e legumes",
      sizes: [
        { size: "U", label: "Único", price: 13.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "12",
      name: "Creme",
      description: "Frango, Milho e Creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "13",
      name: "Vatapá",
      description: "Frango, azeite de dendê e leite de coco (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "14",
      name: "Galinha Escandalosa",
      description: "Frango, calabresa, milho, azeitona e molho de tomate (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "U", label: "Por grama", price: 0 },
      ],
      category: "Porções",
      soldByWeight: true,
      pricePerKg: 68.0,
    },
    {
      id: "15",
      name: "Strogonoff",
      description: "Carne ao molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "U", label: "Único", price: 0 },
      ],
      category: "Porções",
      soldByWeight: true,
      pricePerKg: 68.0,
    },
    {
      id: "16",
      name: "Maracujá",
      description: "Suco de maracujá",
      sizes: [
        { size: "U", label: "Único", price: 6.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "17",
      name: "Cajá",
      description: "Suco de cajá",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "18",
      name: "Acerola",
      description: "Suco de acerola",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "19",
      name: "Goiaba",
      description: "Suco de goiaba",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "20",
      name: "Manga",
      description: "Suco de manga",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "21",
      name: "Maracujá",
      description: "Suco de maracujá",
      sizes: [
        { size: "U", label: "Único", price: 13.0 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "22",
      name: "Cajá",
      description: "Suco de cajá",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "23",
      name: "Acerola",
      description: "Suco de acerola",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "24",
      name: "Goiaba",
      description: "Suco de goiaba",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "25",
      name: "Manga",
      description: "Suco de manga",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "26",
      name: "Pitchulinha",
      description: "Guaraná e pepsi",
      sizes: [
        { size: "U", label: "Único", price: 3.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "27",
      name: "Pitchulinha Coca",
      description: "Coca-cola 200ml",
      sizes: [
        { size: "U", label: "Único", price: 4.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "28",
      name: "Lata 350ml",
      description: "Refrigerantes 300ml",
      sizes: [
        { size: "U", label: "Único", price: 5.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "29",
      name: "Coca Cola 600ml",
      description: "Refrigerante Coca-cola 600ml",
      sizes: [
        { size: "U", label: "Único", price: 6.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "30",
      name: "Refrigerante 1l",
      description: "Refrigerante 1l",
      sizes: [
        { size: "U", label: "Único", price: 9.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "31",
      name: "Refrigerante 2l",
      description: "Refrigarante 2l",
      sizes: [
        { size: "U", label: "Único", price: 13.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "32",
      name: "Pavê",
      description: "Pavê",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "33",
      name: "Pudim",
      description: "Pudim de leite",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "34",
      name: "Mousse de morango",
      description: "Mousse de morango",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "35",
      name: "Mousse de maracujá",
      description: "Mousse de maracujá",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "36",
      name: "Delícia de abacaxi",
      description: "Delícia de abacaxi",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
  ],
  6: [
    {
      id: "01",
      name: "Creme de galinha",
      description: "Frango, Milho e Creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 13.0 },
        { size: "G", label: "Grande", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "02",
      name: "Vatapá",
      description: "Frango, azeite de dendê e leite de coco (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 13.0 },
        { size: "G", label: "Grande", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "03",
      name: "Galinha Escandalosa",
      description: "Frango, calabresa, milho, azeitona, molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "04",
      name: "Carne Trinchada",
      description: "Carne, cebola e pimentão (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "05",
      name: "Strogonoff de Carne",
      description: "Carne ao molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
    },
    {
      id: "06",
      name: "bobo de camarão",
      description: "Camarão, azeite de dendê, leite de coco e molho de macaxeira (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "07",
      name: "Fricassé de frango",
      description: "Frango, molho branco, requeijão, maçã, queijo e batata palha (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "08",
      name: "Lasanha de carne",
      description: "Carne, queijo, presunto e molho branco",
      sizes: [
        { size: "U", label: "Único", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "09",
      name: "Lasanha de frango",
      description: "Frango, queijo, presunto e molho branco",
      sizes: [
        { size: "U", label: "Único", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "10",
      name: "Lasanha Mista",
      description: "Frango, carne, queijo, presunto e molho branco",
      sizes: [
        { size: "U", label: "Único", price: 16.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "11",
      name: "Lasanha Completa",
      description: "Lasanha, arroz, salada e farofa",
      sizes: [
        { size: "U", label: "Único", price: 19.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "12",
      name: "Canja",
      description: "Frango, creme e arroz",
      sizes: [
        { size: "U", label: "Único", price: 13.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "13",
      name: "Sopa",
      description: "Carne, arroz, macarrão e legumes",
      sizes: [
        { size: "U", label: "Único", price: 13.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "14",
      name: "Creme",
      description: "Frango, Milho e Creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "15",
      name: "Vatapá",
      description: "Frango, azeite de dendê e leite de coco (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "P", label: "Pequeno", price: 15.0 },
        { size: "G", label: "Grande", price: 18.0 },
      ],
      category: "Pratos",
      soldByWeight: false,
    },
    {
      id: "16",
      name: "Galinha Escandalosa",
      description: "Frango, calabresa, milho, azeitona e molho de tomate (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "U", label: "Por grama", price: 0 },
      ],
      category: "Porções",
      soldByWeight: true,
      pricePerKg: 68.0,
    },
    {
      id: "17",
      name: "Strogonoff",
      description: "Carne ao molho de tomate e creme de leite (acompanha arroz, salada e farofa)",
      sizes: [
        { size: "U", label: "Único", price: 0 },
      ],
      category: "Porções",
      soldByWeight: true,
      pricePerKg: 68.0,
    },
    {
      id: "18",
      name: "Maracujá",
      description: "Suco de maracujá",
      sizes: [
        { size: "U", label: "Único", price: 6.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "19",
      name: "Cajá",
      description: "Suco de cajá",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "20",
      name: "Acerola",
      description: "Suco de acerola",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "21",
      name: "Goiaba",
      description: "Suco de goiaba",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "22",
      name: "Manga",
      description: "Suco de manga",
      sizes: [
        { size: "U", label: "Único", price: 5.50 },
      ],
      category: "Copos 500 ml",
      soldByWeight: false,
    },
    {
      id: "23",
      name: "Maracujá",
      description: "Suco de maracujá",
      sizes: [
        { size: "U", label: "Único", price: 13.0 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "24",
      name: "Cajá",
      description: "Suco de cajá",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "25",
      name: "Acerola",
      description: "Suco de acerola",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "26",
      name: "Goiaba",
      description: "Suco de goiaba",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "27",
      name: "Manga",
      description: "Suco de manga",
      sizes: [
        { size: "U", label: "Único", price: 11.00 },
      ],
      category: "Jarra 1l",
      soldByWeight: false,
    },
    {
      id: "28",
      name: "Pitchulinha",
      description: "Guaraná e pepsi",
      sizes: [
        { size: "U", label: "Único", price: 3.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "29",
      name: "Pitchulinha Coca",
      description: "Coca-cola 200ml",
      sizes: [
        { size: "U", label: "Único", price: 4.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "30",
      name: "Lata 350ml",
      description: "Refrigerantes 300ml",
      sizes: [
        { size: "U", label: "Único", price: 5.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "31",
      name: "Coca Cola 600ml",
      description: "Refrigerante Coca-cola 600ml",
      sizes: [
        { size: "U", label: "Único", price: 6.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "32",
      name: "Refrigerante 1l",
      description: "Refrigerante 1l",
      sizes: [
        { size: "U", label: "Único", price: 9.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "33",
      name: "Refrigerante 2l",
      description: "Refrigarante 2l",
      sizes: [
        { size: "U", label: "Único", price: 13.00 },
      ],
      category: "Refrigerantes",
      soldByWeight: false,
    },
    {
      id: "34",
      name: "Pavê",
      description: "Pavê",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "35",
      name: "Pudim",
      description: "Pudim de leite",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "36",
      name: "Mousse de morango",
      description: "Mousse de morango",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "37",
      name: "Mousse de maracujá",
      description: "Mousse de maracujá",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
    {
      id: "38",
      name: "Delícia de abacaxi",
      description: "Delícia de abacaxi",
      sizes: [
        { size: "U", label: "Único", price: 0.00 },
      ],
      category: "Sobremesas",
      soldByWeight: false,
    },
  ],
}

const DAY_LABELS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
]

export function getNextAvailableDay(startDay: number) {
  for (let i = 0; i < 7; i++) {
    const day = (startDay + i) % 7
    if (menuByDay[day]?.length) {
      return day
    }
  }
  return startDay
}

export function getActiveMenu() {
  const today = new Date().getDay()
  const activeDay = getNextAvailableDay(today)

  const menu = menuByDay[activeDay] ?? []

  const categories = Array.from(
    new Set(menu.map((item) => item.category))
  )

  return {
    dayIndex: activeDay,
    dayLabel: DAY_LABELS[activeDay],
    menu,
    categories,
  }
} 