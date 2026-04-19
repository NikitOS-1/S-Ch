import Link from "next/link";
import { getStripeServer } from "@/lib/stripe-server";
import { ComplexityBadge } from "@/components/ui/complexity-badge";
import { InfoCard } from "@/components/ui/info-card";
import { StepFlow } from "@/components/ui/step-flow";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const resolved = await searchParams;
  const sessionId = resolved.session_id;

  if (!sessionId) {
    return (
      <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Payment result</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          Missing <code className="rounded bg-red-100 px-1">session_id</code> in the URL.
          Complete a Checkout flow first.
        </div>
        <p className="text-center text-sm text-slate-600">
          <Link href="/checkout" className="font-medium text-blue-600 hover:underline">
            Go to Checkout demo
          </Link>
        </p>
      </div>
    );
  }

  try {
    const stripe = getStripeServer();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const email = session.customer_details?.email ?? "—";
    const amountCents = session.amount_total ?? 0;
    const currencyCode = (session.currency ?? "usd").toUpperCase();
    const displayAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amountCents / 100);

    const paymentLabel = session.payment_status === "paid" ? "paid" : "unpaid";

    return (
      <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Checkout complete</h1>
          <ComplexityBadge label="Complexity: Medium" />
        </div>

        <InfoCard>
          Session verified on the server using{" "}
          <code className="rounded bg-blue-100 px-1 text-blue-950">
            stripe.checkout.sessions.retrieve
          </code>
          .
        </InfoCard>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <dt className="font-medium text-slate-600">Payment status</dt>
              <dd
                className={
                  paymentLabel === "paid"
                    ? "font-semibold text-green-700"
                    : "font-semibold text-red-700"
                }
              >
                {paymentLabel}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <dt className="font-medium text-slate-600">Customer email</dt>
              <dd className="text-right text-slate-900">{email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-medium text-slate-600">Amount</dt>
              <dd className="font-semibold text-slate-900">{displayAmount}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Flow
          </h2>
          <StepFlow
            accent="green"
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
  } catch {
    return (
      <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Payment result</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          Could not load this Checkout session. The link may be invalid or expired.
        </div>
        <p className="text-center text-sm text-slate-600">
          <Link href="/checkout" className="font-medium text-blue-600 hover:underline">
            Try Checkout again
          </Link>
        </p>
      </div>
    );
  }
}
