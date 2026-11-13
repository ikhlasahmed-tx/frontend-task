import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { getT } from "@/i18n/server";

export async function TransactionsEmpty() {
  const t = await getT();

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-5 px-4 py-7 lg:px-7">
      <h2 className="font-display text-h4 font-semibold text-white">{t("home.transactions.title")}</h2>

      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-[358px] max-w-full flex-col items-center gap-4">
          <div className="flex w-full flex-col items-center gap-2.5">
            <span aria-hidden className="flex size-10 items-center justify-center rounded-full bg-neutral-400">
              <span className="flex size-[30.402px] items-center justify-center">
                {/* Figma has this icon flipped vertically and turned -20.44° */}
                <span className="-scale-y-100 rotate-[-20.44deg]">
                  <Image
                    src="/assets/icon-empty-transactions.svg"
                    alt=""
                    width={23.6364}
                    height={23.6364}
                    className="size-[23.636px] max-w-none"
                  />
                </span>
              </span>
            </span>

            <div className="flex w-full flex-col items-center gap-1 text-center">
              <p className="text-p1 font-semibold text-neutral-100">{t("home.transactions.empty")}</p>
              <p className="text-p2 text-neutral-200">{t("home.transactions.emptyHint")}</p>
            </div>
          </div>

          <Button
            icon={
              <span className="relative size-[17px] shrink-0">
                <Image
                  src="/assets/icon-plus.svg"
                  alt=""
                  width={12.8333}
                  height={12.8333}
                  className="absolute top-[2.08px] left-[2.26px] size-[12.833px] max-w-none"
                />
              </span>
            }
          >
            {t("home.transactions.topUp")}
          </Button>
        </div>
      </div>
    </section>
  );
}
