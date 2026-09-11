// 아이들이 글씨를 몰라도 아이콘만 보고 이해할 수 있도록
// 시리즈 / 연령대 / 피스 수 / 난이도를 픽토그램(이모지+색상)으로 매핑합니다.
// 실제 서비스에서는 이모지 대신 자체 제작 일러스트(SVG)로 교체하는 것을 권장합니다.

export const SERIES_OPTIONS = [
  { value: "city", label: "시티", icon: "🚓", color: "bg-forest-100 text-forest-700" },
  { value: "friends", label: "프렌즈", icon: "🏠", color: "bg-sunny-100 text-forest-700" },
  { value: "ninjago", label: "닌자고", icon: "🥷", color: "bg-forest-200 text-forest-800" },
  { value: "technic", label: "테크닉", icon: "⚙️", color: "bg-cream-200 text-forest-700" },
  { value: "duplo", label: "듀플로", icon: "🧸", color: "bg-sunny-200 text-forest-800" },
  { value: "disney", label: "디즈니", icon: "🏰", color: "bg-forest-100 text-forest-700" },
  { value: "starwars", label: "스타워즈", icon: "🚀", color: "bg-forest-200 text-forest-900" },
  { value: "dino", label: "공룡", icon: "🦖", color: "bg-sunny-100 text-forest-700" },
];

export const AGE_OPTIONS = [
  { value: "4-6", label: "4~6세", icon: "🐣" },
  { value: "7-9", label: "7~9세", icon: "🐥" },
  { value: "10-12", label: "10~12세", icon: "🦉" },
  { value: "13+", label: "13세 이상", icon: "🦅" },
];

// 피스 수는 숫자를 못 읽어도 "블록 알갱이 개수"로 크기 감을 잡을 수 있게 단계별 아이콘 구성
export const PIECE_OPTIONS = [
  { value: "small", label: "50피스 이하", range: [0, 50], icon: "🔹" },
  { value: "medium", label: "51~150피스", range: [51, 150], icon: "🔹🔹" },
  { value: "large", label: "151~300피스", range: [151, 300], icon: "🔹🔹🔹" },
  { value: "xlarge", label: "300피스 이상", range: [301, Infinity], icon: "🔹🔹🔹🔹" },
];

// 난이도는 별 개수로 시각화 (1~3)
export const DIFFICULTY_STARS = {
  1: "⭐",
  2: "⭐⭐",
  3: "⭐⭐⭐",
};

export function getPieceBucket(pieceCount) {
  return PIECE_OPTIONS.find(
    (opt) => pieceCount >= opt.range[0] && pieceCount <= opt.range[1]
  )?.value;
}

export function findOption(list, value) {
  return list.find((o) => o.value === value);
}
