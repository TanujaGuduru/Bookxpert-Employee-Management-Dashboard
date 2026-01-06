import React, { ChangeEvent } from 'react';
import { FilterOptions } from '../types';

interface EmployeeFiltersProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
}

const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({ filters, setFilters }) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, gender: e.target.value as FilterOptions['gender'] }));
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, status: e.target.value as FilterOptions['status'] }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      gender: 'all',
      status: 'all',
    });
  };

  const hasActiveFilters = filters.searchQuery || filters.gender !== 'all' || filters.status !== 'all';

  return (
    <div className="filters-container no-print">
      <div className="search-box">
        <svg viewBox="0 0 20 20" fill="currentColor" className="search-icon">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
        </svg>
        <input
          type="text"
          placeholder="Search by name..."
          value={filters.searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        {filters.searchQuery && (
          <button
            onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
            className="clear-search-btn"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
          </button>
        )}
      </div>

      <div className="filter-selects">
        <div className="filter-group">
          <label htmlFor="gender-filter">Gender</label>
          <select
            id="gender-filter"
            value={filters.gender}
            onChange={handleGenderChange}
            className="filter-select"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={handleStatusChange}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button onClick={clearFilters} className="clear-filters-btn">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeFilters;
