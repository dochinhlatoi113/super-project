import StatsGrid from '../components/StatsGrid';

export default function PromotionsPage() {
  const stats = [
    { label: 'Active Promotions', value: 12 },
    { label: 'Total Discount Given', value: '$15,890' },
    { label: 'Redemption Rate', value: '67%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Promotions & Discounts</h1>
          <p className="text-gray-500 mt-1">Manage promotional codes and offers</p>
        </div>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Create Promotion
        </button>
      </div>

      <StatsGrid stats={stats} columns={3} />

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Promotions</h3>
        <div className="space-y-3">
          <div className="p-4 border rounded-lg hover:bg-gray-50 transition">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">SUMMER25</h4>
                <p className="text-sm text-gray-500">25% off all items</p>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                Active
              </span>
            </div>
          </div>
          <div className="p-4 border rounded-lg hover:bg-gray-50 transition">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">FREESHIP</h4>
                <p className="text-sm text-gray-500">Free shipping on orders over $50</p>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
