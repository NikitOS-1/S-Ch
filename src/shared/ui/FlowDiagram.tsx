import { StepCard } from "./StepCard";

interface FlowStepDetails {
  frontend: readonly string[];
  backend: readonly string[];
  keyItems: readonly string[];
  codeExamples?: readonly {
    title: string;
    language: "ts" | "tsx" | "js" | "json" | "bash";
    code: string;
    explanation?: string;
  }[];
}

interface FlowStepConfig {
  label: string;
  details?: FlowStepDetails;
}

interface FlowDiagramProps {
  steps: readonly (string | FlowStepConfig)[];
  accent: "blue" | "green";
}

export function FlowDiagram({ steps, accent }: FlowDiagramProps) {
  const variant = accent === "green" ? "green" : "blue";
  const arrowColor = accent === "green" ? "text-green-500" : "text-blue-500";
  const detailsBorderClass =
    accent === "green" ? "border-green-200 bg-green-50/60" : "border-blue-200 bg-blue-50/60";

  const normalizedSteps: readonly FlowStepConfig[] = steps.map((step) =>
    typeof step === "string" ? { label: step } : step,
  );

  return (
    <div className="flex flex-col gap-2">
      {normalizedSteps.map((step, index) => (
        <div key={`${step.label}-${index}`} className="flex flex-col items-center gap-2">
          <StepCard label={step.label} variant={variant} />
          {step.details ? (
            <details className={`w-full rounded-lg border p-2.5 text-sm text-slate-700 ${detailsBorderClass}`}>
              <summary className="cursor-pointer select-none font-semibold text-slate-800">
                Developer details
              </summary>
              <div className="mt-3 grid gap-3">
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Frontend
                  </h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {step.details.frontend.map((item) => (
                      <li key={`frontend-${item}`}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Backend
                  </h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {step.details.backend.map((item) => (
                      <li key={`backend-${item}`}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Key functions and files
                  </h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {step.details.keyItems.map((item) => (
                      <li key={`key-${item}`}>{item}</li>
                    ))}
                  </ul>
                </section>
                {step.details.codeExamples && step.details.codeExamples.length > 0 ? (
                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Critical code examples
                    </h3>
                    <div className="mt-2 grid gap-3">
                      {step.details.codeExamples.map((example) => (
                        <article
                          key={`${example.title}-${example.code}`}
                          className="overflow-hidden rounded-md border border-slate-300 bg-slate-900"
                        >
                          <div className="flex items-center justify-between border-b border-slate-700 px-2.5 py-1.5">
                            <span className="text-xs font-medium text-slate-200">
                              {example.title}
                            </span>
                            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                              {example.language}
                            </span>
                          </div>
                          <pre className="whitespace-pre-wrap break-words px-2.5 py-2 text-[11px] leading-relaxed text-slate-100">
                            <code>{example.code}</code>
                          </pre>
                          {example.explanation ? (
                            <p className="border-t border-slate-700 px-2.5 py-1.5 text-xs text-slate-300">
                              {example.explanation}
                            </p>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            </details>
          ) : null}
          {index < normalizedSteps.length - 1 ? (
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
