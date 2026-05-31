import { motion } from "framer-motion";

export function RiskGauge({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  const colorVar =
    pct >= 80 ? "--risk-high"
    : pct >= 60 ? "--risk-consent"
    : pct >= 40 ? "--risk-sensitive"
    : pct >= 20 ? "--risk-low"
    : "--risk-shareable";
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm uppercase tracking-widest text-muted-foreground">Risk Score</span>
        <span className="text-3xl font-bold tabular-nums" style={{ color: `var(${colorVar})` }}>
          {pct}<span className="text-base text-muted-foreground">/100</span>
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, var(--risk-shareable), var(--risk-low), var(--risk-sensitive), var(--risk-consent), var(--risk-high))`,
            backgroundSize: `${10000 / Math.max(pct, 1)}% 100%`,
          }}
        />
        <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/10" />
      </div>
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground/70">
        <span>0</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100</span>
      </div>
    </div>
  );
}
