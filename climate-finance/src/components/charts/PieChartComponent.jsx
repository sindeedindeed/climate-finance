import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';
import { getChartTranslation } from '../../utils/chartTranslations';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale
);

const PieChartComponent = ({ 
  data, 
  title, 
  nameKey = 'name', 
  valueKey = 'value',
  donut = false,
  onSegmentClick = null,
  height = 300
}) => {
  const [selectedSegment, setSelectedSegment] = useState(null);
  const chartRef = useRef(null);
  const { language } = useLanguage();

  // Use only main theme colors (repeat if needed)
  const themeColors = [
    '#7C65C1', // primary-600
    '#059669', // success-600
    '#D97706', // warning-600
    '#DC2626', // error-600
    '#3F1D85', // accent
  ];

  // Get translations using centralized system
  const t = {
    selected: getChartTranslation(language, null, 'selected'),
    amount: getChartTranslation(language, null, 'amount'),
    percentage: getChartTranslation(language, null, 'percentage'),
    value: getChartTranslation(language, null, 'value')
  };

  // Prepare chart data
  const chartData = {
    labels: data.map(item => item[nameKey]),
    datasets: [
      {
        data: data.map(item => item[valueKey]),
        backgroundColor: data.map((_, index) => themeColors[index % themeColors.length]),
        borderColor: '#fff',
        borderWidth: 0, // No border between arcs
        hoverBorderWidth: 2,
        hoverBorderColor: '#1F2937',
        hoverOffset: 8,
        borderRadius: 0, // No rounded corners for seamless arcs
        spacing: 0, // No gaps between arcs
      }
    ]
  };

  // Chart options with beautiful styling
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: '500'
          },
          color: '#374151',
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: themeColors[i % themeColors.length],
                  strokeStyle: themeColors[i % themeColors.length],
                  lineWidth: 0,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: (context) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            if (typeof value === 'number' && value >= 1000) {
              return [
                `${t.amount}: ${formatCurrency(value)}`,
                `${t.percentage}: ${percentage}%`
              ];
            }
            return [
              `${t.value}: ${value}`,
              `${t.percentage}: ${percentage}%`
            ];
          }
        }
      },
      title: {
        display: !!title,
        text: title,
        color: '#111827',
        font: {
          size: 18,
          weight: '600'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuart'
    },
    cutout: donut ? '50%' : '0%',
    radius: '85%',
    elements: {
      arc: {
        borderWidth: 0,
        borderColor: '#fff'
      }
    }
  };

  // Handle segment click
  const handleClick = useCallback((event, elements) => {
    if (elements.length > 0) {
      const element = elements[0];
      const index = element.index;
      const clickedData = data[index];
      setSelectedSegment(selectedSegment === index ? null : index);
      if (onSegmentClick) {
        onSegmentClick(clickedData, index, event);
      }
    }
  }, [data, selectedSegment, onSegmentClick]);

  // Add click handler to options
  const chartOptions = {
    ...options,
    onClick: handleClick
  };

  // Cleanup chart on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div 
        className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
        style={{ height: height + 100 }}
      >
        {/* Selected segment highlight */}
        {selectedSegment !== null && (
          <div className="absolute top-4 right-4 bg-primary-50 border border-primary-200 rounded-lg px-3 py-2">
            <p className="text-sm font-medium text-primary-800">
              {t.selected}: {data[selectedSegment]?.[nameKey]}
            </p>
            <p className="text-xs text-primary-600">
              {formatCurrency(data[selectedSegment]?.[valueKey])}
            </p>
          </div>
        )}
        <Pie 
          ref={chartRef}
          data={chartData} 
          options={chartOptions}
          height={height}
        />
      </div>
    </div>
  );
};

export default PieChartComponent;