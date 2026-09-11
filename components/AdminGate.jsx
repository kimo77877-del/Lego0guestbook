"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "lego_admin_ok";

export default function AdminGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setUnlocked(true);
    }
    setChecked(true);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const passcode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "1234";
    if (input === passcode) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setUnlocked(true);
      setError("");
    } else {
      setError("비밀번호가 올바르지 않아요.");
    }
  }

  if (!checked) return null;

  if (!unlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
        <span className="text-5xl">🔐</span>
        <h1 className="text-xl font-bold text-forest-800">관리자 모드</h1>
        <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-3">
          <input
            type="password"
            inputMode="numeric"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="비밀번호 입력"
            className="rounded-2xl border-2 border-forest-100 bg-white px-4 py-3 text-center text-lg outline-none focus:border-forest-400"
            autoFocus
          />
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="rounded-2xl bg-forest-500 py-3 font-bold text-white shadow-soft active:scale-95"
          >
            입장하기
          </button>
        </form>
      </div>
    );
  }

  return children;
}
