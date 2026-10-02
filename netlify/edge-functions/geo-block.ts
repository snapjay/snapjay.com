import type { Context } from "@netlify/edge-functions";

export default async (_request: Request, context: Context) => {
  try {
    const BLOCKED_COUNTRIES = ["CN", "SG", "RU", "KP"];
    const countryCode = context.geo?.country?.code;

    if (countryCode && BLOCKED_COUNTRIES.includes(countryCode)) {
      console.log(`Blocking request from ${countryCode}: ${context.geo?.city ?? "Unknown City"}, ${context.geo?.country?.name ?? "Unknown Country"}`);
      return new Response("Temporarily unavailable.", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      });
    }
  } catch (error) {
    console.error("Geo-block Edge Function Error:", error);
  }

  // Otherwise, continue to the next edge function or the origin
  return context.next();
};
