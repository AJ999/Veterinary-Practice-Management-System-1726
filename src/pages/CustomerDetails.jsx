import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSave, FiArrowLeft, FiPlus, FiEdit, FiTrash2 } = FiIcons;

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, pets, addCustomer, updateCustomer, deletePet } = useData();
  
  const isEditing = id !== 'new';
  const customer = isEditing ? customers.find(c => c.id === parseInt(id)) : null;
  const customerPets = isEditing ? pets.filter(p => p.customerId === parseInt(id)) : [];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || ''
      });
    }
  }, [customer]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // Check if email already exists (for new customers or different customer)
    const existingCustomer = customers.find(c => 
      c.email.toLowerCase() === formData.email.toLowerCase() && 
      (!isEditing || c.id !== parseInt(id))
    );
    
    if (existingCustomer) {
      newErrors.email = 'A customer with this email already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        updateCustomer(parseInt(id), formData);
      } else {
        addCustomer(formData);
      }
      
      navigate('/customers');
    } catch (error) {
      console.error('Error saving customer:', error);
      // You could add error handling here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePet = (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      deletePet(petId);
    }
  };

  if (isEditing && !customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Customer not found</p>
        <Link to="/customers" className="text-primary-600 hover:text-primary-700">
          Back to customers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <SafeIcon icon={FiArrowLeft} className="h-5 w-5 mr-1" />
          Back to customers
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Customer' : 'Add New Customer'}
        </h1>
      </div>

      {/* Customer Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter customer's full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="customer@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter full address (optional)"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/customers')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiSave} className="h-4 w-4 mr-2" />
              {isSubmitting 
                ? 'Saving...' 
                : isEditing 
                  ? 'Update Customer' 
                  : 'Create Customer'
              }
            </button>
          </div>
        </form>
      </div>

      {/* Pets Section - Only show for existing customers */}
      {isEditing && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Pets ({customerPets.length})
              </h2>
              <Link
                to={`/pets/new?customerId=${id}`}
                className="inline-flex items-center px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
              >
                <SafeIcon icon={FiPlus} className="h-4 w-4 mr-1" />
                Add Pet
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {customerPets.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 mb-2">No pets registered for this customer</p>
                <Link
                  to={`/pets/new?customerId=${id}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700"
                >
                  <SafeIcon icon={FiPlus} className="h-4 w-4 mr-1" />
                  Add first pet
                </Link>
              </div>
            ) : (
              customerPets.map((pet) => (
                <div key={pet.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{pet.name}</h3>
                      <div className="mt-1 text-sm text-gray-500 space-y-1">
                        <p>{pet.species} • {pet.breed} • {pet.age} years old</p>
                        <p>Weight: {pet.weight}</p>
                        {pet.allergies && pet.allergies !== 'None' && (
                          <p className="text-red-600">Allergies: {pet.allergies}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/pets/${pet.id}`}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200"
                      >
                        <SafeIcon icon={FiEdit} className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeletePet(pet.id)}
                        className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200"
                      >
                        <SafeIcon icon={FiTrash2} className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;