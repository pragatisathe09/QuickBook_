import { useState, useEffect } from 'react';
import { getRooms, createRoom, updateRoom } from '../services/api';
import { toast } from 'react-hot-toast';

function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity: '',
        availability: true,
        description: '',
        imageURL: ''
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await getRooms();
            setRooms(response.data);
            console.log(response.data);

        } catch (error) {
            toast.error('Failed to fetch rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateRoom(formData.id, formData);
                toast.success('Room updated successfully');
            } else {
                await createRoom(formData);
                toast.success('Room created successfully');
            }
            fetchRooms();
            resetForm();
        } catch (error) {
            toast.error(isEditing ? 'Failed to update room' : 'Failed to create room');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            location: '',
            capacity: '',
            availability: true,
            description: '',
            imageURL: ''
        });
        setIsEditing(false);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6">
            <div className="bg-[#1A237E] rounded-xl p-8 mb-8 shadow-xl">
                <h1 className="text-3xl font-bold text-white">Room Management</h1>
                <p className="text-gray-200 mt-2">Manage and organize meeting spaces</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Form Section - Takes 2/5 of the screen on large displays */}
                <div className="lg:col-span-2">
                    <div className="qb-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
                        <div className="bg-[#1A237E] p-5">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isEditing ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                                </svg>
                                {isEditing ? 'Edit Room' : 'Add New Room'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter room name"
                                    className="w-full p-3 border border-[#009B8A]/20 rounded-lg focus:ring-2 focus:ring-[#009B8A] focus:border-[#009B8A] transition-all duration-200 bg-gray-50"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <select
                                    className="w-full p-3 border border-[#009B8A]/20 rounded-lg focus:ring-2 focus:ring-[#009B8A] focus:border-[#009B8A] transition-all duration-200"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                >
                                    <option value="">Select Location</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Pune_Baner">Pune-Baner</option>
                                    <option value="Pune_Wadgaonsheri">Pune-Wadgaonsheri</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                <input
                                    type="number"
                                    placeholder="Number of people"
                                    className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    placeholder="Room details and features"
                                    className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 min-h-24 bg-gray-50"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50"
                                    value={formData.imageURL}
                                    onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })}
                                />
                            </div>
                            {console.log(formData.imageURL)}

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Availability Status</label>
                                <div className="flex gap-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="availability"
                                            value="Available"
                                            checked={formData.availability === "Available"}
                                            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                            className="text-purple-600 focus:ring-purple-500 h-5 w-5"
                                        />
                                        <span className="ml-2 text-gray-700">Available</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="availability"
                                            value="Under_Maintenance"
                                            checked={formData.availability === "Under_Maintenance"}
                                            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                            className="text-purple-600 focus:ring-purple-500 h-5 w-5"
                                        />
                                        <span className="ml-2 text-gray-700">Under Maintenance</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#1A237E] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#1A237E]/90 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[#1A237E] flex items-center justify-center shadow"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isEditing ? "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" : "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"} />
                                    </svg>
                                    {isEditing ? 'Update Room' : 'Create Room'}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 bg-gray-100 text-gray-800 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Rooms List Section - Takes 3/5 of the screen on large displays */}
                <div className="lg:col-span-3">
                    <div className="qb-card rounded-xl p-6 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#1A237E] flex items-center">
                                <svg className="w-6 h-6 mr-2 text-[#1A237E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                                Rooms List
                            </h2>
                            <span className="bg-[#1A237E]/10 text-[#1A237E] px-4 py-1 rounded-full text-sm font-medium">
                                {rooms.length} {rooms.length === 1 ? 'Room' : 'Rooms'}
                            </span>
                        </div>

                        {rooms.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-[#E6F7F5] rounded-xl">
                                <svg className="w-20 h-20 mb-4 text-[#009B8A]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                                <p className="text-lg font-medium">No rooms available. Create your first room!</p>
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="mt-4 bg-[#E6F7F5] text-[#009B8A] px-4 py-2 rounded-lg hover:bg-[#009B8A]/20 transition-all"
                                >
                                    Add a Room
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                                {rooms.map(room => (
                                    <div key={room.id} className="qb-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg">
                                        {room.imageURL && (
                                            <div className="h-48 overflow-hidden relative">
                                                <img
                                                    src={room.imageURL}
                                                    alt={room.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "/api/placeholder/400/200";
                                                        e.target.alt = "Image not available";
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                            </div>
                                        )}

                                        <div className="p-5">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg text-[#1A237E]">{room.name}</h3>
                                                    <div className="flex items-center text-gray-600 text-sm mt-1">
                                                        <svg className="w-4 h-4 mr-1 text-[#1A237E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        </svg>
                                                        {room.location.replace("_", ", ")}
                                                    </div>

                                                    <div className="flex items-center text-sm mt-2">
                                                        <svg className="w-4 h-4 mr-1 text-[#009B8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                                        </svg>
                                                        <span>Capacity: {room.capacity}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${room.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {room.availability ? 'Available' : 'Unavailable'}
                                                    </span>

                                                    <button
                                                        onClick={() => {
                                                            setFormData(room);
                                                            setIsEditing(true);
                                                            // Scroll to form
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        className="mt-3 text-[#1A237E] hover:text-[#1A237E]/90 font-medium text-sm flex items-center bg-[#1A237E]/10 px-3 py-1 rounded-md hover:bg-[#1A237E]/20 transition-all"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                        </svg>
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>

                                            {room.description && (
                                                <div className="mt-3 text-sm text-gray-600 border-t border-[#009B8A]/20 pt-3">
                                                    {room.description.length > 100
                                                        ? `${room.description.substring(0, 100)}...`
                                                        : room.description
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Rooms;