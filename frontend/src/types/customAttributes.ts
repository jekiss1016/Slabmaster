/**
 * SlabMaster Dynamic Custom Attributes Engine
 * Allows runtime definition and storage of custom attributes across Jobs, Accounts, Activities, and Slabs.
 */

export type CustomAttributeTarget = 'JOB' | 'ACCOUNT' | 'ACTIVITY' | 'SLAB';

export type CustomAttributeType =
  | 'text'
  | 'number'
  | 'currency'
  | 'date'
  | 'select'
  | 'boolean'
  | 'url';

export interface CustomFieldDefinition {
  id: string;
  targetEntity: CustomAttributeTarget;
  name: string;
  label: string;
  dataType: CustomAttributeType;
  category: string;
  options?: string[]; // For 'select' type
  defaultValue?: any;
  isRequired: boolean;
  plantScope: string; // 'ALL' or specific regionCode e.g. 'ATL', 'PHX', 'TUC'
  description?: string;
  displayOrder: number;
}

export type CustomAttributeValues = Record<string, any>; // key is field definition id or name

export const DEFAULT_CUSTOM_FIELDS: CustomFieldDefinition[] = [
  {
    id: 'cf_project_coordinator',
    targetEntity: 'JOB',
    name: 'projectCoordinator',
    label: 'Project Coordinator',
    dataType: 'text',
    category: 'Operational Contacts',
    isRequired: false,
    plantScope: 'ALL',
    description: 'Internal project coordinator overseeing delivery milestones',
    displayOrder: 1,
  },
  {
    id: 'cf_invoice_amount',
    targetEntity: 'JOB',
    name: 'invoiceAmount',
    label: 'Invoice Amount',
    dataType: 'currency',
    category: 'Billing & Commercial',
    isRequired: false,
    plantScope: 'ALL',
    description: 'Total billed invoice amount synchronized with ERP',
    displayOrder: 2,
  },
  {
    id: 'cf_fab_change_reason',
    targetEntity: 'JOB',
    name: 'fabChangeReason',
    label: 'Fab Change Reason',
    dataType: 'select',
    category: 'Fabrication Governance',
    options: [
      'None',
      'Builder Plan Revision',
      'Field Seam Relocation',
      'Damaged Slab On-Site',
      'Sink Model Swap',
      'Material Defect',
      'Superintendent Delay'
    ],
    defaultValue: 'None',
    isRequired: false,
    plantScope: 'ALL',
    description: 'Root cause for any shop fabrication rework or re-trip',
    displayOrder: 3,
  },
  {
    id: 'cf_sink_model',
    targetEntity: 'JOB',
    name: 'sinkModel',
    label: 'Sink Model / Cutout Type',
    dataType: 'text',
    category: 'Fabrication Specifications',
    isRequired: false,
    plantScope: 'ALL',
    description: 'Under-mount, top-mount or apron farm sink specification',
    displayOrder: 4,
  },
  {
    id: 'cf_edge_profile',
    targetEntity: 'JOB',
    name: 'edgeProfile',
    label: 'Edge Profile',
    dataType: 'select',
    category: 'Fabrication Specifications',
    options: [
      'Eased / Flat Polish',
      'Bevel 1/4"',
      'Bullnose Full',
      'Demi Bullnose',
      'Ogee',
      'Mitered 2"',
      'Mitered Waterfall 3"'
    ],
    defaultValue: 'Eased / Flat Polish',
    isRequired: false,
    plantScope: 'ALL',
    description: 'Primary countertop edge profile requested by builder',
    displayOrder: 5,
  },
  {
    id: 'cf_tear_out_required',
    targetEntity: 'JOB',
    name: 'tearOutRequired',
    label: 'Tear-Out / Demo Required',
    dataType: 'boolean',
    category: 'Field Requirements',
    defaultValue: false,
    isRequired: false,
    plantScope: 'ALL',
    description: 'Flags whether existing countertops require pre-demo prior to template',
    displayOrder: 6,
  },
  {
    id: 'cf_slab_serial_no',
    targetEntity: 'SLAB',
    name: 'serialNumber',
    label: 'Slab Barcode / Serial Number',
    dataType: 'text',
    category: 'Warehouse & Lot',
    isRequired: true,
    plantScope: 'ALL',
    description: 'Unique manufacturer or warehouse barcode serial identifier',
    displayOrder: 1,
  },
  {
    id: 'cf_slab_bundle_id',
    targetEntity: 'SLAB',
    name: 'bundleId',
    label: 'Bundle / Block ID',
    dataType: 'text',
    category: 'Warehouse & Lot',
    isRequired: false,
    plantScope: 'ALL',
    description: 'Quarry block or bundle batch number for bookmatch consistency',
    displayOrder: 2,
  },
];
