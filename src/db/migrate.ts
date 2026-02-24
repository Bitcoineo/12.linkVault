import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./index";

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete.");
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
