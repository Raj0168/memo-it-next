import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  await connectToDB();

  const user = await User.findOne({ email: session.user.email }).select(
    "name notifications"
  );
  if (!user) {
    return NextResponse.json("User not found", { status: 404 });
  }

  return NextResponse.json(user, { status: 200 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const { name, notifications } = await request.json();

  await connectToDB();

  const updatedUser = await User.findOneAndUpdate(
    { email: session.user.email },
    { name, notifications },
    { new: true }
  ).select("name notifications");

  return NextResponse.json(updatedUser, { status: 200 });
}
