import { CustomFieldDefinition, CustomAttributeValues } from '../types/customAttributes';

/**
 * Validates a single custom attribute value against its field definition
 */
export function validateCustomAttributeValue(
  def: CustomFieldDefinition,
  val: any
): { isValid: boolean; error?: string } {
  if (def.isRequired && (val === undefined || val === null || val === '')) {
    return { isValid: false, error: `${def.label} is required.` };
  }

  if (val === undefined || val === null || val === '') {
    return { isValid: true };
  }

  switch (def.dataType) {
    case 'number': {
      const num = Number(val);
      if (isNaN(num)) return { isValid: false, error: `${def.label} must be a valid number.` };
      return { isValid: true };
    }
    case 'currency': {
      const cleanVal = String(val).replace(/[$,]/g, '').trim();
      const num = Number(cleanVal);
      if (isNaN(num)) return { isValid: false, error: `${def.label} must be a valid currency amount.` };
      return { isValid: true };
    }
    case 'date': {
      const parsed = Date.parse(String(val));
      if (isNaN(parsed)) return { isValid: false, error: `${def.label} must be a valid date.` };
      return { isValid: true };
    }
    case 'select': {
      if (def.options && !def.options.includes(val)) {
        return { isValid: false, error: `${val} is not a valid option for ${def.label}.` };
      }
      return { isValid: true };
    }
    case 'url': {
      try {
        new URL(val);
        return { isValid: true };
      } catch {
        return { isValid: false, error: `${def.label} must be a valid URL.` };
      }
    }
    case 'boolean': {
      return { isValid: typeof val === 'boolean' };
    }
    default:
      return { isValid: true };
  }
}

/**
 * Formats a custom attribute value for display
 */
export function formatCustomAttributeValue(
  def: CustomFieldDefinition,
  val: any
): string {
  if (val === undefined || val === null || val === '') return '—';

  switch (def.dataType) {
    case 'currency': {
      const num = Number(String(val).replace(/[$,]/g, '').trim());
      if (isNaN(num)) return String(val);
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
    }
    case 'boolean':
      return val ? 'Yes' : 'No';
    case 'date': {
      const d = new Date(val);
      if (isNaN(d.getTime())) return String(val);
      return d.toLocaleDateString();
    }
    default:
      return String(val);
  }
}

/**
 * Filters field definitions by plant/region scope
 */
export function getCustomFieldsForRegion(
  definitions: CustomFieldDefinition[],
  targetEntity: 'JOB' | 'ACCOUNT' | 'ACTIVITY' | 'SLAB',
  regionCode?: string
): CustomFieldDefinition[] {
  return definitions
    .filter((d) => d.targetEntity === targetEntity)
    .filter((d) => d.plantScope === 'ALL' || (regionCode && d.plantScope === regionCode))
    .sort((a, b) => a.displayOrder - b.displayOrder);
}
