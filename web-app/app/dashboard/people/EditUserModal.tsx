import React, { useState, useEffect } from 'react';

export interface User {
  id?: number | string;
  userId?: string;
  name: string;
  designation: string;
  roles: string[];
  mobile: string;
  status: string;
}

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: User) => void;
}

const AVAILABLE_ROLES = ['Admin', 'Teacher'];

const emptyUser: User = {
  name: '',
  designation: '',
  roles: [],
  mobile: '',
  status: 'Active',
};

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<User>(emptyUser);

  // Populate the form whenever a different user is selected (edit mode),
  // or reset it when creating a new one (user === null)
  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData(emptyUser);
    }
  }, [user]);

  if (!isOpen) return null;

  const isEditing = Boolean(user?.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, status: e.target.checked ? 'Active' : 'Inactive' }));
  };

  const handleRoleToggle = (role: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      roles: checked ? [...prev.roles, role] : prev.roles.filter((r) => r !== role),
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditing ? 'Edit User' : 'Create New User'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEditing ? 'Update the details for this user.' : 'Fill in the details to create a user.'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* Name Field */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tutox Super Admin"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Designation Field */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Tutox Super Admin"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Mobile Field */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Mobile</label>
            <div className="flex rounded border border-gray-300 overflow-hidden focus-within:border-blue-500">
              <span className="bg-gray-50 px-3 py-2 text-sm text-gray-500 border-r border-gray-300 flex items-center">
                +91
              </span>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-3 py-2 text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.status === 'Active'}
              onChange={handleStatusToggle}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-xs font-medium text-gray-600 cursor-pointer">
              Is Active?
            </label>
          </div>

          {/* Roles Checkboxes */}
          <div className="space-y-2 pt-1">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-0.5">Roles</label>
              <p className="text-[10px] text-gray-400 mb-1">Select the roles this user will have.</p>
            </div>

            <div className="border border-gray-200 rounded p-3 bg-white space-y-2">
              {AVAILABLE_ROLES.map((role) => (
                <label key={role} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role)}
                    onChange={(e) => handleRoleToggle(role, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-xs font-medium text-gray-500">{role}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1d2939] text-white rounded text-xs font-medium hover:bg-black transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Submit'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditUserModal;