/**
 * Population data for Bangladesh regions and districts
 * Based on approximate data from Bangladesh Bureau of Statistics
 */

export const populationData = {
  'Central': {
    population: 45000000,
    districts: {
      'Dhaka': 9500000,
      'Gazipur': 5000000,
      'Manikganj': 1500000,
      'Munshiganj': 1600000,
      'Narayanganj': 3200000,
      'Narsingdi': 2400000,
      'Tangail': 3900000,
      'Faridpur': 2000000,
      'Gopalganj': 1200000,
      'Madaripur': 1300000,
      'Rajbari': 1100000,
      'Shariatpur': 1200000
    }
  },
  'Northeast': {
    population: 15000000,
    districts: {
      'Sylhet': 3500000,
      'Moulvibazar': 2000000,
      'Habiganj': 2100000,
      'Sunamganj': 2600000,
      'Netrokona': 2300000,
      'Kishoreganj': 3000000
    }
  },
  'Northwest': {
    population: 20000000,
    districts: {
      'Rangpur': 3000000,
      'Rajshahi': 2600000,
      'Kurigram': 2200000,
      'Gaibandha': 2500000,
      'Lalmonirhat': 1300000,
      'Nilphamari': 1900000,
      'Thakurgaon': 1400000,
      'Panchagarh': 1100000,
      'Dinajpur': 3200000,
      'Bogura': 3500000,
      'Joypurhat': 900000,
      'Naogaon': 2700000,
      'Natore': 1700000,
      'Chapainawabganj': 1700000,
      'Pabna': 2600000,
      'Sirajganj': 3100000
    }
  },
  'Southwest': {
    population: 18000000,
    districts: {
      'Khulna': 2400000,
      'Bagerhat': 1500000,
      'Satkhira': 2000000,
      'Jessore': 2800000,
      'Jhenaidah': 1800000,
      'Magura': 900000,
      'Narail': 700000,
      'Chuadanga': 1200000,
      'Kushtia': 1900000,
      'Meherpur': 700000
    }
  },
  'South': {
    population: 12000000,
    districts: {
      'Barisal': 2400000,
      'Patuakhali': 1600000,
      'Barguna': 900000,
      'Bhola': 1800000,
      'Jhalokati': 700000,
      'Pirojpur': 1200000,
      'Bandarban': 400000,
      'Rangamati': 600000,
      'Khagrachhari': 700000
    }
  },
  'Southeast': {
    population: 10000000,
    districts: {
      'Chittagong': 8200000,
      'Coxs Bazar': 2400000,
      'Feni': 1500000,
      'Lakshmipur': 1800000,
      'Noakhali': 3200000,
      'Cumilla': 5400000
    }
  }
};

/**
 * Calculate estimated people affected based on project locations
 * @param {Array} locations - Array of location objects with name and region
 * @param {number} impactPercentage - Percentage of population likely to be affected (default 10%)
 * @returns {Object} - Object with total affected, breakdown by region, and details
 */
export const calculatePeopleAffected = (locations, impactPercentage = 10) => {
  if (!locations || locations.length === 0) {
    return {
      totalAffected: 0,
      regionBreakdown: {},
      details: []
    };
  }

  let totalAffected = 0;
  const regionBreakdown = {};
  const details = [];

  locations.forEach(location => {
    const regionData = populationData[location.region];
    if (regionData) {
      // Check if it's a specific district or use region total
      const districtPopulation = regionData.districts[location.name];
      const basePopulation = districtPopulation || regionData.population;
      
      const affected = Math.round(basePopulation * (impactPercentage / 100));
      
      totalAffected += affected;
      
      if (!regionBreakdown[location.region]) {
        regionBreakdown[location.region] = 0;
      }
      regionBreakdown[location.region] += affected;
      
      details.push({
        locationName: location.name,
        region: location.region,
        population: basePopulation,
        affected: affected,
        percentage: impactPercentage
      });
    }
  });

  return {
    totalAffected,
    regionBreakdown,
    details
  };
};

/**
 * Get population for a specific location
 * @param {string} locationName - Name of the location
 * @param {string} region - Region of the location
 * @returns {number} - Population of the location
 */
export const getLocationPopulation = (locationName, region) => {
  const regionData = populationData[region];
  if (!regionData) return 0;
  
  return regionData.districts[locationName] || regionData.population;
};

/**
 * Format large numbers for display
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
export const formatPopulation = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};