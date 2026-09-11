"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGate from "@/components/AdminGate";
import { collection, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db, COLLECTION_GUESTBOOK } from "@/lib/firebaseClient";

export default function ModerationPage() {
  return (
    <AdminGate>
      <ModerationList />
    </AdminGate>
  );
}

function ModerationList() {
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("visible"); // visible | hidden | all

  async function fetchEntries() {
    setLoading(true);
    try {
      // 단일 필드(createdAt) 정렬만 사용해 복합 색인 없이 바로 동작합니다.
      // 게시중/숨김 필터는 클라이언트에서 처리합니다.
      const q = query(collection(db, COLLECTION_GUESTBOOK), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setAllEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  const entries = allEntries.filter((e) => {
    if (filter === "visible") return !e.isHidden;
    if (filter === "hidden") return !!e.isHidden;
    return true;
  });

  async function toggleHidden(entry) {
    try {
      await updateDoc(doc(db, COLLECTION_GUESTBOOK, entry.id), {
        isHidden: !entry.isHidden,
      });
      setAllEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, isHidden: !e.isHidden } : e))
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-forest-800">🛡️ 방명록 모더레이션</h1>
        <Link href="/admin" className="text-sm font-semibold text-forest-400">
          ← 관리자 홈
        </Link>
      </div>

      <div className="mb-5 flex gap-2">
        {[
          { key: "visible", label: "게시 중" },
          { key: "hidden", label: "숨김 처리됨" },
          { key: "all", label: "전체" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              filter === tab.key
                ? "bg-forest-500 text-white"
                : "bg-white text-forest-500 shadow-card"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-forest-400">불러오는 중...</p>
      ) : entries.length === 0 ? (
        <p className="text-center text-forest-400">표시할 게시물이 없어요.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="overflow-hidden rounded-2xl bg-white shadow-card"
            >
              <div className="relative aspect-square w-full bg-forest-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entry.photoUrl}
                  alt={entry.nickname}
                  className="h-full w-full object-cover"
                />
                {entry.isHidden && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-bold text-white">
                    숨김 처리됨
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-bold text-forest-700">
                  {entry.nickname} · {entry.legoName}
                </p>
                <p className="truncate text-xs text-forest-500">{entry.comment}</p>
                <button
                  onClick={() => toggleHidden(entry)}
                  className={`mt-2 w-full rounded-full py-1.5 text-xs font-bold ${
                    entry.isHidden
                      ? "bg-forest-100 text-forest-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {entry.isHidden ? "다시 게시하기" : "🚫 숨김 처리"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
