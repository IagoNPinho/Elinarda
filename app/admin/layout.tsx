"use client"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen bg-background">
            {/* HEADER FIXO */}
            <header className="sticky top-0 bg-primary text-primary-foreground p-4 shadow-md z-10">
                <div className="max-w-2xl mx-auto flex items-center gap-3">
                    <img src="/logo.svg" alt="Restaurante" className="w-12 h-12" />
                    <div>
                        <h1 className="text-xl font-extrabold tracking-wide">
                            Administração
                        </h1>
                        <p className="text-sm opacity-90">Configurações</p>
                    </div>
                </div>
            </header>

            {children}

            <style>{`
        @media print {
          header, button, .no-print {
            display: none !important;
          }
          body {
            background: white;
          }
          .max-w-2xl {
            max-width: 100%;
          }
        }
      `}</style>
        </main>
    )
}
