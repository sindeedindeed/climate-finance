const fs = require('fs');
const path = require('path');

// Load mock data
const mockProjectsPath = path.join(__dirname, '../data/mock-projects.json');
let mockProjects = [];

try {
    const data = fs.readFileSync(mockProjectsPath, 'utf8');
    mockProjects = JSON.parse(data);
} catch (error) {
    console.error('Error loading mock data:', error);
    mockProjects = [];
}

// Mock agencies, funding sources, and focal areas based on project data
const mockAgencies = [
    { agency_id: 1, name: "Ministry of Water Resources", type: "Government Agency" },
    { agency_id: 2, name: "UNDP Bangladesh", type: "International Organization" },
    { agency_id: 3, name: "Ministry of Power, Energy and Mineral Resources", type: "Government Agency" },
    { agency_id: 4, name: "Grameen Shakti", type: "NGO" },
    { agency_id: 5, name: "Dhaka North City Corporation", type: "Local Government" },
    { agency_id: 6, name: "UN-Habitat", type: "International Organization" },
    { agency_id: 7, name: "Ministry of Agriculture", type: "Government Agency" },
    { agency_id: 8, name: "FAO Bangladesh", type: "International Organization" },
    { agency_id: 9, name: "Forest Department", type: "Government Agency" },
    { agency_id: 10, name: "IUCN Bangladesh", type: "International Organization" },
    { agency_id: 11, name: "Ministry of Disaster Management and Relief", type: "Government Agency" },
    { agency_id: 12, name: "Bangladesh Red Crescent Society", type: "NGO" }
];

const mockFundingSources = [
    { funding_source_id: 1, name: "Green Climate Fund", dev_partner: "GCF", grant_amount: 15000000, loan_amount: 0, disbursement: 8500000 },
    { funding_source_id: 2, name: "World Bank", dev_partner: "WB", grant_amount: 0, loan_amount: 10000000, disbursement: 5000000 },
    { funding_source_id: 3, name: "Asian Development Bank", dev_partner: "ADB", grant_amount: 0, loan_amount: 12000000, disbursement: 12000000 },
    { funding_source_id: 4, name: "KfW Development Bank", dev_partner: "KfW", grant_amount: 6000000, loan_amount: 0, disbursement: 6000000 },
    { funding_source_id: 5, name: "European Union", dev_partner: "EU", grant_amount: 20000000, loan_amount: 0, disbursement: 8000000 },
    { funding_source_id: 6, name: "Agence Française de Développement", dev_partner: "AFD", grant_amount: 0, loan_amount: 12000000, disbursement: 4000000 },
    { funding_source_id: 7, name: "International Fund for Agricultural Development", dev_partner: "IFAD", grant_amount: 18000000, loan_amount: 0, disbursement: 3000000 },
    { funding_source_id: 8, name: "Japan International Cooperation Agency", dev_partner: "JICA", grant_amount: 0, loan_amount: 10000000, disbursement: 4000000 },
    { funding_source_id: 9, name: "Global Environment Facility", dev_partner: "GEF", grant_amount: 14000000, loan_amount: 0, disbursement: 7000000 },
    { funding_source_id: 10, name: "Norway International Climate and Forest Initiative", dev_partner: "NICFI", grant_amount: 8000000, loan_amount: 0, disbursement: 4000000 },
    { funding_source_id: 11, name: "United Nations Office for Disaster Risk Reduction", dev_partner: "UNDRR", grant_amount: 10000000, loan_amount: 0, disbursement: 10000000 },
    { funding_source_id: 12, name: "Swiss Agency for Development and Cooperation", dev_partner: "SDC", grant_amount: 5000000, loan_amount: 0, disbursement: 5000000 }
];

const mockFocalAreas = [
    { focal_area_id: 1, name: "Climate Change Adaptation" },
    { focal_area_id: 2, name: "Water Resources Management" },
    { focal_area_id: 3, name: "Renewable Energy" },
    { focal_area_id: 4, name: "Energy Efficiency" },
    { focal_area_id: 5, name: "Urban Climate Adaptation" },
    { focal_area_id: 6, name: "Green Infrastructure" },
    { focal_area_id: 7, name: "Climate-Smart Agriculture" },
    { focal_area_id: 8, name: "Food Security" },
    { focal_area_id: 9, name: "Forest Conservation" },
    { focal_area_id: 10, name: "Biodiversity Protection" },
    { focal_area_id: 11, name: "Disaster Risk Reduction" },
    { focal_area_id: 12, name: "Early Warning Systems" }
];

const mockDataService = {
    // Project operations
    getAllProjects: () => {
        return {
            status: true,
            data: mockProjects
        };
    },

    getProjectById: (id) => {
        const project = mockProjects.find(p => p.project_id === id);
        if (!project) {
            return {
                status: false,
                message: 'Project not found'
            };
        }
        return {
            status: true,
            data: project
        };
    },

    addProject: (projectData) => {
        // For demo purposes, just return success without persisting
        return {
            status: true,
            message: 'Project added successfully (Demo Mode - Not Persisted)',
            data: { project_id: 'demo-new-' + Date.now() }
        };
    },

    updateProject: (id, projectData) => {
        // For demo purposes, just return success without persisting
        return {
            status: true,
            message: 'Project updated successfully (Demo Mode - Not Persisted)',
            data: { project_id: id }
        };
    },

    deleteProject: (id) => {
        // For demo purposes, just return success without persisting
        return {
            status: true,
            message: 'Project deleted successfully (Demo Mode - Not Persisted)'
        };
    },

    // Dashboard and analytics
    getProjectsOverviewStats: () => {
        const totalProjects = mockProjects.length;
        const activeProjects = mockProjects.filter(p => p.status === 'Active').length;
        const completedProjects = mockProjects.filter(p => p.status === 'Completed').length;
        const totalCost = mockProjects.reduce((sum, p) => sum + (p.total_cost_usd || 0), 0);
        const totalGefGrant = mockProjects.reduce((sum, p) => sum + (p.gef_grant || 0), 0);
        const totalCofinancing = mockProjects.reduce((sum, p) => sum + (p.cofinancing || 0), 0);
        const totalDisbursement = mockProjects.reduce((sum, p) => sum + (p.disbursement || 0), 0);

        return {
            status: true,
            data: {
                totalProjects,
                activeProjects,
                completedProjects,
                totalCost,
                totalGefGrant,
                totalCofinancing,
                totalDisbursement,
                averageProjectCost: totalCost / totalProjects
            }
        };
    },

    getProjectByStatus: () => {
        const statusCounts = mockProjects.reduce((acc, project) => {
            acc[project.status] = (acc[project.status] || 0) + 1;
            return acc;
        }, {});

        return {
            status: true,
            data: Object.entries(statusCounts).map(([status, count]) => ({
                status,
                count
            }))
        };
    },

    getProjectBySector: () => {
        const sectorCounts = mockProjects.reduce((acc, project) => {
            acc[project.sector] = (acc[project.sector] || 0) + 1;
            return acc;
        }, {});

        return {
            status: true,
            data: Object.entries(sectorCounts).map(([sector, count]) => ({
                sector,
                count
            }))
        };
    },

    getProjectByType: () => {
        const typeCounts = mockProjects.reduce((acc, project) => {
            acc[project.type] = (acc[project.type] || 0) + 1;
            return acc;
        }, {});

        return {
            status: true,
            data: Object.entries(typeCounts).map(([type, count]) => ({
                type,
                count
            }))
        };
    },

    getRegionalDistribution: () => {
        const divisionCounts = mockProjects.reduce((acc, project) => {
            acc[project.geographic_division] = (acc[project.geographic_division] || 0) + 1;
            return acc;
        }, {});

        return {
            status: true,
            data: Object.entries(divisionCounts).map(([division, count]) => ({
                division,
                count
            }))
        };
    },

    // Agency operations
    getAllAgencies: () => {
        return {
            status: true,
            data: mockAgencies
        };
    },

    getAgencyById: (id) => {
        const agency = mockAgencies.find(a => a.agency_id === parseInt(id));
        if (!agency) {
            return {
                status: false,
                message: 'Agency not found'
            };
        }
        return {
            status: true,
            data: agency
        };
    },

    addAgency: (agencyData) => {
        return {
            status: true,
            message: 'Agency added successfully (Demo Mode - Not Persisted)',
            data: { agency_id: Date.now() }
        };
    },

    updateAgency: (id, agencyData) => {
        return {
            status: true,
            message: 'Agency updated successfully (Demo Mode - Not Persisted)',
            data: { agency_id: parseInt(id) }
        };
    },

    deleteAgency: (id) => {
        return {
            status: true,
            message: 'Agency deleted successfully (Demo Mode - Not Persisted)'
        };
    },

    // Funding Source operations
    getAllFundingSources: () => {
        return {
            status: true,
            data: mockFundingSources
        };
    },

    getFundingSourceById: (id) => {
        const fundingSource = mockFundingSources.find(fs => fs.funding_source_id === parseInt(id));
        if (!fundingSource) {
            return {
                status: false,
                message: 'Funding source not found'
            };
        }
        return {
            status: true,
            data: fundingSource
        };
    },

    addFundingSource: (fundingSourceData) => {
        return {
            status: true,
            message: 'Funding source added successfully (Demo Mode - Not Persisted)',
            data: { funding_source_id: Date.now() }
        };
    },

    updateFundingSource: (id, fundingSourceData) => {
        return {
            status: true,
            message: 'Funding source updated successfully (Demo Mode - Not Persisted)',
            data: { funding_source_id: parseInt(id) }
        };
    },

    deleteFundingSource: (id) => {
        return {
            status: true,
            message: 'Funding source deleted successfully (Demo Mode - Not Persisted)'
        };
    },

    // Focal Area operations
    getAllFocalAreas: () => {
        return {
            status: true,
            data: mockFocalAreas
        };
    },

    getFocalAreaById: (id) => {
        const focalArea = mockFocalAreas.find(fa => fa.focal_area_id === parseInt(id));
        if (!focalArea) {
            return {
                status: false,
                message: 'Focal area not found'
            };
        }
        return {
            status: true,
            data: focalArea
        };
    },

    addFocalArea: (focalAreaData) => {
        return {
            status: true,
            message: 'Focal area added successfully (Demo Mode - Not Persisted)',
            data: { focal_area_id: Date.now() }
        };
    },

    updateFocalArea: (id, focalAreaData) => {
        return {
            status: true,
            message: 'Focal area updated successfully (Demo Mode - Not Persisted)',
            data: { focal_area_id: parseInt(id) }
        };
    },

    deleteFocalArea: (id) => {
        return {
            status: true,
            message: 'Focal area deleted successfully (Demo Mode - Not Persisted)'
        };
    },

    // Pending Project operations
    getAllPendingProjects: () => {
        return {
            status: true,
            data: []
        };
    },

    getPendingProjectById: (id) => {
        return {
            status: false,
            message: 'Pending project not found'
        };
    },

    submitPendingProject: (projectData) => {
        return {
            status: true,
            message: 'Project submitted successfully (Demo Mode - Not Persisted)',
            data: { pending_id: Date.now() }
        };
    },

    approvePendingProject: (id) => {
        return {
            status: true,
            message: 'Project approved successfully (Demo Mode - Not Persisted)'
        };
    },

    rejectPendingProject: (id) => {
        return {
            status: true,
            message: 'Project rejected successfully (Demo Mode - Not Persisted)'
        };
    },

    // Auth operations (simplified for demo)
    getAllUsers: () => {
        return {
            status: true,
            data: [
                { id: 1, username: 'admin', email: 'admin@demo.com', role: 'Super Admin', department: 'Administration', active: true },
                { id: 2, username: 'manager', email: 'manager@demo.com', role: 'Project Manager', department: 'Projects', active: true }
            ]
        };
    },

    login: (credentials) => {
        return {
            status: true,
            message: 'Login successful (Demo Mode)',
            data: {
                token: 'demo-token-' + Date.now(),
                user: { id: 1, username: 'admin', role: 'Super Admin' }
            }
        };
    },

    register: (userData) => {
        return {
            status: true,
            message: 'User registered successfully (Demo Mode - Not Persisted)',
            data: { id: Date.now() }
        };
    }
};

module.exports = mockDataService;
