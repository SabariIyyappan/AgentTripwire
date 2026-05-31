import { motion } from "framer-motion";

/**
 * Full-screen animated cyber background.
 * Pure SVG + CSS (no three.js dependency) to keep the bundle lean while
 * still feeling like a 3D command center.
 */
export function Agent3DBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* radial gradient wash */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      {/* grid floor */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.78 0.18 220 / 0.35) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.18 220 / 0.35) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      {/* floating orbs */}
      <motion.div
        className="absolute -left-32 top-1/4 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "oklch(0.55 0.22 280 / 0.45)" }}
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-2/3 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "oklch(0.55 0.22 200 / 0.40)" }}
        animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "oklch(0.45 0.20 240 / 0.18)" }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* center shield rings */}
      <svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        width="700"
        height="700"
        viewBox="0 0 700 700"
        fill="none"
      >
        {[260, 200, 140].map((r, i) => (
          <circle
            key={r}
            cx="350"
            cy="350"
            r={r}
            stroke="oklch(0.78 0.18 220 / 0.18)"
            strokeWidth="1"
            strokeDasharray={i === 0 ? "4 8" : i === 1 ? "8 12" : "2 6"}
            className="origin-center animate-spin-slow"
            style={{ animationDuration: `${30 + i * 20}s`, animationDirection: i % 2 ? "reverse" : "normal" }}
          />
        ))}
      </svg>

      {/* particle dots */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            background:
              i % 3 === 0
                ? "oklch(0.85 0.18 200)"
                : i % 3 === 1
                  ? "oklch(0.70 0.25 300)"
                  : "oklch(0.82 0.22 150)",
            boxShadow: "0 0 8px currentColor",
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 3 + (i % 5),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, oklch(0.08 0.04 265 / 0.85) 100%)",
        }}
      />
    </div>
  );
}
