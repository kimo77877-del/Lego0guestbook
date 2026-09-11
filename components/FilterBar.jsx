"use client";

import { SERIES_OPTIONS, AGE_OPTIONS, PIECE_OPTIONS } from "@/lib/constants";

function FilterRow({ title, options, selected, onSelect }) {
  return (
    <div className="mb-3">
      <p className="mb-2 px-1 text-sm font-semibold text-forest-600">{title}</p>
      <div className="scroll-touch flex gap-3 overflow-x-auto pb-1">
        {/* 전체 보기 카드 */}
        <button
          onClick={() => onSelect(null)}
          className={`flex min-w-[84px] flex-col items-center justify-center gap-1 rounded-2xl border-2 px-3 py-3 shadow-card transition active:scale-95 ${
            selected === null
              ? "border-forest-500 bg-forest-500 text-white"
              : "border-forest-100 bg-white text-forest-500"
          }`}
        >
          <span className="text-2xl">🌈</span>
          <span className="text-xs font-bold">전체</span>
        </button>

        {options.map((opt) => {
          const isActive = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(isActive ? null : opt.value)}
              className={`flex min-w-[84px] flex-col items-center justify-center gap-1 rounded-2xl border-2 px-3 py-3 shadow-card transition active:scale-95 ${
                isActive
                  ? "border-forest-500 bg-forest-500 text-white"
                  : "border-forest-100 bg-white text-forest-700"
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-xs font-bold">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="rounded-3xl bg-white/70 p-4 shadow-soft">
      <FilterRow
        title="🧩 어떤 시리즈를 찾을까요?"
        options={SERIES_OPTIONS}
        selected={filters.series}
        onSelect={(v) => setFilters((f) => ({ ...f, series: v }))}
      />
      <FilterRow
        title="🎂 나이는 몇 살인가요?"
        options={AGE_OPTIONS}
        selected={filters.age}
        onSelect={(v) => setFilters((f) => ({ ...f, age: v }))}
      />
      <FilterRow
        title="🧱 블록이 얼마나 많나요?"
        options={PIECE_OPTIONS}
        selected={filters.piece}
        onSelect={(v) => setFilters((f) => ({ ...f, piece: v }))}
      />
    </div>
  );
}
