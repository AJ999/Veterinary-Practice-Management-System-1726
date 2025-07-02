import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSave, FiArrowLeft } = FiIcons;

const PetDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { customers, pets, addPet, updatePet } = useData();
  
  const isEditing = id !== 'new';
  const pet = isEditing ? pets.find(p => p.id === parseInt(id)) : null;
  const customerId = searchParams.get('customerId');

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    weight: '',
    allergies: '',
    customerId: customerId ? parseInt(customerId) : ''
  });

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        species: pet.species || '',
        breed: pet.breed || '',
        age: pet.age || '',
        weight: pet.weight || '',
        allergies: pet.allergies || '',
        customerId: pet.customerId || ''
      });
    }
  }, [pet]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'customerId' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      updatePet(parseInt(id), formData);
    } else {
      addPet(formData);
    }
    
    if (formData.customerId) {
      navigate(`/customers/${formData.customerId}`);
    } else {
      navigate('/customers');
    }
  };

  const handleCancel = () => {
    if (formData.customerId) {
      navigate(`/customers/${formData.customerId}`);
    } else {
      navigate('/customers');
    }
  };

  if (isEditing && !pet) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Pet not found</p>
        <button onClick={handleCancel} className="text-primary-600 hover:text-primary-700">
          Go back
        </button>
      </div>
    );
  }

  const selectedCustomer = customers.find(c => c.id === formData.customerId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleCancel}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <SafeIcon icon={FiArrowLeft} className="h-5 w-5 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Pet' : 'Add New Pet'}
        </h1>
      </div>

      {/* Customer Info */}
      {selectedCustomer && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Owner:</span> {selectedCustomer.name} ({selectedCustomer.email})
          </p>
        </div>
      )}

      {/* Pet Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pet Information</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!customerId && (
              <div className="md:col-span-2">
                <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
                  Owner *
                </label>
                <select
                  id="customerId"
                  name="customerId"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.customerId}
                  onChange={handleInputChange}
                >
                  <option value="">Select an owner</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Pet Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="species" className="block text-sm font-medium text-gray-700">
                Species *
              </label>
              <select
                id="species"
                name="species"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.species}
                onChange={handleInputChange}
              >
                <option value="">Select species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Hamster">Hamster</option>
                <option value="Guinea Pig">Guinea Pig</option>
                <option value="Reptile">Reptile</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
                Breed
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.breed}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age (years) *
              </label>
              <input
                type="number"
                id="age"
                name="age"
                required
                min="0"
                max="50"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.age}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight
              </label>
              <input
                type="text"
                id="weight"
                name="weight"
                placeholder="e.g., 25 lbs, 5 kg"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.weight}
                onChange={handleInputChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                Known Allergies
              </label>
              <textarea
                id="allergies"
                name="allergies"
                rows={3}
                placeholder="List any known allergies or write 'None'"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.allergies}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <SafeIcon icon={FiSave} className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Pet' : 'Create Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetDetails;