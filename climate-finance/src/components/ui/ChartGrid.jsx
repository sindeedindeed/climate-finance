import React from 'react';
import Card from './Card';
import PieChartComponent from '../charts/PieChartComponent';
import LineChartComponent from '../charts/LineChartComponent';
import BarChartComponent from '../charts/BarChartComponent';

// Universal chart grid for consistent chart layouts
const ChartGrid = ({
  charts = [],
  columns = 2, // 1 | 2 | 3
  gap = 'md',
  animated = true,
  animationDelay = 100,
  cardProps = {},
  className = ''
}) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
  };

  const renderChart = (chart) => {
    const { type, data, title, ...chartProps } = chart;
    
    switch (type) {
      case 'pie':
        return (
          <PieChartComponent
            title={title}
            data={data}
            {...chartProps}
          />
        );
      case 'line':
        return (
          <LineChartComponent
            title={title}
            data={data}
            {...chartProps}
          />
        );
      case 'bar':
        return (
          <BarChartComponent
            title={title}
            data={data}
            {...chartProps}
          />
        );
      case 'custom':
        return chart.render ? chart.render(data) : null;
      default:
        return <div>Unknown chart type: {type}</div>;
    }
  };

  return (
    <div className={`grid ${gridClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {charts.map((chart, index) => (
        <div 
          key={chart.id || index}
          className={animated ? "animate-fade-in-up" : ""}
          style={animated ? { animationDelay: `${400 + (index * animationDelay)}ms` } : {}}
        >
          <Card hover padding={true} {...cardProps}>
            {renderChart(chart)}
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ChartGrid;