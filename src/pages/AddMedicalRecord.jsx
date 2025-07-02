import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiFileText, FiActivity } = FiIcons;

const AddMedicalRecord = () => {
  const navigate = useNavigate();
  const { customers, pets, veterinarians, addMedicalRecord } = useData();

  const [formData, setFormData] = useState({
    customerId: '',
    petId: '',
    veterinarianId: '',
    type: '',
    procedure: '',
    notes: '',
    medications: [''],
    equipment: [''],
    cost: ''
  });

  const [availablePets, setAvailablePets] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.type) {
      newErrors.type = 'Record type is required';
    }

    if (!formData.procedure.trim()) {
      newErrors.procedure = 'Procedure/Treatment is required';
    }

    if (!formData.notes.trim()) {
      newErrors.notes = 'Clinical notes are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['customerId', 'petId', 'veterinarianId'].includes(name) 
        ? (parseInt(value) || '') 
        : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayInputChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (index, field) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
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
      const recordData = {
        ...formData,
        customerId: parseInt(formData.customerId),
        petId: parseInt(formData.petId),
        veterinarianId: parseInt(formData.veterinarianId),
        medications: formData.medications.filter(med => med.trim() !== ''),
        equipment: formData.equipment.filter(eq => eq.trim() !== ''),
        cost: parseFloat(formData.cost) || 0,
        date: new Date()
      };

      console.log('Creating medical record:', recordData);
      
      const newRecord = addMedicalRecord(recordData);
      console.log('New medical record created:', newRecord);

      // Navigate back to medical records list
      navigate('/medical-records');
    } catch (error) {
      console.error('Error creating medical record:', error);
      // You could add error handling here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/medical-records');
  };

  const recordTypes = [
    'Consultation',
    'Surgery',
    'Vaccination',
    'Dental',
    'Diagnostic',
    'Treatment',
    'Emergency',
    'Follow-up',
    'Preventive Care',
    'Laboratory Tests'
  ];

  const selectedCustomer = customers.find(c => c.id === formData.customerId);
  const selectedPet = pets.find(p => p.id === formData.petId);
  const selectedVet = veterinarians.find(v => v.id === formData.veterinarianId);

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
            Back to Medical Records
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Medical Record
          </h1>
          <p className="text-gray-600 mt-2">
            Document patient care and treatment details
          </p>
        </div>

        {/* Medical Record Form */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <SafeIcon icon={FiFileText} className="h-5 w-5 mr-2 text-primary-600" />
              Medical Record Details
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Patient Selection */}
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

            {/* Patient Info Display */}
            {selectedCustomer && selectedPet && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Patient Information:</h3>
                <div className="text-sm text-blue-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">{selectedCustomer.name}</p>
                      <p>{selectedCustomer.email}</p>
                      <p>{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <p className="font-medium">Patient: {selectedPet.name}</p>
                      <p>{selectedPet.species} • {selectedPet.breed} • {selectedPet.age} years old</p>
                      <p>Weight: {selectedPet.weight || 'Not specified'}</p>
                      {selectedPet.allergies && selectedPet.allergies !== 'None' && (
                        <p className="text-red-600 font-medium">
                          ⚠️ Allergies: {selectedPet.allergies}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Veterinarian & Record Type */}
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
                  Record Type *
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
                  <option value="">Select record type</option>
                  {recordTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>
            </div>

            {/* Procedure/Treatment */}
            <div>
              <label htmlFor="procedure" className="block text-sm font-medium text-gray-700 mb-1">
                Procedure/Treatment *
              </label>
              <input
                type="text"
                id="procedure"
                name="procedure"
                required
                className={`block w-full border rounded-lg shadow-sm py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.procedure ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="e.g., Annual vaccination, Dental cleaning, Spay surgery, Blood test"
                value={formData.procedure}
                onChange={handleInputChange}
              />
              {errors.procedure && (
                <p className="mt-1 text-sm text-red-600">{errors.procedure}</p>
              )}
            </div>

            {/* Clinical Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Clinical Notes *
              </label>
              <textarea
                id="notes"
                name="notes"
                required
                rows={5}
                className={`block w-full border rounded-lg shadow-sm py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.notes ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Detailed clinical notes, observations, diagnosis, treatment plan, patient condition, recommendations, follow-up instructions..."
                value={formData.notes}
                onChange={handleInputChange}
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
              )}
            </div>

            {/* Medications */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Medications Prescribed
                </label>
                <button
                  type="button"
                  onClick={() => addArrayField('medications')}
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <SafeIcon icon={FiPlus} className="h-4 w-4 mr-1" />
                  Add Medication
                </button>
              </div>
              <div className="space-y-3">
                {formData.medications.map((medication, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g., Amoxicillin 500mg - twice daily for 10 days"
                        value={medication}
                        onChange={(e) => handleArrayInputChange(index, e.target.value, 'medications')}
                      />
                    </div>
                    {formData.medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'medications')}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove medication"
                      >
                        <SafeIcon icon={FiTrash2} className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment Used */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Equipment Used
                </label>
                <button
                  type="button"
                  onClick={() => addArrayField('equipment')}
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <SafeIcon icon={FiPlus} className="h-4 w-4 mr-1" />
                  Add Equipment
                </button>
              </div>
              <div className="space-y-3">
                {formData.equipment.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g., X-ray machine, Surgical instruments, Anesthesia equipment"
                        value={item}
                        onChange={(e) => handleArrayInputChange(index, e.target.value, 'equipment')}
                      />
                    </div>
                    {formData.equipment.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'equipment')}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove equipment"
                      >
                        <SafeIcon icon={FiTrash2} className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Cost and Vet Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Cost ($)
                </label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  min="0"
                  step="0.01"
                  className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                  value={formData.cost}
                  onChange={handleInputChange}
                />
              </div>

              {selectedVet && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Attending Veterinarian:</h4>
                  <p className="text-sm text-gray-700">{selectedVet.name}</p>
                  <p className="text-sm text-gray-500">{selectedVet.specialization}</p>
                  <p className="text-sm text-gray-500">{selectedVet.email}</p>
                </div>
              )}
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
                disabled={isSubmitting || !formData.customerId || !formData.petId || !formData.veterinarianId || !formData.type || !formData.procedure || !formData.notes}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Record...
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiSave} className="h-4 w-4 mr-2" />
                    Create Medical Record
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
            <li>• All required fields (*) must be completed to enable submission</li>
            <li>• Select customer first to see their pets</li>
            <li>• Pet allergies will be displayed as a warning if present</li>
            <li>• Clinical notes should include diagnosis, treatment plan, and observations</li>
            <li>• Add multiple medications and equipment as needed</li>
            <li>• Cost field is optional but recommended for billing purposes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddMedicalRecord;