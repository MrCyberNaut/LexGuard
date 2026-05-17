"use server";

import { z } from "zod";
import { createHash } from "crypto";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  source: z.enum(["hero", "cta"]).default("hero"),
});

export type WaitlistResult = { success: true } | { success: false; error: string };

export async function submitWaitlist(
  email: string,
  source: "hero" | "cta"
): Promise<WaitlistResult> {
  const parsed = schema.safeParse({ email, source });
  if (!parsed.success) {
    return { success: false, error: "Please enter a valid email address" };
  }

  // Hash IP for privacy — never store raw
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ipHash = ip ? createHash("sha256").update(ip).digest("hex") : null;
  const ua = headersList.get("user-agent") ?? null;

  const { error } = await supabaseAdmin.from("waitlist").insert({
    email: parsed.data.email,
    source: parsed.data.source,
    user_agent: ua,
    ip_hash: ipHash,
  });

  // Duplicate email → treat as success (silent)
  if (error?.code === "23505") return { success: true };
  if (error) return { success: false, error: "Could not save. Try again." };

  return { success: true };
}
