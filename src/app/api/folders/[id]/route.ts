import { connectToDB } from "@/lib/mongodb";
import Folder from "@/models/Folder";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,

  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();

  if (!name)
    return NextResponse.json(
      { error: "Folder name required" },

      { status: 400 }
    );

  await connectToDB();

  const updated = await Folder.findOneAndUpdate(
    { _id: params.id, user: session.user.id },

    { name },

    { new: true }
  );

  if (!updated)
    return NextResponse.json(
      { error: "Folder not found or not yours" },

      { status: 404 }
    );

  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(
  _: Request,

  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDB();

  const deleted = await Folder.findOneAndDelete({
    _id: params.id,

    user: session.user.id,
  });

  if (!deleted)
    return NextResponse.json(
      { error: "Folder not found or not yours" },

      { status: 404 }
    );

  return NextResponse.json({ message: "Folder deleted" }, { status: 200 });
}
