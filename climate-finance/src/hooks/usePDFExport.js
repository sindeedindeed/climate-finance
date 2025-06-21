import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const usePDFExport = () => {
  const exportToPDF = useCallback(async (data, filename = 'report', options = {}) => {
    const {
      title = 'Report',
      subtitle = '',
      orientation = 'portrait',
      format = 'a4',
      customTemplate = null
    } = options;

    try {
      const pdf = new jsPDF(orientation, 'mm', format);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header
      pdf.setFontSize(20);
      pdf.setTextColor(124, 101, 193); // Purple color
      pdf.text(title, 20, yPosition);
      yPosition += 15;

      if (subtitle) {
        pdf.setFontSize(12);
        pdf.setTextColor(107, 114, 128); // Gray color
        pdf.text(subtitle, 20, yPosition);
        yPosition += 10;
      }

      // Date
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
      yPosition += 20;

      // Custom template if provided
      if (customTemplate) {
        yPosition = await customTemplate(pdf, data, yPosition, pageWidth, pageHeight);
      } else {
        // Default template
        yPosition = await generateDefaultContent(pdf, data, yPosition, pageWidth, pageHeight);
      }

      // Save the PDF
      pdf.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
      return true;
    } catch (error) {
      console.error('PDF export failed:', error);
      throw new Error('Failed to export PDF');
    }
  }, []);

  const generateDefaultContent = async (pdf, data, yPosition, pageWidth, pageHeight) => {
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);

    // Handle different data types
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        
        // Better formatting for array items
        if (typeof item === 'object') {
          pdf.setFontSize(14);
          pdf.setTextColor(124, 101, 193);
          pdf.text(`${index + 1}. ${item.title || item.name || `Item ${index + 1}`}`, 20, yPosition);
          yPosition += 10;
          
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          Object.entries(item).forEach(([key, value]) => {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }
            const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
            const lines = pdf.splitTextToSize(`${key}: ${displayValue}`, pageWidth - 40);
            pdf.text(lines, 25, yPosition);
            yPosition += lines.length * 5;
          });
          yPosition += 5;
        } else {
          pdf.text(`${index + 1}. ${String(item)}`, 20, yPosition);
          yPosition += 10;
        }
      });
    } else if (typeof data === 'object' && data !== null) {
      Object.entries(data).forEach(([key, value]) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        
        // Format section headers
        pdf.setFontSize(12);
        pdf.setTextColor(124, 101, 193);
        pdf.text(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:`, 20, yPosition);
        yPosition += 8;
        
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        const displayValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
        const lines = pdf.splitTextToSize(displayValue, pageWidth - 40);
        pdf.text(lines, 25, yPosition);
        yPosition += lines.length * 5 + 5;
      });
    } else {
      const lines = pdf.splitTextToSize(String(data), pageWidth - 40);
      pdf.text(lines, 20, yPosition);
      yPosition += lines.length * 5;
    }

    return yPosition;
  };

  const exportElementToPDF = useCallback(async (elementId, filename = 'report', options = {}) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF(options.orientation || 'portrait');
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
      return true;
    } catch (error) {
      console.error('PDF export failed:', error);
      throw new Error('Failed to export PDF');
    }
  }, []);

  return { exportToPDF, exportElementToPDF };
};
