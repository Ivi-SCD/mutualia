"use client"

import { useState, useEffect } from "react"
import { LoginPage } from "./components/auth/login-page"
import { Navigation } from "./components/layout/navigation"
import { DashboardPage } from "./components/pages/dashboard-page"
import { MatchesPage } from "./components/pages/matches-page"
import { CalculatorPage } from "./components/pages/calculator-page"
import { InventoryPage } from "./components/pages/inventory-page"
import { ESGPage } from "./components/pages/esg-page"
import { OffersPage } from "./components/pages/offers-page"
import { useAuth } from "./hooks/useAuth"
import { useApi } from "./hooks/useApi"
import type { PageType, ResidueOffer, NewOfferForm } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ReciLoopApp() {
  const [currentPage, setCurrentPage] = useState<PageType>("login")
  const { isAuthenticated, token, isLoading, error, login, logout, clearError } = useAuth()

  // Dados mock para ofertas de resíduos (remover quando API estiver pronta)
  const mockResidueOffers: ResidueOffer[] = [
    {
      id: 1,
      name: "Borra Oleosa",
      category: "Resíduos Oleosos",
      quantity: 150,
      unit: "ton",
      price: 200,
      company: "Refinaria Suape",
      urgency: "high",
      description: "Borra oleosa proveniente do processo de refino, rica em hidrocarbonetos recuperáveis.",
      created_at: "2024-01-15",
    },
    {
      id: 2,
      name: "Catalisador FCC",
      category: "Resíduos Químicos",
      quantity: 80,
      unit: "ton",
      price: 350,
      company: "Petroquímica",
      urgency: "medium",
      description: "Catalisador exausto de craqueamento catalítico, contém metais valiosos para recuperação.",
      created_at: "2024-01-10",
    },
    {
      id: 3,
      name: "Lodo Industrial",
      category: "Resíduos Orgânicos",
      quantity: 200,
      unit: "ton",
      price: 120,
      company: "Cimpor",
      urgency: "low",
      description: "Lodo de estação de tratamento industrial, adequado para compostagem e recuperação energética.",
      created_at: "2024-01-08",
    },
  ]

  const {
    dashboardStats,
    matches,
    inventory,
    esgRanking,
    companies,
    residueOffers,
    loading,
    fetchDashboardStats,
    fetchMatches,
    fetchInventory,
    fetchEsgRanking,
    fetchCompanies,
    fetchResidueOffers,
    acceptMatch,
  } = useApi(token)

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies()
  }, [])

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchDashboardStats()
      fetchMatches()
      fetchInventory()
      fetchEsgRanking()
      fetchResidueOffers()
      setCurrentPage("dashboard")
    }
  }, [isAuthenticated, token])

  // Simular atualizações em tempo real do inventário
  useEffect(() => {
    if (currentPage === "inventory" && isAuthenticated) {
      const interval = setInterval(() => {
        fetchInventory()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [currentPage, isAuthenticated])

  const handleLogin = async (loginForm: { email: string; password: string }) => {
    const success = await login(loginForm)
    return success
  }

  const handleLogout = () => {
    logout()
    setCurrentPage("login")
  }

  const handleOfferClick = (offer: ResidueOffer) => {
    // Implementar lógica para mostrar detalhes da oferta
    console.log("Oferta clicada:", offer)
    // Pode abrir um modal ou navegar para uma página específica
  }

  const handleCreateOffer = async (offerData: NewOfferForm): Promise<void> => {
    try {
      const payload = {
        ...offerData,
        quantity: Number.parseFloat(offerData.quantity),
        price: Number.parseFloat(offerData.price),
      }

      console.log("🔄 Criando oferta:", payload)

      const res = await fetch(`${API_URL}/residue-offers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        console.log("✅ Oferta criada com sucesso")
        alert("Oferta criada com sucesso!")
        fetchResidueOffers() // Atualizar lista
      } else {
        const errorData = await res.json().catch(() => ({}))
        console.log("❌ Erro ao criar oferta:", res.status, errorData)
        throw new Error(errorData.detail || "Erro ao criar oferta")
      }
    } catch (error) {
      console.error("💥 Erro ao criar oferta:", error)
      throw error
    }
  }

  const handleOfferInterest = (offerId: number) => {
    // Implementar lógica para demonstrar interesse
    console.log("Interesse demonstrado na oferta:", offerId)
    alert("Interesse registrado! A empresa será notificada.")
  }

  const handleViewAllOffers = () => {
    setCurrentPage("offers")
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} isLoading={isLoading} error={error} onClearError={clearError} />
  }

  return (
    <>
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
        residueOffers={residueOffers.length > 0 ? residueOffers : mockResidueOffers}
        onOfferClick={handleOfferClick}
        onViewAllOffers={handleViewAllOffers}
      />

      {currentPage === "dashboard" && <DashboardPage dashboardStats={dashboardStats} />}
      {currentPage === "matches" && (
        <MatchesPage matches={matches} loading={loading} onRefresh={fetchMatches} onAcceptMatch={acceptMatch} />
      )}
      {currentPage === "calculator" && <CalculatorPage />}
      {currentPage === "inventory" && <InventoryPage inventory={inventory} />}
      {currentPage === "esg" && <ESGPage esgRanking={esgRanking} />}
      {currentPage === "offers" && (
        <OffersPage
          offers={residueOffers.length > 0 ? residueOffers : mockResidueOffers}
          onCreateOffer={handleCreateOffer}
          onOfferInterest={handleOfferInterest}
        />
      )}
    </>
  )
}
