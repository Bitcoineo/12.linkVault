"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteBookmarkAction } from "@/app/actions";

interface DeleteBookmarkButtonProps {
  bookmarkId: string;
}

export function DeleteBookmarkButton({ bookmarkId }: DeleteBookmarkButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this bookmark?")) return;

    startTransition(async () => {
      const result = await deleteBookmarkAction(bookmarkId);
      if (result.error) {
        alert(result.error);
      } else {
        router.push("/");
      }
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="px-3 py-1.5 text-sm font-medium rounded-md border border-danger/30 text-danger hover:bg-danger/10 transition disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
