"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Leaf, AlertCircle, Loader2 } from "lucide-react"
import type { LoginForm } from "../../types"

interface LoginPageProps {
  onLogin: (loginForm: LoginForm) => Promise<boolean>
  isLoading?: boolean
  error?: string
  onClearError?: () => void
}

export function LoginPage({ onLogin, isLoading = false, error = "", onClearError }: LoginPageProps) {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  })

  const handleInputChange = useCallback(
    (field: keyof LoginForm, value: string) => {
      setLoginForm((prev) => ({ ...prev, [field]: value }))
      // Limpar erro quando usuário começar a digitar
      if (error && onClearError) {
        onClearError()
      }
    },
    [error, onClearError],
  )

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !isLoading) {
        handleSubmit()
      }
    },
    [loginForm, isLoading],
  )

  const handleSubmit = async () => {
    if (isLoading) return
    await onLogin(loginForm)
  }

  const fillTestCredentials = (email: string) => {
    setLoginForm({ email, password: "senha" })
    if (error && onClearError) {
      onClearError()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-4">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">ReciLoop</h1>
            <p className="text-gray-600 mt-2">Economia Circular em Suape</p>
          </div>

          {/* Mostrar erro se houver */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 text-sm font-medium">Erro no login</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-black"
                placeholder="empresa@example.com"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-black"
                placeholder="••••••••"
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p className="font-semibold mb-2">Empresas disponíveis para teste:</p>
            <div className="mt-2 bg-gray-50 rounded-lg p-3 text-xs space-y-2">
              {["refinaria@example.com", "cimpor@example.com", "petroquimica@example.com", "bunge@example.com"].map(
                (email) => (
                  <button
                    key={email}
                    onClick={() => fillTestCredentials(email)}
                    className="block w-full text-left font-mono text-gray-800 hover:bg-gray-200 px-2 py-1 rounded transition"
                    disabled={isLoading}
                  >
                    {email}
                  </button>
                ),
              )}
              <p className="mt-2 text-gray-600 pt-2 border-t border-gray-200">
                Senha: <span className="font-mono text-gray-800">senha</span>
              </p>
            </div>
          </div>

          {/* Status da conexão */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              {process.env.NEXT_PUBLIC_API_URL ? (
                <>
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Conectado à API
                </>
              ) : (
                <>
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  API não configurada
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
