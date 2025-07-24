"use client"

import type { ESGRanking } from "../../types"

interface ESGPageProps {
  esgRanking: ESGRanking[]
}

export function ESGPage({ esgRanking }: ESGPageProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat("pt-BR").format(value)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Ranking ESG - Score de Circularização</h1>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">#</th>
                  <th className="px-6 py-4 text-left">Empresa</th>
                  <th className="px-6 py-4 text-center">Score Circular</th>
                  <th className="px-6 py-4 text-center">Transações</th>
                  <th className="px-6 py-4 text-center">Economia Total</th>
                  <th className="px-6 py-4 text-center">CO₂ Evitado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {esgRanking.map((company) => (
                  <tr key={company.company_id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          company.position === 1
                            ? "bg-yellow-500"
                            : company.position === 2
                              ? "bg-gray-400"
                              : company.position === 3
                                ? "bg-orange-600"
                                : "bg-gray-600"
                        }`}
                      >
                        {company.position}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">{company.company_name}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="relative w-20 h-20">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="#10b981"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 36}`}
                              strokeDashoffset={`${2 * Math.PI * 36 * (1 - company.circular_score / 100)}`}
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center font-bold text-gray-800">
                            {company.circular_score}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-800">{company.transactions_count}</td>
                    <td className="px-6 py-4 text-center font-semibold text-green-600">
                      {formatCurrency(company.total_savings)}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-blue-600">
                      {formatNumber(company.co2_avoided)} ton
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Como o Score é Calculado</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <span className="font-semibold text-gray-800">Volume de Transações</span>
              </div>
              <p className="text-gray-700">Quantidade e frequência de matches realizados na plataforma</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <span className="font-semibold text-gray-800">Impacto Econômico</span>
              </div>
              <p className="text-gray-700">Valor total economizado através da economia circular</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">3</span>
                </div>
                <span className="font-semibold text-gray-800">Redução de Emissões</span>
              </div>
              <p className="text-gray-700">Toneladas de CO₂ evitadas através do reuso de resíduos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
