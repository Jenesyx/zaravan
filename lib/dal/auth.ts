import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string | null;
};

// Verified identity from the JWT. Never getSession() on the server — the cookie can be forged.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;
  return {
    id: data.claims.sub,
    email: typeof data.claims.email === "string" ? data.claims.email : null,
  };
});

// Sanitises a `?next=` value before redirecting to it. Only same-origin paths
// pass; "//evil.com", "/\evil.com" and absolute URLs fall back to `fallback`.
export function safeNext(next: unknown, fallback = "/account"): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return fallback;
  }
  const base = "http://zaravan.local";
  const url = new URL(next, base);
  return url.origin === base ? url.pathname + url.search + url.hash : fallback;
}

// `next` is the path to return to after sign-in, e.g. "/account/orders".
export async function requireUser(next = "/account"): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  return user;
}

const isAdmin = cache(async (): Promise<boolean> => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
});

// Non-admins get a 404 so /admin doesn't advertise that it exists.
export async function requireAdmin(next = "/admin"): Promise<CurrentUser> {
  const user = await requireUser(next);
  if (!(await isAdmin())) notFound();
  return user;
}
