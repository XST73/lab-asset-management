// app/api/reports/dashboard/route.ts

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // --- 1. 资产状态分布报告 ---
    const statusDistributionQuery = `
      SELECT 
        status,
        COUNT(id) AS count
      FROM assets
      GROUP BY status
    `;
    const statusDistribution = (await query({ query: statusDistributionQuery })) as {
      status: string;
      count: number;
    }[];

    // --- 2. 逾期未还列表报告 ---
    const overdueAssetsQuery = `
      SELECT
        r.id,
        r.borrower_name,
        r.expected_return_date,
        a.name as asset_name
      FROM records r
      JOIN assets a ON r.asset_id = a.id
      WHERE r.actual_return_date IS NULL
      AND r.expected_return_date < CURDATE()
      ORDER BY r.expected_return_date ASC
    `;
    const overdueAssets = (await query({ query: overdueAssetsQuery })) as {
      id: number;
      asset_name: string;
      borrower_name: string;
      expected_return_date: string;
    }[];

    // --- 3. 按类别统计的资产数量与利用率 ---
    const categoryStatsQuery = `
      SELECT 
        t.name,
        COUNT(a.id) AS total,
        SUM(CASE WHEN a.status != '在库' THEN 1 ELSE 0 END) AS used
      FROM asset_types t
      LEFT JOIN assets a ON t.id = a.asset_type_id
      GROUP BY t.name
      ORDER BY total DESC
    `;
    const categoryStatsResult = (await query({
      query: categoryStatsQuery,
    }) as { name: string; total: number; used: number }[]);

    const categoryStats = categoryStatsResult.map((item) => ({
      name: item.name,
      total: item.total,
      utilization:
        item.total > 0 ? Math.round((item.used / item.total) * 100) : 0,
    }));

    return NextResponse.json({ statusDistribution, overdueAssets, categoryStats });
  } catch (error) {
    console.error("获取仪表盘数据失败:", error);
    return NextResponse.json(
      { message: "获取仪表盘数据失败" },
      { status: 500 }
    );
  }
}
