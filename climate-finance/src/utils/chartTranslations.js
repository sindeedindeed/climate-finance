// Centralized chart translations
export const chartTranslations = {
  en: {
    // Chart UI elements
    selected: 'Selected',
    amount: 'Amount',
    percentage: 'Percentage',
    value: 'Value',
    
    // Chart titles
    projectsByStatus: 'Projects by Status',
    projectsByType: 'Projects by Type',
    projectsBySector: 'Projects by Sector',
    fundingByType: 'Funding by Type',
    fundingBySource: 'Funding by Source',
    
    // Status translations
    status: {
      Active: 'Active',
      Planning: 'Planning',
      Completed: 'Completed',
      Suspended: 'Suspended',
    },
    
    // Type translations
    type: {
      Grant: 'Grant',
      Loan: 'Loan',
      Technical: 'Technical',
      Other: 'Other',
    },
    
    // Sector translations
    sector: {
      'Disaster Risk Management': 'Disaster Risk Management',
      Water: 'Water',
      Agriculture: 'Agriculture',
      Coastal: 'Coastal',
      Energy: 'Energy',
    },
    
    // Source translations
    source: {
      Government: 'Government',
      Donor: 'Donor',
      Private: 'Private',
      Other: 'Other',
    }
  },
  bn: {
    // Chart UI elements
    selected: 'নির্বাচিত',
    amount: 'পরিমাণ',
    percentage: 'শতকরা হার',
    value: 'মান',
    
    // Chart titles
    projectsByStatus: 'অবস্থা অনুযায়ী প্রকল্প',
    projectsByType: 'ধরন অনুযায়ী প্রকল্প',
    projectsBySector: 'খাত অনুযায়ী প্রকল্প',
    fundingByType: 'ধরন অনুযায়ী অর্থায়ন',
    fundingBySource: 'উৎস অনুযায়ী অর্থায়ন',
    
    // Status translations
    status: {
      Active: 'চলমান',
      Planning: 'পরিকল্পনা',
      Completed: 'সম্পন্ন',
      Suspended: 'স্থগিত',
    },
    
    // Type translations
    type: {
      Grant: 'অনুদান',
      Loan: 'ঋণ',
      Technical: 'প্রযুক্তিগত',
      Other: 'অন্যান্য',
    },
    
    // Sector translations
    sector: {
      'Disaster Risk Management': 'দুর্যোগ ব্যবস্থাপনা',
      Water: 'পানি',
      Agriculture: 'কৃষি',
      Coastal: 'উপকূলীয়',
      Energy: 'জ্বালানি',
    },
    
    // Source translations
    source: {
      Government: 'সরকার',
      Donor: 'দাতা',
      Private: 'বেসরকারি',
      Other: 'অন্যান্য',
    }
  }
};

// Helper function to get translation
export const getChartTranslation = (language, category, key) => {
  const translations = chartTranslations[language] || chartTranslations.en;
  if (category) {
    return translations[category]?.[key] || key;
  }
  return translations[key] || key;
};

// Helper function to translate chart data
export const translateChartData = (data, language, category) => {
  return data.map(item => ({
    ...item,
    name: getChartTranslation(language, category, item.name) || item.name
  }));
};

// Helper function to get chart title
export const getChartTitle = (language, titleKey) => {
  return getChartTranslation(language, null, titleKey);
}; 