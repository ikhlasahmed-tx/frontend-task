import { CheckBadge } from "@/components/ui/CheckBadge";
import type { SetupStep } from "@/lib/data";

export function VerificationProgress({ steps }: { steps: SetupStep[] }) {
  const completed = steps.filter((step) => step.done).length;
  const total = steps.length;
  const nextStep = steps.find((step) => !step.done);

  if (!nextStep) return null; // setup finished, nothing to show

  return (
    <section
      aria-label="Account setup progress"
      className="flex flex-col gap-4 border-b-[0.2px] border-neutral-400 p-7"
    >
      <div className="flex items-center gap-2.5">
        <CheckBadge />
        <p className="text-p2 font-medium text-neutral-100">You’re almost there</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-h4 font-semibold text-white">{nextStep.title}</h2>

        <div className="flex items-center gap-3">
          <div
            role="progressbar"
            aria-label="Setup steps completed"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={completed}
            className="h-2 w-[245px] max-w-full overflow-hidden rounded-full bg-neutral-400"
          >
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
          <p className="text-p2 text-neutral-200">
            {completed}/{total}
          </p>
        </div>
      </div>
    </section>
  );
}
