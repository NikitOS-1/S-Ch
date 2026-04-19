"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useCreateCheckoutSessionMutation } from "@/lib/features/payment/paymentApi";
import { getRtkQueryErrorMessage } from "@/lib/rtk-query-error";
import { ComplexityBadge } from "@/components/ui/complexity-badge";
import { InfoCard } from "@/components/ui/info-card";
import { StepFlow } from "@/components/ui/step-flow";

export default function CheckoutPage() {
  const [createCheckoutSession, { isLoading, error }] =
    useCreateCheckoutSessionMutation();

  const handleBuyNow = useCallback(async () => {
    try {
      const result = await createCheckoutSession().unwrap();
      if (result.url) {
        window.location.assign(result.url);
      }
    } catch {
      return;
    }
  }, [createCheckoutSession]);

  const errorMessage = error ? getRtkQueryErrorMessage(error) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Stripe Checkout</h1>
        <ComplexityBadge label="Complexity: Medium" />
      </div>

      <InfoCard>
        Your server creates a Checkout Session. User is redirected to Stripe, then
        returned to your site.
      </InfoCard>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-900">Pro Plan</p>
            <p className="text-2xl font-bold text-slate-900">$29.00</p>
            <p className="text-sm text-slate-500">One-time payment (test mode)</p>
          </div>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isLoading}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {isLoading ? "Starting checkout…" : "Buy Now"}
          </button>
        </div>
        {errorMessage ? (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {errorMessage}
          </p>
        ) : null}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Flow
        </h2>
        <StepFlow
          accent="blue"
          steps={[
            "Button click",
            "POST /api/checkout",
            "Stripe Session URL",
            "Redirect to Stripe",
            "Card input",
            "Stripe processes",
            "Redirect back",
            "Server verifies session_id",
            "Show status",
          ]}
        />
      </div>

      <p className="text-center text-sm text-slate-600">
        <Link href="/" className="font-medium text-blue-600 hover:underline">
          ← Back to overview
        </Link>
      </p>
    </div>
  );
}
