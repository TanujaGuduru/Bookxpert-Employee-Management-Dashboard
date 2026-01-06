import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';
import { FilterOptions } from '../types';
import EmployeeList from '../components/EmployeeList';
import EmployeeFilters from '../components/EmployeeFilters';
import DashboardStats from '../components/DashboardStats';
import DeleteModal from '../components/DeleteModal';

const Dashboard: React.FC = () => {
  const { employees, deleteEmployee, toggleEmployeeStatus, isLoading } = useEmployees();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    gender: 'all',
    status: 'all',
  });
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; employeeId: string | null; employeeName: string }>({
    isOpen: false,
    employeeId: null,
    employeeName: '',
  });

  // Filter employees based on current filters
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      // Search filter
      const matchesSearch = employee.fullName
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase());

      // Gender filter
      const matchesGender = filters.gender === 'all' || employee.gender === filters.gender;

      // Status filter
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'active' && employee.isActive) ||
        (filters.status === 'inactive' && !employee.isActive);

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [employees, filters]);

  const handleEdit = (id: string) => {
    navigate(`/employee/edit/${id}`);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, employeeId: id, employeeName: name });
  };

  const confirmDelete = () => {
    if (deleteModal.employeeId) {
      deleteEmployee(deleteModal.employeeId);
    }
    setDeleteModal({ isOpen: false, employeeId: null, employeeName: '' });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
              <path d="M12 14.5C6.99 14.5 3 17.86 3 22H21C21 17.86 17.01 14.5 12 14.5Z" fill="currentColor"/>
            </svg>
            Employee Dashboard
          </h1>
        </div>
        <div className="header-right">
          <span className="welcome-text">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn btn-outline">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414l-4.293 4.293a1 1 0 01-1.414 0L4 7.414 5.414 6l3.293 3.293L13 5l1 2.414z" clipRule="evenodd"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Stats Section */}
        <DashboardStats employees={employees} />

        {/* Actions Bar */}
        <div className="actions-bar">
          <button onClick={() => navigate('/employee/add')} className="btn btn-primary">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Add Employee
          </button>
          <button onClick={handlePrint} className="btn btn-secondary print-btn">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd"/>
            </svg>
            Print List
          </button>
        </div>

        {/* Filters */}
        <EmployeeFilters filters={filters} setFilters={setFilters} />

        {/* Employee List */}
        <EmployeeList
          employees={filteredEmployees}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={toggleEmployeeStatus}
        />

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>No employees found</h3>
            <p>
              {employees.length === 0
                ? 'Start by adding your first employee'
                : 'Try adjusting your search or filter criteria'}
            </p>
            {employees.length === 0 && (
              <button onClick={() => navigate('/employee/add')} className="btn btn-primary">
                Add First Employee
              </button>
            )}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        employeeName={deleteModal.employeeName}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, employeeId: null, employeeName: '' })}
      />
    </div>
  );
};

export default Dashboard;
