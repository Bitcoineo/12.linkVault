import { db, client } from "./index";
import { bookmarks, tags, collections, bookmarkTags, bookmarkCollections } from "./schema";

async function seed() {
  console.log("Seeding database...");

  // --- Tags ---
  const tagData = [
    { id: "t1", name: "typescript", color: "#3178c6" },
    { id: "t2", name: "react", color: "#61dafb" },
    { id: "t3", name: "tools", color: "#22c55e" },
  ] as const;

  for (const t of tagData) {
    await db.insert(tags).values(t).onConflictDoNothing();
  }
  console.log(`  ✓ ${tagData.length} tags`);

  // --- Collections ---
  const collectionData = [
    { id: "c1", name: "Learning Resources", description: "Tutorials, docs, and courses" },
    { id: "c2", name: "Dev Tools", description: "Developer tools and utilities" },
  ] as const;

  for (const c of collectionData) {
    await db.insert(collections).values(c).onConflictDoNothing();
  }
  console.log(`  ✓ ${collectionData.length} collections`);

  // --- Bookmarks ---
  const bookmarkData = [
    { id: "b1", url: "https://www.typescriptlang.org/docs", title: "TypeScript Documentation", description: "Official TypeScript handbook and reference" },
    { id: "b2", url: "https://react.dev", title: "React Documentation", description: "Official React docs with hooks and patterns" },
    { id: "b3", url: "https://developer.mozilla.org/en-US", title: "MDN Web Docs", description: "Comprehensive web technology reference" },
    { id: "b4", url: "https://github.com", title: "GitHub", description: "Code hosting and collaboration platform" },
    { id: "b5", url: "https://orm.drizzle.team", title: "Drizzle ORM", description: "TypeScript ORM for SQL databases" },
  ] as const;

  for (const b of bookmarkData) {
    await db.insert(bookmarks).values(b).onConflictDoNothing();
  }
  console.log(`  ✓ ${bookmarkData.length} bookmarks`);

  // --- Bookmark ↔ Tag links ---
  const btData = [
    { bookmarkId: "b1", tagId: "t1" },  // TS docs → typescript
    { bookmarkId: "b2", tagId: "t2" },  // React docs → react
    { bookmarkId: "b2", tagId: "t1" },  // React docs → typescript
    { bookmarkId: "b3", tagId: "t1" },  // MDN → typescript
    { bookmarkId: "b4", tagId: "t3" },  // GitHub → tools
    { bookmarkId: "b5", tagId: "t1" },  // Drizzle → typescript
    { bookmarkId: "b5", tagId: "t3" },  // Drizzle → tools
  ] as const;

  for (const bt of btData) {
    await db.insert(bookmarkTags).values(bt).onConflictDoNothing();
  }
  console.log(`  ✓ ${btData.length} bookmark-tag links`);

  // --- Bookmark ↔ Collection links ---
  const bcData = [
    { bookmarkId: "b1", collectionId: "c1" },  // TS docs → Learning
    { bookmarkId: "b2", collectionId: "c1" },  // React docs → Learning
    { bookmarkId: "b3", collectionId: "c1" },  // MDN → Learning
    { bookmarkId: "b4", collectionId: "c2" },  // GitHub → Dev Tools
    { bookmarkId: "b5", collectionId: "c2" },  // Drizzle → Dev Tools
  ] as const;

  for (const bc of bcData) {
    await db.insert(bookmarkCollections).values(bc).onConflictDoNothing();
  }
  console.log(`  ✓ ${bcData.length} bookmark-collection links`);

  console.log("Done!");
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => {
    client.close();
  });
