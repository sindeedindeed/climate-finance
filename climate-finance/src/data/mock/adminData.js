/**
 * Mock data for admin portal based on ER diagram and database schema
 */

// Mock admin users data
export const adminUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@climateFinance.gov.bd",
    password: "admin123", // In real app, this would be hashed
    fullName: "System Administrator",
    role: "Super Admin",
    department: "IT Department",
    lastLogin: "2024-12-15T10:30:00Z",
    createdAt: "2023-01-15T00:00:00Z",
    isActive: true
  },
  {
    id: 2,
    username: "project.manager",
    email: "pm@climateFinance.gov.bd",
    password: "pm123",
    fullName: "Project Manager One",
    role: "Project Manager",
    department: "Project Management Office",
    lastLogin: "2024-12-14T15:45:00Z",
    createdAt: "2023-03-20T00:00:00Z",
    isActive: true
  },
  {
    id: 3,
    username: "finance.admin",
    email: "finance@climateFinance.gov.bd",
    password: "finance123",
    fullName: "Finance Administrator",
    role: "Finance Admin",
    department: "Finance Department",
    lastLogin: "2024-12-13T09:15:00Z",
    createdAt: "2023-06-10T00:00:00Z",
    isActive: true
  }
];

// Mock agencies data based on ER diagram
export const agencies = [
  {
    agency_id: 1,
    name: "Department of Environment",
    type: "Implementing",
    category: "National"
  },
  {
    agency_id: 2,
    name: "Bangladesh Water Development Board",
    type: "Executing",
    category: "National"
  },
  {
    agency_id: 3,
    name: "Sustainable and Renewable Energy Development Authority",
    type: "Accredited",
    category: "National"
  },
  {
    agency_id: 4,
    name: "Department of Agricultural Extension",
    type: "Implementing",
    category: "Local Govt. Division"
  },
  {
    agency_id: 5,
    name: "Forest Department, Ministry of Environment",
    type: "Executing",
    category: "National"
  },
  {
    agency_id: 6,
    name: "World Bank Bangladesh Office",
    type: "Accredited",
    category: "International"
  },
  {
    agency_id: 7,
    name: "UNDP Bangladesh",
    type: "Implementing",
    category: "International"
  }
];

// Mock funding sources data based on ER diagram
export const fundingSources = [
  {
    funding_source_id: 1,
    name: "Green Climate Fund",
    dev_partner: "GCF",
    grant_amount: 125000000.00,
    loan_amount: 0.00,
    counterpart_funding: 25000000.00,
    disbursement: 75000000.00,
    non_grant_instrument: null
  },
  {
    funding_source_id: 2,
    name: "World Bank",
    dev_partner: "World Bank Group",
    grant_amount: 50000000.00,
    loan_amount: 75000000.00,
    counterpart_funding: 15000000.00,
    disbursement: 95000000.00,
    non_grant_instrument: "Concessional Loan"
  },
  {
    funding_source_id: 3,
    name: "JICA",
    dev_partner: "Japan International Cooperation Agency",
    grant_amount: 30000000.00,
    loan_amount: 45000000.00,
    counterpart_funding: 10000000.00,
    disbursement: 55000000.00,
    non_grant_instrument: "Technical Assistance"
  },
  {
    funding_source_id: 4,
    name: "USAID",
    dev_partner: "United States Agency for International Development",
    grant_amount: 40000000.00,
    loan_amount: 0.00,
    counterpart_funding: 8000000.00,
    disbursement: 32000000.00,
    non_grant_instrument: null
  },
  {
    funding_source_id: 5,
    name: "European Union",
    dev_partner: "European Commission",
    grant_amount: 35000000.00,
    loan_amount: 0.00,
    counterpart_funding: 5000000.00,
    disbursement: 22000000.00,
    non_grant_instrument: "Grant Agreement"
  }
];

// Mock locations data based on ER diagram
export const locations = [
  {
    location_id: 1,
    name: "Dhaka",
    region: "Central"
  },
  {
    location_id: 2,
    name: "Chittagong",
    region: "Southeast"
  },
  {
    location_id: 3,
    name: "Cox's Bazar",
    region: "Southeast"
  },
  {
    location_id: 4,
    name: "Sylhet",
    region: "Northeast"
  },
  {
    location_id: 5,
    name: "Rangpur",
    region: "Northwest"
  },
  {
    location_id: 6,
    name: "Rajshahi",
    region: "Northwest"
  },
  {
    location_id: 7,
    name: "Khulna",
    region: "Southwest"
  },
  {
    location_id: 8,
    name: "Barisal",
    region: "South"
  },
  {
    location_id: 9,
    name: "Patuakhali",
    region: "South"
  }
];

// Mock focal areas data based on ER diagram
export const focalAreas = [
  {
    focal_area_id: 1,
    name: "Climate Change Adaptation"
  },
  {
    focal_area_id: 2,
    name: "Climate Change Mitigation"
  },
  {
    focal_area_id: 3,
    name: "Renewable Energy"
  },
  {
    focal_area_id: 4,
    name: "Energy Efficiency"
  },
  {
    focal_area_id: 5,
    name: "Sustainable Agriculture"
  },
  {
    focal_area_id: 6,
    name: "Forest Management"
  },
  {
    focal_area_id: 7,
    name: "Water Management"
  },
  {
    focal_area_id: 8,
    name: "Disaster Risk Reduction"
  }
];

// Mock projects data matching the ER diagram
export const adminProjects = [
  {
    project_id: "BD-ENV-001",
    title: "Climate Resilient Coastal Protection Project",
    type: "Adaptation",
    status: "Active",
    approval_fy: 2022,
    beginning: "2022-01-15",
    closing: "2026-12-31",
    total_cost_usd: 145000000.00,
    gef_grant: 25000000.00,
    cofinancing: 120000000.00,
    wash_finance: 35000000.00,
    wash_finance_percent: 24.14,
    beneficiaries: "2,500,000 coastal residents",
    objectives: "Enhance climate resilience of coastal communities through improved infrastructure and ecosystem-based adaptation measures.",
    agencies: [1, 2], // Department of Environment, Bangladesh Water Development Board
    funding_sources: [1, 2], // GCF, World Bank
    locations: [2, 3], // Chittagong, Cox's Bazar
    focal_areas: [1, 7], // Climate Change Adaptation, Water Management
    wash_component: {
      presence: true,
      water_supply_percent: 60.00,
      sanitation_percent: 30.00,
      public_admin_percent: 10.00
    }
  },
  {
    project_id: "BD-REN-002",
    title: "Solar Park Development Initiative",
    type: "Mitigation",
    status: "Planning",
    approval_fy: 2023,
    beginning: "2023-07-01",
    closing: "2027-06-30",
    total_cost_usd: 180000000.00,
    gef_grant: 30000000.00,
    cofinancing: 150000000.00,
    wash_finance: 0.00,
    wash_finance_percent: 0.00,
    beneficiaries: "1,800,000 people with improved energy access",
    objectives: "Develop large-scale solar energy infrastructure to reduce greenhouse gas emissions and improve energy security.",
    agencies: [3], // SREDA
    funding_sources: [2, 3], // World Bank, JICA
    locations: [1, 6], // Dhaka, Rajshahi
    focal_areas: [2, 3], // Climate Change Mitigation, Renewable Energy
    wash_component: {
      presence: false,
      water_supply_percent: 0.00,
      sanitation_percent: 0.00,
      public_admin_percent: 0.00
    }
  },
  {
    project_id: "BD-AGR-003",
    title: "Climate Smart Agriculture Enhancement",
    type: "Adaptation",
    status: "Active",
    approval_fy: 2021,
    beginning: "2021-03-01",
    closing: "2025-02-28",
    total_cost_usd: 95000000.00,
    gef_grant: 15000000.00,
    cofinancing: 80000000.00,
    wash_finance: 12000000.00,
    wash_finance_percent: 12.63,
    beneficiaries: "500,000 smallholder farmers",
    objectives: "Improve agricultural productivity and climate resilience through sustainable farming practices and water management.",
    agencies: [4], // Department of Agricultural Extension
    funding_sources: [3, 4], // JICA, USAID
    locations: [4, 5, 8], // Sylhet, Rangpur, Barisal
    focal_areas: [1, 5, 7], // Climate Change Adaptation, Sustainable Agriculture, Water Management
    wash_component: {
      presence: true,
      water_supply_percent: 70.00,
      sanitation_percent: 20.00,
      public_admin_percent: 10.00
    }
  }
];

// Admin dashboard stats
export const adminDashboardStats = [
  {
    title: "Total Projects",
    value: adminProjects.length,
    change: "+2 this month",
    color: "bg-blue-500"
  },
  {
    title: "Active Agencies",
    value: agencies.length,
    change: "+1 this month",
    color: "bg-green-500"
  },
  {
    title: "Total Budget Managed",
    value: adminProjects.reduce((sum, project) => sum + project.total_cost_usd, 0),
    change: "+15% this quarter",
    color: "bg-yellow-500"
  },
  {
    title: "Funding Sources",
    value: fundingSources.length,
    change: "No change",
    color: "bg-purple-500"
  }
];