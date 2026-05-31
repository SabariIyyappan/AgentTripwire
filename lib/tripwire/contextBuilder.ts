import type { TripwireContext } from "@/lib/types";
import {
  detectSensitiveDataClasses,
  detectDestinationDomain,
  isExternalDestination,
  isApprovedDestination,
  detectDestructiveCommand,
} from "./detectors";

type ContextInput = {
  runId?: string;
  scenarioId?: string;
  toolName: string;
  toolArgs: Record<string, unknown>;
  source: "user" | "system" | "browser_content" | "tool_output" | "agent";
  userTask?: string;
  previousSteps?: string[];
  rawInput?: string;
};

export function buildTripwireContext(input: ContextInput): TripwireContext {
  const sourceTrust: "trusted" | "untrusted" =
    input.source === "browser_content" || input.source === "tool_output"
      ? "untrusted"
      : "trusted";

  const domain = detectDestinationDomain(input.toolName, input.toolArgs);
  const external = isExternalDestination(domain);
  const approved = domain ? isApprovedDestination(domain) : true;

  const combinedInput = { ...input.toolArgs, _rawInput: input.rawInput ?? "" };
  const dataClasses = detectSensitiveDataClasses(combinedInput);

  let isDestructive = false;
  if (input.toolName === "shell.exec" || input.toolName === "shellExec") {
    const command = input.toolArgs.command;
    if (typeof command === "string") {
      isDestructive = detectDestructiveCommand(command);
    }
  }

  return {
    runId: input.runId,
    scenarioId: input.scenarioId,
    toolName: input.toolName,
    toolArgs: input.toolArgs,
    source: input.source,
    sourceTrust,
    userTask: input.userTask,
    previousSteps: input.previousSteps,
    destinationDomain: domain,
    dataClasses,
    isExternalDestination: external,
    isApprovedDestination: approved,
    isDestructiveAction: isDestructive,
    rawInput: input.rawInput,
  };
}
