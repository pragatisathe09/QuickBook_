import { useState, useEffect } from 'react';
import { getReservations } from '../services/api';
import { Search, Calendar, Users, Home, RefreshCw, Filter, Clock, Package } from 'lucide-react';

function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        userName: '',
        roomName: '',
        status: '',
        date: '',
        amenities: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await getReservations();
            setReservations(response.data);
        } catch (error) {
            showToast('Failed to fetch reservations', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        // Simulated toast functionality
        console.log(`${type}: ${message}`);
    };

    const handleReset = () => {
        setFilters({ userName: '', roomName: '', status: '', date: '', amenities: '' });
    };

    const filteredReservations = reservations.filter(reservation => {
        const matchesUser = reservation.user.name.toLowerCase().includes(filters.userName.toLowerCase());
        const matchesRoom = reservation.room.name.toLowerCase().includes(filters.roomName.toLowerCase());
        const matchesStatus = filters.status === '' || reservation.status === filters.status;

        let matchesDate = true;
        if (filters.date) {
            const filterDate = new Date(filters.date).toDateString();
            const startDate = new Date(reservation.startTime).toDateString();
            matchesDate = filterDate === startDate;
        }

        let matchesAmenities = true;
        if (filters.amenities) {
            matchesAmenities = reservation.amenities &&
                reservation.amenities.toLowerCase().includes(filters.amenities.toLowerCase());
        }

        return matchesUser && matchesRoom && matchesStatus && matchesDate && matchesAmenities;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'confirmed': return 'bg-purple-100 text-purple-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Format amenities as pills
    const formatAmenities = (amenities) => {
        if (!amenities) return null;

        return amenities.split(',').map((amenity, index) => (
            <span
                key={index}
                className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full mr-1 mb-1"
            >
                {amenity.trim()}
            </span>
        ));
    };

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6">
            <div className="bg-[#1A237E] rounded-xl p-8 mb-8 shadow-xl">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Reservations Management</h1>
                        <p className="text-gray-200 mt-2">View and manage room reservations</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="bg-white/10 px-4 py-2 rounded-lg text-white text-sm">
                            {filteredReservations.length} Reservations Found
                        </span>
                        <button
                            onClick={fetchReservations}
                            className="bg-white hover:bg-opacity-90 text-[#1A237E] px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="qb-card rounded-xl mb-6 overflow-hidden">
                <div className="p-4 border-b border-[#E6F7F5] flex justify-between items-center">
                    <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg w-full md:w-auto ring-1 ring-[#1A237E]/10">
                        <Search className="h-5 w-5 text-[#1A237E] mr-2" />
                        <input
                            type="text"
                            placeholder="Search all reservations..."
                            className="bg-gray-50 p-1 outline-none w-full focus:ring-2 focus:ring-[#1A237E]"
                            value={filters.userName || filters.roomName}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFilters({ ...filters, userName: value, roomName: value });
                            }}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center px-4 py-2 text-[#1A237E] border border-[#1A237E]/20 rounded-lg hover:bg-[#1A237E]/10 transition-all ml-2"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                {showFilters && (
                    <div className="p-5 bg-[#1A237E]/5 grid grid-cols-1 md:grid-cols-5 gap-4 border-b border-[#1A237E]/10">
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1 font-medium">User</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-2.5 h-4 w-4 text-[#009B8A]" />
                                <input
                                    type="text"
                                    placeholder="Filter by user..."
                                    className="p-2 pl-9 border border-[#E6F7F5] rounded-lg w-full focus:ring-2 focus:ring-[#009B8A] focus:border-[#009B8A] transition-all bg-white"
                                    value={filters.userName}
                                    onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1 font-medium">Room</label>
                            <div className="relative">
                                <Home className="absolute left-3 top-2.5 h-4 w-4 text-[#009B8A]" />
                                <input
                                    type="text"
                                    placeholder="Filter by room..."
                                    className="p-2 pl-9 border border-[#E6F7F5] rounded-lg w-full focus:ring-2 focus:ring-[#009B8A] focus:border-[#009B8A] transition-all bg-white"
                                    value={filters.roomName}
                                    onChange={(e) => setFilters({ ...filters, roomName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1 font-medium">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-[#009B8A]" />
                                <input
                                    type="date"
                                    className="p-2 pl-9 border border-[#E6F7F5] rounded-lg w-full focus:ring-2 focus:ring-[#009B8A] focus:border-[#009B8A] transition-all bg-white"
                                    value={filters.date}
                                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1 font-medium">Status</label>
                            <select
                                className="p-2 border border-[#E6F7F5] rounded-lg w-full focus:ring-2 focus:ring-[#009B8A] focus:border-[#009B8A] transition-all bg-white"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option value="">All statuses</option>
                                <option value="completed">Completed</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1 font-medium">Amenities</label>
                            <div className="relative">
                                <Package className="absolute left-3 top-2.5 h-4 w-4 text-[#009B8A]" />
                                <input
                                    type="text"
                                    placeholder="Filter by amenities..."
                                    className="p-2 pl-9 border border-[#E6F7F5] rounded-lg w-full focus:ring-2 focus:ring-[#009B8A] focus:border-[#009B8A] transition-all bg-white"
                                    value={filters.amenities}
                                    onChange={(e) => setFilters({ ...filters, amenities: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-5 flex justify-end">
                            <button
                                onClick={handleReset}
                                className="text-[#009B8A] hover:text-[#007568] font-medium flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009B8A]"></div>
                </div>
            ) : filteredReservations.length === 0 ? (
                <div className="qb-card p-10 rounded-xl text-center">
                    <div className="flex justify-center mb-4">
                        <svg className="w-16 h-16 text-[#E6F7F5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-600 text-lg mb-2">No reservations found matching your filters.</p>
                    <button
                        onClick={handleReset}
                        className="mt-4 text-white bg-gradient-to-r from-[#007568] to-[#009B8A] px-6 py-2 rounded-lg hover:from-[#009B8A] hover:to-[#007568] transition-all shadow-md flex items-center mx-auto"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="qb-card rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#E6F7F5]">
                            <thead className="bg-[#1A237E]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Room</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Start Time</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">End Time</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Amenities</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#E6F7F5]">
                                {filteredReservations.map(reservation => (
                                    <tr key={reservation.id} className="hover:bg-[#E6F7F5] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-[#007568]">{reservation.user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-gray-900">{reservation.room.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 max-w-xs truncate">{reservation.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-gray-600 flex items-center">
                                                <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(reservation.startTime).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-gray-600 flex items-center">
                                                <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {new Date(reservation.endTime).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                                                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap">
                                                {reservation.amenities ? formatAmenities(reservation.amenities) : (
                                                    <span className="text-gray-400 text-sm italic">None</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-[#E6F7F5] px-6 py-4 border-t border-[#E6F7F5]">
                        <div className="text-[#007568] text-sm font-medium flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Showing {filteredReservations.length} of {reservations.length} reservations
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reservations;