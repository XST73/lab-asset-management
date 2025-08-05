// app/api/assets/route.ts

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// GET 函数 - 包含借用信息
export async function GET() {
  try {
    const assets = await query({
      query: `
        SELECT 
          a.id, a.name, a.model, a.serial_number, a.status, 
          a.location, a.condition, a.purchase_date, a.image_url, a.description, a.asset_type_id,
          t.name AS asset_type_name,
          r.borrower_name,
          r.expected_return_date
        FROM assets a
        LEFT JOIN asset_types t ON a.asset_type_id = t.id
        LEFT JOIN records r ON a.id = r.asset_id AND r.actual_return_date IS NULL
        ORDER BY a.created_at DESC
      `,
    });

    return NextResponse.json({ assets });
  } catch (error) {
    console.error("获取资产列表失败:", error);
    return NextResponse.json({ message: "内部服务器错误" }, { status: 500 });
  }
}

// 处理 POST 请求
export async function POST(request: Request) {
  try {
    const {
      name,
      model,
      serial_number,
      asset_type_id,
      status,
      location,
      condition,
      purchase_date,
      description,
    } = await request.json();

    if (!name || !asset_type_id) {
      return NextResponse.json(
        { message: "资产名称和类型为必填项" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO assets
        (name, model, serial_number, asset_type_id, status, location, \`condition\`, purchase_date, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // 处理日期格式 - 支持多种输入格式
    let purchaseDateValue = null;
    if (purchase_date) {
      try {
        // 如果已经是 YYYY-MM-DD 格式，直接使用
        if (typeof purchase_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(purchase_date)) {
          purchaseDateValue = purchase_date;
        } else {
          // 否则尝试解析为日期并转换为 YYYY-MM-DD 格式
          const date = new Date(purchase_date);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
          }
          purchaseDateValue = date.toISOString().split('T')[0];
        }
      } catch (dateError) {
        console.error('日期格式转换错误:', dateError, '原始值:', purchase_date);
        return NextResponse.json(
          { message: "购买日期格式不正确" },
          { status: 400 }
        );
      }
    }

    const values = [
      name,
      model,
      serial_number,
      asset_type_id,
      status || "在库",
      location,
      condition || "良好",
      purchaseDateValue,
      description,
    ];

    const result = (await query({
      query: insertQuery,
      values: values,
    })) as { affectedRows: number; insertId: number };

    if (result.affectedRows > 0) {
      return NextResponse.json(
        { message: "资产添加成功", id: result.insertId },
        { status: 201 }
      );
    } else {
      throw new Error("资产插入失败");
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("Duplicate entry")) {
      return NextResponse.json({ message: "该序列号已存在" }, { status: 409 });
    }

    console.error("创建资产失败:", error);
    return NextResponse.json({ message: "内部服务器错误" }, { status: 500 });
  }
}
