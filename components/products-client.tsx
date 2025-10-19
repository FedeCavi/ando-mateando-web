"use client"

import { useState } from "react"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

type Product = {
  id: string
  name: string
  details: string | null
  purchase_price: number
  price_minorista: number
  price_mayorista: number
  stock: number
}

export function ProductsClient({ products: initialProducts, isAdmin }: { products: Product[]; isAdmin: boolean }) {
  const [products, setProducts] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    purchase_price: "",
    price_minorista: "",
    price_mayorista: "",
    stock: "",
  })
  const router = useRouter()
  const supabase = createClient()

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const calculateMargin = (salePrice: number, purchasePrice: number) => {
    if (purchasePrice === 0) return 0
    return Math.round(((salePrice - purchasePrice) / purchasePrice) * 100)
  }

  const handleAddProduct = async () => {
    const { data, error } = await supabase
      .from("product")
      .insert([
        {
          name: formData.name,
          details: formData.details,
          purchase_price: Number.parseFloat(formData.purchase_price),
          price_minorista: Number.parseFloat(formData.price_minorista),
          price_mayorista: Number.parseFloat(formData.price_mayorista),
          stock: Number.parseInt(formData.stock),
        },
      ])
      .select()

    if (!error && data) {
      setProducts([...products, data[0]])
      setIsAddModalOpen(false)
      resetForm()
      router.refresh()
    }
  }

  const handleEditProduct = async () => {
    if (!selectedProduct) return

    const { error } = await supabase
      .from("product")
      .update({
        name: formData.name,
        details: formData.details,
        purchase_price: Number.parseFloat(formData.purchase_price),
        price_minorista: Number.parseFloat(formData.price_minorista),
        price_mayorista: Number.parseFloat(formData.price_mayorista),
        stock: Number.parseInt(formData.stock),
      })
      .eq("id", selectedProduct.id)

    if (!error) {
      setProducts(
        products.map((p) =>
          p.id === selectedProduct.id
            ? {
                ...p,
                ...formData,
                purchase_price: Number.parseFloat(formData.purchase_price),
                price_minorista: Number.parseFloat(formData.price_minorista),
                price_mayorista: Number.parseFloat(formData.price_mayorista),
                stock: Number.parseInt(formData.stock),
              }
            : p,
        ),
      )
      setIsEditModalOpen(false)
      setSelectedProduct(null)
      resetForm()
      router.refresh()
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return

    const { error } = await supabase.from("product").delete().eq("id", id)

    if (!error) {
      setProducts(products.filter((p) => p.id !== id))
      router.refresh()
    }
  }

  const openEditModal = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      details: product.details || "",
      purchase_price: product.purchase_price.toString(),
      price_minorista: product.price_minorista.toString(),
      price_mayorista: product.price_mayorista.toString(),
      stock: product.stock.toString(),
    })
    setIsEditModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      details: "",
      purchase_price: "",
      price_minorista: "",
      price_mayorista: "",
      stock: "",
    })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
      </div>

      {/* Search and Add Button */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {isAdmin && (
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-[#d97706] hover:bg-[#b45309]">
            <Plus className="mr-2 h-5 w-5" />
            Añadir Producto
          </Button>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredProducts.map((product) => (
          <div key={product.id} className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{product.stock}</span>
                  <span className="text-sm text-gray-500">en Stock</span>
                </div>
              </div>
            </div>

            <p className="mb-4 text-sm text-gray-600">{product.details}</p>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Precio de Compra:</span>
                <span className="font-semibold">${product.purchase_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Precio Minorista:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">${product.price_minorista.toFixed(2)}</span>
                  <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    {calculateMargin(product.price_minorista, product.purchase_price)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Precio Mayorista:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">${product.price_mayorista.toFixed(2)}</span>
                  <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    {calculateMargin(product.price_mayorista, product.purchase_price)}%
                  </span>
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => openEditModal(product)}
                  variant="outline"
                  className="flex-1 border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  onClick={() => handleDeleteProduct(product.id)}
                  variant="outline"
                  className="flex-1 border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Producto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ingrese el nombre"
              />
            </div>
            <div>
              <Label htmlFor="details">Descripción del Producto</Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Ingrese la descripción"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="purchase_price">Precio de Compra</Label>
              <Input
                id="purchase_price"
                type="number"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="price_minorista">Precio de Venta Minorista</Label>
              <Input
                id="price_minorista"
                type="number"
                step="0.01"
                value={formData.price_minorista}
                onChange={(e) => setFormData({ ...formData, price_minorista: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="price_mayorista">Precio de Venta Mayorista</Label>
              <Input
                id="price_mayorista"
                type="number"
                step="0.01"
                value={formData.price_mayorista}
                onChange={(e) => setFormData({ ...formData, price_mayorista: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
              />
            </div>
            <Button onClick={handleAddProduct} className="w-full bg-[#d97706] hover:bg-[#b45309]">
              <Plus className="mr-2 h-5 w-5" />
              Añadir Producto
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre del Producto</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-details">Descripción del Producto</Label>
              <Textarea
                id="edit-details"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-purchase_price">Precio de Compra</Label>
              <Input
                id="edit-purchase_price"
                type="number"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-price_minorista">Precio de Venta Minorista</Label>
              <Input
                id="edit-price_minorista"
                type="number"
                step="0.01"
                value={formData.price_minorista}
                onChange={(e) => setFormData({ ...formData, price_minorista: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-price_mayorista">Precio de Venta Mayorista</Label>
              <Input
                id="edit-price_mayorista"
                type="number"
                step="0.01"
                value={formData.price_mayorista}
                onChange={(e) => setFormData({ ...formData, price_mayorista: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-stock">Stock</Label>
              <Input
                id="edit-stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
            <Button onClick={handleEditProduct} className="w-full bg-[#d97706] hover:bg-[#b45309]">
              Guardar Cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
