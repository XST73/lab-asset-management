// components/modals/AddAssetTypeForm.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { IconSelector } from "@/components/ui/IconSelector";
import { ColorSelector } from "@/components/ui/ColorSelector";
import { assetTypeAPI } from "@/services/api";
import { DEFAULT_ASSET_TYPE, STYLES } from "@/constants/assetTypeConstants";

interface AddAssetTypeFormProps {
  onDataChange: () => void;
}

export function AddAssetTypeForm({ onDataChange }: AddAssetTypeFormProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newAssetType, setNewAssetType] = useState(DEFAULT_ASSET_TYPE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newAssetType.name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await assetTypeAPI.create({
        name: newAssetType.name,
        icon: newAssetType.icon,
        color: newAssetType.color,
      });
      setNewAssetType(DEFAULT_ASSET_TYPE);
      setIsFormVisible(false);
      onDataChange();
    } catch (error) {
      console.error("创建资产类型失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormToggle = () => {
    setIsFormVisible(!isFormVisible);
    if (isFormVisible) {
      // 收起时重置表单
      setNewAssetType(DEFAULT_ASSET_TYPE);
    }
  };

  return (
    <div className={STYLES.card}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">添加新类别</h3>
        <Button
          onClick={handleFormToggle}
          variant="outline"
          size="sm"
          className={STYLES.outlineButton}
        >
          <Plus className="h-4 w-4 mr-2" />
          {isFormVisible ? "收起" : "展开"}
        </Button>
      </div>

      {isFormVisible && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                类别名称
              </Label>
              <Input
                id="name"
                value={newAssetType.name}
                onChange={(e) =>
                  setNewAssetType({
                    ...newAssetType,
                    name: e.target.value,
                  })
                }
                placeholder="输入类别名称"
                className={STYLES.input}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon" className="text-sm font-medium text-gray-700">
                图标
              </Label>
              <IconSelector
                value={newAssetType.icon}
                onValueChange={(value) =>
                  setNewAssetType({ ...newAssetType, icon: value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-sm font-medium text-gray-700">
                主题颜色
              </Label>
              <ColorSelector
                value={newAssetType.color}
                onValueChange={(value) =>
                  setNewAssetType({ ...newAssetType, color: value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/20">
            <Button
              onClick={handleSubmit}
              disabled={!newAssetType.name.trim() || isSubmitting}
              className={STYLES.primaryButton}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isSubmitting ? "添加中..." : "添加类别"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
