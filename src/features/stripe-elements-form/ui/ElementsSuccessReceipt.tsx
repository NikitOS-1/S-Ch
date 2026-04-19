"use client";

import { useAppSelector } from "@/shared/store/hooks";

export function ElementsSuccessReceipt() {
  const receipt = useAppSelector((state) => state.elements.elementsReceipt);
  const outcome = useAppSelector((state) => state.elements.elementsOutcome);

  if (outcome !== "succeeded") {
    return null;
  }

  if (!receipt) {
    return (
      <p
        className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-900"
        role="status"
      >
        Payment succeeded ✅
      </p>
    );
  }

  return (
    <div
      className="rounded-md border border-green-200 bg-green-50 px-3 py-3 text-sm text-green-950"
      role="status"
    >
      <p className="font-semibold text-green-900">Payment succeeded ✅</p>
      <dl className="mt-3 space-y-2 border-t border-green-200/80 pt-3">
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
          <dt className="text-green-800/90">Product</dt>
          <dd className="text-right font-medium text-green-950">{receipt.productLabel}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
          <dt className="text-green-800/90">Amount</dt>
          <dd className="text-right font-semibold text-green-950">{receipt.amountDisplay}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
          <dt className="text-green-800/90">Status</dt>
          <dd className="text-right font-medium uppercase text-green-900">{receipt.paymentStatus}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
          <dt className="text-green-800/90">PaymentIntent</dt>
          <dd className="break-all text-right font-mono text-xs text-green-900">
            {receipt.paymentIntentId}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-green-800/80">
        Values are read from the confirmed PaymentIntent (metadata set on the server).
      </p>
    </div>
  );
}
