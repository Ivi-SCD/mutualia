"use client"

import { useState } from "react"
import { Package, Plus, Search, Filter, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { OfferModal } from "../residue-offers/offer-modal"
import type { ResidueOffer, NewOfferForm } from "../../types"

interface OffersPageProps {
  offers: ResidueOffer[]
  onCreateOffer: (offer: NewOfferForm) => Promise<void>
  onOfferInterest: (offerId: number) => void
}

export function OffersPage({ offers, onCreateOffer, onOfferInterest }: OffersPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedUrgency, setSelectedUrgency] = useState("all")

  const categories = [
    "all",
    "Resíduos Oleosos",
    "Resíduos Químicos",
    "Resíduos Orgânicos",
    "Plásticos",
    "Metais",
    "Papel e Papelão",
    "Vidro",
    "Outros",
  ]

  const urgencyLevels = ["all", "high", "medium", "low"]

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || offer.category === selectedCategory
    const matchesUrgency = selectedUrgency === "all" || offer.urgency === selectedUrgency

    return matchesSearch && matchesCategory && matchesUrgency
  })

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

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      default:
        return "Baixa"
    }
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recente"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Ofertas de Resíduos</h1>
            <p className="text-gray-600">
              Explore oportunidades de economia circular • {filteredOffers.length} ofertas disponíveis
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Oferecer Resíduo</span>
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="Nome, empresa..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "Todas as categorias" : category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urgência</label>
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                {urgencyLevels.map((urgency) => (
                  <option key={urgency} value={urgency}>
                    {urgency === "all" ? "Todas as urgências" : getUrgencyLabel(urgency)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedUrgency("all")
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Ofertas */}
        {filteredOffers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {offers.length === 0 ? "Nenhuma oferta disponível" : "Nenhuma oferta encontrada"}
            </h3>
            <p className="text-gray-600 mb-6">
              {offers.length === 0
                ? "Seja o primeiro a ofertar um resíduo na plataforma!"
                : "Tente ajustar os filtros para encontrar outras ofertas."}
            </p>
            {offers.length === 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition"
              >
                Criar Primeira Oferta
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-l-4 ${getUrgencyColor(offer.urgency)}`}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{offer.name}</h3>
                      <div className="flex items-center space-x-2">
                        {getUrgencyIcon(offer.urgency)}
                        <span className="text-sm font-medium text-gray-600">
                          Urgência {getUrgencyLabel(offer.urgency)}
                        </span>
                      </div>
                    </div>

                    {offer.description && <p className="text-gray-700 mb-4 line-clamp-2">{offer.description}</p>}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Empresa:</span>
                        <p className="font-semibold text-gray-800">{offer.company}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Categoria:</span>
                        <p className="font-semibold text-gray-800">{offer.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Quantidade:</span>
                        <p className="font-semibold text-gray-800">
                          {offer.quantity} {offer.unit}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Preço:</span>
                        <p className="font-semibold text-orange-600">
                          {formatCurrency(offer.price)}/{offer.unit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Publicado em {formatDate(offer.created_at)}</span>
                      <span>Valor total: {formatCurrency(offer.price * offer.quantity)}</span>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => onOfferInterest(offer.id)}
                      className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition"
                    >
                      Demonstrar Interesse
                    </button>
                    <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <OfferModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={onCreateOffer} />
      </div>
    </div>
  )
}
