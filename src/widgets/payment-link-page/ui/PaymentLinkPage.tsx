import Link from "next/link";
import { PaymentLinkButton } from "@/features/payment-link-redirect";
import { Badge, FlowDiagram, InfoCard } from "@/shared/ui";

export function PaymentLinkPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Payment Link</h1>
        <Badge label="Complexity: Minimal" />
      </div>

      <InfoCard>
        No backend needed. Stripe hosts the payment page entirely.
      </InfoCard>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <PaymentLinkButton />
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Flow
        </h2>
        <FlowDiagram
          accent="blue"
          steps={[
            "User clicks",
            "Redirected to Stripe page",
            "Card entered there",
            "Stripe handles everything",
            "Done",
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
