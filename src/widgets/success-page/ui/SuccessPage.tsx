import Link from "next/link";
import { retrieveCheckoutSessionDisplay } from "@/features/checkout-redirect/server";
import { PaymentStatusCard } from "@/features/payment-status";
import { Badge, FlowDiagram, InfoCard } from "@/shared/ui";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export async function SuccessPage({ searchParams }: SuccessPageProps) {
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
    const display = await retrieveCheckoutSessionDisplay(sessionId);

    return (
      <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Checkout complete</h1>
          <Badge label="Complexity: Medium" />
        </div>

        <InfoCard>
          Session verified on the server using{" "}
          <code className="rounded bg-blue-100 px-1 text-blue-950">
            stripe.checkout.sessions.retrieve
          </code>
          .
        </InfoCard>

        <PaymentStatusCard display={display} />

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Flow
          </h2>
          <FlowDiagram
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
