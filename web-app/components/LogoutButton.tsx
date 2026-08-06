'use client';

import { useRouter } from 'next/navigation';
import { IoLogOutOutline } from 'react-icons/io5';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userId');
  router.push('/'); // was '/login' — LoginPage is actually at the root
};

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
    >
      <IoLogOutOutline size={18} />
      Logout
    </button>
  );
}