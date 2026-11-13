import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { CheckBadge } from "@/components/ui/CheckBadge";
import { getT } from "@/i18n/server";
import type { PendingStepId, SetupStep } from "@/lib/data";

type StepIcon = { src: string; width: number; height: number; left: number; top: number };

// Natural SVG size and its offset inside the 24×24 icon slot, taken from Figma.
const stepIcons: Record<string, StepIcon> = {
  identity: { src: "/assets/icon-shield.svg", width: 24, height: 24, left: 0, top: 0 },
  "top-up": { src: "/assets/icon-step-top-up.svg", width: 18.5, height: 19.1421, left: 3, top: 2.358 },
  swap: { src: "/assets/icon-step-swap.svg", width: 18.5, height: 18.124, left: 3.25, top: 3.25 },
};

export async function RemainingSteps({ steps }: { steps: SetupStep[] }) {
  const t = await getT();
  // Only steps still to do reach these; only they have a description and an action in the dictionaries.
  const description = (step: SetupStep) => t(`home.steps.${step.id as PendingStepId}.description`);
  const action = (step: SetupStep) => t(`home.steps.${step.id as PendingStepId}.action`);
  const nextStep = steps.find((step) => !step.done);
  if (!nextStep) return null;

  return (
    <section className="flex flex-col gap-9 border-b-[0.2px] border-neutral-400 px-4 py-7 lg:px-7">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-h4 font-semibold text-white">{t("home.remaining.title")}</h2>
        <p className="text-p2 text-neutral-200">
          {t("home.remaining.intro", { step: t(`home.steps.${nextStep.id}.title`).toLowerCase() })}
        </p>
      </div>

      <ol className="flex flex-col gap-8">
        {steps.map((step) => {
          if (step.done) {
            return (
              <li key={step.id} className="flex items-center gap-2.5">
                <CheckBadge />
                <p className="text-p1 font-semibold text-neutral-100">
                  {t(`home.steps.${step.id}.title`)}
                  <span className="sr-only">{t("home.remaining.completed")}</span>
                </p>
              </li>
            );
          }

          if (step.id === nextStep.id) {
            return (
              <li
                key={step.id}
                aria-current="step"
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-neutral-500 p-5"
              >
                <StepContent id={step.id} title={t(`home.steps.${step.id}.title`)} description={description(step)} linkLabel={t("home.remaining.why")} />
                <Button>{action(step)}</Button>
              </li>
            );
          }

          return (
            <li key={step.id} className="flex h-[78px] opacity-40">
              <StepContent id={step.id} title={t(`home.steps.${step.id}.title`)} description={description(step)} linkLabel={t("home.remaining.learnMore")} />
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function StepContent({ id, title, description, linkLabel }: { id: string; title: string; description: string; linkLabel: string }) {
  const icon = stepIcons[id];

  return (
    // basis-60: below 240px of text the card's button wraps under it instead of squeezing it
    <div className="flex min-w-0 flex-1 basis-60 items-start gap-2.5">
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
          <p className="text-p1 font-semibold text-white">{title}</p>
          <p className="text-p2 text-neutral-200">{description}</p>
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
