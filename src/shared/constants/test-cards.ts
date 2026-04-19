export type TestCardAccent = "success" | "brand" | "warning" | "danger" | "action";

export interface TestCardPreset {
  label: string;
  number: string;
  outcome: string;
  accent: TestCardAccent;
}

export const TEST_CARD_PRESETS: readonly TestCardPreset[] = [
  {
    label: "Visa — success",
    number: "4242 4242 4242 4242",
    outcome: "Payment succeeds",
    accent: "success",
  },
  {
    label: "Mastercard — success",
    number: "5555 5555 5555 4444",
    outcome: "Payment succeeds",
    accent: "success",
  },
  {
    label: "American Express — success",
    number: "3782 822463 10005",
    outcome: "Payment succeeds (use any CVC)",
    accent: "brand",
  },
  {
    label: "Insufficient funds",
    number: "4000 0000 0000 9995",
    outcome: "Declined: insufficient funds",
    accent: "warning",
  },
  {
    label: "Expired card",
    number: "4000 0000 0000 0069",
    outcome: "Declined: expired card",
    accent: "warning",
  },
  {
    label: "3D Secure",
    number: "4000 0027 6000 3184",
    outcome: "Authentication step (redirect or modal)",
    accent: "action",
  },
] as const;
