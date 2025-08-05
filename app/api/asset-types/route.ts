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
    // 从请求体中解析出 JSON 数据
    const { name } = await request.json();

    // 校验 name 是否存在
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { message: "类型名称不能为空" },
        { status: 400 }
      );
    }

    // 将新的类型名称插入数据库
    const result = await query({
      query: "INSERT INTO asset_types (name) VALUES (?)",
      values: [name.trim()],
    }) as { affectedRows: number; insertId: number };

    // 检查插入是否成功
    if (result.affectedRows > 0) {
      // 返回成功响应和新插入的记录ID
      return NextResponse.json(
        { message: "类型添加成功", id: result.insertId },
        { status: 201 }
      );
    } else {
      throw new Error("插入失败");
    }
  } catch (error: unknown) {
    // 捕获特定错误，比如 UNIQUE 约束冲突
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("Duplicate entry")) {
      return NextResponse.json(
        { message: "该类型名称已存在" },
        { status: 409 }
      ); // 409 Conflict
    }

    // 其他错误返回 500
    console.error('创建资产类型失败:', error);
    return NextResponse.json(
      { message: "内部服务器错误" },
      { status: 500 }
    );
  }
}
