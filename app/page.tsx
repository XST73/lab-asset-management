"use client";

import { useState } from "react";
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

// Mock data
const assets = [
  {
    id: "VR001",
    name: "Meta Quest 3",
    category: "VR Helmet",
    status: "Available",
    location: "Lab A - Shelf 1",
    condition: "Excellent",
    purchaseDate: "2024-01-15",
    lastMaintenance: "2024-06-01",
  },
  {
    id: "AR002",
    name: "Pico 4 Ultra",
    category: "VR Helmet",
    status: "On Loan",
    location: "Checked out",
    condition: "Good",
    purchaseDate: "2023-08-20",
    lastMaintenance: "2024-05-15",
    borrower: "John Smith",
    dueDate: "2024-08-05",
  },
  {
    id: "CAM003",
    name: "Canon EOS R5",
    category: "Camera",
    status: "Maintenance",
    location: "Repair Shop",
    condition: "Fair",
    purchaseDate: "2023-03-10",
    lastMaintenance: "2024-07-20",
  },
  {
    id: "VR004",
    name: "HTC Vive Pro 2",
    category: "VR Helmet",
    status: "Available",
    location: "Lab B - Cabinet 2",
    condition: "Good",
    purchaseDate: "2023-11-05",
    lastMaintenance: "2024-06-10",
  },
  {
    id: "AR005",
    name: "Apple Vision Pro",
    category: "AR Glasses",
    status: "Available",
    location: "Lab A - Secure Cabinet",
    condition: "Excellent",
    purchaseDate: "2024-02-01",
    lastMaintenance: "2024-07-01",
  },
  {
    id: "CAM006",
    name: "Sony FX3",
    category: "Camera",
    status: "Available",
    location: "Media Lab - Shelf 3",
    condition: "Excellent",
    purchaseDate: "2024-03-15",
    lastMaintenance: "2024-06-15",
  },
];

const loanRecords = [
  {
    id: "L001",
    assetId: "AR002",
    assetName: "Microsoft HoloLens 2",
    borrower: "John Smith",
    borrowDate: "2024-07-22",
    dueDate: "2024-08-05",
    status: "Active",
  },
  {
    id: "L002",
    assetId: "VR001",
    assetName: "Meta Quest 3",
    borrower: "Sarah Johnson",
    borrowDate: "2024-07-15",
    returnDate: "2024-07-20",
    status: "Returned",
  },
];

export default function LabAssetManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // 保持语义化颜色的状态标签
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800";
      case "On Loan":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800";
      case "Maintenance":
        return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:text-rose-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-800";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700";
      case "Good":
        return "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700";
      case "Fair":
        return "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 hover:text-amber-700";
      case "Poor":
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
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || asset.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || asset.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const availableCount = assets.filter((a) => a.status === "Available").length;
  const onLoanCount = assets.filter((a) => a.status === "On Loan").length;
  const maintenanceCount = assets.filter(
    (a) => a.status === "Maintenance"
  ).length;
  const overdueCount = loanRecords.filter(
    (r) =>
      r.status === "Active" && r.dueDate && new Date(r.dueDate) < new Date()
  ).length;

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
                  Laboratory Asset Management
                </h1>
                <p className="text-sm text-gray-600/80 font-medium mt-1">
                  VR/AR Equipment & Camera Tracking System
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
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="asset-id"
                      className="text-right font-semibold text-gray-700"
                    >
                      Asset ID
                    </Label>
                    <Input
                      id="asset-id"
                      placeholder="e.g., VR005"
                      className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 rounded-xl py-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="asset-name"
                      className="text-right font-semibold text-gray-700"
                    >
                      Name
                    </Label>
                    <Input
                      id="asset-name"
                      placeholder="e.g., Meta Quest 3"
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
                    <Select>
                      <SelectTrigger className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl py-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="backdrop-blur-xl bg-white/90 border-white/20 rounded-xl">
                        <SelectItem value="vr-helmet">VR Helmet</SelectItem>
                        <SelectItem value="ar-glasses">AR Glasses</SelectItem>
                        <SelectItem value="camera">Camera</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                    <Select>
                      <SelectTrigger className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl py-3">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent className="backdrop-blur-xl bg-white/90 border-white/20 rounded-xl">
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
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
                      placeholder="Additional notes..."
                      className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-8">
                  <Button
                    variant="outline"
                    className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 rounded-xl px-6"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-[#003399] to-[#3366cc] hover:from-[#003399]/90 hover:to-[#3366cc]/90 text-white rounded-xl px-6">
                    Add Asset
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-8 lg:px-12 py-12">
        {/* 清爽的统计卡片布局 */}
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

        {/* 修复TabList溢出和圆角问题 */}
        <Tabs defaultValue="assets" className="space-y-10">
          <TabsList className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-lg p-5 inline-flex rounded-xl">
            <TabsTrigger
              value="assets"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#003399] data-[state=active]:to-[#3366cc] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 px-10 py-6 font-semibold whitespace-nowrap rounded-xl ml-[-24px]"
            >
              <Activity className="w-4 h-4 mr-2" />
              Asset Inventory
            </TabsTrigger>
            <TabsTrigger
              value="loans"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#003399] data-[state=active]:to-[#3366cc] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl px-10 py-6 font-semibold whitespace-nowrap"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Loan Management
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
                {/* 修复搜索栏和筛选器的背景融合问题 */}
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
                      <SelectItem value="VR Helmet">VR Helmet</SelectItem>
                      <SelectItem value="AR Glasses">AR Glasses</SelectItem>
                      <SelectItem value="Camera">Camera</SelectItem>
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
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="On Loan">On Loan</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 修复设备卡片高度一致性和图标问题 */}
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
                                asset.category
                              )} p-3 rounded-xl shadow-lg`}
                            >
                              {getCategoryIcon(asset.category)}
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-900">
                                {asset.name}
                              </CardTitle>
                              <CardDescription className="font-semibold text-gray-600 mt-1">
                                {asset.id}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-white/50 backdrop-blur-sm rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-white/50 backdrop-blur-sm rounded-lg"
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
                            <strong className="text-gray-900">Location:</strong>{" "}
                            <span className="text-gray-700">
                              {asset.location}
                            </span>
                          </p>
                          <p>
                            <strong className="text-gray-900">Category:</strong>{" "}
                            <span className="text-gray-700">
                              {asset.category}
                            </span>
                          </p>
                          {asset.borrower && (
                            <p>
                              <strong className="text-gray-900">
                                Borrower:
                              </strong>{" "}
                              <span className="text-gray-700">
                                {asset.borrower}
                              </span>
                            </p>
                          )}
                          {asset.dueDate && (
                            <p>
                              <strong className="text-gray-900">Due:</strong>{" "}
                              <span className="text-gray-700">
                                {asset.dueDate}
                              </span>
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-3 mt-auto">
                          {asset.status === "Available" && (
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
                                    Record the loan of {asset.name} ({asset.id})
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
                                      placeholder="Enter borrower name"
                                      className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl py-4"
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
                                      placeholder="Loan notes..."
                                      className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-4">
                                  <Button
                                    variant="outline"
                                    className="backdrop-blur-sm bg-white/50 border-white/30 rounded-xl px-6"
                                  >
                                    Cancel
                                  </Button>
                                  <Button className="bg-gradient-to-r from-[#003399] to-[#3366cc] hover:from-[#003399]/90 hover:to-[#3366cc]/90 text-white rounded-xl px-6">
                                    Create Loan
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          {asset.status === "On Loan" && (
                            <Button
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
                          Loan ID
                        </TableHead>
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
                          Due Date
                        </TableHead>
                        <TableHead className="font-bold text-gray-700 py-6">
                          Status
                        </TableHead>
                        <TableHead className="font-bold text-gray-700 py-6">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loanRecords.map((loan) => (
                        <TableRow
                          key={loan.id}
                          className="border-white/20 hover:bg-white/30 transition-colors"
                        >
                          <TableCell className="font-semibold text-gray-900 py-6">
                            {loan.id}
                          </TableCell>
                          <TableCell className="py-6">
                            <div>
                              <div className="font-bold text-gray-900">
                                {loan.assetName}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {loan.assetId}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-gray-900 py-6">
                            {loan.borrower}
                          </TableCell>
                          <TableCell className="text-gray-900 py-6">
                            {loan.borrowDate}
                          </TableCell>
                          <TableCell className="py-6">
                            {loan.status === "Active" ? (
                              <span
                                className={
                                  loan.dueDate &&
                                  new Date(loan.dueDate) < new Date()
                                    ? "text-red-600 font-bold"
                                    : "text-gray-900 font-semibold"
                                }
                              >
                                {loan.dueDate}
                              </span>
                            ) : (
                              <span className="text-gray-900 font-semibold">
                                {loan.returnDate}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="py-6">
                            <Badge
                              className={
                                loan.status === "Active"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800 font-semibold px-4 py-2"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 font-semibold px-4 py-2"
                              }
                            >
                              {loan.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-6">
                            {loan.status === "Active" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300 rounded-xl font-semibold"
                              >
                                Process Return
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 rounded-2xl">
                <CardHeader className="pb-8">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                    Asset Utilization
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base mt-2">
                    Equipment usage statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-5 rounded-xl backdrop-blur-sm bg-white/30 border border-white/20">
                      <span className="font-bold text-gray-900">
                        VR Helmets
                      </span>
                      <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        75% utilization
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-5 rounded-xl backdrop-blur-sm bg-white/30 border border-white/20">
                      <span className="font-bold text-gray-900">
                        AR Glasses
                      </span>
                      <span className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        60% utilization
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-5 rounded-xl backdrop-blur-sm bg-white/30 border border-white/20">
                      <span className="font-bold text-gray-900">Cameras</span>
                      <span className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        45% utilization
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 rounded-2xl">
                <CardHeader className="pb-8">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                    Maintenance Schedule
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base mt-2">
                    Upcoming maintenance tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-5 rounded-xl backdrop-blur-sm bg-white/30 border border-white/20">
                      <div>
                        <div className="font-bold text-gray-900">
                          Meta Quest 3
                        </div>
                        <div className="text-sm text-gray-600 mt-1">VR001</div>
                      </div>
                      <Badge className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 hover:text-orange-800 font-semibold px-4 py-2">
                        Due in 5 days
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-5 rounded-xl backdrop-blur-sm bg-white/30 border border-white/20">
                      <div>
                        <div className="font-bold text-gray-900">
                          HTC Vive Pro 2
                        </div>
                        <div className="text-sm text-gray-600 mt-1">VR004</div>
                      </div>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800 font-semibold px-4 py-2">
                        Due in 12 days
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
