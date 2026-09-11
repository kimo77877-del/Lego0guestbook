"use client";

import { useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  db,
  storage,
  COLLECTION_GUESTBOOK,
  STORAGE_PATH_GUESTBOOK_PHOTOS,
} from "@/lib/firebaseClient";
import { compressGuestbookPhoto } from "@/lib/imageCompress";

const STEP_PHOTO = "photo";
const STEP_INFO = "info";
const STEP_DONE = "done";

export default function GuestbookModal({ legoId, legoName, onClose, onSubmitted }) {
  const [step, setStep] = useState(STEP_PHOTO);
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [nickname, setNickname] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  function handlePickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStep(STEP_INFO);
  }

  async function handleSubmit() {
    setErrorMsg("");

    if (!nickname.trim()) {
      setErrorMsg("닉네임을 입력해 주세요.");
      return;
    }
    if (!comment.trim()) {
      setErrorMsg("한 줄 소감을 남겨 주세요.");
      return;
    }
    if (!photoFile) {
      setErrorMsg("완성 사진을 선택해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      // 1) 업로드 전 클라이언트 측 압축
      const compressed = await compressGuestbookPhoto(photoFile);

      // 2) Firebase Storage 업로드
      const fileName = `${STORAGE_PATH_GUESTBOOK_PHOTOS}/${legoId}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.jpg`;
      const fileRef = ref(storage, fileName);

      await uploadBytes(fileRef, compressed, { contentType: "image/jpeg" });
      const photoUrl = await getDownloadURL(fileRef);

      // 3) Firestore에 방명록 등록
      // legoName은 조인 없이 목록/모더레이션 화면에서 바로 보여주기 위해 함께 저장합니다.
      await addDoc(collection(db, COLLECTION_GUESTBOOK), {
        legoId,
        legoName: legoName || "",
        nickname: nickname.trim().slice(0, 12),
        comment: comment.trim().slice(0, 60),
        photoUrl,
        isHidden: false,
        createdAt: serverTimestamp(),
      });

      setStep(STEP_DONE);
      onSubmitted?.();
    } catch (err) {
      console.error(err);
      setErrorMsg("등록 중 문제가 발생했어요. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest-900/50 sm:items-center">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-cream-50 p-5 shadow-soft sm:rounded-3xl">
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-forest-800">
            {step === STEP_DONE ? "🎉 완성 인증 완료!" : "🏆 완성 인증하기"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-white px-3 py-1 text-forest-500 shadow-card"
          >
            닫기
          </button>
        </div>

        {/* STEP 1: 사진 선택 */}
        {step === STEP_PHOTO && (
          <div className="flex flex-col gap-4">
            <p className="text-center text-forest-500">
              완성한 레고 사진을 찍거나 골라주세요!
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center gap-2 rounded-3xl bg-forest-500 py-8 text-white shadow-soft active:scale-95"
              >
                <span className="text-4xl">📷</span>
                <span className="font-bold">사진 찍기</span>
              </button>
              <button
                onClick={() => galleryInputRef.current?.click()}
                className="flex flex-col items-center gap-2 rounded-3xl bg-sunny-300 py-8 text-forest-800 shadow-soft active:scale-95"
              >
                <span className="text-4xl">🖼️</span>
                <span className="font-bold">앨범에서 선택</span>
              </button>
            </div>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePickFile}
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePickFile}
            />
          </div>
        )}

        {/* STEP 2: 닉네임 + 덧글 */}
        {step === STEP_INFO && (
          <div className="flex flex-col gap-4">
            {previewUrl && (
              <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-3xl shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="완성작 미리보기"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => {
                    setPhotoFile(null);
                    setPreviewUrl(null);
                    setStep(STEP_PHOTO);
                  }}
                  className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-bold shadow"
                >
                  다시 찍기
                </button>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-bold text-forest-600">
                🙋 닉네임 (최대 12자)
              </label>
              <input
                value={nickname}
                maxLength={12}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="예) 레고왕민준"
                className="w-full rounded-2xl border-2 border-forest-100 bg-white px-4 py-3 text-lg outline-none focus:border-forest-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-forest-600">
                💬 한 줄 소감 (최대 60자)
              </label>
              <textarea
                value={comment}
                maxLength={60}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="예) 정말 재밌게 만들었어요!"
                className="w-full resize-none rounded-2xl border-2 border-forest-100 bg-white px-4 py-3 text-lg outline-none focus:border-forest-400"
              />
            </div>

            {errorMsg && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">
                {errorMsg}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-2xl bg-forest-500 py-4 text-lg font-bold text-white shadow-soft active:scale-95 disabled:opacity-60"
            >
              {submitting ? "등록하는 중..." : "🎈 방명록에 등록하기"}
            </button>
          </div>
        )}

        {/* STEP 3: 완료 */}
        {step === STEP_DONE && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="text-6xl">🎉</span>
            <p className="text-lg font-bold text-forest-700">
              완성 인증이 등록되었어요!
            </p>
            <p className="text-forest-500">다른 친구들도 볼 수 있어요 :)</p>
            <button
              onClick={onClose}
              className="mt-2 rounded-2xl bg-forest-500 px-6 py-3 font-bold text-white shadow-soft"
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
