"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegistroPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      if (data.user) {
        // Actualizar el perfil con el nombre
        const { error: profileError } = await supabase
          .from("user_profiles")
          .update({ name: name })
          .eq("id", data.user.id)

        if (profileError) {
          console.error("Error updating profile:", profileError)
        }

        alert("¡Cuenta creada exitosamente! Revisa tu email para confirmar tu cuenta.")
        router.push("/login")
      }
    } catch (error: any) {
      setError(error.message || "Error al crear la cuenta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">Ventas App</h1>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-muted-foreground">
              Nombre
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Ingresá tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Ingresá tu mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background border-border pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-lg">{error}</div>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ¿Ya tenés cuenta? <span className="text-primary">Iniciá sesión</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
