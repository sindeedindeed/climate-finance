import React, { useEffect } from 'react';
// ...existing imports...

const PageDataManager = ({
  apiCalls = {},
  fallbackData = {},
  title = '',
  subtitle = '',
  children,
  renderStats,
  renderCharts,
  renderContent,
  statsConfig = {},
  bgColor = "bg-gray-50",
  showRefreshButton = true,
  headerActions = null,
  className = ''
}) => {
  const { data, isLoading, errors, refetch } = useMultipleApiData(apiCalls, { fallbackData });

  useEffect(() => {
    if (Object.keys(apiCalls).length === 0) {
      console.warn('PageDataManager: No API calls provided');
    }
  }, [apiCalls]);

  const hasAnyError = Object.keys(errors).length > 0;
  const mainError = hasAnyError ? Object.values(errors)[0] : null;

  // ...existing code...
};
