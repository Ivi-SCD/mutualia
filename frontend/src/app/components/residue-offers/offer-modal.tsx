"use client"

import type React from "react"

import { useState } from "react"
import { X, Package, AlertTriangle, Clock, CheckCircle } from "lucide-react"
import type { NewOfferForm } from "../../types"

interface OfferModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (offer: NewOfferForm) => Promise<void>
}

export function OfferModal({ isOpen, onClose, onSubmit }: OfferModalProps) {
  const [form, setForm] = useState<NewOfferForm>({
    name: "",
    category: "Resíduos Oleosos",
    description: "",
    quantity: "",
    unit: "ton",
    price: "",
    urgency: "medium",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    "Resíduos Oleosos",
    "Resíduos Químicos",
    "Resíduos Orgânicos",
    "Plásticos",
    "Metais",
    "Papel e Papelão",
    "Vidro",
    "Outros",
  ]

  const units = ["ton", "kg", "m³", "L", "unidade"]

  const handleInputChange = (field: keyof NewOfferForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.description || !form.quantity || !form.price) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(form)
      setForm({
        name: "",
        category: "Resíduos Oleosos",
        description: "",
        quantity: "",
        unit: "ton",
        price: "",
        urgency: "medium",
      })
      onClose()
    } catch (error) {
      console.error("Erro ao criar oferta:", error)
      alert("Erro ao criar oferta. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

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

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "Alta - Precisa ser removido rapidamente"
      case "medium":
        return "Média - Remoção em algumas semanas"
      default:
        return "Baixa - Sem pressa para remoção"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Oferecer Resíduo</h2>
                <p className="text-sm text-gray-600">Cadastre um novo resíduo disponível para economia circular</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Resíduo *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="Ex: Borra oleosa de refinaria"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                <select
                  value={form.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgência</label>
                <div className="space-y-2">
                  {(["low", "medium", "high"] as const).map((urgency) => (
                    <label key={urgency} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="urgency"
                        value={urgency}
                        checked={form.urgency === urgency}
                        onChange={(e) => handleInputChange("urgency", e.target.value)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <div className="flex items-center space-x-2">
                        {getUrgencyIcon(urgency)}
                        <span className="text-sm text-gray-700">{getUrgencyLabel(urgency)}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade *</label>
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="100"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unidade</label>
                <select
                  value={form.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço por Unidade (R$) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="150.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Detalhada *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  rows={4}
                  placeholder="Descreva as características do resíduo, composição, origem, condições de armazenamento, etc."
                  required
                />
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Informações Importantes</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Certifique-se de que o resíduo está devidamente caracterizado</li>
                <li>• O preço deve refletir o valor de mercado atual</li>
                <li>• Ofertas com urgência alta têm prioridade no sistema</li>
                <li>• Você receberá notificações quando houver interesse</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Criando..." : "Criar Oferta"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
