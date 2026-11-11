import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vitest";
import { CodeInput } from "@/components/ui/CodeInput";
import en from "@/i18n/dictionaries/en.json";
import { I18nProvider } from "@/i18n/I18nProvider";

afterEach(cleanup);

// CodeInput is controlled, so the tests need a parent that holds the value.
function Harness({ onComplete, mask }: { onComplete?: (code: string) => void; mask?: boolean }) {
  const [value, setValue] = useState("");
  return (
    <I18nProvider locale="en" dictionary={en}>
      <CodeInput label="Code" value={value} onChange={setValue} onComplete={onComplete} mask={mask} />
    </I18nProvider>
  );
}

const box = (n: number) => screen.getByLabelText(`Code, digit ${n} of 6`) as HTMLInputElement;
const code = () => [1, 2, 3, 4, 5, 6].map((n) => box(n).value).join("");
const type = (n: number, text: string) => fireEvent.change(box(n), { target: { value: text } });

test("typing a digit moves the cursor to the next box", () => {
  render(<Harness />);
  type(1, "1");
  expect(code()).toBe("1");
  expect(document.activeElement).toBe(box(2));
});

test("a box selects its digit when focused, so a paste replaces it instead of mixing in", () => {
  render(<Harness />);
  type(1, "5");
  box(1).focus();
  expect([box(1).selectionStart, box(1).selectionEnd]).toEqual([0, 1]);
  type(1, "482913"); // what the browser gives after pasting over the selected digit
  expect(code()).toBe("482913");
});

test("Backspace in the middle clears from that box on, so retyping can't scramble the code", () => {
  render(<Harness />);
  type(1, "1");
  type(2, "2");
  type(3, "3");
  fireEvent.keyDown(box(2), { key: "Backspace" });
  expect(code()).toBe("1");
  type(2, "9");
  type(3, "3");
  expect(code()).toBe("193");
});

test("pasting a full code into a later box replaces the whole code", () => {
  const onComplete = vi.fn();
  render(<Harness onComplete={onComplete} />);
  type(1, "1");
  type(2, "2");
  type(3, "3");
  type(4, "482913");
  expect(code()).toBe("482913");
  expect(onComplete).toHaveBeenCalledWith("482913");
});

test("mask hides the digits (passcode) but keeps the number keypad", () => {
  render(<Harness mask />);
  type(1, "7");
  expect(box(1).type).toBe("password");
  expect(box(1).inputMode).toBe("numeric");
  expect(code()).toBe("7");
});
