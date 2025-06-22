import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../../utils/formatters';

const BangladeshMapComponent = ({ 
  data = [], 
  title = "Regional Distribution",
  height = 400,
  onRegionClick = null 
}) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Process data to create region mapping
  const regionData = useMemo(() => {
    const regionMap = {};
    data.forEach(item => {
      const region = item.region;
      if (!regionMap[region]) {
        regionMap[region] = {
          adaptation: 0,
          mitigation: 0,
          total: 0
        };
      }
      regionMap[region].adaptation += item.adaptation || 0;
      regionMap[region].mitigation += item.mitigation || 0;
      regionMap[region].total += (item.adaptation || 0) + (item.mitigation || 0);
    });
    return regionMap;
  }, [data]);

  // Calculate color intensity based on total funding
  const getColorIntensity = (total) => {
    const maxTotal = Math.max(...Object.values(regionData).map(r => r.total), 1);
    const intensity = Math.min((total / maxTotal) * 0.8 + 0.2, 1);
    return intensity;
  };

  // Region configurations with SVG paths
  const regions = {
    'Central': {
      path: "M 200 150 L 220 140 L 240 145 L 250 160 L 245 175 L 230 180 L 210 175 L 200 160 Z",
      center: { x: 225, y: 160 },
      color: '#3B82F6'
    },
    'Northeast': {
      path: "M 240 120 L 260 110 L 280 115 L 285 130 L 280 145 L 265 150 L 250 145 L 240 130 Z",
      center: { x: 265, y: 130 },
      color: '#10B981'
    },
    'Northwest': {
      path: "M 180 100 L 200 90 L 220 95 L 225 110 L 220 125 L 205 130 L 190 125 L 180 110 Z",
      center: { x: 205, y: 110 },
      color: '#8B5CF6'
    },
    'Southwest': {
      path: "M 160 200 L 180 190 L 200 195 L 205 210 L 200 225 L 185 230 L 170 225 L 160 210 Z",
      center: { x: 185, y: 210 },
      color: '#F59E0B'
    },
    'Southeast': {
      path: "M 220 180 L 240 170 L 260 175 L 265 190 L 260 205 L 245 210 L 230 205 L 220 190 Z",
      center: { x: 245, y: 190 },
      color: '#EC4899'
    },
    'Chittagong': {
      path: "M 260 160 L 280 150 L 300 155 L 305 170 L 300 185 L 285 190 L 270 185 L 260 170 Z",
      center: { x: 285, y: 170 },
      color: '#6366F1'
    }
  };

  const handleRegionClick = (regionName) => {
    setSelectedRegion(selectedRegion === regionName ? null : regionName);
    if (onRegionClick) {
      onRegionClick(regionName);
    }
  };

  const handleRegionHover = (regionName) => {
    setHoveredRegion(regionName);
  };

  const handleRegionLeave = () => {
    setHoveredRegion(null);
  };

  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
            </svg>
          </div>
          <p className="text-gray-500">No regional data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      
      <div className="relative" style={{ height: `${height}px` }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 320 240" 
          className="w-full h-full"
          style={{ maxHeight: `${height}px` }}
        >
          {/* Background */}
          <rect width="100%" height="100%" fill="#f8fafc" />
          
          {/* Region paths */}
          {Object.entries(regions).map(([regionName, region]) => {
            const data = regionData[regionName] || { adaptation: 0, mitigation: 0, total: 0 };
            const intensity = getColorIntensity(data.total);
            const isHovered = hoveredRegion === regionName;
            const isSelected = selectedRegion === regionName;
            
            // Calculate color with intensity
            const baseColor = region.color;
            const color = data.total > 0 ? baseColor : '#e5e7eb';
            
            return (
              <g key={regionName}>
                <path
                  d={region.path}
                  fill={color}
                  fillOpacity={data.total > 0 ? intensity : 0.3}
                  stroke={isSelected ? '#1f2937' : isHovered ? '#374151' : '#d1d5db'}
                  strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => handleRegionHover(regionName)}
                  onMouseLeave={handleRegionLeave}
                  onClick={() => handleRegionClick(regionName)}
                />
                
                {/* Region label */}
                {data.total > 0 && (
                  <text
                    x={region.center.x}
                    y={region.center.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-medium pointer-events-none"
                    fill={intensity > 0.5 ? '#ffffff' : '#1f2937'}
                  >
                    {regionName}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
          <div className="text-xs font-medium text-gray-700 mb-2">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs text-gray-600">Central</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-600">Northeast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-xs text-gray-600">Northwest</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-xs text-gray-600">Southwest</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pink-500 rounded"></div>
              <span className="text-xs text-gray-600">Southeast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded"></div>
              <span className="text-xs text-gray-600">Chittagong</span>
            </div>
          </div>
        </div>
        
        {/* Tooltip */}
        {hoveredRegion && regionData[hoveredRegion] && (
          <div 
            className="absolute bg-gray-900 text-white text-xs rounded-lg px-3 py-2 pointer-events-none z-10"
            style={{
              left: `${regions[hoveredRegion].center.x * 0.8}%`,
              top: `${regions[hoveredRegion].center.y * 0.8}%`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="font-medium mb-1">{hoveredRegion}</div>
            <div>Adaptation: {formatCurrency(regionData[hoveredRegion].adaptation)}</div>
            <div>Mitigation: {formatCurrency(regionData[hoveredRegion].mitigation)}</div>
            <div className="font-medium">Total: {formatCurrency(regionData[hoveredRegion].total)}</div>
          </div>
        )}
      </div>
      
      {/* Summary stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-blue-600 font-medium">Total Adaptation</div>
          <div className="text-lg font-bold text-blue-800">
            {formatCurrency(Object.values(regionData).reduce((sum, r) => sum + r.adaptation, 0))}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-green-600 font-medium">Total Mitigation</div>
          <div className="text-lg font-bold text-green-800">
            {formatCurrency(Object.values(regionData).reduce((sum, r) => sum + r.mitigation, 0))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BangladeshMapComponent; 