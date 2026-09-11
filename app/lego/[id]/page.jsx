"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db, COLLECTION_LEGOS, COLLECTION_GUESTBOOK } from "@/lib/firebaseClient";
import { AGE_OPTIONS, DIFFICULTY_STARS, SERIES_OPTIONS, findOption } from "@/lib/constants";
import GuestbookFeed from "@/components/GuestbookFeed";
import GuestbookModal from "@/components/GuestbookModal";

export default function LegoDetailPage() {
  const { id } = useParams();
  const [lego, setLego] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchLego = useCallback(async () => {
    const snap = await getDoc(doc(db, COLLECTION_LEGOS, id));
    if (snap.exists()) {
      setLego({ id: snap.id, ...snap.data() });
    }
  }, [id]);

  const fetchEntries = useCallback(async () => {
    setLoadingEntries(true);
    try {
      // legoId 단일 조건만 사용해 복합 색인 없이도 바로 동작하도록 하고,
      // 정렬/숨김 필터는 클라이언트에서 처리합니다.
      const q = query(
        collection(db, COLLECTION_GUESTBOOK),
        where("legoId", "==", id)
      );
      const snap = await getDocs(q);
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((e) => !e.isHidden)
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setEntries(list);
    } catch (err) {
      console.error(err);
    }
    setLoadingEntries(false);
  }, [id]);

  useEffect(() => {
    fetchLego();
    fetchEntries();
  }, [fetchLego, fetchEntries]);

  if (!lego) {
    return (
      <div className="flex h-screen items-center justify-center text-forest-400">
        <span className="animate-bounce text-5xl">🧱</span>
      </div>
    );
  }

  const ageOpt = findOption(AGE_OPTIONS, lego.ageGroup);
  const seriesOpt = findOption(SERIES_OPTIONS, lego.series);

  return (
    <main className="pb-28">
      {/* 상단 이미지 헤더 */}
      <div className="relative aspect-[4/3] w-full bg-forest-50 sm:aspect-[16/7]">
        {lego.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lego.imageUrl}
            alt={lego.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-7xl">🧱</div>
        )}
        <Link
          href="/"
          className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 font-bold text-forest-600 shadow"
        >
          ← 목록
        </Link>
      </div>

      <div className="px-4 sm:px-6">
        {/* 스펙 카드 */}
        <div className="-mt-8 rounded-3xl bg-white p-5 shadow-soft">
          <h1 className="text-2xl font-bold text-forest-800">{lego.name}</h1>
          {lego.description && (
            <p className="mt-2 text-forest-500">{lego.description}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {seriesOpt && (
              <SpecPill icon={seriesOpt.icon} label={seriesOpt.label} sub="시리즈" />
            )}
            {ageOpt && <SpecPill icon={ageOpt.icon} label={ageOpt.label} sub="연령" />}
            <SpecPill icon="🧩" label={`${lego.pieceCount}피스`} sub="블록 수" />
            <SpecPill
              icon="⭐"
              label={DIFFICULTY_STARS[lego.difficulty] || "⭐"}
              sub="난이도"
            />
          </div>
        </div>

        {/* 완성 인증 버튼 */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-3xl bg-sunny-300 py-4 text-lg font-bold text-forest-800 shadow-soft active:scale-95"
        >
          🏆 이 레고 완성 인증하기
        </button>

        {/* 방명록 피드 */}
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-forest-800">
            🖼️ 이 레고를 완성한 친구들
          </h2>
          <GuestbookFeed entries={entries} loading={loadingEntries} />
        </section>
      </div>

      {showModal && (
        <GuestbookModal
          legoId={id}
          legoName={lego.name}
          onClose={() => setShowModal(false)}
          onSubmitted={fetchEntries}
        />
      )}
    </main>
  );
}

function SpecPill({ icon, label, sub }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-forest-50 py-3">
      <span className="text-2xl">{icon}</span>
      <span className="mt-1 text-sm font-bold text-forest-700">{label}</span>
      <span className="text-[11px] text-forest-400">{sub}</span>
    </div>
  );
}
