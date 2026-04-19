"use client";

import { useCallback } from "react";
import { useCreateCheckoutSessionMutation } from "../api/checkoutApi";
import { getRtkQueryErrorMessage } from "@/shared/lib/rtk-query-error";

export function CheckoutButton() {
  const [createCheckoutSession, { isLoading, error }] =
    useCreateCheckoutSessionMutation();

  const handleBuyNow = useCallback(async () => {
    try {
      const result = await createCheckoutSession().unwrap();
      if (result.url) {
        window.location.assign(result.url);
      }
    } catch {
      return;
    }
  }, [createCheckoutSession]);

  const errorMessage = error ? getRtkQueryErrorMessage(error) : null;

  return (
    <>
      <button
        type="button"
        onClick={handleBuyNow}
        disabled={isLoading}
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {isLoading ? "Starting checkout…" : "Buy Now"}
      </button>
      {errorMessage ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}
    </>
  );
}
