import type { HttpDelivery } from "@/lib/types";

// In-memory log of all simulated HTTP POST deliveries.
// Phase 3 reads this to prove the unprotected agent leaked data.
const webhookDeliveries: HttpDelivery[] = [];

let deliveryCounter = 0;

export function httpPost(url: string, body: unknown): HttpDelivery {
  deliveryCounter += 1;
  const delivery: HttpDelivery = {
    id: `delivery_${String(deliveryCounter).padStart(4, "0")}`,
    url,
    body,
    deliveredAt: new Date().toISOString(),
    simulated: true,
  };
  webhookDeliveries.push(delivery);
  return delivery;
}

export function getWebhookDeliveries(): HttpDelivery[] {
  return [...webhookDeliveries];
}

export function clearWebhookDeliveries(): void {
  webhookDeliveries.length = 0;
}
