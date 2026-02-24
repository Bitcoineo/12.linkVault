"use server";

import { revalidatePath } from "next/cache";
import { createBookmark, updateBookmark, deleteBookmark } from "@/lib/bookmarks";
import { createTag } from "@/lib/tags";
import type { Tag } from "@/lib/types";

export async function createBookmarkAction(
  formData: FormData
): Promise<{ error?: string }> {
  const url = formData.get("url") as string;
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || undefined;
  const faviconUrl = (formData.get("faviconUrl") as string) || undefined;
  const tagIds = formData.getAll("tagIds") as string[];
  const collectionIds = formData.getAll("collectionIds") as string[];

  const result = await createBookmark({
    url,
    title: title || url,
    description,
    faviconUrl,
    tagIds: tagIds.length > 0 ? tagIds : undefined,
    collectionIds: collectionIds.length > 0 ? collectionIds : undefined,
  });

  if (result.error !== null) {
    return { error: result.error };
  }

  revalidatePath("/");
  return {};
}

export async function updateBookmarkAction(
  id: string,
  formData: FormData
): Promise<{ error?: string }> {
  const url = (formData.get("url") as string) || undefined;
  const title = (formData.get("title") as string) || undefined;
  const description = formData.get("description") as string | null;
  const faviconUrl = formData.get("faviconUrl") as string | null;
  const tagIds = formData.getAll("tagIds") as string[];
  const collectionIds = formData.getAll("collectionIds") as string[];

  const result = await updateBookmark(id, {
    url,
    title,
    description: description || undefined,
    faviconUrl: faviconUrl || undefined,
    tagIds,
    collectionIds,
  });

  if (result.error !== null) {
    return { error: result.error };
  }

  revalidatePath("/");
  revalidatePath(`/bookmarks/${id}`);
  return {};
}

export async function deleteBookmarkAction(
  id: string
): Promise<{ error?: string }> {
  const result = await deleteBookmark(id);

  if (result.error !== null) {
    return { error: result.error };
  }

  revalidatePath("/");
  return {};
}

export async function createTagAction(
  formData: FormData
): Promise<{ data?: Tag; error?: string }> {
  const name = formData.get("name") as string;
  const color = (formData.get("color") as string) || undefined;

  const result = await createTag(name, color);

  if (result.error !== null) {
    return { error: result.error };
  }

  revalidatePath("/");
  return { data: result.data };
}
