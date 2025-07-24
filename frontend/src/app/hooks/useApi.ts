"use client"

import { useState } from "react"
import type { DashboardStats, Match, InventoryItem, ESGRanking, Company, ResidueOffer } from "../types"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useApi(token: string) {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [esgRanking, setEsgRanking] = useState<ESGRanking[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [residueOffers, setResidueOffers] = useState<ResidueOffer[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchDashboardStats = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data: DashboardStats = await res.json()
      setDashboardStats(data)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    }
  }

  const fetchMatches = async (): Promise<void> => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data: Match[] = await res.json()
      setMatches(data)
    } catch (error) {
      console.error("Error fetching matches:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInventory = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/inventory/real-time`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data: InventoryItem[] = await res.json()
      setInventory(data)
    } catch (error) {
      console.error("Error fetching inventory:", error)
    }
  }

  const fetchEsgRanking = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/esg/ranking`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data: ESGRanking[] = await res.json()
      setEsgRanking(data)
    } catch (error) {
      console.error("Error fetching ESG ranking:", error)
    }
  }

  const fetchCompanies = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/companies`)
      const data: Company[] = await res.json()
      setCompanies(data)
    } catch (error) {
      console.error("Error fetching companies:", error)
    }
  }

  const fetchResidueOffers = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/residue-offers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data: ResidueOffer[] = await res.json()

      // Garantir que data seja um array
      setResidueOffers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching residue offers:", error)
      // Em caso de erro, definir como array vazio
      setResidueOffers([])
    }
  }

  const acceptMatch = async (matchId: number): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/matches/${matchId}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        alert("Match aceito com sucesso!")
        fetchMatches()
      }
    } catch (error) {
      console.error("Error accepting match:", error)
    }
  }

  return {
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
  }
}
