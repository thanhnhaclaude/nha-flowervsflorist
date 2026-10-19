/** Creates the tables and seeds the starting catalog:  npm run db:setup  (uses DATABASE_URL / DB_* from .env) */
import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../src/lib/db/schema";
import { dbConnection } from "../src/lib/db/config";
import { setupDatabase } from "../src/lib/db/setup-core";

async function main() {
  const c = dbConnection();
  const pool = c.mode === "parts" ? mysql.createPool({ host: c.host, port: c.port, user: c.user, password: c.password, database: c.database }) : mysql.createPool({ uri: c.uri });
  await setupDatabase(drizzle(pool, { schema, mode: "default" }));
  await pool.end();
  console.log("Database ready.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
