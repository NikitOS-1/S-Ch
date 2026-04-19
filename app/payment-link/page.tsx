import Link from "next/link";
import { ComplexityBadge } from "@/components/ui/complexity-badge";
import { InfoCard } from "@/components/ui/info-card";
import { StepFlow } from "@/components/ui/step-flow";

export default function PaymentLinkPage() {
  const paymentLinkUrl = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Payment Link</h1>
        <ComplexityBadge label="Complexity: Minimal" />
      </div>

      <InfoCard>
        No backend needed. Stripe hosts the payment page entirely.
      </InfoCard>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {paymentLinkUrl ? (
          <a
            href={paymentLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white shadow transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto"
          >
            Open Stripe Payment Link
          </a>
        ) : (
          <p className="text-sm text-red-600">
            Missing <code className="rounded bg-red-50 px-1">NEXT_PUBLIC_STRIPE_PAYMENT_LINK</code>{" "}
            in environment.
          </p>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Flow
        </h2>
        <StepFlow
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
