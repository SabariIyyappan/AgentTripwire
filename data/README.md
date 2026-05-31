# data/

This directory holds static fixture data used for development, seeding, and testing.

## What goes here

| File / folder | Purpose |
|---|---|
| `fixtures/runs/` | Pre-built `Run` JSON objects for dev seeding |
| `fixtures/reports/` | Pre-built `SafetyReport` JSON objects |
| `scenarios/` | Extended attack scenario definitions (if moved out of `lib/`) |

## Phase 1 status

No fixture files are written yet. The in-memory store (`lib/storage/memory.ts`) exposes `seedRun` and `seedReport` helpers — call them from a future seed script to populate the store on server start.
