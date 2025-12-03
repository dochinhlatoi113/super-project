import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import StatsGrid from '../components/StatsGrid';

function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const stats = [
    { 
      label: t('dashboard.totalUsers'), 
      value: '1,234', 
      trend: { value: `12% ${t('dashboard.fromLastMonth')}`, isPositive: true },
      icon: (
        <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      )
    },
    { 
      label: t('dashboard.revenue'), 
      value: '$45,678', 
      trend: { value: `23% ${t('dashboard.fromLastMonth')}`, isPositive: true },
      icon: (
        <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      )
    },
    { 
      label: t('dashboard.orders'), 
      value: '892', 
      trend: { value: `8% ${t('dashboard.fromLastMonth')}`, isPositive: true },
      icon: (
        <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      )
    },
    { 
      label: t('dashboard.products'), 
      value: '156', 
      trend: { value: `5% ${t('dashboard.fromLastMonth')}`, isPositive: true },
      icon: (
        <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">{t('dashboard.welcome')}, {user?.name}!</h1>
        <p className="text-indigo-100">{t('dashboard.subtitle')}</p>
      </div>

      <StatsGrid stats={stats} columns={4} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>Chart will be here</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">U</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">New user registered</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
