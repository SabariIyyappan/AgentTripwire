import type { ReactNode } from "react";
import { Agent3DBackground } from "./Agent3DBackground";
import { Navbar } from "./Navbar";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <Agent3DBackground />
      <Navbar />
      <main className="relative">{children}</main>
      <footer className="border-t border-white/5 mt-20">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center text-sm text-muted-foreground">
          AgentTripwire — Runtime safety gateway for autonomous AI agents.
        </div>
      </footer>
    </div>
  );
}
