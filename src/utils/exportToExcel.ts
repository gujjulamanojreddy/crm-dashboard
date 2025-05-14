import ExcelJS from 'exceljs';

export const exportToExcel = async (data: any[], fileName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Add headers
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    const headerRow = worksheet.addRow(headers);
    
    // Style the header row
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    });
  }

  // Add data rows
  data.forEach(item => {
    const row = worksheet.addRow(Object.values(item));
    
    // Apply light styling to data rows
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
      };
    });
  });

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    const maxLength = Math.max(
      column.header?.toString().length || 10,
      ...data.map(row => {
        const value = row[column.key as keyof typeof row];
        return value ? value.toString().length : 0;
      })
    );
    column.width = Math.min(Math.max(maxLength + 2, 10), 30); // Min 10, max 30
  });

  // Add timestamp to the filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const fullFileName = `${fileName}_${timestamp}`;
  
  try {
    // For browser environment, generate a download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fullFileName}.xlsx`;
    a.click();
    
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};