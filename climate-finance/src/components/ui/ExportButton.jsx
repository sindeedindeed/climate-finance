import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import Button from './Button';
import usePDFExport from '../../hooks/usePDFExport';

const ExportButton = ({
  data,
  filename = 'report',
  title = 'Report',
  subtitle = '',
  elementId = null,
  variant = 'outline',
  size = 'sm',
  className = '',
  exportFormats = ['pdf'], // Changed default to only PDF
  customPDFTemplate = null,
  ...props
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);
  const { exportToPDF, exportElementToPDF } = usePDFExport();

  // Simple alert function to replace toast
  const showAlert = (message, type = 'info') => {
    const prefix = type === 'error' ? 'Error: ' : type === 'success' ? 'Success: ' : '';
    alert(prefix + message);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  const handleExport = async (format) => {
    if (!data && !elementId) {
      showAlert('No data available to export', 'error');
      return;
    }

    setIsExporting(true);
    setShowOptions(false);

    try {
      if (format === 'pdf') {
        if (elementId) {
          await exportElementToPDF(elementId, filename, { title, subtitle });
        } else {
          await exportToPDF(data, filename, {
            title,
            subtitle,
            customTemplate: customPDFTemplate
          });
        }
        showAlert('PDF exported successfully', 'success');
      } else if (format === 'csv') {
        // Add CSV export functionality
        if (!Array.isArray(data)) {
          throw new Error('CSV export requires array data');
        }
        
        const headers = Object.keys(data[0] || {});
        const csvContent = [
          headers.join(','),
          ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');
        
        const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showAlert('CSV exported successfully', 'success');
      } else if (format === 'json') {
        const exportData = {
          ...data,
          exportDate: new Date().toISOString(),
          title,
          subtitle
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showAlert('JSON exported successfully', 'success');
      }
    } catch (error) {
      console.error('Export failed:', error);
      showAlert(`Export failed: ${error.message}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // If only one format, export directly
  if (exportFormats.length === 1) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={() => handleExport(exportFormats[0])}
        leftIcon={<Download size={16} />}
        loading={isExporting}
        className={className}
        {...props}
      >
        {isExporting ? 'Exporting...' : 'Export'}
      </Button>
    );
  }

  // Multiple formats - show dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowOptions(!showOptions)}
        leftIcon={<Download size={16} />}
        loading={isExporting}
        className={className}
        {...props}
      >
        {isExporting ? 'Exporting...' : 'Export'}
      </Button>

      {showOptions && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px]">
          {exportFormats.includes('pdf') && (
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
            >
              <FileText size={14} />
              Export PDF
            </button>
          )}
          {exportFormats.includes('csv') && (
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FileSpreadsheet size={14} />
              Export CSV
            </button>
          )}
          {exportFormats.includes('json') && (
            <button
              onClick={() => handleExport('json')}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
            >
              <FileText size={14} />
              Export JSON
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ExportButton;
