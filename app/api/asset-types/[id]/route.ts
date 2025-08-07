// app/api/asset-types/[id]/route.ts

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

interface RequestContext {
  params: {
    id: string;
  };
}

// 更新一个资产类型
export async function PUT(request: Request, context: RequestContext) {
  try {
    const { id } = await context.params;
    const { name, icon = null, color = null } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: "类型名称不能为空" },
        { status: 400 }
      );
    }

    const updateQuery =
      "UPDATE asset_types SET name = ?, icon = ?, color = ? WHERE id = ?";
    const result = (await query({
      query: updateQuery,
      values: [name, icon, color, id],
    })) as { affectedRows: number };

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "未找到要更新的类型" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "类型更新成功" });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("Duplicate entry")) {
      return NextResponse.json(
        { message: "该类型名称已存在" },
        { status: 409 }
      );
    }
    console.log("更新资产类型时发生错误:", error);
    return NextResponse.json({ message: "内部服务器错误" }, { status: 500 });
  }
}

// 删除一个资产类型
export async function DELETE(request: Request, context: RequestContext) {
  try {
    const { id } = context.params;

    // 注意：删除类型前，我们会将所有关联资产的 asset_type_id 设为 NULL
    // 这是在创建 assets 表时由 ON DELETE SET NULL 定义的

    const deleteQuery = "DELETE FROM asset_types WHERE id = ?";
    const result = (await query({
      query: deleteQuery,
      values: [id],
    })) as { affectedRows: number };

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "未找到要删除的类型" },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error("删除资产类型时发生错误:", error);
    return NextResponse.json({ message: "内部服务器错误" }, { status: 500 });
  }
}
