import type { Run, SafetyReport } from "@/lib/types";

// Module-level singletons act as the in-memory database for this phase.
// Replace with a real DB adapter in a later phase without changing callers.

const runs = new Map<string, Run>();
const reports = new Map<string, SafetyReport>();

// ─── Runs ─────────────────────────────────────────────────────────────────────

export function getRun(id: string): Run | undefined {
  return runs.get(id);
}

export function listRuns(): Run[] {
  return Array.from(runs.values()).sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}

export function upsertRun(run: Run): void {
  runs.set(run.id, run);
}

export function deleteRun(id: string): boolean {
  return runs.delete(id);
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export function getReport(id: string): SafetyReport | undefined {
  return reports.get(id);
}

export function listReports(): SafetyReport[] {
  return Array.from(reports.values()).sort(
    (a, b) =>
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );
}

export function upsertReport(report: SafetyReport): void {
  reports.set(report.id, report);
}

// ─── Seed helpers (used in tests / dev fixtures) ──────────────────────────────

export function seedRun(run: Run): void {
  upsertRun(run);
}

export function seedReport(report: SafetyReport): void {
  upsertReport(report);
}

export function clearAll(): void {
  runs.clear();
  reports.clear();
}
