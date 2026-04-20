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
                codeExamples: [
                  {
                    title: "Client mutation request",
                    language: "ts",
                    code: "const result = await createPaymentIntent({\n  mode,\n  productName,\n  amountCents,\n  quantity,\n}).unwrap();",
                    explanation:
                      "The frontend sends explicit order parameters and waits for clientSecret.",
                  },
                  {
                    title: "API route validation handoff",
                    language: "ts",
                    code: "const payload = (await request.json()) as unknown;\nconst params = parseCreatePaymentIntentRequest(payload);\nconst clientSecret = await createPaymentIntent(params);\nreturn NextResponse.json({ clientSecret });",
                    explanation:
                      "Request payload is validated before the Stripe service layer is invoked.",
                  },
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
                codeExamples: [
                  {
                    title: "One-time mode (PaymentIntent)",
                    language: "ts",
                    code: "const paymentIntent = await stripe.paymentIntents.create({\n  amount: totalAmountCents,\n  currency: \"usd\",\n  automatic_payment_methods: { enabled: true },\n});",
                    explanation:
                      "One-time flow uses a direct PaymentIntent with automatic payment methods.",
                  },
                  {
                    title: "Subscription mode (invoice secret)",
                    language: "ts",
                    code: "const subscription = await stripe.subscriptions.create({\n  customer: customer.id,\n  payment_behavior: \"default_incomplete\",\n  items: [{ price: price.id, quantity: normalizedQuantity }],\n  expand: [\"latest_invoice.confirmation_secret\"],\n});\nconst clientSecret = subscription.latest_invoice?.confirmation_secret?.client_secret;",
                    explanation:
                      "Subscription flow takes client secret from invoice confirmation_secret.",
                  },
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
                codeExamples: [
                  {
                    title: "Confirm payment on client",
                    language: "ts",
                    code: "const confirmResult = await stripe.confirmPayment({\n  elements,\n  confirmParams: {\n    return_url: `${appUrl}/elements`,\n  },\n  redirect: \"if_required\",\n});",
                    explanation:
                      "Stripe.js performs confirmation in browser and handles redirect-required flows.",
                  },
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
