// Employee type definition
export interface Employee {
  id: string;
  fullName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  profileImage: string;
  state: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Form data for creating/editing employees
export interface EmployeeFormData {
  fullName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  profileImage: string;
  state: string;
  isActive: boolean;
}

// Authentication types
export interface User {
  username: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Filter options
export interface FilterOptions {
  searchQuery: string;
  gender: 'all' | 'male' | 'female' | 'other';
  status: 'all' | 'active' | 'inactive';
}
