"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      // Successful login - middleware will handle redirect
      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al iniciar sesión con Google")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf6f3] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-8 text-[#2b1810]">Ventas App</h1>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2b1810] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresá tu mail"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-transparent text-[#2b1810] placeholder:text-gray-400"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2b1810] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresá tu contraseña"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-transparent text-[#2b1810] placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">o</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-[#2b1810] font-medium py-3 rounded-lg transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M19.8055 10.2292C19.8055 9.55156 19.7501 8.86719 19.6323 8.19531H10.2002V12.0492H15.6014C15.3773 13.2911 14.6571 14.3898 13.6106 15.0875V17.5867H16.8251C18.7175 15.8449 19.8055 13.2727 19.8055 10.2292Z"
                fill="#4285F4"
              />
              <path
                d="M10.2002 20.0008C12.9527 20.0008 15.2643 19.1152 16.8251 17.5867L13.6106 15.0875C12.7065 15.6972 11.5517 16.0434 10.2002 16.0434C7.54066 16.0434 5.29433 14.2828 4.50014 11.9102H1.18359V14.4836C2.78654 17.6797 6.31168 20.0008 10.2002 20.0008Z"
                fill="#34A853"
              />
              <path
                d="M4.50014 11.9102C4.04818 10.6683 4.04818 9.33333 4.50014 8.09141V5.51797H1.18359C-0.394531 8.66797 -0.394531 12.3336 1.18359 15.4836L4.50014 11.9102Z"
                fill="#FBBC04"
              />
              <path
                d="M10.2002 3.95781C11.6256 3.93594 13.0025 4.47344 14.0398 5.45781L16.8944 2.60312C15.1766 0.990625 12.7342 0.0828125 10.2002 0.104687C6.31168 0.104687 2.78654 2.42578 1.18359 5.51797L4.50014 8.09141C5.29433 5.71875 7.54066 3.95781 10.2002 3.95781Z"
                fill="#EA4335"
              />
            </svg>
            Ingresar con Google
          </button>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push("/registro")}
              className="text-sm text-gray-600 hover:text-[#d97706]"
            >
              ¿No tenés cuenta? <span className="font-semibold text-[#d97706]">Registrate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
