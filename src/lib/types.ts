import type { InferSelectModel } from "drizzle-orm";
import type { bookmarks, tags, collections } from "@/db/schema";

export type Result<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export function ok<T>(data: T): Result<T> {
  return { data, error: null };
}

export function err<T = never>(error: string): Result<T> {
  return { data: null, error };
}

export type Bookmark = InferSelectModel<typeof bookmarks>;
export type Tag = InferSelectModel<typeof tags>;
export type Collection = InferSelectModel<typeof collections>;

export type BookmarkWithTags = Bookmark & { tags: Tag[] };
export type BookmarkWithDetails = Bookmark & { tags: Tag[]; collections: Collection[] };
