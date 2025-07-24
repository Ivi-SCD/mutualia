"use client"

import { useState } from "react"
import { Menu, X, LogOut } from "lucide-react"
import { ResidueOffersDropdown } from "../residue-offers/residue-offers-dropdown"
import type { PageType, ResidueOffer } from "../../types"

interface NavigationProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
  onLogout: () => void
  residueOffers: ResidueOffer[]
  onOfferClick: (offer: ResidueOffer) => void
  onViewAllOffers: () => void
}

export function Navigation({
  currentPage,
  onPageChange,
  onLogout,
  residueOffers,
  onOfferClick,
  onViewAllOffers,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  const navigationItems = [
    { key: "dashboard" as const, label: "Dashboard" },
    { key: "matches" as const, label: "Matches" },
    { key: "calculator" as const, label: "Calculadora ROI" },
    { key: "inventory" as const, label: "Inventário" },
    { key: "esg" as const, label: "Ranking ESG" },
  ]

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center hover:opacity-90 transition-all">
              <img src="/logo.svg" alt="Logo ReciLoop" className="w-40 h-40" />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onPageChange(item.key)}
                className={`hover:text-orange-400 transition ${currentPage === item.key ? "text-orange-400" : ""}`}
              >
                {item.label}
              </button>
            ))}

            <ResidueOffersDropdown
              offers={residueOffers}
              onOfferClick={onOfferClick}
              onViewAllOffers={onViewAllOffers}
            />

            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  onPageChange(item.key)
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
              >
                {item.label}
              </button>
            ))}
            <div className="px-4 py-2">
              <ResidueOffersDropdown
                offers={residueOffers}
                onOfferClick={onOfferClick}
                onViewAllOffers={onViewAllOffers}
              />
            </div>
            <button onClick={onLogout} className="block w-full text-left px-4 py-2 bg-red-600 rounded mt-4">
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
