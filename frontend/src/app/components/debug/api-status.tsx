"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export function ApiStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const checkApiStatus = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL

      if (!apiUrl) {
        setStatus("error")
        setError("NEXT_PUBLIC_API_URL não configurada")
        return
      }

      try {
        const res = await fetch(`${apiUrl}/health`, {
          method: "GET",
          headers: { Accept: "application/json" },
        })

        if (res.ok) {
          setStatus("connected")
        } else {
          setStatus("error")
          setError(`API retornou ${res.status}: ${res.statusText}`)
        }
      } catch (err) {
        setStatus("error")
        setError(`Erro de conexão: ${err instanceof Error ? err.message : "Desconhecido"}`)
      }
    }

    checkApiStatus()
  }, [])

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Verificando API...</span>
      </div>
    )
  }

  if (status === "connected") {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">API conectada</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-red-600">
      <AlertCircle className="w-4 h-4" />
      <div className="text-sm">
        <p>Erro na API</p>
        <p className="text-xs text-red-500">{error}</p>
      </div>
    </div>
  )
}
