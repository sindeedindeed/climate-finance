// ...existing imports...

const BarChartComponent = ({
  data = [],
  bars = [],
  title = '',
  formatYAxis = false,
  height = 300
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  if (!Array.isArray(bars) || bars.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No chart configuration provided
      </div>
    );
  }

  // ...existing code...
};
