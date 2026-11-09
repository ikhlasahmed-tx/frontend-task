import Image from "next/image";

export function OnboardingBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <Image
        src="/assets/onboarding/background.svg"
        alt=""
        width={899.376}
        height={836.882}
        priority
        className="absolute top-[calc(50%-408.75px)] left-[calc(50%-476.11px)] h-[836.882px] w-[899.376px] max-w-none"
      />
      {/* Blur + slight dark tint over the shapes, which turns them into a glow */}
      <div className="absolute inset-0 bg-neutral-600/10 backdrop-blur-[96.154px]" />
    </div>
  );
}
