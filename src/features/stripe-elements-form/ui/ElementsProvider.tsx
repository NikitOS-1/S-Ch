"use client";

import { Elements } from "@stripe/react-stripe-js";
import type { Stripe } from "@stripe/stripe-js";

interface ElementsProviderProps {
  stripe: Promise<Stripe | null> | null;
  clientSecret: string;
  children: React.ReactNode;
}

export function ElementsProvider({ stripe, clientSecret, children }: ElementsProviderProps) {
  if (!stripe) {
    return null;
  }

  return (
    <Elements
      stripe={stripe}
      options={{
        clientSecret,
        appearance: { theme: "stripe" },
      }}
    >
      {children}
    </Elements>
  );
}
