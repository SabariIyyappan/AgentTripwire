import { motion } from "framer-motion";
import { Shield, Bot, Globe, Database, Mail, Terminal, Webhook, Wallet, Building2 } from "lucide-react";

const tools = [
  { icon: Globe, label: "Browser", angle: 0 },
  { icon: Database, label: "Database", angle: 45 },
  { icon: Building2, label: "CRM", angle: 90 },
  { icon: Mail, label: "Email", angle: 135 },
  { icon: Terminal, label: "Shell", angle: 180 },
  { icon: Webhook, label: "Webhook", angle: 225 },
  { icon: Wallet, label: "Wallet", angle: 270 },
  { icon: Globe, label: "HTTP", angle: 315 },
];

export function AgentFlowDiagram({ protectedMode = true }: { protectedMode?: boolean }) {
  return (
    <div className="relative mx-auto h-[440px] w-full max-w-[520px]">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            width: 180 + i * 80,
            height: 180 + i * 80,
            borderColor: protectedMode ? "oklch(0.78 0.18 220 / 0.25)" : "oklch(0.68 0.26 25 / 0.25)",
          }}
        />
      ))}
      {tools.map((t, i) => {
        const rad = (t.angle * Math.PI) / 180;
        const radius = 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        const Icon = t.icon;
        return (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="absolute left-1/2 top-1/2 flex h-14 w-14 flex-col items-center justify-center rounded-xl glass text-[10px] text-muted-foreground"
            style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
          >
            <Icon className="h-4 w-4 text-[color:var(--neon-cyan)]" />
            <span className="mt-0.5">{t.label}</span>
          </motion.div>
        );
      })}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-28 w-28 items-center justify-center rounded-2xl glass-strong"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: protectedMode
              ? "radial-gradient(circle, oklch(0.78 0.18 220 / 0.5), transparent 70%)"
              : "radial-gradient(circle, oklch(0.68 0.26 25 / 0.5), transparent 70%)",
          }}
        />
        {protectedMode ? <Shield className="relative h-10 w-10 text-[color:var(--neon-cyan)]" /> : <Bot className="relative h-10 w-10 text-[color:var(--risk-high)]" />}
      </motion.div>
    </div>
  );
}
