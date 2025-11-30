import StatsGrid from '../components/StatsGrid';

export default function CustomerGroupsPage() {
  const stats = [
    { label: 'Total Groups', value: 12 },
    { label: 'Total Members', value: 313 },
    { label: 'Avg. Group Size', value: 26 },
    { label: 'Total Revenue', value: '$272,910' },
  ];

  const groups = [
    { id: 1, name: 'VIP Customers', members: 45, discount: '15%', totalSpent: '$125,890', color: 'bg-purple-500' },
    { id: 2, name: 'Wholesale Buyers', members: 23, discount: '20%', totalSpent: '$89,450', color: 'bg-blue-500' },
    { id: 3, name: 'Regular Customers', members: 156, discount: '5%', totalSpent: '$45,230', color: 'bg-green-500' },
    { id: 4, name: 'New Customers', members: 89, discount: '10%', totalSpent: '$12,340', color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Groups</h1>
          <p className="text-gray-500 mt-1">Organize customers into groups for targeted marketing</p>
        </div>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Create Group
        </button>
      </div>

      <StatsGrid stats={stats} columns={4} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`${group.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.members} members</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">Discount</p>
                <p className="text-lg font-semibold text-gray-800">{group.discount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-lg font-semibold text-gray-800">{group.totalSpent}</p>
              </div>
            </div>

            <div className="mt-4">
              <button className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-sm font-medium">
                View Members
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Group Performance</h3>
        <div className="text-center text-gray-400 py-12">
          <p>Performance comparison chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
