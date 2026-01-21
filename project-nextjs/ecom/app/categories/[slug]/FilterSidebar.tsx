import React from 'react';

export default function FilterSidebar() {
  // Demo filter, bạn có thể thay bằng filter động sau
  return (
    <aside className="w-64 bg-white rounded-lg shadow p-4 sticky top-24 h-fit">
      <h3 className="font-bold mb-4 text-lg">Bộ lọc</h3>
      <div className="mb-4">
        <div className="font-semibold mb-2">Hãng sản xuất</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2"><input type="checkbox" /> Samsung</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> LG</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Dell</label>
        </div>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-2">Kích thước</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2"><input type="checkbox" /> 24 inch</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> 27 inch</label>
        </div>
      </div>
      <div>
        <div className="font-semibold mb-2">Giá</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2"><input type="checkbox" /> Dưới 3 triệu</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> 3-5 triệu</label>
        </div>
      </div>
    </aside>
  );
}
