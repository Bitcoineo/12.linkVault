import { sqliteTable, text, integer, primaryKey, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Bookmarks
// ---------------------------------------------------------------------------
export const bookmarks = sqliteTable(
  "bookmarks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    url: text("url").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    faviconUrl: text("favicon_url"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [uniqueIndex("url_idx").on(table.url)]
);

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------
export const tags = sqliteTable(
  "tags",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    color: text("color").notNull().default("#6366f1"),
  },
  (table) => [uniqueIndex("tag_name_idx").on(table.name)]
);

// ---------------------------------------------------------------------------
// Bookmark ↔ Tag join table
// ---------------------------------------------------------------------------
export const bookmarkTags = sqliteTable(
  "bookmark_tags",
  {
    bookmarkId: text("bookmark_id")
      .notNull()
      .references(() => bookmarks.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.bookmarkId, table.tagId] })]
);

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------
export const collections = sqliteTable("collections", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
});

// ---------------------------------------------------------------------------
// Bookmark ↔ Collection join table
// ---------------------------------------------------------------------------
export const bookmarkCollections = sqliteTable(
  "bookmark_collections",
  {
    bookmarkId: text("bookmark_id")
      .notNull()
      .references(() => bookmarks.id, { onDelete: "cascade" }),
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.bookmarkId, table.collectionId] }),
  ]
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------
export const bookmarksRelations = relations(bookmarks, ({ many }) => ({
  bookmarkTags: many(bookmarkTags),
  bookmarkCollections: many(bookmarkCollections),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  bookmarkTags: many(bookmarkTags),
}));

export const bookmarkTagsRelations = relations(bookmarkTags, ({ one }) => ({
  bookmark: one(bookmarks, {
    fields: [bookmarkTags.bookmarkId],
    references: [bookmarks.id],
  }),
  tag: one(tags, {
    fields: [bookmarkTags.tagId],
    references: [tags.id],
  }),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
  bookmarkCollections: many(bookmarkCollections),
}));

export const bookmarkCollectionsRelations = relations(
  bookmarkCollections,
  ({ one }) => ({
    bookmark: one(bookmarks, {
      fields: [bookmarkCollections.bookmarkId],
      references: [bookmarks.id],
    }),
    collection: one(collections, {
      fields: [bookmarkCollections.collectionId],
      references: [collections.id],
    }),
  })
);
