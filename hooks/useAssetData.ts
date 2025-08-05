// hooks/useAssetData.ts

import { useState, useEffect, useCallback } from 'react';
import { Asset, AssetType, LoanRecord, StatusDistribution, OverdueAsset, CategoryStat } from '@/types';
import { assetAPI, assetTypeAPI, loanRecordAPI, reportsAPI } from '@/services/api';

export const useAssetData = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [loanRecords, setLoanRecords] = useState<LoanRecord[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<StatusDistribution[]>([]);
  const [overdueAssets, setOverdueAssets] = useState<OverdueAsset[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssets = async () => {
    const data = await assetAPI.getAll();
    setAssets(data);
  };

  const fetchAssetTypes = async () => {
    const data = await assetTypeAPI.getAll();
    setAssetTypes(data);
  };

  const fetchLoanRecords = async () => {
    const data = await loanRecordAPI.getAll();
    setLoanRecords(data);
  };

  const fetchReports = async () => {
    const data = await reportsAPI.getDashboard();
    setStatusDistribution(data.statusDistribution);
    setOverdueAssets(data.overdueAssets);
    setCategoryStats(data.categoryStats);
  };

  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchAssets(),
      fetchAssetTypes(),
      fetchLoanRecords(),
      fetchReports(),
    ]);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await refreshData();
      setIsLoading(false);
    };
    
    loadData();
  }, [refreshData]);

  return {
    assets,
    assetTypes,
    loanRecords,
    statusDistribution,
    overdueAssets,
    categoryStats,
    isLoading,
    refreshData,
    fetchAssets,
    fetchLoanRecords,
    fetchReports,
  };
};
