import React from 'react';
import { Employee } from '../types';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onToggleStatus: (id: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onEdit, onDelete, onToggleStatus }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handlePrintEmployee = (employee: Employee) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Employee Details - ${employee.fullName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .profile-img { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 20px; }
            .details { max-width: 500px; margin: 0 auto; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .status { padding: 4px 12px; border-radius: 20px; font-size: 14px; }
            .active { background: #d1fae5; color: #065f46; }
            .inactive { background: #fee2e2; color: #991b1b; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${employee.profileImage}" alt="${employee.fullName}" class="profile-img" />
            <h1>${employee.fullName}</h1>
          </div>
          <div class="details">
            <div class="detail-row">
              <span class="label">Employee ID</span>
              <span class="value">${employee.id.substring(0, 8).toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="label">Gender</span>
              <span class="value">${employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1)}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date of Birth</span>
              <span class="value">${formatDate(employee.dateOfBirth)} (Age: ${calculateAge(employee.dateOfBirth)})</span>
            </div>
            <div class="detail-row">
              <span class="label">State</span>
              <span class="value">${employee.state}</span>
            </div>
            <div class="detail-row">
              <span class="label">Status</span>
              <span class="status ${employee.isActive ? 'active' : 'inactive'}">${employee.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (employees.length === 0) {
    return null;
  }

  return (
    <div className="employee-table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Profile</th>
            <th>Full Name</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>State</th>
            <th>Status</th>
            <th className="no-print">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="employee-id">
                <code>{employee.id.substring(0, 8).toUpperCase()}</code>
              </td>
              <td>
                <img
                  src={employee.profileImage}
                  alt={employee.fullName}
                  className="employee-avatar"
                />
              </td>
              <td className="employee-name">{employee.fullName}</td>
              <td>
                <span className={`gender-badge gender-${employee.gender}`}>
                  {employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1)}
                </span>
              </td>
              <td>
                <div className="dob-cell">
                  <span>{formatDate(employee.dateOfBirth)}</span>
                  <small>Age: {calculateAge(employee.dateOfBirth)}</small>
                </div>
              </td>
              <td>{employee.state}</td>
              <td>
                <button
                  onClick={() => onToggleStatus(employee.id)}
                  className={`status-toggle ${employee.isActive ? 'active' : 'inactive'}`}
                  title={`Click to ${employee.isActive ? 'deactivate' : 'activate'}`}
                >
                  <span className="toggle-indicator"></span>
                  <span className="toggle-text">{employee.isActive ? 'Active' : 'Inactive'}</span>
                </button>
              </td>
              <td className="actions-cell no-print">
                <div className="action-buttons">
                  <button
                    onClick={() => onEdit(employee.id)}
                    className="action-btn edit-btn"
                    title="Edit employee"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(employee.id, employee.fullName)}
                    className="action-btn delete-btn"
                    title="Delete employee"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePrintEmployee(employee)}
                    className="action-btn print-btn"
                    title="Print employee details"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
