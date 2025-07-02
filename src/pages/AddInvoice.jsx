import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiDollarSign, FiFileText } = FiIcons;

const AddInvoice = () => {
  const navigate = useNavigate();
  const { customers, pets, services, addInvoice } = useData();

  const [formData, setFormData] = useState({
    customerId: '',
    petId: '',
    invoiceNumber: '',
    status: 'pending',
    items: [{ serviceId: '', description: '', quantity: 1, price: 0 }],
    notes: ''
  });

  const [availablePets, setAvailablePets] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Generate invoice number for new invoices
    const invoiceNum = `INV-${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      invoiceNumber: invoiceNum
    }));
  }, []);

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
    
    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }

    // Validate items
    const validItems = formData.items.filter(item => 
      item.description.trim() && item.quantity > 0 && item.price >= 0
    );

    if (validItems.length === 0) {
      newErrors.items = 'At least one valid item is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['customerId', 'petId'].includes(name) ? (parseInt(value) || '') : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          
          // Auto-fill service details when service is selected
          if (field === 'serviceId' && value) {
            const service = services.find(s => s.id === parseInt(value));
            if (service) {
              updatedItem.description = service.name;
              updatedItem.price = service.price;
            }
          }
          
          return updatedItem;
        }
        return item;
      })
    }));

    // Clear items error when user starts adding valid items
    if (errors.items) {
      setErrors(prev => ({
        ...prev,
        items: ''
      }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { serviceId: '', description: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const invoiceData = {
        ...formData,
        customerId: parseInt(formData.customerId),
        petId: formData.petId ? parseInt(formData.petId) : null,
        items: formData.items.filter(item => item.description.trim()),
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        date: new Date()
      };

      console.log('Creating invoice:', invoiceData);
      
      const newInvoice = addInvoice(invoiceData);
      console.log('New invoice created:', newInvoice);

      // Navigate back to invoices list
      navigate('/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      // You could add error handling here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/invoices');
  };

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
            Back to Invoices
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Invoice
          </h1>
          <p className="text-gray-600 mt-2">
            Generate a new invoice for your customer
          </p>
        </div>

        {/* Invoice Form */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <SafeIcon icon={FiDollarSign} className="h-5 w-5 mr-2 text-primary-600" />
              Invoice Details
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number *
                </label>
                <input
                  type="text"
                  id="invoiceNumber"
                  name="invoiceNumber"
                  required
                  className={`block w-full border rounded-lg shadow-sm py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.invoiceNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                />
                {errors.invoiceNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.invoiceNumber}</p>
                )}
              </div>

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
                      {customer.name}
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>
                )}
              </div>

              <div>
                <label htmlFor="petId" className="block text-sm font-medium text-gray-700 mb-1">
                  Pet <span className="text-gray-500">(Optional)</span>
                </label>
                <select
                  id="petId"
                  name="petId"
                  disabled={!formData.customerId}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  value={formData.petId}
                  onChange={handleInputChange}
                >
                  <option value="">Select a pet (optional)</option>
                  {availablePets.map(pet => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species})
                    </option>
                  ))}
                </select>
              </div>

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
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Customer Info Display */}
            {selectedCustomer && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Bill To:</h3>
                <div className="text-sm text-blue-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">{selectedCustomer.name}</p>
                      <p>{selectedCustomer.email}</p>
                      <p>{selectedCustomer.phone}</p>
                      {selectedCustomer.address && <p>{selectedCustomer.address}</p>}
                    </div>
                    {selectedPet && (
                      <div>
                        <p className="font-medium text-primary-600">
                          Pet: {selectedPet.name} ({selectedPet.species})
                        </p>
                        <p className="text-sm">{selectedPet.breed} • {selectedPet.age} years old</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Line Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Items</h3>
                  {errors.items && (
                    <p className="mt-1 text-sm text-red-600">{errors.items}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <SafeIcon icon={FiPlus} className="h-4 w-4 mr-1" />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service
                      </label>
                      <select
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={item.serviceId}
                        onChange={(e) => handleItemChange(index, 'serviceId', e.target.value)}
                      >
                        <option value="">Select service</option>
                        {services.map(service => (
                          <option key={service.id} value={service.id}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <input
                        type="text"
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Item description"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>

                    <div className="flex items-end">
                      <div className="text-right flex-1">
                        <div className="text-sm font-medium text-gray-700 mb-1">Total</div>
                        <div className="text-lg font-semibold text-gray-900">
                          ${(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="ml-2 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <SafeIcon icon={FiTrash2} className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-end">
                <div className="w-80 space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (8%):</span>
                    <span className="font-medium">${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                    <span>Total:</span>
                    <span className="text-primary-600">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
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
                  placeholder="Additional notes for the invoice..."
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
                disabled={isSubmitting || !formData.customerId || !formData.invoiceNumber}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Invoice...
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiSave} className="h-4 w-4 mr-2" />
                    Create Invoice
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
            <li>• Fill in customer and at least one item to enable submit</li>
            <li>• Select services from the dropdown to auto-fill prices</li>
            <li>• Pet selection is optional for general services</li>
            <li>• Tax is automatically calculated at 8%</li>
            <li>• Invoice number is auto-generated but can be modified</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddInvoice;