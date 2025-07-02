import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiDollarSign, FiSettings, FiSave, FiPlus, FiEdit, FiTrash2 } = FiIcons;

const Settings = () => {
  const { veterinarians, services } = useData();
  const [activeTab, setActiveTab] = useState('veterinarians');

  const tabs = [
    { id: 'veterinarians', name: 'Veterinarians', icon: FiUser },
    { id: 'services', name: 'Services & Pricing', icon: FiDollarSign },
    { id: 'general', name: 'General Settings', icon: FiSettings }
  ];

  const VeterinariansTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Veterinarians</h3>
        <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700">
          <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
          Add Veterinarian
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="divide-y divide-gray-200">
          {veterinarians.map((vet) => (
            <div key={vet.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">{vet.name}</h4>
                  <p className="text-sm text-gray-600">{vet.specialization}</p>
                  <p className="text-sm text-gray-500">{vet.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200">
                    <SafeIcon icon={FiEdit} className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200">
                    <SafeIcon icon={FiTrash2} className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ServicesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Services & Pricing</h3>
        <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700">
          <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
          Add Service
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="divide-y divide-gray-200">
          {services.map((service) => (
            <div key={service.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-600">{service.category}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      ${service.price}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200">
                      <SafeIcon icon={FiEdit} className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200">
                      <SafeIcon icon={FiTrash2} className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const GeneralTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Clinic Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                defaultValue="VetCare Animal Hospital"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                defaultValue="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                defaultValue="info@vetcare.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                defaultValue="8.00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Clinic Address
              </label>
              <textarea
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                defaultValue="123 Veterinary Way, Pet City, PC 12345"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <SafeIcon icon={FiSave} className="h-4 w-4 mr-2" />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your clinic configuration and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'veterinarians' && <VeterinariansTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'general' && <GeneralTab />}
        </div>
      </div>
    </div>
  );
};

export default Settings;