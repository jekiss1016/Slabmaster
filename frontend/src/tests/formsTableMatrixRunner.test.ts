import { describe, it, expect } from 'vitest';
import { DEFAULT_FORM_TEMPLATES } from '../defaultForms';
import { FormField, MatrixColumn } from '../types/forms';
import { calculateColumnSum, createDefaultMatrixRows } from '../utils/tableMatrixUtils';

describe('SAP Config Sheet & Table Matrix Integration', () => {
  const sapSheetTemplate = DEFAULT_FORM_TEMPLATES.find(t => t.id === 'ft_sap_config_sheet');

  it('includes the SAP Configuration Sheet template in default system form templates', () => {
    expect(sapSheetTemplate).toBeDefined();
    expect(sapSheetTemplate?.title).toContain('SAP / Builder Room Takeoff & Config Sheet');
  });

  it('verifies the SAP Config Sheet has a table_matrix field with required columns', () => {
    const matrixField = sapSheetTemplate?.fields.find(f => f.type === 'table_matrix') as FormField | undefined;
    expect(matrixField).toBeDefined();
    expect(matrixField?.matrixColumns).toBeDefined();

    const columnIds = matrixField!.matrixColumns!.map((c: MatrixColumn) => c.id);
    expect(columnIds).toContain('room');
    expect(columnIds).toContain('ctop_type');
    expect(columnIds).toContain('material');
    expect(columnIds).toContain('ctop_sqft');
    expect(columnIds).toContain('splash_sqft');
    expect(columnIds).toContain('sink_model');
    expect(columnIds).toContain('edge_profile');
  });

  it('correctly sums CTOP and Splash square footage across multiple room rows', () => {
    const sampleRows = [
      { id: 'r1', room: 'Kitchen Perimeter', ctop_sqft: 45.5, splash_sqft: 18.0 },
      { id: 'r2', room: 'Kitchen Island', ctop_sqft: 36.0, splash_sqft: 0 },
      { id: 'r3', room: 'Primary Bath Vanity', ctop_sqft: 14.5, splash_sqft: 6.5 }
    ];

    const totalCtop = calculateColumnSum(sampleRows, 'ctop_sqft');
    expect(totalCtop).toBe(96.0);

    const totalSplash = calculateColumnSum(sampleRows, 'splash_sqft');
    expect(totalSplash).toBe(24.5);
  });

  it('generates initialized rows from defaultMatrixRows configuration', () => {
    const matrixField = sapSheetTemplate?.fields.find(f => f.type === 'table_matrix') as FormField;
    const initialRows = createDefaultMatrixRows(matrixField.defaultMatrixRows || [], matrixField.matrixColumns || []);

    expect(initialRows.length).toBe(6);
    expect(initialRows[0].room).toBe('Kitchen Perimeter');
    expect(initialRows[1].room).toBe('Kitchen Island');
    expect(initialRows[2].room).toBe('Primary Bath');
  });
});
