// services/api.ts

import { Asset, AssetType, LoanRecord, StatusDistribution, OverdueAsset, CategoryStat } from '@/types';

// Asset API calls
export const assetAPI = {
  async getAll(): Promise<Asset[]> {
    try {
      const response = await fetch("/api/assets");
      const data = await response.json();
      return data.assets || [];
    } catch (error) {
      console.error("获取资产失败:", error);
      return [];
    }
  },

  async create(assetData: Partial<Asset>): Promise<boolean> {
    try {
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetData),
      });
      
      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("添加资产时出错:", error);
      throw error;
    }
  },

  async update(id: number, assetData: Partial<Asset>): Promise<boolean> {
    try {
      const response = await fetch(`/api/assets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetData),
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("更新资产时出错:", error);
      throw error;
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/assets/${id}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("删除资产时出错:", error);
      throw error;
    }
  }
};

// Asset Types API calls
export const assetTypeAPI = {
  async getAll(): Promise<AssetType[]> {
    try {
      const response = await fetch("/api/asset-types");
      const data = await response.json();
      return data.assetTypes || [];
    } catch (error) {
      console.error("获取资产类型失败:", error);
      return [];
    }
  }
};

// Loan Records API calls
export const loanRecordAPI = {
  async getAll(): Promise<LoanRecord[]> {
    try {
      const response = await fetch("/api/records");
      const data = await response.json();
      return data.records || [];
    } catch (error) {
      console.error("获取借还记录失败:", error);
      return [];
    }
  },

  async create(loanData: {
    asset_id: number;
    borrower_name: string;
    expected_return_date?: string;
    notes?: string;
  }): Promise<boolean> {
    try {
      const response = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loanData),
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("创建借用记录时出错:", error);
      throw error;
    }
  },

  async returnAsset(assetId: number): Promise<boolean> {
    try {
      const response = await fetch("/api/records", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset_id: assetId }),
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("归还资产时出错:", error);
      throw error;
    }
  }
};

// Reports API calls
export const reportsAPI = {
  async getDashboard(): Promise<{
    statusDistribution: StatusDistribution[];
    overdueAssets: OverdueAsset[];
    categoryStats: CategoryStat[];
  }> {
    try {
      const response = await fetch("/api/reports/dashboard");
      const data = await response.json();
      return {
        statusDistribution: data.statusDistribution || [],
        overdueAssets: data.overdueAssets || [],
        categoryStats: data.categoryStats || []
      };
    } catch (error) {
      console.error("获取报告数据失败:", error);
      return {
        statusDistribution: [],
        overdueAssets: [],
        categoryStats: []
      };
    }
  }
};
