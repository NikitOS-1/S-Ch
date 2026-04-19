interface StepFlowProps {
  steps: readonly string[];
  accent: "blue" | "green";
}

export function StepFlow({ steps, accent }: StepFlowProps) {
  const stepClasses =
    accent === "green"
      ? "border-green-200 bg-green-50 text-green-900"
      : "border-blue-200 bg-blue-50 text-blue-900";
  const arrowColor = accent === "green" ? "text-green-500" : "text-blue-500";

  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center gap-2">
          <div
            className={`w-full rounded-lg border px-4 py-3 text-center text-sm font-medium ${stepClasses}`}
          >
            {step}
          </div>
          {index < steps.length - 1 ? (
            <div
              className={`flex h-8 items-center justify-center text-xl font-bold ${arrowColor}`}
              aria-hidden
            >
              ↓
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
