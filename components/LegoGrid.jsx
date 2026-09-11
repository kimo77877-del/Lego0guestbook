"use client";

import LegoCard from "./LegoCard";

export default function LegoGrid({ legos }) {
  if (!legos.length) {
    return (
      <div className="mt-16 flex flex-col items-center gap-3 text-forest-400">
        <span className="text-6xl">🔍</span>
        <p className="text-lg font-bold">조건에 맞는 레고가 없어요</p>
        <p className="text-sm">다른 아이콘을 눌러서 다시 찾아볼까요?</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 pb-24 pt-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {legos.map((lego) => (
        <LegoCard key={lego.id} lego={lego} />
      ))}
    </div>
  );
}
