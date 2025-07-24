"use client"

import { useState } from "react"
import { RefreshCw, AlertCircle, X } from "lucide-react"
import type { Match } from "../../types"

interface MatchesPageProps {
  matches: Match[]
  loading: boolean
  onRefresh: () => void
  onAcceptMatch: (matchId: number) => void
}

export function MatchesPage({ matches, loading, onRefresh, onAcceptMatch }: MatchesPageProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Oportunidades de Match</h1>
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Atualizar</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum match disponível no momento.</p>
            <p className="text-sm text-gray-500 mt-2">Novos matches aparecem conforme resíduos são cadastrados.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {matches.map((match) => (
              <div key={match.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className={`px-4 py-2 rounded-full text-white font-semibold ${
                          match.score >= 90 ? "bg-green-500" : match.score >= 80 ? "bg-blue-500" : "bg-orange-500"
                        }`}
                      >
                        {match.score}% Match
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">{match.waste.name}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Gerador:</span>
                        <p className="font-semibold text-gray-800">{match.generator_company.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Consumidor:</span>
                        <p className="font-semibold text-gray-800">{match.consumer_company.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Economia Estimada:</span>
                        <p className="font-semibold text-green-600">{formatCurrency(match.estimated_savings)}/mês</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center space-x-4">
                      <span className="text-sm text-gray-700 font-medium">
                        {match.waste.quantity} {match.waste.unit} disponíveis
                      </span>
                      <span className="text-sm text-gray-700 font-medium">
                        {formatCurrency(match.waste.price_per_unit)}/{match.waste.unit}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex space-x-3">
                    <button
                      onClick={() => setSelectedMatch(match)}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      Ver Detalhes
                    </button>
                    <button
                      onClick={() => onAcceptMatch(match.id)}
                      className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition"
                    >
                      Aceitar Match
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Match Details Modal */}
        {selectedMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Detalhes do Match</h2>
                <button onClick={() => setSelectedMatch(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Score de Compatibilidade: {selectedMatch.score}%</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Compatibilidade Química (40%):</span>
                      <span className="font-semibold">{(((selectedMatch.score * 0.4) / 40) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Proximidade Geográfica (30%):</span>
                      <span className="font-semibold">95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Viabilidade Econômica (30%):</span>
                      <span className="font-semibold">{(((selectedMatch.score * 0.3) / 30) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Informações do Resíduo</h4>
                  <p className="text-gray-600">{selectedMatch.waste.description}</p>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Categoria:</span>
                      <p className="font-semibold text-gray-800">{selectedMatch.waste.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Quantidade:</span>
                      <p className="font-semibold text-gray-800">
                        {selectedMatch.waste.quantity} {selectedMatch.waste.unit}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-gray-800">Benefícios Estimados</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Economia Mensal:</span>
                      <p className="font-semibold text-green-600">{formatCurrency(selectedMatch.estimated_savings)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Redução CO₂:</span>
                      <p className="font-semibold text-green-600">
                        ~{(selectedMatch.waste.quantity * 0.8).toFixed(0)} ton/mês
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => {
                      onAcceptMatch(selectedMatch.id)
                      setSelectedMatch(null)
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition"
                  >
                    Aceitar Match
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
