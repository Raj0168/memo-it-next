import { connectToDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return new Response("Email and password required", { status: 400 });
    }

    await connectToDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response("User already exists", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return new Response("User registered successfully", { status: 201 });
  } catch (err) {
    console.error("Register API Error:", err);
    return new Response("Something went wrong", { status: 500 });
  }
}
