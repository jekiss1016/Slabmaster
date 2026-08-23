/**
 * SlabMaster Custom Form Builder & Packet Management Types
 */

export type FormFieldType =
  | 'text'              // Short Text
  | 'textarea'          // Long Text / Notes
  | 'number_uom'        // Number + Unit of Measure (SF, LF, EA, HR)
  | 'dropdown_single'   // Single Select Dropdown
  | 'dropdown_multi'    // Multi-Select Dropdown
  | 'checkbox'          // Checkbox Toggle
  | 'photo'             // Photo Upload / Camera Capture
  | 'signature'         // Digital Touch Signature
  | 'datetime';         // Date & Time Picker

export type UOMType = 'SF' | 'LF' | 'EA' | 'HR';

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  uomOptions?: UOMType[]; // Applicable for number_uom
  defaultUom?: UOMType;
  options?: string[];     // Applicable for dropdown_single / dropdown_multi
  defaultValue?: any;
}

export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  category: 'QA_INSPECTION' | 'INSTALLATION' | 'TEMPLATE' | 'SAFETY' | 'PUNCHOUT' | 'GENERAL';
  version: number;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface StaticAttachment {
  id: string;
  name: string;
  type: 'PDF' | 'CAD' | 'IMAGE';
  fileUrl: string; // Base64 data string or asset URL
  fileSize?: string;
}

export interface FormPacket {
  id: string;
  name: string;
  description: string;
  targetScope: 'JOB' | 'ACTIVITY' | 'HYBRID';
  applicableActivityTypes?: string[]; // e.g. ['QA Inspection', 'Install']
  formTemplates: FormTemplate[];      // Bundled form templates
  staticAttachments: StaticAttachment[]; // CAD drawings, spec sheets, guidelines
  createdAt: string;
  updatedAt: string;
}

export type FormStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface JobPacketAssignment {
  id: string;
  packetId: string;
  packetName: string;
  jobId: string;
  activityId?: string;
  activityName?: string;
  assignedBy: string;
  assignedAt: string;
  isLocked: boolean; // Immutable once assigned
}