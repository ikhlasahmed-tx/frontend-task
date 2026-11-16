import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { CountrySelect } from "@/components/onboarding/CountrySelect";
import en from "@/i18n/dictionaries/en.json";
import { I18nProvider } from "@/i18n/I18nProvider";

afterEach(cleanup);
Element.prototype.scrollIntoView = () => {}; // jsdom has no layout

function openList() {
  render(
    <I18nProvider locale="en" dictionary={en}>
      <CountrySelect label="Country" value="" onChange={() => {}} />
    </I18nProvider>,
  );
  fireEvent.click(screen.getByRole("button"));
  return screen.getByRole("listbox");
}

const active = (list: HTMLElement) => document.getElementById(list.getAttribute("aria-activedescendant")!)!.textContent;

test("typing letters jumps to the matching country, like a native select", () => {
  const list = openList();
  fireEvent.keyDown(list, { key: "p" });
  fireEvent.keyDown(list, { key: "a" });
  expect(active(list)).toBe("Pakistan");

  fireEvent.keyDown(list, { key: "End" });
  expect(active(list)).toBe(screen.getAllByRole("option").at(-1)!.textContent);
  fireEvent.keyDown(list, { key: "Home" });
  expect(active(list)).toBe("Afghanistan");
});
