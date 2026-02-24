import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getBookmarks, createBookmark } from "@/lib/bookmarks";

const createSchema = z.object({
  url: z.string().url("Invalid URL format"),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  faviconUrl: z.string().url().optional(),
  tagIds: z.array(z.string()).optional(),
  collectionIds: z.array(z.string()).optional(),
});

const filtersSchema = z.object({
  search: z.string().optional(),
  tagId: z.string().optional(),
  collectionId: z.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = filtersSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const result = await getBookmarks(parsed.data);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ data: result.data });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const input = {
    ...parsed.data,
    title: parsed.data.title ?? parsed.data.url,
  };
  const result = await createBookmark(input);
  if (result.error) {
    const status = result.error.includes("already exists") ? 409 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ data: result.data }, { status: 201 });
}
