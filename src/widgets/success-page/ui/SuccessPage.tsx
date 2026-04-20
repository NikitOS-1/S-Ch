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
              {
                label: "Button click",
                details: {
                  frontend: [
                    "CheckoutButton sends payload prepared from mode, product name, amount, and quantity inputs.",
                  ],
                  backend: [
                    "Server is idle until API request reaches /api/checkout.",
                  ],
                  keyItems: [
                    "src/features/checkout-redirect/ui/CheckoutButton.tsx",
                    "handleBuyNow()",
                  ],
                },
              },
              {
                label: "POST /api/checkout",
                details: {
                  frontend: [
                    "RTK Query mutation performs POST request and awaits checkout URL.",
                  ],
                  backend: [
                    "route.ts validates payload and calls createCheckoutSession(params).",
                  ],
                  keyItems: [
                    "src/app/api/checkout/route.ts",
                    "parseCreateCheckoutSessionRequest()",
                  ],
                },
              },
              {
                label: "Stripe Session URL",
                details: {
                  frontend: [
                    "Frontend receives opaque Stripe session URL from API response.",
                  ],
                  backend: [
                    "checkoutService creates session with success_url and cancel_url from app base URL.",
                  ],
                  keyItems: [
                    "src/features/checkout-redirect/api/checkoutService.ts",
                    "stripe.checkout.sessions.create()",
                  ],
                },
              },
              {
                label: "Redirect to Stripe",
                details: {
                  frontend: [
                    "Browser navigates to hosted checkout using window.location.assign().",
                  ],
                  backend: [
                    "No additional backend call required after URL handoff.",
                  ],
                  keyItems: [
                    "window.location.assign()",
                  ],
                },
              },
              {
                label: "Card input",
                details: {
                  frontend: [
                    "Card entry happens in Stripe-hosted form, not inside app components.",
                  ],
                  backend: [
                    "No app backend receives card details.",
                  ],
                  keyItems: [
                    "Stripe Checkout hosted page",
                  ],
                },
              },
              {
                label: "Stripe processes",
                details: {
                  frontend: [
                    "User remains on Stripe page while payment is confirmed.",
                  ],
                  backend: [
                    "Stripe executes authorization and payment status transitions.",
                  ],
                  keyItems: [
                    "Stripe Checkout session lifecycle",
                  ],
                },
              },
              {
                label: "Redirect back",
                details: {
                  frontend: [
                    "User is redirected to /success with session_id query parameter.",
                  ],
                  backend: [
                    "Configured success_url determines callback target.",
                  ],
                  keyItems: [
                    "/success?session_id={CHECKOUT_SESSION_ID}",
                  ],
                },
              },
              {
                label: "Server verifies session_id",
                details: {
                  frontend: [
                    "SuccessPage server component reads session_id from searchParams.",
                  ],
                  backend: [
                    "retrieveCheckoutSessionDisplay retrieves session from Stripe API and normalizes display fields.",
                  ],
                  keyItems: [
                    "src/features/checkout-redirect/api/checkoutSessionService.ts",
                    "retrieveCheckoutSessionDisplay()",
                  ],
                },
              },
              {
                label: "Show status",
                details: {
                  frontend: [
                    "PaymentStatusCard renders final state using normalized server data.",
                  ],
                  backend: [
                    "Server sends only safe display model to UI.",
                  ],
                  keyItems: [
                    "src/features/payment-status/ui/PaymentStatusCard.tsx",
                    "CheckoutSessionDisplay",
                  ],
                },
              },
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
