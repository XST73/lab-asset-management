// components/assets/AssetList.tsx

import { Asset, AssetType } from "@/types";
import AssetCard from "./AssetCard";
// Import will be handled by the AssetCard component

interface AssetListProps {
  assets: Asset[];
  assetTypes: AssetType[];
  isLoading: boolean;
  onEdit: (asset: Asset) => void;
  onDelete: (assetId: number) => void;
  onLoan: (assetId: number, borrower: string, dueDate: string, notes: string) => void;
  onReturn: (assetId: number) => void;
}

export default function AssetList({
  assets,
  isLoading,
  onEdit,
  onDelete,
  onLoan,
  onReturn,
}: AssetListProps) {
  if (isLoading) {
    return <div className="text-center py-10">Loading assets...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onEdit={onEdit}
          onDelete={onDelete}
          onLoan={onLoan}
          onReturn={onReturn}
        />
      ))}
    </div>
  );
}
