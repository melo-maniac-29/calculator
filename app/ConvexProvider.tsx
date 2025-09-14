"use client";

import { ConvexProvider as ConvexProviderBase, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://giant-stork-314.convex.cloud";

if (!convexUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_CONVEX_URL environment variable.\n" +
    "Set it in your .env.local file.\n" +
    "You can find the URL on your Convex dashboard."
  );
}

const convex = new ConvexReactClient(convexUrl);

export function ConvexProvider({ children }: { children: ReactNode }) {
  return <ConvexProviderBase client={convex}>{children}</ConvexProviderBase>;
}