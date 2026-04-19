import type { CheckoutSessionDisplay } from "@/entities/payment";

interface PaymentStatusCardProps {
  display: CheckoutSessionDisplay;
}

export function PaymentStatusCard({ display }: PaymentStatusCardProps) {
  const { paymentLabel, customerEmail, amountDisplay } = display;

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <dl className="grid gap-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
          <dt className="font-medium text-slate-600">Payment status</dt>
          <dd
            className={
              paymentLabel === "paid"
                ? "font-semibold text-green-700"
                : "font-semibold text-red-700"
            }
          >
            {paymentLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
          <dt className="font-medium text-slate-600">Customer email</dt>
          <dd className="text-right text-slate-900">{customerEmail}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="font-medium text-slate-600">Amount</dt>
          <dd className="font-semibold text-slate-900">{amountDisplay}</dd>
        </div>
      </dl>
    </div>
  );
}
