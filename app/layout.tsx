import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgentTripwire",
  description: "Runtime Firewall & Safety Layer for AI Agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
