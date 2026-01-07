"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"

export interface CartItem {
  id: string
  itemId: string
  name: string
  size: string
  sizeLabel: string
  price: number
  quantity: number
  weightInGrams?: number
}

export interface Order {
  id: number
  mesa: number
  items: CartItem[]
  total: number
  status: "aberto" | "pronto"
}

interface CartContextType {
  items: CartItem[]
  tableNumber: number
  setTableNumber: (table: number) => void
  addItem: (item: Omit<CartItem, "id" | "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  orders: Order[]
  addOrder: (order: Order) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const generateId = () =>
  Date.now().toString() + Math.random().toString(36).slice(2)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [tableNumber, setTableNumber] = useState(1)

  // 🔥 PEDIDOS PERSISTIDOS
  const [orders, setOrders] = useState<Order[]>([])

  // 🔥 CARREGAR PEDIDOS DO LOCALSTORAGE
  useEffect(() => {
  const stored = localStorage.getItem("orders")
  console.log("🟡 ORDERS NO LOCALSTORAGE:", stored)

  if (stored) {
    setOrders(JSON.parse(stored))
  }
}, [])


  // 🔥 SALVAR PEDIDOS NO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders))
  }, [orders])

  const addItem = useCallback(
    (item: Omit<CartItem, "id" | "quantity">) => {
      setItems((prev) => {
        const existingItem = prev.find(
          (i) => i.itemId === item.itemId && i.size === item.size,
        )

        if (existingItem) {
          return prev.map((i) =>
            i.id === existingItem.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          )
        }

        return [
          ...prev,
          {
            ...item,
            id: generateId(),
            quantity: 1,
          },
        ]
      })
    },
    [],
  )

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id))
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item,
        ),
      )
    }
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [...prev, order])
  }, [])

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        tableNumber,
        setTableNumber,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        orders,
        addOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
