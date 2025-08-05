// components/dashboard/StatsCards.tsx

import { Package, Users, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  availableCount: number;
  onLoanCount: number;
  maintenanceCount: number;
  overdueCount: number;
}

export default function StatsCards({
  availableCount,
  onLoanCount,
  maintenanceCount,
  overdueCount,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Available Assets",
      value: availableCount,
      icon: Package,
      gradient: "from-emerald-500 to-green-500",
      textGradient: "from-emerald-600 to-green-600",
      description: "Ready for use",
    },
    {
      title: "On Loan",
      value: onLoanCount,
      icon: Users,
      gradient: "from-amber-500 to-yellow-500",
      textGradient: "from-amber-600 to-yellow-600",
      description: "Currently borrowed",
    },
    {
      title: "Maintenance",
      value: maintenanceCount,
      icon: Clock,
      gradient: "from-rose-500 to-red-500",
      textGradient: "from-rose-600 to-red-600",
      description: "Under repair",
    },
    {
      title: "Overdue",
      value: overdueCount,
      icon: AlertTriangle,
      gradient: "from-orange-500 to-red-500",
      textGradient: "from-orange-600 to-red-600",
      description: "Past due date",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 group rounded-2xl"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-gray-700 tracking-wide">
                {stat.title}
              </CardTitle>
              <div className="relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity`}
                ></div>
                <div
                  className={`relative bg-gradient-to-r ${stat.gradient} p-3 rounded-xl`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold bg-gradient-to-r ${stat.textGradient} bg-clip-text text-transparent mb-2`}
              >
                {stat.value}
              </div>
              <p className="text-xs text-gray-600/80 font-medium">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
