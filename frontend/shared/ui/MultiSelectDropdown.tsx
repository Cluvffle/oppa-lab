"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
}

interface MultiSelectDropdownProps<T extends string = string> {
  label: string; // 버튼 기본 라벨 (예: "성격")
  options: DropdownOption<T>[];
  selected: T[];
  onChange: (next: T[]) => void;
}

export function MultiSelectDropdown<T extends string = string>({
  label,
  options,
  selected,
  onChange,
}: MultiSelectDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫힘
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const toggle = (v: T) => {
    if (selected.includes(v)) {
      onChange(selected.filter((s) => s !== v));
    } else {
      onChange([...selected, v]);
    }
  };

  const clear = () => onChange([]);

  const hasSelection = selected.length > 0;
  const buttonText = hasSelection
    ? `${label} · ${selected.length}`
    : label;

  return (
    <div className="dropdown" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "dropdown__trigger",
          hasSelection && "dropdown__trigger--active",
          open && "dropdown__trigger--open"
        )}
      >
        {buttonText}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden
          className="dropdown__caret"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div className="dropdown__panel">
          <div className="dropdown__panel-inner">
            {options.map((opt) => {
              const checked = selected.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className={cn(
                    "dropdown__option",
                    checked && "dropdown__option--checked"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(opt.value)}
                    className="dropdown__checkbox"
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
          {hasSelection && (
            <button
              type="button"
              onClick={clear}
              className="dropdown__clear"
            >
              선택 해제
            </button>
          )}
        </div>
      )}
    </div>
  );
}
