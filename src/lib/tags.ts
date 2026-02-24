import { db } from "@/db";
import { tags, bookmarkTags, bookmarks } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import type { Tag, Bookmark, Result } from "./types";
import { ok, err } from "./types";

export async function createTag(
  name: string,
  color?: string
): Promise<Result<Tag>> {
  try {
    const [created] = await db
      .insert(tags)
      .values({ name, ...(color ? { color } : {}) })
      .returning();

    return ok(created);
  } catch (e) {
    const cause = e instanceof Error ? (e as Error & { cause?: Error }).cause : null;
    if (cause?.message?.includes("UNIQUE") || String(e).includes("UNIQUE")) {
      return err(`Tag "${name}" already exists`);
    }
    return err("Failed to create tag");
  }
}

export async function getTags(): Promise<Result<Tag[]>> {
  try {
    const rows = await db.select().from(tags).orderBy(asc(tags.name));
    return ok(rows);
  } catch {
    return err("Failed to fetch tags");
  }
}

export async function deleteTag(id: string): Promise<Result<Tag>> {
  try {
    const [deleted] = await db
      .delete(tags)
      .where(eq(tags.id, id))
      .returning();

    if (!deleted) return err("Tag not found");
    return ok(deleted);
  } catch {
    return err("Failed to delete tag");
  }
}

export async function getBookmarksByTag(
  tagId: string
): Promise<Result<Bookmark[]>> {
  try {
    const rows = await db
      .select({
        id: bookmarks.id,
        url: bookmarks.url,
        title: bookmarks.title,
        description: bookmarks.description,
        faviconUrl: bookmarks.faviconUrl,
        createdAt: bookmarks.createdAt,
        updatedAt: bookmarks.updatedAt,
      })
      .from(bookmarkTags)
      .innerJoin(bookmarks, eq(bookmarkTags.bookmarkId, bookmarks.id))
      .where(eq(bookmarkTags.tagId, tagId))
      .orderBy(desc(bookmarks.createdAt));

    return ok(rows);
  } catch {
    return err("Failed to fetch bookmarks by tag");
  }
}
