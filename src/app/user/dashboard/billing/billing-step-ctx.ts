import { createContext } from "react";

export const BillingStepCtx = createContext<{
  step: "choose" | "pay";
  setStep: (s: "choose" | "pay") => void;
}>({ step: "choose", setStep: () => {} });
