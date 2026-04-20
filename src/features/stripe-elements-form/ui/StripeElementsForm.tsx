"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { type ChangeEvent, type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getStripeBrowser } from "@/shared/config/stripe-client";
import { getRtkQueryErrorMessage } from "@/shared/lib/rtk-query-error";
import { mapStripeConfirmErrorToMessage } from "@/shared/lib/map-stripe-confirm-error";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { useCreatePaymentIntentMutation } from "../api/paymentIntentApi";
import type {
  CreatePaymentIntentRequest,
  ElementsPaymentMode,
} from "../model/types";
import {
  resetElementsOutcome,
  setElementsFailure,
  setElementsSuccess,
} from "../model/elementsSlice";
import { buildElementsPaymentReceipt } from "../model/payment-receipt";
import { ElementsProvider } from "./ElementsProvider";
import { ElementsSuccessReceipt } from "./ElementsSuccessReceipt";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const appUrl = process.env.NEXT_PUBLIC_URL ?? "";
const stripePromise = getStripeBrowser(publishableKey);
const defaultProductName = "Pro Plan";
const defaultAmountDollars = "29.00";
const defaultQuantity = 1;

function formatUsdFromCents(amountCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountCents / 100);
}

function parseDollarInputToCents(amountDollars: string): number {
  const parsedValue = Number(amountDollars);
  if (!Number.isFinite(parsedValue)) {
    return 50;
  }
  return Math.max(50, Math.round(parsedValue * 100));
}

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

interface StripePaymentFieldsProps {
  isRefreshing: boolean;
  totalDisplay: string;
  onStartNewPayment: () => Promise<void>;
}

function StripePaymentFields({
  isRefreshing,
  totalDisplay,
  onStartNewPayment,
}: StripePaymentFieldsProps) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const elementsOutcome = useAppSelector(
    (state) => state.elements.elementsOutcome,
  );
  const elementsErrorMessage = useAppSelector(
    (state) => state.elements.elementsErrorMessage,
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
            return_url: baseUrl || `${appUrl}/elements`,
          },
          redirect: "if_required",
        });
        if (confirmResult.error) {
          dispatch(
            setElementsFailure(
              mapStripeConfirmErrorToMessage(confirmResult.error),
            ),
          );
          return;
        }
        const paymentIntent = confirmResult.paymentIntent;
        if (paymentIntent?.status === "succeeded") {
          dispatch(
            setElementsSuccess(buildElementsPaymentReceipt(paymentIntent)),
          );
          return;
        }
        if (paymentIntent) {
          dispatch(
            setElementsFailure(
              paymentIntentStatusMessage(paymentIntent.status),
            ),
          );
          return;
        }
        dispatch(setElementsFailure("Unexpected payment result."));
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, elements, stripe],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <PaymentElement />
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={!stripe || !elements || isSubmitting}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto"
        >
          {isSubmitting ? "Processing…" : `Pay ${totalDisplay}`}
        </button>
        <button
          type="button"
          disabled={isSubmitting || isRefreshing}
          onClick={() => {
            void onStartNewPayment();
          }}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isRefreshing ? "Preparing new payment…" : "Start new payment"}
        </button>
      </div>
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

export function StripeElementsForm() {
  const dispatch = useAppDispatch();
  const [
    createPaymentIntent,
    { data, isLoading, isError, error },
  ] = useCreatePaymentIntentMutation();
  const [mode, setMode] = useState<ElementsPaymentMode>("payment");
  const [productName, setProductName] = useState(defaultProductName);
  const [amountDollars, setAmountDollars] = useState(defaultAmountDollars);
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [bootstrapDone, setBootstrapDone] = useState(false);
  const [handledThreeDsReturn, setHandledThreeDsReturn] = useState(false);
  const [activeOrderKey, setActiveOrderKey] = useState<string | null>(null);
  const elementsOutcome = useAppSelector(
    (state) => state.elements.elementsOutcome,
  );
  const elementsErrorMessage = useAppSelector(
    (state) => state.elements.elementsErrorMessage,
  );

  const amountCents = useMemo(
    () => parseDollarInputToCents(amountDollars),
    [amountDollars],
  );

  const draftOrderKey = useMemo(
    () => `${mode}|${productName.trim()}|${amountCents}|${quantity}`,
    [amountCents, mode, productName, quantity],
  );

  const createIntentPayload = useMemo<CreatePaymentIntentRequest>(
    () => ({
      mode,
      productName: productName.trim() || defaultProductName,
      amountCents,
      quantity,
    }),
    [amountCents, mode, productName, quantity],
  );

  const createPaymentIntentForCurrentConfig = useCallback(async () => {
    dispatch(resetElementsOutcome());
    await createPaymentIntent(createIntentPayload).unwrap();
    setActiveOrderKey(draftOrderKey);
  }, [createIntentPayload, createPaymentIntent, dispatch, draftOrderKey]);

  const handleStartNewPayment = useCallback(async () => {
    setHandledThreeDsReturn(false);
    await createPaymentIntentForCurrentConfig();
  }, [createPaymentIntentForCurrentConfig]);

  const handleAmountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAmountDollars(event.target.value);
    },
    [],
  );

  const handleQuantityChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = Number(event.target.value);
    if (!Number.isNaN(parsedValue)) {
      setQuantity(Math.max(1, Math.floor(parsedValue)));
    }
  }, []);

  const totalDisplay = useMemo(
    () => formatUsdFromCents(amountCents * quantity),
    [amountCents, quantity],
  );

  useEffect(() => {
    let cancelled = false;

    const run = async (): Promise<void> => {
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
          dispatch(
            setElementsFailure(mapStripeConfirmErrorToMessage(retrieveError)),
          );
        } else if (
          redirectStatus === "succeeded" &&
          paymentIntent?.status === "succeeded"
        ) {
          dispatch(
            setElementsSuccess(buildElementsPaymentReceipt(paymentIntent)),
          );
        } else if (redirectStatus === "failed") {
          dispatch(
            setElementsFailure(
              "3D Secure failed or was canceled. Try again with card 4000…3184.",
            ),
          );
        } else if (paymentIntent) {
          dispatch(
            setElementsFailure(
              paymentIntentStatusMessage(paymentIntent.status),
            ),
          );
        } else {
          dispatch(
            setElementsFailure(
              "Could not verify payment after authentication.",
            ),
          );
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

      if (!cancelled) {
        setBootstrapDone(true);
      }
    };

    void run(); // or // run().catch(() => {})
    return () => {
      cancelled = true;
    };
  }, [createPaymentIntentForCurrentConfig, dispatch]);

  const clientSecret = data?.clientSecret ?? null;
  const intentErrorMessage = isError ? getRtkQueryErrorMessage(error) : null;
  const hasActiveOrder = Boolean(clientSecret) && activeOrderKey === draftOrderKey;
  const waitingForPaymentIntent = !handledThreeDsReturn && isLoading;
  const isPreparing = !bootstrapDone || waitingForPaymentIntent;
  const showElementsForm = bootstrapDone && hasActiveOrder && !isError;
  const showThreeDsOutcomeOnly =
    bootstrapDone &&
    handledThreeDsReturn &&
    (elementsOutcome === "succeeded" || elementsOutcome === "failed");

  if (!publishableKey || !stripePromise) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
        Missing{" "}
        <code className="rounded bg-red-100 px-1">
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        </code>
        .
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-700">Mode</span>
          <select
            className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
            value={mode}
            onChange={(event) => {
              const nextMode = event.target.value;
              if (nextMode === "payment" || nextMode === "subscription") {
                setMode(nextMode);
              }
            }}
            disabled={isLoading}
          >
            <option value="payment">One-time payment</option>
            <option value="subscription">Monthly subscription</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-700">Product name</span>
          <input
            className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            disabled={isLoading}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-700">
            Unit price, USD
          </span>
          <input
            type="number"
            min={0.5}
            step={0.01}
            className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
            value={amountDollars}
            onChange={handleAmountChange}
            disabled={isLoading}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-700">Quantity (min 1)</span>
          <input
            type="number"
            min={1}
            step={1}
            className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
            value={quantity}
            onChange={handleQuantityChange}
            disabled={isLoading}
          />
        </label>
        <p className="text-sm text-slate-600">
          {mode === "subscription" ? "Recurring total per month: " : "Order total: "}
          <span className="font-semibold text-slate-900">{totalDisplay}</span>
        </p>
        <p className="text-xs text-slate-500">
          Stripe API accepts amount in cents. Form input is in dollars and converted automatically.
        </p>
        <button
          type="button"
          onClick={() => {
            void handleStartNewPayment();
          }}
          disabled={isLoading}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isLoading ? "Creating order…" : "Create order"}
        </button>
      </div>
      {isPreparing ? (
        <p className="text-sm font-medium text-slate-600">
          Preparing secure form…
        </p>
      ) : null}
      {intentErrorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {intentErrorMessage}
        </p>
      ) : null}
      {showElementsForm && clientSecret ? (
        <ElementsProvider stripe={stripePromise} clientSecret={clientSecret}>
          <StripePaymentFields
            isRefreshing={isLoading}
            totalDisplay={totalDisplay}
            onStartNewPayment={handleStartNewPayment}
          />
        </ElementsProvider>
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
      {bootstrapDone && !hasActiveOrder && !intentErrorMessage && !isPreparing ? (
        <p className="text-sm text-slate-600">
          Create order to generate a new Stripe PaymentIntent for current price and quantity.
        </p>
      ) : null}
    </div>
  );
}
