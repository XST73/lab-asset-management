// types/index.ts

export interface Asset {
  id: number;
  name: string;
  model?: string;
  serial_number?: string;
  status: "在库" | "已借出" | "维修中" | "已报废";
  location?: string;
  condition: "完好" | "良好" | "一般" | "较差";
  purchase_date?: string;
  image_url?: string;
  description?: string;
  asset_type_id?: number;
  asset_type_name?: string;
  borrower_name?: string;
  expected_return_date?: string;
}

export interface AssetType {
  id: number;
  name: string;
}

export interface LoanRecord {
  id: number;
  asset_id: number;
  asset_name: string;
  borrower_name: string;
  borrow_date: string;
  expected_return_date?: string;
  actual_return_date?: string;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface OverdueAsset {
  id: number;
  asset_name: string;
  borrower_name: string;
  expected_return_date: string;
}

export interface CategoryStat {
  name: string;
  total: number;
  utilization: number;
}
