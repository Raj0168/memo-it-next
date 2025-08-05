import { connectToDB } from "@/lib/db";
import Note from "@/models/Note";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return new Response("Unauthorized", { status: 401 });

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });

  const now = new Date();

  const dueNotes = await Note.find({
    user: user._id,
    timer: { $lte: now },
  });

  return new Response(JSON.stringify(dueNotes), { status: 200 });
}
