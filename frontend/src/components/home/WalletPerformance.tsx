"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { TokenPerformance } from "@/lib/data";

const ranges = ["1H", "1D", "1W", "1M", "1Y", "ALL"] as const;
type Range = (typeof ranges)[number];

export function WalletPerformance({ token }: { token: TokenPerformance }) {
  const [range, setRange] = useState<Range>("1D");
  const { t, i18n } = useTranslation();
  const usd = new Intl.NumberFormat(i18n.language, { style: "currency", currency: "USD" });
  const percent = new Intl.NumberFormat(i18n.language, { style: "percent", maximumFractionDigits: 2 });
  const sign = token.changeUsd >= 0 ? "+" : "-";

  return (
    <section className="flex flex-col gap-5 px-4 py-7 lg:px-7">
      <h2 className="font-display text-h4 font-semibold text-white">{t("home.performance.title")}</h2>

      <div className="flex flex-col gap-5">
        {/* Value, change and token picker */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-start gap-1.5">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="text-p2 text-neutral-200">
                {t("home.performance.value", { name: token.name, symbol: token.symbol })}
              </p>
              <p className="font-display text-h3 font-semibold text-white">{usd.format(token.valueUsd)}</p>
            </div>

            <button
              type="button"
              aria-label={t("home.performance.changeToken", { symbol: token.symbol })}
              className="flex shrink-0 items-center gap-1 rounded-full bg-neutral-400 py-1.5 pr-2 pl-1.5 text-caption font-medium text-white transition-colors hover:bg-neutral-200/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <SolanaIcon />
              {token.symbol}
              <Image src="/assets/icon-chevron-down.svg" alt="" width={10} height={10} className="size-2.5" />
            </button>
          </div>

          <p className="text-caption text-primary">
            {sign}
            {usd.format(Math.abs(token.changeUsd))} ({percent.format(token.changePercent / 100)})
          </p>
        </div>

        {/* Chart and time ranges */}
        <div className="flex h-[194px] flex-col justify-between">
          <div className="relative min-h-0 w-full flex-1">
            <div className="absolute inset-[-0.49%_-0.13%_0_-0.14%]">
              <Image
                src="/assets/chart-sol.svg"
                alt={t("home.performance.chart", { symbol: token.symbol })}
                width={551.476}
                height={176.856}
                className="block size-full max-w-none"
              />
            </div>
          </div>

          <div role="group" aria-label={t("home.performance.timeRange")} className="flex items-center justify-between px-4">
            {ranges.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={r === range}
                onClick={() => setRange(r)}
                className={`rounded text-caption transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  r === range ? "font-semibold text-primary" : "font-normal text-neutral-200 hover:text-neutral-100"
                }`}
              >
                {t(`home.performance.ranges.${r}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// White circle with the Solana logo, as in Figma ("Sollet" frame).
function SolanaIcon() {
  return (
    <span aria-hidden className="relative size-5 shrink-0 overflow-hidden">
      <Image src="/assets/sol-badge-bg.svg" alt="" width={20} height={20} className="absolute inset-0 size-5" />
      <Image
        src="/assets/sol-logo.svg"
        alt=""
        width={10.0007}
        height={8.88951}
        className="absolute top-[5.584px] left-[5px] h-[8.8895px] w-[10.0007px] max-w-none"
        style={{
          maskImage: "url(/assets/sol-logo-mask.svg)",
          maskMode: "luminance",
          maskSize: "10px 8.889px",
          maskRepeat: "no-repeat",
        }}
      />
    </span>
  );
}
