"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
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
} from "recharts";
import {
  TrendingUp,
  Leaf,
  Package,
  Menu,
  X,
  LogOut,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import type {
  Company,
  Match,
  DashboardStats,
  InventoryItem,
  ESGRanking,
  ROICalculation,
  LoginForm,
  ROIForm,
  PageType,
  PieData,
  TooltipProps,
} from "./types";
import type { JSX } from "react/jsx-runtime";

const API_URL = "http://localhost:8000";

interface Colors {
  primary: string;
  secondary: string;
  accent: string;
  highlight1: string;
  highlight2: string;
}

export default function ReciLoop(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<PageType>("login");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [matches, setMatches] = useState<Match[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [esgRanking, setEsgRanking] = useState<ESGRanking[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [roiCalculation, setRoiCalculation] = useState<ROICalculation | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [inventoryUpdates, setInventoryUpdates] = useState<number>(0);

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [roiForm, setRoiForm] = useState<ROIForm>({
    waste_type: "Borra Oleosa",
    volume: "100",
    disposal_cost: "200",
    market_price: "150",
  });

  const colors: Colors = {
    primary: "#170902",
    secondary: "#f6eedf",
    accent: "#5A5326",
    highlight1: "#D26709",
    highlight2: "#F4821E",
  };

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchDashboardStats();
      fetchMatches();
      fetchInventory();
      fetchEsgRanking();
    }
  }, [isAuthenticated, token]);

  // Simular atualizações em tempo real do inventário
  useEffect(() => {
    if (currentPage === "inventory" && isAuthenticated) {
      const interval = setInterval(() => {
        fetchInventory();
        setInventoryUpdates((prev) => prev + 1);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentPage, isAuthenticated]);

  const fetchCompanies = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/companies`);
      const data: Company[] = await res.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchDashboardStats = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: DashboardStats = await res.json();
      setDashboardStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchMatches = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: Match[] = await res.json();
      setMatches(data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/inventory/real-time`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: InventoryItem[] = await res.json();

      const updatedInventory = data.map((item) => ({
        ...item,
        waste: {
          ...item.waste,
          quantity: item.waste.quantity + Math.floor(Math.random() * 20 - 10),
        },
        interested_companies: [
          ...item.interested_companies,
          ...(Math.random() > 0.7 ? ["Nova Empresa"] : []),
        ].slice(0, 3),
      }));
      setInventory(updatedInventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const fetchEsgRanking = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/esg/ranking`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: ESGRanking[] = await res.json();
      setEsgRanking(data);
    } catch (error) {
      console.error("Error fetching ESG ranking:", error);
    }
  };

  const handleLogin = async (): Promise<void> => {
    if (!loginForm.email || !loginForm.password) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("username", loginForm.email);
      formData.append("password", loginForm.password);

      const res = await fetch(`${API_URL}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (res.ok) {
        const data: { access_token: string; company_id: number } =
          await res.json();
        setToken(data.access_token);
        setCompanyId(data.company_id);
        setIsAuthenticated(true);
        setCurrentPage("dashboard");
      } else {
        alert("Email ou senha incorretos");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Erro ao fazer login");
    }
  };

  const handleLogout = (): void => {
    setIsAuthenticated(false);
    setToken("");
    setCompanyId(null);
    setCurrentPage("login");
    setLoginForm({ email: "", password: "" });
  };

  const calculateROI = async (): Promise<void> => {
    try {
      const payload = {
        waste_type: roiForm.waste_type,
        volume: Number.parseFloat(roiForm.volume) || 0,
        disposal_cost: Number.parseFloat(roiForm.disposal_cost) || 0,
        market_price: Number.parseFloat(roiForm.market_price) || 0,
      };

      // 🔎 Log para depurar o que está sendo enviado ao backend
      console.log("🔼 Payload enviado para /roi/calculate:", payload);

      const res = await fetch(`${API_URL}/roi/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }

      const data: ROICalculation = await res.json();

      // 🔎 Log para depurar o que o backend retornou
      console.log("🔽 Resposta recebida do backend:", data);

      // ✅ Validação simples contra NaN
      if (
        isNaN(data.potential_profit) ||
        isNaN(data.roi_percentage) ||
        isNaN(data.payback_days)
      ) {
        alert(
          "Erro no cálculo do ROI. Verifique se todos os campos estão preenchidos corretamente."
        );
        return;
      }

      setRoiCalculation(data);
    } catch (error) {
      console.error("💥 Erro ao calcular ROI:", error);
      alert("Erro ao calcular ROI. Verifique os valores inseridos.");
    }
  };

  const acceptMatch = async (matchId: number): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/matches/${matchId}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Match aceito com sucesso!");
        fetchMatches();
      }
    } catch (error) {
      console.error("Error accepting match:", error);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat("pt-BR").format(value);
  };

  const handleInputChange = useCallback(
    (field: keyof LoginForm, value: string) => {
      setLoginForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleROIInputChange = useCallback(
    (field: keyof ROIForm, value: string) => {
      setRoiForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleLogin();
      }
    },
    [loginForm]
  );

  // Navigation Component
  const Navigation: React.FC = () => (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold">ReciLoop</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {(
              [
                "dashboard",
                "matches",
                "calculator",
                "inventory",
                "esg",
              ] as const
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`hover:text-orange-400 transition ${
                  currentPage === page ? "text-orange-400" : ""
                }`}
              >
                {page === "dashboard" && "Dashboard"}
                {page === "matches" && "Matches"}
                {page === "calculator" && "Calculadora ROI"}
                {page === "inventory" && "Inventário"}
                {page === "esg" && "Ranking ESG"}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {(
              [
                "dashboard",
                "matches",
                "calculator",
                "inventory",
                "esg",
              ] as const
            ).map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
              >
                {page === "dashboard" && "Dashboard"}
                {page === "matches" && "Matches"}
                {page === "calculator" && "Calculadora ROI"}
                {page === "inventory" && "Inventário"}
                {page === "esg" && "Ranking ESG"}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 bg-red-600 rounded mt-4"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );

  // Login Page
  const LoginPage: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-4">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">ReciLoop</h1>
            <p className="text-gray-600 mt-2">Economia Circular em Suape</p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-black"
                placeholder="empresa@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-black"
                placeholder="••••••••"
                onKeyPress={handleKeyPress}
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition transform hover:scale-[1.02]"
            >
              Entrar
            </button>
          </div>
          <div className="mt-6 text-center text-sm text-gray-600">
            <p className="font-semibold mb-2">
              Empresas disponíveis para teste:
            </p>
            <div className="mt-2 bg-gray-50 rounded-lg p-3 text-xs">
              <p className="font-mono text-gray-800">refinaria@example.com</p>
              <p className="font-mono text-gray-800">cimpor@example.com</p>
              <p className="font-mono text-gray-800">
                petroquimica@example.com
              </p>
              <p className="font-mono text-gray-800">bunge@example.com</p>
              <p className="mt-2 text-gray-600">
                Senha:{" "}
                <span className="font-mono text-gray-800">password123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard Page
  const DashboardPage: React.FC = () => {
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
    ];

    const COLORS = ["#F4821E", "#D26709", "#5A5326", "#8B7355"];

    const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
            <p className="font-semibold text-gray-800">{data.name}</p>
            <p className="text-sm text-gray-600">Volume: {data.quantity}</p>
            <p className="text-sm text-gray-600">Empresas: {data.companies}</p>
            <p className="text-sm font-semibold text-orange-600">
              {data.value}% do total
            </p>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
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
                  <h3 className="text-gray-700 font-medium">
                    Total Economizado
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    +23% em relação ao mês anterior
                  </p>
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
                  <p className="text-sm text-gray-500 mt-1">
                    Equivale a 3.500 árvores plantadas
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="text-2xl font-bold text-orange-600">
                      {dashboardStats.matches_completed}
                    </span>
                  </div>
                  <h3 className="text-gray-700 font-medium">
                    Matches Realizados
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Taxa de sucesso: 87%
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Economia Mensal
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardStats.monthly_trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Distribuição por Tipo de Resíduo
                  </h3>
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
                          name: string;
                          percent?: number;
                        }) =>
                          `${name}: ${
                            percent ? (percent * 100).toFixed(0) : 0
                          }%`
                        }
                        outerRadius={100}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value: string, entry: any) => (
                          <span style={{ color: entry.color }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Matches Page
  const MatchesPage: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Oportunidades de Match
          </h1>
          <button
            onClick={fetchMatches}
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
            <p className="text-sm text-gray-500 mt-2">
              Novos matches aparecem conforme resíduos são cadastrados.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className={`px-4 py-2 rounded-full text-white font-semibold ${
                          match.score >= 90
                            ? "bg-green-500"
                            : match.score >= 80
                            ? "bg-blue-500"
                            : "bg-orange-500"
                        }`}
                      >
                        {match.score}% Match
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {match.waste.name}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Gerador:</span>
                        <p className="font-semibold text-gray-800">
                          {match.generator_company.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Consumidor:</span>
                        <p className="font-semibold text-gray-800">
                          {match.consumer_company.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Economia Estimada:
                        </span>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(match.estimated_savings)}/mês
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center space-x-4">
                      <span className="text-sm text-gray-700 font-medium">
                        {match.waste.quantity} {match.waste.unit} disponíveis
                      </span>
                      <span className="text-sm text-gray-700 font-medium">
                        {formatCurrency(match.waste.price_per_unit)}/
                        {match.waste.unit}
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
                      onClick={() => acceptMatch(match.id)}
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
                <h2 className="text-2xl font-bold text-gray-800">
                  Detalhes do Match
                </h2>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Score de Compatibilidade: {selectedMatch.score}%
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        Compatibilidade Química (40%):
                      </span>
                      <span className="font-semibold">
                        {(((selectedMatch.score * 0.4) / 40) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        Proximidade Geográfica (30%):
                      </span>
                      <span className="font-semibold">95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        Viabilidade Econômica (30%):
                      </span>
                      <span className="font-semibold">
                        {(((selectedMatch.score * 0.3) / 30) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">
                    Informações do Resíduo
                  </h4>
                  <p className="text-gray-600">
                    {selectedMatch.waste.description}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Categoria:</span>
                      <p className="font-semibold text-gray-800">
                        {selectedMatch.waste.category}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Quantidade:</span>
                      <p className="font-semibold text-gray-800">
                        {selectedMatch.waste.quantity}{" "}
                        {selectedMatch.waste.unit}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-gray-800">
                    Benefícios Estimados
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Economia Mensal:</span>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(selectedMatch.estimated_savings)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Redução CO₂:</span>
                      <p className="font-semibold text-green-600">
                        ~{(selectedMatch.waste.quantity * 0.8).toFixed(0)}{" "}
                        ton/mês
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
                      acceptMatch(selectedMatch.id);
                      setSelectedMatch(null);
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
  );

  // ROI Calculator Page
  const CalculatorPage: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Calculadora de ROI
        </h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Resíduo
              </label>
              <select
                value={roiForm.waste_type}
                onChange={(e) =>
                  handleROIInputChange("waste_type", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-black"
              >
                <option value="Borra Oleosa">Borra Oleosa</option>
                <option value="Catalisador FCC Exausto">
                  Catalisador FCC Exausto
                </option>
                <option value="Lodo de ETE Industrial">
                  Lodo de ETE Industrial
                </option>
                <option value="Resíduos de PET">Resíduos de PET</option>
                <option value="Óleo de Soja Usado">Óleo de Soja Usado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume (toneladas)
              </label>
              <input
                type="number"
                value={roiForm.volume}
                onChange={(e) => handleROIInputChange("volume", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custo de Descarte (R$/ton)
              </label>
              <input
                type="number"
                value={roiForm.disposal_cost}
                onChange={(e) =>
                  handleROIInputChange("disposal_cost", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço de Mercado (R$/ton)
              </label>
              <input
                type="number"
                value={roiForm.market_price}
                onChange={(e) =>
                  handleROIInputChange("market_price", e.target.value)
                }
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
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Resultado da Análise
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">
                      Lucro Potencial
                    </span>
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
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(roiCalculation.roi_percentage)}%
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Payback</span>
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    {roiCalculation.payback_days} dias
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">
                      Economia Anual
                    </span>
                    <Package className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(roiCalculation.potential_profit * 12)}
                  </p>
                </div>
              </div>
              <div className="mt-6 bg-orange-100 rounded-lg p-4">
                <p className="text-sm text-gray-800">
                  <strong>Análise:</strong> Com base nos dados fornecidos, a
                  participação no ReciLoop pode gerar um retorno de{" "}
                  {formatNumber(roiCalculation.roi_percentage)}% sobre o
                  investimento mensal de R$ 1.500, com payback em apenas{" "}
                  {roiCalculation.payback_days} dias.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Inventory Page
  const InventoryPage: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Inventário em Tempo Real
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Atualizado automaticamente a cada 5 segundos •
              <span className="text-green-600 font-medium">
                {" "}
                {inventoryUpdates} atualizações
              </span>
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
                    <h3 className="text-xl font-semibold text-gray-800">
                      {item.waste.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === "disponível"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
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
                      <p className="font-semibold text-gray-800">
                        {item.company.name}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Quantidade:</span>
                      <p className="font-semibold text-gray-800">
                        {item.waste.quantity} {item.waste.unit}
                        {Math.random() > 0.5 && (
                          <span className="text-xs text-green-600 ml-1">↑</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Preço:</span>
                      <p className="font-semibold text-gray-800">
                        {formatCurrency(item.waste.price_per_unit)}/
                        {item.waste.unit}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Categoria:</span>
                      <p className="font-semibold text-gray-800">
                        {item.waste.category}
                      </p>
                    </div>
                  </div>
                  {item.interested_companies.length > 0 && (
                    <div className="mt-4 flex items-center space-x-2">
                      <span className="text-sm text-gray-700 font-medium">
                        Empresas interessadas:
                      </span>
                      <div className="flex space-x-2">
                        {item.interested_companies.map((company, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    Última atualização: há {Math.floor(Math.random() * 60)}{" "}
                    segundos
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
  );

  // ESG Ranking Page
  const ESGPage: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Ranking ESG - Score de Circularização
        </h1>
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
                  <tr
                    key={company.company_id}
                    className="hover:bg-gray-50 transition"
                  >
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
                      <span className="font-semibold text-gray-800">
                        {company.company_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="relative w-20 h-20">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="#e5e7eb"
                              strokeWidth="8"
                              fill="none"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="#10b981"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 36}`}
                              strokeDashoffset={`${
                                2 *
                                Math.PI *
                                36 *
                                (1 - company.circular_score / 100)
                              }`}
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center font-bold text-gray-800">
                            {company.circular_score}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-800">
                      {company.transactions_count}
                    </td>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Como o Score é Calculado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <span className="font-semibold text-gray-800">
                  Volume de Transações
                </span>
              </div>
              <p className="text-gray-700">
                Quantidade e frequência de matches realizados na plataforma
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <span className="font-semibold text-gray-800">
                  Impacto Econômico
                </span>
              </div>
              <p className="text-gray-700">
                Valor total economizado através da economia circular
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">3</span>
                </div>
                <span className="font-semibold text-gray-800">
                  Redução de Emissões
                </span>
              </div>
              <p className="text-gray-700">
                Toneladas de CO₂ evitadas através do reuso de resíduos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      {currentPage === "dashboard" && <DashboardPage />}
      {currentPage === "matches" && <MatchesPage />}
      {currentPage === "calculator" && <CalculatorPage />}
      {currentPage === "inventory" && <InventoryPage />}
      {currentPage === "esg" && <ESGPage />}
    </>
  );
}
