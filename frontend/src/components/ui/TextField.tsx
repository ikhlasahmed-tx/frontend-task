import Image from "next/image";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> & {
  label: string; // shown as the placeholder and read by screen readers
  icon: string; // path to the 20×20 icon on the left
  trailing?: ReactNode; // optional element on the right, e.g. the show-password button
  error?: string;
};

// Dark rounded input with an icon on the left (Figma "Input / …").
export function TextField({ label, icon, trailing, error, id, ...inputProps }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex w-full flex-col gap-1">
      <div
        className={`flex h-12 w-full items-center gap-3 rounded-xl border-[0.5px] bg-neutral-500 py-3 pr-3 pl-4 transition-colors focus-within:border-primary ${
          error ? "border-danger" : "border-neutral-400"
        }`}
      >
        <Image src={icon} alt="" width={20} height={20} className="size-5 shrink-0" />
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <input
          id={inputId}
          placeholder={label}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="min-w-0 flex-1 bg-transparent text-p2 text-white caret-primary outline-none placeholder:text-neutral-200"
          {...inputProps}
        />
        {trailing}
      </div>
      {error && (
        <p id={errorId} className="pl-4 text-caption text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
