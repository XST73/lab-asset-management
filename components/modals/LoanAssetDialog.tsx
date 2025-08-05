// components/modals/LoanAssetDialog.tsx

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
import { Textarea } from "@/components/ui/textarea";
import { Asset } from "@/types";

interface LoanAssetDialogProps {
  asset: Asset;
  onLoan: (assetId: number, borrower: string, dueDate: string, notes: string) => void;
  onReturn: (assetId: number) => void;
}

export default function LoanAssetDialog({
  asset,
  onLoan,
  onReturn,
}: LoanAssetDialogProps) {
  const [loanBorrower, setLoanBorrower] = useState("");
  const [loanDueDate, setLoanDueDate] = useState("");
  const [loanNotes, setLoanNotes] = useState("");

  const handleLoanSubmit = () => {
    if (!loanBorrower) {
      alert("借用人姓名不能为空");
      return;
    }
    
    onLoan(asset.id, loanBorrower, loanDueDate, loanNotes);
    
    // Reset form
    setLoanBorrower("");
    setLoanDueDate("");
    setLoanNotes("");
  };

  const handleReturn = () => {
    onReturn(asset.id);
  };

  if (asset.status === "已借出") {
    return (
      <DialogContent className="backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
            Return Asset
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Confirm return of {asset.name} ({asset.serial_number})
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <p className="text-gray-700">
            Currently borrowed by: <strong>{asset.borrower_name}</strong>
          </p>
          {asset.expected_return_date && (
            <p className="text-gray-700 mt-2">
              Expected return: <strong>{new Date(asset.expected_return_date).toLocaleDateString()}</strong>
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="backdrop-blur-sm bg-white/50 border-white/30 rounded-xl px-6"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleReturn}
            className="bg-gradient-to-r from-[#003399] to-[#3366cc] hover:from-[#003399]/90 hover:to-[#3366cc]/90 text-white rounded-xl px-6"
          >
            Confirm Return
          </Button>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl rounded-2xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
          Loan Asset
        </DialogTitle>
        <DialogDescription className="text-gray-600 mt-2">
          Record the loan of {asset.name} ({asset.serial_number})
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-6 py-6">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="borrower"
            className="text-right font-semibold text-gray-700"
          >
            Borrower
          </Label>
          <Input
            id="borrower"
            value={loanBorrower}
            onChange={(e) => setLoanBorrower(e.target.value)}
            placeholder="Enter borrower name"
            className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl py-4"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="due-date"
            className="text-right font-semibold text-gray-700"
          >
            Due Date
          </Label>
          <Input
            id="due-date"
            value={loanDueDate}
            onChange={(e) => setLoanDueDate(e.target.value)}
            type="date"
            className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl pb-2 pt-2"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="loan-notes"
            className="text-right font-semibold text-gray-700"
          >
            Notes
          </Label>
          <Textarea
            id="loan-notes"
            value={loanNotes}
            onChange={(e) => setLoanNotes(e.target.value)}
            placeholder="Loan notes..."
            className="col-span-3 backdrop-blur-sm bg-white/50 border-white/30 rounded-xl"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="backdrop-blur-sm bg-white/50 border-white/30 rounded-xl px-6"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          onClick={handleLoanSubmit}
          className="bg-gradient-to-r from-[#003399] to-[#3366cc] hover:from-[#003399]/90 hover:to-[#3366cc]/90 text-white rounded-xl px-6"
        >
          Create Loan
        </Button>
      </div>
    </DialogContent>
  );
}
