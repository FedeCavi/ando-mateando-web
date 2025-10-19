"use client"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LayoutDashboard, Package, Gift, DollarSign, Users, User, LogOut, ChevronLeft, Menu } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

// Datos hardcodeados de productos
const initialProducts = [
  {
    id: 1,
    name: "Smartphone Samsung Galaxy",
    stock: 15,
    buyPrice: 450000,
    sellPrice: 650000,
    category: "Electrónicos",
  },
  {
    id: 2,
    name: "Auriculares Bluetooth",
    stock: 8,
    buyPrice: 85000,
    sellPrice: 125000,
    category: "Accesorios",
  },
  {
    id: 3,
    name: "Cargador USB-C",
    stock: 25,
    buyPrice: 15000,
    sellPrice: 28000,
    category: "Accesorios",
  },
  {
    id: 4,
    name: "Tablet 10 pulgadas",
    stock: 3,
    buyPrice: 280000,
    sellPrice: 420000,
    category: "Electrónicos",
  },
  {
    id: 5,
    name: "Funda para celular",
    stock: 45,
    buyPrice: 8000,
    sellPrice: 18000,
    category: "Accesorios",
  },
  {
    id: 6,
    name: "Power Bank 20000mAh",
    stock: 12,
    buyPrice: 45000,
    sellPrice: 75000,
    category: "Accesorios",
  },
  {
    id: 7,
    name: 'Smart TV 43"',
    stock: 2,
    buyPrice: 850000,
    sellPrice: 1200000,
    category: "Electrónicos",
  },
]

const Sidebar = ({ currentRoute, navigate, isMobile, sidebarOpen, setSidebarOpen, onLogout }: any) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "productos", label: "Productos", icon: Package },
    { id: "combos", label: "Combos", icon: Gift },
    { id: "ventas", label: "Ventas", icon: DollarSign },
    { id: "clientes", label: "Clientes", icon: Users },
    { id: "perfil", label: "Perfil", icon: User },
  ]

  return (
    <>
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-[#1a1410] border-r border-[#2b1f1a] transition-transform duration-300 z-50 flex flex-col ${
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Header with collapse button */}
        <div className="p-6 border-b border-[#2b1f1a] flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Ventas App</h1>
          {!isMobile && (
            <button className="text-gray-400 hover:text-white">
              <ChevronLeft size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentRoute === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.id)
                  if (isMobile) setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                  isActive
                    ? "bg-[#2b1f1a] text-white border-l-4 border-[#d97706]"
                    : "text-gray-300 hover:bg-[#2b1f1a] hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#2b1f1a]">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#dc2626] hover:bg-[#2b1f1a] rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </>
  )
}

// Componente ProductCard
const ProductCard = ({ product, onUpdatePrice }: any) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newPrice, setNewPrice] = useState(product.sellPrice)

  const profitMargin = (((product.sellPrice - product.buyPrice) / product.buyPrice) * 100).toFixed(1)
  const profit = product.sellPrice - product.buyPrice

  const handleSavePrice = () => {
    onUpdatePrice(product.id, newPrice)
    setIsEditing(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-1">{product.name}</h3>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">{product.category}</span>
        </div>
        <span
          className={`text-sm font-semibold px-2 py-1 rounded ${
            product.stock < 5
              ? "bg-red-100 text-red-700"
              : product.stock < 10
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
          }`}
        >
          Stock: {product.stock}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">PRECIO COMPRA</div>
          <div className="text-sm font-semibold text-foreground">{formatPrice(product.buyPrice)}</div>
        </div>

        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">PRECIO VENTA</div>
          {isEditing ? (
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(Number(e.target.value))}
              className="w-full text-sm font-semibold text-center bg-input border border-border rounded px-2 py-1"
              onKeyPress={(e) => e.key === "Enter" && handleSavePrice()}
              autoFocus
            />
          ) : (
            <div className="text-lg font-bold text-primary">{formatPrice(product.sellPrice)}</div>
          )}
        </div>

        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">GANANCIA</div>
          <div className={`text-sm font-semibold ${profit > 0 ? "text-green-600" : "text-red-600"}`}>
            {formatPrice(profit)}
            <br />
            <span className="text-xs">({profitMargin}%)</span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">ACCIÓN</div>
          {isEditing ? (
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleSavePrice}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                ✓
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setNewPrice(product.sellPrice)
                }}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:opacity-90"
            >
              Editar Precio
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente ProductsPage
const ProductsPage = ({ products, onUpdatePrice }: any) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")

  const filteredProducts = products
    .filter(
      (product: any) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "stock":
          return a.stock - b.stock
        case "profit":
          return b.sellPrice - b.buyPrice - (a.sellPrice - a.buyPrice)
        case "price":
          return b.sellPrice - a.sellPrice
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const totalValue = products.reduce((sum: number, product: any) => sum + product.sellPrice * product.stock, 0)
  const lowStockCount = products.filter((product: any) => product.stock < 5).length

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Control de Productos</h1>
        <p className="text-muted-foreground">Gestiona tu inventario de manera eficiente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-primary mb-1">{products.length}</div>
          <div className="text-sm text-muted-foreground">Total Productos</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-primary mb-1">{formatPrice(totalValue)}</div>
          <div className="text-sm text-muted-foreground">Valor Total Inventario</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 text-center">
          <div className={`text-3xl font-bold mb-1 ${lowStockCount > 0 ? "text-red-600" : "text-primary"}`}>
            {lowStockCount}
          </div>
          <div className="text-sm text-muted-foreground">Productos Bajo Stock</div>
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="name">Ordenar por Nombre</option>
          <option value="stock">Ordenar por Stock</option>
          <option value="profit">Ordenar por Ganancia</option>
          <option value="price">Ordenar por Precio</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredProducts.map((product: any) => (
          <ProductCard key={product.id} product={product} onUpdatePrice={onUpdatePrice} />
        ))}
      </div>
    </div>
  )
}

// Componente EmptyPage
const EmptyPage = ({ title, description }: any) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-10">
      <div className="text-6xl mb-5 opacity-50">🚧</div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

export default function App() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentRoute, setCurrentRoute] = useState("dashboard")
  const [products, setProducts] = useState(initialProducts)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname?.includes("/login") || pathname?.includes("/registro")) {
        setIsLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error && error.message !== "Auth session missing!") {
          console.error("[v0] Auth check error:", error.message)
        }

        if (!user || error) {
          router.push("/login")
        } else {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
        router.push("/login")
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  const navigate = (route: string) => {
    setCurrentRoute(route)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const handleUpdatePrice = (productId: number, newPrice: number) => {
    setProducts(products.map((product) => (product.id === productId ? { ...product, sellPrice: newPrice } : product)))
  }

  if (isLoading) {
    return null
  }

  if (!isAuthenticated || pathname?.includes("/login") || pathname?.includes("/dashboard")) {
    return null
  }

  const renderContent = () => {
    switch (currentRoute) {
      case "dashboard":
        router.push("/dashboard")
        return null
      case "productos":
        return <ProductsPage products={products} onUpdatePrice={handleUpdatePrice} />
      case "combos":
        return <EmptyPage title="Combos" description="Funcionalidad de combos próximamente disponible" />
      case "ventas":
        return <EmptyPage title="Ventas" description="Funcionalidad de ventas próximamente disponible" />
      case "clientes":
        return <EmptyPage title="Clientes" description="Funcionalidad de clientes próximamente disponible" />
      case "perfil":
        return <EmptyPage title="Perfil" description="Funcionalidad de perfil próximamente disponible" />
      default:
        router.push("/dashboard")
        return null
    }
  }

  return (
    <div className="font-sans">
      <Sidebar
        currentRoute={currentRoute}
        navigate={navigate}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      <main className={`min-h-screen bg-background transition-all duration-300 ${isMobile ? "ml-0" : "ml-64"}`}>
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-card border-b border-border">
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} className="text-foreground">
              <Menu size={24} />
            </button>
          )}
          <div className="text-lg font-semibold text-foreground">
            {currentRoute === "dashboard" && "Dashboard"}
            {currentRoute === "productos" && "Productos"}
            {currentRoute === "combos" && "Combos"}
            {currentRoute === "ventas" && "Ventas"}
            {currentRoute === "clientes" && "Clientes"}
            {currentRoute === "perfil" && "Perfil"}
          </div>
          <div></div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  )
}
