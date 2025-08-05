/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/db.ts

import mysql from "mysql2/promise";

interface QueryParams {
  query: string;
  values?: any[];
}

export async function query({ query, values = [] }: QueryParams) {
  // 注意：这里我们使用了 process.env 来获取数据库凭证
  // 这些凭证需要配置在 .env.local 文件中，以确保安全
  const dbconnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    // port: process.env.MYSQL_PORT, // 如果你的MySQL端口不是3306，取消这行注释
  });

  try {
    const [results] = await dbconnection.execute(query, values);
    await dbconnection.end();
    return results;
  } catch (error: any) {
    // 如果有错误，抛出异常，方便API路由捕获
    throw new Error(error.message);
  }
}
