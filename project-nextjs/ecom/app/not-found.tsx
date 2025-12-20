// app/not-found.tsx
// Trang 404 tuỳ chỉnh, chữ đậm, rõ ràng

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold text-red-600 mb-4">404</h1>
      <div className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy trang</div>
      <div className="text-base text-gray-500">Trang bạn truy cập không tồn tại hoặc đã bị xoá.</div>
    </div>
  );
}
