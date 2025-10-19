"use client"

import { useState } from "react"
import { DollarSign, TrendingUp } from "lucide-react"

interface DashboardClientProps {
  user: any
  profile: any
}

export default function DashboardClient({ user, profile }: DashboardClientProps) {
  const [startDate, setStartDate] = useState("2025-09-01")
  const [endDate, setEndDate] = useState("2025-09-30")

  const handleApply = () => {
    console.log("[v0] Applying date filter:", { startDate, endDate })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        {profile && <p className="text-muted-foreground mt-1">Bienvenido, {profile.name}</p>}
      </div>

      {/* Metrics Section */}
      <div className="bg-card rounded-2xl shadow-sm p-6 space-y-6">
        <h2 className="text-2xl font-bold text-card-foreground">Métricas</h2>

        {/* Date Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApply}
          className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Aplicar
        </button>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ganancias del Mes */}
          <div className="bg-[#ecfdf5] rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#10b981]">
              <DollarSign size={20} />
              <span className="text-sm font-medium">Ganancias del Mes</span>
            </div>
            <div className="text-4xl font-bold text-[#2b1810]">$4500.50</div>
          </div>

          {/* Top Productos Vendidos */}
          <div className="bg-[#eff6ff] rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#3b82f6]">
              <TrendingUp size={20} />
              <span className="text-sm font-medium">Top Productos Vendidos</span>
            </div>
            <div className="text-3xl font-bold text-[#2b1810]">Laptop Gamer</div>
          </div>
        </div>
      </div>
    </div>
  )
}
