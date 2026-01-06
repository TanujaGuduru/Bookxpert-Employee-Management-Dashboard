import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, EmployeeFormData } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Indian states list
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

// Sample employee data
const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: '1',
    fullName: 'Rahul Sharma',
    gender: 'male',
    dateOfBirth: '1990-05-15',
    profileImage: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=4f46e5&color=fff&size=150',
    state: 'Maharashtra',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    fullName: 'Priya Patel',
    gender: 'female',
    dateOfBirth: '1988-08-22',
    profileImage: 'https://ui-avatars.com/api/?name=Priya+Patel&background=ec4899&color=fff&size=150',
    state: 'Gujarat',
    isActive: true,
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    fullName: 'Amit Kumar',
    gender: 'male',
    dateOfBirth: '1995-03-10',
    profileImage: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=10b981&color=fff&size=150',
    state: 'Delhi',
    isActive: false,
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T09:00:00Z',
  },
  {
    id: '4',
    fullName: 'Sneha Reddy',
    gender: 'female',
    dateOfBirth: '1992-11-28',
    profileImage: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=f59e0b&color=fff&size=150',
    state: 'Karnataka',
    isActive: true,
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-18T11:45:00Z',
  },
  {
    id: '5',
    fullName: 'Vikram Singh',
    gender: 'male',
    dateOfBirth: '1985-07-04',
    profileImage: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=6366f1&color=fff&size=150',
    state: 'Punjab',
    isActive: true,
    createdAt: '2024-01-19T16:30:00Z',
    updatedAt: '2024-01-19T16:30:00Z',
  },
  {
    id: '6',
    fullName: 'Anjali Gupta',
    gender: 'female',
    dateOfBirth: '1993-02-14',
    profileImage: 'https://ui-avatars.com/api/?name=Anjali+Gupta&background=8b5cf6&color=fff&size=150',
    state: 'Uttar Pradesh',
    isActive: false,
    createdAt: '2024-01-20T08:15:00Z',
    updatedAt: '2024-01-20T08:15:00Z',
  },
];

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (data: EmployeeFormData) => void;
  updateEmployee: (id: string, data: EmployeeFormData) => void;
  deleteEmployee: (id: string) => void;
  toggleEmployeeStatus: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;
  isLoading: boolean;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

interface EmployeeProviderProps {
  children: ReactNode;
}

export const EmployeeProvider: React.FC<EmployeeProviderProps> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load employees from localStorage or use initial data
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    } else {
      setEmployees(INITIAL_EMPLOYEES);
      localStorage.setItem('employees', JSON.stringify(INITIAL_EMPLOYEES));
    }
    setIsLoading(false);
  }, []);

  const saveToStorage = (updatedEmployees: Employee[]) => {
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const addEmployee = (data: EmployeeFormData) => {
    const newEmployee: Employee = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    saveToStorage(updatedEmployees);
  };

  const updateEmployee = (id: string, data: EmployeeFormData) => {
    const updatedEmployees = employees.map(emp =>
      emp.id === id
        ? { ...emp, ...data, updatedAt: new Date().toISOString() }
        : emp
    );
    setEmployees(updatedEmployees);
    saveToStorage(updatedEmployees);
  };

  const deleteEmployee = (id: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    setEmployees(updatedEmployees);
    saveToStorage(updatedEmployees);
  };

  const toggleEmployeeStatus = (id: string) => {
    const updatedEmployees = employees.map(emp =>
      emp.id === id
        ? { ...emp, isActive: !emp.isActive, updatedAt: new Date().toISOString() }
        : emp
    );
    setEmployees(updatedEmployees);
    saveToStorage(updatedEmployees);
  };

  const getEmployeeById = (id: string): Employee | undefined => {
    return employees.find(emp => emp.id === id);
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        toggleEmployeeStatus,
        getEmployeeById,
        isLoading,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = (): EmployeeContextType => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};
