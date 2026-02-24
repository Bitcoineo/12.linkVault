import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getBookmarkById,
  updateBookmark,
  deleteBookmark,
} from "@/lib/bookmarks";

const updateSchema = z.object({
  url: z.string().url("Invalid URL format").optional(),
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  faviconUrl: z.string().url().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
  collectionIds: z.array(z.string()).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  const result = await getBookmarkById(id);
  if (result.error) {
    const status = result.error.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ data: result.data });
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const result = await updateBookmark(id, parsed.data);
  if (result.error) {
    if (result.error.includes("not found")) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    if (result.error.includes("already exists")) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ data: result.data });
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  const result = await deleteBookmark(id);
  if (result.error) {
    const status = result.error.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ data: result.data });
}
