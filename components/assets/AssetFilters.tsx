// components/assets/AssetFilters.tsx

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssetType } from "@/types";

interface AssetFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedStatus: string;
  assetTypes: AssetType[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function AssetFilters({
  searchTerm,
  selectedCategory,
  selectedStatus,
  assetTypes,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: AssetFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 mb-10">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />
        <Input
          type="search"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 bg-white/80 border-gray-200/50 focus:bg-white focus:border-[#3366cc]/50 transition-all duration-300 rounded-xl py-5 text-base shadow-sm"
        />
      </div>
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
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
      <Select value={selectedStatus} onValueChange={onStatusChange}>
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
  );
}
