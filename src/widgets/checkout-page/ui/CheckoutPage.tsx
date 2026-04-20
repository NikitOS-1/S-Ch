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
            {
              label: "Button click",
              details: {
                frontend: [
                  "CheckoutButton collects mode, productName, amountDollars, and quantity from form state.",
                  "UI converts dollars to cents before request payload is sent.",
                ],
                backend: [
                  "No backend call happens before the click event.",
                ],
                keyItems: [
                  "src/features/checkout-redirect/ui/CheckoutButton.tsx",
                  "handleBuyNow()",
                  "parseDollarInputToCents()",
                ],
              },
            },
            {
              label: "POST /api/checkout",
              details: {
                frontend: [
                  "RTK Query mutation useCreateCheckoutSessionMutation sends POST to checkout endpoint.",
                ],
                backend: [
                  "route.ts validates mode, amountCents, quantity, and productName.",
                  "Validated payload is passed into createCheckoutSession(params).",
                ],
                keyItems: [
                  "src/features/checkout-redirect/api/checkoutApi.ts",
                  "src/app/api/checkout/route.ts",
                  "parseCreateCheckoutSessionRequest()",
                ],
                codeExamples: [
                  {
                    title: "Checkout API request payload",
                    language: "ts",
                    code: "const result = await createCheckoutSession({\n  mode,\n  productName,\n  amountCents,\n  quantity,\n}).unwrap();",
                    explanation:
                      "Frontend sends normalized checkout payload and receives redirect URL.",
                  },
                  {
                    title: "Server request parsing",
                    language: "ts",
                    code: "const payload = (await request.json()) as unknown;\nconst params = parseCreateCheckoutSessionRequest(payload);\nconst url = await createCheckoutSession(params);\nreturn NextResponse.json({ url });",
                    explanation:
                      "The route layer validates and forwards only trusted data to Stripe service.",
                  },
                ],
              },
            },
            {
              label: "Stripe Session URL",
              details: {
                frontend: [
                  "Frontend waits for { url } response and does not build any Stripe URL itself.",
                ],
                backend: [
                  "createCheckoutSession uses stripe.checkout.sessions.create with mode and line_items.",
                  "success_url and cancel_url are generated from NEXT_PUBLIC_URL.",
                ],
                keyItems: [
                  "src/features/checkout-redirect/api/checkoutService.ts",
                  "createCheckoutSession()",
                  "requireAppUrl()",
                ],
                codeExamples: [
                  {
                    title: "Create hosted Checkout Session",
                    language: "ts",
                    code: "const session = await stripe.checkout.sessions.create({\n  mode: params.mode,\n  line_items: [{\n    price_data: {\n      currency: \"usd\",\n      product_data: { name: params.productName },\n      unit_amount: normalizedAmountCents,\n    },\n    quantity: normalizedQuantity,\n  }],\n  success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,\n  cancel_url: `${baseUrl}/checkout`,\n});",
                    explanation:
                      "Server owns session configuration, including return URLs and Stripe pricing data.",
                  },
                ],
              },
            },
            {
              label: "Redirect to Stripe",
              details: {
                frontend: [
                  "window.location.assign(result.url) navigates browser to hosted checkout page.",
                ],
                backend: [
                  "No additional app backend work after URL response.",
                ],
                keyItems: [
                  "src/features/checkout-redirect/ui/CheckoutButton.tsx",
                  "window.location.assign()",
                ],
              },
            },
            {
              label: "Card input",
              details: {
                frontend: [
                  "Card form is fully hosted by Stripe Checkout domain.",
                ],
                backend: [
                  "No app backend access to raw card data.",
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
                  "User remains on Stripe page during payment processing.",
                ],
                backend: [
                  "Stripe handles authorization and payment lifecycle.",
                ],
                keyItems: [
                  "stripe.checkout.sessions.create()",
                ],
              },
            },
            {
              label: "Redirect back",
              details: {
                frontend: [
                  "Stripe redirects browser to success_url with session_id query parameter.",
                ],
                backend: [
                  "URL destination is controlled by server-side session configuration.",
                ],
                keyItems: [
                  "success_url in createCheckoutSession()",
                  "/success?session_id={CHECKOUT_SESSION_ID}",
                ],
              },
            },
            {
              label: "Server verifies session_id",
              details: {
                frontend: [
                  "Success page server component receives searchParams.session_id.",
                ],
                backend: [
                  "retrieveCheckoutSessionDisplay calls stripe.checkout.sessions.retrieve(sessionId).",
                  "Returned data is normalized for UI output.",
                ],
                keyItems: [
                  "src/widgets/success-page/ui/SuccessPage.tsx",
                  "src/features/checkout-redirect/api/checkoutSessionService.ts",
                  "retrieveCheckoutSessionDisplay()",
                ],
                codeExamples: [
                  {
                    title: "Verify session on success page",
                    language: "ts",
                    code: "const sessionId = resolved.session_id;\nconst display = await retrieveCheckoutSessionDisplay(sessionId);",
                    explanation:
                      "The success page resolves Stripe session server-side before rendering result UI.",
                  },
                ],
              },
            },
            {
              label: "Show status",
              details: {
                frontend: [
                  "PaymentStatusCard renders customer email, amount, and payment status.",
                ],
                backend: [
                  "Server-provided display model is rendered directly in UI.",
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
}
