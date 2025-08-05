import { getServerSession, Session } from "next-auth";
import { authOptions } from "./auth";
import { getSession } from "next-auth/react";

// Server-side safe session getter
export async function getServerUserSession() {
  return await getServerSession(authOptions);
}

// Client-side safe session getter (for React client components)
export async function getClientUserSession(): Promise<Session | null> {
  return await getSession();
}
