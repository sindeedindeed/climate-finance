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
      status: true,
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
      status: true,
      data: project
    };
  },

  getByStatus: async () => {
    await delay(200);
    const statusCounts = mockProjects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array format expected by charts
    const statusArray = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value
    }));
    
    return {
      status: true,
      data: statusArray
    };
  },

  getBySector: async () => {
    await delay(200);
    // Convert sector distribution to array format expected by charts
    const sectorArray = mockSectorDistribution.map(item => ({
      name: item.sector,
      value: item.count
    }));
    
    return {
      status: true,
      data: sectorArray
    };
  },

  getTrend: async () => {
    await delay(200);
    return {
      status: true,
      data: mockTrends
    };
  },

  getByType: async () => {
    await delay(200);
    const typeCounts = mockProjects.reduce((acc, project) => {
      acc[project.focalArea] = (acc[project.focalArea] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array format expected by charts
    const typeArray = Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value
    }));
    
    return {
      status: true,
      data: typeArray
    };
  },

  getOverviewStats: async () => {
    await delay(200);
    return {
      status: true,
      data: {
        current_year: {
          total_projects: mockStats.totalProjects,
          total_budget: mockStats.totalBudget,
          active_projects: mockStats.activeProjects,
          completed_projects: mockStats.completedProjects,
          total_climate_finance: 22550000,
          adaptation_finance: 12000000,
          mitigation_finance: 10550000
        },
        previous_year: {
          total_projects: 8,
          total_budget: 15000000,
          active_projects: 5,
          completed_projects: 2,
          total_climate_finance: 15000000,
          adaptation_finance: 8000000,
          mitigation_finance: 7000000
        },
        total_projects: mockStats.totalProjects,
        active_projects: mockStats.activeProjects,
        completed_projects: mockStats.completedProjects,
        total_climate_finance: 22550000,
        adaptation_finance: 12000000,
        mitigation_finance: 10550000,
        total_beneficiaries: mockStats.totalBeneficiaries
      }
    };
  },

  getProjectsOverviewStats: async () => {
    await delay(200);
    return {
      status: true,
      data: {
        current_year: {
          total_projects: mockStats.totalProjects,
          active_projects: mockStats.activeProjects,
          completed_projects: mockStats.completedProjects,
          total_investment: mockStats.totalBudget
        },
        total_projects: mockStats.totalProjects,
        active_projects: mockStats.activeProjects,
        completed_projects: mockStats.completedProjects,
        total_investment: mockStats.totalBudget
      }
    };
  },

  getDashboardOverviewStats: async () => {
    await delay(200);
    return {
      status: true,
      data: mockStats
    };
  },

  getRegionalDistribution: async () => {
    await delay(200);
    const regionalData = mockProjects.reduce((acc, project) => {
      const region = project.location;
      if (!acc[region]) {
        acc[region] = { 
          location_name: region,
          count: 0, 
          budget: 0,
          adaptation_total: 0,
          mitigation_total: 0
        };
      }
      acc[region].count += 1;
      acc[region].budget += project.budget;
      
      // Add adaptation/mitigation based on focal area
      if (project.focalArea === 'Climate Adaptation') {
        acc[region].adaptation_total += project.budget;
      } else if (project.focalArea === 'Climate Mitigation') {
        acc[region].mitigation_total += project.budget;
      }
      
      return acc;
    }, {});
    
    // Convert to array format expected by the component
    const regionalArray = Object.values(regionalData);
    
    return {
      status: true,
      data: regionalArray
    };
  }
};

export const mockAgencyApi = {
  getAll: async () => {
    await delay(200);
    return {
      status: true,
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
      status: true,
      data: agency
    };
  }
};

export const mockFundingSourceApi = {
  getAll: async () => {
    await delay(200);
    return {
      status: true,
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
      status: true,
      data: source
    };
  },

  getFundingSourceByType: async () => {
    await delay(200);
    const typeCounts = mockProjects.reduce((acc, project) => {
      acc[project.fundingSource] = (acc[project.fundingSource] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array format expected by charts
    const typeArray = Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value
    }));
    
    return {
      status: true,
      data: typeArray
    };
  },

  getFundingSourceOverview: async () => {
    await delay(200);
    const totalFinance = mockProjects.reduce((sum, p) => sum + p.budget, 0);
    const activeSources = new Set(mockProjects.map(p => p.fundingSource)).size;
    
    return {
      status: true,
      data: {
        current_year: {
          total_finance: totalFinance,
          active_funding_source: activeSources,
          committed_funds: totalFinance,
          disbursed_funds: totalFinance * 0.75 // Assume 75% disbursed
        },
        total_climate_finance: totalFinance,
        active_funding_source: activeSources,
        committed_funds: totalFinance,
        disbursed_funds: totalFinance * 0.75
      }
    };
  },

  getFundingSourceTrend: async () => {
    await delay(200);
    return {
      status: true,
      data: mockTrends
    };
  },

  getFundingSourceSectorAllocation: async () => {
    await delay(200);
    // Convert to format expected by Funding Sources page
    const sectorAllocation = mockSectorDistribution.map(item => ({
      sector: item.sector,
      gef_grant: item.budget
    }));
    
    return {
      status: true,
      data: sectorAllocation
    };
  },

  getFundingSource: async () => {
    await delay(200);
    return {
      status: true,
      data: mockFundingSources
    };
  }
};

export const mockLocationApi = {
  getAll: async () => {
    await delay(200);
    return {
      status: true,
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
      status: true,
      data: location
    };
  }
};

export const mockFocalAreaApi = {
  getAll: async () => {
    await delay(200);
    return {
      status: true,
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
      status: true,
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
        status: true,
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
      status: true,
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
      status: true,
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
      status: true,
      data: user
    };
  }
};

export const mockPendingProjectApi = {
  getAll: async () => {
    await delay(200);
    return {
      status: true,
      data: []
    };
  },

  submit: async (projectData) => {
    await delay(500);
    return {
      status: true,
      data: {
        id: Date.now(),
        ...projectData,
        status: 'pending'
      }
    };
  }
};
