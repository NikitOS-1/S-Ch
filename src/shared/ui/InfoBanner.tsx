"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { TEST_CARD_PRESETS, type TestCardAccent } from "@/shared/constants/test-cards";
import { STRIPE_DOCS_URL } from "@/shared/constants/stripe-test-cards";

const accentClasses: Record<TestCardAccent, string> = {
  success: "border-l-emerald-500 bg-slate-800/80",
  brand: "border-l-indigo-400 bg-slate-800/80",
  warning: "border-l-amber-400 bg-slate-800/80",
  danger: "border-l-rose-400 bg-slate-800/80",
  action: "border-l-sky-400 bg-slate-800/80",
};

const labelAccentText: Record<TestCardAccent, string> = {
  success: "text-emerald-300",
  brand: "text-indigo-200",
  warning: "text-amber-200",
  danger: "text-rose-200",
  action: "text-sky-200",
};

function CopyGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function InfoBanner() {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const copiedResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handlePointerDown = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (copiedResetRef.current) {
        clearTimeout(copiedResetRef.current);
      }
    };
  }, []);

  const copyNumber = useCallback(async (rawNumber: string) => {
    const normalized = rawNumber.replace(/\s+/g, "");
    try {
      await navigator.clipboard.writeText(normalized);
      setCopiedKey(rawNumber);
      if (copiedResetRef.current) {
        clearTimeout(copiedResetRef.current);
      }
      copiedResetRef.current = setTimeout(() => {
        setCopiedKey(null);
      }, 2000);
    } catch {
      setCopiedKey(null);
    }
  }, []);

  return (
    <div
      className="sticky top-0 z-50 border-b border-blue-200 bg-blue-50 px-3 py-2 shadow-sm sm:px-4"
      role="status"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 sm:justify-between">
        <p className="min-w-0 flex-1 text-center text-xs text-blue-900 sm:text-left sm:text-sm">
          <span aria-hidden>🧪</span> Sandbox Mode — Exp: any future date · CVC: any (Amex: any 4
          digits)
        </p>
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-2" ref={wrapRef}>
          <a
            href={STRIPE_DOCS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-semibold text-blue-900 shadow-sm transition hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:text-sm"
          >
            Official docs
          </a>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-semibold text-blue-900 shadow-sm transition hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:text-sm"
            aria-expanded={open}
            aria-haspopup="true"
            aria-controls={open ? menuId : undefined}
            onClick={() => setOpen((value) => !value)}
          >
            Test cards
            <span
              aria-hidden
              className={`inline-block transition-transform ${open ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          </button>
          {open ? (
            <div
              id={menuId}
              role="menu"
              aria-label="Stripe test card numbers"
              className="absolute right-0 top-full z-[60] mt-2 w-[min(100vw-1.5rem,22rem)] rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-xl ring-1 ring-black/20"
            >
              <p className="border-b border-slate-700 px-2 pb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Card presets
              </p>
              <ul className="max-h-[min(70vh,24rem)] space-y-1 overflow-y-auto py-1">
                {TEST_CARD_PRESETS.map((preset) => {
                  const isCopied = copiedKey === preset.number;
                  return (
                    <li key={preset.number}>
                      <div
                        className={`flex items-stretch gap-1 rounded-lg border-l-4 pr-1 ${accentClasses[preset.accent]}`}
                      >
                        <button
                          type="button"
                          role="menuitem"
                          className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-md px-2 py-2 text-left text-xs transition hover:bg-slate-700/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-sky-400"
                          onClick={() => void copyNumber(preset.number)}
                        >
                          <span
                            className={`font-semibold leading-tight ${labelAccentText[preset.accent]}`}
                          >
                            {preset.label}
                          </span>
                          <span className="font-mono text-[11px] text-slate-200">
                            {preset.number}
                          </span>
                          <span className="text-[11px] text-slate-400">{preset.outcome}</span>
                          <span className="text-[10px] text-slate-500">
                            {isCopied ? "Copied to clipboard" : "Click row to copy"}
                          </span>
                        </button>
                        <button
                          type="button"
                          className="flex w-11 shrink-0 flex-col items-center justify-center rounded-md border border-slate-600/80 bg-slate-800/90 text-slate-200 transition hover:border-slate-500 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-sky-400"
                          title="Copy number"
                          aria-label={`Copy ${preset.label} number`}
                          onClick={(event) => {
                            event.stopPropagation();
                            void copyNumber(preset.number);
                          }}
                        >
                          {isCopied ? (
                            <CheckGlyph className="text-emerald-400" />
                          ) : (
                            <CopyGlyph className="text-slate-300" />
                          )}
                          <span className="mt-0.5 max-w-[2.75rem] text-center text-[9px] font-medium leading-tight text-slate-400">
                            {isCopied ? "Done" : "Copy"}
                          </span>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="border-t border-slate-700 px-2 pt-2 text-[10px] text-slate-500">
                Numbers from Stripe test mode docs. No real charges.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
