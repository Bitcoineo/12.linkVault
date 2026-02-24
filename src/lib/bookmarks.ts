import { db } from "@/db";
import {
  bookmarks,
  bookmarkTags,
  bookmarkCollections,
  tags,
  collections,
} from "@/db/schema";
import { eq, like, or, and, desc, inArray } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import type { Bookmark, BookmarkWithTags, BookmarkWithDetails, Tag, Result } from "./types";
import { ok, err } from "./types";

function isUniqueViolation(e: unknown): boolean {
  if (e instanceof Error) {
    const cause = (e as Error & { cause?: Error }).cause;
    if (cause?.message?.includes("UNIQUE")) return true;
  }
  return String(e).includes("UNIQUE");
}

const bookmarkColumns = {
  id: bookmarks.id,
  url: bookmarks.url,
  title: bookmarks.title,
  description: bookmarks.description,
  faviconUrl: bookmarks.faviconUrl,
  createdAt: bookmarks.createdAt,
  updatedAt: bookmarks.updatedAt,
};

export async function createBookmark(input: {
  url: string;
  title: string;
  description?: string;
  faviconUrl?: string;
  tagIds?: string[];
  collectionIds?: string[];
}): Promise<Result<Bookmark>> {
  try {
    const result = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(bookmarks)
        .values({
          url: input.url,
          title: input.title,
          description: input.description,
          faviconUrl: input.faviconUrl,
        })
        .returning();

      if (input.tagIds?.length) {
        await tx.insert(bookmarkTags).values(
          input.tagIds.map((tagId) => ({
            bookmarkId: created.id,
            tagId,
          }))
        );
      }

      if (input.collectionIds?.length) {
        await tx.insert(bookmarkCollections).values(
          input.collectionIds.map((collectionId) => ({
            bookmarkId: created.id,
            collectionId,
          }))
        );
      }

      return created;
    });

    return ok(result);
  } catch (e) {
    if (isUniqueViolation(e)) {
      return err("A bookmark with this URL already exists");
    }
    return err("Failed to create bookmark");
  }
}

export async function getBookmarks(filters?: {
  search?: string;
  tagId?: string;
  collectionId?: string;
  limit?: number;
  offset?: number;
}): Promise<Result<Bookmark[]>> {
  try {
    const conditions: (SQL | undefined)[] = [];

    let query = db
      .selectDistinct(bookmarkColumns)
      .from(bookmarks)
      .$dynamic();

    if (filters?.tagId) {
      query = query.innerJoin(
        bookmarkTags,
        eq(bookmarks.id, bookmarkTags.bookmarkId)
      );
      conditions.push(eq(bookmarkTags.tagId, filters.tagId));
    }

    if (filters?.collectionId) {
      query = query.innerJoin(
        bookmarkCollections,
        eq(bookmarks.id, bookmarkCollections.bookmarkId)
      );
      conditions.push(
        eq(bookmarkCollections.collectionId, filters.collectionId)
      );
    }

    if (filters?.search) {
      const pattern = `%${filters.search}%`;
      conditions.push(
        or(
          like(bookmarks.url, pattern),
          like(bookmarks.title, pattern),
          like(bookmarks.description, pattern)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const rows = await query
      .orderBy(desc(bookmarks.createdAt))
      .limit(filters?.limit ?? 50)
      .offset(filters?.offset ?? 0);

    return ok(rows);
  } catch {
    return err("Failed to fetch bookmarks");
  }
}

export async function getBookmarkById(
  id: string
): Promise<Result<Bookmark>> {
  try {
    const rows = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.id, id));

    if (rows.length === 0) return err("Bookmark not found");
    return ok(rows[0]);
  } catch {
    return err("Failed to fetch bookmark");
  }
}

export async function updateBookmark(
  id: string,
  data: {
    url?: string;
    title?: string;
    description?: string | null;
    faviconUrl?: string | null;
    tagIds?: string[];
    collectionIds?: string[];
  }
): Promise<Result<Bookmark>> {
  try {
    const { tagIds, collectionIds, ...fields } = data;

    const result = await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(bookmarks)
        .set({ ...fields, updatedAt: new Date() })
        .where(eq(bookmarks.id, id))
        .returning();

      if (!updated) return null;

      if (tagIds !== undefined) {
        await tx
          .delete(bookmarkTags)
          .where(eq(bookmarkTags.bookmarkId, id));
        if (tagIds.length > 0) {
          await tx.insert(bookmarkTags).values(
            tagIds.map((tagId) => ({ bookmarkId: id, tagId }))
          );
        }
      }

      if (collectionIds !== undefined) {
        await tx
          .delete(bookmarkCollections)
          .where(eq(bookmarkCollections.bookmarkId, id));
        if (collectionIds.length > 0) {
          await tx.insert(bookmarkCollections).values(
            collectionIds.map((collectionId) => ({
              bookmarkId: id,
              collectionId,
            }))
          );
        }
      }

      return updated;
    });

    if (!result) return err("Bookmark not found");
    return ok(result);
  } catch (e) {
    if (isUniqueViolation(e)) {
      return err("A bookmark with this URL already exists");
    }
    return err("Failed to update bookmark");
  }
}

export async function deleteBookmark(
  id: string
): Promise<Result<Bookmark>> {
  try {
    const [deleted] = await db
      .delete(bookmarks)
      .where(eq(bookmarks.id, id))
      .returning();

    if (!deleted) return err("Bookmark not found");
    return ok(deleted);
  } catch {
    return err("Failed to delete bookmark");
  }
}

async function attachTags(bookmarkIds: string[]): Promise<Map<string, Tag[]>> {
  if (bookmarkIds.length === 0) return new Map();

  const rows = await db
    .select({
      bookmarkId: bookmarkTags.bookmarkId,
      id: tags.id,
      name: tags.name,
      color: tags.color,
    })
    .from(bookmarkTags)
    .innerJoin(tags, eq(bookmarkTags.tagId, tags.id))
    .where(inArray(bookmarkTags.bookmarkId, bookmarkIds));

  const map = new Map<string, Tag[]>();
  for (const row of rows) {
    const list = map.get(row.bookmarkId) ?? [];
    list.push({ id: row.id, name: row.name, color: row.color });
    map.set(row.bookmarkId, list);
  }
  return map;
}

export async function getBookmarksWithTags(filters?: {
  search?: string;
  tagId?: string;
  collectionId?: string;
  limit?: number;
  offset?: number;
}): Promise<Result<BookmarkWithTags[]>> {
  const result = await getBookmarks(filters);
  if (result.error !== null) return result;

  try {
    const tagMap = await attachTags(result.data.map((b) => b.id));
    const withTags = result.data.map((b) => ({
      ...b,
      tags: tagMap.get(b.id) ?? [],
    }));
    return ok(withTags);
  } catch {
    return err("Failed to fetch bookmark tags");
  }
}

export async function getBookmarkWithDetails(
  id: string
): Promise<Result<BookmarkWithDetails>> {
  const result = await getBookmarkById(id);
  if (result.error !== null) return result;

  try {
    const [tagRows, collectionRows] = await Promise.all([
      db
        .select({
          id: tags.id,
          name: tags.name,
          color: tags.color,
        })
        .from(bookmarkTags)
        .innerJoin(tags, eq(bookmarkTags.tagId, tags.id))
        .where(eq(bookmarkTags.bookmarkId, id)),
      db
        .select({
          id: collections.id,
          name: collections.name,
          description: collections.description,
        })
        .from(bookmarkCollections)
        .innerJoin(
          collections,
          eq(bookmarkCollections.collectionId, collections.id)
        )
        .where(eq(bookmarkCollections.bookmarkId, id)),
    ]);

    return ok({
      ...result.data,
      tags: tagRows,
      collections: collectionRows,
    });
  } catch {
    return err("Failed to fetch bookmark details");
  }
}
