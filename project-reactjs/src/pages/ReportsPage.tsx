import StatsGrid from '../components/StatsGrid';

export default function ReportsPage() {
  const stats = [
    { 
      label: 'Total Revenue', 
      value: '$128,590',
      trend: { value: '12% from last month', isPositive: true }
    },
    { 
      label: 'Total Orders', 
      value: 892,
      trend: { value: '8% from last month', isPositive: true }
    },
    { 
      label: 'Avg. Order Value', 
      value: '$144',
      trend: { value: '3% from last month', isPositive: true }
    },
    { 
      label: 'Conversion Rate', 
      value: '3.2%',
      trend: { value: '0.5% from last month', isPositive: false }
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">View business insights and reports</p>
        </div>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Generate Report
        </button>
      </div>

      <StatsGrid stats={stats} columns={4} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>Revenue chart will be displayed here</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Products</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>Top products chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
