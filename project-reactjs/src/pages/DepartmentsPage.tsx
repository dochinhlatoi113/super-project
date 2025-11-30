import { useState } from 'react';

interface Department {
  id: number;
  name: string;
  manager: string;
  employeeCount: number;
  description: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'on-leave';
}

export default function DepartmentsPage() {
  const [activeTab, setActiveTab] = useState<'departments' | 'employees'>('departments');
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showAssignPermissions, setShowAssignPermissions] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Sample data
  const departments: Department[] = [
    { id: 1, name: 'Phòng Kỹ thuật', manager: 'Nguyễn Văn A', employeeCount: 15, description: 'Phát triển sản phẩm và công nghệ' },
    { id: 2, name: 'Phòng Kinh doanh', manager: 'Trần Thị B', employeeCount: 10, description: 'Bán hàng và chăm sóc khách hàng' },
    { id: 3, name: 'Phòng Nhân sự', manager: 'Lê Văn C', employeeCount: 5, description: 'Quản lý nguồn nhân lực' },
    { id: 4, name: 'Phòng Marketing', manager: 'Phạm Thị D', employeeCount: 8, description: 'Marketing và truyền thông' },
  ];

  const employees: Employee[] = [
    { id: 1, name: 'Nguyễn Văn A', email: 'a@company.com', role: 'Manager', department: 'Phòng Kỹ thuật', permissions: ['read', 'write', 'delete', 'admin'], status: 'active' },
    { id: 2, name: 'Trần Văn B', email: 'b@company.com', role: 'Developer', department: 'Phòng Kỹ thuật', permissions: ['read', 'write'], status: 'active' },
    { id: 3, name: 'Lê Thị C', email: 'c@company.com', role: 'Designer', department: 'Phòng Marketing', permissions: ['read', 'write'], status: 'on-leave' },
    { id: 4, name: 'Phạm Văn D', email: 'd@company.com', role: 'Sales', department: 'Phòng Kinh doanh', permissions: ['read'], status: 'inactive' },
  ];

  const availablePermissions = [
    { id: 'read', name: 'Read', description: 'View data permission' },
    { id: 'write', name: 'Write', description: 'Edit data permission' },
    { id: 'delete', name: 'Delete', description: 'Delete data permission' },
    { id: 'admin', name: 'Admin', description: 'System administration permission' },
  ];

  const handleAssignPermissions = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowAssignPermissions(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Department Management</h1>
          <p className="text-gray-500 mt-1">Manage departments and employee permissions</p>
        </div>
        <button
          onClick={() => setShowAddDepartment(true)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Department</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-6 py-2 rounded-md transition-colors ${
            activeTab === 'departments'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Departments
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-6 py-2 rounded-md transition-colors ${
            activeTab === 'employees'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Employees
        </button>
      </div>

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{dept.name}</h3>
                    <p className="text-sm text-gray-500">Manager: {dept.manager}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{dept.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{dept.employeeCount} employees</span>
                </div>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  View details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Employee</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Email</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Department</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Role</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Permissions</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-t hover:bg-gray-50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold">{emp.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-gray-800">{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{emp.email}</td>
                    <td className="py-4 px-6 text-gray-600">{emp.department}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {emp.permissions.map((perm) => (
                          <span key={perm} className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
                            {perm}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        emp.status === 'active' ? 'bg-green-100 text-green-700' :
                        emp.status === 'on-leave' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {emp.status === 'active' ? 'Active' : 
                         emp.status === 'on-leave' ? 'On Leave' : 
                         'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleAssignPermissions(emp)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Department</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g. IT Department"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Manager name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Department description"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddDepartment(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Permissions Modal */}
      {showAssignPermissions && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Assign Permissions</h3>
            <p className="text-gray-500 mb-6">{selectedEmployee.name} - {selectedEmployee.department}</p>
            
            <div className="space-y-3">
              {availablePermissions.map((perm) => (
                <label key={perm.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={selectedEmployee.permissions.includes(perm.id)}
                    className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{perm.name}</p>
                    <p className="text-sm text-gray-500">{perm.description}</p>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAssignPermissions(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
