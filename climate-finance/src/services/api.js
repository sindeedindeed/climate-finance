// Base API configuration
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://climate-finance.onrender.com';

// Generic API request function with error handling
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
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // If response is not JSON, use status message
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    
    // Provide user-friendly error messages
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your internet connection and try again.');
    }
    
    throw error;
  }
};

// Project API endpoints
export const projectApi = {
  // Basic CRUD Operations
  getAll: () => apiRequest('/project/all-project'),
  getById: (id) => {
    if (!id) throw new Error('Project ID is required');
    return apiRequest(`/project/get/${id}`);
  },
  add: (projectData) => {
    if (!projectData) throw new Error('Project data is required');
    return apiRequest('/project/add-project', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },
  update: (id, projectData) => {
    if (!id) throw new Error('Project ID is required');
    if (!projectData) throw new Error('Project data is required');
    return apiRequest(`/project/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },
  delete: (id) => {
    if (!id) throw new Error('Project ID is required');
    return apiRequest(`/project/delete/${id}`, {
      method: 'DELETE',
    });
  },
  getByStatus: () => apiRequest('/project/get-project-by-status'),
  getBySector: () => apiRequest('/project/get-project-by-sector'),
  getTrend: () => apiRequest('/project/get-project-by-trend'),
  getByType: () => apiRequest('/project/get-project-by-type'),
  getOverviewStats: () => apiRequest('/project/get-overview-stat'),
  getProjectsOverviewStats: () => apiRequest('/project/projectsOverviewStats'),

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
  getAll: () => apiRequest('/location/all'),
  getById: (id) => {
    if (!id) throw new Error('Location ID is required');
    return apiRequest(`/location/get/${id}`);
  },
  add: (locationData) => {
    if (!locationData || !locationData.name) throw new Error('Location name is required');
    return apiRequest('/location/add-location', {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  },
  update: (id, locationData) => {
    if (!id) throw new Error('Location ID is required');
    if (!locationData) throw new Error('Location data is required');
    return apiRequest(`/location/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(locationData),
    });
  },
  delete: (id) => {
    if (!id) throw new Error('Location ID is required');
    return apiRequest(`/location/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

// Agency API endpoints
export const agencyApi = {
  getAll: () => apiRequest('/agency/all'),
  getById: (id) => {
    if (!id) throw new Error('Agency ID is required');
    return apiRequest(`/agency/get/${id}`);
  },
  add: (agencyData) => {
    if (!agencyData || !agencyData.name) throw new Error('Agency name is required');
    return apiRequest('/agency/add-agency', {
      method: 'POST',
      body: JSON.stringify(agencyData),
    });
  },
  update: (id, agencyData) => {
    if (!id) throw new Error('Agency ID is required');
    if (!agencyData) throw new Error('Agency data is required');
    return apiRequest(`/agency/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agencyData),
    });
  },
  delete: (id) => {
    if (!id) throw new Error('Agency ID is required');
    return apiRequest(`/agency/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

// Funding Source API endpoints
export const fundingSourceApi = {
  getAll: () => apiRequest('/funding-source/all'),
  getById: (id) => {
    if (!id) throw new Error('Funding source ID is required');
    return apiRequest(`/funding-source/get/${id}`);
  },
  add: (fundingSourceData) => {
    if (!fundingSourceData || !fundingSourceData.name) throw new Error('Funding source name is required');
    return apiRequest('/funding-source/add-funding-source', {
      method: 'POST',
      body: JSON.stringify(fundingSourceData),
    });
  },
  update: (id, fundingSourceData) => {
    if (!id) throw new Error('Funding source ID is required');
    if (!fundingSourceData) throw new Error('Funding source data is required');
    return apiRequest(`/funding-source/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fundingSourceData),
    });
  },
  delete: (id) => {
    if (!id) throw new Error('Funding source ID is required');
    return apiRequest(`/funding-source/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

// Focal Area API endpoints
export const focalAreaApi = {
  getAll: () => apiRequest('/focal-area/all'),
  getById: (id) => {
    if (!id) throw new Error('Focal area ID is required');
    return apiRequest(`/focal-area/get/${id}`);
  },
  add: (focalAreaData) => {
    if (!focalAreaData || !focalAreaData.name) throw new Error('Focal area name is required');
    return apiRequest('/focal-area/add-focal-area', {
      method: 'POST',
      body: JSON.stringify(focalAreaData),
    });
  },
  update: (id, focalAreaData) => {
    if (!id) throw new Error('Focal area ID is required');
    if (!focalAreaData) throw new Error('Focal area data is required');
    return apiRequest(`/focal-area/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(focalAreaData),
    });
  },
  delete: (id) => {
    if (!id) throw new Error('Focal area ID is required');
    return apiRequest(`/focal-area/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

// User API endpoints
export const userApi = {
  getAll: () => {
    return apiRequest('/auth/get-all-user').then(response => {
      // Handle the specific response format for user API
      if (response.status && response.message) {
        // If message is a single user object, wrap it in an array
        if (response.message && !Array.isArray(response.message)) {
          return {
            status: true,
            data: [response.message]
          };
        }
        // If message is already an array, use it as data
        if (Array.isArray(response.message)) {
          return {
            status: true,
            data: response.message
          };
        }
      }
      return response;
    });
  },
  getById: (id) => {
    if (!id) throw new Error('User ID is required');
    return apiRequest(`/auth/user/${id}`);
  },
  add: (userData) => {
    // Alias for register to maintain consistency with other APIs
    return userApi.register(userData);
  },
  login: (credentials) => {
    if (!credentials || !credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  register: (userData) => {
    if (!userData) {
      throw new Error('User data is required');
    }
    
    // Validate required fields for registration
    const requiredFields = ['username', 'email', 'password', 'role', 'department'];
    const missingFields = requiredFields.filter(field => !userData[field]?.trim());
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    if (userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Please enter a valid email address');
    }
    
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  update: (id, userData) => {
    if (!id) throw new Error('User ID is required');
    if (!userData) throw new Error('User data is required');
    return apiRequest(`/auth/user/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  delete: (id) => {
    if (!id) throw new Error('User ID is required');
    return apiRequest(`/auth/user/${id}`, {
      method: 'DELETE',
    });
  },
};

export default apiRequest;