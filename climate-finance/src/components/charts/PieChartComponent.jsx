import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS, TOOLTIP_STYLES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const PieChartComponent = ({ data, title, nameKey = 'name', valueKey = 'value' }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={nameKey}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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