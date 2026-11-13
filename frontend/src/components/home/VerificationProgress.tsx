import { CheckBadge } from "@/components/ui/CheckBadge";
import { getT } from "@/i18n/server";
import type { SetupStep } from "@/lib/data";

export async function VerificationProgress({ steps }: { steps: SetupStep[] }) {
  const t = await getT();
  const completed = steps.filter((step) => step.done).length;
  const total = steps.length;
  const nextStep = steps.find((step) => !step.done);

  if (!nextStep) return null; // setup finished, nothing to show

  return (
    <section
      aria-label={t("home.progress.label")}
      className="flex flex-col gap-4 border-b-[0.2px] border-neutral-400 px-4 py-7 lg:px-7"
    >
      <div className="flex items-center gap-2.5">
        <CheckBadge />
        <p className="text-p2 font-medium text-neutral-100">{t("home.progress.almostThere")}</p>
      </div>

      {/* Below md the bar goes under the title at full width instead of squeezing it */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <h2 className="font-display text-h4 font-semibold text-white md:shrink-0">{t(`home.steps.${nextStep.id}.title`)}</h2>

        {/* From md up the bar shrinks below 245px when the column is narrow (e.g. 1024px with the sidebar) */}
        <div className="flex items-center gap-3 md:min-w-0 md:flex-1 md:justify-end">
          <div
            role="progressbar"
            aria-label={t("home.progress.stepsCompleted")}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={completed}
            className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-400 md:max-w-[245px]"
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
