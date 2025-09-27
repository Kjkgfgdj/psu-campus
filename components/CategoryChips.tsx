"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORY, type CategoryFilter } from "@/lib/categories";
import { cn } from "@/lib/utils";

type CategoryKey = keyof typeof CATEGORY;

const ORDER: CategoryKey[] = ["ALL", "PUBLIC", "EXAM", "FOOD"];

type CategoryChipsProps = {
  selected: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
  className?: string;
};

export function CategoryChips({ selected, onChange, className }: CategoryChipsProps) {
  const chips = useMemo(() => ORDER.map((key) => CATEGORY[key]), []);
  const [focusIndex, setFocusIndex] = useState(() => chips.findIndex((chip) => chip === selected));
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const idx = chips.findIndex((chip) => chip === selected);
    if (idx >= 0 && idx !== focusIndex) {
      setFocusIndex(idx);
    }
  }, [chips, selected, focusIndex]);

  const handleSelect = useCallback(
    (value: CategoryFilter) => {
      onChange(value);
      const idx = chips.findIndex((chip) => chip === value);
      setFocusIndex(idx < 0 ? 0 : idx);
    },
    [chips, onChange],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const count = chips.length;
    if (count === 0) return;
    if (focusIndex < 0) {
      setFocusIndex(0);
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setFocusIndex((prev) => {
        const next = (prev + 1) % count;
        buttonRefs.current[next]?.focus();
        return next;
      });
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setFocusIndex((prev) => {
        const next = (prev - 1 + count) % count;
        buttonRefs.current[next]?.focus();
        return next;
      });
    } else if (event.key === "Home") {
      event.preventDefault();
      setFocusIndex(() => {
        buttonRefs.current[0]?.focus();
        return 0;
      });
    } else if (event.key === "End") {
      event.preventDefault();
      setFocusIndex(() => {
        const last = count - 1;
        buttonRefs.current[last]?.focus();
        return last;
      });
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const idx = focusIndex < 0 ? 0 : focusIndex;
      handleSelect(chips[idx]);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Filter by category"
      className={cn("flex gap-2 overflow-x-auto pb-1", className)}
      onKeyDown={onKeyDown}
    >
      {chips.map((label, index) => {
        const isSelected = selected === label;
        const isFocused = focusIndex === index;
        return (
          <button
            key={label}
            role="tab"
            aria-selected={isSelected}
            tabIndex={isFocused ? 0 : -1}
            type="button"
            onFocus={() => setFocusIndex(index)}
            onClick={() => handleSelect(label)}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-1 transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              isSelected
                ? "bg-black text-white ring-black"
                : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

