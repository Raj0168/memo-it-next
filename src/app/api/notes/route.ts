import { connectToDB } from "@/lib/db";
import Note from "@/models/Note";
import User from "@/models/User";
import Folder from "@/models/Folder";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json("Unauthorized", { status: 401 });

  const { heading, content, timer, folder } = await req.json();

  if (!heading || !content) {
    return (
      NextResponse.json({ error: "Missing heading or content" }),
      {
        status: 400,
      }
    );
  }

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let folderId = null;

  if (folder) {
    if (!mongoose.Types.ObjectId.isValid(folder)) {
      return NextResponse.json(
        { error: "Invalid folder ID" },
        {
          status: 400,
        }
      );
    }

    const existingFolder = await Folder.findOne({
      _id: folder,
      user: user._id,
    });

    if (!existingFolder) {
      return NextResponse.json(
        JSON.stringify({ error: "Folder does not exist or is not yours" }),
        { status: 400 }
      );
    }

    folderId = existingFolder._id;
  }

  const note = await Note.create({
    user: user._id,
    heading,
    content,
    timer: timer ? new Date(timer) : undefined,
    folder: folderId,
  });

  return NextResponse.json(note, { status: 201 });
}
