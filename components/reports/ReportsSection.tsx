// components/reports/ReportsSection.tsx

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusDistribution, OverdueAsset, CategoryStat } from "@/types";
import { getStatusColor } from "@/utils/helpers";

interface ReportsSectionProps {
  statusDistribution: StatusDistribution[];
  overdueAssets: OverdueAsset[];
  categoryStats: CategoryStat[];
  totalAssets: number;
}

export default function ReportsSection({
  statusDistribution,
  overdueAssets,
  categoryStats,
  totalAssets,
}: ReportsSectionProps) {
  return (
    <div className="flex flex-col gap-10">
      {/* Row 1: Category Stats (Large, full-width) */}
      <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 rounded-2xl w-full">
        <CardHeader className="pb-8">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            资产类别概览
          </CardTitle>
          <CardDescription className="text-gray-600 text-base mt-2">
            按类别统计资产数量和当前使用率。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryStats.map((item) => (
              <div
                key={item.name}
                className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.name}
                    </h3>
                    <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-900 bg-clip-text text-transparent">
                      {item.total}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    总数量
                  </p>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
                      style={{ width: `${item.utilization}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm font-semibold text-gray-700 mt-1">
                    {item.utilization}% 使用中
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Row 2: Two smaller cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Card 2.1: Asset Status Distribution */}
        <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 rounded-2xl">
          <CardHeader className="pb-8">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              资产状态
            </CardTitle>
            <CardDescription className="text-gray-600 text-base mt-2">
              所有资产的总体状态
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusDistribution.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center text-sm"
                >
                  <span className="w-20 font-semibold text-gray-700">
                    {item.status}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3.5 mr-3">
                    <div
                      className={`h-3.5 rounded-full ${getStatusColor(
                        item.status
                      )
                        .replace("text-emerald-700", "bg-emerald-400")
                        .replace("text-amber-700", "bg-amber-400")
                        .replace("text-rose-700", "bg-rose-400")}`}
                      style={{
                        width: `${(item.count / totalAssets) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="font-bold text-gray-800">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Card 2.2: Overdue Assets */}
        <Card className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 rounded-2xl">
          <CardHeader className="pb-8">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              逾期资产
            </CardTitle>
            <CardDescription className="text-gray-600 text-base mt-2">
              超过预期归还日期的资产
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-48 overflow-y-auto">
              {overdueAssets.length > 0 ? (
                overdueAssets.map((item) => {
                  const dueDate = new Date(item.expected_return_date);
                  const today = new Date();
                  const timeDiff = today.getTime() - dueDate.getTime();
                  const daysOverdue = Math.floor(
                    timeDiff / (1000 * 3600 * 24)
                  );
                  return (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 rounded-xl backdrop-blur-sm bg-white/30 border border-white/20 text-sm"
                    >
                      <div>
                        <div className="font-bold text-gray-900">
                          {item.asset_name}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          借用人: {item.borrower_name}
                        </div>
                      </div>
                      <Badge variant="destructive">
                        逾期 {daysOverdue} 天
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-4">
                  暂无逾期资产。
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
