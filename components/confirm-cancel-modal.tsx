"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ConfirmModalProps {
    open: boolean
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    loading?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export function ConfirmModal({
    open,
    title = "Confirmar ação",
    description = "Tem certeza que deseja continuar?",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardContent className="p-5 space-y-4">
                    <div>
                        <h3 className="text-lg font-bold">{title}</h3>
                        {description && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            {cancelText}
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            disabled={loading}
                        >
                            {loading ? "Processando..." : confirmText}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
