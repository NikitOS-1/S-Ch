"use client";

import { useCallback, useMemo, useState } from "react";
import { useCreateCheckoutSessionMutation } from "../api/checkoutApi";
import { getRtkQueryErrorMessage } from "@/shared/lib/rtk-query-error";
import type { CheckoutMode } from "../model/types";

const defaultProductName = "Pro Plan";
const defaultAmountDollars = "19.00";
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

export function CheckoutButton() {
  const [mode, setMode] = useState<CheckoutMode>("payment");
  const [productName, setProductName] = useState(defaultProductName);
  const [amountDollars, setAmountDollars] = useState(defaultAmountDollars);
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [createCheckoutSession, { isLoading, error }] =
    useCreateCheckoutSessionMutation();

  const amountCents = useMemo(
    () => parseDollarInputToCents(amountDollars),
    [amountDollars],
  );

  const totalDisplay = useMemo(() => {
    const totalCents = amountCents * quantity;
    return formatUsdFromCents(totalCents);
  }, [amountCents, quantity]);

  const handleBuyNow = useCallback(async () => {
    try {
      const result = await createCheckoutSession({
        mode,
        productName: productName.trim() || defaultProductName,
        amountCents,
        quantity,
      }).unwrap();
      if (result.url) {
        window.location.assign(result.url);
      }
    } catch {
      return;
    }
  }, [amountCents, createCheckoutSession, mode, productName, quantity]);

  const errorMessage = error ? getRtkQueryErrorMessage(error) : null;

  return (
    <>
      <div className="mb-4 grid w-full gap-3 sm:min-w-96">
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
            onChange={(event) => setAmountDollars(event.target.value)}
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
            onChange={(event) => {
              const parsedValue = Number(event.target.value);
              if (!Number.isNaN(parsedValue)) {
                setQuantity(Math.max(1, Math.floor(parsedValue)));
              }
            }}
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
      </div>
      <button
        type="button"
        onClick={handleBuyNow}
        disabled={isLoading}
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {isLoading ? "Starting checkout…" : "Continue to Checkout"}
      </button>
      {errorMessage ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}
    </>
  );
}
