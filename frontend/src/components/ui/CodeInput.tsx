"use client";

import { useEffect, useRef, type ChangeEvent, type KeyboardEvent } from "react";

const LENGTH = 6; // OTP and passcode are both 6 digits

type CodeInputProps = {
  label: string; // read by screen readers, e.g. "Verification code"
  value: string; // the digits typed so far, e.g. "123"
  onChange: (value: string) => void;
  onComplete?: (value: string) => void; // called once every box is filled
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: string; // "one-time-code" lets phones auto-fill codes from SMS/email
};

// A row of single-digit boxes (OTP and passcode screens).
export function CodeInput({
  label,
  value,
  onChange,
  onComplete,
  error = false,
  disabled = false,
  autoFocus = false,
  autoComplete = "off",
}: CodeInputProps) {
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  // Newest value right away; the `value` prop only updates on the next render, too late for handleFocus.
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  }, [value]);

  // An effect, not the autoFocus attribute: Next.js may re-show a cached page, and only effects re-run.
  useEffect(() => {
    if (autoFocus) boxes.current[0]?.focus();
  }, [autoFocus]);

  function focusBox(index: number) {
    boxes.current[Math.max(0, Math.min(index, LENGTH - 1))]?.focus();
  }

  function setValue(next: string) {
    const clean = next.replace(/\D/g, "").slice(0, LENGTH);
    latest.current = clean;
    onChange(clean);
    if (clean.length === LENGTH) onComplete?.(clean);
  }

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    // Only the new digits: the box's old digit was selected, so it got replaced. Extra digits fill the next boxes.
    const digits = event.target.value.replace(/\D/g, "");
    if (!digits) return;
    setValue(value.slice(0, index) + digits + value.slice(index + digits.length));
    focusBox(index + digits.length);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();
      // Clear from this box on, so later digits never slide into the wrong boxes.
      if (value[index]) {
        setValue(value.slice(0, index));
      } else if (index > 0) {
        setValue(value.slice(0, index - 1));
        focusBox(index - 1);
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
    }
  }

  // Empty box past the typed digits: jump back to the next empty one. Otherwise select the digit so input replaces it.
  function handleFocus(index: number, input: HTMLInputElement) {
    if (index > latest.current.length) focusBox(latest.current.length);
    else input.select();
  }

  return (
    <div role="group" aria-label={label} className="flex h-12 w-full gap-3">
      {Array.from({ length: LENGTH }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            boxes.current[index] = element;
          }}
          value={value[index] ?? ""}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => handleFocus(index, event.currentTarget)}
          onClick={(event) => event.currentTarget.select()}
          aria-label={`${label}, digit ${index + 1} of ${LENGTH}`}
          aria-invalid={error || undefined}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? autoComplete : "off"}
          disabled={disabled}
          className={`h-full min-w-0 flex-1 rounded-[10px] border-[0.5px] bg-neutral-500 text-center font-display text-h4 font-semibold text-white caret-primary outline-none transition-colors focus:border-primary disabled:opacity-60 ${
            error ? "border-danger" : "border-neutral-400"
          }`}
        />
      ))}
    </div>
  );
}
