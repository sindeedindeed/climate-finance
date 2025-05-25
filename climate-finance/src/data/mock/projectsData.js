/**
 * Mock data for climate finance projects
 */

export const projectsOverviewStats = [
  {
    title: "Total Projects",
    value: 147,
    change: "+12% from last year"
  },
  {
    title: "Active Projects", 
    value: 89,
    change: "+8% from last month"
  },
  {
    title: "Total Investment",
    value: 2850000000,
    change: "+15% from last year"
  },
  {
    title: "Completed Projects",
    value: 58,
    change: "+23% from last year"
  }
];

export const projectsByStatus = [
  { name: "Active", value: 89, color: "#10B981" },
  { name: "Completed", value: 58, color: "#3B82F6" },
  { name: "Planning", value: 25, color: "#F59E0B" },
  { name: "On Hold", value: 8, color: "#EF4444" }
];

export const projectsBySector = [
  { name: "Renewable Energy", value: 45, color: "#10B981" },
  { name: "Agriculture", value: 32, color: "#3B82F6" },
  { name: "Water Resources", value: 28, color: "#8B5CF6" },
  { name: "Forest Conservation", value: 22, color: "#F59E0B" },
  { name: "Disaster Risk", value: 20, color: "#EF4444" }
];

export const projectsTrend = [
  { year: "2019", projects: 28 },
  { year: "2020", projects: 35 },
  { year: "2021", projects: 42 },
  { year: "2022", projects: 58 },
  { year: "2023", projects: 73 },
  { year: "2024", projects: 89 }
];

export const projectsList = [
  {
    id: "PRJ-001",
    title: "Solar Power Grid Modernization",
    description: "Upgrading national grid infrastructure to accommodate renewable energy sources and improve energy efficiency across rural communities.",
    sector: "Renewable Energy",
    status: "Active",
    priority: "High",
    duration: "36 months",
    startDate: "2023-01-15",
    endDate: "2026-01-15",
    location: "Dhaka, Chittagong, Sylhet",
    totalBudget: 125000000,
    disbursed: 45000000,
    fundingSources: ["Green Climate Fund", "World Bank"],
    implementingAgency: "Sustainable and Renewable Energy Development Authority",
    beneficiaries: 2500000,
    progress: 36,
    milestones: [
      { name: "Project Initiation", status: "Completed", date: "2023-01-15" },
      { name: "Infrastructure Assessment", status: "Completed", date: "2023-03-20" },
      { name: "Grid Modernization Phase 1", status: "In Progress", date: "2024-06-30" },
      { name: "Solar Installation Phase 1", status: "Planned", date: "2024-12-15" },
      { name: "Grid Integration Testing", status: "Planned", date: "2025-06-30" },
      { name: "Project Completion", status: "Planned", date: "2026-01-15" }
    ],
    keyMetrics: {
      co2Reduction: 450000,
      energyGenerated: 180,
      jobsCreated: 850,
      communitiesServed: 145
    },
    riskLevel: "Medium",
    lastUpdated: "2024-12-15"
  },
  {
    id: "PRJ-002", 
    title: "Coastal Mangrove Restoration Initiative",
    description: "Large-scale mangrove restoration project to protect coastal communities from climate change impacts and preserve biodiversity.",
    sector: "Forest Conservation",
    status: "Active",
    priority: "High",
    duration: "48 months",
    startDate: "2022-06-01",
    endDate: "2026-06-01",
    location: "Cox's Bazar, Barisal, Patuakhali",
    totalBudget: 75000000,
    disbursed: 48000000,
    fundingSources: ["Green Climate Fund", "JICA"],
    implementingAgency: "Forest Department, Ministry of Environment",
    beneficiaries: 850000,
    progress: 64,
    milestones: [
      { name: "Community Engagement", status: "Completed", date: "2022-06-01" },
      { name: "Site Preparation", status: "Completed", date: "2022-09-15" },
      { name: "Seedling Production", status: "Completed", date: "2023-01-30" },
      { name: "Plantation Phase 1", status: "Completed", date: "2023-12-15" },
      { name: "Plantation Phase 2", status: "In Progress", date: "2024-12-15" },
      { name: "Monitoring & Evaluation", status: "Planned", date: "2026-06-01" }
    ],
    keyMetrics: {
      areaRestored: 12500,
      treesPlanted: 2800000,
      carbonSequestered: 350000,
      coastlineProtected: 185
    },
    riskLevel: "Low",
    lastUpdated: "2024-12-10"
  },
  {
    id: "PRJ-003",
    title: "Climate-Smart Agriculture Program",
    description: "Implementing climate-resilient agricultural practices and technologies to improve food security and farmer livelihoods.",
    sector: "Agriculture",
    status: "Active",
    priority: "Medium",
    duration: "42 months",
    startDate: "2023-03-01",
    endDate: "2026-09-01",
    location: "Rangpur, Rajshahi, Bogura",
    totalBudget: 95000000,
    disbursed: 28000000,
    fundingSources: ["World Bank", "USAID"],
    implementingAgency: "Department of Agricultural Extension",
    beneficiaries: 450000,
    progress: 29,
    milestones: [
      { name: "Baseline Assessment", status: "Completed", date: "2023-03-01" },
      { name: "Farmer Training Program", status: "In Progress", date: "2024-12-31" },
      { name: "Technology Distribution", status: "In Progress", date: "2025-03-31" },
      { name: "Irrigation Infrastructure", status: "Planned", date: "2025-12-31" },
      { name: "Impact Assessment", status: "Planned", date: "2026-09-01" }
    ],
    keyMetrics: {
      farmersTrained: 25000,
      cropYieldIncrease: 18,
      waterSaved: 35,
      incomeIncrease: 22
    },
    riskLevel: "Medium",
    lastUpdated: "2024-12-12"
  },
  {
    id: "PRJ-004",
    title: "Urban Flood Management System",
    description: "Developing comprehensive flood management infrastructure and early warning systems for major urban centers.",
    sector: "Disaster Risk",
    status: "Planning",
    priority: "High",
    duration: "60 months",
    startDate: "2024-07-01",
    endDate: "2029-07-01",
    location: "Dhaka, Chittagong, Khulna",
    totalBudget: 180000000,
    disbursed: 12000000,
    fundingSources: ["Asian Development Bank", "Netherlands Government"],
    implementingAgency: "Local Government Engineering Department",
    beneficiaries: 3200000,
    progress: 7,
    milestones: [
      { name: "Feasibility Study", status: "In Progress", date: "2024-12-31" },
      { name: "Detailed Design", status: "Planned", date: "2025-06-30" },
      { name: "Construction Phase 1", status: "Planned", date: "2026-12-31" },
      { name: "System Integration", status: "Planned", date: "2028-06-30" },
      { name: "Project Handover", status: "Planned", date: "2029-07-01" }
    ],
    keyMetrics: {
      drainageCapacity: 250,
      pumpingStations: 45,
      earlyWarningCoverage: 95,
      floodRiskReduction: 70
    },
    riskLevel: "High",
    lastUpdated: "2024-12-08"
  },
  {
    id: "PRJ-005",
    title: "Sustainable Water Management Initiative",
    description: "Improving water resource management and access to clean water in climate-vulnerable regions.",
    sector: "Water Resources", 
    status: "Active",
    priority: "Medium",
    duration: "30 months",
    startDate: "2023-09-01",
    endDate: "2026-03-01",
    location: "Kushtia, Jessore, Satkhira",
    totalBudget: 65000000,
    disbursed: 32000000,
    fundingSources: ["European Union", "German Development Bank"],
    implementingAgency: "Department of Public Health Engineering",
    beneficiaries: 680000,
    progress: 49,
    milestones: [
      { name: "Water Source Assessment", status: "Completed", date: "2023-09-01" },
      { name: "Community Mobilization", status: "Completed", date: "2023-12-15" },
      { name: "Infrastructure Development", status: "In Progress", date: "2025-06-30" },
      { name: "Water Treatment Plants", status: "In Progress", date: "2025-12-31" },
      { name: "Capacity Building", status: "Planned", date: "2026-03-01" }
    ],
    keyMetrics: {
      waterAccessImproved: 425000,
      treatmentCapacity: 85000,
      waterQualityImprovement: 78,
      maintenanceJobs: 340
    },
    riskLevel: "Low",
    lastUpdated: "2024-12-14"
  },
  {
    id: "PRJ-006",
    title: "Green Building Certification Program",
    description: "Promoting sustainable construction practices and energy-efficient buildings across commercial and residential sectors.",
    sector: "Renewable Energy",
    status: "Completed",
    priority: "Low",
    duration: "24 months",
    startDate: "2022-01-01",
    endDate: "2024-01-01",
    location: "Dhaka, Chittagong",
    totalBudget: 35000000,
    disbursed: 35000000,
    fundingSources: ["UNDP", "Norway Government"],
    implementingAgency: "Bangladesh Standards and Testing Institution",
    beneficiaries: 125000,
    progress: 100,
    milestones: [
      { name: "Standards Development", status: "Completed", date: "2022-01-01" },
      { name: "Training Programs", status: "Completed", date: "2022-06-30" },
      { name: "Pilot Certifications", status: "Completed", date: "2023-03-31" },
      { name: "Program Rollout", status: "Completed", date: "2023-12-31" },
      { name: "Final Evaluation", status: "Completed", date: "2024-01-01" }
    ],
    keyMetrics: {
      buildingsCertified: 285,
      energySavings: 28,
      co2Reduction: 45000,
      greenJobs: 560
    },
    riskLevel: "Low",
    lastUpdated: "2024-01-01"
  }
];
