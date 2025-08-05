import { connectToDB } from "@/lib/db";
import Folder from "@/models/Folder";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json(
      { error: "Folder name is required" },
      { status: 400 }
    );
  }

  await connectToDB();

  const dbUser = await User.findOne({ email: session.user.email });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const folder = await Folder.create({
    name: name.trim(),
    user: dbUser._id,
  });

  return NextResponse.json(folder, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();

  const dbUser = await User.findOne({ email: session.user.email });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const folders = await Folder.find({ user: dbUser._id });

  return NextResponse.json(folders, { status: 200 });
}
