import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
};

// White pill button from the design ("Verify identity", "Top up your wallet").
export function Button({ icon, children, className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-white py-2.5 pr-[18px] text-center text-p2 font-bold text-neutral-600 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 ${
        icon ? "pl-3.5" : "pl-[18px]"
      } ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
