/**
 * Runs once when the Node.js server starts: creates tables and seeds the catalog on a fresh database,
 * so a new Hostinger deployment only needs the database credentials. Set DB_AUTO_SETUP=false to skip.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.DB_AUTO_SETUP === "false") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  try {
    const { db } = await import("./lib/db");
    const { setupDatabase } = await import("./lib/db/setup-core");
    await setupDatabase(db as never);
    console.log("[setup] database ready");
  } catch (e) {
    console.error("[setup] database setup failed — check DB_* / DATABASE_URL:", (e as Error).message);
  }
}
