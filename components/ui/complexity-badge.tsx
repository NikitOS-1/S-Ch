interface ComplexityBadgeProps {
  label: string;
}

export function ComplexityBadge({ label }: ComplexityBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 ring-1 ring-inset ring-slate-200">
      {label}
    </span>
  );
}
