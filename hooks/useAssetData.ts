// hooks/useAssetData.ts

import { useState, useEffect, useCallback } from "react";
import {
  Asset,
  AssetType,
  LoanRecord,
  StatusDistribution,
  OverdueAsset,
  CategoryStat,
} from "@/types";
import {
  assetAPI,
  assetTypeAPI,
  loanRecordAPI,
  reportsAPI,
} from "@/services/api";

export const useAssetData = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [loanRecords, setLoanRecords] = useState<LoanRecord[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<
    StatusDistribution[]
  >([]);
  const [overdueAssets, setOverdueAssets] = useState<OverdueAsset[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAssets, setTotalAssets] = useState(0);

  // Pagination State for Assets
  const [assetPage, setAssetPage] = useState(1);
  const [totalAssetPages, setTotalAssetPages] = useState(1);

  // Pagination State for Loan Records
  const [loanRecordPage, setLoanRecordPage] = useState(1);
  const [totalLoanRecordPages, setTotalLoanRecordPages] = useState(1);

  const fetchAssets = useCallback(async (page: number) => {
    const { assets, totalAssets: total, totalPages } = await assetAPI.getAll(page, 6); // 每页获取6个
    setAssets(assets);
    setTotalAssets(total);
    setTotalAssetPages(totalPages);
  }, []);

  const fetchAssetTypes = async () => {
    const data = await assetTypeAPI.getAll();
    setAssetTypes(data);
  };

  const fetchLoanRecords = useCallback(async (page: number) => {
    const { records, totalPages } = await loanRecordAPI.getAll(page, 10);
    setLoanRecords(records);
    setTotalLoanRecordPages(totalPages);
  }, []);

  const fetchReports = async () => {
    const data = await reportsAPI.getDashboard();
    setStatusDistribution(data.statusDistribution);
    setOverdueAssets(data.overdueAssets);
    setCategoryStats(data.categoryStats);
  };

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([
      fetchAssets(1),
      fetchAssetTypes(),
      fetchLoanRecords(1),
      fetchReports(),
    ]);
    setAssetPage(1);
    setLoanRecordPage(1);
    setIsLoading(false);
  }, [fetchAssets, fetchLoanRecords]);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchAssets(1),
        fetchAssetTypes(),
        fetchLoanRecords(1),
        fetchReports(),
      ]);
      setIsLoading(false);
    };
    loadInitialData();
  }, [fetchAssets, fetchLoanRecords]);

  // Effect for asset pagination
  useEffect(() => {
    fetchAssets(assetPage);
  }, [assetPage, fetchAssets]);

  // Effect for loan record pagination
  useEffect(() => {
    fetchLoanRecords(loanRecordPage);
  }, [loanRecordPage, fetchLoanRecords]);

  return {
    assets,
    assetTypes,
    loanRecords,
    statusDistribution,
    overdueAssets,
    categoryStats,
    isLoading,
    refreshData,
    assetPage,
    setAssetPage,
    totalAssetPages,
    loanRecordPage,
    setLoanRecordPage,
    totalLoanRecordPages,
    totalAssets,
  };
};
