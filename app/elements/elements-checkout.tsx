"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  resetElementsOutcome,
  setElementsFailure,
  setElementsSuccess,
} from "@/lib/features/payment/paymentSlice";
import { useCreatePaymentIntentMutation } from "@/lib/features/payment/paymentApi";
import { getRtkQueryErrorMessage } from "@/lib/rtk-query-error";
import { buildElementsPaymentReceipt } from "@/lib/elements-payment-receipt";
import { mapStripeConfirmErrorToMessage } from "@/lib/map-stripe-confirm-error";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ElementsSuccessReceipt } from "@/components/payment/elements-success-receipt";
import { ComplexityBadge } from "@/components/ui/complexity-badge";
import { InfoCard } from "@/components/ui/info-card";
import { StepFlow } from "@/components/ui/step-flow";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function paymentIntentStatusMessage(status: string): string {
  if (status === "requires_action") {
    return "Additional authentication is required (try the 4000…3184 3D Secure test card).";
  }
  if (status === "requires_payment_method") {
    return "Payment was not completed. Use a valid test card or complete 3D Secure.";
  }
  if (status === "processing") {
    return "Payment is processing. Refresh in a moment or check the Dashboard.";
  }
  if (status === "canceled") {
    return "Payment was canceled.";
  }
  return `Payment status: ${status}. Try Visa 4242… or Mastercard 5555… for success.`;
}

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const elementsOutcome = useAppSelector((state) => state.payment.elementsOutcome);
  const elementsErrorMessage = useAppSelector(
    (state) => state.payment.elementsErrorMessage
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!stripe || !elements) {
        return;
      }
      setIsSubmitting(true);
      dispatch(resetElementsOutcome());
      try {
        const baseUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}${window.location.pathname}`
            : "";
        const confirmResult = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: baseUrl || "http://localhost:3000/elements",
          },
          redirect: "if_required",
        });
        if (confirmResult.error) {
          dispatch(setElementsFailure(mapStripeConfirmErrorToMessage(confirmResult.error)));
          return;
        }
        const paymentIntent = confirmResult.paymentIntent;
        if (paymentIntent?.status === "succeeded") {
          dispatch(setElementsSuccess(buildElementsPaymentReceipt(paymentIntent)));
          return;
        }
        if (paymentIntent) {
          dispatch(setElementsFailure(paymentIntentStatusMessage(paymentIntent.status)));
          return;
        }
        dispatch(setElementsFailure("Unexpected payment result."));
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, elements, stripe]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <PaymentElement />
      </div>
      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto"
      >
        {isSubmitting ? "Processing…" : "Pay $29.00"}
      </button>
      <ElementsSuccessReceipt />
      {elementsOutcome === "failed" && elementsErrorMessage ? (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {elementsErrorMessage}
        </p>
      ) : null}
    </form>
  );
}

export function ElementsCheckout() {
  const dispatch = useAppDispatch();
  const [createPaymentIntent, { data, isLoading, isError, error, isUninitialized }] =
    useCreatePaymentIntentMutation();
  const [bootstrapDone, setBootstrapDone] = useState(false);
  const [handledThreeDsReturn, setHandledThreeDsReturn] = useState(false);
  const elementsOutcome = useAppSelector((state) => state.payment.elementsOutcome);
  const elementsErrorMessage = useAppSelector(
    (state) => state.payment.elementsErrorMessage
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (typeof window === "undefined" || !stripePromise) {
        setBootstrapDone(true);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const returnSecret = params.get("payment_intent_client_secret");
      const redirectStatus = params.get("redirect_status");

      if (returnSecret && redirectStatus) {
        const stripe = await stripePromise;
        if (!stripe || cancelled) {
          setHandledThreeDsReturn(true);
          setBootstrapDone(true);
          return;
        }
        const { paymentIntent, error: retrieveError } =
          await stripe.retrievePaymentIntent(returnSecret);
        if (cancelled) {
          return;
        }
        if (retrieveError) {
          dispatch(setElementsFailure(mapStripeConfirmErrorToMessage(retrieveError)));
        } else if (redirectStatus === "succeeded" && paymentIntent?.status === "succeeded") {
          dispatch(setElementsSuccess(buildElementsPaymentReceipt(paymentIntent)));
        } else if (redirectStatus === "failed") {
          dispatch(
            setElementsFailure(
              "3D Secure failed or was canceled. Try again with card 4000…3184."
            )
          );
        } else if (paymentIntent) {
          dispatch(setElementsFailure(paymentIntentStatusMessage(paymentIntent.status)));
        } else {
          dispatch(setElementsFailure("Could not verify payment after authentication."));
        }

        const clean = new URL(window.location.href);
        clean.searchParams.delete("payment_intent");
        clean.searchParams.delete("payment_intent_client_secret");
        clean.searchParams.delete("redirect_status");
        window.history.replaceState({}, "", `${clean.pathname}${clean.search}`);
        setHandledThreeDsReturn(true);
        setBootstrapDone(true);
        return;
      }

      dispatch(resetElementsOutcome());
      try {
        await createPaymentIntent().unwrap();
      } catch {
        return;
      } finally {
        if (!cancelled) {
          setBootstrapDone(true);
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [createPaymentIntent, dispatch]);

  const clientSecret = data?.clientSecret ?? null;
  const intentErrorMessage = isError ? getRtkQueryErrorMessage(error) : null;
  const waitingForPaymentIntent =
    !handledThreeDsReturn &&
    (isUninitialized || isLoading || (!clientSecret && !isError));
  const isPreparing = !bootstrapDone || waitingForPaymentIntent;
  const showElementsForm = bootstrapDone && Boolean(clientSecret) && !isError;
  const showThreeDsOutcomeOnly =
    bootstrapDone &&
    handledThreeDsReturn &&
    (elementsOutcome === "succeeded" || elementsOutcome === "failed");

  if (!stripePromise) {
    return (
      <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Stripe Elements</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          Missing <code className="rounded bg-red-100 px-1">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>
          .
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Stripe Elements</h1>
        <ComplexityBadge label="Complexity: Advanced" />
      </div>

      <InfoCard>
        Card form lives on your site. Card data goes directly to Stripe servers — your
        backend never sees it.
      </InfoCard>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {isPreparing ? (
          <p className="text-sm font-medium text-slate-600">Preparing secure form…</p>
        ) : null}
        {intentErrorMessage ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {intentErrorMessage}
          </p>
        ) : null}
        {showElementsForm && clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: { theme: "stripe" },
            }}
          >
            <PaymentForm />
          </Elements>
        ) : null}
        {showThreeDsOutcomeOnly ? (
          <>
            <ElementsSuccessReceipt />
            {elementsOutcome === "failed" && elementsErrorMessage ? (
              <p
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                role="alert"
              >
                {elementsErrorMessage}
              </p>
            ) : null}
          </>
        ) : null}
        {bootstrapDone &&
        !clientSecret &&
        !intentErrorMessage &&
        !isPreparing &&
        !handledThreeDsReturn ? (
          <p className="text-sm text-red-600">Could not initialize payment.</p>
        ) : null}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Flow
        </h2>
        <StepFlow
          accent="blue"
          steps={[
            "Page loads",
            "POST /api/payment-intent",
            "Stripe creates PaymentIntent",
            "clientSecret returned",
            "Elements renders card form",
            "User submits",
            "Card data goes directly to Stripe",
            "Status returned to frontend",
            "Show result inline",
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
