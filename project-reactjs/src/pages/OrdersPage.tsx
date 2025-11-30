import StatsGrid from '../components/StatsGrid';

export default function OrdersPage() {
  const stats = [
    { label: 'Total Orders', value: 892 },
    { label: 'Pending', value: 45, color: 'text-yellow-600' },
    { label: 'Processing', value: 128, color: 'text-blue-600' },
    { label: 'Completed', value: 719, color: 'text-green-600' },
  ];

  const orders = [
    { id: 1, orderNumber: '#ORD-1001', customer: 'John Doe', date: '2024-11-28', total: '$1,299', status: 'completed' },
    { id: 2, orderNumber: '#ORD-1002', customer: 'Jane Smith', date: '2024-11-29', total: '$445', status: 'processing' },
    { id: 3, orderNumber: '#ORD-1003', customer: 'Bob Johnson', date: '2024-11-30', total: '$899', status: 'pending' },
    { id: 4, orderNumber: '#ORD-1004', customer: 'Alice Brown', date: '2024-11-30', total: '$234', status: 'shipped' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-500 mt-1">Manage customer orders</p>
        </div>
      </div>

      <StatsGrid stats={stats} columns={4} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Order #</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Total</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium text-indigo-600">{order.orderNumber}</td>
                  <td className="py-4 px-6 text-gray-800">{order.customer}</td>
                  <td className="py-4 px-6 text-gray-600">{order.date}</td>
                  <td className="py-4 px-6 text-gray-800 font-medium">{order.total}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
