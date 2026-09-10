/**
 * Tiện ích ảnh dùng chung cho mọi chỗ người dùng tải ảnh lên: ảnh nền trang,
 * ảnh cover, ảnh đại diện đơn vị tổ chức.
 *
 * Ảnh luôn được thu nhỏ và xuất JPEG trước khi giữ: sự kiện hiện tại được lưu
 * vào sessionStorage (~5MB) để tab trang công khai đọc lại, còn ảnh gốc từ
 * điện thoại thường nặng vài MB.
 *
 * Để ở file .ts riêng cũng tránh được một cái bẫy: các file component import
 * icon `Image` từ lucide-react, và tên đó che mất constructor Image của trình duyệt.
 */
export async function downscaleToDataUrl(src: string, maxW: number): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = document.createElement("img");
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = src;
  });
  const scale = Math.min(1, maxW / img.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

/** Đọc file ảnh người dùng chọn thành data URL đã thu nhỏ. */
export async function readImageFile(file: File, maxW: number): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    return await downscaleToDataUrl(url, maxW);
  } finally {
    URL.revokeObjectURL(url);
  }
}
