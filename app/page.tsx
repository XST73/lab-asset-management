// app/page.tsx - Optimized version

"use client";

import { useState } from "react";
import { Activity, BarChart3, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import optimized components
import Background from "@/components/layout/Background";
import Header from "@/components/layout/Header";
import StatsCards from "@/components/dashboard/StatsCards";
import AssetFilters from "@/components/assets/AssetFilters";
import AssetList from "@/components/assets/AssetList";
import LoanRecordsTable from "@/components/loans/LoanRecordsTable";
import ReportsSection from "@/components/reports/ReportsSection";
import AddAssetDialog from "@/components/modals/AddAssetDialog";
import EditAssetDialog from "@/components/modals/EditAssetDialog";

// Import custom hooks and utilities
import { useAssetData } from "@/hooks/useAssetData";
import { filterAssets, calculateAssetCounts } from "@/utils/helpers";
import { Asset } from "@/types";
import { assetAPI, loanRecordAPI } from "@/services/api";

export default function LabAssetManagement() {
  const {
    assets,
    assetTypes,
    loanRecords,
    statusDistribution,
    overdueAssets,
    categoryStats,
    isLoading,
    refreshData,
  } = useAssetData();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // Event handlers
  const handleAssetAdded = async () => {
    await refreshData();
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setIsEditDialogOpen(true);
  };

  const handleUpdateAsset = async (updatedAsset: Asset) => {
    try {
      await assetAPI.update(updatedAsset.id, updatedAsset);
      alert("资产更新成功!");
      await refreshData();
      setIsEditDialogOpen(false);
      setEditingAsset(null);
    } catch (error) {
      alert(`更新失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const handleDeleteAsset = async (assetId: number) => {
    if (!confirm("确定要永久删除此资产吗？此操作不可撤销。")) return;

    try {
      await assetAPI.delete(assetId);
      alert("资产删除成功!");
      await refreshData();
    } catch (error) {
      alert(`删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const handleLoanAsset = async (
    assetId: number,
    borrower: string,
    dueDate: string,
    notes: string
  ) => {
    try {
      await loanRecordAPI.create({
        asset_id: assetId,
        borrower_name: borrower,
        expected_return_date: dueDate,
        notes,
      });
      alert("资产借出成功!");
      await refreshData();
    } catch (error) {
      alert(`借出失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const handleReturnAsset = async (assetId: number) => {
    if (!confirm("确定要归还此资产吗？")) return;

    try {
      await loanRecordAPI.returnAsset(assetId);
      alert("资产归还成功!");
      await refreshData();
    } catch (error) {
      alert(`归还失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // Computed values
  const filteredAssets = filterAssets(assets, searchTerm, selectedCategory, selectedStatus);
  const { available, onLoan, maintenance } = calculateAssetCounts(assets);
  const overdueCount = overdueAssets.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      <Background />

      <Header>
        <AddAssetDialog assetTypes={assetTypes} onAssetAdded={handleAssetAdded} />
      </Header>

      <main className="relative max-w-7xl mx-auto px-8 lg:px-12 py-12">
        <StatsCards
          availableCount={available}
          onLoanCount={onLoan}
          maintenanceCount={maintenance}
          overdueCount={overdueCount}
        />

        <Tabs defaultValue="assets" className="space-y-10">
          <TabsList className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-lg p-5 inline-flex rounded-xl">
            <TabsTrigger
              value="assets"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#003399] data-[state=active]:to-[#3366cc] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 px-10 py-6 font-semibold whitespace-nowrap rounded-xl ml-[-24px]"
            >
              <Activity className="w-4 h-4 mr-2" /> 资产清单
            </TabsTrigger>
            <TabsTrigger
              value="loans"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#003399] data-[state=active]:to-[#3366cc] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl px-10 py-6 font-semibold whitespace-nowrap"
            >
              <BarChart3 className="w-4 h-4 mr-2" /> 借还管理
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#003399] data-[state=active]:to-[#3366cc] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl px-10 py-6 font-semibold whitespace-nowrap mr-[-24px]"
            >
              <Settings className="w-4 h-4 mr-2" />
              数据报告
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="space-y-10">
            <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 rounded-2xl">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  资产清单
                </CardTitle>
                <CardDescription className="text-gray-600 text-base mt-2">
                  管理和跟踪所有实验室设备
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AssetFilters
                  searchTerm={searchTerm}
                  selectedCategory={selectedCategory}
                  selectedStatus={selectedStatus}
                  assetTypes={assetTypes}
                  onSearchChange={setSearchTerm}
                  onCategoryChange={setSelectedCategory}
                  onStatusChange={setSelectedStatus}
                />

                <AssetList
                  assets={filteredAssets}
                  assetTypes={assetTypes}
                  isLoading={isLoading}
                  onEdit={handleEditAsset}
                  onDelete={handleDeleteAsset}
                  onLoan={handleLoanAsset}
                  onReturn={handleReturnAsset}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans" className="space-y-10">
            <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 rounded-2xl">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  借还管理
                </CardTitle>
                <CardDescription className="text-gray-600 text-base mt-2">
                  跟踪借用记录和归还历史
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoanRecordsTable loanRecords={loanRecords} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-10">
            <ReportsSection
              statusDistribution={statusDistribution}
              overdueAssets={overdueAssets}
              categoryStats={categoryStats}
              totalAssets={assets.length}
            />
          </TabsContent>
        </Tabs>
      </main>

      <EditAssetDialog
        asset={editingAsset}
        assetTypes={assetTypes}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleUpdateAsset}
      />
    </div>
  );
}
