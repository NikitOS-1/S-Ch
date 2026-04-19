import Link from "next/link";
import { StripeElementsForm } from "@/features/stripe-elements-form";
import { Badge, FlowDiagram, InfoCard } from "@/shared/ui";

export function ElementsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Stripe Elements</h1>
        <Badge label="Complexity: Advanced" />
      </div>

      <InfoCard>
        Card form lives on your site. Card data goes directly to Stripe servers — your backend
        never sees it.
      </InfoCard>

      <StripeElementsForm />

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Flow
        </h2>
        <FlowDiagram
          accent="blue"
          steps={[
            "Page loads",
            "POST /api/payment-intent",
            "Stripe creates PaymentIntent",
            "clientSecret returned",
            "Elements renders card form",
            "User submits",
            "Card data goes directly to Stripe",
            "Status returned to frontend",
            "Show result inline",
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
