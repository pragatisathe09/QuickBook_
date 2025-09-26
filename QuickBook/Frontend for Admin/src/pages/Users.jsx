import { useState, useEffect } from 'react';
import { getUsers, updateUserRole, deleteUser } from '../services/api';
import { toast } from 'react-hot-toast';

function Users() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsers();
            // Sort users by creation date, newest first
            const sortedUsers = response.data.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setUsers(sortedUsers);
            toast.success('Users list refreshed');
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            toast.success('Role updated successfully');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await deleteUser(userId);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) && user.role !== 'admin'
    );

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009B8A]"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6">
            {/* Header */}
            <div className="bg-[#1A237E] rounded-xl p-8 mb-6 shadow-xl">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Users Management</h1>
                        <p className="text-gray-200 mt-2">Manage user roles and access</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="bg-white/10 px-4 py-2 rounded-lg text-white text-sm">
                            {filteredUsers.length} Users Found
                        </span>
                        <button
                            onClick={fetchUsers}
                            className="bg-white hover:bg-opacity-90 text-[#1A237E] px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6 qb-card p-4 rounded-xl">
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 focus-within:border-[#1A237E] transition-colors bg-gray-50">
                    <svg className="w-5 h-5 text-[#1A237E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search users by name..."
                        className="w-full ml-2 outline-none text-gray-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="qb-card rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-[#1A237E] text-white">
                                <th className="px-6 py-4 text-left font-semibold w-1/4">Name</th>
                                <th className="px-6 py-4 text-left font-semibold w-1/4">Email</th>
                                <th className="px-6 py-4 text-left font-semibold w-1/4">Role</th>
                                <th className="px-6 py-4 text-left font-semibold w-1/4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <tr 
                                        key={user.id} 
                                        className={`border-t border-gray-100 hover:bg-[#1A237E]/5 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap w-1/3">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-[#1A237E]/10 flex items-center justify-center text-[#1A237E] font-medium mr-3 ring-1 ring-[#1A237E]/20">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 w-1/3">
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-[#009B8A] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                </svg>
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap w-1/4">
                                            <div className="flex items-center">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                                    className="border border-[#1A237E]/30 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent text-sm font-medium shadow-sm"
                                                >
                                                    <option value="employee">Employee</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap w-1/4">
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-12 h-12 text-[#009B8A]/50 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                            </svg>
                                            <p className="text-lg">No users found matching your search</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {filteredUsers.length > 0 && (
                    <div className="bg-[#E6F7F5] px-6 py-3 border-t border-[#E6F7F5] text-sm text-gray-500">
                        Showing {filteredUsers.length} users
                    </div>
                )}
            </div>
        </div>
    );
}

export default Users;