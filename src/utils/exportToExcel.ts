import ExcelJS from 'exceljs';

export const exportToExcel = async (data: any[], fileName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Add headers
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);
  }

  // Add data rows
  data.forEach(item => {
    worksheet.addRow(Object.values(item));
  });

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    column.width = 15; // Set a default width
  });

  // Save the workbook
  await workbook.xlsx.writeFile(`${fileName}.xlsx`);
};