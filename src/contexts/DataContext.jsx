import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Initialize with mock data
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    const mockCustomers = [
      {
        id: 1,
        name: 'John Smith',
        email: 'john@email.com',
        phone: '555-0101',
        address: '123 Main St, Anytown, ST 12345'
      },
      {
        id: 2,
        name: 'Sarah Wilson',
        email: 'sarah@email.com',
        phone: '555-0102',
        address: '456 Oak Ave, Anytown, ST 12345'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@email.com',
        phone: '555-0103',
        address: '789 Pine Rd, Anytown, ST 12345'
      }
    ];

    const mockPets = [
      {
        id: 1,
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 3,
        customerId: 1,
        allergies: 'None',
        weight: '65 lbs'
      },
      {
        id: 2,
        name: 'Whiskers',
        species: 'Cat',
        breed: 'Persian',
        age: 2,
        customerId: 1,
        allergies: 'Chicken',
        weight: '8 lbs'
      },
      {
        id: 3,
        name: 'Max',
        species: 'Dog',
        breed: 'German Shepherd',
        age: 5,
        customerId: 2,
        allergies: 'None',
        weight: '75 lbs'
      },
      {
        id: 4,
        name: 'Luna',
        species: 'Cat',
        breed: 'Siamese',
        age: 1,
        customerId: 3,
        allergies: 'Fish',
        weight: '6 lbs'
      }
    ];

    const mockVeterinarians = [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialization: 'General Practice',
        email: 'sarah.j@vetcare.com'
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        specialization: 'Surgery',
        email: 'michael.c@vetcare.com'
      },
      {
        id: 3,
        name: 'Dr. Emily Rodriguez',
        specialization: 'Dermatology',
        email: 'emily.r@vetcare.com'
      }
    ];

    const mockServices = [
      { id: 1, name: 'Consultation', price: 75, category: 'Examination' },
      { id: 2, name: 'Vaccination', price: 45, category: 'Preventive' },
      { id: 3, name: 'Surgery', price: 500, category: 'Treatment' },
      { id: 4, name: 'Dental Cleaning', price: 200, category: 'Dental' },
      { id: 5, name: 'X-Ray', price: 150, category: 'Diagnostics' }
    ];

    const mockAppointments = [
      {
        id: 1,
        customerId: 1,
        petId: 1,
        veterinarianId: 1,
        date: new Date(2024, 0, 15, 10, 0),
        duration: 30,
        type: 'Consultation',
        status: 'scheduled',
        notes: 'Annual checkup'
      },
      {
        id: 2,
        customerId: 2,
        petId: 3,
        veterinarianId: 2,
        date: new Date(2024, 0, 15, 14, 0),
        duration: 60,
        type: 'Surgery',
        status: 'scheduled',
        notes: 'Spay surgery'
      }
    ];

    setCustomers(mockCustomers);
    setPets(mockPets);
    setVeterinarians(mockVeterinarians);
    setServices(mockServices);
    setAppointments(mockAppointments);
  };

  // Customer functions
  const addCustomer = (customer) => {
    const newCustomer = { ...customer, id: Date.now() };
    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (id, updates) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setPets(prev => prev.filter(p => p.customerId !== id));
  };

  // Pet functions
  const addPet = (pet) => {
    const newPet = { ...pet, id: Date.now() };
    setPets(prev => [...prev, newPet]);
    return newPet;
  };

  const updatePet = (id, updates) => {
    setPets(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePet = (id) => {
    setPets(prev => prev.filter(p => p.id !== id));
  };

  // Appointment functions
  const addAppointment = (appointment) => {
    console.log('Adding appointment:', appointment);
    const newAppointment = { 
      ...appointment, 
      id: Date.now(),
      date: new Date(appointment.date) // Ensure date is properly formatted
    };
    console.log('New appointment created:', newAppointment);
    setAppointments(prev => {
      const updated = [...prev, newAppointment];
      console.log('Updated appointments list:', updated);
      return updated;
    });
    return newAppointment;
  };

  const updateAppointment = (id, updates) => {
    console.log('Updating appointment:', id, updates);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // Medical record functions
  const addMedicalRecord = (record) => {
    const newRecord = { ...record, id: Date.now(), date: new Date() };
    setMedicalRecords(prev => [...prev, newRecord]);
    return newRecord;
  };

  const updateMedicalRecord = (id, updates) => {
    setMedicalRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  // Invoice functions
  const addInvoice = (invoice) => {
    const newInvoice = { ...invoice, id: Date.now(), date: new Date(), status: 'pending' };
    setInvoices(prev => [...prev, newInvoice]);
    return newInvoice;
  };

  const updateInvoice = (id, updates) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const value = {
    customers,
    pets,
    appointments,
    medicalRecords,
    invoices,
    veterinarians,
    services,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addPet,
    updatePet,
    deletePet,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addMedicalRecord,
    updateMedicalRecord,
    addInvoice,
    updateInvoice
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};