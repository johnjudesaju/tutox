'use client';

import React, { useEffect, useState } from 'react';
import EditUserModal, { User } from './EditUserModal';

export default function PeopleManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      const isEditing = Boolean(updatedUser.id);
      const res = await fetch(
        isEditing ? `/api/users/${updatedUser.id}` : '/api/users',
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        }
      );
      if (!res.ok) throw new Error('Failed to save user');

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b bg-white px-6 py-4">
          <h1 className="text-xl font-bold text-indigo-900">People Management</h1>
          <button
            onClick={handleCreateClick}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus:outline-none"
          >
            Create New User
          </button>
        </div>

        <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{user.userId}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.name}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.designation}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.status}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-indigo-600 hover:text-indigo-950"
                          >
                            Edit User
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <EditUserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
      />
    </div>
  );
}