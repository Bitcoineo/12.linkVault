"use client";

import { useRef, useCallback } from "react";
import { BookmarkForm } from "./bookmark-form";
import type { Tag, Collection, BookmarkWithDetails } from "@/lib/types";

interface BookmarkFormDialogProps {
  mode: "add" | "edit";
  tags: Tag[];
  collections: Collection[];
  bookmark?: BookmarkWithDetails;
}

export function BookmarkFormDialog({ mode, tags, collections, bookmark }: BookmarkFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  return (
    <>
      <button
        onClick={open}
        className={
          mode === "add"
            ? "px-4 py-2 text-sm font-medium rounded-md bg-accent text-white hover:bg-accent-hover transition"
            : "px-3 py-1.5 text-sm font-medium rounded-md border border-card-border text-foreground hover:bg-card transition"
        }
      >
        {mode === "add" ? "Add Bookmark" : "Edit"}
      </button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-lg rounded-xl bg-background border border-card-border p-6 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <BookmarkForm
          tags={tags}
          collections={collections}
          bookmark={bookmark}
          onClose={close}
        />
      </dialog>
    </>
  );
}
