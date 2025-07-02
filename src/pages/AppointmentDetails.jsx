import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSave, FiArrowLeft, FiCalendar, FiClock, FiUser, FiFileText } = FiIcons;

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { appointments, customers, pets, veterinarians, addAppointment, updateAppointment } = useData();
  
  const isEditing = id !== 'new';
  const appointment = isEditing ? appointments.find(a => a.id === parseInt(id)) : null;

  const [formData, setFormData] = useState({
    customerId: '',
    petId: '',
    veterinarianId: '',
    date: '',
    time: '',
    duration: 30,
    type: '',
    status: 'scheduled',
    notes: ''
  });

  const [availablePets, setAvailablePets] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (appointment) {
      const appointmentDate = new Date(appointment.date);
      setFormData({
        customerId: appointment.customerId || '',
        petId: appointment.petId || '',
        veterinarianId: appointment.veterinarianId || '',
        date: appointmentDate.toISOString().split('T')[0],
        time: appointmentDate.toTimeString().slice(0, 5),
        duration: appointment.duration || 30,
        type: appointment.type || '',
        status: appointment.status || 'scheduled',
        notes: appointment.notes || ''
      });
    } else {
      // Set default date to tomorrow for new appointments
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData(prev => ({
        ...prev,
        date: tomorrow.toISOString().split('T')[0],
        time: '09:00'
      }));
    }
  }, [appointment]);

  useEffect(() => {
    if (formData.customerId) {
      const customerPets = pets.filter(pet => pet.customerId === parseInt(formData.customerId));
      setAvailablePets(customerPets);
      
      // Reset pet selection if current pet doesn't belong to selected customer
      if (formData.petId && !customerPets.find(pet => pet.id === parseInt(formData.petId))) {
        setFormData(prev => ({ ...prev, petId: '' }));
      }
    } else {
      setAvailablePets([]);
    }
  }, [formData.customerId, pets]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }
    if (!formData.petId) {
      newErrors.petId = 'Pet is required';
    }
    if (!formData.veterinarianId) {
      newErrors.veterinarianId = 'Veterinarian is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    if (!formData.type) {
      newErrors.type = 'Appointment type is required';
    }

    // Check if date is in the past
    if (formData.date && formData.time) {
      const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
      const now = new Date();
      if (appointmentDateTime < now && !isEditing) {
        newErrors.date = 'Appointment cannot be scheduled in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    if (['customerId', 'petId', 'veterinarianId', 'duration'].includes(name)) {
      processedValue = value === '' ? '' : parseInt(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission started', formData);
    
    if (!validateForm()) {
      console.log('Validation failed', errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine date and time
      const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
      
      const appointmentData = {
        customerId: parseInt(formData.customerId),
        petId: parseInt(formData.petId),
        veterinarianId: parseInt(formData.veterinarianId),
        date: appointmentDateTime,
        duration: parseInt(formData.duration),
        type: formData.type,
        status: formData.status,
        notes: formData.notes
      };

      console.log('Submitting appointment data:', appointmentData);

      if (isEditing) {
        updateAppointment(parseInt(id), appointmentData);
        console.log('Appointment updated');
      } else {
        const newAppointment = addAppointment(appointmentData);
        console.log('New appointment added:', newAppointment);
      }

      // Navigate back to appointments page
      navigate('/appointments');
    } catch (error) {
      console.error('Error saving appointment:', error);
      // You could add error handling here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/appointments');
  };

  if (isEditing && !appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Appointment not found</p>
          <button
            onClick={handleCancel}
            className="text-primary-600 hover:text-primary-700"
          >
            Back to appointments
          </button>
        </div>
      </div>
    );
  }

  const appointmentTypes = [
    'Consultation',
    'Vaccination',
    'Surgery',
    'Dental Cleaning',
    'Check-up',
    'Emergency',
    'Follow-up',
    'Grooming',
    'Spay/Neuter',
    'X-Ray',
    'Blood Work'
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no-show', label: 'No Show' }
  ];

  const selectedCustomer = customers.find(c => c.id === formData.customerId);
  const selectedPet = pets.find(p => p.id === formData.petId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <SafeIcon icon={FiArrowLeft} className="h-5 w-5 mr-2" />
            Back to Appointments
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Appointment' : 'Schedule New Appointment'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Update appointment details' : 'Create a new appointment for your patient'}
          </p>
        </div>

        {/* Appointment Form */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <SafeIcon icon={FiCalendar} className="h-5 w-5 mr-2 text-primary-600" />
              Appointment Details
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Customer & Pet Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">
                  Customer *
                </label>
                <select
                  id="customerId"
                  name="customerId"
                  required
                  className={`block w-full border rounded-lg shadow-sm py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.customerId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  value={formData.customerId}
                  onChange={handleInputChange}
                >
                  <option value="">Select a customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>
                )}
              </div>

              <div>
                <label htmlFor="petId" className="block text-sm font-medium text-gray-700 mb-1">
                  Pet *
                </label>
                <select
                  id="petId"
                  name="petId"
                  required
                  disabled={!formData.customerId}
                  className={`block w-full border rounded-lg shadow-sm py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 ${
                    errors.petId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  value={formData.petId}
                  onChange={handleInputChange}
                >
                  <option value="">Select a pet</option>
                  {availablePets.map(pet => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species} - {pet.breed})
                    </option>
                  ))}
                </select>
                {errors.petId && (
                  <p className="mt-1 text-sm text-red-600">{errors.petId}</p>
                )}
                {!formData.customerId && (
                  <p className="mt-1 text-sm text-gray-500">Select a customer first</p>
                )}
              </div>
            </div>

            {/* Customer & Pet Info Display */}
            {selectedCustomer && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Appointment For:</h3>
                <div className="text-sm text-blue-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">{selectedCustomer.name}</p>
                      <p>{selectedCustomer.email}</p>
                      <p>{selectedCustomer.phone}</p>
                    </div>
                    {selectedPet && (
                      <div>
                        <p className="font-medium">Pet: {selectedPet.name}</p>
                        <p>{selectedPet.species} • {selectedPet.breed} • {selectedPet.age} years old</p>
                        {selectedPet.allergies && selectedPet.allergies !== 'None' && (
                          <p className="text-red-600">⚠️ Allergies: {selectedPet.allergies}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Veterinarian & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="veterinarianId" className="block text-sm font-medium text-gray-700 mb-1">
                  Veterinarian *
                </label>
                <select
                  id="veterinarianId"
                  name="veterinarianId"
                  required
                  className={`block w-full border rounded-lg shadow-sm py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.veterinarianId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  value={formData.veterinarianId}
                  onChange={handleInputChange}
                >
                  <option value="">Select a veterinarian</option>
                  {veterinarians.map(vet => (
                    <option key={vet.id} value={vet.id}>
                      {vet.name} ({vet.specialization})
                    </option>
                  ))}
                </select>
                {errors.veterinarianId && (
                  <p className="mt-1 text-sm text-red-600">{errors.veterinarianId}</p>
                )}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  className={`block w-full border rounded-lg shadow-sm py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.type ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="">Select appointment type</option>
                  {appointmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SafeIcon icon={FiCalendar} className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SafeIcon icon={FiClock} className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.time ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.time}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                )}
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) *
                </label>
                <select
                  id="duration"
                  name="duration"
                  required
                  className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.duration}
                  onChange={handleInputChange}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                  <SafeIcon icon={FiFileText} className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Additional notes about the appointment..."
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.customerId || !formData.petId || !formData.veterinarianId || !formData.type}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? 'Updating...' : 'Scheduling...'}
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiSave} className="h-4 w-4 mr-2" />
                    {isEditing ? 'Update Appointment' : 'Schedule Appointment'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800 mb-2">Quick Guide:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Fill in all required fields (*) to enable the submit button</li>
            <li>• Select a customer first to see their pets</li>
            <li>• The form will show any pet allergies as a warning</li>
            <li>• Default appointment time is set for tomorrow at 9:00 AM</li>
            <li>• You can update appointment details after creation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;