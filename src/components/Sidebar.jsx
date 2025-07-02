import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiUsers, FiCalendar, FiFileText, FiDollarSign, FiSettings, FiX } = FiIcons;

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome, roles: ['admin', 'veterinarian', 'receptionist'] },
    { name: 'Customers', href: '/customers', icon: FiUsers, roles: ['admin', 'receptionist'] },
    { name: 'Appointments', href: '/appointments', icon: FiCalendar, roles: ['admin', 'veterinarian', 'receptionist'] },
    { name: 'Medical Records', href: '/medical-records', icon: FiFileText, roles: ['admin', 'veterinarian'] },
    { name: 'Invoices', href: '/invoices', icon: FiDollarSign, roles: ['admin', 'receptionist'] },
    { name: 'Settings', href: '/settings', icon: FiSettings, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-800">VetCare</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <SafeIcon icon={FiX} className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6">
          <div className="px-3">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <SafeIcon icon={item.icon} className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;