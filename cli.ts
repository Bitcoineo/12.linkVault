import { client } from "@/db";
import { createBookmark, getBookmarks } from "@/lib/bookmarks";
import { getTags, createTag, getBookmarksByTag } from "@/lib/tags";
import { getCollections, createCollection } from "@/lib/collections";
import { fetchMetadata } from "@/lib/metadata";
import type { Result } from "@/lib/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function die(msg: string): never {
  console.error(msg);
  process.exit(1);
}

function unwrap<T>(result: Result<T>, context?: string): T {
  if (result.error !== null) {
    return die(context ? `${context}: ${result.error}` : result.error);
  }
  return result.data;
}

function parseFlags(args: string[]): { positional: string[]; flags: Record<string, string[]> } {
  const positional: string[] = [];
  const flags: Record<string, string[]> = {};
  let i = 0;
  while (i < args.length) {
    if (args[i].startsWith("--") && i + 1 < args.length) {
      const key = args[i].slice(2);
      flags[key] = flags[key] ?? [];
      flags[key].push(args[i + 1]);
      i += 2;
    } else {
      positional.push(args[i]);
      i++;
    }
  }
  return { positional, flags };
}

function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len - 1) + "…" : str;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

async function add(args: string[]) {
  const { positional, flags } = parseFlags(args);
  const url = positional[0];
  if (!url) die("Usage: cli add <url> [--tag name] [--collection name]");

  // Fetch metadata
  process.stdout.write("Fetching metadata... ");
  const meta = await fetchMetadata(url);
  const title = meta.data?.title ?? url;
  const faviconUrl = meta.data?.faviconUrl ?? undefined;
  console.log(meta.data ? `"${title}"` : "(failed, using URL as title)");

  // Resolve tags
  const tagIds: string[] = [];
  if (flags.tag) {
    const allTags = unwrap(await getTags(), "Fetching tags");
    const tagMap = new Map(allTags.map((t) => [t.name, t.id]));

    for (const name of flags.tag) {
      if (tagMap.has(name)) {
        tagIds.push(tagMap.get(name)!);
      } else {
        const created = unwrap(await createTag(name), `Creating tag "${name}"`);
        tagIds.push(created.id);
        console.log(`  Created tag: ${name}`);
      }
    }
  }

  // Resolve collections
  const collectionIds: string[] = [];
  if (flags.collection) {
    const allCols = unwrap(await getCollections(), "Fetching collections");
    const colMap = new Map(allCols.map((c) => [c.name, c.id]));

    for (const name of flags.collection) {
      if (colMap.has(name)) {
        collectionIds.push(colMap.get(name)!);
      } else {
        const created = unwrap(await createCollection(name), `Creating collection "${name}"`);
        collectionIds.push(created.id);
        console.log(`  Created collection: ${name}`);
      }
    }
  }

  // Create bookmark
  const bookmark = unwrap(
    await createBookmark({
      url,
      title,
      faviconUrl,
      tagIds: tagIds.length > 0 ? tagIds : undefined,
      collectionIds: collectionIds.length > 0 ? collectionIds : undefined,
    }),
    "Creating bookmark"
  );

  console.log(`Saved: ${bookmark.title} (${bookmark.id})`);
}

async function list(args: string[]) {
  const { flags } = parseFlags(args);

  let tagId: string | undefined;
  if (flags.tag?.[0]) {
    const allTags = unwrap(await getTags(), "Fetching tags");
    const found = allTags.find((t) => t.name === flags.tag[0]);
    if (!found) die(`Tag "${flags.tag[0]}" not found`);
    tagId = found.id;
  }

  const rows = unwrap(
    await getBookmarks({ search: flags.search?.[0], tagId, limit: 50 }),
    "Fetching bookmarks"
  );

  if (rows.length === 0) {
    console.log("No bookmarks found.");
    return;
  }

  console.log("TITLE".padEnd(40) + "URL".padEnd(45) + "DATE");
  console.log("─".repeat(95));

  for (const b of rows) {
    console.log(
      truncate(b.title, 38).padEnd(40) +
      truncate(b.url, 43).padEnd(45) +
      formatDate(b.createdAt)
    );
  }

  console.log(`\n${rows.length} bookmark(s)`);
}

async function tags() {
  const allTags = unwrap(await getTags(), "Fetching tags");

  if (allTags.length === 0) {
    console.log("No tags found.");
    return;
  }

  console.log("TAG".padEnd(25) + "COLOR".padEnd(12) + "BOOKMARKS");
  console.log("─".repeat(47));

  for (const tag of allTags) {
    const bookmarks = await getBookmarksByTag(tag.id);
    const count = bookmarks.data?.length ?? 0;
    console.log(
      tag.name.padEnd(25) +
      tag.color.padEnd(12) +
      String(count)
    );
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const COMMANDS: Record<string, (args: string[]) => Promise<void>> = {
  add,
  list,
  tags,
};

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command || !COMMANDS[command]) {
    console.log("LinkVault CLI\n");
    console.log("Commands:");
    console.log("  add <url> [--tag name] [--collection name]   Save a bookmark");
    console.log("  list [--tag name] [--search query]           List bookmarks");
    console.log("  tags                                         List tags with counts");
    process.exit(command ? 1 : 0);
  }

  await COMMANDS[command](args);
}

main()
  .catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
  })
  .finally(() => {
    client.close();
  });
