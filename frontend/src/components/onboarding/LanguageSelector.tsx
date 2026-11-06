import Image from "next/image";

// "English (EN)" picker at the top of the onboarding screens.
// Only English exists for now, so the menu isn't built yet.
export function LanguageSelector() {
  return (
    <button
      type="button"
      aria-label="Language: English (EN)"
      className="flex items-center gap-2 rounded text-caption text-white transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="flex items-center gap-1.5">
        <Image src="/assets/onboarding/icon-globe.svg" alt="" width={18} height={18} className="size-[18px]" />
        English (EN)
      </span>
      <Image src="/assets/onboarding/icon-chevron-down.svg" alt="" width={10} height={10} className="size-2.5" />
    </button>
  );
}
