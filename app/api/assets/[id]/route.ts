// app/api/assets/[id]/route.ts

import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

interface RequestContext {
  params: {
    id: string;
  };
}

/**
 * 处理 PUT 请求，更新一个指定的资产
 */
export async function PUT(request: Request, context: RequestContext) {
  const dbconnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  try {
    const { id } = await context.params;
    const assetId = parseInt(id, 10);
    const updatedAsset = await request.json();

    // 数据校验
    if (
      !updatedAsset.name ||
      !updatedAsset.asset_type_id ||
      !updatedAsset.status ||
      !updatedAsset.condition
    ) {
      return NextResponse.json(
        { message: "缺少必要的更新字段" },
        { status: 400 }
      );
    }

    // --- 核心逻辑：检查状态变更 ---
    await dbconnection.beginTransaction();

    const [currentAssets] = (await dbconnection.execute(
      "SELECT status FROM assets WHERE id = ?",
      [assetId]
    )) as [{ status: string }[], unknown];

    if (currentAssets.length === 0) {
      await dbconnection.rollback();
      return NextResponse.json(
        { message: "未找到要更新的资产" },
        { status: 404 }
      );
    }
    const currentStatus = currentAssets[0].status;

    if (currentStatus === "已借出" && updatedAsset.status !== "已借出") {
      // 如果是，则执行归还操作：更新 records 表
      const updateRecordQuery = `
        UPDATE records
        SET actual_return_date = NOW()
        WHERE asset_id = ? AND actual_return_date IS NULL
        ORDER BY borrow_date DESC
        LIMIT 1
      `;
      await dbconnection.execute(updateRecordQuery, [assetId]);
    }

    // 3. 更新 assets 表本身
    const updateAssetQuery = `
      UPDATE assets SET 
        name = ?, model = ?, serial_number = ?, asset_type_id = ?, 
        status = ?, location = ?, \`condition\` = ?, purchase_date = ?, description = ?
      WHERE id = ?
    `;

    // 处理日期格式 - 支持多种输入格式
    let purchaseDateValue = null;
    if (updatedAsset.purchase_date) {
      try {
        // 如果已经是 YYYY-MM-DD 格式，直接使用
        if (
          typeof updatedAsset.purchase_date === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(updatedAsset.purchase_date)
        ) {
          purchaseDateValue = updatedAsset.purchase_date;
        } else {
          // 否则尝试解析为日期并转换为 YYYY-MM-DD 格式
          const date = new Date(updatedAsset.purchase_date);
          if (isNaN(date.getTime())) {
            throw new Error("Invalid purchase date");
          }
          purchaseDateValue = date.toISOString().split("T")[0];
        }
      } catch (dateError) {
        await dbconnection.rollback();
        console.error(
          "购买日期格式转换错误:",
          dateError,
          "原始值:",
          updatedAsset.purchase_date
        );
        return NextResponse.json(
          { message: "购买日期格式不正确" },
          { status: 400 }
        );
      }
    }

    const values = [
      updatedAsset.name,
      updatedAsset.model,
      updatedAsset.serial_number,
      updatedAsset.asset_type_id,
      updatedAsset.status,
      updatedAsset.location,
      updatedAsset.condition,
      purchaseDateValue,
      updatedAsset.description,
      assetId,
    ];
    await dbconnection.execute(updateAssetQuery, values);

    // 4. 提交事务
    await dbconnection.commit();

    return NextResponse.json({ message: "资产更新成功" }, { status: 200 });
  } catch (error: unknown) {
    await dbconnection.rollback();

    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("Duplicate entry")) {
      return NextResponse.json({ message: "该序列号已存在" }, { status: 409 });
    }

    console.error("更新资产失败:", error);
    return NextResponse.json({ message: "内部服务器错误" }, { status: 500 });
  } finally {
    await dbconnection.end();
  }
}

/**
 * 处理 DELETE 请求，删除一个指定的资产
 */
export async function DELETE(request: Request, context: RequestContext) {
  try {
    const { id } = await context.params;
    const assetId = parseInt(id, 10);

    // 检查是否有未归还的借出记录
    const checkRecordsQuery = `
      SELECT COUNT(*) AS count
      FROM records
      WHERE asset_id = ? AND actual_return_date IS NULL
    `;
    const [recordCountResult] = (await query({
      query: checkRecordsQuery,
      values: [assetId],
    })) as [{ count: number }];

    if (recordCountResult.count > 0) {
      return NextResponse.json(
        { message: "无法删除！该资产有未归还的借出记录" },
        { status: 400 }
      );
    }

    const deleteQuery = "DELETE FROM assets WHERE id = ?";
    const result = (await query({
      query: deleteQuery,
      values: [assetId],
    })) as { affectedRows: number };

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "未找到要删除的资产" },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 }); // 204 No Content，表示成功但无返回内容
  } catch (error) {
    console.error("删除资产失败:", error);
    return NextResponse.json({ message: "内部服务器错误" }, { status: 500 });
  }
}
