// components/layout/Header.tsx

import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface HeaderProps {
  children: React.ReactNode; // For AddAssetDialog
}

export default function Header({ children }: HeaderProps) {
  return (
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
                &ldquo;交互技术与体验系统&rdquo;文旅部重点实验室
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
            {children}
          </Dialog>
        </div>
      </div>
    </header>
  );
}
