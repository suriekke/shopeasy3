import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface LoginStats {
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  todayLogins: number;
  weekLogins: number;
  monthLogins: number;
  recentRegistrations: number;
}

interface UserLogin {
  id: string;
  phone: string;
  name: string;
  created_at: string;
  last_login: string;
  is_active: boolean;
  is_verified: boolean;
  daysSinceLastLogin: number | null;
  daysSinceRegistration: number;
  loginStatus: string;
}

interface LoginTrend {
  date: string;
  registrations: number;
  logins: number;
}

interface FailedAttempts {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  neverLoggedIn: number;
  verificationRate: string;
}

interface RecentActivity {
  id: string;
  phone: string;
  name: string;
  lastLogin: string;
  timeAgo: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'trends' | 'failed' | 'activity'>('overview');
  const [loading, setLoading] = useState(false);
  const [loginStats, setLoginStats] = useState<LoginStats | null>(null);
  const [userLogins, setUserLogins] = useState<UserLogin[]>([]);
  const [loginTrends, setLoginTrends] = useState<LoginTrend[]>([]);
  const [failedAttempts, setFailedAttempts] = useState<FailedAttempts | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [trendPeriod, setTrendPeriod] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    fetchData();
  }, [activeTab, trendPeriod]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'overview':
          const statsResponse = await axios.get('http://localhost:5000/analytics/login-stats');
          setLoginStats(statsResponse.data.stats);
          break;
        case 'users':
          const usersResponse = await axios.get('http://localhost:5000/analytics/user-logins');
          setUserLogins(usersResponse.data.users);
          break;
        case 'trends':
          const trendsResponse = await axios.get(`http://localhost:5000/analytics/login-trends?period=${trendPeriod}`);
          setLoginTrends(trendsResponse.data.trends);
          break;
        case 'failed':
          const failedResponse = await axios.get('http://localhost:5000/analytics/failed-attempts');
          setFailedAttempts(failedResponse.data.failedAttempts);
          break;
        case 'activity':
          const activityResponse = await axios.get('http://localhost:5000/analytics/recent-activity');
          setRecentActivity(activityResponse.data.recentActivity);
          break;
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
    setLoading(false);
  };

  const StatCard = ({ title, value, subtitle, color = 'blue' }: { title: string; value: number | string; subtitle?: string; color?: string }) => (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 border-${color}-500`}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>
          
          {/* Tabs */}
          <div className="flex space-x-4 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              User Logins
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                activeTab === 'trends'
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Login Trends
            </button>
            <button
              onClick={() => setActiveTab('failed')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                activeTab === 'failed'
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Failed Attempts
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                activeTab === 'activity'
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Recent Activity
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Login Statistics Overview</h2>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : loginStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Users"
                    value={loginStats.totalUsers}
                    subtitle="Registered users"
                    color="blue"
                  />
                  <StatCard
                    title="Active Users"
                    value={loginStats.activeUsers}
                    subtitle="Currently active"
                    color="green"
                  />
                  <StatCard
                    title="Verified Users"
                    value={loginStats.verifiedUsers}
                    subtitle="OTP verified"
                    color="purple"
                  />
                  <StatCard
                    title="Today's Logins"
                    value={loginStats.todayLogins}
                    subtitle="Logged in today"
                    color="pink"
                  />
                  <StatCard
                    title="This Week"
                    value={loginStats.weekLogins}
                    subtitle="Logged in this week"
                    color="indigo"
                  />
                  <StatCard
                    title="This Month"
                    value={loginStats.monthLogins}
                    subtitle="Logged in this month"
                    color="yellow"
                  />
                  <StatCard
                    title="Recent Registrations"
                    value={loginStats.recentRegistrations}
                    subtitle="Registered this week"
                    color="red"
                  />
                  <StatCard
                    title="Verification Rate"
                    value={`${((loginStats.verifiedUsers / loginStats.totalUsers) * 100).toFixed(1)}%`}
                    subtitle="Successfully verified"
                    color="teal"
                  />
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No data available</div>
              )}
            </div>
          )}

          {/* User Logins Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Login History</h2>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Since Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {userLogins.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_verified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_verified ? 'Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.daysSinceLastLogin !== null ? `${user.daysSinceLastLogin} days` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Login Trends Tab */}
          {activeTab === 'trends' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Login Trends</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setTrendPeriod('week')}
                    className={`px-3 py-1 rounded text-sm ${
                      trendPeriod === 'week' ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setTrendPeriod('month')}
                    className={`px-3 py-1 rounded text-sm ${
                      trendPeriod === 'month' ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setTrendPeriod('year')}
                    className={`px-3 py-1 rounded text-sm ${
                      trendPeriod === 'year' ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Year
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logins</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loginTrends.map((trend) => (
                        <tr key={trend.date}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(trend.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {trend.registrations}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {trend.logins}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Failed Attempts Tab */}
          {activeTab === 'failed' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Failed Login Attempts</h2>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : failedAttempts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Users"
                    value={failedAttempts.totalUsers}
                    subtitle="All registered users"
                    color="blue"
                  />
                  <StatCard
                    title="Verified Users"
                    value={failedAttempts.verifiedUsers}
                    subtitle="Successfully verified"
                    color="green"
                  />
                  <StatCard
                    title="Unverified Users"
                    value={failedAttempts.unverifiedUsers}
                    subtitle="Failed verification"
                    color="red"
                  />
                  <StatCard
                    title="Never Logged In"
                    value={failedAttempts.neverLoggedIn}
                    subtitle="Registered but inactive"
                    color="yellow"
                  />
                  <StatCard
                    title="Verification Rate"
                    value={`${failedAttempts.verificationRate}%`}
                    subtitle="Success rate"
                    color="purple"
                  />
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No data available</div>
              )}
            </div>
          )}

          {/* Recent Activity Tab */}
          {activeTab === 'activity' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Login Activity</h2>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">{activity.name}</h3>
                          <p className="text-sm text-gray-500">{activity.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{activity.timeAgo}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.lastLogin).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No recent activity</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

