import { useState, useEffect } from 'react';
import { getFeedbacks, deleteFeedback } from '../services/api';
import { toast } from 'react-hot-toast';

function Feedbacks() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ userName: '', roomName: '' });
    const [sorting, setSorting] = useState({ field: 'createdAt', direction: 'desc' });

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await getFeedbacks();
            setFeedbacks(response.data);
        } catch (error) {
            toast.error('Failed to fetch feedbacks');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                await deleteFeedback(id);
                toast.success('Feedback deleted successfully');
                fetchFeedbacks();
            } catch (error) {
                toast.error('Failed to delete feedback');
            }
        }
    };

    const sortFeedbacks = (feedbacks) => {
        return [...feedbacks].sort((a, b) => {
            let aValue = a[sorting.field];
            let bValue = b[sorting.field];

            // Handle nested properties
            if (sorting.field === 'user.name') {
                aValue = a.user.name;
                bValue = b.user.name;
            } else if (sorting.field === 'meetingRoom.name') {
                aValue = a.meetingRoom.name;
                bValue = b.meetingRoom.name;
            }

            // Compare based on direction
            if (sorting.direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    };

    const filteredFeedbacks = feedbacks.filter(feedback =>
        feedback.reservation.user.name.toLowerCase().includes(filters.userName.toLowerCase()) &&
        feedback.reservation.room.name.toLowerCase().includes(filters.roomName.toLowerCase())
    );

    const sortedFeedbacks = sortFeedbacks(filteredFeedbacks);

    const handleSort = (field) => {
        setSorting(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const renderSortIcon = (field) => {
        if (sorting.field !== field) return null;
        return sorting.direction === 'asc' ? '↑' : '↓';
    };

    const renderRatingStars = (rating) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <span
                key={index}
                className={`text-xl ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
                ★
            </span>
        ));
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009B8A]"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6">
            <div className="bg-[#1A237E] rounded-xl p-8 mb-8 shadow-xl">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Feedback Management</h1>
                        <p className="text-gray-200 mt-2">View and manage user feedback for your meeting rooms</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="bg-white/10 px-4 py-2 rounded-lg text-white text-sm">
                            {filteredFeedbacks.length} Feedbacks Found
                        </span>
                        <button
                            onClick={fetchFeedbacks}
                            className="bg-white hover:bg-opacity-90 text-[#1A237E] px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="qb-card rounded-xl p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#1A237E]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Filter by user name..."
                            className="w-full pl-10 p-3 border border-[#1A237E]/20 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-[#1A237E] transition-all duration-200 bg-gray-50"
                            value={filters.userName}
                            onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#1A237E]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Filter by room name..."
                            className="w-full pl-10 p-3 border border-[#1A237E]/20 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-[#1A237E] transition-all duration-200 bg-gray-50"
                            value={filters.roomName}
                            onChange={(e) => setFilters({ ...filters, roomName: e.target.value })}
                        />
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        className={`px-3 py-1 text-sm rounded-full font-medium ${sorting.field === 'rating' ? 'bg-[#1A237E]/10 text-[#1A237E]' : 'bg-gray-100 text-gray-800'}`}
                        onClick={() => handleSort('rating')}
                    >
                        Sort by Rating {renderSortIcon('rating')}
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded-full font-medium ${sorting.field === 'createdAt' ? 'bg-[#1A237E]/10 text-[#1A237E]' : 'bg-gray-100 text-gray-800'}`}
                        onClick={() => handleSort('createdAt')}
                    >
                        Sort by Date {renderSortIcon('createdAt')}
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded-full font-medium ${sorting.field === 'user.name' ? 'bg-[#1A237E]/10 text-[#1A237E]' : 'bg-gray-100 text-gray-800'}`}
                        onClick={() => handleSort('user.name')}
                    >
                        Sort by User {renderSortIcon('user.name')}
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded-full font-medium ${sorting.field === 'meetingRoom.name' ? 'bg-[#1A237E]/10 text-[#1A237E]' : 'bg-gray-100 text-gray-800'}`}
                        onClick={() => handleSort('meetingRoom.name')}
                    >
                        Sort by Room {renderSortIcon('meetingRoom.name')}
                    </button>
                </div>
            </div>

            {sortedFeedbacks.length === 0 ? (
                <div className="qb-card rounded-xl p-12 text-center">
                    <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Feedbacks Found</h3>
                    <p className="text-gray-600">No feedbacks match your current filter criteria. Try adjusting your filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedFeedbacks.map(feedback => (
                        <div key={feedback.id} className="qb-card rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="bg-[#1A237E] p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{feedback.reservation.user.name}</h3>
                                        <div className="flex items-center text-gray-200 text-sm mt-1">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                            </svg>
                                            {feedback.reservation.room.name}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <button
                                            onClick={() => handleDelete(feedback.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                            aria-label="Delete feedback"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-3 flex">
                                    {renderRatingStars(feedback.rating)}
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-gray-700 italic">"{feedback.comment}"</p>
                                </div>

                                <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        {new Date(feedback.createdAt).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                    <span className={`px-2 py-1 rounded-full ${feedback.rating >= 4 ? 'bg-green-100 text-green-800' : feedback.rating >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                        {feedback.rating}/5
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Feedbacks;