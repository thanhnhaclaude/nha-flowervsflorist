/**
 * Runs once when the Node.js server starts: creates tables and seeds the catalog on a fresh database,
 * so a new Hostinger deployment only needs the database credentials. If the database isn't reachable
 * yet (wrong credentials, MySQL still starting), it retries every 30 seconds for up to 30 minutes.
 * Set DB_AUTO_SETUP=false to skip.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.DB_AUTO_SETUP === "false") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const { db } = await import("./lib/db");
  const { setupDatabase } = await import("./lib/db/setup-core");
  const MAX_TRIES = 60;

  const attempt = async (n: number) => {
    try {
      await setupDatabase(db as never);
      console.log("[setup] database ready");
    } catch (e) {
      console.error(`[setup] database setup failed (try ${n}/${MAX_TRIES}) — check DB_* / DATABASE_URL:`, (e as Error).message);
      if (n < MAX_TRIES) setTimeout(() => void attempt(n + 1), 30_000).unref();
    }
  };
  await attempt(1);
}
