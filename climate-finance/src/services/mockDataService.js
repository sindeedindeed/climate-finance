// Mock data service to replace API calls for standalone deployment
import { 
  mockProjects, 
  mockAgencies, 
  mockFundingSources, 
  mockLocations, 
  mockFocalAreas, 
  mockStats, 
  mockTrends, 
  mockSectorDistribution 
} from '../data/mockProjects.js';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const mockProjectApi = {
  getAll: async (query = '') => {
    await delay(300);
    let filteredProjects = [...mockProjects];
    
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredProjects = mockProjects.filter(project => 
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.sector.toLowerCase().includes(searchTerm) ||
        project.location.toLowerCase().includes(searchTerm)
      );
    }
    
    return {
      success: true,
      data: filteredProjects,
      total: filteredProjects.length
    };
  },

  getById: async (id) => {
    await delay(200);
    const project = mockProjects.find(p => p.id === parseInt(id));
    if (!project) {
      throw new Error('Project not found');
    }
    return {
      success: true,
      data: project
    };
  },

  getByStatus: async () => {
    await delay(200);
    const statusCounts = mockProjects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});
    return {
      success: true,
      data: statusCounts
    };
  },

  getBySector: async () => {
    await delay(200);
    return {
      success: true,
      data: mockSectorDistribution
    };
  },

  getTrend: async () => {
    await delay(200);
    return {
      success: true,
      data: mockTrends
    };
  },

  getByType: async () => {
    await delay(200);
    const typeCounts = mockProjects.reduce((acc, project) => {
      acc[project.focalArea] = (acc[project.focalArea] || 0) + 1;
      return acc;
    }, {});
    return {
      success: true,
      data: typeCounts
    };
  },

  getOverviewStats: async () => {
    await delay(200);
    return {
      success: true,
      data: mockStats
    };
  },

  getProjectsOverviewStats: async () => {
    await delay(200);
    return {
      success: true,
      data: mockStats
    };
  },

  getDashboardOverviewStats: async () => {
    await delay(200);
    return {
      success: true,
      data: mockStats
    };
  },

  getRegionalDistribution: async () => {
    await delay(200);
    const regionalData = mockProjects.reduce((acc, project) => {
      const region = project.location;
      if (!acc[region]) {
        acc[region] = { count: 0, budget: 0 };
      }
      acc[region].count += 1;
      acc[region].budget += project.budget;
      return acc;
    }, {});
    return {
      success: true,
      data: regionalData
    };
  }
};

export const mockAgencyApi = {
  getAll: async () => {
    await delay(200);
    return {
      success: true,
      data: mockAgencies
    };
  },

  getById: async (id) => {
    await delay(200);
    const agency = mockAgencies.find(a => a.id === parseInt(id));
    if (!agency) {
      throw new Error('Agency not found');
    }
    return {
      success: true,
      data: agency
    };
  }
};

export const mockFundingSourceApi = {
  getAll: async () => {
    await delay(200);
    return {
      success: true,
      data: mockFundingSources
    };
  },

  getById: async (id) => {
    await delay(200);
    const source = mockFundingSources.find(s => s.id === parseInt(id));
    if (!source) {
      throw new Error('Funding source not found');
    }
    return {
      success: true,
      data: source
    };
  },

  getFundingSourceByType: async () => {
    await delay(200);
    const typeCounts = mockProjects.reduce((acc, project) => {
      acc[project.fundingSource] = (acc[project.fundingSource] || 0) + 1;
      return acc;
    }, {});
    return {
      success: true,
      data: typeCounts
    };
  },

  getFundingSourceOverview: async () => {
    await delay(200);
    const overview = mockFundingSources.map(source => ({
      ...source,
      projectCount: mockProjects.filter(p => p.fundingSource === source.name).length,
      totalBudget: mockProjects
        .filter(p => p.fundingSource === source.name)
        .reduce((sum, p) => sum + p.budget, 0)
    }));
    return {
      success: true,
      data: overview
    };
  },

  getFundingSourceTrend: async () => {
    await delay(200);
    return {
      success: true,
      data: mockTrends
    };
  },

  getFundingSourceSectorAllocation: async () => {
    await delay(200);
    return {
      success: true,
      data: mockSectorDistribution
    };
  },

  getFundingSource: async () => {
    await delay(200);
    return {
      success: true,
      data: mockFundingSources
    };
  }
};

export const mockLocationApi = {
  getAll: async () => {
    await delay(200);
    return {
      success: true,
      data: mockLocations
    };
  },

  getById: async (id) => {
    await delay(200);
    const location = mockLocations.find(l => l.id === parseInt(id));
    if (!location) {
      throw new Error('Location not found');
    }
    return {
      success: true,
      data: location
    };
  }
};

export const mockFocalAreaApi = {
  getAll: async () => {
    await delay(200);
    return {
      success: true,
      data: mockFocalAreas
    };
  },

  getById: async (id) => {
    await delay(200);
    const area = mockFocalAreas.find(f => f.id === parseInt(id));
    if (!area) {
      throw new Error('Focal area not found');
    }
    return {
      success: true,
      data: area
    };
  }
};

export const mockAuthApi = {
  login: async (credentials) => {
    await delay(500);
    // Mock authentication - accept any credentials for demo
    if (credentials.email && credentials.password) {
      return {
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: {
            id: 1,
            email: credentials.email,
            role: 'admin',
            name: 'Demo User'
          }
        }
      };
    }
    throw new Error('Invalid credentials');
  },

  register: async (userData) => {
    await delay(500);
    return {
      success: true,
      data: {
        id: Date.now(),
        ...userData,
        role: 'user'
      }
    };
  },

  getAllUsers: async () => {
    await delay(200);
    return {
      success: true,
      data: [
        { id: 1, email: 'admin@example.com', role: 'admin', name: 'Admin User' },
        { id: 2, email: 'user@example.com', role: 'user', name: 'Regular User' }
      ]
    };
  },

  getUserById: async (id) => {
    await delay(200);
    const users = [
      { id: 1, email: 'admin@example.com', role: 'admin', name: 'Admin User' },
      { id: 2, email: 'user@example.com', role: 'user', name: 'Regular User' }
    ];
    const user = users.find(u => u.id === parseInt(id));
    if (!user) {
      throw new Error('User not found');
    }
    return {
      success: true,
      data: user
    };
  }
};

export const mockPendingProjectApi = {
  getAll: async () => {
    await delay(200);
    return {
      success: true,
      data: []
    };
  },

  submit: async (projectData) => {
    await delay(500);
    return {
      success: true,
      data: {
        id: Date.now(),
        ...projectData,
        status: 'pending'
      }
    };
  }
};
