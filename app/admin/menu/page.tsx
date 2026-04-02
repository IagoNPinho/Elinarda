"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  createBase,
  createOptional,
  createProtein,
  createSalad,
  fetchBases,
  fetchDailyMenu,
  fetchOptionals,
  fetchProteins,
  fetchSalads,
  toggleProteinActive,
  updateBase,
  updateOptional,
  updateProtein,
  updateSalad,
  upsertDailyMenu,
  type AdminBase,
  type AdminOptional,
  type AdminProtein,
  type AdminSalad,
} from "@/lib/admin-menu"
import {
  invalidateMenuComponents,
  invalidateMenuDaily,
} from "@/lib/menu-components"

const PROTEIN_TYPES = [
  "chicken",
  "meat",
  "ground_meat",
  "shrimp",
  "lasagna",
] as const

const DAY_LABELS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
]

export default function AdminMenuPage() {
  const [proteins, setProteins] = useState<AdminProtein[]>([])
  const [bases, setBases] = useState<AdminBase[]>([])
  const [salads, setSalads] = useState<AdminSalad[]>([])
  const [optionals, setOptionals] = useState<AdminOptional[]>([])
  const [dailyMenu, setDailyMenu] = useState<
    { day_of_week: number; protein_id: string; is_active: boolean }[]
  >([])

  const [editingProtein, setEditingProtein] =
    useState<AdminProtein | null>(null)
  const [editingBase, setEditingBase] =
    useState<AdminBase | null>(null)
  const [editingSalad, setEditingSalad] =
    useState<AdminSalad | null>(null)
  const [editingOptional, setEditingOptional] =
    useState<AdminOptional | null>(null)

  const [newBase, setNewBase] = useState("")
  const [newSalad, setNewSalad] = useState("")
  const [newOptionalName, setNewOptionalName] = useState("")
  const [newOptionalPrice, setNewOptionalPrice] = useState("0")

  const loadAll = async () => {
    const [p, b, s, o, d] = await Promise.all([
      fetchProteins(),
      fetchBases(),
      fetchSalads(),
      fetchOptionals(),
      fetchDailyMenu(),
    ])
    setProteins(p)
    setBases(b)
    setSalads(s)
    setOptionals(o)
    setDailyMenu(d)
  }

  useEffect(() => {
    loadAll()
  }, [])

  const dailyMap = useMemo(() => {
    const map: Record<number, Set<string>> = {}
    dailyMenu.forEach((row) => {
      if (!row.is_active) return
      if (!map[row.day_of_week]) map[row.day_of_week] = new Set()
      map[row.day_of_week].add(row.protein_id)
    })
    return map
  }, [dailyMenu])

  const handleInvalidate = () => {
    invalidateMenuComponents()
    invalidateMenuDaily()
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-10">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Proteí­nas</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Preço P</TableHead>
                <TableHead>Preço G</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proteins.map((protein) => (
                <TableRow key={protein.id}>
                  <TableCell>{protein.name}</TableCell>
                  <TableCell>{protein.type}</TableCell>
                  <TableCell>R$ {protein.price_p.toFixed(2)}</TableCell>
                  <TableCell>R$ {protein.price_g.toFixed(2)}</TableCell>
                  <TableCell>{protein.is_active ? "Sim" : "Não"}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingProtein(protein)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant={protein.is_active ? "destructive" : "default"}
                      onClick={async () => {
                        await toggleProteinActive(protein.id, !protein.is_active)
                        await loadAll()
                        handleInvalidate()
                      }}
                    >
                      {protein.is_active ? "Desativar" : "Ativar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Bases</h2>
          <div className="flex gap-2">
            <Input
              value={newBase}
              onChange={(e) => setNewBase(e.target.value)}
              placeholder="Nova base"
            />
            <Button
              onClick={async () => {
                if (!newBase.trim()) return
                await createBase({ name: newBase, is_active: true })
                setNewBase("")
                await loadAll()
                handleInvalidate()
              }}
            >
              Adicionar
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bases.map((base) => (
                <TableRow key={base.id}>
                  <TableCell>{base.name}</TableCell>
                  <TableCell>{base.is_active ? "Sim" : "Não"}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingBase(base)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant={base.is_active ? "destructive" : "default"}
                      onClick={async () => {
                        await updateBase(base.id, { is_active: !base.is_active })
                        await loadAll()
                        handleInvalidate()
                      }}
                    >
                      {base.is_active ? "Desativar" : "Ativar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Saladas</h2>
          <div className="flex gap-2">
            <Input
              value={newSalad}
              onChange={(e) => setNewSalad(e.target.value)}
              placeholder="Nova salada"
            />
            <Button
              onClick={async () => {
                if (!newSalad.trim()) return
                await createSalad({ name: newSalad, is_active: true })
                setNewSalad("")
                await loadAll()
                handleInvalidate()
              }}
            >
              Adicionar
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salads.map((salad) => (
                <TableRow key={salad.id}>
                  <TableCell>{salad.name}</TableCell>
                  <TableCell>{salad.is_active ? "Sim" : "Não"}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingSalad(salad)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant={salad.is_active ? "destructive" : "default"}
                      onClick={async () => {
                        await updateSalad(salad.id, {
                          is_active: !salad.is_active,
                        })
                        await loadAll()
                        handleInvalidate()
                      }}
                    >
                      {salad.is_active ? "Desativar" : "Ativar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Opcionais</h2>
          <div className="flex gap-2">
            <Input
              value={newOptionalName}
              onChange={(e) => setNewOptionalName(e.target.value)}
              placeholder="Novo opcional"
            />
            <Input
              value={newOptionalPrice}
              onChange={(e) => setNewOptionalPrice(e.target.value)}
              placeholder="Preço"
              type="number"
              step="0.01"
            />
            <Button
              onClick={async () => {
                if (!newOptionalName.trim()) return
                await createOptional({
                  name: newOptionalName,
                  price: parseFloat(newOptionalPrice) || 0,
                  is_active: true,
                })
                setNewOptionalName("")
                setNewOptionalPrice("0")
                await loadAll()
                handleInvalidate()
              }}
            >
              Adicionar
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optionals.map((opt) => (
                <TableRow key={opt.id}>
                  <TableCell>{opt.name}</TableCell>
                  <TableCell>R$ {opt.price.toFixed(2)}</TableCell>
                  <TableCell>{opt.is_active ? "Sim" : "Não"}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingOptional(opt)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant={opt.is_active ? "destructive" : "default"}
                      onClick={async () => {
                        await updateOptional(opt.id, {
                          is_active: !opt.is_active,
                        })
                        await loadAll()
                        handleInvalidate()
                      }}
                    >
                      {opt.is_active ? "Desativar" : "Ativar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Cardápio do dia</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {DAY_LABELS.map((label, dayIndex) => (
              <div key={label} className="border rounded-lg p-3 space-y-2">
                <div className="font-semibold">{label}</div>
                <div className="space-y-2">
                  {proteins.map((protein) => {
                    const active = dailyMap[dayIndex]?.has(protein.id) ?? false
                    return (
                      <div key={protein.id} className="flex items-center justify-between">
                        <span className="text-sm">{protein.name}</span>
                        <Button
                          size="sm"
                          variant={active ? "default" : "outline"}
                          onClick={async () => {
                            await upsertDailyMenu(dayIndex, protein.id, !active)
                            await loadAll()
                            handleInvalidate()
                          }}
                        >
                          {active ? "Ativo" : "Inativo"}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingProtein} onOpenChange={() => setEditingProtein(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar proteína</DialogTitle>
          </DialogHeader>
          {editingProtein && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={editingProtein.name}
                  onChange={(e) =>
                    setEditingProtein({ ...editingProtein, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={editingProtein.type}
                  onChange={(e) =>
                    setEditingProtein({
                      ...editingProtein,
                      type: e.target.value as AdminProtein["type"],
                    })
                  }
                >
                  {PROTEIN_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Preço P</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingProtein.price_p}
                    onChange={(e) =>
                      setEditingProtein({
                        ...editingProtein,
                        price_p: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preço G</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingProtein.price_g}
                    onChange={(e) =>
                      setEditingProtein({
                        ...editingProtein,
                        price_g: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingProtein(null)}>
                  Cancelar
                </Button>
                <Button
                  onClick={async () => {
                    await updateProtein(editingProtein.id, {
                      name: editingProtein.name,
                      type: editingProtein.type,
                      price_p: editingProtein.price_p,
                      price_g: editingProtein.price_g,
                      is_active: editingProtein.is_active,
                    })
                    setEditingProtein(null)
                    await loadAll()
                    handleInvalidate()
                  }}
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingBase} onOpenChange={() => setEditingBase(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar base</DialogTitle>
          </DialogHeader>
          {editingBase && (
            <div className="space-y-3">
              <Label>Nome</Label>
              <Input
                value={editingBase.name}
                onChange={(e) =>
                  setEditingBase({ ...editingBase, name: e.target.value })
                }
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingBase(null)}>
                  Cancelar
                </Button>
                <Button
                  onClick={async () => {
                    await updateBase(editingBase.id, { name: editingBase.name })
                    setEditingBase(null)
                    await loadAll()
                    handleInvalidate()
                  }}
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingSalad} onOpenChange={() => setEditingSalad(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar salada</DialogTitle>
          </DialogHeader>
          {editingSalad && (
            <div className="space-y-3">
              <Label>Nome</Label>
              <Input
                value={editingSalad.name}
                onChange={(e) =>
                  setEditingSalad({ ...editingSalad, name: e.target.value })
                }
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingSalad(null)}>
                  Cancelar
                </Button>
                <Button
                  onClick={async () => {
                    await updateSalad(editingSalad.id, { name: editingSalad.name })
                    setEditingSalad(null)
                    await loadAll()
                    handleInvalidate()
                  }}
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingOptional}
        onOpenChange={() => setEditingOptional(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar opcional</DialogTitle>
          </DialogHeader>
          {editingOptional && (
            <div className="space-y-3">
              <Label>Nome</Label>
              <Input
                value={editingOptional.name}
                onChange={(e) =>
                  setEditingOptional({
                    ...editingOptional,
                    name: e.target.value,
                  })
                }
              />
              <Label>Preço</Label>
              <Input
                type="number"
                step="0.01"
                value={editingOptional.price}
                onChange={(e) =>
                  setEditingOptional({
                    ...editingOptional,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingOptional(null)}>
                  Cancelar
                </Button>
                <Button
                  onClick={async () => {
                    await updateOptional(editingOptional.id, {
                      name: editingOptional.name,
                      price: editingOptional.price,
                    })
                    setEditingOptional(null)
                    await loadAll()
                    handleInvalidate()
                  }}
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

