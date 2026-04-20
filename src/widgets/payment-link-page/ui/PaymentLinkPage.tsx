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
            {
              label: "User clicks",
              details: {
                frontend: [
                  "PaymentLinkButton reads NEXT_PUBLIC_STRIPE_PAYMENT_LINK and renders anchor tag.",
                  "Click opens Stripe URL in a new tab.",
                ],
                backend: [
                  "No application backend endpoint is called in this flow.",
                ],
                keyItems: [
                  "src/features/payment-link-redirect/ui/PaymentLinkButton.tsx",
                  "env.stripePaymentLink",
                ],
              },
            },
            {
              label: "Redirected to Stripe page",
              details: {
                frontend: [
                  "Browser navigates directly to hosted Payment Link URL.",
                ],
                backend: [
                  "Application backend is not involved in redirection.",
                ],
                keyItems: [
                  "target=\"_blank\"",
                  "rel=\"noopener noreferrer\"",
                ],
              },
            },
            {
              label: "Card entered there",
              details: {
                frontend: [
                  "User enters payment details on Stripe-hosted form UI.",
                ],
                backend: [
                  "No app backend access to payment form fields.",
                ],
                keyItems: [
                  "Stripe Payment Link hosted checkout",
                ],
              },
            },
            {
              label: "Stripe handles everything",
              details: {
                frontend: [
                  "Client app waits outside Stripe flow and does not control payment state.",
                ],
                backend: [
                  "No local server logic required for charge creation in this demo path.",
                ],
                keyItems: [
                  "NEXT_PUBLIC_STRIPE_PAYMENT_LINK",
                ],
              },
            },
            {
              label: "Done",
              details: {
                frontend: [
                  "Result remains on Stripe-hosted completion state unless Stripe link settings define redirect.",
                ],
                backend: [
                  "Server layer in this demo path does not run.",
                ],
                keyItems: [
                  "Stripe dashboard payment link settings",
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
}
