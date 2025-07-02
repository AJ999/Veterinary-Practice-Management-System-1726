import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiLogOut, FiUser } = FiIcons;

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
          >
            <SafeIcon icon={FiMenu} className="h-6 w-6" />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-800 lg:ml-0">
            VetCare Management
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            <span className="text-xs text-gray-500 capitalize">({user?.role})</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <SafeIcon icon={FiLogOut} className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;