import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TOOLTIP_STYLES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

const Transliteration = (type, language) => {
  if (language === 'bn') {
    if (type === 'Adaptation') return 'অ্যাডাপটেশন';
    if (type === 'Mitigation') return 'মিটিগেশন';
    if (type === 'Trend' || type === 'trend') return 'ট্রেন্ড';
  }
  return type;
};

const CustomTooltip = ({ active, payload, label, formatYAxis = false }) => {
  const { language } = useLanguage();
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="notranslate" translate="no" style={{ background: 'white', border: '1px solid #eee', borderRadius: 8, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div className="font-semibold mb-1">{label}</div>
      {payload.map((entry, idx) => (
        <div key={idx} style={{ color: entry.color, marginBottom: 4 }}>
          {Transliteration(entry.name, language)}: {formatYAxis ? formatCurrency(entry.value) : entry.value}
        </div>
      ))}
    </div>
  );
};

const BarChartComponent = ({ data, title, xAxisKey, bars, formatYAxis = false }) => {
  const { language } = useLanguage();
  const displayTitle = Transliteration(title, language);
  return (
    <div className="w-full">
      <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{displayTitle}</h3>
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
              allowDecimals={formatYAxis} // Only allow decimals when formatting as currency
              width={100} // ✅ Increased width for better label fit
            />
            <Tooltip 
              content={<CustomTooltip formatYAxis={formatYAxis} />}
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
    </div>
  );
};

export default BarChartComponent;