import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSave, FiArrowLeft, FiPlus, FiTrash2 } = FiIcons;

const MedicalRecordEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { medicalRecords, customers, pets, veterinarians, services, addMedicalRecord, updateMedicalRecord } = useData();
  
  const isEditing = id !== 'new';
  const record = isEditing ? medicalRecords.find(r => r.id === parseInt(id)) : null;

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

  useEffect(() => {
    if (record) {
      setFormData({
        customerId: record.customerId || '',
        petId: record.petId || '',
        veterinarianId: record.veterinarianId || '',
        type: record.type || '',
        procedure: record.procedure || '',
        notes: record.notes || '',
        medications: record.medications || [''],
        equipment: record.equipment || [''],
        cost: record.cost || ''
      });
    }
  }, [record]);

  useEffect(() => {
    if (formData.customerId) {
      const customerPets = pets.filter(pet => pet.customerId === parseInt(formData.customerId));
      setAvailablePets(customerPets);
      
      if (formData.petId && !customerPets.find(pet => pet.id === parseInt(formData.petId))) {
        setFormData(prev => ({ ...prev, petId: '' }));
      }
    } else {
      setAvailablePets([]);
    }
  }, [formData.customerId, pets]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['customerId', 'petId', 'veterinarianId'].includes(name) 
        ? parseInt(value) || '' 
        : value
    }));
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
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const recordData = {
      ...formData,
      medications: formData.medications.filter(med => med.trim() !== ''),
      equipment: formData.equipment.filter(eq => eq.trim() !== ''),
      cost: parseFloat(formData.cost) || 0
    };

    if (isEditing) {
      updateMedicalRecord(parseInt(id), recordData);
    } else {
      addMedicalRecord(recordData);
    }
    
    navigate('/medical-records');
  };

  if (isEditing && !record) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Medical record not found</p>
        <button onClick={() => navigate('/medical-records')} className="text-primary-600 hover:text-primary-700">
          Back to medical records
        </button>
      </div>
    );
  }

  const recordTypes = [
    'Consultation',
    'Surgery',
    'Vaccination',
    'Dental',
    'Diagnostic',
    'Treatment',
    'Emergency',
    'Follow-up'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/medical-records')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <SafeIcon icon={FiArrowLeft} className="h-5 w-5 mr-1" />
          Back to medical records
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Medical Record' : 'New Medical Record'}
        </h1>
      </div>

      {/* Medical Record Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Medical Record Details</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
                Customer *
              </label>
              <select
                id="customerId"
                name="customerId"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
            </div>

            <div>
              <label htmlFor="petId" className="block text-sm font-medium text-gray-700">
                Pet *
              </label>
              <select
                id="petId"
                name="petId"
                required
                disabled={!formData.customerId}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
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
            </div>

            <div>
              <label htmlFor="veterinarianId" className="block text-sm font-medium text-gray-700">
                Veterinarian *
              </label>
              <select
                id="veterinarianId"
                name="veterinarianId"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Record Type *
              </label>
              <select
                id="type"
                name="type"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="">Select record type</option>
                {recordTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="procedure" className="block text-sm font-medium text-gray-700">
                Procedure/Treatment *
              </label>
              <input
                type="text"
                id="procedure"
                name="procedure"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Annual vaccination, Dental cleaning, Spay surgery"
                value={formData.procedure}
                onChange={handleInputChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Clinical Notes *
              </label>
              <textarea
                id="notes"
                name="notes"
                required
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Detailed clinical notes, observations, diagnosis, treatment plan..."
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
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
            <div className="space-y-2">
              {formData.medications.map((medication, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Amoxicillin 500mg, twice daily for 10 days"
                    value={medication}
                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'medications')}
                  />
                  {formData.medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, 'medications')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Equipment */}
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
            <div className="space-y-2">
              {formData.equipment.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., X-ray machine, Surgical instruments, Anesthesia equipment"
                    value={item}
                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'equipment')}
                  />
                  {formData.equipment.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, 'equipment')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cost */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
                Total Cost ($)
              </label>
              <input
                type="number"
                id="cost"
                name="cost"
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
                value={formData.cost}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/medical-records')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <SafeIcon icon={FiSave} className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Record' : 'Create Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalRecordEntry;