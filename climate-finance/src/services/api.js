// Base API configuration
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://climate-finance.onrender.com';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}/api${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Project API endpoints
export const projectApi = {
  // Basic CRUD Operations
  getAll: () => apiRequest('/project/all-project'),
  getById: (id) => apiRequest(`/project/get/${id}`),
  add: (projectData) => apiRequest('/project/add-project', {
    method: 'POST',
    body: JSON.stringify(projectData),
  }),
  update: (id, projectData) => apiRequest(`/project/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  }),
  delete: (id) => apiRequest(`/project/delete/${id}`, {
    method: 'DELETE',
  }),

  // Analytics & Statistics
  getOverviewStats: () => apiRequest('/project/projectsOverviewStats'),
  getByStatus: () => apiRequest('/project/get-project-by-status'),
  getBySector: () => apiRequest('/project/get-project-by-sector'),
  getTrend: () => apiRequest('/project/get-project-by-trend'),
  getByType: () => apiRequest('/project/get-project-by-type'),

  // Funding Source Analytics
  getFundingSourceByType: () => apiRequest('/project/get-funding-source-by-type'),
  getFundingSourceOverview: () => apiRequest('/project/get-funding-source-overview'),
  getFundingSourceTrend: () => apiRequest('/project/get-funding-source-trend'),
  getFundingSourceSectorAllocation: () => apiRequest('/project/get-funding-source-sector-allocation'),
  getFundingSource: () => apiRequest('/project/get-funding-source'),

  // Dashboard Data
  getDashboardOverviewStats: () => apiRequest('/project/get-overview-stat'),
  getRegionalDistribution: () => apiRequest('/project/get-regional-distribution'),
};

// Location API endpoints
export const locationApi = {
  // Get all locations
  getAll: () => apiRequest('/location/all'),
  
  // Get location by ID
  getById: (id) => apiRequest(`/location/get/${id}`),
  
  // Add new location
  add: (locationData) => apiRequest('/location/add-location', {
    method: 'POST',
    body: JSON.stringify(locationData),
  }),
  
  // Update location
  update: (id, locationData) => apiRequest(`/location/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(locationData),
  }),
  
  // Delete location
  delete: (id) => apiRequest(`/location/delete/${id}`, {
    method: 'DELETE',
  }),
};

// Agency API endpoints
export const agencyApi = {
  // Get all agencies
  getAll: () => apiRequest('/agency/all'),
  
  // Get agency by ID
  getById: (id) => apiRequest(`/agency/get/${id}`),
  
  // Add new agency
  add: (agencyData) => apiRequest('/agency/add-agency', {
    method: 'POST',
    body: JSON.stringify(agencyData),
  }),
  
  // Update agency
  update: (id, agencyData) => apiRequest(`/agency/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(agencyData),
  }),
  
  // Delete agency
  delete: (id) => apiRequest(`/agency/delete/${id}`, {
    method: 'DELETE',
  }),
};

// Funding Source API endpoints
export const fundingSourceApi = {
  // Get all funding sources
  getAll: () => apiRequest('/funding-source/all'),
  
  // Get funding source by ID
  getById: (id) => apiRequest(`/funding-source/get/${id}`),
  
  // Add new funding source
  add: (fundingSourceData) => apiRequest('/funding-source/add-funding-source', {
    method: 'POST',
    body: JSON.stringify(fundingSourceData),
  }),
  
  // Update funding source
  update: (id, fundingSourceData) => apiRequest(`/funding-source/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(fundingSourceData),
  }),
  
  // Delete funding source
  delete: (id) => apiRequest(`/funding-source/delete/${id}`, {
    method: 'DELETE',
  }),
};

// Focal Area API endpoints
export const focalAreaApi = {
  // Get all focal areas
  getAll: () => apiRequest('/focal-area/all'),
  
  // Get focal area by ID
  getById: (id) => apiRequest(`/focal-area/get/${id}`),
  
  // Add new focal area
  add: (focalAreaData) => apiRequest('/focal-area/add-focal-area', {
    method: 'POST',
    body: JSON.stringify(focalAreaData),
  }),
  
  // Update focal area
  update: (id, focalAreaData) => apiRequest(`/focal-area/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(focalAreaData),
  }),
  
  // Delete focal area
  delete: (id) => apiRequest(`/focal-area/delete/${id}`, {
    method: 'DELETE',
  }),
};

// User API endpoints
export const userApi = {
  // Get all users
  getAll: () => apiRequest('/auth/get-all-user'),
  
  // Register new user
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Update user
  update: (id, userData) => apiRequest(`/auth/user/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  // Delete user
  delete: (id) => apiRequest(`/auth/user/${id}`, {
    method: 'DELETE',
  }),
};

export default apiRequest;