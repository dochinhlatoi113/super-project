import StatsGrid from '../components/StatsGrid';

export default function MarketingPage() {
  const stats = [
    { label: 'Active Campaigns', value: 8 },
    { label: 'Total Reach', value: '45.2K' },
    { label: 'Conversion Rate', value: '3.8%' },
    { label: 'ROI', value: '285%', color: 'text-green-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Marketing Campaigns</h1>
          <p className="text-gray-500 mt-1">Manage marketing campaigns and analytics</p>
        </div>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          New Campaign
        </button>
      </div>

      <StatsGrid stats={stats} columns={4} />

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Campaign Performance</h3>
        <div className="text-center text-gray-400 py-12">
          <p>Campaign analytics will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
