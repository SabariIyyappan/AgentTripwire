import { motion } from "framer-motion";
import { Shield, Globe, Building2, Send, Terminal, Mail, Database, Webhook, Wallet } from "lucide-react";

/**
 * Hero centerpiece — a faux-3D "security command center".
 * Pure SVG + CSS 3D transforms + framer-motion (no three.js) so it stays
 * lightweight and SSR-safe while reading as a cinematic 3D scene.
 */

const TOOLS = [
  { label: "Browser", icon: Globe, color: "var(--risk-shareable)" },
  { label: "CRM", icon: Building2, color: "var(--neon-cyan)" },
  { label: "HTTP API", icon: Send, color: "var(--risk-low)" },
  { label: "Shell", icon: Terminal, color: "var(--risk-high)" },
  { label: "Email", icon: Mail, color: "var(--risk-sensitive)" },
  { label: "Database", icon: Database, color: "var(--neon-purple)" },
  { label: "Webhook", icon: Webhook, color: "var(--risk-consent)" },
  { label: "Wallet", icon: Wallet, color: "var(--risk-shareable)" },
] as const;

const R = 38.5; // orbit radius in viewBox %
const CENTER = 50;

function coords(i: number, total: number) {
  const theta = (-90 + (i * 360) / total) * (Math.PI / 180);
  return { x: CENTER + R * Math.cos(theta), y: CENTER + R * Math.sin(theta) };
}

export function Hero3DScene() {
  return (
    <div className="mx-auto w-full max-w-[540px]" style={{ perspective: "1200px" }}>
      <motion.div
        className="relative aspect-square w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: [8, 4, 8], rotateY: [-6, 6, -6] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* SVG: spokes, rotating rings, packet trails */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
          {/* rotating dashed rings */}
          <g style={{ transformBox: "fill-box", transformOrigin: "center" }} className="animate-spin-slow">
            <circle cx="50" cy="50" r="46" fill="none" stroke="oklch(0.78 0.18 220 / 0.18)" strokeWidth="0.3" strokeDasharray="2 3" />
          </g>
          <g style={{ transformBox: "fill-box", transformOrigin: "center", animationDirection: "reverse" }} className="animate-spin-slow">
            <circle cx="50" cy="50" r="38.5" fill="none" stroke="oklch(0.70 0.25 300 / 0.20)" strokeWidth="0.3" strokeDasharray="1 4" />
          </g>

          {/* spokes + packets */}
          {TOOLS.map((t, i) => {
            const { x, y } = coords(i, TOOLS.length);
            return (
              <g key={t.label}>
                <line x1="50" y1="50" x2={x} y2={y} stroke="oklch(0.75 0.10 230 / 0.15)" strokeWidth="0.25" />
                <motion.circle
                  r="0.9"
                  fill={t.color}
                  style={{ filter: "drop-shadow(0 0 2px currentColor)", color: t.color }}
                  initial={{ cx: x, cy: y, opacity: 0 }}
                  animate={{ cx: [x, 50], cy: [y, 50], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
                />
              </g>
            );
          })}
        </svg>

        {/* pulsing scan rings behind the shield */}
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--neon-cyan)]/40 animate-pulse-ring" />
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--neon-cyan)]/30 animate-pulse-ring" style={{ animationDelay: "1.5s" }} />

        {/* orbiting tool nodes */}
        {TOOLS.map((t, i) => {
          const { x, y } = coords(i, TOOLS.length);
          return (
            <motion.div
              key={t.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl glass"
                  style={{ boxShadow: `0 0 18px -4px ${t.color}` }}
                >
                  <t.icon className="h-5 w-5" style={{ color: t.color }} />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">{t.label}</span>
              </div>
            </motion.div>
          );
        })}

        {/* central shield core */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-glow ring-glow">
            <div className="absolute inset-0 rounded-2xl bg-gradient-glow blur-xl opacity-60" />
            <Shield className="relative h-11 w-11 text-[color:var(--primary-foreground)]" strokeWidth={2.2} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
