import policies from "@/data/policies.json";

function flattenToString(input: unknown): string {
  if (input === null || input === undefined) return "";
  if (typeof input === "string") return input;
  if (typeof input === "number" || typeof input === "boolean") return String(input);
  return JSON.stringify(input);
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const API_KEY_REGEX = /sk-[a-zA-Z0-9\-_]{8,}/g;
const SECRET_FIELD_KEYWORDS = ["apiKey", "api_key", "secret", "token", "password", "apikey"];

export function detectEmails(input: unknown): string[] {
  const text = flattenToString(input);
  return [...new Set(text.match(EMAIL_REGEX) ?? [])];
}

export function detectApiKeys(input: unknown): string[] {
  const text = flattenToString(input);
  const found: string[] = [...(text.match(API_KEY_REGEX) ?? [])];

  if (typeof input === "object" && input !== null && !Array.isArray(input)) {
    for (const key of Object.keys(input as Record<string, unknown>)) {
      if (SECRET_FIELD_KEYWORDS.some((k) => key.toLowerCase().includes(k.toLowerCase()))) {
        const val = (input as Record<string, unknown>)[key];
        if (typeof val === "string" && val.length > 4) {
          found.push(val);
        }
      }
    }
  }

  return [...new Set(found)];
}

export function detectTokensOrSecrets(input: unknown): string[] {
  return detectApiKeys(input);
}

export function detectSensitiveDataClasses(input: unknown): string[] {
  const classes: string[] = [];
  const text = flattenToString(input);
  const lower = text.toLowerCase();

  if (detectEmails(input).length > 0) classes.push("email");
  if (detectApiKeys(input).length > 0) classes.push("api_key");
  if (lower.includes("token") || lower.includes("bearer")) classes.push("token");
  if (lower.includes("password") || lower.includes("passwd")) classes.push("password");
  if (lower.includes("private") || lower.includes("confidential")) classes.push("private_note");
  if (lower.includes("customer") || /cust_\d+/.test(lower)) classes.push("customer_record");

  return [...new Set(classes)].filter((c) =>
    (policies.sensitiveDataClasses as string[]).includes(c)
  );
}

export function detectDestinationDomain(
  toolName: string,
  toolArgs: Record<string, unknown>
): string | undefined {
  const isUrlTool =
    toolName === "http.post" ||
    toolName === "httpPost" ||
    toolName === "browser.open" ||
    toolName === "browserOpen" ||
    toolName === "browser.extractText" ||
    toolName === "browserExtractText";

  if (!isUrlTool) return undefined;

  const url = toolArgs.url;
  if (typeof url !== "string") return undefined;

  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
}

export function isExternalDestination(domain: string | undefined): boolean {
  if (!domain) return false;
  const internalSuffixes = [".local", "localhost", "127.0.0.1"];
  return !internalSuffixes.some((s) => domain === s || domain.endsWith(s));
}

export function isApprovedDestination(domain: string | undefined): boolean {
  if (!domain) return false;
  return (policies.approvedDomains as string[]).includes(domain);
}

export function detectDestructiveCommand(command: string): boolean {
  const lower = command.toLowerCase();
  return (policies.riskyShellPatterns as string[]).some((p) => lower.includes(p.toLowerCase()));
}

export function detectRiskyShellPatterns(command: string): string[] {
  const lower = command.toLowerCase();
  return (policies.riskyShellPatterns as string[]).filter((p) =>
    lower.includes(p.toLowerCase())
  );
}
