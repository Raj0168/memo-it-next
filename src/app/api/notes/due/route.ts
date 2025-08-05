import { connectToDB } from "@/lib/db";
import Note from "@/models/Note";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json("Unauthorized", { status: 401 });

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });

  const now = new Date();

  const dueNotes = await Note.find({
    user: user._id,
    timer: { $lte: now },
  });

  return NextResponse.json(dueNotes, { status: 200 });
}
