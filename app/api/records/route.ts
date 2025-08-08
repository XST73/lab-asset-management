// app/api/records/route.ts

import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise"; // 导入 mysql2 以使用事务

/**
 * 处理 POST 请求，创建一条新的借出记录
 */
export async function POST(request: Request) {
  // 建立数据库连接
  // 注意：为了使用事务，我们需要在这里手动创建连接，而不是直接使用 query 辅助函数
  const dbconnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  try {
    // 从请求中获取数据
    const { asset_id, borrower_name, expected_return_date, notes } =
      await request.json();

    // 数据校验
    if (!asset_id || !borrower_name) {
      return NextResponse.json(
        { message: "资产ID和借用人姓名是必填项" },
        { status: 400 }
      );
    }

    // --- 核心逻辑：使用数据库事务 ---
    // 事务可以确保多个 SQL 操作要么全部成功，要么全部失败，从而保证数据的一致性。
    await dbconnection.beginTransaction();

    // 1. 更新 assets 表中对应资产的状态为“已借出”
    const updateAssetQuery =
      "UPDATE assets SET status = '已借出' WHERE id = ? AND status = '在库'";
    const [updateResult]: [mysql.ResultSetHeader, mysql.FieldPacket[]] =
      await dbconnection.execute(updateAssetQuery, [asset_id]);

    // 检查是否有资产被成功更新。如果没有（比如资产不是'在库'状态），则回滚事务并报错。
    if (updateResult.affectedRows === 0) {
      await dbconnection.rollback();
      return NextResponse.json(
        { message: "借出失败：资产不是'在库'状态或ID不存在" },
        { status: 409 }
      );
    }

    // 2. 在 records 表中插入新的借阅记录
    const insertRecordQuery = `
      INSERT INTO records (asset_id, borrower_name, borrow_date, expected_return_date, notes)
      VALUES (?, ?, NOW(), ?, ?)
    `;
    const expectedReturnDateValue = expected_return_date
      ? expected_return_date
      : null;
    await dbconnection.execute(insertRecordQuery, [
      asset_id,
      borrower_name,
      expectedReturnDateValue,
      notes,
    ]);

    // 3. 如果以上两步都成功，提交事务
    await dbconnection.commit();

    return NextResponse.json({ message: "资产借出成功" }, { status: 201 });
  } catch (error) {
    // 如果在事务过程中发生任何错误，回滚所有操作
    await dbconnection.rollback();
    console.error("创建借出记录失败:", error);
    return NextResponse.json({ message: "内部服务器错误" }, { status: 500 });
  } finally {
    // 无论成功还是失败，最后都要关闭数据库连接
    await dbconnection.end();
  }
}

/**
 * 处理 PUT 请求，用于归还资产
 */
export async function PUT(request: Request) {
  const dbconnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  try {
    const { asset_id } = await request.json();

    if (!asset_id) {
      return NextResponse.json({ message: "资产ID是必填项" }, { status: 400 });
    }

    await dbconnection.beginTransaction();

    // 1. 更新资产状态为“在库”
    const updateAssetQuery =
      "UPDATE assets SET status = '在库' WHERE id = ? AND status = '已借出'";
    const [updateAssetResult]: [mysql.ResultSetHeader, mysql.FieldPacket[]] =
      await dbconnection.execute(updateAssetQuery, [asset_id]);

    if (updateAssetResult.affectedRows === 0) {
      await dbconnection.rollback();
      return NextResponse.json(
        { message: "归还失败：资产不是'已借出'状态或ID不存在" },
        { status: 409 }
      );
    }

    // 2. 更新借还记录表，填入实际归还时间
    // 我们只更新最新的一条、且尚未归还的记录
    const updateRecordQuery = `
      UPDATE records
      SET actual_return_date = NOW()
      WHERE asset_id = ? AND actual_return_date IS NULL
      ORDER BY borrow_date DESC
      LIMIT 1
    `;
    const [updateRecordResult]: [mysql.ResultSetHeader, mysql.FieldPacket[]] =
      await dbconnection.execute(updateRecordQuery, [asset_id]);

    // 如果找不到对应的借出记录，也回滚事务
    if (updateRecordResult.affectedRows === 0) {
      await dbconnection.rollback();
      return NextResponse.json(
        { message: "归还失败：找不到该资产的有效借出记录" },
        { status: 404 }
      );
    }

    await dbconnection.commit();

    return NextResponse.json({ message: "资产归还成功" }, { status: 200 });
  } catch (error) {
    await dbconnection.rollback();
    console.error("归还资产失败:", error);
    return NextResponse.json({ message: "内部服务器错误" }, { status: 500 });
  } finally {
    await dbconnection.end();
  }
}

/**
 * 处理 GET 请求，获取所有借还记录
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let page = parseInt(searchParams.get("page") || "1", 10);
    let limit = parseInt(searchParams.get("limit") || "10", 10); // 每页10条记录

    if (isNaN(page) || page < 1) {
      page = 1;
    }
    if (isNaN(limit) || limit < 1) {
      limit = 10;
    }

    const offset = (page - 1) * limit;

    // 查询总记录数
    const countResult = (await query({
      query: "SELECT COUNT(*) as total FROM records",
    })) as { total: number }[];
    const totalRecords = countResult[0].total;

    // 查询分页后的记录
    const records = await query({
      query: `
        SELECT
          r.id,
          r.borrower_name,
          r.borrow_date,
          r.expected_return_date,
          r.actual_return_date,
          a.name AS asset_name,
          a.id AS asset_id
        FROM records r
        JOIN assets a ON r.asset_id = a.id
        ORDER BY r.borrow_date DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
    });

    return NextResponse.json({
      records,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    });
  } catch (error) {
    console.error("获取借还记录失败:", error);
    return NextResponse.json({ message: "内部服务器错误" }, { status: 500 });
  }
}
