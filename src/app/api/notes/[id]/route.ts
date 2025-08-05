// app/api/notes/[id]/route.ts
import { connectToDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const note = await Note.findById(params.id);

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Error fetching note" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDB();

    const { heading, content, timer, folder } = await req.json();

    const updated = await Note.findOneAndUpdate(
      { _id: params.id, user: session.user.id },
      { heading, content, timer, folder },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Note not found or not yours" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDB();

    const deleted = await Note.findOneAndDelete({
      _id: params.id,
      user: session.user.id,
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Note not found or not yours" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Note deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
