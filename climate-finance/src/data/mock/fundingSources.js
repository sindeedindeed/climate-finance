/**
 * Mock data for funding sources
 */
export const fundingSources = [
  { 
    id: 'GCF-001',
    name: 'Green Climate Fund', 
    type: 'Multilateral',
    total_committed: 450000000,
    total_disbursed: 175000000,
    active_projects: 12,
    sectors: ['Energy', 'Adaptation', 'Agriculture', 'Forestry'],
    allocation_by_year: [
      { year: '2021', amount: 25000000 },
      { year: '2022', amount: 45000000 },
      { year: '2023', amount: 65000000 },
      { year: '2024', amount: 40000000 },
    ],
    logo: '/api/placeholder/64/64',
    description: 'The Green Climate Fund (GCF) is a global fund created to support efforts of developing countries to respond to the challenges of climate change.',
    website: 'https://www.greenclimate.fund',
    contact_email: 'info@gcfund.org'
  },
  { 
    id: 'WB-002',
    name: 'World Bank - Climate Investment Funds', 
    type: 'Multilateral',
    total_committed: 280000000,
    total_disbursed: 120000000,
    active_projects: 8,
    sectors: ['Energy', 'Transport', 'Urban', 'Water'],
    allocation_by_year: [
      { year: '2021', amount: 22000000 },
      { year: '2022', amount: 35000000 },
      { year: '2023', amount: 40000000 },
      { year: '2024', amount: 23000000 },
    ],
    logo: '/api/placeholder/64/64',
    description: 'The Climate Investment Funds (CIFs) accelerate climate action by empowering transformations in clean technology, energy access, climate resilience, and sustainable forests.',
    website: 'https://www.climateinvestmentfunds.org',
    contact_email: 'CIFAdminUnit@worldbank.org'
  },
  { 
    id: 'JICA-003',
    name: 'Japan International Cooperation Agency', 
    type: 'Bilateral',
    total_committed: 175000000,
    total_disbursed: 95000000,
    active_projects: 6,
    sectors: ['Energy', 'Disaster Risk Reduction', 'Infrastructure'],
    allocation_by_year: [
      { year: '2021', amount: 18000000 },
      { year: '2022', amount: 25000000 },
      { year: '2023', amount: 32000000 },
      { year: '2024', amount: 20000000 },
    ],
    logo: '/api/placeholder/64/64',
    description: 'JICA aims for inclusive and dynamic development through a people-centered approach and comprehensively addressing climate change.',
    website: 'https://www.jica.go.jp/english',
    contact_email: 'info@jica.go.jp'
  },
  { 
    id: 'GOB-004',
    name: 'Government of Bangladesh - Climate Change Trust Fund', 
    type: 'National',
    total_committed: 120000000,
    total_disbursed: 80000000,
    active_projects: 25,
    sectors: ['Adaptation', 'Agriculture', 'Disaster Risk Reduction', 'Water'],
    allocation_by_year: [
      { year: '2021', amount: 15000000 },
      { year: '2022', amount: 20000000 },
      { year: '2023', amount: 25000000 },
      { year: '2024', amount: 20000000 },
    ],
    logo: '/api/placeholder/64/64',
    description: 'The Bangladesh Climate Change Trust Fund (BCCTF) is a national initiative to address the adverse impacts of climate change in Bangladesh.',
    website: 'https://www.bcct.gov.bd',
    contact_email: 'info@bcct.gov.bd'
  },
  { 
    id: 'DFID-005',
    name: 'UK - Foreign, Commonwealth & Development Office', 
    type: 'Bilateral',
    total_committed: 95000000,
    total_disbursed: 55000000,
    active_projects: 7,
    sectors: ['Adaptation', 'Resilience', 'Agriculture'],
    allocation_by_year: [
      { year: '2021', amount: 12000000 },
      { year: '2022', amount: 15000000 },
      { year: '2023', amount: 18000000 },
      { year: '2024', amount: 10000000 },
    ],
    logo: '/api/placeholder/64/64',
    description: 'The UK\'s Foreign, Commonwealth & Development Office (FCDO) works to promote sustainable development and humanitarian assistance.',
    website: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office',
    contact_email: 'fcdo.correspondence@fcdo.gov.uk'
  },
  { 
    id: 'ADB-006',
    name: 'Asian Development Bank', 
    type: 'Multilateral',
    total_committed: 215000000,
    total_disbursed: 95000000,
    active_projects: 9,
    sectors: ['Energy', 'Transport', 'Urban', 'Water'],
    allocation_by_year: [
      { year: '2021', amount: 20000000 },
      { year: '2022', amount: 30000000 },
      { year: '2023', amount: 25000000 },
      { year: '2024', amount: 20000000 },
    ],
    logo: '/api/placeholder/64/64',
    description: 'The Asian Development Bank is committed to achieving a prosperous, inclusive, resilient, and sustainable Asia and the Pacific.',
    website: 'https://www.adb.org',
    contact_email: 'information@adb.org'
  },
  { 
    id: 'GIZ-007',
    name: 'German Agency for International Cooperation (GIZ)', 
    type: 'Bilateral',
    total_committed: 85000000,
    total_disbursed: 40000000,
    active_projects: 5,
    sectors: ['Energy', 'Agriculture', 'Capacity Building'],
    allocation_by_year: [
      { year: '2021', amount: 10000000 },
      { year: '2022', amount: 12000000 },
      { year: '2023', amount: 9000000 },
      { year: '2024', amount: 9000000 },
    ],
    logo: '/api/placeholder/64/64',
    description: 'GIZ works to develop solutions for political, economic, ecological and social development in a globalised world.',
    website: 'https://www.giz.de/en',
    contact_email: 'info@giz.de'
  }
];