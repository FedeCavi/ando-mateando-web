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
  ChevronLeft,
  ChevronRight,
  X,
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

export function Sidebar({
  isAdmin,
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
}: {
  isAdmin: boolean
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen: boolean
  onMobileClose: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("[v0] Logout error:", error)
      router.push("/login")
      router.refresh()
    }
  }

  const desktopSidebar = (
    <div
      className={`hidden md:flex h-screen flex-col bg-[#1a1410] text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo/Title */}
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && <h1 className="text-2xl font-bold">Ventas App</h1>}
        <button
          onClick={onToggle}
          className="p-1 rounded hover:bg-white/10 transition-colors ml-auto"
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
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
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-white/5 hover:text-red-300"
          title={isCollapsed ? "Cerrar sesión" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </div>
  )

  const mobileSidebar = (
    <>
      {/* Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={onMobileClose} aria-hidden="true" />
      )}

      {/* Drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1410] text-white transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-screen flex-col">
          {/* Header with close button */}
          <div className="p-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Ventas App</h1>
            <button
              onClick={onMobileClose}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-1 px-3">
            {menuItems.map((item) => {
              if (item.adminOnly && !isAdmin) return null

              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onMobileClose}
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
      </div>
    </>
  )

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
    </>
  )
}
