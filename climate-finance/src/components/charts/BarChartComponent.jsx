import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TOOLTIP_STYLES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const BarChartComponent = ({ data, title, xAxisKey, bars, formatYAxis = false }) => {
  return (
    <div className="w-full overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }} // ✅ Increased margins
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey={xAxisKey} 
            angle={-45} // ✅ Rotate labels for better fit
            textAnchor="end"
            height={80}
            interval={0} // ✅ Show all labels
            fontSize={12}
          />
          <YAxis 
            tickFormatter={formatYAxis ? value => formatCurrency(value) : undefined}
            width={100} // ✅ Increased width for better label fit
          />
          <Tooltip 
            formatter={(value, name) => 
              formatYAxis ? [formatCurrency(value), name] : [value, name]
            }
            contentStyle={TOOLTIP_STYLES} 
          />
          {bars.map((bar, index) => (
            <Bar 
              key={index} 
              dataKey={bar.dataKey} 
              fill={bar.fill} 
              name={bar.name || bar.dataKey}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;