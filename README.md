# 🧱 레고 놀이터 — 레고 선택 및 완성작 방명록 (키즈카페 태블릿용)

React(Next.js) + Tailwind CSS + **Firebase(Firestore + Storage)** 로 구성한 키즈카페용 웹앱입니다.

## 폴더 구조

```
lego-guestbook/
├── app/
│   ├── layout.jsx              # 공통 레이아웃
│   ├── globals.css             # 전역 스타일 (녹색/미색/연노랑 톤)
│   ├── page.jsx                 # 메인: 레고 탐색 + 필터
│   ├── lego/[id]/page.jsx       # 상세 + 완성작 방명록(미니홈피)
│   └── admin/
│       ├── page.jsx             # 관리자 홈 (비밀번호 게이트)
│       ├── upload/page.jsx      # 대량 등록 (CSV/Excel/JSON)
│       └── moderation/page.jsx  # 방명록 모더레이션(숨김 처리)
├── components/
│   ├── FilterBar.jsx            # 픽토그램 필터 (시리즈/연령/피스수)
│   ├── LegoCard.jsx / LegoGrid.jsx
│   ├── GuestbookFeed.jsx        # 인스타 피드 스타일 방명록
│   ├── GuestbookModal.jsx       # 완성 인증 팝업(촬영/업로드/압축)
│   ├── AdminGate.jsx            # 관리자 비밀번호 게이트
│   └── BulkUploadForm.jsx       # 대량 등록 폼
├── lib/
│   ├── firebaseClient.js        # Firebase 앱/Firestore/Storage 초기화
│   ├── constants.js             # 픽토그램/아이콘 매핑
│   └── imageCompress.js
└── firebase/
    ├── firestore.rules           # Firestore 보안 규칙
    ├── storage.rules             # Storage 보안 규칙
    └── sample_legos.csv          # 대량 등록 테스트용 샘플
```

### 데이터 모델 (Firestore, NoSQL)

Supabase(관계형 DB)와 달리 Firestore는 컬렉션/문서 구조입니다.

- **`legos`** 컬렉션 — 문서 1개 = 레고 1종
  `name, series, ageGroup, pieceCount, difficulty, imageUrl, description, createdAt`
- **`guestbookEntries`** 컬렉션 — 문서 1개 = 완성 인증 1건
  `legoId, legoName, nickname, comment, photoUrl, isHidden, createdAt`
  - `legoName`은 상세 화면/모더레이션 화면에서 SQL JOIN 없이 바로 보여주기 위해
    등록 시점에 함께 저장해두는 **비정규화(denormalize)** 값입니다.

---

## 1단계. Firebase 프로젝트 준비

이미 파이어베이스 계정/프로젝트가 있다고 하셨으니, 기존 프로젝트를 그대로 써도 됩니다.

1. [Firebase 콘솔](https://console.firebase.google.com) → 사용할 프로젝트 선택 (없으면 새로 생성)
2. 왼쪽 메뉴 **빌드 > Firestore Database** → "데이터베이스 만들기" → **프로덕션 모드** 선택 →
   리전은 한국과 가까운 `asia-northeast3(서울)` 권장
3. 왼쪽 메뉴 **빌드 > Storage** → "시작하기" → 기본 설정으로 생성
4. 왼쪽 메뉴 **프로젝트 설정(톱니바퀴) > 일반** → 아래로 스크롤 → "내 앱" 에서
   **웹 앱(</> 아이콘) 추가** → 앱 닉네임 입력(예: lego-guestbook) → 등록
   → 화면에 나오는 `firebaseConfig` 객체 값을 복사해 둡니다.

## 2단계. 보안 규칙 등록

1. **Firestore Database > 규칙** 탭 → `firebase/firestore.rules` 내용을 그대로 붙여넣고 **게시**
2. **Storage > 규칙** 탭 → `firebase/storage.rules` 내용을 그대로 붙여넣고 **게시**

> 두 규칙 모두 키오스크(매장 내부 태블릿) 용도에 맞춘 데모 수준 보안입니다.
> 파일 안에 운영 전환 시 강화 방법 주석이 포함되어 있어요.

## 3단계. 로컬 환경 설정

```bash
npm install
cp .env.local.example .env.local
```

`.env.local` 파일을 열어 1단계에서 복사한 `firebaseConfig` 값을 채워 넣습니다.

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_ADMIN_PASSCODE=매장에서 사용할 관리자 비밀번호
```

## 4단계. 실행

```bash
npm run dev
```

`http://localhost:3000` 접속 → 메인(레고 탐색) 화면이 보이면 정상입니다.
`/admin` 경로로 이동하면 관리자 모드로 진입할 수 있습니다.

## 5단계. 레고 데이터 등록 (관리자 대량 등록 기능)

1. `/admin` → 비밀번호 입력 → **레고 대량 등록** 진입
2. `firebase/sample_legos.csv` 파일로 먼저 테스트해 보세요.
3. 지원 형식: `.csv`, `.xlsx`, `.json`
4. 파일의 필수 컬럼: `name, series, age_group, piece_count` (선택: `difficulty, image_url, description`)
   - 업로드 시 내부적으로 Firestore 문서 형식(camelCase)으로 자동 변환되어 저장됩니다.
   - `series` 값은 `lib/constants.js`의 `SERIES_OPTIONS.value` 와 반드시 일치해야 아이콘이 매칭됩니다.
     (city, friends, ninjago, technic, duplo, disney, starwars, dino)
   - `age_group` 값: `4-6`, `7-9`, `10-12`, `13+`
   - `difficulty`: 1~3 (별 개수)
5. 미리보기 확인 후 **일괄 등록하기** 버튼을 누르면 Firestore에 저장됩니다
   (내부적으로 `writeBatch`를 사용해 여러 건을 한 번에 처리해요).

## 6단계. 아이들의 완성 인증 흐름

1. 메인 화면에서 픽토그램 필터로 레고를 찾습니다 (글자를 몰라도 아이콘만으로 조작 가능).
2. 레고 카드를 누르면 상세 페이지로 이동, 스펙과 기존 완성작 피드를 확인합니다.
3. **완성 인증하기** 버튼 → 사진 찍기/앨범 선택 → 닉네임/한줄소감 입력 → 등록
4. 업로드 전 `lib/imageCompress.js`에서 자동으로 이미지가 압축(최대 0.6MB, 1280px)되어
   Firebase Storage 용량과 로딩 속도를 절약합니다.

## 7단계. 모더레이션 (부적절 게시물 관리)

1. `/admin/moderation` 에서 게시 중 / 숨김 처리됨 / 전체 탭으로 필터링합니다.
2. 각 카드의 **🚫 숨김 처리** 버튼 한 번으로 즉시 비공개 처리됩니다 (완전 삭제가 아닌 숨김이라 복구 가능).
3. 숨김 처리된 게시물은 방명록 피드(`isHidden` 값을 앱에서 필터링)에서 자동으로 제외됩니다.

---

## ⚠️ 운영 배포 전 보안 체크리스트

현재 관리자 모드는 **프론트엔드 비밀번호 게이트 + 공개 Firestore/Storage 규칙** 조합으로
구현된 데모/키오스크 수준의 보호입니다. 매장 내부 태블릿에서만 접근 가능하다면 충분하지만,
외부에 공개되는 서비스로 확장한다면 아래를 권장합니다:

- Firebase Authentication으로 관리자 로그인 도입 후, `firestore.rules`/`storage.rules`의
  "데모 단계" 표시된 부분을 `if request.auth != null` 등 인증 조건으로 교체
- 대량 등록/숨김 처리 같은 관리자 액션은 Cloud Functions(서버단)로 이전해 클라이언트가
  직접 쓰기 권한을 갖지 않도록 강화
- Storage 업로드 용량/횟수 제한(App Check 등) 설정

## 배포

Vercel에 GitHub 저장소를 연결하고 위 Firebase 환경변수 6개 + 관리자 비밀번호를
Vercel 프로젝트 설정에 등록하면 `npm run build` 기준으로 바로 배포됩니다.
태블릿에서는 배포된 URL을 홈 화면에 추가해 키오스크 모드(브라우저 풀스크린 PWA)로
사용하는 것을 권장합니다.
