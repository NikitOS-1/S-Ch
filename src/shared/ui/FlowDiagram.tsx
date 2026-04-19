import { StepCard } from "./StepCard";

interface FlowDiagramProps {
  steps: readonly string[];
  accent: "blue" | "green";
}

export function FlowDiagram({ steps, accent }: FlowDiagramProps) {
  const variant = accent === "green" ? "green" : "blue";
  const arrowColor = accent === "green" ? "text-green-500" : "text-blue-500";

  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center gap-2">
          <StepCard label={step} variant={variant} />
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
