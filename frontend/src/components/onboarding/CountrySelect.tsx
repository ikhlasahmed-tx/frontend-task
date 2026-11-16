"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { getCountries } from "@/lib/countries";

type CountrySelectProps = {
  label: string; 
  value: string; 
  onChange: (code: string) => void;
};

export function CountrySelect({ label, value, onChange }: CountrySelectProps) {
  const id = useId();
  const { t, i18n } = useTranslation();
  const countries = getCountries(i18n.language); // names and order in the page language
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); 

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = countries.find((country) => country.code === value);

  function openList() {
    setActiveIndex(Math.max(0, countries.findIndex((country) => country.code === value)));
    setOpen(true);
  }

  function choose(index: number) {
    onChange(countries[index].code);
    setOpen(false);
    buttonRef.current?.focus();
  }

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`${id}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, id]);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  // Type-ahead like a native <select>: letters typed within half a second build one search ("pa" → Pakistan);
  // pressing the same single letter again moves to the next country with it.
  const typed = useRef({ text: "", time: 0 });
  function typeAhead(key: string, now: number) {
    const text = (now - typed.current.time < 500 ? typed.current.text : "") + key.toLocaleLowerCase();
    typed.current = { text, time: now };
    const start = text.length === 1 ? activeIndex + 1 : activeIndex;
    const ordered = [...countries.slice(start), ...countries.slice(0, start)];
    const match = ordered.find((country) => country.name.toLocaleLowerCase().startsWith(text));
    if (match) setActiveIndex(countries.indexOf(match));
  }

  const last = countries.length - 1;
  function handleListKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowDown") setActiveIndex((i) => Math.min(i + 1, last));
    else if (event.key === "ArrowUp") setActiveIndex((i) => Math.max(i - 1, 0));
    else if (event.key === "PageDown") setActiveIndex((i) => Math.min(i + 10, last));
    else if (event.key === "PageUp") setActiveIndex((i) => Math.max(i - 10, 0));
    else if (event.key === "Home") setActiveIndex(0);
    else if (event.key === "End") setActiveIndex(last);
    else if (event.key === "Enter") choose(activeIndex);
    else if (event.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    } else if (event.key === "Tab") setOpen(false);
    else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) typeAhead(event.key, event.timeStamp);
    else return;
    if (event.key !== "Tab") event.preventDefault();
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        ref={buttonRef}
        type="button"
        aria-label={selected ? `${label}: ${selected.name}` : label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openList();
          }
        }}
        className={`flex h-12 w-full items-center justify-between gap-3 rounded-xl border-[0.5px] bg-neutral-500 px-4 py-3 text-left text-p2 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          open ? "border-primary" : "border-neutral-400"
        }`}
      >
        <span className={`truncate ${selected ? "text-white" : "text-neutral-200"}`}>
          {selected ? selected.name : t("citizenship.placeholder")}
        </span>
        <Image src="/assets/onboarding/icon-chevron-down-16.svg" alt="" width={16} height={16} className="size-4 shrink-0" />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          aria-activedescendant={`${id}-${activeIndex}`}
          onKeyDown={handleListKeyDown}
          className="absolute top-full right-0 left-0 z-20 mt-2 max-h-60 overflow-y-auto rounded-xl border-[0.5px] border-neutral-400 bg-neutral-500 py-1 outline-none [scrollbar-color:var(--color-neutral-400)_transparent]"
        >
          {countries.map((country, index) => (
            <li
              key={country.code}
              id={`${id}-${index}`}
              role="option"
              aria-selected={country.code === value}
              onClick={() => choose(index)}
              onMouseEnter={() => setActiveIndex(index)} // one highlight shared by mouse and keyboard
              className={`flex h-10 cursor-pointer items-center px-4 text-p2 ${
                index === activeIndex ? "bg-neutral-400" : ""
              } ${country.code === value ? "font-medium text-primary" : "text-white"}`}
            >
              {country.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
