import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiChevronLeft, FiChevronRight, FiClock, FiUser, FiCalendar } = FiIcons;

const AppointmentCalendar = () => {
  const { appointments, customers, pets, veterinarians } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }

    return week;
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === date.toDateString();
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction * 7));
    } else {
      newDate.setDate(currentDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const getAppointmentColor = (veterinarianId) => {
    const colors = [
      'bg-blue-100 border-blue-300 text-blue-800',
      'bg-green-100 border-green-300 text-green-800',
      'bg-purple-100 border-purple-300 text-purple-800',
      'bg-yellow-100 border-yellow-300 text-yellow-800',
      'bg-red-100 border-red-300 text-red-800'
    ];
    return colors[veterinarianId % colors.length];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {weekDates.map((date, index) => {
          const dayAppointments = getAppointmentsForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div key={index} className="bg-white min-h-32">
              <div className={`p-3 text-center border-b ${
                isToday ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
              }`}>
                <div className="text-xs font-medium uppercase tracking-wide">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-semibold mt-1 ${
                  isToday ? 'text-primary-700' : 'text-gray-900'
                }`}>
                  {date.getDate()}
                </div>
              </div>

              <div className="p-2 space-y-1">
                {dayAppointments.slice(0, 3).map((appointment) => {
                  const customer = customers.find(c => c.id === appointment.customerId);
                  const pet = pets.find(p => p.id === appointment.petId);
                  const vet = veterinarians.find(v => v.id === appointment.veterinarianId);

                  return (
                    <Link
                      key={appointment.id}
                      to={`/appointments/${appointment.id}`}
                      className={`block p-2 rounded text-xs border hover:opacity-80 transition-opacity ${getAppointmentColor(appointment.veterinarianId)}`}
                    >
                      <div className="font-medium truncate">
                        {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="truncate">{customer?.name}</div>
                      <div className="truncate">{pet?.name}</div>
                      <div className="truncate text-xs opacity-75">{appointment.type}</div>
                    </Link>
                  );
                })}

                {dayAppointments.length > 3 && (
                  <div className="text-xs text-gray-500 text-center p-1">
                    +{dayAppointments.length - 3} more
                  </div>
                )}

                {dayAppointments.length === 0 && (
                  <Link
                    to="/appointments/new"
                    className="block p-2 text-xs text-gray-400 hover:text-primary-600 text-center border-2 border-dashed border-gray-200 hover:border-primary-300 rounded transition-colors"
                  >
                    + Add appointment
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate);

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {formatDate(currentDate)}
            </h3>
            <Link
              to="/appointments/new"
              className="inline-flex items-center px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
            >
              <SafeIcon icon={FiPlus} className="h-4 w-4 mr-1" />
              Add Appointment
            </Link>
          </div>
        </div>

        <div className="p-6">
          {dayAppointments.length === 0 ? (
            <div className="text-center py-12">
              <SafeIcon icon={FiCalendar} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
              <p className="text-gray-500 mb-6">No appointments are scheduled for this day.</p>
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
              {dayAppointments.map((appointment) => {
                const customer = customers.find(c => c.id === appointment.customerId);
                const pet = pets.find(p => p.id === appointment.petId);
                const vet = veterinarians.find(v => v.id === appointment.veterinarianId);

                return (
                  <Link
                    key={appointment.id}
                    to={`/appointments/${appointment.id}`}
                    className={`block p-6 rounded-lg border-2 hover:opacity-80 transition-opacity ${getAppointmentColor(appointment.veterinarianId)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="text-xl font-semibold">
                            {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                            <span className="text-sm text-gray-600">
                              {appointment.duration} min
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-lg">{customer?.name}</p>
                            <p className="text-sm text-gray-600">{customer?.email}</p>
                            <p className="text-sm text-gray-600">{customer?.phone}</p>
                          </div>
                          <div>
                            <p className="font-medium">Pet: {pet?.name}</p>
                            <p className="text-sm text-gray-600">
                              {pet?.species} • {pet?.breed} • {pet?.age} years old
                            </p>
                            {pet?.allergies && pet?.allergies !== 'None' && (
                              <p className="text-sm text-red-600 font-medium">
                                ⚠️ Allergies: {pet?.allergies}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{appointment.type}</p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <SafeIcon icon={FiUser} className="h-4 w-4 mr-1" />
                              Dr. {vet?.name}
                            </p>
                          </div>
                          {appointment.notes && (
                            <div className="max-w-md">
                              <p className="text-sm text-gray-600 italic">
                                "{appointment.notes}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <SafeIcon icon={FiCalendar} className="h-8 w-8 mr-3 text-primary-600" />
            Appointments
          </h1>
          <p className="text-gray-600 mt-1">Manage your appointment schedule</p>
        </div>
        <Link
          to="/appointments/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm transition-colors"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
          New Appointment
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <SafeIcon icon={FiCalendar} className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">
                {getAppointmentsForDate(new Date()).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <SafeIcon icon={FiClock} className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-semibold text-gray-900">
                {appointments.filter(apt => apt.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <SafeIcon icon={FiUser} className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {appointments.filter(apt => apt.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <SafeIcon icon={FiCalendar} className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">{appointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <SafeIcon icon={FiChevronLeft} className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {viewMode === 'week'
                ? `Week of ${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                : formatDate(currentDate)}
            </h2>
            <button
              onClick={() => navigateDate(1)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <SafeIcon icon={FiChevronRight} className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Today
            </button>
            <div className="flex bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-2 text-sm rounded transition-colors ${
                  viewMode === 'week'
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-2 text-sm rounded transition-colors ${
                  viewMode === 'day'
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'week' ? renderWeekView() : renderDayView()}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Veterinarians</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {veterinarians.map((vet) => (
            <div key={vet.id} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded border-2 ${getAppointmentColor(vet.id).replace('text-', 'border-').split(' ')[1]}`}></div>
              <span className="text-sm text-gray-700">{vet.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;