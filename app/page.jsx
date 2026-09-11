"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, COLLECTION_LEGOS } from "@/lib/firebaseClient";
import FilterBar from "@/components/FilterBar";
import LegoGrid from "@/components/LegoGrid";
import { PIECE_OPTIONS, findOption } from "@/lib/constants";

export default function HomePage() {
  const [legos, setLegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ series: null, age: null, piece: null });

  useEffect(() => {
    async function fetchLegos() {
      setLoading(true);
      try {
        const q = query(collection(db, COLLECTION_LEGOS), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setLegos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchLegos();
  }, []);

  const filteredLegos = useMemo(() => {
    return legos.filter((lego) => {
      if (filters.series && lego.series !== filters.series) return false;
      if (filters.age && lego.ageGroup !== filters.age) return false;
      if (filters.piece) {
        const bucket = findOption(PIECE_OPTIONS, filters.piece);
        if (
          bucket &&
          (lego.pieceCount < bucket.range[0] || lego.pieceCount > bucket.range[1])
        ) {
          return false;
        }
      }
      return true;
    });
  }, [legos, filters]);

  return (
    <main className="px-4 pt-6 sm:px-6">
      <header className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🧱</span>
          <h1 className="text-2xl font-bold text-forest-800 sm:text-3xl">
            레고 놀이터
          </h1>
        </div>
        <Link
          href="/admin"
          className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-forest-400 shadow-card"
        >
          ⚙️ 관리자
        </Link>
      </header>

      <FilterBar filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="mt-16 text-center text-forest-400">
          <span className="animate-bounce text-5xl">🧱</span>
          <p className="mt-2 font-bold">레고를 불러오는 중이에요...</p>
        </div>
      ) : (
        <LegoGrid legos={filteredLegos} />
      )}
    </main>
  );
}
