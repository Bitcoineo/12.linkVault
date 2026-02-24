"use client";

import { useState, useTransition } from "react";
import { createBookmarkAction, updateBookmarkAction, createTagAction, fetchMetadataAction } from "@/app/actions";
import type { Tag, Collection, BookmarkWithDetails } from "@/lib/types";
import { getContrastColor } from "@/lib/utils";

interface BookmarkFormProps {
  tags: Tag[];
  collections: Collection[];
  bookmark?: BookmarkWithDetails;
  onClose: () => void;
}

export function BookmarkForm({ tags: initialTags, collections, bookmark, onClose }: BookmarkFormProps) {
  const [url, setUrl] = useState(bookmark?.url ?? "");
  const [title, setTitle] = useState(bookmark?.title ?? "");
  const [description, setDescription] = useState(bookmark?.description ?? "");
  const [faviconUrl, setFaviconUrl] = useState(bookmark?.faviconUrl ?? "");
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(
    new Set(bookmark?.tags.map((t) => t.id) ?? [])
  );
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<Set<string>>(
    new Set(bookmark?.collections.map((c) => c.id) ?? [])
  );
  const [allTags, setAllTags] = useState(initialTags);
  const [newTagName, setNewTagName] = useState("");
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleUrlBlur() {
    if (!url || title) return;
    try {
      new URL(url);
    } catch {
      return;
    }

    setIsLoadingMeta(true);
    try {
      const result = await fetchMetadataAction(url);
      if (result.data) {
        if (result.data.title && !title) setTitle(result.data.title);
        if (result.data.faviconUrl) setFaviconUrl(result.data.faviconUrl);
      }
    } catch {
      // Metadata fetch is best-effort
    } finally {
      setIsLoadingMeta(false);
    }
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) next.delete(tagId);
      else next.add(tagId);
      return next;
    });
  }

  function toggleCollection(collectionId: string) {
    setSelectedCollectionIds((prev) => {
      const next = new Set(prev);
      if (next.has(collectionId)) next.delete(collectionId);
      else next.add(collectionId);
      return next;
    });
  }

  async function handleCreateTag() {
    if (!newTagName.trim()) return;
    const fd = new FormData();
    fd.set("name", newTagName.trim());
    const result = await createTagAction(fd);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.data) {
      setAllTags((prev) => [...prev, result.data!]);
      setSelectedTagIds((prev) => {
        const next = new Set(prev);
        next.add(result.data!.id);
        return next;
      });
      setNewTagName("");
    }
  }

  function handleSubmit() {
    if (!url) {
      setError("URL is required");
      return;
    }

    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("url", url);
      fd.set("title", title || url);
      fd.set("description", description);
      fd.set("faviconUrl", faviconUrl);
      selectedTagIds.forEach((id) => fd.append("tagIds", id));
      selectedCollectionIds.forEach((id) => fd.append("collectionIds", id));

      const result = bookmark
        ? await updateBookmarkAction(bookmark.id, fd)
        : await createBookmarkAction(fd);

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  }

  const inputClass =
    "w-full px-3 py-2 rounded-md bg-input-bg border border-input-border text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition";

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        {bookmark ? "Edit Bookmark" : "Add Bookmark"}
      </h2>

      {error && (
        <p className="text-sm text-danger bg-danger/10 px-3 py-2 rounded-md">{error}</p>
      )}

      {/* URL */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1">URL</label>
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleUrlBlur}
            placeholder="https://..."
            className={inputClass}
            disabled={isPending}
          />
          {isLoadingMeta && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">
              fetching...
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Page title"
          className={inputClass}
          disabled={isPending}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description..."
          rows={2}
          className={inputClass}
          disabled={isPending}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-medium text-muted mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {allTags.map((tag) => {
            const selected = selectedTagIds.has(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  selected ? "ring-2 ring-offset-1 ring-offset-background" : "opacity-50 hover:opacity-80"
                }`}
                style={{
                  backgroundColor: tag.color,
                  color: getContrastColor(tag.color),
                }}
                disabled={isPending}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag name..."
            className={`${inputClass} flex-1`}
            disabled={isPending}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreateTag();
              }
            }}
          />
          <button
            type="button"
            onClick={handleCreateTag}
            disabled={isPending || !newTagName.trim()}
            className="px-3 py-2 text-xs font-medium rounded-md bg-card border border-card-border text-foreground hover:bg-accent/10 transition disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Collections */}
      {collections.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-muted mb-2">Collections</label>
          <div className="flex flex-wrap gap-2">
            {collections.map((col) => {
              const selected = selectedCollectionIds.has(col.id);
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => toggleCollection(col.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                    selected
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-card-border bg-card text-muted hover:text-foreground"
                  }`}
                  disabled={isPending}
                >
                  {col.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="px-4 py-2 text-sm rounded-md text-muted hover:text-foreground transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !url}
          className="px-4 py-2 text-sm font-medium rounded-md bg-accent text-white hover:bg-accent-hover transition disabled:opacity-50"
        >
          {isPending ? "Saving..." : bookmark ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}
