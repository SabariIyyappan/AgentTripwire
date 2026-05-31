import fs from "fs";
import path from "path";
import type { BrowserOpenResult, BrowserExtractResult } from "@/lib/types";

// Maps friendly names / fake URLs to the local HTML fixture.
const URL_ALIASES: Record<string, string> = {
  "https://acmevendor.example": "malicious_vendor.html",
  "http://acmevendor.example": "malicious_vendor.html",
  "acmevendor": "malicious_vendor.html",
  "acmevendor.example": "malicious_vendor.html",
  "malicious_vendor": "malicious_vendor.html",
  "malicious_vendor.html": "malicious_vendor.html",
  "data/malicious_vendor.html": "malicious_vendor.html",
};

function resolveFixturePath(urlOrPath: string): string | null {
  const key = urlOrPath.toLowerCase().trim();
  const filename = URL_ALIASES[key] ?? URL_ALIASES[path.basename(key)];
  if (!filename) return null;
  return path.join(process.cwd(), "data", filename);
}

function readFixture(urlOrPath: string): { filePath: string; html: string } {
  const filePath = resolveFixturePath(urlOrPath);
  if (!filePath) {
    throw new Error(`No local fixture registered for: ${urlOrPath}`);
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fixture file not found: ${filePath}`);
  }
  return { filePath, html: fs.readFileSync(filePath, "utf-8") };
}

function extractTitle(html: string): string {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return m ? m[1].trim() : "(no title)";
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function extractHiddenText(html: string): string {
  const parts: string[] = [];

  // 1. HTML comments
  const commentRe = /<!--([\s\S]*?)-->/g;
  let m: RegExpExecArray | null;
  while ((m = commentRe.exec(html)) !== null) {
    const t = m[1].trim();
    if (t) parts.push(t);
  }

  // 2. display:none elements (div)
  const dnRe = /<div[^>]+style="[^"]*display\s*:\s*none[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
  while ((m = dnRe.exec(html)) !== null) {
    const t = stripTags(m[1]).trim();
    if (t) parts.push(t);
  }

  // 3. visually-hidden spans
  const vhRe = /<span[^>]+class="[^"]*visually-hidden[^"]*"[^>]*>([\s\S]*?)<\/span>/gi;
  while ((m = vhRe.exec(html)) !== null) {
    const t = stripTags(m[1]).trim();
    if (t) parts.push(t);
  }

  return parts.filter(Boolean).join("\n\n");
}

function extractVisibleText(html: string): string {
  const clean = html
    // Remove head section
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    // Remove style blocks
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    // Remove script blocks
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, "")
    // Remove display:none divs
    .replace(/<div[^>]+style="[^"]*display\s*:\s*none[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    // Remove visually-hidden spans
    .replace(/<span[^>]+class="[^"]*visually-hidden[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "");

  return stripTags(clean);
}

export function browserOpen(urlOrPath: string): BrowserOpenResult {
  const { html } = readFixture(urlOrPath);
  return {
    url: urlOrPath,
    title: extractTitle(html),
    openedAt: new Date().toISOString(),
  };
}

export function browserExtractText(urlOrPath: string): BrowserExtractResult {
  const { html } = readFixture(urlOrPath);
  const title = extractTitle(html);
  const visibleText = extractVisibleText(html);
  const hiddenText = extractHiddenText(html);
  const fullText = `${visibleText}\n\n[HIDDEN CONTENT DETECTED]\n${hiddenText}`;

  return {
    url: urlOrPath,
    title,
    visibleText,
    hiddenText,
    fullText,
    extractedAt: new Date().toISOString(),
  };
}
