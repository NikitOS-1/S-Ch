import Link from "next/link";

const demos = [
  {
    href: "/payment-link",
    title: "Payment Link",
    description: "Hosted by Stripe. No backend session creation — open a link and pay.",
    badge: "Minimal",
    badgeClass: "bg-emerald-100 text-emerald-900 ring-emerald-200",
  },
  {
    href: "/checkout",
    title: "Checkout (redirect)",
    description: "Your API creates a Checkout Session; users complete payment on Stripe then return.",
    badge: "Medium",
    badgeClass: "bg-amber-100 text-amber-900 ring-amber-200",
  },
  {
    href: "/elements",
    title: "Elements (embedded)",
    description: "Card fields on your page; confirm in place with Payment Element.",
    badge: "Advanced",
    badgeClass: "bg-violet-100 text-violet-900 ring-violet-200",
  },
] as const;

export function HomeWidget() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Educational sandbox
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Three ways to take a payment with Stripe
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Each route uses test keys only. No real money is charged. Compare complexity and where
          your code runs.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {demos.map((demo) => (
          <Link
            key={demo.href}
            href={demo.href}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <span
              className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${demo.badgeClass}`}
            >
              {demo.badge}
            </span>
            <h2 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-blue-700">
              {demo.title}
            </h2>
            <p className="mt-2 flex-1 text-sm text-slate-600">{demo.description}</p>
            <span className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">
              Open demo →
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-slate-500">
        No real money is ever charged in this project.
      </p>
    </div>
  );
}
