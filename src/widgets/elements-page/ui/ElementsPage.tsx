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
            {
              label: "Page loads",
              details: {
                frontend: [
                  "StripeElementsForm initializes local form state for mode, price, and quantity.",
                  "No order is created automatically until user clicks Create order.",
                ],
                backend: [
                  "No backend request on initial page render.",
                ],
                keyItems: [
                  "src/features/stripe-elements-form/ui/StripeElementsForm.tsx",
                  "activeOrderKey state",
                ],
              },
            },
            {
              label: "POST /api/payment-intent",
              details: {
                frontend: [
                  "Create order triggers RTK Query mutation with mode, amountCents, quantity, and productName.",
                ],
                backend: [
                  "route.ts validates request payload and forwards to createPaymentIntent(params).",
                ],
                keyItems: [
                  "src/features/stripe-elements-form/api/paymentIntentApi.ts",
                  "src/app/api/payment-intent/route.ts",
                  "parseCreatePaymentIntentRequest()",
                ],
              },
            },
            {
              label: "Stripe creates PaymentIntent",
              details: {
                frontend: [
                  "Frontend does not call Stripe secret APIs directly.",
                ],
                backend: [
                  "payment mode uses stripe.paymentIntents.create.",
                  "subscription mode creates product, price, customer, and subscription before taking confirmation_secret client_secret.",
                ],
                keyItems: [
                  "src/features/stripe-elements-form/api/paymentIntentService.ts",
                  "createOneTimePaymentIntent()",
                  "createSubscriptionPaymentIntent()",
                ],
              },
            },
            {
              label: "clientSecret returned",
              details: {
                frontend: [
                  "Mutation result stores clientSecret in component state managed by RTK Query.",
                  "Form checks activeOrderKey to ensure secret matches current draft order inputs.",
                ],
                backend: [
                  "API returns only safe clientSecret response object.",
                ],
                keyItems: [
                  "CreatePaymentIntentResponse",
                  "hasActiveOrder",
                ],
              },
            },
            {
              label: "Elements renders card form",
              details: {
                frontend: [
                  "ElementsProvider mounts Stripe <Elements> with clientSecret.",
                  "PaymentElement UI appears only when active order exists.",
                ],
                backend: [
                  "No additional backend call required for rendering.",
                ],
                keyItems: [
                  "src/features/stripe-elements-form/ui/ElementsProvider.tsx",
                  "PaymentElement",
                ],
              },
            },
            {
              label: "User submits",
              details: {
                frontend: [
                  "handleSubmit calls stripe.confirmPayment with return_url and redirect if required.",
                ],
                backend: [
                  "No app backend call at confirm step for card data.",
                ],
                keyItems: [
                  "stripe.confirmPayment()",
                  "handleSubmit()",
                ],
              },
            },
            {
              label: "Card data goes directly to Stripe",
              details: {
                frontend: [
                  "PaymentElement tokenizes and sends card data directly to Stripe infrastructure.",
                ],
                backend: [
                  "Application backend never receives raw card number, CVC, or expiry fields.",
                ],
                keyItems: [
                  "PaymentElement",
                  "@stripe/react-stripe-js",
                ],
              },
            },
            {
              label: "Status returned to frontend",
              details: {
                frontend: [
                  "Success and failure states are mapped into elementsSlice.",
                  "3DS redirect return is handled by stripe.retrievePaymentIntent and URL param parsing.",
                ],
                backend: [
                  "No app backend session lookup required for inline status.",
                ],
                keyItems: [
                  "elementsSlice",
                  "setElementsSuccess()",
                  "setElementsFailure()",
                  "stripe.retrievePaymentIntent()",
                ],
              },
            },
            {
              label: "Show result inline",
              details: {
                frontend: [
                  "ElementsSuccessReceipt and error alert are rendered inside form container.",
                ],
                backend: [
                  "UI consumes already resolved payment status data from Stripe SDK results.",
                ],
                keyItems: [
                  "src/features/stripe-elements-form/ui/ElementsSuccessReceipt.tsx",
                  "elementsOutcome",
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
