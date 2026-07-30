'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Upload, MoreVertical, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

type User = {
  id: number;
  userId: string;
  name: string;
  designation: string;
  roles: string;
  mobile: string;
  status: string;
};

export default function PeopleManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch users from our backend API on page load
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Action handler to create a new user in Supabase
  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Prasoon Komath',
          designation: 'Teacher',
          roles: 'Accountant, Class Teacher',
          mobile: '9847953684',
          status: 'Active',
        }),
      });

      if (response.ok) {
        // Refresh the list to display the newly inserted user
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full max-h-[800px]">
      
      {/* Header & Actions */}
      <div className="p-6 border-b border-gray-200 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">People Management</h2>
          <p className="text-sm text-gray-500 mt-1">Create, edit and search users.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search User" 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
            />
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Upload size={16} /> Bulk Upload
            </button>
            
            {/* Connected Action Button */}
            <button 
              onClick={handleCreateUser}
              className="flex items-center gap-2 px-4 py-2 bg-[#0A192F] text-white rounded-lg text-sm font-semibold hover:bg-[#112240] transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={16} /> Create New User
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto flex-1 min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-500 text-sm font-medium">
            Loading database records...
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <p className="text-gray-500 font-medium">No users found in the database.</p>
            <p className="text-xs text-gray-400">Click "Create New User" to insert your first record.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User ID <ChevronDown size={14} className="inline ml-1" /></th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role(s)</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile No</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="p-4 text-sm font-medium text-[#0A192F]">{user.userId}</td>
                  <td className="p-4 text-sm text-gray-900 font-semibold">{user.name}</td>
                  <td className="p-4 text-sm text-gray-600">{user.designation}</td>
                  <td className="p-4 text-sm text-gray-600">{user.roles}</td>
                  <td className="p-4 text-sm text-gray-600">{user.mobile}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center w-fit gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1 text-gray-400 hover:text-gray-800 rounded transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>{users.length > 0 ? '1' : '0'} of {users.length} row(s) selected.</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select className="border border-gray-300 rounded p-1 bg-white outline-none">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
          <span>Page 1 of 1</span>
          <div className="flex gap-1">
            <button className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50" disabled><ChevronLeft size={16} /></button>
            <button className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50" disabled><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
      
    </div>
  );
}