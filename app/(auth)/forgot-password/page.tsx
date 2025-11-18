"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { createClient } from "@/utils/supabase/client"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
      setEmail("")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al enviar el email de recuperación")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf6f3] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2 text-[#2b1810]">AndoVendiendo</h1>
          <p className="text-center text-gray-600 text-sm mb-8">Recuperar contraseña</p>

          {success ? (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
                ¡Email enviado exitosamente! Revisa tu correo para recuperar tu contraseña.
              </div>
              <button
                onClick={() => router.push("/login")}
                className="text-sm text-gray-600 hover:text-[#d97706]"
              >
                Volver al <span className="font-semibold text-[#d97706]">login</span>
              </button>
            </div>
          ) : (
            <>
              {/* Forgot Password Form */}
              <form onSubmit={handleForgotPassword} className="space-y-6">
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

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-sm text-gray-600 hover:text-[#d97706]"
                >
                  Volver al <span className="font-semibold text-[#d97706]">login</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
