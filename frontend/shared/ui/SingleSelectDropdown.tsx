"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

export interface SingleDropdownOption<T extends string = string> {
  value: T | null; // null = "전체"
  label: string;
}

interface Props<T extends string = string> {
  label: string; // 미선택 시 트리거 텍스트 (예: "누가")
  options: SingleDropdownOption<T>[];
  value: T | null;
  onChange: (next: T | null) => void;
  /** 옵션이 짧고 적을 때 (3~4개). 패널 폭을 trigger 에 맞춰 좁게 */
  compact?: boolean;
}

/**
 * 단일 선택 dropdown. MultiSelectDropdown 과 같은 시각 스타일 (.dropdown, .dropdown__trigger 등) 사용.
 * value 가 null 이면 label 만, 아니면 매칭되는 옵션 라벨 노출.
 */
export function SingleSelectDropdown<T extends string = string>({
  label,
  options,
  value,
  onChange,
  compact = false,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  const selected = options.find((o) => o.value === value);
  const hasSelection = value !== null;
  const buttonText = hasSelection && selected ? selected.label : label;

  return (
    <div className={cn("dropdown", compact && "dropdown--compact")} ref={rootRef}>
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
              const checked = value === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value ?? "__all"}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "dropdown__option",
                    checked && "dropdown__option--checked"
                  )}
                >
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
