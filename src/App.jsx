import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import CustomerDetails from './pages/CustomerDetails';
import AddCustomer from './pages/AddCustomer';
import PetDetails from './pages/PetDetails';
import AppointmentCalendar from './pages/AppointmentCalendar';
import AppointmentDetails from './pages/AppointmentDetails';
import AddAppointment from './pages/AddAppointment';
import MedicalRecordsList from './pages/MedicalRecordsList';
import MedicalRecordEntry from './pages/MedicalRecordEntry';
import AddMedicalRecord from './pages/AddMedicalRecord';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetails from './pages/InvoiceDetails';
import AddInvoice from './pages/AddInvoice';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="customers" element={<CustomerList />} />
              <Route path="add-customer" element={<AddCustomer />} />
              <Route path="customers/new" element={<CustomerDetails />} />
              <Route path="customers/:id" element={<CustomerDetails />} />
              <Route path="pets/new" element={<PetDetails />} />
              <Route path="pets/:id" element={<PetDetails />} />
              <Route path="appointments" element={<AppointmentCalendar />} />
              <Route path="appointments/new" element={<AddAppointment />} />
              <Route path="appointments/:id" element={<AppointmentDetails />} />
              <Route path="medical-records" element={<MedicalRecordsList />} />
              <Route path="medical-records/new" element={<AddMedicalRecord />} />
              <Route path="medical-records/:id" element={<MedicalRecordEntry />} />
              <Route path="invoices" element={<InvoiceList />} />
              <Route path="invoices/new" element={<AddInvoice />} />
              <Route path="invoices/:id" element={<InvoiceDetails />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;