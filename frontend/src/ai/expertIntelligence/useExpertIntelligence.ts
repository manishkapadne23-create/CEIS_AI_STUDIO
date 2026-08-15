import { useMemo } from "react";
import type { EngineeringExpertRuntimeContext } from "../contextEngine";
import { resolveExpertRuntimeContext } from "../contextEngine";
import type { EngineeringExpertContextInput } from "../contextEngine";
import { resolveDisciplineExpertIntelligence } from "./resolveDisciplineExpertIntelligence";

export const useExpertIntelligence = (
  input: EngineeringExpertContextInput,
  userMessage = ""
) => {
  const runtimeContext = useMemo(
    () => resolveExpertRuntimeContext(input),
    [input]
  );

  const intelligence = useMemo(
    () => resolveDisciplineExpertIntelligence(runtimeContext, userMessage),
    [runtimeContext, userMessage]
  );

  return {
    runtimeContext,
    intelligence,
  };
};

export const resolveExpertIntelligenceFromRuntime = (
  runtimeContext: EngineeringExpertRuntimeContext,
  userMessage = ""
) => resolveDisciplineExpertIntelligence(runtimeContext, userMessage);
