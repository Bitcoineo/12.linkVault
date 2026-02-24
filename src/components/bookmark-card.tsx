import Link from "next/link";
import type { BookmarkWithTags } from "@/lib/types";
import { getContrastColor, formatRelativeDate } from "@/lib/utils";

interface BookmarkCardProps {
  bookmark: BookmarkWithTags;
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const hostname = (() => {
    try {
      return new URL(bookmark.url).hostname;
    } catch {
      return bookmark.url;
    }
  })();

  return (
    <Link
      href={`/bookmarks/${bookmark.id}`}
      className="block bg-card border border-card-border rounded-lg p-4 hover:border-accent transition-colors group"
    >
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {bookmark.faviconUrl ? (
          <img
            src={bookmark.faviconUrl}
            alt=""
            width={20}
            height={20}
            className="rounded-sm flex-shrink-0 mt-0.5"
          />
        ) : (
          <span className="w-5 h-5 rounded-sm bg-accent/20 flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
            *
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
            {bookmark.title}
          </h3>
          <p className="text-xs text-muted truncate mt-0.5">{hostname}</p>
        </div>

        <span className="text-xs text-muted flex-shrink-0">
          {formatRelativeDate(bookmark.createdAt)}
        </span>
      </div>

      {bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {bookmark.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{
                backgroundColor: tag.color,
                color: getContrastColor(tag.color),
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
