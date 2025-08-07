// components/modals/ManageAssetTypesDialog.tsx

import { AssetType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { icons } from "lucide-react";
import { AddAssetTypeForm } from "./AddAssetTypeForm";
import { AssetTypeListItem } from "./AssetTypeListItem";
import { STYLES } from "@/constants/assetTypeConstants";

interface ManageAssetTypesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assetTypes: AssetType[];
  onDataChange: () => void;
}

export default function ManageAssetTypesDialog({
  isOpen,
  onClose,
  assetTypes,
  onDataChange,
}: ManageAssetTypesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={STYLES.dialog}>
        <DialogHeader className="border-b border-white/20 pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            管理资产类别
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base mt-2">
            添加、编辑或删除资产类别，为每个类别选择合适的图标和颜色
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 space-y-6 pr-2">
          {/* 添加新类别表单 */}
          <AddAssetTypeForm onDataChange={onDataChange} />

          {/* 现有资产类别列表 */}
          <div className={STYLES.card}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                现有资产类别
              </h3>
              <Badge
                variant="secondary"
                className="bg-white/50 text-gray-600 border-white/30"
              >
                共 {assetTypes.length} 个类别
              </Badge>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {assetTypes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <icons.Archive className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">暂无资产类别</p>
                  <p className="text-sm text-gray-400 mt-1">
                    请先添加一个资产类别
                  </p>
                </div>
              ) : (
                assetTypes.map((type) => (
                  <AssetTypeListItem
                    key={type.id}
                    assetType={type}
                    onDataChange={onDataChange}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
