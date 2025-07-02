import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiUsers, FiDollarSign, FiFileText, FiPlus, FiClock, FiArrowRight } = FiIcons;

const Dashboard = () => {
  const { user } = useAuth();
  const { appointments, customers, pets, invoices, veterinarians } = useData();

  const today = new Date();
  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return aptDate >= tomorrow && aptDate <= nextWeek;
  });

  const stats = [
    {
      name: 'Today\'s Appointments',
      value: todayAppointments.length,
      icon: FiCalendar,
      color: 'bg-blue-500',
      link: '/appointments'
    },
    {
      name: 'Total Customers',
      value: customers.length,
      icon: FiUsers,
      color: 'bg-green-500',
      link: '/customers'
    },
    {
      name: 'Active Pets',
      value: pets.length,
      icon: FiFileText,
      color: 'bg-purple-500',
      link: '/customers'
    },
    {
      name: 'Pending Invoices',
      value: invoices.filter(inv => inv.status === 'pending').length,
      icon: FiDollarSign,
      color: 'bg-yellow-500',
      link: '/invoices'
    }
  ];

  const quickActions = [
    {
      name: 'New Appointment',
      link: '/appointments/new',
      icon: FiCalendar,
      color: 'bg-blue-500',
      description: 'Schedule a new appointment'
    },
    {
      name: 'Add Customer',
      link: '/add-customer',
      icon: FiUsers,
      color: 'bg-green-500',
      description: 'Register a new customer'
    },
    {
      name: 'Medical Record',
      link: '/medical-records/new',
      icon: FiFileText,
      color: 'bg-purple-500',
      description: 'Create medical record'
    },
    {
      name: 'Create Invoice',
      link: '/invoices/new',
      icon: FiDollarSign,
      color: 'bg-yellow-500',
      description: 'Generate new invoice'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {getGreeting()}, {user?.name}!
            </h1>
            <p className="mt-1 opacity-90">
              Here's what's happening at your clinic today.
            </p>
          </div>
          <div className="hidden md:block">
            <SafeIcon icon={FiCalendar} className="h-16 w-16 opacity-20" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3 flex-shrink-0`}>
                  <SafeIcon icon={stat.icon} className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <SafeIcon icon={FiArrowRight} className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
              <Link
                to="/appointments/new"
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <SafeIcon icon={FiPlus} className="h-4 w-4 mr-1" />
                New
              </Link>
            </div>
          </div>
          <div className="p-6">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <SafeIcon icon={FiCalendar} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No appointments scheduled for today</p>
                <Link
                  to="/appointments/new"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
                >
                  <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
                  Schedule First Appointment
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAppointments.slice(0, 5).map((appointment) => {
                  const customer = customers.find(c => c.id === appointment.customerId);
                  const pet = pets.find(p => p.id === appointment.petId);
                  const vet = veterinarians.find(v => v.id === appointment.veterinarianId);

                  return (
                    <Link
                      key={appointment.id}
                      to={`/appointments/${appointment.id}`}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <SafeIcon icon={FiClock} className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {appointment.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {customer?.name} - {pet?.name} ({pet?.species})
                        </p>
                        <p className="text-xs text-gray-400">
                          Dr. {vet?.name}
                        </p>
                      </div>
                      <SafeIcon icon={FiArrowRight} className="h-4 w-4 text-gray-400" />
                    </Link>
                  );
                })}
                {todayAppointments.length > 5 && (
                  <Link
                    to="/appointments"
                    className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2"
                  >
                    View all {todayAppointments.length} appointments
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  to={action.link}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <div className={`${action.color} rounded-lg p-3 mb-3 group-hover:scale-110 transition-transform`}>
                    <SafeIcon icon={action.icon} className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 text-center mb-1">
                    {action.name}
                  </span>
                  <span className="text-xs text-gray-500 text-center">
                    {action.description}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming This Week</h2>
              <Link
                to="/appointments"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppointments.slice(0, 4).map((appointment) => {
                const customer = customers.find(c => c.id === appointment.customerId);
                const pet = pets.find(p => p.id === appointment.petId);
                const vet = veterinarians.find(v => v.id === appointment.veterinarianId);

                return (
                  <Link
                    key={appointment.id}
                    to={`/appointments/${appointment.id}`}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex flex-col items-center justify-center">
                        <div className="text-xs font-medium text-primary-600">
                          {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-sm font-bold text-primary-700">
                          {new Date(appointment.date).getDate()}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {customer?.name} - {pet?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {appointment.type}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;