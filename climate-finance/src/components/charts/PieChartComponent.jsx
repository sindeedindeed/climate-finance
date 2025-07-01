import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { CHART_COLORS, TOOLTIP_STYLES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

// Improved custom label component with better positioning
const renderCustomizedLabel = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
  
  // Skip very tiny slices
  if (percent < 0.02) return null;

  const RADIAN = Math.PI / 180;
  
  // More conservative label positioning to keep within bounds
  const labelRadius = innerRadius + (outerRadius - innerRadius) * 1.4;
  
  const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
  const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);
  
  // Truncate name for smaller slices to prevent overflow
  let displayName;
  if (percent >= 0.15) {
    displayName = name; // Full name for larger segments
  } else if (percent >= 0.08) {
    displayName = name.length > 12 ? `${name.substring(0, 12)}...` : name;
  } else {
    displayName = name.length > 8 ? `${name.substring(0, 8)}...` : name;
  }
  
  const percentValue = `${(percent * 100).toFixed(0)}%`;
  
  // For small slices, only show percentage
  if (percent < 0.06) {
    return (
      <text 
        x={x} 
        y={y} 
        fill="#333333"
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={10}
      >
        {percentValue}
      </text>
    );
  }
  
  return (
    <text 
      x={x} 
      y={y} 
      fill="#333333"
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={11}
      fontWeight={percent > 0.2 ? '600' : 'normal'}
    >
      {`${displayName} ${percentValue}`}
    </text>
  );
};

const PieChartComponent = ({ 
  data, 
  title, 
  nameKey = 'name', 
  valueKey = 'value',
  donut = false 
}) => {
  // Calculate if we should show as donut chart based on data size or explicit preference
  const useDonutStyle = donut || data.length > 5;
  
  // For charts with many segments, using a donut style can improve label placement
  const innerRadius = useDonutStyle ? 50 : 0;  return (
    <div className="w-full overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart margin={{ top: 20, right: 60, left: 60, bottom: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={nameKey}
            labelLine={false}
            label={renderCustomizedLabel}
            activeShape={null}
            isAnimationActive={false}
            activeIndex={-1}
            onClick={() => {}}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} tabIndex={-1}/>
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => 
              typeof value === 'number' && value >= 1000 
                ? [formatCurrency(value), 'Amount'] 
                : [value, 'Value']
            }
            contentStyle={TOOLTIP_STYLES}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;