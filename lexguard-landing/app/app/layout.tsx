import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LexGuard — Analyze",
  description: "Upload your contract. Get your defense.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Tool uses a full-height dark layout — no landing page nav
  return (
    <div style={{ height: "100dvh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {children}
    </div>
  );
}
