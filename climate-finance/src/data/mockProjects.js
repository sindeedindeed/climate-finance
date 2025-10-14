// Mock data for climate finance projects
export const mockProjects = [
  {
    id: 1,
    title: "Climate Resilience in Coastal Areas",
    description: "Building climate resilience in coastal communities through infrastructure development and community capacity building.",
    sector: "Infrastructure",
    status: "Active",
    startDate: "2023-01-15",
    endDate: "2025-12-31",
    budget: 2500000,
    location: "Cox's Bazar",
    agency: "UNDP",
    fundingSource: "Green Climate Fund",
    focalArea: "Climate Adaptation",
    sdgGoals: [13, 14, 15],
    beneficiaries: 15000,
    progress: 65
  },
  {
    id: 2,
    title: "Renewable Energy for Rural Communities",
    description: "Installing solar panels and wind turbines in rural areas to provide clean energy access.",
    sector: "Energy",
    status: "Completed",
    startDate: "2022-06-01",
    endDate: "2024-05-31",
    budget: 1800000,
    location: "Sylhet",
    agency: "World Bank",
    fundingSource: "Climate Investment Funds",
    focalArea: "Climate Mitigation",
    sdgGoals: [7, 13],
    beneficiaries: 8500,
    progress: 100
  },
  {
    id: 3,
    title: "Sustainable Agriculture Practices",
    description: "Promoting climate-smart agriculture techniques among smallholder farmers.",
    sector: "Agriculture",
    status: "Active",
    startDate: "2023-03-01",
    endDate: "2026-02-28",
    budget: 1200000,
    location: "Rajshahi",
    agency: "FAO",
    fundingSource: "Adaptation Fund",
    focalArea: "Climate Adaptation",
    sdgGoals: [2, 13, 15],
    beneficiaries: 12000,
    progress: 40
  },
  {
    id: 4,
    title: "Urban Climate Action Plan",
    description: "Developing comprehensive climate action plans for major urban centers.",
    sector: "Urban Planning",
    status: "Planning",
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    budget: 800000,
    location: "Dhaka",
    agency: "UN-Habitat",
    fundingSource: "Global Environment Facility",
    focalArea: "Climate Mitigation",
    sdgGoals: [11, 13],
    beneficiaries: 500000,
    progress: 15
  },
  {
    id: 5,
    title: "Forest Conservation and Restoration",
    description: "Protecting existing forests and restoring degraded forest areas for carbon sequestration.",
    sector: "Forestry",
    status: "Active",
    startDate: "2023-08-15",
    endDate: "2027-08-14",
    budget: 3200000,
    location: "Chittagong Hill Tracts",
    agency: "IUCN",
    fundingSource: "REDD+",
    focalArea: "Climate Mitigation",
    sdgGoals: [13, 15],
    beneficiaries: 25000,
    progress: 30
  }
];

export const mockAgencies = [
  { id: 1, name: "UNDP", description: "United Nations Development Programme" },
  { id: 2, name: "World Bank", description: "International Bank for Reconstruction and Development" },
  { id: 3, name: "FAO", description: "Food and Agriculture Organization" },
  { id: 4, name: "UN-Habitat", description: "United Nations Human Settlements Programme" },
  { id: 5, name: "IUCN", description: "International Union for Conservation of Nature" }
];

export const mockFundingSources = [
  { id: 1, name: "Green Climate Fund", description: "Global climate finance mechanism" },
  { id: 2, name: "Climate Investment Funds", description: "Multi-donor climate finance platform" },
  { id: 3, name: "Adaptation Fund", description: "Financing adaptation projects in developing countries" },
  { id: 4, name: "Global Environment Facility", description: "International environmental funding" },
  { id: 5, name: "REDD+", description: "Reducing Emissions from Deforestation and Forest Degradation" }
];

export const mockLocations = [
  { id: 1, name: "Cox's Bazar", region: "Chittagong", type: "District" },
  { id: 2, name: "Sylhet", region: "Sylhet", type: "Division" },
  { id: 3, name: "Rajshahi", region: "Rajshahi", type: "Division" },
  { id: 4, name: "Dhaka", region: "Dhaka", type: "Division" },
  { id: 5, name: "Chittagong Hill Tracts", region: "Chittagong", type: "Region" }
];

export const mockFocalAreas = [
  { id: 1, name: "Climate Adaptation", description: "Adapting to climate change impacts" },
  { id: 2, name: "Climate Mitigation", description: "Reducing greenhouse gas emissions" },
  { id: 3, name: "Climate Resilience", description: "Building resilience to climate shocks" }
];

export const mockStats = {
  totalProjects: 5,
  totalBudget: 9500000,
  activeProjects: 3,
  completedProjects: 1,
  planningProjects: 1,
  totalBeneficiaries: 602500,
  averageProgress: 50
};

export const mockTrends = [
  { year: 2022, projects: 1, budget: 1800000 },
  { year: 2023, projects: 3, budget: 5700000 },
  { year: 2024, projects: 1, budget: 2000000 }
];

export const mockSectorDistribution = [
  { sector: "Infrastructure", count: 1, budget: 2500000 },
  { sector: "Energy", count: 1, budget: 1800000 },
  { sector: "Agriculture", count: 1, budget: 1200000 },
  { sector: "Urban Planning", count: 1, budget: 800000 },
  { sector: "Forestry", count: 1, budget: 3200000 }
];
