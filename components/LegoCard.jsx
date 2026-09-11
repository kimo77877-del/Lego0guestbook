"use client";

import Link from "next/link";
import { AGE_OPTIONS, DIFFICULTY_STARS, findOption } from "@/lib/constants";

export default function LegoCard({ lego }) {
  const ageOpt = findOption(AGE_OPTIONS, lego.ageGroup);

  return (
    <Link
      href={`/lego/${lego.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card transition active:scale-[0.97]"
    >
      <div className="relative aspect-square w-full bg-forest-50">
        {lego.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lego.imageUrl}
            alt={lego.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">🧱</div>
        )}

        {/* 연령 배지 */}
        {ageOpt && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-bold shadow">
            <span>{ageOpt.icon}</span>
            <span>{ageOpt.label}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="truncate text-base font-bold text-forest-800">{lego.name}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-sunny-400">
            {DIFFICULTY_STARS[lego.difficulty] || "⭐"}
          </span>
          <span className="rounded-full bg-forest-50 px-2 py-0.5 text-xs font-semibold text-forest-600">
            🧩 {lego.pieceCount}피스
          </span>
        </div>
      </div>
    </Link>
  );
}
