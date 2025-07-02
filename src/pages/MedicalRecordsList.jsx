import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiSearch, FiFilter, FiFileText, FiCalendar } = FiIcons;

const MedicalRecordsList = () => {
  const { medicalRecords, customers, pets, veterinarians } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterVet, setFilterVet] = useState('all');

  const filteredRecords = medicalRecords.filter(record => {
    const customer = customers.find(c => c.id === record.customerId);
    const pet = pets.find(p => p.id === record.petId);
    
    const matchesSearch = 
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.procedure?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || record.type === filterType;
    const matchesVet = filterVet === 'all' || record.veterinarianId === parseInt(filterVet);

    return matchesSearch && matchesType && matchesVet;
  });

  const recordTypes = [
    'Consultation',
    'Surgery',
    'Vaccination',
    'Dental',
    'Diagnostic',
    'Treatment',
    'Emergency'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-600 mt-1">Patient medical history and records</p>
        </div>
        <Link
          to="/medical-records/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
          New Record
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiFilter} className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              {recordTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={filterVet}
              onChange={(e) => setFilterVet(e.target.value)}
            >
              <option value="all">All Veterinarians</option>
              {veterinarians.map(vet => (
                <option key={vet.id} value={vet.id}>{vet.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Medical Records ({filteredRecords.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredRecords.length === 0 ? (
            <div className="p-6 text-center">
              <SafeIcon icon={FiFileText} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">
                {searchTerm || filterType !== 'all' || filterVet !== 'all' 
                  ? 'No records found matching your criteria.' 
                  : 'No medical records found.'
                }
              </p>
              {!searchTerm && filterType === 'all' && filterVet === 'all' && (
                <Link
                  to="/medical-records/new"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700"
                >
                  <SafeIcon icon={FiPlus} className="h-4 w-4 mr-1" />
                  Create first medical record
                </Link>
              )}
            </div>
          ) : (
            filteredRecords.map((record) => {
              const customer = customers.find(c => c.id === record.customerId);
              const pet = pets.find(p => p.id === record.petId);
              const vet = veterinarians.find(v => v.id === record.veterinarianId);
              
              return (
                <Link
                  key={record.id}
                  to={`/medical-records/${record.id}`}
                  className="block p-6 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <SafeIcon icon={FiFileText} className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {record.procedure || record.type}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {record.type}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span>{customer?.name} - {pet?.name} ({pet?.species})</span>
                            <span>•</span>
                            <span>Dr. {vet?.name}</span>
                            <span>•</span>
                            <div className="flex items-center">
                              <SafeIcon icon={FiCalendar} className="h-4 w-4 mr-1" />
                              {new Date(record.date).toLocaleDateString()}
                            </div>
                          </div>
                          {record.notes && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                              {record.notes}
                            </p>
                          )}
                          {record.medications && record.medications.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-gray-500">Medications: </span>
                              <span className="text-xs text-gray-600">
                                {record.medications.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {record.cost && (
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            ${record.cost}
                          </div>
                          <div className="text-xs text-gray-500">Total Cost</div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsList;