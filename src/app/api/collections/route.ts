import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCollections, createCollection } from "@/lib/collections";

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export async function GET() {
  const result = await getCollections();
  if (result.error) {
    console.error("GET /api/collections error:", result.error);
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

  const result = await createCollection(
    parsed.data.name,
    parsed.data.description
  );
  if (result.error) {
    console.error("POST /api/collections error:", result.error);
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ data: result.data }, { status: 201 });
}
