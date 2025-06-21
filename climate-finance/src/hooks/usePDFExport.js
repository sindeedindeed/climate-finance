import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useState, useCallback } from 'react';
import { saveAs } from 'file-saver';
import { formatDate } from '../utils/formatDate';
import { useTranslation } from 'react-i18next';

const usePDFExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { t } = useTranslation();

  const exportPDF = useCallback(
    async ({
      data,
      fileName,
      title,
      headers,
      columnStyles,
      rowStyles,
      logo,
      customStyles,
      useI18n,
    }) => {
      setIsExporting(true);
      const unit = 'pt';
      const size = 'A4';
      const orientation = 'landscape';
      const marginLeft = 40;
      const doc = new jsPDF(orientation, unit, size);

      doc.setFontSize(15);

      const pageWidth = doc.internal.pageSize.getWidth();

      const titleWidth =
        doc.getTextWidth(title) < pageWidth - marginLeft * 2
          ? doc.getTextWidth(title)
          : pageWidth - marginLeft * 2;

      const titleX = (pageWidth - titleWidth) / 2;

      doc.setTextColor(74, 74, 74);

      doc.text(title, titleX, 50);

      if (logo) {
        const imageWidth = 50;
        const imageHeight = 50;
        const imageX = marginLeft;
        const imageY = 15;
        doc.addImage(logo, 'PNG', imageX, imageY, imageWidth, imageHeight);
      }

      const headerStyles = {
        halign: 'center',
        fillColor: '#E1E5EA',
        textColor: '#1A202C',
        fontSize: 10,
        fontStyle: 'bold',
        padding: 5,
      };

      const bodyStyles = {
        textColor: '#4A5568',
        fontSize: 9,
        padding: 5,
      };

      const tableStyles = {
        margin: {
          top: 60,
          left: marginLeft,
        },
      };

      const styles = {
        headerStyles: headerStyles,
        bodyStyles: bodyStyles,
        styles: tableStyles,
        columnStyles: columnStyles,
        rowStyles: rowStyles,
        ...customStyles,
      };

      const content = {
        startY: 50,
        head: [headers],
        body: data,
        ...styles,
      };

      doc.autoTable(content);

      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages('{total}');
      }

      // Footer
      let str = 'Page ' + doc.internal.getNumberOfPages();

      if (typeof doc.putTotalPages === 'function') {
        str = str + ' of ' + '{total}';
      }

      const pageCount = doc.internal.getNumberOfPages();

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        let pageSize = doc.internal.pageSize;
        let pageWidth = pageSize.getWidth
          ? pageSize.getWidth()
          : pageSize.width;
        let pageHeight = pageSize.getHeight
          ? pageSize.getHeight()
          : pageSize.height;

        doc.setFontSize(10);
        doc.setTextColor(74, 74, 74);
        if (useI18n) {
          doc.text(
            `${t('Generated on')} ${formatDate(
              new Date()
            )} | ${t('Climate Finance')}`,
            marginLeft,
            pageHeight - 20
          );
          doc.text(
            str,
            pageWidth - marginLeft - 35,
            pageHeight - 20
          );
        } else {
          doc.text(
            `Generated on ${formatDate(new Date())} | Climate Finance`,
            marginLeft,
            pageHeight - 20
          );
          doc.text(
            str,
            pageWidth - marginLeft - 35,
            pageHeight - 20
          );
        }
      }

      const pdfBlob = doc.output('blob');

      saveAs(pdfBlob, `${fileName}.pdf`);
      setIsExporting(false);
    },
    [t]
  );

  const exportChartPDF = useCallback(
    async ({
      title,
      fileName,
      logo,
      chartRef,
      useI18n,
    }) => {
      setIsExporting(true);
      const unit = 'pt';
      const size = 'A4';
      const orientation = 'portrait';
      const marginLeft = 40;
      const doc = new jsPDF(orientation, unit, size);

      doc.setFontSize(15);

      const pageWidth = doc.internal.pageSize.getWidth();

      const titleWidth =
        doc.getTextWidth(title) < pageWidth - marginLeft * 2
          ? doc.getTextWidth(title)
          : pageWidth - marginLeft * 2;

      const titleX = (pageWidth - titleWidth) / 2;

      doc.setTextColor(74, 74, 74);

      doc.text(title, titleX, 50);

      if (logo) {
        const imageWidth = 50;
        const imageHeight = 50;
        const imageX = marginLeft;
        const imageY = 15;
        doc.addImage(logo, 'PNG', imageX, imageY, imageWidth, imageHeight);
      }

      const chartImageBase64 = chartRef.current.toBase64Image();

      const imageHeight = 300;
      const imageWidth = 450;
      const imageX = (pageWidth - imageWidth) / 2;
      const imageY = 70;

      doc.addImage(chartImageBase64, 'PNG', imageX, imageY, imageWidth, imageHeight);

      // Footer
      let str = 'Page ' + doc.internal.getNumberOfPages();

      if (typeof doc.putTotalPages === 'function') {
        str = str + ' of ' + '{total}';
      }

      const pageCount = doc.internal.getNumberOfPages();

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        let pageSize = doc.internal.pageSize;
        let pageWidth = pageSize.getWidth
          ? pageSize.getWidth()
          : pageSize.width;
        let pageHeight = pageSize.getHeight
          ? pageSize.getHeight()
          : pageSize.height;

        doc.setFontSize(10);
        doc.setTextColor(74, 74, 74);
        if (useI18n) {
          doc.text(
            `${t('Generated on')} ${formatDate(
              new Date()
            )} | ${t('Climate Finance')}`,
            marginLeft,
            pageHeight - 20
          );
          doc.text(
            str,
            pageWidth - marginLeft - 35,
            pageHeight - 20
          );
        } else {
          doc.text(
            `Generated on ${formatDate(new Date())} | Climate Finance`,
            marginLeft,
            pageHeight - 20
          );
          doc.text(
            str,
            pageWidth - marginLeft - 35,
            pageHeight - 20
          );
        }
      }

      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages('{total}');
      }

      const pdfBlob = doc.output('blob');

      saveAs(pdfBlob, `${fileName}.pdf`);
      setIsExporting(false);
    },
    [t]
  );

  return { exportPDF, exportChartPDF, isExporting };
};

export default usePDFExport;