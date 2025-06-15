import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TOOLTIP_STYLES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const LineChartComponent = ({ 
  data, 
  title, 
  xAxisKey, 
  yAxisKey, 
  lineColor = '#7C65C1',
  formatYAxis = false,
  lineName = 'Value'
}) => {
  return (
    <div className="w-full overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }} // ✅ Increased margins
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey={xAxisKey}
            fontSize={12}
            interval={0} // ✅ Show all year labels
          />
          <YAxis 
            tickFormatter={formatYAxis ? value => formatCurrency(value) : undefined}
            width={100} // ✅ Increased width for better label fit
          />
          <Tooltip 
            formatter={(value) => 
              formatYAxis ? [formatCurrency(value), lineName] : [value, lineName]
            }
            contentStyle={TOOLTIP_STYLES}
          />
          <Line 
            type="monotone" 
            dataKey={yAxisKey} 
            stroke={lineColor} 
            strokeWidth={2} 
            dot={{ fill: lineColor }} 
            activeDot={{ r: 6 }}
            name={lineName}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;