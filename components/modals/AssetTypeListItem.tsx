// components/modals/AssetTypeListItem.tsx

import { useState } from "react";
import { AssetType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2 } from "lucide-react";
import { IconSelector, DynamicIcon } from "@/components/ui/IconSelector";
import { ColorSelector } from "@/components/ui/ColorSelector";
import { assetTypeAPI } from "@/services/api";
import { STYLES } from "@/constants/assetTypeConstants";

interface AssetTypeListItemProps {
  assetType: AssetType;
  onDataChange: () => void;
}

export function AssetTypeListItem({ assetType, onDataChange }: AssetTypeListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingType, setEditingType] = useState<AssetType>(assetType);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditingType(assetType);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingType(assetType);
  };

  const handleUpdate = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await assetTypeAPI.update(editingType.id, {
        name: editingType.name,
        icon: editingType.icon,
        color: editingType.color,
      });
      setIsEditing(false);
      onDataChange();
    } catch (error) {
      console.error("更新资产类型失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        await assetTypeAPI.delete(assetType.id);
        onDataChange();
      } catch (error) {
        console.error("删除资产类型失败:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setDeleteConfirm(true);
      // 3秒后自动取消确认状态
      setTimeout(() => setDeleteConfirm(false), 3000);
    }
  };

  if (isEditing) {
    return (
      <div className={STYLES.assetTypeItem}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                类别名称
              </Label>
              <Input
                value={editingType.name}
                onChange={(e) =>
                  setEditingType({
                    ...editingType,
                    name: e.target.value,
                  })
                }
                className={STYLES.input}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                图标
              </Label>
              <IconSelector
                value={editingType.icon || "Archive"}
                onValueChange={(value) =>
                  setEditingType({ ...editingType, icon: value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                主题颜色
              </Label>
              <ColorSelector
                value={editingType.color || "from-gray-500 to-gray-600"}
                onValueChange={(value) =>
                  setEditingType({ ...editingType, color: value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/20">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
              className="border-white/30 bg-white/50 hover:bg-white/70 text-gray-600 hover:text-gray-900 rounded-xl"
            >
              取消
            </Button>
            <Button
              size="sm"
              onClick={handleUpdate}
              disabled={isSubmitting}
              className={STYLES.primaryButton}
            >
              {isSubmitting ? "保存中..." : "保存更改"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={STYLES.assetTypeItem}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${assetType.color} text-white shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}
          >
            <DynamicIcon
              name={assetType.icon || "Archive"}
              className="h-6 w-6"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-gray-900 truncate text-lg">
              {assetType.name}
            </h4>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleStartEdit}
            disabled={isSubmitting}
            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl transition-all duration-300"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
            disabled={isSubmitting}
            className={`rounded-xl transition-all duration-300 ${
              deleteConfirm
                ? "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                : "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            }`}
          >
            <Trash2 className="h-4 w-4" />
            {deleteConfirm && (
              <span className="ml-2 text-xs font-medium">
                确认删除?
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
