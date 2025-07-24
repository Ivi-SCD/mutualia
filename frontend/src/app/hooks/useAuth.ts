"use client"

import { useState } from "react"
import type { LoginForm } from "../types"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [token, setToken] = useState<string>("")
  const [companyId, setCompanyId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const login = async (loginForm: LoginForm): Promise<boolean> => {
    if (!loginForm.email || !loginForm.password) {
      setError("Por favor, preencha todos os campos")
      return false
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("🔄 Tentando fazer login com:", { email: loginForm.email })
      console.log("🌐 API URL:", API_URL)

      const formData = new URLSearchParams()
      formData.append("username", loginForm.email)
      formData.append("password", loginForm.password)

      const res = await fetch(`${API_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formData,
      })

      console.log("📡 Resposta da API:", res.status, res.statusText)

      if (res.ok) {
        const data: { access_token: string; company_id: number } = await res.json()
        console.log("✅ Login bem-sucedido:", { company_id: data.company_id })

        setToken(data.access_token)
        setCompanyId(data.company_id)
        setIsAuthenticated(true)
        setError("")
        return true
      } else {
        // Tentar ler a mensagem de erro da API
        let errorMessage = "Email ou senha incorretos"
        try {
          const errorData = await res.json()
          errorMessage = errorData.detail || errorData.message || errorMessage
        } catch (e) {
          // Se não conseguir ler o JSON, usar mensagem padrão
          if (res.status === 401) {
            errorMessage = "Email ou senha incorretos"
          } else if (res.status === 500) {
            errorMessage = "Erro interno do servidor. Tente novamente."
          } else {
            errorMessage = `Erro ${res.status}: ${res.statusText}`
          }
        }

        console.log("❌ Erro de login:", errorMessage)
        setError(errorMessage)
        return false
      }
    } catch (error) {
      console.error("💥 Erro de rede:", error)
      const networkError = "Erro de conexão. Verifique sua internet e tente novamente."
      setError(networkError)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = (): void => {
    setIsAuthenticated(false)
    setToken("")
    setCompanyId(null)
    setError("")
  }

  return {
    isAuthenticated,
    token,
    companyId,
    isLoading,
    error,
    login,
    logout,
    clearError: () => setError(""),
  }
}
