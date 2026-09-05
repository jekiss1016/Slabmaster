import { MatrixColumn } from '../types/forms';

export interface MatrixRowData {
  id: string;
  [colId: string]: any;
}

/**
 * Calculates sum of numeric values for a specific matrix column across all rows
 */
export function calculateColumnSum(rows: MatrixRowData[], colId: string): number {
  if (!Array.isArray(rows) || rows.length === 0) return 0;
  return rows.reduce((total, row) => {
    const rawVal = row[colId];
    if (rawVal === undefined || rawVal === null || rawVal === '') return total;
    const num = parseFloat(String(rawVal).replace(/[^0-9.-]/g, ''));
    return total + (isNaN(num) ? 0 : num);
  }, 0);
}

/**
 * Generates initial matrix rows from preset names
 */
export function createDefaultMatrixRows(
  defaultRowNames: string[],
  columns: MatrixColumn[]
): MatrixRowData[] {
  const roomCol = columns[0]?.id || 'room';
  return defaultRowNames.map((name, idx) => {
    const row: MatrixRowData = { id: `row_${idx}_${Date.now()}` };
    row[roomCol] = name;
    columns.forEach((col) => {
      if (col.id !== roomCol) {
        row[col.id] = col.type === 'number' ? '' : (col.options?.[0] || '');
      }
    });
    return row;
  });
}
