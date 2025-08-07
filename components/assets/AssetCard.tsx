// components/assets/AssetCard.tsx

import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Asset } from "@/types";
import { getStatusColor, getConditionColor, getIconComponent } from "@/utils/helpers";
import LoanAssetDialog from "@/components/modals/LoanAssetDialog";

interface AssetCardProps {
  asset: Asset;
  onEdit: (asset: Asset) => void;
  onDelete: (assetId: number) => void;
  onLoan: (assetId: number, borrower: string, dueDate: string, notes: string) => void;
  onReturn: (assetId: number) => void;
}

export default function AssetCard({
  asset,
  onEdit,
  onDelete,
  onLoan,
  onReturn,
}: AssetCardProps) {
  const CategoryIcon = getIconComponent(asset.asset_type_icon || "Archive");
  const iconBackgroundColor = asset.asset_type_color || "from-gray-500 to-gray-600";

  return (
    <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 group hover:scale-[1.02] rounded-2xl flex flex-col h-full">
      <CardHeader className="pb-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`bg-gradient-to-br ${iconBackgroundColor} p-3 rounded-xl shadow-lg`}
            >
              <CategoryIcon className="w-6 h-6 text-white" />
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
              onClick={() => onEdit(asset)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-white/50 backdrop-blur-sm rounded-lg"
              onClick={() => onDelete(asset.id)}
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
            <strong className="text-gray-900">位置:</strong>{" "}
            <span className="text-gray-700">{asset.location}</span>
          </p>
          <p>
            <strong className="text-gray-900">类别:</strong>{" "}
            <span className="text-gray-700">{asset.asset_type_name}</span>
          </p>
          {asset.status === "已借出" && asset.borrower_name && (
            <>
              <p>
                <strong className="text-gray-900">借用人:</strong>{" "}
                <span className="text-gray-700">{asset.borrower_name}</span>
              </p>
              {asset.expected_return_date && (
                <p>
                  <strong className="text-gray-900">到期时间:</strong>{" "}
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
                  借出
                </Button>
              </DialogTrigger>
              <LoanAssetDialog
                asset={asset}
                onLoan={onLoan}
                onReturn={onReturn}
              />
            </Dialog>
          )}
          {asset.status === "已借出" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReturn(asset.id)}
              className="flex-1 backdrop-blur-sm bg-slate/50 hover:bg-slate/70 transition-all duration-300 rounded-xl font-semibold py-5 border-slate-300"
            >
              归还
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
