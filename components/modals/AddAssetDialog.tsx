/* eslint-disable @typescript-eslint/no-unused-vars */
// components/modals/AddAssetDialog.tsx

import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
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
import { AssetType, Asset } from "@/types";
import { assetAPI } from "@/services/api";

interface AddAssetDialogProps {
  assetTypes: AssetType[];
  onAssetAdded: () => void;
}

export default function AddAssetDialog({
  assetTypes,
  onAssetAdded,
}: AddAssetDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    serial_number: "",
    asset_type_id: "",
    location: "",
    condition: "良好" as const,
    purchase_date: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAssetData = {
      ...formData,
      asset_type_id: parseInt(formData.asset_type_id, 10),
      status: "在库" as const,
    };

    try {
      await assetAPI.create(newAssetData);
      alert("资产添加成功!");
      
      // Reset form
      setFormData({
        name: "",
        model: "",
        serial_number: "",
        asset_type_id: "",
        location: "",
        condition: "良好" as const,
        purchase_date: "",
        description: "",
      });
      
      onAssetAdded();
      document.getElementById("add-asset-dialog-close")?.click();
    } catch (error) {
      alert(`添加失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DialogContent className="sm:max-w-[520px] backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl rounded-2xl">
      <DialogHeader className="pb-8">
        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
          Add New Asset
        </DialogTitle>
        <DialogDescription className="text-gray-600 text-base mt-2">
          Enter the details of the new laboratory equipment.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
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
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
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
              value={formData.model}
              onChange={(e) => handleInputChange("model", e.target.value)}
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
              value={formData.serial_number}
              onChange={(e) => handleInputChange("serial_number", e.target.value)}
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
              value={formData.asset_type_id}
              onValueChange={(value) => handleInputChange("asset_type_id", value)}
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
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
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
              value={formData.condition}
              onValueChange={(value) => handleInputChange("condition", value)}
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
              value={formData.purchase_date}
              onChange={(e) => handleInputChange("purchase_date", e.target.value)}
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
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
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
  );
}
