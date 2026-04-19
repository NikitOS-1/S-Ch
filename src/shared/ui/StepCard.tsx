interface StepCardProps {
  label: string;
  variant: "blue" | "green";
}

export function StepCard({ label, variant }: StepCardProps) {
  const stepClasses =
    variant === "green"
      ? "border-green-200 bg-green-50 text-green-900"
      : "border-blue-200 bg-blue-50 text-blue-900";

  return (
    <div
      className={`w-full rounded-lg border px-4 py-3 text-center text-sm font-medium ${stepClasses}`}
    >
      {label}
    </div>
  );
}
