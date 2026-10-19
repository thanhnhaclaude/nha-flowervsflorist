/**
 * Exports the whole database (schema + data) to deploy/database.sql.gz for phpMyAdmin import (backup / migration).
 *   npm run export-sql
 *   npm run export-sql -- --no-orders   # skip order data
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import mysql from "mysql2/promise";

const NO_ORDERS = process.argv.includes("--no-orders");
const OUT = path.join(process.cwd(), "deploy", "database.sql.gz");
const BATCH = 100;

/** utf8mb4_0900_ai_ci chỉ có ở MySQL 8 -> đổi sang collation dùng được cả trên MariaDB. */
const portable = (ddl: string) =>
  ddl
    .replace(/utf8mb4_0900_ai_ci/g, "utf8mb4_unicode_ci")
    .replace(/ AUTO_INCREMENT=\d+/, "")
    .replace(/DEFAULT \(json_array\(\)\)/gi, "DEFAULT (JSON_ARRAY())");

function literal(conn: mysql.Connection, v: unknown) {
  if (v === null || v === undefined) return "NULL";
  if (v instanceof Date) return conn.escape(v.toISOString().slice(0, 19).replace("T", " "));
  if (typeof v === "object" && !Buffer.isBuffer(v)) return conn.escape(JSON.stringify(v));
  return conn.escape(v);
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL in .env");
  const conn = await mysql.createConnection({ uri: process.env.DATABASE_URL, timezone: "Z", dateStrings: true });
  await conn.query("SET time_zone = '+00:00'");
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const gz = zlib.createGzip({ level: 9 });
  const file = fs.createWriteStream(OUT);
  gz.pipe(file);
  const write = (s: string) => gz.write(s);

  write(`-- FlowerVsFlorist export ${new Date().toISOString()}\n`);
  write("SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS = 0;\nSET time_zone = '+00:00';\n\n");

  const [tables] = await conn.query<mysql.RowDataPacket[]>("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
  const names = tables.map((t) => String(Object.values(t)[0]));
  for (const name of names) {
    const [[ddl]] = await conn.query<mysql.RowDataPacket[]>(`SHOW CREATE TABLE \`${name}\``);
    write(`DROP TABLE IF EXISTS \`${name}\`;\n${portable(ddl["Create Table"])};\n\n`);
    if (NO_ORDERS && (name === "orders" || name === "order_items")) continue;

    const [rows] = await conn.query<mysql.RowDataPacket[]>(`SELECT * FROM \`${name}\``);
    if (!rows.length) continue;
    const cols = Object.keys(rows[0]).map((c) => `\`${c}\``).join(", ");
    for (let i = 0; i < rows.length; i += BATCH) {
      const values = rows
        .slice(i, i + BATCH)
        .map((r) => `(${Object.values(r).map((v) => literal(conn, v)).join(", ")})`)
        .join(",\n");
      write(`INSERT INTO \`${name}\` (${cols}) VALUES\n${values};\n`);
    }
    write("\n");
    console.log(`  ${name}: ${rows.length} rows`);
  }
  write("SET FOREIGN_KEY_CHECKS = 1;\n");
  gz.end();
  await new Promise<void>((resolve) => file.on("finish", () => resolve()));
  await conn.end();
  console.log(`Exported: ${path.relative(process.cwd(), OUT)} (${(fs.statSync(OUT).size / 1048576).toFixed(1)} MB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
