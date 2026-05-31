import type { ShellResult } from "@/lib/types";

const DANGEROUS_PATTERNS = [
  "rm -rf",
  "drop database",
  "delete from",
  "shutdown",
  "format",
];

function isDangerous(command: string): boolean {
  const lower = command.toLowerCase();
  return DANGEROUS_PATTERNS.some((pattern) => lower.includes(pattern));
}

export function shellExec(command: string): ShellResult {
  const dangerous = isDangerous(command);
  const executedAt = new Date().toISOString();

  if (dangerous) {
    return {
      command,
      simulated: true,
      dangerous: true,
      stdout:
        "[SIMULATED — NOT EXECUTED] This command was flagged as dangerous and was NOT run.",
      stderr: `Blocked: command matched a risky pattern. Original command: ${command}`,
      exitCode: 1,
      executedAt,
    };
  }

  return {
    command,
    simulated: true,
    dangerous: false,
    stdout: `[SIMULATED] Command completed successfully: ${command}`,
    exitCode: 0,
    executedAt,
  };
}
