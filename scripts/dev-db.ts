/**
 * Starts a throwaway local MySQL for development (no MySQL install needed).
 *   npm run db:local   -> keep this window open, then put the printed DATABASE_URL in .env
 */
import { createDB } from "mysql-memory-server";

async function main() {
  const db = await createDB({ dbName: "flowervsflorist", port: 3307, version: "8.4.x", logLevel: "ERROR" });
  console.log(`MySQL ready: DATABASE_URL="mysql://${db.username}@127.0.0.1:${db.port}/${db.dbName}"`);
  process.on("SIGINT", async () => {
    await db.stop();
    process.exit(0);
  });
  setInterval(() => {}, 1 << 30);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
