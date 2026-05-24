import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await prisma.link.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug, destination } = await req.json();

  if (!slug || !destination) {
    return NextResponse.json({ error: "Slug and destination are required" }, { status: 400 });
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: "Slug may only contain lowercase letters, numbers, and hyphens" },
      { status: 400 }
    );
  }

  let url: URL;
  try {
    url = new URL(destination);
  } catch {
    return NextResponse.json({ error: "Invalid destination URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return NextResponse.json({ error: "Destination must be an http or https URL" }, { status: 400 });
  }

  const existing = await prisma.link.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "That slug is already taken" }, { status: 409 });
  }

  const link = await prisma.link.create({
    data: { slug, destination, userId: session.userId },
  });

  return NextResponse.json(link, { status: 201 });
}
