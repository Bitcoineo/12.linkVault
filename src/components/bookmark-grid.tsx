import type { BookmarkWithTags } from "@/lib/types";
import { BookmarkCard } from "./bookmark-card";

interface BookmarkGridProps {
  bookmarks: BookmarkWithTags[];
  hasFilters?: boolean;
}

export function BookmarkGrid({ bookmarks, hasFilters }: BookmarkGridProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted text-sm">
          {hasFilters
            ? "No bookmarks match your filters."
            : "No bookmarks yet \u2014 add your first one!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
}
