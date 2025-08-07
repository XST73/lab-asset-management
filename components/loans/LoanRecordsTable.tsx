// components/loans/LoanRecordsTable.tsx

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoanRecord } from "@/types";

interface LoanRecordsTableProps {
  loanRecords: LoanRecord[];
}

export default function LoanRecordsTable({
  loanRecords,
}: LoanRecordsTableProps) {
  return (
    <div className="backdrop-blur-sm bg-white/30 rounded-xl border border-white/20 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/20 hover:bg-white/20">
            <TableHead className="font-bold text-gray-700 py-6">资产</TableHead>
            <TableHead className="font-bold text-gray-700 py-6">
              借用人
            </TableHead>
            <TableHead className="font-bold text-gray-700 py-6">
              借出日期
            </TableHead>
            <TableHead className="font-bold text-gray-700 py-6">
              归还日期
            </TableHead>
            <TableHead className="font-bold text-gray-700 py-6">状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loanRecords.map((loan) => {
            const isReturned = !!loan.actual_return_date;
            const isOverdue =
              !isReturned &&
              loan.expected_return_date &&
              new Date(loan.expected_return_date).getDate() < new Date().getDate();
            return (
              <TableRow
                key={loan.id}
                className="border-white/20 hover:bg-white/30 transition-colors"
              >
                <TableCell className="py-6">
                  <div className="font-bold text-gray-900">
                    {loan.asset_name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    ID: {loan.asset_id}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-gray-900 py-6">
                  {loan.borrower_name}
                </TableCell>
                <TableCell className="text-gray-900 py-6">
                  {new Date(loan.borrow_date).toLocaleDateString()}
                </TableCell>
                <TableCell className="py-6">
                  <span
                    className={
                      isOverdue
                        ? "text-red-600 font-bold"
                        : "text-gray-900 font-semibold"
                    }
                  >
                    {isReturned
                      ? new Date(loan.actual_return_date!).toLocaleDateString()
                      : loan.expected_return_date
                      ? new Date(loan.expected_return_date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </TableCell>
                <TableCell className="py-6">
                  <Badge
                    className={
                      isReturned
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 font-semibold px-4 py-2 rounded-2xl"
                        : isOverdue
                        ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800 font-semibold px-4 py-2 rounded-2xl"
                        : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800 font-semibold px-4 py-2 rounded-2xl"
                    }
                  >
                    {isReturned ? "已归还" : isOverdue ? "逾期" : "借出中"}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
