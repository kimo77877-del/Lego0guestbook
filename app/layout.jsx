import "./globals.css";

export const metadata = {
  title: "레고 놀이터 방명록",
  description: "키즈카페 레고 선택 및 완성작 방명록",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-cream-100 text-forest-900 overflow-x-hidden">
        <div className="mx-auto min-h-screen max-w-[1400px]">{children}</div>
      </body>
    </html>
  );
}
