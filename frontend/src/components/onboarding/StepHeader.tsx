import type { ReactNode } from "react";


export function StepHeader({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-7">
      {icon}
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <h1 className="font-display text-h3 font-bold text-white">{title}</h1>
        <p className="text-p2 text-neutral-200">{subtitle}</p>
      </div>
    </div>
  );
}
