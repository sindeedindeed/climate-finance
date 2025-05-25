/**
 * Mock data for dashboard charts and metrics
 */

// Monthly funding data for bar charts
export const monthlyFunding = [
  { month: 'Jan', adaptation: 40000000, mitigation: 50000000 },
  { month: 'Feb', adaptation: 30000000, mitigation: 45000000 },
  { month: 'Mar', adaptation: 50000000, mitigation: 60000000 },
  { month: 'Apr', adaptation: 35000000, mitigation: 55000000 },
  { month: 'May', adaptation: 45000000, mitigation: 50000000 },
  { month: 'Jun', adaptation: 40000000, mitigation: 60000000 },
];

// Sector distribution for pie chart
export const sectorDistribution = [
  { name: 'Energy', value: 35 },
  { name: 'Agriculture', value: 20 },
  { name: 'Water', value: 15 },
  { name: 'Infrastructure', value: 25 },
  { name: 'Others', value: 5 },
];

// Source distribution for pie chart
export const sourceDistribution = [
  { name: 'GCF', value: 35 },
  { name: 'Bilateral', value: 20 },
  { name: 'Multilateral', value: 15 },
  { name: 'National', value: 25 },
  { name: 'Private', value: 5 },
];

// Regional distribution data
export const regionalDistribution = [
  { region: 'Dhaka', adaptation: 10000000, mitigation: 15000000 },
  { region: 'Chittagong', adaptation: 8000000, mitigation: 12000000 },
  { region: 'Rajshahi', adaptation: 6000000, mitigation: 10000000 },
  { region: 'Sylhet', adaptation: 7000000, mitigation: 9000000 },
  { region: 'Khulna', adaptation: 5000000, mitigation: 8000000 },
  { region: 'Barisal', adaptation: 4000000, mitigation: 6000000 },
];

// Dashboard overview stats
export const dashboardStats = [
  {
    title: "Total Climate Finance",
    value: 200000000,
    change: "+18% from last year"
  },
  {
    title: "Adaptation Finance",
    value: 120000000,
    change: "+14% from last year"
  },
  {
    title: "Mitigation Finance",
    value: 80000000,
    change: "+22% from last year"
  },
  {
    title: "Active Projects",
    value: 42,
    change: "+8% from last year"
  }
];