"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Tag } from "@/lib/types";
import { getContrastColor } from "@/lib/utils";

interface TagFilterProps {
  tags: Tag[];
}

export function TagFilter({ tags }: TagFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTagId = searchParams.get("tagId");

  function toggle(tagId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (activeTagId === tagId) {
      params.delete("tagId");
    } else {
      params.set("tagId", tagId);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isActive = activeTagId === tag.id;
        return (
          <button
            key={tag.id}
            onClick={() => toggle(tag.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              isActive ? "ring-2 ring-offset-1 ring-offset-background" : "opacity-70 hover:opacity-100"
            }`}
            style={{
              backgroundColor: tag.color,
              color: getContrastColor(tag.color),
              ...(isActive ? { ringColor: tag.color } : {}),
            }}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}
