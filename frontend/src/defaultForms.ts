import { FormTemplate, FormPacket } from './types/forms';

export const DEFAULT_FORM_TEMPLATES: FormTemplate[] = [
  {
    id: 'ft_qa_standard',
    title: 'Stone Countertop Field QA Inspection',
    description: 'Field quality assurance inspection for countertop alignment, seam fit, edge finish, and sink cutouts.',
    category: 'QA_INSPECTION',
    version: 1,
    createdAt: '2026-06-01',
    updatedAt: '2026-06-01',
    fields: [
      {
        id: 'f_qa_1',
        label: 'Overhang & Seam Compliance Check',
        type: 'checkbox',
        required: true,
        helpText: 'Confirm overhangs are 1.5\" standard and seams are smooth and tightly epoxied.'
      },
      {
        id: 'f_qa_2',
        label: 'Verified Installed Area',
        type: 'number_uom',
        required: true,
        uomOptions: ['SF', 'LF', 'EA', 'HR'],
        defaultUom: 'SF',
        placeholder: 'e.g. 54.5'
      },
      {
        id: 'f_qa_3',
        label: 'Edge Profile Verification',
        type: 'dropdown_single',
        required: true,
        options: ['Eased (Standard)', 'Full Bullnose', 'Demi Bullnose', '1/4\" Bevel', 'Ogee Edge', 'Mitered 2\" Apron'],
        defaultValue: 'Eased (Standard)'
      },
      {
        id: 'f_qa_4',
        label: 'Sink Cutout & Faucet Hole Fit',
        type: 'dropdown_single',
        required: true,
        options: ['Pass - Exact Fit', 'Minor Field Trim Required', 'Fail - Shop Remake Required'],
        defaultValue: 'Pass - Exact Fit'
      },
      {
        id: 'f_qa_5',
        label: 'QA Findings & Defect Punchout Notes',
        type: 'textarea',
        required: false,
        placeholder: 'Document any chip repairs, caulking touch-ups, or unlevel cabinets...'
      },
      {
        id: 'f_qa_6',
        label: 'Inspection Photo Documentation',
        type: 'photo',
        required: true,
        helpText: 'Attach at least one clear photo of completed stone installation and seam detail.'
      },
      {
        id: 'f_qa_7',
        label: 'QA Technician Digital Sign-Off',
        type: 'signature',
        required: true,
        helpText: 'Sign with finger or stylus to certify quality acceptance.'
      },
      {
        id: 'f_qa_8',
        label: 'Inspection Timestamp',
        type: 'datetime',
        required: true
      }
    ]
  },
  {
    id: 'ft_install_acceptance',
    title: 'Installation & Customer Acceptance Form',
    description: 'Installer completion checklist, site cleanliness verification, and builder acceptance sign-off.',
    category: 'INSTALLATION',
    version: 1,
    createdAt: '2026-06-01',
    updatedAt: '2026-06-01',
    fields: [
      {
        id: 'f_inst_1',
        label: 'Backsplash & Caulk Bead Applied',
        type: 'checkbox',
        required: true,
        helpText: 'Verify 4\" or full-height splash is sealed with color-matched 100% silicone.'
      },
      {
        id: 'f_inst_2',
        label: 'Linear Footage Backsplash',
        type: 'number_uom',
        required: true,
        uomOptions: ['LF', 'SF', 'EA'],
        defaultUom: 'LF',
        placeholder: 'e.g. 24'
      },
      {
        id: 'f_inst_3',
        label: 'Site Cleanliness & Trash Removal',
        type: 'dropdown_single',
        required: true,
        options: ['100% Clean (Swept & Hauled)', 'Builder Dumpster Used', 'Debris Remaining'],
        defaultValue: '100% Clean (Swept & Hauled)'
      },
      {
        id: 'f_inst_4',
        label: 'Punchout Items / Exceptions',
        type: 'textarea',
        required: false,
        placeholder: 'Note any missing plumbing fixtures, drywall repairs needed, etc.'
      },
      {
        id: 'f_inst_5',
        label: 'Completed Job Photos',
        type: 'photo',
        required: true
      },
      {
        id: 'f_inst_6',
        label: 'Superintendent / Customer Sign-Off',
        type: 'signature',
        required: true
      },
      {
        id: 'f_inst_7',
        label: 'Completion Date & Time',
        type: 'datetime',
        required: true
      }
    ]
  },
  {
    id: 'ft_template_laser',
    title: 'Digital Laser Template Verification',
    description: 'Laser measure verification form for cabinet levelness, wall straightness, and seam layout approval.',
    category: 'TEMPLATE',
    version: 1,
    createdAt: '2026-06-01',
    updatedAt: '2026-06-01',
    fields: [
      {
        id: 'f_tpl_1',
        label: 'Cabinet Base Level & Solid Subtop',
        type: 'dropdown_single',
        required: true,
        options: ['Level (< 1/8\" over 10ft)', 'Shimming Required by Builder', 'Out of Tolerance - Hold'],
        defaultValue: 'Level (< 1/8\" over 10ft)'
      },
      {
        id: 'f_tpl_2',
        label: 'Measured Slab Square Footage',
        type: 'number_uom',
        required: true,
        uomOptions: ['SF', 'LF', 'EA'],
        defaultUom: 'SF',
        placeholder: 'e.g. 62.8'
      },
      {
        id: 'f_tpl_3',
        label: 'Template DXF / LT55 CAD Capture Attached',
        type: 'checkbox',
        required: true
      },
      {
        id: 'f_tpl_4',
        label: 'Field Measure Photos',
        type: 'photo',
        required: true
      },
      {
        id: 'f_tpl_5',
        label: 'Templater Signature',
        type: 'signature',
        required: true
      }
    ]
  }
];

export const DEFAULT_FORM_PACKETS: FormPacket[] = [
  {
    id: 'pkt_residential_qa',
    name: 'Comprehensive Field QA Inspection Packet',
    description: 'Standard QA inspection packet containing digital quality inspection form and stone fabrication tolerance guidelines.',
    targetScope: 'HYBRID',
    applicableActivityTypes: ['QA Inspection', 'QUALITY WALK', 'Pre-Install QA'],
    formTemplates: [DEFAULT_FORM_TEMPLATES[0]],
    staticAttachments: [
      {
        id: 'att_qa_spec',
        name: 'MIA_Stone_Fabrication_Tolerance_Spec.pdf',
        type: 'PDF',
        fileUrl: '#spec_tolerance_guideline',
        fileSize: '1.2 MB'
      }
    ],
    createdAt: '2026-06-01',
    updatedAt: '2026-06-01'
  },
  {
    id: 'pkt_install_turnover',
    name: 'Standard Residential Installation & Turnover Packet',
    description: 'Full installation packet with customer sign-off checklist and standard builder CAD layouts.',
    targetScope: 'HYBRID',
    applicableActivityTypes: ['Stone Install', 'Final Install', 'Backsplash Install'],
    formTemplates: [DEFAULT_FORM_TEMPLATES[1]],
    staticAttachments: [
      {
        id: 'att_cad_drawings',
        name: 'Master_Kitchen_Island_CAD_Detail.pdf',
        type: 'CAD',
        fileUrl: '#island_cad_spec',
        fileSize: '3.4 MB'
      }
    ],
    createdAt: '2026-06-01',
    updatedAt: '2026-06-01'
  },
  {
    id: 'pkt_laser_measure',
    name: 'Digital Laser Template & CAD Packet',
    description: 'Pre-production laser measure and templater verification sheet.',
    targetScope: 'ACTIVITY',
    applicableActivityTypes: ['Template', 'Laser Measure', 'CAD - ORIGINAL'],
    formTemplates: [DEFAULT_FORM_TEMPLATES[2]],
    staticAttachments: [],
    createdAt: '2026-06-01',
    updatedAt: '2026-06-01'
  }
];