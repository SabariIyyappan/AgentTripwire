import fs from "fs";
import path from "path";
import type { CrmCustomer } from "@/lib/types";

// Load seed data once at module initialisation. The in-memory store is
// mutated by crmUpdateCustomer; the JSON file on disk is never touched.
function loadSeedData(): Map<string, CrmCustomer> {
  const filePath = path.join(process.cwd(), "data", "mock_crm.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw) as { customers: CrmCustomer[] };
  const store = new Map<string, CrmCustomer>();
  for (const customer of parsed.customers) {
    store.set(customer.id, { ...customer });
  }
  return store;
}

let crmStore: Map<string, CrmCustomer> = loadSeedData();

export function crmReadCustomer(customerId: string): CrmCustomer {
  const customer = crmStore.get(customerId);
  if (!customer) {
    throw new Error(`CRM customer not found: ${customerId}`);
  }
  return { ...customer };
}

export function crmListCustomers(): CrmCustomer[] {
  return Array.from(crmStore.values()).map((c) => ({ ...c }));
}

export function crmUpdateCustomer(
  customerId: string,
  updates: { notes?: string; [key: string]: unknown }
): CrmCustomer {
  const customer = crmStore.get(customerId);
  if (!customer) {
    throw new Error(`CRM customer not found: ${customerId}`);
  }
  const updated: CrmCustomer = { ...customer, ...updates, id: customer.id };
  crmStore.set(customerId, updated);
  return { ...updated };
}

// Resets the in-memory store to the original seed data. Useful for tests.
export function resetCrmStore(): void {
  crmStore = loadSeedData();
}
