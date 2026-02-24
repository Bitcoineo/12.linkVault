import { Suspense } from "react";
import { getBookmarksWithTags } from "@/lib/bookmarks";
import { getTags } from "@/lib/tags";
import { getCollections } from "@/lib/collections";
import { SearchBar } from "@/components/search-bar";
import { TagFilter } from "@/components/tag-filter";
import { BookmarkGrid } from "@/components/bookmark-grid";
import { BookmarkFormDialog } from "@/components/bookmark-form-dialog";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    tagId?: string;
    collectionId?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const [bookmarksResult, tagsResult, collectionsResult] = await Promise.all([
    getBookmarksWithTags({
      search: params.search,
      tagId: params.tagId,
      collectionId: params.collectionId,
    }),
    getTags(),
    getCollections(),
  ]);

  const bookmarks = bookmarksResult.data ?? [];
  const tags = tagsResult.data ?? [];
  const collections = collectionsResult.data ?? [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <BookmarkFormDialog mode="add" tags={tags} collections={collections} />
      </div>

      <Suspense>
        <SearchBar />
      </Suspense>

      <Suspense>
        <TagFilter tags={tags} />
      </Suspense>

      <BookmarkGrid
        bookmarks={bookmarks}
        hasFilters={!!(params.search || params.tagId || params.collectionId)}
      />
    </div>
  );
}
