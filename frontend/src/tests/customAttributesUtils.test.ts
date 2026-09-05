import { describe, it, expect } from 'vitest';
import {
  validateCustomAttributeValue,
  formatCustomAttributeValue,
  getCustomFieldsForRegion
} from '../utils/customAttributesUtils';
import { CustomFieldDefinition } from '../types/customAttributes';

describe('Custom Attributes Utilities', () => {
  const sampleDef: CustomFieldDefinition = {
    id: 'test_curr',
    targetEntity: 'JOB',
    name: 'invoiceAmount',
    label: 'Invoice Amount',
    dataType: 'currency',
    category: 'Billing',
    isRequired: true,
    plantScope: 'ALL',
    displayOrder: 1
  };

  it('validates required fields correctly', () => {
    const emptyResult = validateCustomAttributeValue(sampleDef, '');
    expect(emptyResult.isValid).toBe(false);
    expect(emptyResult.error).toContain('is required');

    const validResult = validateCustomAttributeValue(sampleDef, '1450.50');
    expect(validResult.isValid).toBe(true);
  });

  it('validates and formats currency values', () => {
    expect(validateCustomAttributeValue(sampleDef, '$2,400.00').isValid).toBe(true);
    expect(validateCustomAttributeValue(sampleDef, 'invalid_number').isValid).toBe(false);

    expect(formatCustomAttributeValue(sampleDef, 2400)).toBe('$2,400.00');
    expect(formatCustomAttributeValue(sampleDef, '$2400')).toBe('$2,400.00');
  });

  it('validates select dropdown options', () => {
    const selectDef: CustomFieldDefinition = {
      id: 'test_select',
      targetEntity: 'JOB',
      name: 'edgeProfile',
      label: 'Edge Profile',
      dataType: 'select',
      category: 'Specs',
      options: ['Eased', 'Bullnose', 'Ogee'],
      isRequired: false,
      plantScope: 'ALL',
      displayOrder: 2
    };

    expect(validateCustomAttributeValue(selectDef, 'Eased').isValid).toBe(true);
    expect(validateCustomAttributeValue(selectDef, 'Chiseled').isValid).toBe(false);
  });

  it('filters definitions by plant scope correctly', () => {
    const definitions: CustomFieldDefinition[] = [
      { id: '1', targetEntity: 'JOB', name: 'f1', label: 'All Plant Field', dataType: 'text', category: 'General', isRequired: false, plantScope: 'ALL', displayOrder: 1 },
      { id: '2', targetEntity: 'JOB', name: 'f2', label: 'Atlanta Specific', dataType: 'text', category: 'General', isRequired: false, plantScope: 'ATL', displayOrder: 2 },
      { id: '3', targetEntity: 'JOB', name: 'f3', label: 'Phoenix Specific', dataType: 'text', category: 'General', isRequired: false, plantScope: 'PHX', displayOrder: 3 },
      { id: '4', targetEntity: 'ACCOUNT', name: 'f4', label: 'Account Field', dataType: 'text', category: 'General', isRequired: false, plantScope: 'ALL', displayOrder: 1 }
    ];

    const atlJobFields = getCustomFieldsForRegion(definitions, 'JOB', 'ATL');
    expect(atlJobFields).toHaveLength(2);
    expect(atlJobFields.map(f => f.id)).toEqual(['1', '2']);

    const phxJobFields = getCustomFieldsForRegion(definitions, 'JOB', 'PHX');
    expect(phxJobFields).toHaveLength(2);
    expect(phxJobFields.map(f => f.id)).toEqual(['1', '3']);
  });
});
