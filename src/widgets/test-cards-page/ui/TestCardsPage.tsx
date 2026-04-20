"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  STRIPE_TEST_CARDS_DOCS_URL,
  STRIPE_TEST_CARD_SECTIONS,
} from "@/shared/constants/stripe-test-cards";

const headerCellClass =
  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";
const valueCellClass = "px-4 py-3 text-sm text-slate-700";

function getResultBadgeClass(result: string): string {
  if (result.toLowerCase().includes("succeeds")) {
    return "bg-emerald-100 text-emerald-900 ring-emerald-200";
  }
  if (result.toLowerCase().includes("requires authentication")) {
    return "bg-sky-100 text-sky-900 ring-sky-200";
  }
  if (result.toLowerCase().includes("authentication fails")) {
    return "bg-violet-100 text-violet-900 ring-violet-200";
  }
  return "bg-rose-100 text-rose-900 ring-rose-200";
}

export function TestCardsPage() {
  const [copiedCardNumber, setCopiedCardNumber] = useState<string | null>(null);
  const copiedResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedResetTimeoutRef.current) {
        clearTimeout(copiedResetTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyCardNumber = useCallback(async (cardNumber: string) => {
    const normalizedCardNumber = cardNumber.replace(/\s+/g, "");
    try {
      await navigator.clipboard.writeText(normalizedCardNumber);
      setCopiedCardNumber(cardNumber);
      if (copiedResetTimeoutRef.current) {
        clearTimeout(copiedResetTimeoutRef.current);
      }
      copiedResetTimeoutRef.current = setTimeout(() => {
        setCopiedCardNumber(null);
      }, 1800);
    } catch {
      setCopiedCardNumber(null);
    }
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Stripe testing</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Test card reference
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-700 sm:text-base">
          Use these cards in sandbox mode only. Enter any cardholder name, any future expiration
          date, and a valid CVC format for the selected card type.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={STRIPE_TEST_CARDS_DOCS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Open official Stripe docs
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            Back to demos
          </Link>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {STRIPE_TEST_CARD_SECTIONS.map((section) => (
          <article key={section.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <header className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            </header>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className={headerCellClass}>Card</th>
                    <th className={headerCellClass}>Number</th>
                    <th className={headerCellClass}>Copy</th>
                    <th className={headerCellClass}>CVC</th>
                    <th className={headerCellClass}>Date</th>
                    <th className={headerCellClass}>Expected result</th>
                  </tr>
                </thead>
                <tbody>
                  {section.cards.map((card) => (
                    <tr key={card.number} className="border-b border-slate-100 last:border-b-0">
                      <td className={`${valueCellClass} font-medium text-slate-900`}>{card.brand}</td>
                      <td className={`${valueCellClass} font-mono`}>{card.number}</td>
                      <td className={valueCellClass}>
                        <button
                          type="button"
                          onClick={() => {
                            void handleCopyCardNumber(card.number);
                          }}
                          className="inline-flex min-w-20 items-center justify-center rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                          aria-label={`Copy ${card.brand} card number`}
                        >
                          {copiedCardNumber === card.number ? "Copied" : "Copy"}
                        </button>
                      </td>
                      <td className={valueCellClass}>{card.cvc}</td>
                      <td className={valueCellClass}>{card.date}</td>
                      <td className={valueCellClass}>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getResultBadgeClass(card.result)}`}
                        >
                          {card.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
