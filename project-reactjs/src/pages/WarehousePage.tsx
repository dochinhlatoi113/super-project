export default function WarehousePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Warehouse Management</h1>
          <p className="text-gray-500 mt-1">Manage warehouse locations and stock</p>
        </div>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Add Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Warehouse A</h3>
          <p className="text-gray-500 text-sm mb-4">New York, USA</p>
          <p className="text-2xl font-bold text-gray-800">85% Capacity</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Warehouse B</h3>
          <p className="text-gray-500 text-sm mb-4">Los Angeles, USA</p>
          <p className="text-2xl font-bold text-gray-800">62% Capacity</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Warehouse C</h3>
          <p className="text-gray-500 text-sm mb-4">Chicago, USA</p>
          <p className="text-2xl font-bold text-gray-800">43% Capacity</p>
        </div>
      </div>
    </div>
  );
}
