"use client"

import { useState, useEffect } from "react"
import type { InventoryItem } from "../../types"

interface InventoryPageProps {
  inventory: InventoryItem[]
}

export function InventoryPage({ inventory }: InventoryPageProps) {
  const [inventoryUpdates, setInventoryUpdates] = useState<number>(0)

  useEffect(() => {
    setInventoryUpdates((prev) => prev + 1)
  }, [inventory])

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
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Inventário em Tempo Real</h1>
            <p className="text-sm text-gray-600 mt-1">
              Atualizado automaticamente a cada 5 segundos •
              <span className="text-green-600 font-medium"> {inventoryUpdates} atualizações</span>
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Ao vivo</span>
          </div>
        </div>
        <div className="grid gap-6">
          {inventory.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-l-4 border-orange-500"
            >
              <div className="flex flex-col md:flex-row justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{item.waste.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === "disponível" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                    {Math.random() > 0.7 && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium animate-pulse">
                        Novo interesse!
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4">{item.waste.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Empresa:</span>
                      <p className="font-semibold text-gray-800">{item.company.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Quantidade:</span>
                      <p className="font-semibold text-gray-800">
                        {item.waste.quantity} {item.waste.unit}
                        {Math.random() > 0.5 && <span className="text-xs text-green-600 ml-1">↑</span>}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Preço:</span>
                      <p className="font-semibold text-gray-800">
                        {formatCurrency(item.waste.price_per_unit)}/{item.waste.unit}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Categoria:</span>
                      <p className="font-semibold text-gray-800">{item.waste.category}</p>
                    </div>
                  </div>
                  {item.interested_companies.length > 0 && (
                    <div className="mt-4 flex items-center space-x-2">
                      <span className="text-sm text-gray-700 font-medium">Empresas interessadas:</span>
                      <div className="flex space-x-2">
                        {item.interested_companies.map((company, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    Última atualização: há {Math.floor(Math.random() * 60)} segundos
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition">
                    Demonstrar Interesse
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
