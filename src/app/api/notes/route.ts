// api/notes/route.ts
import { connectToDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

// POST /api/notes — Create a new note
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return new Response("Unauthorized", { status: 401 });

  const { heading, content, timer, folder } = await req.json();
  await connectToDB();
  const user = await User.findOne({ email: session.user.email });

  if (folder && !mongoose.Types.ObjectId.isValid(folder)) {
    return new Response(JSON.stringify({ error: "Invalid folder ID" }), {
      status: 400,
    });
  }

  const note = await Note.create({
    user: user._id,
    heading,
    content,
    timer: timer ? new Date(timer) : undefined,
    folder: folder || null,
  });

  return new Response(JSON.stringify(note), { status: 201 });
}

// GET /api/notes?page=1&limit=10 — Get paginated notes
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });

  const notes = await Note.find({ user: user._id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return new Response(JSON.stringify(notes), { status: 200 });
}
