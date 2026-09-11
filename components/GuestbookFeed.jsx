"use client";

export default function GuestbookFeed({ entries, loading }) {
  if (loading) {
    return (
      <div className="py-10 text-center text-forest-400">
        <span className="animate-pulse text-4xl">📸</span>
        <p className="mt-2 font-bold">친구들의 사진을 불러오는 중...</p>
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-3xl bg-forest-50 py-10 text-forest-400">
        <span className="text-5xl">🥇</span>
        <p className="font-bold">아직 완성한 친구가 없어요!</p>
        <p className="text-sm">첫 번째로 완성 인증을 남겨볼까요?</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <article
          key={entry.id}
          className="overflow-hidden rounded-3xl bg-white shadow-card"
        >
          <div className="relative aspect-square w-full bg-forest-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.photoUrl}
              alt={`${entry.nickname}의 완성작`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-3">
            <p className="flex items-center gap-1 text-sm font-bold text-forest-700">
              <span>🙋</span>
              {entry.nickname}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-forest-600">
              {entry.comment}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
