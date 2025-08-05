import { connectToDB } from "@/lib/db";
import Folder from "@/models/Folder";
import Note from "@/models/Note";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json(
      { error: "New folder name is required" },
      { status: 400 }
    );
  }

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const updatedFolder = await Folder.findOneAndUpdate(
    { _id: params.id, user: user._id },
    { name: name.trim() },
    { new: true }
  );

  if (!updatedFolder) {
    return NextResponse.json(
      { error: "Folder not found or not yours" },
      { status: 404 }
    );
  }

  return NextResponse.json(updatedFolder, { status: 200 });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const deletedFolder = await Folder.findOneAndDelete({
    _id: params.id,
    user: user._id,
  });

  if (!deletedFolder) {
    return NextResponse.json(
      { error: "Folder not found or not yours" },
      { status: 404 }
    );
  }

  await Note.updateMany(
    { folder: params.id, user: user._id },
    { $set: { folder: null } }
  );

  return NextResponse.json({ message: "Folder deleted" }, { status: 200 });
}
