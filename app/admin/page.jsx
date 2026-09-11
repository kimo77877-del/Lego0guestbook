"use client";

import Link from "next/link";
import AdminGate from "@/components/AdminGate";

export default function AdminHomePage() {
  return (
    <AdminGate>
      <main className="mx-auto max-w-lg px-6 py-10">
        <div className="mb-8 flex items-center gap-2">
          <span className="text-3xl">⚙️</span>
          <h1 className="text-2xl font-bold text-forest-800">관리자 모드</h1>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/admin/upload"
            className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-card active:scale-95"
          >
            <span className="text-4xl">📄</span>
            <div>
              <p className="text-lg font-bold text-forest-800">레고 대량 등록</p>
              <p className="text-sm text-forest-500">엑셀/CSV/JSON 파일로 한 번에 등록</p>
            </div>
          </Link>

          <Link
            href="/admin/moderation"
            className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-card active:scale-95"
          >
            <span className="text-4xl">🛡️</span>
            <div>
              <p className="text-lg font-bold text-forest-800">방명록 모더레이션</p>
              <p className="text-sm text-forest-500">부적절한 게시물 숨김 처리</p>
            </div>
          </Link>

          <Link
            href="/"
            className="mt-2 text-center text-sm font-semibold text-forest-400 underline"
          >
            메인 화면으로 돌아가기
          </Link>
        </div>
      </main>
    </AdminGate>
  );
}
