import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { CheckBadge } from "@/components/ui/CheckBadge";
import type { SetupStep } from "@/lib/data";

type StepIcon = { src: string; width: number; height: number; left: number; top: number };

// Natural SVG size and its offset inside the 24×24 icon slot, taken from Figma.
const stepIcons: Record<string, StepIcon> = {
  identity: { src: "/assets/icon-shield.svg", width: 24, height: 24, left: 0, top: 0 },
  "top-up": { src: "/assets/icon-step-top-up.svg", width: 18.5, height: 19.1421, left: 3, top: 2.358 },
  swap: { src: "/assets/icon-step-swap.svg", width: 18.5, height: 18.124, left: 3.25, top: 3.25 },
};

export function RemainingSteps({ steps }: { steps: SetupStep[] }) {
  const nextStep = steps.find((step) => !step.done);
  if (!nextStep) return null;

  return (
    <section className="flex flex-col gap-9 border-b-[0.2px] border-neutral-400 p-7">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-h4 font-semibold text-white">Remaining steps</h2>
        <p className="text-p2 text-neutral-200">
          You’re close to finishing your account setup. Next up, {nextStep.title.toLowerCase()}.
        </p>
      </div>

      <ol className="flex flex-col gap-8">
        {steps.map((step) => {
          if (step.done) {
            return (
              <li key={step.id} className="flex items-center gap-2.5">
                <CheckBadge />
                <p className="text-p1 font-semibold text-neutral-100">
                  {step.title}
                  <span className="sr-only"> (completed)</span>
                </p>
              </li>
            );
          }

          if (step.id === nextStep.id) {
            return (
              <li
                key={step.id}
                aria-current="step"
                className="flex items-center justify-between gap-4 rounded-xl bg-neutral-500 p-5"
              >
                <StepContent step={step} linkLabel="Why is this important?" />
                <Button>{step.actionLabel}</Button>
              </li>
            );
          }

          return (
            <li key={step.id} className="flex h-[78px] opacity-40">
              <StepContent step={step} linkLabel="Learn more" />
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function StepContent({ step, linkLabel }: { step: SetupStep; linkLabel: string }) {
  const icon = stepIcons[step.id];

  return (
    <div className="flex min-w-0 flex-1 items-start gap-2.5">
      <span className="relative size-6 shrink-0">
        {icon && (
          <Image
            src={icon.src}
            alt=""
            width={icon.width}
            height={icon.height}
            className="absolute max-w-none"
            style={{ left: icon.left, top: icon.top, width: icon.width, height: icon.height }}
          />
        )}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-p1 font-semibold text-white">{step.title}</p>
          <p className="text-p2 text-neutral-200">{step.description}</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 self-start text-caption font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {linkLabel}
          <Image src="/assets/icon-chevron-down-teal.svg" alt="" width={10} height={10} className="size-2.5" />
        </button>
      </div>
    </div>
  );
}
