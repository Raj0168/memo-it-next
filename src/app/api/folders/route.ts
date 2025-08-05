// app/api/folders/route.ts
import { connectToDB } from "@/lib/mongodb";
import Folder from "@/models/Folder";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name)
    return NextResponse.json(
      { error: "Folder name is required" },
      { status: 400 }
    );

  await connectToDB();
  const folder = await Folder.create({ name, user: session.user.id });

  return NextResponse.json(folder, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDB();
  const folders = await Folder.find({ user: session.user.id });

  return NextResponse.json(folders, { status: 200 });
}
