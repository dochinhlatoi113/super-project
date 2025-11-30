import StatsGrid from '../components/StatsGrid';

export default function InventoryPage() {
  const stats = [
    { label: 'Total Inventory Value', value: '$487,590' },
    { label: 'Items to Reorder', value: 23, color: 'text-yellow-600' },
    { label: 'Total Items', value: '1,456' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Track and manage your inventory levels</p>
        </div>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Add Stock
        </button>
      </div>

      <StatsGrid stats={stats} columns={3} />

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory Overview</h3>
        <div className="text-center text-gray-400 py-12">
          <p>Inventory chart and details will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
