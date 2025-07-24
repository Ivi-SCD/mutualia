"use client"

import { useState, useCallback } from "react"
import { TrendingUp, AlertCircle, CheckCircle, Package } from "lucide-react"
import type { ROICalculation, ROIForm } from "../../types"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function CalculatorPage() {
  const [roiForm, setRoiForm] = useState<ROIForm>({
    waste_type: "Borra Oleosa",
    volume: "100",
    disposal_cost: "200",
    market_price: "150",
  })
  const [roiCalculation, setRoiCalculation] = useState<ROICalculation | null>(null)

  const handleROIInputChange = useCallback((field: keyof ROIForm, value: string) => {
    setRoiForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const calculateROI = async (): Promise<void> => {
    try {
      const payload = {
        waste_type: roiForm.waste_type,
        volume: Number.parseFloat(roiForm.volume) || 0,
        disposal_cost: Number.parseFloat(roiForm.disposal_cost) || 0,
        market_price: Number.parseFloat(roiForm.market_price) || 0,
      }

      console.log("🔼 Payload enviado para /roi/calculate:", payload)

      const res = await fetch(`${API_URL}/roi/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`)
      }

      const data: ROICalculation = await res.json()

      console.log("🔽 Resposta recebida do backend:", data)

      if (isNaN(data.potential_profit) || isNaN(data.roi_percentage) || isNaN(data.payback_days)) {
        alert("Erro no cálculo do ROI. Verifique se todos os campos estão preenchidos corretamente.")
        return
      }

      setRoiCalculation(data)
    } catch (error) {
      console.error("💥 Erro ao calcular ROI:", error)
      alert("Erro ao calcular ROI. Verifique os valores inseridos.")
    }
  }

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Calculadora de ROI</h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Resíduo</label>
              <select
                value={roiForm.waste_type}
                onChange={(e) => handleROIInputChange("waste_type", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-black"
              >
                <option value="Borra Oleosa">Borra Oleosa</option>
                <option value="Catalisador FCC Exausto">Catalisador FCC Exausto</option>
                <option value="Lodo de ETE Industrial">Lodo de ETE Industrial</option>
                <option value="Resíduos de PET">Resíduos de PET</option>
                <option value="Óleo de Soja Usado">Óleo de Soja Usado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Volume (toneladas)</label>
              <input
                type="number"
                value={roiForm.volume}
                onChange={(e) => handleROIInputChange("volume", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custo de Descarte (R$/ton)</label>
              <input
                type="number"
                value={roiForm.disposal_cost}
                onChange={(e) => handleROIInputChange("disposal_cost", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preço de Mercado (R$/ton)</label>
              <input
                type="number"
                value={roiForm.market_price}
                onChange={(e) => handleROIInputChange("market_price", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-black"
              />
            </div>
          </div>
          <button
            onClick={calculateROI}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition"
          >
            Calcular ROI
          </button>
          {roiCalculation && (
            <div className="mt-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Resultado da Análise</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Lucro Potencial</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(roiCalculation.potential_profit)}/mês
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">ROI</span>
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{formatNumber(roiCalculation.roi_percentage)}%</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Payback</span>
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{roiCalculation.payback_days} dias</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Economia Anual</span>
                    <Package className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(roiCalculation.potential_profit * 12)}
                  </p>
                </div>
              </div>
              <div className="mt-6 bg-orange-100 rounded-lg p-4">
                <p className="text-sm text-gray-800">
                  <strong>Análise:</strong> Com base nos dados fornecidos, a participação no ReciLoop pode gerar um
                  retorno de {formatNumber(roiCalculation.roi_percentage)}% sobre o investimento mensal de R$ 1.500, com
                  payback em apenas {roiCalculation.payback_days} dias.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
