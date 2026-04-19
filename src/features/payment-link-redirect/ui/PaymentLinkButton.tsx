"use client";

import { env } from "@/shared/config/env";

export function PaymentLinkButton() {
  const paymentLinkUrl = env.stripePaymentLink;

  if (!paymentLinkUrl) {
    return (
      <p className="text-sm text-red-600">
        Missing{" "}
        <code className="rounded bg-red-50 px-1">
          NEXT_PUBLIC_STRIPE_PAYMENT_LINK
        </code>{" "}
        in environment.
      </p>
    );
  }

  return (
    <a
      href={paymentLinkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white shadow transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto"
    >
      Buy Now  &quot;Open Stripe Payment Link&quot;
    </a>
  );
}
