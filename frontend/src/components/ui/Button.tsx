import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: "white" | "primary";
};

const variants = {
  white: "bg-white hover:bg-neutral-100", // "Verify identity", "Top up your wallet"
  primary: "bg-primary hover:brightness-110", // onboarding "Continue"
};

// Pill button from the design.
export function Button({
  icon,
  variant = "white",
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full py-2.5 pr-[18px] text-center text-p2 font-bold text-neutral-600 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 ${
        variants[variant]
      } ${icon ? "pl-3.5" : "pl-[18px]"} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
