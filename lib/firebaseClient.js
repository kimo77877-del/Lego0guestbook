import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.warn(
    "[firebaseClient] 환경변수가 설정되지 않았습니다. .env.local을 확인하세요."
  );
}

// Next.js 개발 모드에서 중복 초기화 방지
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

// Firestore 컬렉션 이름
export const COLLECTION_LEGOS = "legos";
export const COLLECTION_GUESTBOOK = "guestbookEntries";

// Storage 폴더(경로) 접두사
export const STORAGE_PATH_GUESTBOOK_PHOTOS = "guestbook-photos";
