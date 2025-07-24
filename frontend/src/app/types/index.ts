export interface Company {
  id: number;
  name: string;
  email?: string;
}

export interface Waste {
  id: number;
  name: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
}

export interface Match {
  id: number;
  score: number;
  waste: Waste;
  generator_company: Company;
  consumer_company: Company;
  estimated_savings: number;
}

export interface DashboardStats {
  total_savings: number;
  co2_avoided: number;
  matches_completed: number;
  monthly_trend: MonthlyTrend[];
}

export interface MonthlyTrend {
  month: string;
  savings: number;
}

export interface InventoryItem {
  waste: Waste;
  company: Company;
  status: string;
  interested_companies: string[];
}

export interface ESGRanking {
  company_id: number;
  company_name: string;
  position: number;
  circular_score: number;
  transactions_count: number;
  total_savings: number;
  co2_avoided: number;
}

export interface ROICalculation {
  potential_profit: number;
  roi_percentage: number;
  payback_days: number;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface ROIForm {
  waste_type: string;
  volume: string;
  disposal_cost: string;
  market_price: string;
}

export type PageType = 'login' | 'dashboard' | 'matches' | 'calculator' | 'inventory' | 'esg';

export interface PieData {
  name: string;
  value: number;
  quantity: string;
  companies: number;
}

export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: PieData;
  }>;
}
