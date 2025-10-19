"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Truck,
  DollarSign,
  Users,
  UserCog,
  User,
  LogOut,
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Productos", href: "/productos", icon: Package },
  { name: "Combos", href: "/combos", icon: Layers },
  { name: "Compras", href: "/compras", icon: ShoppingCart, adminOnly: true },
  { name: "Proveedores", href: "/proveedores", icon: Truck, adminOnly: true },
  { name: "Ventas", href: "/ventas", icon: DollarSign },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Vendedores", href: "/vendedores", icon: UserCog, adminOnly: true },
  { name: "Perfil", href: "/perfil", icon: User },
]

export function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-[#1a1410] text-white">
      {/* Logo/Title */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">Ventas App</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
          // Skip admin-only items if user is not admin
          if (item.adminOnly && !isAdmin) return null

          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-white/5 hover:text-red-300"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}
