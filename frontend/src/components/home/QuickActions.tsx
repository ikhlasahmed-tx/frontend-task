import Image from "next/image";
import { getT } from "@/i18n/server";

type QuickAction = {
  id: "send" | "receive" | "swap" | "topUp" | "withdraw"; // also the text key under home.quickActions
  icon: {
    src: string;
    // Natural SVG size and its offset inside the 20×20 icon slot, taken from Figma.
    width: number;
    height: number;
    left: number;
    top: number;
  };
};

const actions: QuickAction[] = [
  { id: "send", icon: { src: "/assets/icon-send.svg", width: 20, height: 20, left: 0, top: 0 } },
  { id: "receive", icon: { src: "/assets/icon-receive.svg", width: 14.8341, height: 14.8341, left: 2.376, top: 2.58 } },
  { id: "swap", icon: { src: "/assets/icon-swap.svg", width: 16.5007, height: 16.165, left: 1.75, top: 1.75 } },
  { id: "topUp", icon: { src: "/assets/icon-top-up.svg", width: 14.8333, height: 14.8333, left: 2.792, top: 2.58 } },
  { id: "withdraw", icon: { src: "/assets/icon-withdraw.svg", width: 20, height: 20, left: 0, top: 0 } },
];

export async function QuickActions() {
  const t = await getT();

  return (
    <section
      aria-label={t("home.quickActions.label")}
      className="flex flex-1 flex-col justify-center gap-5 border-b-[0.2px] border-neutral-400 px-4 py-7 lg:pr-8 lg:pl-7"
    >
      {actions.map(({ id, icon }) => (
        <button
          key={id}
          type="button"
          className="group flex items-center gap-2.5 self-start rounded-full text-p2 font-medium text-neutral-100 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-neutral-500 transition-colors group-hover:bg-neutral-400">
            <span className="relative size-5">
              <Image
                src={icon.src}
                alt=""
                width={icon.width}
                height={icon.height}
                className="absolute max-w-none"
                style={{ left: icon.left, top: icon.top, width: icon.width, height: icon.height }}
              />
            </span>
          </span>
          {t(`home.quickActions.${id}`)}
        </button>
      ))}
    </section>
  );
}
