"use client";

import Link from "next/link";
import AdminGate from "@/components/AdminGate";
import BulkUploadForm from "@/components/BulkUploadForm";

export default function BulkUploadPage() {
  return (
    <AdminGate>
      <main className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-forest-800">📄 레고 대량 등록</h1>
          <Link href="/admin" className="text-sm font-semibold text-forest-400">
            ← 관리자 홈
          </Link>
        </div>
        <BulkUploadForm />
      </main>
    </AdminGate>
  );
}
