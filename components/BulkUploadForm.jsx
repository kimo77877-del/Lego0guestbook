"use client";

import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db, COLLECTION_LEGOS } from "@/lib/firebaseClient";

// 업로드 파일(CSV/Excel/JSON)에서 기대하는 컬럼명 (사람이 읽기 쉬운 snake_case)
// name, series, age_group, piece_count, difficulty, image_url, description
const REQUIRED_FIELDS = ["name", "series", "age_group", "piece_count"];
const FIRESTORE_BATCH_LIMIT = 450; // Firestore batch 최대 500건 제한에 여유를 둠

function normalizeRow(row) {
  // 파일의 snake_case 컬럼을 Firestore 문서용 camelCase 필드로 변환
  return {
    name: String(row.name ?? "").trim(),
    series: String(row.series ?? "").trim(),
    ageGroup: String(row.age_group ?? "").trim(),
    pieceCount: Number(row.piece_count ?? 0),
    difficulty: Number(row.difficulty ?? 1),
    imageUrl: row.image_url ? String(row.image_url).trim() : null,
    description: row.description ? String(row.description).trim() : null,
  };
}

function validateRows(rows) {
  const camelRequired = ["name", "series", "ageGroup", "pieceCount"];
  const errors = [];
  rows.forEach((row, idx) => {
    camelRequired.forEach((field) => {
      if (!row[field] && row[field] !== 0) {
        errors.push(`${idx + 1}행: '${field}' 값이 비어 있어요.`);
      }
    });
  });
  return errors;
}

async function insertRowsInBatches(rows) {
  for (let i = 0; i < rows.length; i += FIRESTORE_BATCH_LIMIT) {
    const chunk = rows.slice(i, i + FIRESTORE_BATCH_LIMIT);
    const batch = writeBatch(db);
    chunk.forEach((row) => {
      const docRef = doc(collection(db, COLLECTION_LEGOS));
      batch.set(docRef, { ...row, createdAt: serverTimestamp() });
    });
    await batch.commit();
  }
}

export default function BulkUploadForm() {
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState([]);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState("");

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResultMsg("");

    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const normalized = result.data.map(normalizeRow);
          setRows(normalized);
          setErrors(validateRows(normalized));
        },
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const wb = XLSX.read(evt.target.result, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        const normalized = json.map(normalizeRow);
        setRows(normalized);
        setErrors(validateRows(normalized));
      };
      reader.readAsBinaryString(file);
    } else if (ext === "json") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          const arr = Array.isArray(parsed) ? parsed : parsed.legos || [];
          const normalized = arr.map(normalizeRow);
          setRows(normalized);
          setErrors(validateRows(normalized));
        } catch (err) {
          setErrors(["JSON 형식이 올바르지 않아요."]);
        }
      };
      reader.readAsText(file);
    } else {
      setErrors(["CSV, XLSX, JSON 파일만 지원해요."]);
    }
  }

  async function handleBulkInsert() {
    if (!rows.length || errors.length) return;
    setSubmitting(true);
    setResultMsg("");

    try {
      await insertRowsInBatches(rows);
      setResultMsg(`✅ ${rows.length}개의 레고가 등록되었어요!`);
      setRows([]);
      setFileName("");
    } catch (err) {
      console.error(err);
      setResultMsg("❌ 등록 중 오류가 발생했어요: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-3xl bg-forest-50 p-4 text-sm text-forest-600">
        <p className="font-bold">📋 파일 형식 안내</p>
        <p className="mt-1">
          다음 컬럼명을 포함한 CSV / Excel(.xlsx) / JSON 파일을 업로드하세요:
        </p>
        <code className="mt-1 block rounded-lg bg-white px-2 py-1 text-xs">
          name, series, age_group, piece_count, difficulty, image_url, description
        </code>
        <p className="mt-2">
          - series 값 예시: city, friends, ninjago, technic, duplo, disney, starwars, dino
          <br />- age_group 값 예시: 4-6, 7-9, 10-12, 13+
          <br />- difficulty: 1~3 (별 개수)
        </p>
      </div>

      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-forest-300 bg-white py-8 text-forest-500">
        <span className="text-4xl">📤</span>
        <span className="font-bold">
          {fileName || "CSV / Excel / JSON 파일 선택"}
        </span>
        <input
          type="file"
          accept=".csv,.xlsx,.xls,.json"
          className="hidden"
          onChange={handleFile}
        />
      </label>

      {errors.length > 0 && (
        <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-500">
          {errors.slice(0, 5).map((err, i) => (
            <p key={i}>{err}</p>
          ))}
          {errors.length > 5 && <p>...외 {errors.length - 5}건</p>}
        </div>
      )}

      {rows.length > 0 && errors.length === 0 && (
        <div>
          <p className="mb-2 text-sm font-bold text-forest-600">
            미리보기 ({rows.length}건)
          </p>
          <div className="scroll-touch max-h-64 overflow-auto rounded-2xl border border-forest-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-forest-50">
                <tr>
                  <th className="p-2">이름</th>
                  <th className="p-2">시리즈</th>
                  <th className="p-2">연령</th>
                  <th className="p-2">피스</th>
                  <th className="p-2">난이도</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 20).map((r, i) => (
                  <tr key={i} className="border-t border-forest-50">
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.series}</td>
                    <td className="p-2">{r.ageGroup}</td>
                    <td className="p-2">{r.pieceCount}</td>
                    <td className="p-2">{r.difficulty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button
        onClick={handleBulkInsert}
        disabled={!rows.length || errors.length > 0 || submitting}
        className="rounded-2xl bg-forest-500 py-4 font-bold text-white shadow-soft active:scale-95 disabled:opacity-50"
      >
        {submitting ? "등록하는 중..." : `📥 ${rows.length || ""}건 일괄 등록하기`}
      </button>

      {resultMsg && <p className="text-center font-semibold">{resultMsg}</p>}
    </div>
  );
}
