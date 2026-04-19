import Link from "next/link";
import { CheckoutButton } from "@/features/checkout-redirect";
import { demoProPlanProduct, ProductCard } from "@/entities/product";
import { Badge, FlowDiagram, InfoCard } from "@/shared/ui";

export function CheckoutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Stripe Checkout</h1>
        <Badge label="Complexity: Medium" />
      </div>

      <InfoCard>
        Your server creates a Checkout Session. User is redirected to Stripe, then returned to
        your site.
      </InfoCard>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <ProductCard product={demoProPlanProduct} />
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
            <CheckoutButton />
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Flow
        </h2>
        <FlowDiagram
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
