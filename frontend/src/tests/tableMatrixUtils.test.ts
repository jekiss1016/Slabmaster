import { describe, it, expect } from 'vitest';
import { calculateColumnSum, createDefaultMatrixRows, MatrixRowData } from '../utils/tableMatrixUtils';
import { MatrixColumn } from '../types/forms';

describe('Table Matrix Sub-Grid Utilities', () => {
  const sampleColumns: MatrixColumn[] = [
    { id: 'room', label: 'Room', type: 'text' },
    { id: 'ctop_type', label: 'Ctop Type', type: 'select', options: ['Quartz', 'Granite'] },
    { id: 'ctop_sqft', label: 'CTOP SQFT', type: 'number', isSummable: true },
    { id: 'splash_sqft', label: 'Splash SQFT', type: 'number', isSummable: true }
  ];

  it('calculates column sum correctly across multiple rows', () => {
    const rows: MatrixRowData[] = [
      { id: '1', room: 'Kitchen', ctop_sqft: 45.5, splash_sqft: 12 },
      { id: '2', room: 'Island', ctop_sqft: 32.25, splash_sqft: 0 },
      { id: '3', room: 'Master Bath', ctop_sqft: '18.75', splash_sqft: '6.5' },
      { id: '4', room: 'Powder Room', ctop_sqft: '', splash_sqft: undefined }
    ];

    const totalCtop = calculateColumnSum(rows, 'ctop_sqft');
    expect(totalCtop).toBe(96.5);

    const totalSplash = calculateColumnSum(rows, 'splash_sqft');
    expect(totalSplash).toBe(18.5);
  });

  it('returns 0 for empty or invalid rows', () => {
    expect(calculateColumnSum([], 'ctop_sqft')).toBe(0);
    // @ts-ignore
    expect(calculateColumnSum(null, 'ctop_sqft')).toBe(0);
  });

  it('creates initial default rows based on presets', () => {
    const presetRooms = ['Kitchen', 'Island', 'Master Bath'];
    const rows = createDefaultMatrixRows(presetRooms, sampleColumns);

    expect(rows).toHaveLength(3);
    expect(rows[0].room).toBe('Kitchen');
    expect(rows[1].room).toBe('Island');
    expect(rows[2].room).toBe('Master Bath');
    expect(rows[0].ctop_type).toBe('Quartz');
  });
});
