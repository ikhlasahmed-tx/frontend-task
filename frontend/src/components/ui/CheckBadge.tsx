import Image from "next/image";

export function CheckBadge() {
  return (
    <span aria-hidden className="flex size-6 shrink-0 items-center justify-center">
      <span className="flex size-5 items-center justify-center rounded-full border-[0.333px] border-neutral-400 bg-primary">
        <Image src="/assets/icon-check.svg" alt="" width={10.6667} height={10.6667} className="size-[10.667px]" />
      </span>
    </span>
  );
}
