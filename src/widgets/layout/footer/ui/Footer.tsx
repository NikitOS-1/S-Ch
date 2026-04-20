export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-xs text-slate-500">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span>Educational project</span>
        <span aria-hidden>·</span>
        <span>Stripe Sandbox Mode</span>
        <span aria-hidden>·</span>
        <a
          href="https://docs.stripe.com/testing?testing-method=card-numbers"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-blue-700 hover:underline"
        >
          Official testing docs
        </a>
      </div>
    </footer>
  );
}
