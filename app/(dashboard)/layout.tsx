"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error || !user) {
          router.push("/login")
          return
        }

        // Try to fetch user profile
        try {
          const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", user.id).single()
          setIsAdmin(profile?.is_admin || false)
        } catch (profileError) {
          console.error("[v0] Failed to fetch user profile:", profileError)
          setIsAdmin(false)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router, supabase])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isAdmin={isAdmin}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="ml-4 text-lg font-semibold text-gray-900">Dashboard</h1>
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
