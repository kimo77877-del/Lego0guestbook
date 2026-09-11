import imageCompression from "browser-image-compression";

/**
 * 태블릿 카메라로 촬영한 원본 사진은 용량이 커서 업로드/로딩이 느려질 수 있습니다.
 * 업로드 전 브라우저 단에서 리사이즈 + 압축하여 스토리지 비용과 로딩 속도를 최적화합니다.
 */
export async function compressGuestbookPhoto(file) {
  const options = {
    maxSizeMB: 0.6, // 최대 0.6MB로 압축
    maxWidthOrHeight: 1280, // 태블릿/피드 표시에 충분한 해상도
    useWebWorker: true,
    initialQuality: 0.8,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (err) {
    console.error("이미지 압축 실패, 원본 파일을 사용합니다.", err);
    return file;
  }
}
