import { db } from "@/db";
import {
  collections,
  bookmarkCollections,
  bookmarks,
} from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import type { Collection, Bookmark, Result } from "./types";
import { ok, err } from "./types";

export async function createCollection(
  name: string,
  description?: string
): Promise<Result<Collection>> {
  try {
    const [created] = await db
      .insert(collections)
      .values({ name, description })
      .returning();

    return ok(created);
  } catch (e) {
    console.error("Failed to create collection:", e);
    return err(`Failed to create collection: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function getCollections(): Promise<Result<Collection[]>> {
  try {
    const rows = await db
      .select()
      .from(collections)
      .orderBy(asc(collections.name));
    return ok(rows);
  } catch (e) {
    console.error("Failed to fetch collections:", e);
    return err(`Failed to fetch collections: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function deleteCollection(
  id: string
): Promise<Result<Collection>> {
  try {
    const [deleted] = await db
      .delete(collections)
      .where(eq(collections.id, id))
      .returning();

    if (!deleted) return err("Collection not found");
    return ok(deleted);
  } catch (e) {
    console.error("Failed to delete collection:", e);
    return err(`Failed to delete collection: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function getBookmarksByCollection(
  collectionId: string
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
      .from(bookmarkCollections)
      .innerJoin(
        bookmarks,
        eq(bookmarkCollections.bookmarkId, bookmarks.id)
      )
      .where(eq(bookmarkCollections.collectionId, collectionId))
      .orderBy(desc(bookmarks.createdAt));

    return ok(rows);
  } catch (e) {
    console.error("Failed to fetch bookmarks by collection:", e);
    return err(`Failed to fetch bookmarks by collection: ${e instanceof Error ? e.message : String(e)}`);
  }
}
