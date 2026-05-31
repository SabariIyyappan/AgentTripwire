import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type GlassCardProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  glow?: boolean;
};

export function GlassCard({ children, className, glow, ...rest }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative rounded-2xl p-6",
        glow ? "glass-strong" : "glass",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SectionBlock({
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto w-full max-w-6xl px-6 py-20", className)}>
      {(eyebrow || title || subtitle) && (
        <div className="mx-auto mb-12 max-w-3xl text-center">
          {eyebrow && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-[color:var(--neon-cyan)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--neon-cyan)] shadow-[0_0_8px_currentColor]" />
              {eyebrow}
            </div>
          )}
          {title && (
            <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-4 text-balance text-base text-muted-foreground md:text-lg">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
