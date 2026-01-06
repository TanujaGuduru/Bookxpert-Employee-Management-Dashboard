import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployees, INDIAN_STATES } from '../context/EmployeeContext';
import { EmployeeFormData } from '../types';

interface FormErrors {
  fullName?: string;
  gender?: string;
  dateOfBirth?: string;
  state?: string;
  profileImage?: string;
}

const EmployeeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addEmployee, updateEmployee, getEmployeeById } = useEmployees();
  const isEditing = !!id;

  const [formData, setFormData] = useState<EmployeeFormData>({
    fullName: '',
    gender: 'male',
    dateOfBirth: '',
    profileImage: '',
    state: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const employee = getEmployeeById(id);
      if (employee) {
        setFormData({
          fullName: employee.fullName,
          gender: employee.gender,
          dateOfBirth: employee.dateOfBirth,
          profileImage: employee.profileImage,
          state: employee.state,
          isActive: employee.isActive,
        });
        setImagePreview(employee.profileImage);
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, isEditing, getEmployeeById, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = 'Employee must be at least 18 years old';
      }
      if (dob > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, profileImage: 'Image size must be less than 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, profileImage: result }));
        setImagePreview(result);
        setErrors(prev => ({ ...prev, profileImage: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateDefaultAvatar = () => {
    if (formData.fullName.trim()) {
      const colors = ['4f46e5', 'ec4899', '10b981', 'f59e0b', '6366f1', '8b5cf6', 'ef4444', '14b8a6'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=${randomColor}&color=fff&size=150`;
      setFormData(prev => ({ ...prev, profileImage: avatarUrl }));
      setImagePreview(avatarUrl);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Generate default avatar if no image is provided
    let finalFormData = { ...formData };
    if (!finalFormData.profileImage) {
      const colors = ['4f46e5', 'ec4899', '10b981', 'f59e0b', '6366f1', '8b5cf6'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      finalFormData.profileImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=${randomColor}&color=fff&size=150`;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (isEditing && id) {
      updateEmployee(id, finalFormData);
    } else {
      addEmployee(finalFormData);
    }

    setIsSubmitting(false);
    navigate('/dashboard');
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Dashboard
          </button>
          <h1>{isEditing ? 'Edit Employee' : 'Add New Employee'}</h1>
          <p>{isEditing ? 'Update employee information' : 'Fill in the details to add a new employee'}</p>
        </div>

        <form onSubmit={handleSubmit} className="employee-form">
          {/* Profile Image Section */}
          <div className="form-section">
            <h3>Profile Image</h3>
            <div className="image-upload-section">
              <div className="image-preview-container">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile preview" className="image-preview" />
                ) : (
                  <div className="image-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 14.5C6.99 14.5 3 17.86 3 22H21C21 17.86 17.01 14.5 12 14.5Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>No image</span>
                  </div>
                )}
              </div>
              <div className="image-upload-controls">
                <label className="btn btn-secondary">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </label>
                <button type="button" onClick={generateDefaultAvatar} className="btn btn-outline" disabled={!formData.fullName.trim()}>
                  Generate Avatar
                </button>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, profileImage: '' }));
                    }}
                    className="btn btn-danger-outline"
                  >
                    Remove
                  </button>
                )}
              </div>
              {errors.profileImage && <span className="error-text">{errors.profileImage}</span>}
            </div>
          </div>

          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={errors.gender ? 'error' : ''}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <span className="error-text">{errors.gender}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth *</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={errors.dateOfBirth ? 'error' : ''}
                />
                {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="state">State *</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className={errors.state ? 'error' : ''}
              >
                <option value="">Select a state</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <span className="error-text">{errors.state}</span>}
            </div>
          </div>

          {/* Status */}
          <div className="form-section">
            <h3>Employment Status</h3>
            <div className="toggle-group">
              <label className="toggle-label">
                <span>Active Status</span>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </div>
                <span className={`status-text ${formData.isActive ? 'active' : 'inactive'}`}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span>
                  {isEditing ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditing ? 'Update Employee' : 'Add Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
