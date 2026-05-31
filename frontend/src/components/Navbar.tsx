import { Link, useRouterState } from "@tanstack/react-router";
import { Shield, Zap, Plug } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/demo", label: "Demo" },
  { to: "/real-testing", label: "Real Testing" },
  { to: "/architecture", label: "Architecture" },
  { to: "/risk-engine", label: "Risk Engine" },
  { to: "/policies", label: "Policies" },
  { to: "/reports", label: "Reports" },
] as const;

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-50 w-full px-4">
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 glass">
        <Link to="/" className="flex items-center gap-2.5 px-2">
          <div className="relative h-9 w-9 rounded-lg bg-gradient-glow ring-glow flex items-center justify-center">
            <Shield className="h-5 w-5 text-[color:var(--primary-foreground)]" />
          </div>
          <span className="font-semibold tracking-tight text-base">
            Agent<span className="text-gradient">Tripwire</span>
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm transition-colors",
                  active ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/demo" className="hidden md:inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10">
            <Zap className="h-3.5 w-3.5" /> Run Demo
          </Link>
          <Link to="/real-testing" className="inline-flex items-center gap-2 rounded-lg bg-gradient-glow px-3.5 py-1.5 text-sm font-medium text-[color:var(--primary-foreground)] ring-glow">
            <Plug className="h-3.5 w-3.5" /> Connect Agent
          </Link>
        </div>
      </div>
    </header>
  );
}
