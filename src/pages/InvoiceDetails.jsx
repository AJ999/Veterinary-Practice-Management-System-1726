import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiPrinter } = FiIcons;

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, customers, pets, services, addInvoice, updateInvoice } = useData();
  
  const isEditing = id !== 'new';
  const invoice = isEditing ? invoices.find(i => i.id === parseInt(id)) : null;

  const [formData, setFormData] = useState({
    customerId: '',
    petId: '',
    invoiceNumber: '',
    status: 'pending',
    items: [{ serviceId: '', description: '', quantity: 1, price: 0 }],
    notes: ''
  });

  const [availablePets, setAvailablePets] = useState([]);

  useEffect(() => {
    if (invoice) {
      setFormData({
        customerId: invoice.customerId || '',
        petId: invoice.petId || '',
        invoiceNumber: invoice.invoiceNumber || '',
        status: invoice.status || 'pending',
        items: invoice.items || [{ serviceId: '', description: '', quantity: 1, price: 0 }],
        notes: invoice.notes || ''
      });
    } else {
      // Generate invoice number for new invoices
      const invoiceNum = `INV-${Date.now()}`;
      setFormData(prev => ({ ...prev, invoiceNumber: invoiceNum }));
    }
  }, [invoice]);

  useEffect(() => {
    if (formData.customerId) {
      const customerPets = pets.filter(pet => pet.customerId === parseInt(formData.customerId));
      setAvailablePets(customerPets);
    } else {
      setAvailablePets([]);
    }
  }, [formData.customerId, pets]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['customerId', 'petId'].includes(name) ? parseInt(value) || '' : value
    }));
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
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { serviceId: '', description: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const invoiceData = {
      ...formData,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal()
    };

    if (isEditing) {
      updateInvoice(parseInt(id), invoiceData);
    } else {
      addInvoice(invoiceData);
    }
    
    navigate('/invoices');
  };

  const handlePrint = () => {
    window.print();
  };

  if (isEditing && !invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Invoice not found</p>
        <button onClick={() => navigate('/invoices')} className="text-primary-600 hover:text-primary-700">
          Back to invoices
        </button>
      </div>
    );
  }

  const selectedCustomer = customers.find(c => c.id === formData.customerId);
  const selectedPet = pets.find(p => p.id === formData.petId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/invoices')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <SafeIcon icon={FiArrowLeft} className="h-5 w-5 mr-1" />
            Back to invoices
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Invoice' : 'New Invoice'}
          </h1>
        </div>
        {isEditing && (
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200"
          >
            <SafeIcon icon={FiPrinter} className="h-4 w-4 mr-1" />
            Print
          </button>
        )}
      </div>

      {/* Invoice Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Invoice Details</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">
                Invoice Number *
              </label>
              <input
                type="text"
                id="invoiceNumber"
                name="invoiceNumber"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
              />
            </div>

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
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="petId" className="block text-sm font-medium text-gray-700">
                Pet
              </label>
              <select
                id="petId"
                name="petId"
                disabled={!formData.customerId}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
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
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Bill To:</h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium">{selectedCustomer.name}</p>
                <p>{selectedCustomer.email}</p>
                <p>{selectedCustomer.phone}</p>
                {selectedCustomer.address && <p>{selectedCustomer.address}</p>}
                {selectedPet && (
                  <p className="mt-2 text-primary-600">
                    Pet: {selectedPet.name} ({selectedPet.species})
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
              >
                <SafeIcon icon={FiPlus} className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service
                    </label>
                    <select
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                      Description
                    </label>
                    <input
                      type="text"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Item description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
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
                        className="ml-2 text-red-600 hover:text-red-700"
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
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%):</span>
                  <span className="font-medium">${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Additional notes for the invoice..."
              value={formData.notes}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/invoices')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <SafeIcon icon={FiSave} className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceDetails;