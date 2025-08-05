// utils/helpers.ts

import { Asset } from '@/types';
import {
  Glasses,
  Headphones,
  Camera,
  Monitor,
} from "lucide-react";

export const getStatusColor = (status: string) => {
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

export const getConditionColor = (condition: string) => {
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

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "VR头盔":
      return Headphones;
    case "AR Glasses":
      return Glasses;
    case "Camera":
      return Camera;
    default:
      return Monitor;
  }
};

export const getCategoryIconBg = (category: string) => {
  switch (category) {
    case "VR头盔":
      return "bg-gradient-to-br from-purple-500 to-indigo-600";
    case "AR Glasses":
      return "bg-gradient-to-br from-blue-500 to-cyan-600";
    case "Camera":
      return "bg-gradient-to-br from-green-500 to-emerald-600";
    default:
      return "bg-gradient-to-br from-gray-500 to-slate-600";
  }
};

export const filterAssets = (
  assets: Asset[],
  searchTerm: string,
  selectedCategory: string,
  selectedStatus: string
) => {
  return assets.filter((asset) => {
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
};

export const calculateAssetCounts = (assets: Asset[]) => {
  return {
    available: assets.filter((a) => a.status === "在库").length,
    onLoan: assets.filter((a) => a.status === "已借出").length,
    maintenance: assets.filter((a) => a.status === "维修中").length,
  };
};
