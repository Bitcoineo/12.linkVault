import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookmarkWithDetails } from "@/lib/bookmarks";
import { getTags } from "@/lib/tags";
import { getCollections } from "@/lib/collections";
import { getContrastColor, formatRelativeDate } from "@/lib/utils";
import { BookmarkFormDialog } from "@/components/bookmark-form-dialog";
import { DeleteBookmarkButton } from "@/components/delete-bookmark-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookmarkDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [bookmarkResult, tagsResult, collectionsResult] = await Promise.all([
    getBookmarkWithDetails(id),
    getTags(),
    getCollections(),
  ]);

  if (bookmarkResult.error !== null) {
    notFound();
  }

  const bookmark = bookmarkResult.data;
  const tags = tagsResult.data ?? [];
  const collections = collectionsResult.data ?? [];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/"
        className="text-sm text-muted hover:text-foreground transition"
      >
        &larr; Back to bookmarks
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {bookmark.faviconUrl ? (
          <img
            src={bookmark.faviconUrl}
            alt=""
            width={32}
            height={32}
            className="rounded-md flex-shrink-0 mt-1"
          />
        ) : (
          <span className="w-8 h-8 rounded-md bg-accent/20 flex items-center justify-center text-sm flex-shrink-0 mt-1">
            *
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-foreground">{bookmark.title}</h1>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline break-all"
          >
            {bookmark.url}
          </a>
        </div>
      </div>

      {/* Description */}
      {bookmark.description && (
        <div className="bg-card border border-card-border rounded-lg p-4">
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {bookmark.description}
          </p>
        </div>
      )}

      {/* Tags */}
      {bookmark.tags.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {bookmark.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/?tagId=${tag.id}`}
                className="px-3 py-1 rounded-full text-xs font-medium hover:opacity-80 transition"
                style={{
                  backgroundColor: tag.color,
                  color: getContrastColor(tag.color),
                }}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Collections */}
      {bookmark.collections.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            Collections
          </h2>
          <div className="flex flex-wrap gap-2">
            {bookmark.collections.map((col) => (
              <Link
                key={col.id}
                href={`/?collectionId=${col.id}`}
                className="px-3 py-1.5 rounded-md text-xs font-medium border border-card-border bg-card text-foreground hover:border-accent transition"
              >
                {col.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="text-xs text-muted space-y-1">
        <p>Added {formatRelativeDate(bookmark.createdAt)}</p>
        {bookmark.updatedAt.getTime() !== bookmark.createdAt.getTime() && (
          <p>Updated {formatRelativeDate(bookmark.updatedAt)}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-card-border">
        <BookmarkFormDialog
          mode="edit"
          tags={tags}
          collections={collections}
          bookmark={bookmark}
        />
        <DeleteBookmarkButton bookmarkId={bookmark.id} />
      </div>
    </div>
  );
}
