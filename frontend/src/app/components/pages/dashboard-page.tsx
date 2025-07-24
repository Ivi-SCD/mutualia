"use client"

import type React from "react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { TrendingUp, Leaf, Package } from "lucide-react"
import type { DashboardStats, PieData, TooltipProps } from "../../types"

interface DashboardPageProps {
  dashboardStats: DashboardStats | null
}

export function DashboardPage({ dashboardStats }: DashboardPageProps) {
  const pieData: PieData[] = [
    {
      name: "Resíduos Oleosos",
      value: 45,
      quantity: "650 ton",
      companies: 3,
    },
    {
      name: "Resíduos Químicos",
      value: 30,
      quantity: "450 ton",
      companies: 2,
    },
    {
      name: "Resíduos Orgânicos",
      value: 15,
      quantity: "300 ton",
      companies: 2,
    },
    { name: "Plásticos", value: 10, quantity: "200 ton", companies: 1 },
  ]

  const COLORS = ["#F4821E", "#D26709", "#5A5326", "#8B7355"]

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">Volume: {data.quantity}</p>
          <p className="text-sm text-gray-600">Empresas: {data.companies}</p>
          <p className="text-sm font-semibold text-orange-600">{data.value}% do total</p>
        </div>
      )
    }
    return null
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        {dashboardStats && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(dashboardStats.total_savings)}
                  </span>
                </div>
                <h3 className="text-gray-700 font-medium">Total Economizado</h3>
                <p className="text-sm text-gray-500 mt-1">+23% em relação ao mês anterior</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatNumber(dashboardStats.co2_avoided)} ton
                  </span>
                </div>
                <h3 className="text-gray-700 font-medium">CO₂ Evitado</h3>
                <p className="text-sm text-gray-500 mt-1">Equivale a 3.500 árvores plantadas</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-2xl font-bold text-orange-600">{dashboardStats.matches_completed}</span>
                </div>
                <h3 className="text-gray-700 font-medium">Matches Realizados</h3>
                <p className="text-sm text-gray-500 mt-1">Taxa de sucesso: 87%</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Economia Mensal</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardStats.monthly_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Line
                      type="monotone"
                      dataKey="savings"
                      stroke="#F4821E"
                      strokeWidth={3}
                      dot={{ fill: "#D26709", r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Distribuição por Tipo de Resíduo</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({
                        name,
                        percent,
                      }: {
                        name: string
                        percent?: number
                      }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value: string, entry: any) => <span style={{ color: entry.color }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
