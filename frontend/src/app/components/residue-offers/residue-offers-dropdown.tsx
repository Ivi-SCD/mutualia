"use client"

import { useState, useRef, useEffect } from "react"
import { Package, ChevronDown, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import type { ResidueOffer } from "../../types"

interface ResidueOffersDropdownProps {
  offers: ResidueOffer[]
  onOfferClick: (offer: ResidueOffer) => void
  onViewAllOffers: () => void
}

export function ResidueOffersDropdown({ offers, onOfferClick, onViewAllOffers }: ResidueOffersDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Garantir que offers seja sempre um array
  const safeOffers = Array.isArray(offers) ? offers : []

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "border-l-red-500 bg-red-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      default:
        return "border-l-green-500 bg-green-50"
    }
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
      >
        <Package className="w-4 h-4" />
        <span className="hidden md:inline">Ofertas Disponíveis</span>
        <span className="md:hidden">Ofertas</span>
        {safeOffers.length > 0 && (
          <span className="bg-orange-800 text-xs px-2 py-1 rounded-full">{safeOffers.length}</span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Resíduos Disponíveis para Oferta</h3>
            <p className="text-sm text-gray-600">Clique em uma oferta para ver detalhes</p>
          </div>

          {safeOffers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>Nenhuma oferta disponível no momento</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {safeOffers.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => {
                    onOfferClick(offer)
                    setIsOpen(false)
                  }}
                  className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${getUrgencyColor(offer.urgency)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-800">{offer.name}</h4>
                        {getUrgencyIcon(offer.urgency)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{offer.category}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">
                          {offer.quantity} {offer.unit}
                        </span>
                        <span className="font-semibold text-orange-600">
                          {formatCurrency(offer.price)}/{offer.unit}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{offer.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                onViewAllOffers()
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm"
            >
              Ver Todas as Ofertas
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
