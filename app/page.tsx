import Link from "next/link"
import { UtensilsCrossed, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto pt-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-primary rounded-full mx-auto flex items-center justify-center mb-4">
            <img src="/logo.svg" alt="Restaurante" className="w-12 h-12" />
          </div>
          <h1 className="text-xl font-extrabold tracking-wide">Lá na calçada</h1>
          <p className="text-muted-foreground">Sistema de Pedidos</p>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold text-lg mb-3 text-foreground">Acessar Mesa</h2>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((table) => (
                  <Button
                    key={table}
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-16 text-lg font-semibold bg-transparent"
                  >
                    <Link href={`/mesa/${table}`}>Mesa {table}</Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button asChild size="lg" className="w-full font-semibold h-14">
            <Link href="/cozinha">
              <ChefHat className="w-5 h-5 mr-2" />
              Acessar Cozinha
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
