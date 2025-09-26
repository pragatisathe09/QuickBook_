import { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { getUsers, getRooms, getReservations, getFeedbacks } from '../services/api';
import { toast } from 'react-hot-toast';
import StatCard from '../components/Dashboard/StatCard';

ChartJS.register(...registerables);

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    reservations: 0,
    recentFeedbacks: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, roomsRes, reservationsRes, feedbacksRes] = await Promise.all([
        getUsers(),
        getRooms(),
        getReservations(),
        getFeedbacks()
      ]);

      setStats({
        users: usersRes.data.length,
        rooms: roomsRes.data.length,
        reservations: reservationsRes.data.length,
        recentFeedbacks: feedbacksRes.data.slice(0, 5)
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Chart labels
  const getReservationLabels = () => {
    switch (timeRange) {
      case 'month': return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      case 'year': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      default: return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
  };

  // Chart data
  const getReservationData = () => {
    switch (timeRange) {
      case 'month': return [45, 60, 52, 70];
      case 'year': return [120, 135, 170, 190, 210, 250, 220, 230, 200, 185, 195, 240];
      default: return [12, 19, 15, 25, 22, 14, 10];
    }
  };

  const reservationData = {
    labels: getReservationLabels(),
    datasets: [{
      label: 'Reservations',
      data: getReservationData(),
      fill: true,
      backgroundColor: 'rgba(30, 58, 138, 0.1)',
      borderColor: '#1E3A8A',
      tension: 0.4,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#1E3A8A',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2
    }]
  };

  const roomUsageData = {
    labels: ['In Use', 'Available', 'Maintenance'],
    datasets: [{
      data: [70, 20, 10],
      backgroundColor: ['#1E3A8A', '#F97316', '#94a3b8'],
      borderWidth: 0,
      borderRadius: 3
    }]
  };

  const popularRoomsData = {
    labels: ['Conference A', 'Meeting B', 'Training C', 'Executive D', 'Brainstorm E'],
    datasets: [{
      label: 'Reservations',
      data: [65, 50, 40, 30, 20],
      backgroundColor: 'rgba(30, 58, 138, 0.8)',
      borderColor: 'rgb(30, 58, 138)',
      borderWidth: 1,
      borderRadius: 6
    }]
  };

  const renderRatingStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? 'text-amber-500' : 'text-gray-300'}>★</span>
    ));

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </span>
                Dashboard
              </h1>
              <p className="text-gray-600 mt-2 ml-11">Welcome to your meeting room management system</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-gray-500 text-sm">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last updated: {new Date().toLocaleString('en-US', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Users" 
            value={stats.users} 
            color="blue" 
            growth="12%" 
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatCard 
            title="Total Rooms" 
            value={stats.rooms} 
            color="purple" 
            growth="5%" 
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          <StatCard 
            title="Reservations" 
            value={stats.reservations} 
            color="green" 
            growth="18%" 
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard 
            title="Avg. Rating" 
            value="4.7" 
            color="teal" 
            growth="8%" 
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            }
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Reservation Trends</h3>
            <div className="flex space-x-2 mb-4">
              {['week', 'month', 'year'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-xs rounded-lg font-medium transition-all ${
                    timeRange === range 
                      ? 'bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="h-72">
              <Line data={reservationData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Room Usage Status</h3>
            <div className="h-72 flex justify-center">
              <Pie data={roomUsageData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-6">Most Popular Rooms</h3>
            <div className="h-64">
              <Bar data={popularRoomsData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-blue-900">Recent Feedbacks</h3>
              <a href="/feedbacks" className="text-blue-900 text-sm font-medium hover:text-blue-700 transition-colors">View All →</a>
            </div>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {stats.recentFeedbacks.length > 0 ? (
                stats.recentFeedbacks.map(fb => (
                  <div key={fb.id} className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 hover:border-blue-200 transition-all duration-300">
                    <p className="font-medium text-blue-900">{fb.reservation.user.name}</p>
                    <p className="text-sm text-blue-700">{fb.reservation.room.name}</p>
                    <div className="flex">{renderRatingStars(fb.rating)}</div>
                    <p className="mt-2 text-gray-700 italic">{fb.comment}</p>
                  </div>
                ))
              ) : <p className="text-gray-500 text-center">No feedback available</p>}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 155, 138, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default Dashboard;
