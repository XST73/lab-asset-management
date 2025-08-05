/* eslint-disable @typescript-eslint/no-unused-vars */
// app/page.tsx

"use client";

import { useState, useEffect } from "react";
// ... (所有 import 保持不变)
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Package,
  Users,
  Clock,
  AlertTriangle,
  Camera,
  Glasses,
  Headphones,
  Monitor,
  Edit,
  Trash2,
  Activity,
  BarChart3,
  Settings,
} from "lucide-react";

interface Asset {
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

interface AssetType {
  id: number;
  name: string;
}

interface LoanRecord {
  id: number;
  asset_id: number;
  asset_name: string;
  borrower_name: string;
  borrow_date: string;
  expected_return_date?: string;
  actual_return_date?: string;
}

interface StatusDistribution {
  status: string;
  count: number;
}

interface OverdueAsset {
  id: number;
  asset_name: string;
  borrower_name: string;
  expected_return_date: string;
}

interface CategoryStat {
  name: string;
  total: number;
  utilization: number;
}

export default function LabAssetManagement() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [loanRecords, setLoanRecords] = useState<LoanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetModel, setNewAssetModel] = useState("");
  const [newAssetSerial, setNewAssetSerial] = useState("");
  const [newAssetTypeId, setNewAssetTypeId] = useState("");
  const [newAssetLocation, setNewAssetLocation] = useState("");
  const [newAssetCondition, setNewAssetCondition] = useState("良好");
  const [newAssetPurchaseDate, setNewAssetPurchaseDate] = useState("");
  const [newAssetDescription, setNewAssetDescription] = useState("");
  const [loanBorrower, setLoanBorrower] = useState("");
  const [loanDueDate, setLoanDueDate] = useState("");
  const [loanNotes, setLoanNotes] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [statusDistribution, setStatusDistribution] = useState<
    StatusDistribution[]
  >([]);
  const [overdueAssets, setOverdueAssets] = useState<OverdueAsset[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);

  const fetchAssets = async () => {
    try {
      const response = await fetch("/api/assets");
      const data = await response.json();
      setAssets(data.assets || []);
    } catch (error) {
      console.error("获取资产失败:", error);
    }
  };
  const fetchAssetTypes = async () => {
    try {
      const response = await fetch("/api/asset-types");
      const data = await response.json();
      setAssetTypes(data.assetTypes || []);
    } catch (error) {
      console.error("获取资产类型失败:", error);
    }
  };
  const fetchLoanRecords = async () => {
    try {
      const response = await fetch("/api/records");
      const data = await response.json();
      setLoanRecords(data.records || []);
    } catch (error) {
      console.error("获取借还记录失败:", error);
    }
  };
  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports/dashboard");
      const data = await response.json();
      setStatusDistribution(data.statusDistribution || []);
      setOverdueAssets(data.overdueAssets || []);
      setCategoryStats(data.categoryStats || []);
    } catch (error) {
      console.error("获取报告数据失败:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetchAssets(),
      fetchAssetTypes(),
      fetchLoanRecords(),
      fetchReports(),
    ]).then(() => {
      setIsLoading(false);
    });
  }, []);

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAssetData = {
      name: newAssetName,
      model: newAssetModel,
      serial_number: newAssetSerial,
      asset_type_id: parseInt(newAssetTypeId, 10),
      location: newAssetLocation,
      condition: newAssetCondition,
      purchase_date: newAssetPurchaseDate,
      description: newAssetDescription,
      status: "在库",
    };
    try {
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssetData),
      });
      if (response.ok) {
        alert("资产添加成功!");
        setNewAssetName("");
        setNewAssetModel("");
        setNewAssetSerial("");
        setNewAssetTypeId("");
        setNewAssetLocation("");
        setNewAssetCondition("良好");
        setNewAssetPurchaseDate("");
        setNewAssetDescription("");
        fetchAssets();
        fetchReports();
        document.getElementById("add-asset-dialog-close")?.click();
      } else {
        const errorData = await response.json();
        alert(`添加失败: ${errorData.message}`);
      }
    } catch (error) {
      console.error("添加资产时出错:", error);
      alert("网络错误，添加失败");
    }
  };
  const handleLoanAsset = async (assetId: number) => {
    if (!loanBorrower) {
      alert("借用人姓名不能为空");
      return;
    }
    const loanData = {
      asset_id: assetId,
      borrower_name: loanBorrower,
      expected_return_date: loanDueDate,
      notes: loanNotes,
    };
    try {
      const response = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loanData),
      });
      if (response.ok) {
        alert("资产借出成功!");
        setLoanBorrower("");
        setLoanDueDate("");
        setLoanNotes("");
        fetchAssets(); // 刷新列表以更新资产状态
        fetchLoanRecords(); // 刷新借还记录
        fetchReports(); // 刷新报告数据
        document
          .querySelector<HTMLButtonElement>(
            "[data-radix-dialog-close][data-loan-dialog-close]"
          )
          ?.click();
      } else {
        const errorData = await response.json();
        alert(`借出失败: ${errorData.message}`);
      }
    } catch (error) {
      alert("网络错误，借出失败");
    }
  };

  // --- 归还事件处理函数 ---
  const handleReturnAsset = async (assetId: number) => {
    if (!confirm("确定要归还此资产吗？")) return;

    try {
      const response = await fetch("/api/records", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset_id: assetId }),
      });

      if (response.ok) {
        alert("资产归还成功!");
        fetchAssets(); // 刷新列表以更新资产状态
        fetchLoanRecords(); // 刷新借还记录
        fetchReports(); // 刷新报告数据
      } else {
        const errorData = await response.json();
        alert(`归还失败: ${errorData.message}`);
      }
    } catch (error) {
      alert("网络错误，归还失败");
    }
  };

  // --- 删除资产处理函数 ---
  const handleDeleteAsset = async (assetId: number) => {
    if (!confirm("确定要永久删除此资产吗？此操作不可撤销。")) return;

    try {
      const response = await fetch(`/api/assets/${assetId}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        alert("资产删除成功!");
        fetchAssets(); // 刷新列表
        fetchLoanRecords(); // 刷新借还记录
        fetchReports(); // 刷新报告数据
      } else {
        const errorData = await response.json();
        alert(`删除失败: ${errorData.message}`);
      }
    } catch (error) {
      alert("网络错误，删除失败");
    }
  };

  // --- 编辑资产处理函数 ---
  const handleEditClick = (asset: Asset) => {
    setEditingAsset(asset); // 将当前资产数据存入 state
    setIsEditDialogOpen(true); // 打开弹窗
  };

  // 当用户在编辑弹窗中点击“保存更改”时触发
  const handleUpdateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    try {
      const response = await fetch(`/api/assets/${editingAsset.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAsset), // 发送更新后的 editingAsset 数据
      });

      if (response.ok) {
        alert("资产更新成功!");
        fetchAssets(); // 刷新列表
        fetchLoanRecords(); // 刷新借还记录
        fetchReports(); // 刷新报告数据
        setIsEditDialogOpen(false); // 关闭弹窗
        setEditingAsset(null); // 清空编辑状态
      } else {
        const errorData = await response.json();
        alert(`更新失败: ${errorData.message}`);
      }
    } catch (error) {
      alert("网络错误，更新失败");
    }
  };

  // --- UI 辅助函数---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "在库":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800";
      case "已借出":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800";
      case "维修中":
        return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:text-rose-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-800";
    }
  };
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "完好":
        return "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700";
      case "良好":
        return "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700";
      case "一般":
        return "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 hover:text-amber-700";
      case "较差":
        return "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 hover:text-rose-700";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-700";
    }
  };
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "VR Helmet":
        return <Headphones className="w-6 h-6 text-white" />;
      case "AR Glasses":
        return <Glasses className="w-6 h-6 text-white" />;
      case "Camera":
        return <Camera className="w-6 h-6 text-white" />;
      default:
        return <Monitor className="w-6 h-6 text-white" />;
    }
  };
  const getCategoryIconBg = (category: string) => {
    switch (category) {
      case "VR Helmet":
        return "bg-gradient-to-br from-purple-500 to-indigo-600";
      case "AR Glasses":
        return "bg-gradient-to-br from-blue-500 to-cyan-600";
      case "Camera":
        return "bg-gradient-to-br from-green-500 to-emerald-600";
      default:
        return "bg-gradient-to-br from-gray-500 to-slate-600";
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      asset.name.toLowerCase().includes(searchLower) ||
      String(asset.id).toLowerCase().includes(searchLower) ||
      asset.serial_number?.toLowerCase().includes(searchLower);
    const matchesCategory =
      selectedCategory === "all" || asset.asset_type_name === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || asset.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  const availableCount = assets.filter((a) => a.status === "在库").length;
  const onLoanCount = assets.filter((a) => a.status === "已借出").length;
  const maintenanceCount = assets.filter((a) => a.status === "维修中").length;
  const overdueCount = overdueAssets.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* V3版本的动态背景元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-violet-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* 现代化头部设计 */}
      <header className="relative backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#003399] to-[#3366cc] rounded-2xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-br from-[#003399] to-[#3366cc] p-4 rounded-2xl shadow-xl">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  实验室资产管理
                </h1>
                <p className="text-sm text-gray-600/80 font-medium mt-1">
                  “交互技术与体验系统”文旅部重点实验室
                </p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#003399] to-[#3366cc] hover:from-[#003399]/90 hover:to-[#3366cc]/90 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 backdrop-blur-sm border-0 px-8 py-5 rounded-xl font-semibold">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Asset
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[520px] backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl rounded-2xl">
                <DialogHeader className="pb-8">
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                    Add New Asset
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 text-base mt-2">
                    Enter the details of the new laboratory equipment.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddAsset}>
                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="asset-name"
                        className="text-right font-semibold text-gray-700"
                      >
                        Name
                      </Label>
                      <Input
                        id="asset-name"
                        value={newAssetName}
                        onChange={(e) => setNewAssetName(e.target.value)}
                        placeholder="e.g., Meta Quest 3"
                        required
                        className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 rounded-xl py-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="asset-model"
                        className="text-right font-semibold text-gray-700"
                      >
                        Model
                      </Label>
                      <Input
                        id="asset-model"
                        value={newAssetModel}
                        onChange={(e) => setNewAssetModel(e.target.value)}
                        placeholder="e.g., 256GB"
                        className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 rounded-xl py-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="asset-serial"
                        className="text-right font-semibold text-gray-700"
                      >
                        Serial No.
                      </Label>
                      <Input
                        id="asset-serial"
                        value={newAssetSerial}
                        onChange={(e) => setNewAssetSerial(e.target.value)}
                        placeholder="Unique serial number"
                        className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 rounded-xl py-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="category"
                        className="text-right font-semibold text-gray-700"
                      >
                        Category
                      </Label>
                      <Select
                        value={newAssetTypeId}
                        onValueChange={setNewAssetTypeId}
                        required
                      >
                        <SelectTrigger className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl py-3">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="backdrop-blur-xl bg-white/90 border-white/20 rounded-xl">
                          {assetTypes.map((type) => (
                            <SelectItem key={type.id} value={String(type.id)}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="location"
                        className="text-right font-semibold text-gray-700"
                      >
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={newAssetLocation}
                        onChange={(e) => setNewAssetLocation(e.target.value)}
                        placeholder="e.g., Lab A - Shelf 1"
                        className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 rounded-xl py-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="condition"
                        className="text-right font-semibold text-gray-700"
                      >
                        Condition
                      </Label>
                      <Select
                        value={newAssetCondition}
                        onValueChange={setNewAssetCondition}
                      >
                        <SelectTrigger className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl py-3">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent className="backdrop-blur-xl bg-white/90 border-white/20 rounded-xl">
                          <SelectItem value="完好">完好</SelectItem>
                          <SelectItem value="良好">良好</SelectItem>
                          <SelectItem value="一般">一般</SelectItem>
                          <SelectItem value="较差">较差</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="purchase_date"
                        className="text-right font-semibold text-gray-700"
                      >
                        Purchase Date
                      </Label>
                      <Input
                        id="purchase_date"
                        type="date"
                        value={newAssetPurchaseDate}
                        onChange={(e) =>
                          setNewAssetPurchaseDate(e.target.value)
                        }
                        className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 rounded-xl py-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="notes"
                        className="text-right font-semibold text-gray-700"
                      >
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        value={newAssetDescription}
                        onChange={(e) => setNewAssetDescription(e.target.value)}
                        placeholder="Additional notes..."
                        className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 pt-8">
                    <DialogClose asChild>
                      <Button
                        id="add-asset-dialog-close"
                        type="button"
                        variant="outline"
                        className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 rounded-xl px-6"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#003399] to-[#3366cc] hover:from-[#003399]/90 hover:to-[#3366cc]/90 text-white rounded-xl px-6"
                    >
                      Add Asset
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      <main className="relative max-w-7xl mx-auto px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 group rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-gray-700 tracking-wide">
                Available Assets
              </CardTitle>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-emerald-500 to-green-500 p-3 rounded-xl">
                  <Package className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                {availableCount}
              </div>
              <p className="text-xs text-gray-600/80 font-medium">
                Ready for use
              </p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 group rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-gray-700 tracking-wide">
                On Loan
              </CardTitle>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-amber-500 to-yellow-500 p-3 rounded-xl">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                {onLoanCount}
              </div>
              <p className="text-xs text-gray-600/80 font-medium">
                Currently borrowed
              </p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 group rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-gray-700 tracking-wide">
                Maintenance
              </CardTitle>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-red-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-rose-500 to-red-500 p-3 rounded-xl">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-2">
                {maintenanceCount}
              </div>
              <p className="text-xs text-gray-600/80 font-medium">
                Under repair
              </p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 group rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-gray-700 tracking-wide">
                Overdue
              </CardTitle>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                {overdueCount}
              </div>
              <p className="text-xs text-gray-600/80 font-medium">
                Past due date
              </p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="assets" className="space-y-10">
          <TabsList className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-lg p-5 inline-flex rounded-xl">
            <TabsTrigger
              value="assets"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#003399] data-[state=active]:to-[#3366cc] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 px-10 py-6 font-semibold whitespace-nowrap rounded-xl ml-[-24px]"
            >
              <Activity className="w-4 h-4 mr-2" /> Asset Inventory
            </TabsTrigger>
            <TabsTrigger
              value="loans"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#003399] data-[state=active]:to-[#3366cc] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl px-10 py-6 font-semibold whitespace-nowrap"
            >
              <BarChart3 className="w-4 h-4 mr-2" /> Loan Management
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#003399] data-[state=active]:to-[#3366cc] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl px-10 py-6 font-semibold whitespace-nowrap mr-[-24px]"
            >
              <Settings className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="space-y-10">
            <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 rounded-2xl">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Asset Inventory
                </CardTitle>
                <CardDescription className="text-gray-600 text-base mt-2">
                  Manage and track all laboratory equipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-6 mb-10">
                  <div className="relative flex-1 ">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />
                    <Input
                      type="search"
                      placeholder="Search assets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 bg-white/80 border-gray-200/50 focus:bg-white focus:border-[#3366cc]/50 transition-all duration-300 rounded-xl py-5 text-base shadow-sm"
                    />
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full sm:w-[220px] bg-white/80 border-gray-200/50 focus:border-[#3366cc]/50 rounded-xl py-5 shadow-sm">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 rounded-xl shadow-xl">
                      <SelectItem value="all">All Categories</SelectItem>
                      {assetTypes.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-full sm:w-[220px] bg-white/80 border-gray-200/50 focus:border-[#3366cc]/50 rounded-xl py-5 shadow-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 rounded-xl shadow-xl">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="在库">在库</SelectItem>
                      <SelectItem value="已借出">已借出</SelectItem>
                      <SelectItem value="维修中">维修中</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isLoading ? (
                  <div className="text-center py-10">Loading assets...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAssets.map((asset) => (
                      <Card
                        key={asset.id}
                        className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 group hover:scale-[1.02] rounded-2xl flex flex-col h-full"
                      >
                        <CardHeader className="pb-6 flex-shrink-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`${getCategoryIconBg(
                                  asset.asset_type_name || ""
                                )} p-3 rounded-xl shadow-lg`}
                              >
                                {getCategoryIcon(asset.asset_type_name || "")}
                              </div>
                              <div>
                                <CardTitle className="text-lg font-bold text-gray-900">
                                  {asset.name}
                                </CardTitle>
                                <CardDescription className="font-semibold text-gray-600 mt-1">
                                  {asset.serial_number}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-white/50 backdrop-blur-sm rounded-lg"
                                onClick={() => handleEditClick(asset)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-white/50 backdrop-blur-sm rounded-lg"
                                onClick={() => handleDeleteAsset(asset.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6 flex-grow flex flex-col">
                          <div className="flex justify-between items-center">
                            <Badge
                              className={`${getStatusColor(
                                asset.status
                              )} font-semibold px-4 py-2 rounded-full`}
                            >
                              {asset.status}
                            </Badge>
                            <Badge
                              className={`${getConditionColor(
                                asset.condition
                              )} font-semibold px-4 py-2 rounded-full`}
                            >
                              {asset.condition}
                            </Badge>
                          </div>
                          <div className="text-sm space-y-3 bg-white/30 backdrop-blur-sm rounded-xl p-5 border border-white/20 flex-grow">
                            <p>
                              <strong className="text-gray-900">
                                Location:
                              </strong>{" "}
                              <span className="text-gray-700">
                                {asset.location}
                              </span>
                            </p>
                            <p>
                              <strong className="text-gray-900">
                                Category:
                              </strong>{" "}
                              <span className="text-gray-700">
                                {asset.asset_type_name}
                              </span>
                            </p>
                            {asset.status === "已借出" && asset.borrower_name && (
                              <>
                                <p>
                                  <strong className="text-gray-900">
                                    Borrower:
                                  </strong>{" "}
                                  <span className="text-gray-700">
                                    {asset.borrower_name}
                                  </span>
                                </p>
                                {asset.expected_return_date && (
                                  <p>
                                    <strong className="text-gray-900">
                                      Due:
                                    </strong>{" "}
                                    <span className="text-gray-700">
                                      {new Date(asset.expected_return_date).toLocaleDateString()}
                                    </span>
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex space-x-3 mt-auto">
                            {asset.status === "在库" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="flex-1 bg-gradient-to-r from-[#003399] to-[#3366cc] hover:from-[#003399]/90 hover:to-[#3366cc]/90 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 rounded-xl font-semibold py-5"
                                  >
                                    Loan Out
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl rounded-2xl">
                                  <DialogHeader>
                                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                                      Loan Asset
                                    </DialogTitle>
                                    <DialogDescription className="text-gray-600 mt-2">
                                      Record the loan of {asset.name} (
                                      {asset.serial_number})
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-6 py-6">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label
                                        htmlFor="borrower"
                                        className="text-right font-semibold text-gray-700"
                                      >
                                        Borrower
                                      </Label>
                                      <Input
                                        id="borrower"
                                        onChange={(e) =>
                                          setLoanBorrower(e.target.value)
                                        }
                                        placeholder="Enter borrower name"
                                        className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl py-4"
                                        required
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label
                                        htmlFor="due-date"
                                        className="text-right font-semibold text-gray-700"
                                      >
                                        Due Date
                                      </Label>
                                      <Input
                                        id="due-date"
                                        onChange={(e) =>
                                          setLoanDueDate(e.target.value)
                                        }
                                        type="date"
                                        className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl pb-2 pt-2"
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label
                                        htmlFor="loan-notes"
                                        className="text-right font-semibold text-gray-700"
                                      >
                                        Notes
                                      </Label>
                                      <Textarea
                                        id="loan-notes"
                                        onChange={(e) =>
                                          setLoanNotes(e.target.value)
                                        }
                                        placeholder="Loan notes..."
                                        className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end space-x-4">
                                    <DialogClose asChild>
                                      <Button
                                        data-loan-dialog-close
                                        type="button"
                                        variant="outline"
                                        className="backdrop-blur-sm bg-white/50 border-white/30 rounded-xl px-6"
                                      >
                                        Cancel
                                      </Button>
                                    </DialogClose>
                                    <Button
                                      onClick={() => handleLoanAsset(asset.id)}
                                      className="bg-gradient-to-r from-[#003399] to-[#3366cc] hover:from-[#003399]/90 hover:to-[#3366cc]/90 text-white rounded-xl px-6"
                                    >
                                      Create Loan
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                            {asset.status === "已借出" && (
                              <Button
                                onClick={() => handleReturnAsset(asset.id)}
                                size="sm"
                                variant="outline"
                                className="flex-1 backdrop-blur-sm bg-slate/50 hover:bg-slate/70 transition-all duration-300 rounded-xl font-semibold py-5 border-slate-300"
                              >
                                Return
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="loans" className="space-y-10">
            <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 rounded-2xl">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Loan Management
                </CardTitle>
                <CardDescription className="text-gray-600 text-base mt-2">
                  Track active loans and return history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="backdrop-blur-sm bg-white/30 rounded-xl border border-white/20 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20 hover:bg-white/20">
                        <TableHead className="font-bold text-gray-700 py-6">
                          Asset
                        </TableHead>
                        <TableHead className="font-bold text-gray-700 py-6">
                          Borrower
                        </TableHead>
                        <TableHead className="font-bold text-gray-700 py-6">
                          Loan Date
                        </TableHead>
                        <TableHead className="font-bold text-gray-700 py-6">
                          Return Date
                        </TableHead>
                        <TableHead className="font-bold text-gray-700 py-6">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loanRecords.map((loan) => {
                        const isReturned = !!loan.actual_return_date;
                        const isOverdue =
                          !isReturned &&
                          loan.expected_return_date &&
                          new Date(loan.expected_return_date) < new Date();
                        return (
                          <TableRow
                            key={loan.id}
                            className="border-white/20 hover:bg-white/30 transition-colors"
                          >
                            <TableCell className="py-6">
                              <div className="font-bold text-gray-900">
                                {loan.asset_name}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                ID: {loan.asset_id}
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-gray-900 py-6">
                              {loan.borrower_name}
                            </TableCell>
                            <TableCell className="text-gray-900 py-6">
                              {new Date(loan.borrow_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="py-6">
                              <span
                                className={
                                  isOverdue
                                    ? "text-red-600 font-bold"
                                    : "text-gray-900 font-semibold"
                                }
                              >
                                {isReturned
                                  ? new Date(
                                      loan.actual_return_date!
                                    ).toLocaleDateString()
                                  : loan.expected_return_date
                                  ? new Date(
                                      loan.expected_return_date
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </span>
                            </TableCell>
                            <TableCell className="py-6">
                              <Badge
                                className={
                                  isReturned
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 font-semibold px-4 py-2 rounded-2xl"
                                    : isOverdue
                                    ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800 font-semibold px-4 py-2 rounded-2xl"
                                    : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800 font-semibold px-4 py-2 rounded-2xl"
                                }
                              >
                                {isReturned
                                  ? "Returned"
                                  : isOverdue
                                  ? "Overdue"
                                  : "On Loan"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-10">
            <div className="flex flex-col gap-10">
              {/* Row 1: Category Stats (Large, full-width) */}
              <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 rounded-2xl w-full">
                <CardHeader className="pb-8">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                    Asset Categories Overview
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base mt-2">
                    Breakdown of asset count and current utilization by
                    category.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryStats.map((item) => (
                      <div
                        key={item.name}
                        className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl p-5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-baseline">
                            <h3 className="text-lg font-bold text-gray-900">
                              {item.name}
                            </h3>
                            <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-900 bg-clip-text text-transparent">
                              {item.total}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium">
                            Total Units
                          </p>
                        </div>
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
                              style={{ width: `${item.utilization}%` }}
                            ></div>
                          </div>
                          <p className="text-right text-sm font-semibold text-gray-700 mt-1">
                            {item.utilization}% In Use
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Row 2: Two smaller cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Card 2.1: Asset Status Distribution */}
                <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 rounded-2xl">
                  <CardHeader className="pb-8">
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                      Asset Status
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base mt-2">
                      Overall status of all assets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {statusDistribution.map((item) => (
                        <div
                          key={item.status}
                          className="flex items-center text-sm"
                        >
                          <span className="w-20 font-semibold text-gray-700">
                            {item.status}
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-3.5 mr-3">
                            <div
                              className={`h-3.5 rounded-full ${getStatusColor(
                                item.status
                              )
                                .replace("text-emerald-700", "bg-emerald-400")
                                .replace("text-amber-700", "bg-amber-400")
                                .replace("text-rose-700", "bg-rose-400")}`}
                              style={{
                                width: `${(item.count / assets.length) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="font-bold text-gray-800">
                            {item.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2.2: Overdue Assets */}
                <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 rounded-2xl">
                  <CardHeader className="pb-8">
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                      Overdue Assets
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base mt-2">
                      Assets past their due date
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-48 overflow-y-auto">
                      {overdueAssets.length > 0 ? (
                        overdueAssets.map((item) => {
                          const dueDate = new Date(item.expected_return_date);
                          const today = new Date();
                          const timeDiff = today.getTime() - dueDate.getTime();
                          const daysOverdue = Math.floor(
                            timeDiff / (1000 * 3600 * 24)
                          );
                          return (
                            <div
                              key={item.id}
                              className="flex justify-between items-center p-3 rounded-xl backdrop-blur-sm bg-white/30 border border-white/20 text-sm"
                            >
                              <div>
                                <div className="font-bold text-gray-900">
                                  {item.asset_name}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  To: {item.borrower_name}
                                </div>
                              </div>
                              <Badge variant="destructive">
                                {daysOverdue} days overdue
                              </Badge>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center text-gray-500 py-4">
                          No overdue assets.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      {editingAsset && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[520px] backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl rounded-2xl">
            <DialogHeader className="pb-8">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Edit Asset
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base mt-2">
                Update the details for: {editingAsset.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateAsset}>
              <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
                {/* Name */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="edit-asset-name"
                    className="text-right font-semibold text-gray-700"
                  >
                    Name
                  </Label>
                  <Input
                    id="edit-asset-name"
                    value={editingAsset.name}
                    onChange={(e) =>
                      setEditingAsset({ ...editingAsset, name: e.target.value })
                    }
                    className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 rounded-xl py-3"
                  />
                </div>
                {/* Model */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="edit-asset-model"
                    className="text-right font-semibold text-gray-700"
                  >
                    Model
                  </Label>
                  <Input
                    id="edit-asset-model"
                    value={editingAsset.model || ""}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        model: e.target.value,
                      })
                    }
                    className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 rounded-xl py-3"
                  />
                </div>
                {/* Serial Number */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="edit-asset-serial"
                    className="text-right font-semibold text-gray-700"
                  >
                    Serial No.
                  </Label>
                  <Input
                    id="edit-asset-serial"
                    value={editingAsset.serial_number || ""}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        serial_number: e.target.value,
                      })
                    }
                    className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 rounded-xl py-3"
                  />
                </div>
                {/* Category */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="edit-category"
                    className="text-right font-semibold text-gray-700"
                  >
                    Category
                  </Label>
                  <Select
                    value={String(editingAsset.asset_type_id || "")}
                    onValueChange={(value) =>
                      setEditingAsset({
                        ...editingAsset,
                        asset_type_id: parseInt(value, 10),
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl py-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-xl bg-white/90 border-white/20 rounded-xl">
                      {assetTypes.map((type) => (
                        <SelectItem key={type.id} value={String(type.id)}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Location */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="edit-location"
                    className="text-right font-semibold text-gray-700"
                  >
                    Location
                  </Label>
                  <Input
                    id="edit-location"
                    value={editingAsset.location || ""}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        location: e.target.value,
                      })
                    }
                    className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 rounded-xl py-3"
                  />
                </div>
                {/* Status */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="edit-status"
                    className="text-right font-semibold text-gray-700"
                  >
                    Status
                  </Label>
                  <Select
                    value={editingAsset.status}
                    onValueChange={(value) =>
                      setEditingAsset({
                        ...editingAsset,
                        status: value as Asset["status"],
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl py-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-xl bg-white/90 border-white/20 rounded-xl">
                      <SelectItem value="在库">在库</SelectItem>
                      {/* 只有当前状态是已借出时才显示已借出选项 */}
                      {editingAsset.status === "已借出" && (
                        <SelectItem value="已借出">已借出</SelectItem>
                      )}
                      <SelectItem value="维修中">维修中</SelectItem>
                      <SelectItem value="已报废">已报废</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Condition */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="edit-condition"
                    className="text-right font-semibold text-gray-700"
                  >
                    Condition
                  </Label>
                  <Select
                    value={editingAsset.condition}
                    onValueChange={(value) =>
                      setEditingAsset({
                        ...editingAsset,
                        condition: value as Asset["condition"],
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl py-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-xl bg-white/90 border-white/20 rounded-xl">
                      <SelectItem value="完好">完好</SelectItem>
                      <SelectItem value="良好">良好</SelectItem>
                      <SelectItem value="一般">一般</SelectItem>
                      <SelectItem value="较差">较差</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Purchase Date */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="edit-purchase-date"
                    className="text-right font-semibold text-gray-700"
                  >
                    Purchase Date
                  </Label>
                  <Input
                    id="edit-purchase-date"
                    type="date"
                    value={editingAsset.purchase_date?.split("T")[0] || ""}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        purchase_date: e.target.value,
                      })
                    }
                    className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 rounded-xl py-3"
                  />
                </div>
                {/* Description */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="edit-description"
                    className="text-right font-semibold text-gray-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={editingAsset.description || ""}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        description: e.target.value,
                      })
                    }
                    className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 rounded-xl px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#003399] to-[#3366cc] hover:from-[#003399]/90 hover:to-[#3366cc]/90 text-white rounded-xl px-6"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
