// components/modals/EditAssetDialog.tsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Asset, AssetType } from "@/types";

interface EditAssetDialogProps {
  asset: Asset | null;
  assetTypes: AssetType[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Asset) => void;
}

export default function EditAssetDialog({
  asset,
  assetTypes,
  isOpen,
  onClose,
  onSave,
}: EditAssetDialogProps) {
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  useEffect(() => {
    if (asset) {
      setEditingAsset({ ...asset });
    }
  }, [asset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    onSave(editingAsset);
  };

  const handleInputChange = (field: keyof Asset, value: string | number) => {
    if (!editingAsset) return;
    setEditingAsset({
      ...editingAsset,
      [field]: value,
    });
  };

  if (!editingAsset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl rounded-2xl">
        <DialogHeader className="pb-8">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
            Edit Asset
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base mt-2">
            Update the details for: {editingAsset.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
                onChange={(e) => handleInputChange("name", e.target.value)}
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
                onChange={(e) => handleInputChange("model", e.target.value)}
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
                onChange={(e) => handleInputChange("serial_number", e.target.value)}
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
                onValueChange={(value) => handleInputChange("asset_type_id", parseInt(value, 10))}
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
                onChange={(e) => handleInputChange("location", e.target.value)}
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
                onValueChange={(value) => handleInputChange("status", value as Asset["status"])}
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
                onValueChange={(value) => handleInputChange("condition", value as Asset["condition"])}
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
                onChange={(e) => handleInputChange("purchase_date", e.target.value)}
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
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 rounded-xl"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
  );
}
