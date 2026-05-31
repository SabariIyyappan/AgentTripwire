import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, KeyRound, Bug, Eye, Brain, FileSearch, ShieldCheck, ArrowRight, Zap, Plug, Network } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { GlassCard, SectionBlock } from "@/components/GlassCard";
import { Hero3DScene } from "@/components/Hero3DScene";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgentTripwire — Stop Unsafe AI Agent Actions Before They Execute" },
      { name: "description", content: "Runtime firewall for AI agents. Intercept browser, API, CRM, shell, email, and wallet tool calls. Block prompt injection and data exfiltration." },
    ],
  }),
  component: Home,
});

const RISKS = [
  { label: "Shareable", range: "0–19", color: "var(--risk-shareable)", meaning: "Public or non-sensitive data.", example: "Public vendor pricing summary." },
  { label: "Low Sensitive", range: "20–39", color: "var(--risk-low)", meaning: "Mild internal context, no PII.", example: "General internal workflow name." },
  { label: "Sensitive", range: "40–59", color: "var(--risk-sensitive)", meaning: "Personal, business, or customer data.", example: "Customer email or CRM note." },
  { label: "Requires Consent", range: "60–79", color: "var(--risk-consent)", meaning: "User approval required to proceed.", example: "Sending customer details to a third-party tool." },
  { label: "High Risk", range: "80–100", color: "var(--risk-high)", meaning: "Secrets, destructive commands, suspicious destination.", example: "API key, rm -rf, attacker webhook." },
];

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center justify-center px-6 pt-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-[color:var(--neon-cyan)]"
        >
          <Shield className="h-3.5 w-3.5" />
          Runtime Safety Layer for Autonomous AI Agents
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
        >
          Stop Unsafe AI Agent Actions{" "}
          <span className="text-gradient">Before They Execute</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-5 text-sm uppercase tracking-[0.3em] text-[color:var(--neon-cyan)]"
        >
          Prompt Injection · Data Exfiltration · Destructive Tool Calls
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 max-w-2xl text-balance text-base text-muted-foreground md:text-lg"
        >
          AgentTripwire intercepts browser, API, CRM, database, shell, email, webhook, and wallet
          actions before your AI agent can leak data, run destructive commands, or contact
          untrusted destinations.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/demo" className="inline-flex items-center gap-2 rounded-xl bg-gradient-glow px-5 py-3 text-sm font-medium text-[color:var(--primary-foreground)] ring-glow">
            <Zap className="h-4 w-4" /> Run Live Demo
          </Link>
          <Link to="/demo" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium hover:bg-white/10">
            <Plug className="h-4 w-4" /> Try Real Testing
          </Link>
          <Link to="/reports" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
            View Reports <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-14 w-full">
          <Hero3DScene />
        </div>
      </section>

      {/* PROBLEM */}
      <SectionBlock
        eyebrow="The threat"
        title="AI agents can now act. That makes prompt injection dangerous."
        subtitle="Once an agent can call tools, every untrusted input becomes a potential command."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Bug, title: "Hidden instructions", body: "Malicious websites can hide instructions inside page content the agent reads." },
            { icon: AlertTriangle, title: "Smuggled URLs", body: "Tool outputs can smuggle attacker URLs back into the agent's context." },
            { icon: KeyRound, title: "Leaked secrets", body: "Agents can leak API keys, tokens, and customer data via outbound requests." },
            { icon: Network, title: "Destructive calls", body: "Agents can run destructive shell, DB, or wallet commands at machine speed." },
          ].map((c) => (
            <GlassCard key={c.title}>
              <c.icon className="h-6 w-6 text-[color:var(--risk-high)]" />
              <h3 className="mt-3 text-lg font-medium">{c.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.body}</p>
            </GlassCard>
          ))}
        </div>
      </SectionBlock>

      {/* SOLUTION */}
      <SectionBlock
        eyebrow="The defense"
        title="AgentTripwire protects the moment before action."
        subtitle="Every proposed tool call is intercepted, classified, and judged in real time."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Eye, t: "Intercept", d: "Proposed tool call captured before any side-effect." },
            { icon: Brain, t: "Context", d: "Build full security context: source, destination, action." },
            { icon: FileSearch, t: "Classify", d: "Detect secrets, PII, destructive intent; score risk 0–100." },
            { icon: ShieldCheck, t: "Decide", d: "Allow, warn, consent, rewrite, or block — with reasons." },
          ].map((c, i) => (
            <GlassCard key={c.t}>
              <div className="flex items-center justify-between">
                <c.icon className="h-6 w-6 text-[color:var(--neon-cyan)]" />
                <span className="text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-3 text-lg font-medium">{c.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.d}</p>
            </GlassCard>
          ))}
        </div>
      </SectionBlock>

      {/* RISK LEVELS */}
      <SectionBlock
        eyebrow="Risk engine"
        title="Five risk levels. One clean decision."
        subtitle="AgentTripwire scores every tool call from 0 to 100 and applies a policy decision."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {RISKS.map((r) => (
            <GlassCard key={r.label} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: `var(${r.color.replace('var(', '').replace(')', '')})`, boxShadow: `0 0 12px var(${r.color.replace('var(', '').replace(')', '')})` }} />
                <span className="font-mono text-xs text-muted-foreground">{r.range}</span>
              </div>
              <div>
                <div className="text-base font-semibold" style={{ color: `var(${r.color.replace('var(', '').replace(')', '')})` }}>{r.label}</div>
                <p className="mt-1 text-xs text-muted-foreground">{r.meaning}</p>
              </div>
              <div className="mt-auto rounded-md border border-white/5 bg-white/[0.03] p-2 text-xs text-muted-foreground">
                <span className="text-foreground/70">Example: </span>{r.example}
              </div>
            </GlassCard>
          ))}
        </div>
      </SectionBlock>

      {/* CTA */}
      <SectionBlock>
        <GlassCard glow className="mx-auto max-w-3xl text-center">
          <h3 className="text-2xl font-semibold md:text-3xl">
            Connect your AI agent and test unsafe tool calls in real time.
          </h3>
          <p className="mt-3 text-muted-foreground">
            Bring ChatGPT, Claude, Gemini, or a custom agent into the Real Testing Lab.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/demo" className="inline-flex items-center gap-2 rounded-xl bg-gradient-glow px-5 py-3 text-sm font-medium text-[color:var(--primary-foreground)] ring-glow">
              <Plug className="h-4 w-4" /> Connect Agent
            </Link>
            <Link to="/demo" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium hover:bg-white/10">
              <Zap className="h-4 w-4" /> Run Live Demo
            </Link>
          </div>
        </GlassCard>
      </SectionBlock>
    </SiteLayout>
  );
}
