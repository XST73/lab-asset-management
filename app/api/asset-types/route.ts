// app/api/asset-types/route.ts

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * 处理 GET 请求，获取所有资产类型
 */
export async function GET() {
  try {
    const assetTypes = await query({
      query: "SELECT * FROM asset_types ORDER BY name ASC",
    });

    return NextResponse.json({ assetTypes });
  } catch (error) {
    console.error('获取资产类型失败:', error);
    return NextResponse.json({ message: "内部服务器错误" }, { status: 500 });
  }
}

/**
 * 处理 POST 请求，新增一个资产类型
 */
export async function POST(request: Request) {
  try {
    const { name, icon, color } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { message: "类型名称不能为空" },
        { status: 400 }
      );
    }

    const insertQuery =
      "INSERT INTO asset_types (name, icon, color) VALUES (?, ?, ?)";
    const result = (await query({
      query: insertQuery,
      values: [name.trim(), icon, color],
    })) as { affectedRows: number; insertId: number };

    if (result.affectedRows > 0) {
      return NextResponse.json(
        { message: "类型添加成功", id: result.insertId },
        { status: 201 }
      );
    } else {
      throw new Error("插入失败");
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("Duplicate entry")) {
      return NextResponse.json(
        { message: "该类型名称已存在" },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: "内部服务器错误" }, { status: 500 });
  }
}
