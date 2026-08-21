import React, { useState, ChangeEvent } from 'react';
import {
  Search,
  Eye,
  Sliders,
  Save,
  Plus,
  Calendar as CalendarIcon,
  BarChart3,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  Building2,
  AlertCircle,
  X,
  Palette,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Upload,
  CheckCircle2,
  Filter,
  Check,
  KeyRound,
  Users,
  Shield,
  FileCheck,
  Paperclip,
  Clock,
  Briefcase,
  Layers,
  Home,
  UserPlus,
  ExternalLink,
  Edit3,
  CalendarDays,
  FileText,
  BookOpen,
  ArrowLeft,
  Map as MapIcon,
  CheckSquare,
  PlusCircle,
  History,
  Tag,
  FolderTree,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  ChevronUp,
  Download,
  DollarSign,
  TrendingUp,
  Wrench,
  Monitor,
  Lock,
  Globe,
  Smartphone,
  ShieldAlert,
  UserCheck,
  Image as ImageIcon,
  Trash2,
  Archive,
  ArchiveRestore,
  AlertTriangle,
  Truck
} from 'lucide-react';

export const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
];

export const formatZipMask = (val: string): string => {
  const digits = val.replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'checkbox' | 'pass_fail' | 'signature' | 'select';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface BuilderFormTemplate {
  id: string;
  accountId?: string;
  accountName?: string;
  formName: string;
  category: string;
  isRequiredForCompletion: boolean;
  fields: FormField[];
}

export interface DependencyShiftPlan {
  isOpen: boolean;
  sourceJob: JobRow | null;
  triggerPhase: 'template' | 'fab' | 'install';
  newDate: string;
  affectedActivities: Array<{
    phase: string;
    activityName: string;
    currentDate: string;
    proposedDate: string;
    workdayOffset: number;
  }>;
  targetInstallDate?: string;
  isDeadlineExceeded: boolean;
  daysLate: number;
}

export interface JobIssueItem {
  id: string;
  jobId: string;
  jobName: string;
  lotNumber: string;
  category: string;
  description: string;
  status: 'Open' | 'Resolved';
  loggedAt: string;
  resolvedAt?: string;
  hasWarrantyOrder?: boolean;
}

interface JobActivityRow {
  id: string;
  activityName: string;
  phase: string;
  status: 'Auto-Schedule' | 'CALCULATED' | 'Confirmed' | 'Tentative' | 'Complete' | 'In Progress';
  startDate: string;
  schedTime?: string;
  duration?: string;
  assignedTo?: string;
  notes?: string;
  requiredFormId?: string;
}

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

interface JobRow {
  id: string;
  jobName: string;
  jobCategory: 'INITIAL_INSTALL' | 'ADD_ON' | 'REWORK_WARRANTY' | 'CUSTOMER_SERVICE';
  accountId: string;
  accountName: string;
  accountCode: string;
  communityId: string;
  communityName: string;
  regionId?: string;
  regionName?: string;
  lotId?: string;
  lotNumber: string;
  streetAddress: string;
  cityStateZip: string;
  elevationPlan?: string;
  projectNumber?: string;
  salesOrderNumber?: string;
  builderPhase?: string;
  planNumber?: string;
  fieldSuper?: string;
  fieldManager?: string;
  accountExecutive?: string;
  accountManager?: string;
  designer?: string;
  jobNotes?: string;
  targetInstallDate?: string;
  templateDate: { date: string; status: 'auto' | 'calc' | 'conf' | 'tent' | 'none' };
  fabDate: { date: string; status: 'auto' | 'calc' | 'conf' | 'tent' | 'none' };
  installDate: { date: string; status: 'auto' | 'calc' | 'conf' | 'tent' | 'none' };
  salesperson: string;
  jobIssues?: string;
  hasOpenIssue?: boolean;
  externalId?: string;
  status: 'Draft' | 'Active' | 'On Hold' | 'Complete' | 'Cancelled';
  isArchived: boolean;
  assignedCrew?: string;
  activities: JobActivityRow[];
  files: AttachedFile[];
  materialOrdered: boolean;
  materialETA: string;
  materialReceived: boolean;
  materialReceivedOn: string;
  sinksOrdered: boolean;
  sinksETA: string;
  sinksReceived: boolean;
  sinksReceivedOn: string;
  purchasingNotes: string;
  installerNotesText: string;
}

interface LotRow {
  id: string;
  communityId: string;
  lotNumber: string;
  streetAddress: string;
  planType: string;
  isArchived: boolean;
}

interface CommunityRow {
  id: string;
  accountId: string;
  name: string;
  cityState: string;
  superintendent: string;
  lots: LotRow[];
  isArchived: boolean;
}

interface AccountRow {
  id: string;
  name: string;
  code: string;
  billingAddress: string;
  phone: string;
  primaryContact: string;
  email: string;
  externalId?: string;
  communities: CommunityRow[];
  isArchived: boolean;
}

interface ChangeLogEntry {
  id: string;
  timestamp: string;
  changedBy: string;
  summary: string;
  diffs: { field: string; from: string; to: string }[];
}

export default function App() {
  // Navigation & Theme State (Accounts is now positioned ABOVE Jobs!)
  const [activeNav, setActiveNav] = useState<'accounts' | 'account_detail' | 'community_detail' | 'jobs' | 'job_detail' | 'change_log' | 'calendar' | 'reports' | 'forms' | 'settings' | 'help'>('accounts');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [selectedRegion, setSelectedRegion] = useState('Location 1');
  const [searchCategory, setSearchCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Role Simulator (RBAC)
  const [activeUserRole, setActiveUserRole] = useState<'SUBSCRIBER_ADMIN' | 'INTERNAL_OFFICE_USER' | 'INTERNAL_ESTIMATOR' | 'EXTERNAL_CREW_ADMIN' | 'EXTERNAL_FIELD_INSTALLER' | 'EXTERNAL_SUBCONTRACTOR' | 'SYSTEM_ADMIN'>('SUBSCRIBER_ADMIN');
  const [activeAssigneeName, setActiveAssigneeName] = useState('Apex Install Crew A');

  // Subscriber Custom Branding State
  const [subscriberName, setSubscriberName] = useState('GraniteCraft Fabrication Inc.');
  const [logoBase64, setLogoBase64] = useState<string>('');
  const [brandColor, setBrandColor] = useState('#2563eb');

  // Toolbar Action Modals State
  const [activeModal, setActiveModal] = useState<'none' | 'views' | 'customize' | 'save_view' | 'create'>('none');
  const [activeView, setActiveView] = useState('Standard View');
  const [accountView, setAccountView] = useState('All Active Accounts');
  const [filters, setFilters] = useState<string[]>(['Job Status Is Active', 'Unscheduled']);
  
  // Custom View Projections (Columns Visibility)
  const [visibleColumns, setVisibleColumns] = useState({
    jobName: true,
    account: true,
    community: true,
    templateDate: true,
    fabDate: true,
    installDate: true,
    salesperson: true,
    issues: true,
  });
  const [compactDensity, setCompactDensity] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [savedViews, setSavedViews] = useState(['Standard View', 'Unscheduled Jobs View', 'Warranty Rework View', 'Multi-Region Overview']);
  
  // Selected Entity Records for Full Detail Screens
  const [selectedAccount, setSelectedAccount] = useState<AccountRow | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityRow | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobRow | null>(null);
  const [jobDetailOriginNav, setJobDetailOriginNav] = useState<'jobs' | 'calendar' | 'accounts' | 'community_detail'>('jobs');
  const [phaseFilter, setPhaseFilter] = useState<'ALL' | 'STONE' | 'CABINETRY'>('ALL');

  // Form Accordions State
  const [openForms, setOpenForms] = useState({
    jobSummary: true,
    installerNotes: true,
    purchasingInfo: true,
    sinkPickTicket: false,
    installPickTicket: false,
    dynamicForm: true,
  });

  // Builder Form Packets Tab States
  const [activeFormBuilder, setActiveFormBuilder] = useState<'toll' | 'lennar'>('toll');
  const [formSuperintendent, setFormSuperintendent] = useState('Mark Stevens');
  const [formEdgeProfile, setFormEdgeProfile] = useState('Eased 1.5 inch');
  const [formSinkCutoutVerified, setFormSinkCutoutVerified] = useState(true);
  const [formInstallerNotes, setFormInstallerNotes] = useState('All stone seams joined tight with color-matched epoxy. Sub-top level verified.');
  const [formCustomerSignature, setFormCustomerSignature] = useState('Mark Stevens (Site Super)');
  const [formSaveSuccess, setFormSaveSuccess] = useState(false);

  // Reports Module State
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState('Installed Sq Ft by Month (Area-Details Form)');

  // Date Editing Modal State
  const [editingDateJob, setEditingDateJob] = useState<JobRow | null>(null);
  const [editTemplateDate, setEditTemplateDate] = useState('');
  const [editTemplateStatus, setEditTemplateStatus] = useState<'auto' | 'calc' | 'conf' | 'tent' | 'none'>('conf');
  const [editFabDate, setEditFabDate] = useState('');
  const [editFabStatus, setEditFabStatus] = useState<'auto' | 'calc' | 'conf' | 'tent' | 'none'>('conf');
  const [editInstallDate, setEditInstallDate] = useState('');
  const [editInstallStatus, setEditInstallStatus] = useState<'auto' | 'calc' | 'conf' | 'tent' | 'none'>('conf');

  // Auto-Scheduling Dependency Shift Plan & Confirmation Modal
  const [dependencyShiftPlan, setDependencyShiftPlan] = useState<DependencyShiftPlan>({
    isOpen: false,
    sourceJob: null,
    triggerPhase: 'template',
    newDate: '',
    affectedActivities: [],
    isDeadlineExceeded: false,
    daysLate: 0,
  });

  // Form Completion Hard-Block Validation Modal
  const [formValidationModal, setFormValidationModal] = useState<{
    isOpen: boolean;
    job: JobRow | null;
    activity: JobActivityRow | null;
    missingFields: string[];
    formTemplate: BuilderFormTemplate | null;
  }>({
    isOpen: false,
    job: null,
    activity: null,
    missingFields: [],
    formTemplate: null,
  });

  // Print Job Packet Modal State
  const [printJobPacketJob, setPrintJobPacketJob] = useState<JobRow | null>(null);

  // Calendar State: Drag-and-Drop & Custom Workdays / Overtime
  const [calendarViewMode, setCalendarViewMode] = useState<'grid' | 'assignees'>('grid');
  const [draggedActivity, setDraggedActivity] = useState<{
    jobId: string;
    activityId: string;
    activityName: string;
    currentDate: string;
    phase: string;
  } | null>(null);

  const [activeWorkDays, setActiveWorkDays] = useState<Record<string, boolean>>({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: false,
    Sun: false,
  });
  const [customWorkDays, setCustomWorkDays] = useState<string[]>(['2026-07-25', '2026-08-01']);

  // Dynamic Builder Form Templates State
  const [builderFormTemplates, setBuilderFormTemplates] = useState<BuilderFormTemplate[]>([
    {
      id: 'form_toll_std',
      accountId: 'acc2',
      accountName: 'TOLL BROTHERS INC',
      formName: 'Toll Brothers Sign-Off & Inspection Certificate',
      category: 'STONE_INSTALL',
      isRequiredForCompletion: true,
      fields: [
        { id: 'f_super', label: 'Superintendent on Site', type: 'text', required: true, placeholder: 'e.g. John Miller' },
        { id: 'f_sink_ok', label: 'Sink Cutout & Faucet Hole Dimensions Verified On-Site', type: 'checkbox', required: true },
        { id: 'f_edge', label: 'Edge Profile Quality Confirmation', type: 'select', required: true, options: ['Eased 1.5 inch', 'Bevel 45 deg', 'Full Bullnose', 'Ogee Premium'] },
        { id: 'f_seams_ok', label: 'Seam Placement & Color Match Inspected', type: 'pass_fail', required: true },
        { id: 'f_notes', label: 'Field Installer & Quality Notes', type: 'textarea', required: false, placeholder: 'Enter any lot specific notes...' },
        { id: 'f_sig', label: 'Customer / Superintendent Sign-off Signature', type: 'signature', required: true, placeholder: 'Type full name to digitally sign' },
      ],
    },
    {
      id: 'form_perry_std',
      accountId: 'acc1',
      accountName: 'PERRY HOMES OF FLORIDA',
      formName: 'Perry Homes Pre-Install & Countertop Sign-off',
      category: 'STONE_INSTALL',
      isRequiredForCompletion: true,
      fields: [
        { id: 'f_super', label: 'Site Superintendent Name', type: 'text', required: true, placeholder: 'e.g. Brittany Googe' },
        { id: 'f_cabinets_level', label: 'Cabinet Level & Support Brackets Checked', type: 'pass_fail', required: true },
        { id: 'f_sink_ok', label: 'Undermount Sink Cutout Sealed & Fastened', type: 'checkbox', required: true },
        { id: 'f_sig', label: 'Site Super Digital Signature', type: 'signature', required: true, placeholder: 'Type name to sign' },
      ],
    },
  ]);

  // Form Submissions Record: key = `${jobId}_${formTemplateId}`
  const [formSubmissions, setFormSubmissions] = useState<Record<string, Record<string, any>>>({
    '1_form_perry_std': {
      f_super: 'Brittany Googe',
      f_cabinets_level: 'PASS',
      f_sink_ok: true,
      f_sig: 'Brittany Googe (Perry Homes)',
      isSigned: true,
      submittedAt: '2026-07-24 14:30',
    },
  });

  // Master Settings Hub State
  const [settingsCategory, setSettingsCategory] = useState<'billing' | 'calendar' | 'job' | 'shop' | 'system' | 'users' | 'branding' | 'regions'>('regions');
  const [usersSubSection, setUsersSubSection] = useState<'External Roles' | 'External Users' | 'Roles' | 'Users'>('External Users');
  const [systemSubSection, setSystemSubSection] = useState<'Login Locations' | 'Page Styles' | 'Security' | 'Settings'>('Security');
  const [shopSubSection, setShopSubSection] = useState<'Settings' | 'Users' | 'Views'>('Settings');

  // Regions & Operating Facilities State with Dedicated Address Fields
  const [regionsList, setRegionsList] = useState<Array<{
    id: string;
    name: string;
    code: string;
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    address: string;
    timezone: string;
    isDefault: boolean;
    status: 'ACTIVE' | 'SHUTDOWN';
    activeJobsCount: number;
  }>>([
    {
      id: 'reg1',
      name: 'Location 1',
      code: 'LOC-1',
      streetAddress: '2400 W Broadway Rd, Suite 100',
      city: 'Phoenix',
      state: 'AZ',
      zip: '85041',
      address: '2400 W Broadway Rd, Suite 100, Phoenix, AZ 85041',
      timezone: 'America/Phoenix (MST)',
      isDefault: true,
      status: 'ACTIVE',
      activeJobsCount: 4,
    },
    {
      id: 'reg2',
      name: 'Location 2',
      code: 'LOC-2',
      streetAddress: '6100 E Broadway Blvd',
      city: 'Tucson',
      state: 'AZ',
      zip: '85711',
      address: '6100 E Broadway Blvd, Tucson, AZ 85711',
      timezone: 'America/Phoenix (MST)',
      isDefault: false,
      status: 'ACTIVE',
      activeJobsCount: 1,
    },
    {
      id: 'reg3',
      name: 'Location 3 (Denver Hub)',
      code: 'LOC-3',
      streetAddress: '10200 E 56th Ave',
      city: 'Denver',
      state: 'CO',
      zip: '80238',
      address: '10200 E 56th Ave, Denver, CO 80238',
      timezone: 'America/Denver (MDT)',
      isDefault: false,
      status: 'ACTIVE',
      activeJobsCount: 1,
    },
    {
      id: 'reg4',
      name: 'Tampa Plant (Shutdown)',
      code: 'TPA',
      streetAddress: '4900 W Cypress St',
      city: 'Tampa',
      state: 'FL',
      zip: '33607',
      address: '4900 W Cypress St, Tampa, FL 33607',
      timezone: 'America/New_York (EST)',
      isDefault: false,
      status: 'SHUTDOWN',
      activeJobsCount: 0,
    },
  ]);

  // Add & Edit Region State with dedicated fields
  const [newRegionName, setNewRegionName] = useState('');
  const [newRegionCode, setNewRegionCode] = useState('');
  const [newRegionStreet, setNewRegionStreet] = useState('');
  const [newRegionCity, setNewRegionCity] = useState('');
  const [newRegionState, setNewRegionState] = useState('AZ');
  const [newRegionZip, setNewRegionZip] = useState('');
  const [newRegionTimezone, setNewRegionTimezone] = useState('America/Phoenix (MST)');
  const [regionAddedSuccess, setRegionAddedSuccess] = useState(false);

  const [editingRegion, setEditingRegion] = useState<null | {
    id: string;
    name: string;
    code: string;
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    address: string;
    timezone: string;
  }>(null);

  // Job Issues & Punch List State
  const [jobIssuesList, setJobIssuesList] = useState<JobIssueItem[]>([
    {
      id: 'issue_1',
      jobId: '2',
      jobName: 'P2HSPN_001079 (Lot 43 - Toll Brothers)',
      lotNumber: '001079',
      category: 'Seam Adjustment & Chip Repair',
      description: 'Minor 2mm chip detected near cooktop cutout on island during final walk.',
      status: 'Open',
      loggedAt: '2026-07-24 10:15',
      hasWarrantyOrder: false,
    },
  ]);

  // Hierarchy Data: Accounts, Communities, Lots
  const [accountsData, setAccountsData] = useState<AccountRow[]>([
    {
      id: 'acc1',
      name: 'PERRY HOMES OF FLORIDA LLC - 129495',
      code: 'PERRY-FL',
      billingAddress: '4900 W Cypress St, Tampa, FL 33607',
      phone: '(813) 555-0192',
      primaryContact: 'Brittany Googe',
      email: 'bgooge@perryhomes.com',
      externalId: 'ERP-ACC-129495',
      isArchived: false,
      communities: [
        {
          id: 'com1',
          accountId: 'acc1',
          name: 'STAR FARMS LWR 90\'S',
          cityState: 'Lakewood Ranch, FL',
          superintendent: 'Mark Stevens',
          isArchived: false,
          lots: [
            { id: 'lot1', communityId: 'com1', lotNumber: '001078', streetAddress: '3839 BUTTE TRAIL', planType: 'Plan B - Craftsman', isArchived: false },
            { id: 'lot2', communityId: 'com1', lotNumber: '001079', streetAddress: '3843 BUTTE TRAIL', planType: 'Plan C - Tuscan', isArchived: false },
          ]
        },
        {
          id: 'com2',
          accountId: 'acc1',
          name: 'Oakridge Estates',
          cityState: 'Orlando, FL',
          superintendent: 'Jackie Horn',
          isArchived: false,
          lots: [
            { id: 'lot3', communityId: 'com2', lotNumber: 'Lot 15', streetAddress: '108 Oakridge Dr', planType: 'Plan A - Modern', isArchived: false },
          ]
        }
      ]
    },
    {
      id: 'acc2',
      name: 'TOLL BROTHERS INC - LV - 105870',
      code: 'TOLL-LV',
      billingAddress: '10505 Discovery Dr, Las Vegas, NV 89135',
      phone: '(702) 555-4819',
      primaryContact: 'Michael Ross',
      email: 'mross@tollbrothers.com',
      externalId: 'ERP-ACC-105870',
      isArchived: false,
      communities: [
        {
          id: 'com3',
          accountId: 'acc2',
          name: 'Red Rock Canyon',
          cityState: 'Las Vegas, NV',
          superintendent: 'Dave Vance',
          isArchived: false,
          lots: [
            { id: 'lot4', communityId: 'com3', lotNumber: 'Lot 104', streetAddress: '104 Red Rock Pass', planType: 'Plan D - Estate', isArchived: false },
          ]
        }
      ]
    },
    {
      id: 'acc3',
      name: 'CENTURY COMMUNITIES - FLORIDA - 127263',
      code: 'CENTURY-FL',
      billingAddress: '200 Central Ave, St. Petersburg, FL 33701',
      phone: '(727) 555-8812',
      primaryContact: 'Sarah Jenkins',
      email: 'sjenkins@centurycommunities.com',
      externalId: 'ERP-ACC-127263',
      isArchived: false,
      communities: [
        {
          id: 'com4',
          accountId: 'acc3',
          name: 'Sunset Ridge',
          cityState: 'Sarasota, FL',
          superintendent: 'Tom Bradley',
          isArchived: false,
          lots: [
            { id: 'lot5', communityId: 'com4', lotNumber: 'Unit 3B', streetAddress: '88 Sunset Blvd', planType: 'Plan B - Craftsman', isArchived: false }
          ]
        }
      ]
    },
    {
      id: 'acc4',
      name: 'REFX TEST CL-2 - 130766',
      code: 'REFX-FL',
      billingAddress: '1200 Westshore Blvd, Tampa, FL 33609',
      phone: '(813) 555-9920',
      primaryContact: 'Jason Mayes',
      email: 'jmayes@refx.com',
      externalId: 'ERP-ACC-130766',
      isArchived: false,
      communities: [
        {
          id: 'com5',
          accountId: 'acc4',
          name: 'Palmetto Palms',
          cityState: 'Tampa, FL',
          superintendent: 'Carl Rogers',
          isArchived: false,
          lots: [
            { id: 'lot6', communityId: 'com5', lotNumber: 'Lot 8', streetAddress: '55 Palmetto Way', planType: 'Plan C - Tuscan', isArchived: false }
          ]
        }
      ]
    }
  ]);

  // Master Jobs Data
  const [jobsData, setJobsData] = useState<JobRow[]>([
    {
      id: '1',
      jobName: 'P2HSPN_001078_000_01',
      jobCategory: 'INITIAL_INSTALL',
      accountId: 'acc1',
      accountName: 'PERRY HOMES OF FLORIDA LLC - 129495',
      accountCode: 'PERRY-FL',
      communityId: 'com1',
      communityName: 'STAR FARMS LWR 90\'S',
      lotId: 'lot1',
      lotNumber: '001078',
      streetAddress: '3839 BUTTE TRAIL',
      cityStateZip: 'LAKEWOOD RANCH, FL 34211',
      elevationPlan: 'Plan B - Craftsman',
      projectNumber: '0001017193',
      salesOrderNumber: 'SO-99201',
      builderPhase: 'PHASE ONE',
      planNumber: 'TBD',
      fieldSuper: 'Mark Stevens',
      fieldManager: '3004 HORN, JACKIE',
      accountExecutive: 'Brittany Googe',
      accountManager: 'UNASSIGNED - AM - WEST',
      designer: 'Elena Rostova',
      jobNotes: 'Special sink cutout required. Custom edge profile.',
      templateDate: { date: '7/18/2026', status: 'tent' },
      fabDate: { date: '7/20/2026', status: 'auto' },
      installDate: { date: '7/22/2026', status: 'calc' },
      salesperson: 'jason mayes',
      externalId: 'ERP-JOB-1078',
      status: 'Active',
      isArchived: false,
      assignedCrew: 'Install Truck 1',
      materialOrdered: true,
      materialETA: '7/15/2026',
      materialReceived: true,
      materialReceivedOn: '7/16/2026',
      sinksOrdered: true,
      sinksETA: '7/17/2026',
      sinksReceived: false,
      sinksReceivedOn: '',
      purchasingNotes: 'Calacatta Gold 3cm slabs in bay 4',
      installerNotesText: 'Undermount sink clip verification completed.',
      files: [
        { id: 'f1', name: 'Kitchen_Plan_Rev2.pdf', size: '2.4 MB', type: 'PDF', uploadedAt: '6/15/2026' },
        { id: 'f2', name: 'Slab_Seam_Layout.dxf', size: '4.8 MB', type: 'DXF', uploadedAt: '6/16/2026' },
      ],
      activities: [
        { id: 'a1', activityName: 'Stone CAD', phase: 'STONE', status: 'Auto-Schedule', startDate: '7/16/2026', schedTime: '3:30pm', duration: '60m', assignedTo: 'CAD Team A' },
        { id: 'a2', activityName: 'Stone Saw', phase: 'STONE', status: 'Auto-Schedule', startDate: '7/17/2026', schedTime: '3:30pm', duration: '120m', assignedTo: 'Bridge Saw 1' },
        { id: 'a3', activityName: 'Stone CNC', phase: 'STONE', status: 'Auto-Schedule', startDate: '7/17/2026', schedTime: '3:30pm', duration: '90m', assignedTo: 'CNC Router 2' },
        { id: 'a4', activityName: 'Stone Fabrication', phase: 'STONE', status: 'Auto-Schedule', startDate: '7/20/2026', schedTime: '3:30pm', duration: '180m', assignedTo: 'Hand Polish Crew' },
        { id: 'a5', activityName: 'Stone Install', phase: 'STONE', status: 'CALCULATED', startDate: '7/22/2026', schedTime: '8:00am', duration: '240m', assignedTo: 'Install Truck 1' },
        { id: 'a6', activityName: '100% Job Complete', phase: 'STONE', status: 'Auto-Schedule', startDate: '7/24/2026', schedTime: '8:00am', duration: '30m', assignedTo: 'QA Super' },
        { id: 'a7', activityName: 'Admin Start', phase: 'STONE', status: 'Auto-Schedule', startDate: '7/15/2026', schedTime: '9:00am', duration: '15m', assignedTo: 'Office' },
        { id: 'a8', activityName: 'STONE PROGRAM - SAW', phase: 'STONE', status: 'Auto-Schedule', startDate: '7/16/2026', schedTime: '1:00pm', duration: '45m', assignedTo: 'Programmer' },
        { id: 'a9', activityName: 'STONE PROGRAM - CNC', phase: 'STONE', status: 'Auto-Schedule', startDate: '7/16/2026', schedTime: '2:00pm', duration: '45m', assignedTo: 'Programmer' },
        { id: 'a10', activityName: 'PRODUCTION RELEASE', phase: 'STONE', status: 'Auto-Schedule', startDate: '7/16/2026', schedTime: '4:00pm', duration: '15m', assignedTo: 'Plant Mgr' },
      ]
    },
    {
      id: '2',
      jobName: 'P2HSPN_001079_000_01 (Lot 42 - Warranty Vanity)',
      jobCategory: 'REWORK_WARRANTY',
      accountId: 'acc1',
      accountName: 'PERRY HOMES OF FLORIDA LLC - 129495',
      accountCode: 'PERRY-FL',
      communityId: 'com1',
      communityName: 'STAR FARMS LWR 90\'S',
      lotId: 'lot2',
      lotNumber: '001078',
      streetAddress: '3839 BUTTE TRAIL',
      cityStateZip: 'LAKEWOOD RANCH, FL 34211',
      elevationPlan: 'Plan B - Craftsman',
      templateDate: { date: '7/18/2026', status: 'tent' },
      fabDate: { date: '7/20/2026', status: 'auto' },
      installDate: { date: '7/22/2026', status: 'calc' },
      salesperson: 'jason mayes',
      jobIssues: 'Chip Repair Required',
      externalId: 'ERP-JOB-1079',
      status: 'Active',
      isArchived: false,
      assignedCrew: 'Service Crew A',
      materialOrdered: true,
      materialETA: '7/18/2026',
      materialReceived: true,
      materialReceivedOn: '7/18/2026',
      sinksOrdered: false,
      sinksETA: '',
      sinksReceived: false,
      sinksReceivedOn: '',
      purchasingNotes: 'Epoxy kit #4B allocated',
      installerNotesText: 'Service technician dispatched for cosmetic chip filling.',
      files: [],
      activities: [
        { id: 'b1', activityName: 'Stone Inspection', phase: 'STONE', status: 'Confirmed', startDate: '7/18/2026', schedTime: '9:00am', duration: '60m', assignedTo: 'Service Crew A' },
        { id: 'b2', activityName: 'Field Chip Polish & Seal', phase: 'STONE', status: 'Confirmed', startDate: '7/22/2026', schedTime: '10:00am', duration: '120m', assignedTo: 'Service Crew A' },
      ]
    },
    {
      id: '3',
      jobName: 'P2HSPP_000017_000_01 (Lot 15 - Primary)',
      jobCategory: 'INITIAL_INSTALL',
      accountId: 'acc1',
      accountName: 'PERRY HOMES OF FLORIDA LLC - 129495',
      accountCode: 'PERRY-FL',
      communityId: 'com2',
      communityName: 'Oakridge Estates',
      lotId: 'lot3',
      lotNumber: 'Lot 15',
      streetAddress: '108 Oakridge Dr',
      cityStateZip: 'ORLANDO, FL 32801',
      elevationPlan: 'Plan A - Modern',
      templateDate: { date: 'No Date', status: 'none' },
      fabDate: { date: '9/15/2026', status: 'auto' },
      installDate: { date: '9/17/2026', status: 'calc' },
      salesperson: 'jason mayes',
      externalId: 'ERP-JOB-0017',
      status: 'Active',
      isArchived: false,
      assignedCrew: 'Install Truck 2',
      materialOrdered: false,
      materialETA: '',
      materialReceived: false,
      materialReceivedOn: '',
      sinksOrdered: false,
      sinksETA: '',
      sinksReceived: false,
      sinksReceivedOn: '',
      purchasingNotes: 'Awaiting template sign-off',
      installerNotesText: '',
      files: [],
      activities: [
        { id: 'c1', activityName: 'Field Templating', phase: 'STONE', status: 'Tentative', startDate: '9/10/2026', schedTime: '9:00am', duration: '120m', assignedTo: 'Template Crew' },
        { id: 'c2', activityName: 'Stone Fabrication', phase: 'STONE', status: 'Auto-Schedule', startDate: '9/15/2026', schedTime: '1:00pm', duration: '180m', assignedTo: 'CNC Router 1' },
        { id: 'c3', activityName: 'Stone Install', phase: 'STONE', status: 'CALCULATED', startDate: '9/17/2026', schedTime: '8:00am', duration: '240m', assignedTo: 'Install Truck 2' },
      ]
    },
    {
      id: '4',
      jobName: 'RF1MRE_000014_000_03 (Lot 8 - Outdoor Bar)',
      jobCategory: 'ADD_ON',
      accountId: 'acc4',
      accountName: 'REFX TEST CL-2 - 130766',
      accountCode: 'REFX-FL',
      communityId: 'com5',
      communityName: 'Palmetto Palms',
      lotId: 'lot6',
      lotNumber: 'Lot 8',
      streetAddress: '55 Palmetto Way',
      cityStateZip: 'TAMPA, FL 33602',
      elevationPlan: 'Plan C - Tuscan',
      templateDate: { date: '10/9/2026', status: 'auto' },
      fabDate: { date: '10/11/2026', status: 'auto' },
      installDate: { date: '10/13/2026', status: 'conf' },
      salesperson: 'jason mayes',
      externalId: 'ERP-JOB-0014',
      status: 'Active',
      isArchived: false,
      assignedCrew: 'Unassigned',
      materialOrdered: true,
      materialETA: '10/5/2026',
      materialReceived: true,
      materialReceivedOn: '10/6/2026',
      sinksOrdered: false,
      sinksETA: '',
      sinksReceived: false,
      sinksReceivedOn: '',
      purchasingNotes: 'Granite rem cut from bundle #882',
      installerNotesText: '',
      files: [],
      activities: [
        { id: 'd1', activityName: 'Stone CAD', phase: 'STONE', status: 'Auto-Schedule', startDate: '10/9/2026', schedTime: '10:00am', duration: '60m', assignedTo: 'CAD Team A' },
        { id: 'd2', activityName: 'Stone Fabrication', phase: 'STONE', status: 'Auto-Schedule', startDate: '10/11/2026', schedTime: '1:00pm', duration: '120m', assignedTo: 'Bridge Saw 1' },
        { id: 'd3', activityName: 'Stone Install', phase: 'STONE', status: 'Confirmed', startDate: '10/13/2026', schedTime: '8:00am', duration: '180m', assignedTo: 'Install Truck 1' },
      ]
    },
    {
      id: '5',
      jobName: 'XCF2TT_000001_000_01 (Lot 3B - Full Slab)',
      jobCategory: 'INITIAL_INSTALL',
      accountId: 'acc3',
      accountName: 'CENTURY COMMUNITIES - FLORIDA - 127263',
      accountCode: 'CENTURY-FL',
      communityId: 'com4',
      communityName: 'Sunset Ridge',
      lotId: 'lot5',
      lotNumber: 'Unit 3B',
      streetAddress: '88 Sunset Blvd',
      cityStateZip: 'SARASOTA, FL 34236',
      elevationPlan: 'Plan B - Craftsman',
      templateDate: { date: 'No Date', status: 'none' },
      fabDate: { date: 'No Date', status: 'none' },
      installDate: { date: '8/14/2026', status: 'conf' },
      salesperson: 'Sarah Jenkins',
      externalId: 'ERP-JOB-0001',
      status: 'Active',
      isArchived: false,
      assignedCrew: 'Install Truck 1',
      materialOrdered: true,
      materialETA: '8/01/2026',
      materialReceived: true,
      materialReceivedOn: '8/02/2026',
      sinksOrdered: true,
      sinksETA: '8/05/2026',
      sinksReceived: true,
      sinksReceivedOn: '8/06/2026',
      purchasingNotes: 'Sinks in warehouse aisle 3',
      installerNotesText: '',
      files: [],
      activities: [
        { id: 'e1', activityName: 'Field Templating', phase: 'STONE', status: 'Tentative', startDate: '8/08/2026', schedTime: '11:00am', duration: '90m', assignedTo: 'Template Crew' },
        { id: 'e2', activityName: 'Stone Install', phase: 'STONE', status: 'Confirmed', startDate: '8/14/2026', schedTime: '8:00am', duration: '240m', assignedTo: 'Install Truck 1' },
      ]
    },
    {
      id: '6',
      jobName: 'ABCDE_000101_000_01 (Lot 104 - Main Kitchen)',
      jobCategory: 'INITIAL_INSTALL',
      accountId: 'acc2',
      accountName: 'TOLL BROTHERS INC - LV - 105870',
      accountCode: 'TOLL-LV',
      communityId: 'com3',
      communityName: 'Red Rock Canyon',
      lotId: 'lot4',
      lotNumber: 'Lot 104',
      streetAddress: '104 Red Rock Pass',
      cityStateZip: 'LAS VEGAS, NV 89135',
      elevationPlan: 'Plan D - Estate',
      templateDate: { date: 'No Date', status: 'conf' },
      fabDate: { date: 'No Date', status: 'auto' },
      installDate: { date: 'No Date', status: 'conf' },
      salesperson: 'Michael Ross',
      externalId: 'ERP-JOB-0101',
      status: 'Active',
      isArchived: false,
      assignedCrew: 'Templating Crew 1',
      materialOrdered: false,
      materialETA: '',
      materialReceived: false,
      materialReceivedOn: '',
      sinksOrdered: false,
      sinksETA: '',
      sinksReceived: false,
      sinksReceivedOn: '',
      purchasingNotes: 'Pending customer color selection',
      installerNotesText: '',
      files: [],
      activities: [
        { id: 'f1', activityName: 'Stone CAD', phase: 'STONE', status: 'Confirmed', startDate: '8/20/2026', schedTime: '9:00am', duration: '60m', assignedTo: 'CAD Team B' },
        { id: 'f2', activityName: 'Stone Saw', phase: 'STONE', status: 'Auto-Schedule', startDate: '8/22/2026', schedTime: '1:00pm', duration: '120m', assignedTo: 'Bridge Saw 2' },
        { id: 'f3', activityName: 'Stone Install', phase: 'STONE', status: 'Confirmed', startDate: '8/26/2026', schedTime: '8:00am', duration: '240m', assignedTo: 'Install Truck 3' },
      ]
    },
  ]);

  // Change Log Audit Trail
  const [changeLogs, setChangeLogs] = useState<ChangeLogEntry[]>([
    {
      id: 'cl1',
      timestamp: '6/15/2026 12:17:53 PM',
      changedBy: 'SAPIntegration',
      summary: 'Form SAP Installer Notes Updated',
      diffs: [{ field: 'Installer Notes', from: '[None]', to: '[Confirmed On-Site]' }]
    },
    {
      id: 'cl2',
      timestamp: '6/15/2026 12:17:52 PM',
      changedBy: 'SAPIntegration',
      summary: 'Activity Stone Install Updated',
      diffs: [{ field: 'Start Date', from: '[None]', to: '7/22/2026' }]
    },
    {
      id: 'cl3',
      timestamp: '6/15/2026 12:17:51 PM',
      changedBy: 'SAPIntegration',
      summary: 'Activity 100% Job Complete Created',
      diffs: [
        { field: 'Status', from: '[None]', to: 'Auto-Schedule' },
        { field: 'Notes', from: '[None]', to: 'Pre-inspection completed' }
      ]
    },
    {
      id: 'cl4',
      timestamp: '6/15/2026 12:17:51 PM',
      changedBy: 'SAPIntegration',
      summary: 'Activity QUALITY WALK Created',
      diffs: [{ field: 'Status', from: '[None]', to: 'Auto-Schedule' }]
    },
    {
      id: 'cl5',
      timestamp: '6/15/2026 12:17:50 PM',
      changedBy: 'SAPIntegration',
      summary: 'Activity CAD - ORIGINAL Created',
      diffs: [{ field: 'Status', from: '[None]', to: 'Auto-Schedule' }]
    },
  ]);

  // Context-Scoped Entity Creation State
  const [createScope, setCreateScope] = useState<'account' | 'community' | 'lot' | 'job' | 'activity'>('account');
  const [newEntityName, setNewEntityName] = useState('');
  const [newEntityCode, setNewEntityCode] = useState('');
  const [newEntityAddress, setNewEntityAddress] = useState('');
  const [newEntityContact, setNewEntityContact] = useState('');
  const [newEntityPhone, setNewEntityPhone] = useState('');
  const [newEntityEmail, setNewEntityEmail] = useState('');
  const [newEntityAccount, setNewEntityAccount] = useState('PERRY HOMES OF FLORIDA LLC - 129495');
  const [newEntityCommunity, setNewEntityCommunity] = useState('STAR FARMS LWR 90\'S');
  const [newJobCategory, setNewJobCategory] = useState<'INITIAL_INSTALL' | 'ADD_ON' | 'REWORK_WARRANTY'>('INITIAL_INSTALL');
  const [newActivityName, setNewActivityName] = useState('Stone Quality Walk');
  const [newActivityPhase, setNewActivityPhase] = useState('STONE');

  // Self-Service Entra ID Auth Config State
  const [authProvider, setAuthProvider] = useState<'EMAIL_PASSWORD' | 'ENTRA_ID' | 'HYBRID'>('HYBRID');
  const [entraTenantId, setEntraTenantId] = useState('72f988bf-86f1-41af-91ab-2d7cd011db47');
  const [entraClientId, setEntraClientId] = useState('11111111-2222-3333-4444-555555555555');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('EXTERNAL_CREW_ADMIN');
  const [inviteSentSuccess, setInviteSentSuccess] = useState(false);

  // 14-Day Calendar Control State
  const [centerDate, setCenterDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [calAccountFilter, setCalAccountFilter] = useState('All');
  const [calCommunityFilter, setCalCommunityFilter] = useState('All');

  // Work Days & Custom Calendar Configuration State
  const [calendarConfigScope, setCalendarConfigScope] = useState<string>('GLOBAL'); // 'GLOBAL' or region name
  
  // Subscriber Global Default Work Days (M-F default)
  const [globalWorkDays, setGlobalWorkDays] = useState<{ [day: string]: boolean }>({
    Sun: false,
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: false,
  });

  // Regional Override Work Days Settings (Optional, inherits from subscriber if true)
  const [regionalWorkDays, setRegionalWorkDays] = useState<{
    [region: string]: { inheritFromSubscriber: boolean; workDays: { [day: string]: boolean } };
  }>({
    'Phoenix Metro (PHX)': {
      inheritFromSubscriber: true,
      workDays: { Sun: false, Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false },
    },
    'Tucson East (TUC)': {
      inheritFromSubscriber: true,
      workDays: { Sun: false, Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false },
    },
    'Denver North (DEN)': {
      inheritFromSubscriber: true,
      workDays: { Sun: false, Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false },
    },
    'Tampa Plant (TPA)': {
      inheritFromSubscriber: false,
      workDays: { Sun: false, Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true },
    },
  });

  // Holidays (MM/DD/YYYY format, customizable per region or global)
  interface HolidayItem {
    id: string;
    name: string;
    date: string; // MM/DD/YYYY
    regionScope: string;
    isRecurring: boolean;
  }

  const [companyHolidays, setCompanyHolidays] = useState<HolidayItem[]>([
    { id: '1', name: "New Year's Day", date: '01/01/2026', regionScope: 'Global (All Regions)', isRecurring: true },
    { id: '2', name: 'Memorial Day', date: '05/25/2026', regionScope: 'Global (All Regions)', isRecurring: true },
    { id: '3', name: 'Independence Day', date: '07/04/2026', regionScope: 'Global (All Regions)', isRecurring: true },
    { id: '4', name: 'Labor Day', date: '09/07/2026', regionScope: 'Global (All Regions)', isRecurring: true },
    { id: '5', name: 'Thanksgiving Day', date: '11/26/2026', regionScope: 'Global (All Regions)', isRecurring: true },
    { id: '6', name: 'Christmas Day', date: '12/25/2026', regionScope: 'Global (All Regions)', isRecurring: true },
    { id: '7', name: 'Tampa Plant Annual Maintenance Day', date: '08/15/2026', regionScope: 'Tampa Plant (TPA)', isRecurring: false },
    { id: '8', name: 'Pioneer Day', date: '07/24/2026', regionScope: 'Denver North (DEN)', isRecurring: true },
  ]);

  // Add Custom Holiday Form State
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayRegion, setNewHolidayRegion] = useState('Global (All Regions)');
  const [newHolidayRecurring, setNewHolidayRecurring] = useState(true);
  const [holidayAddedSuccess, setHolidayAddedSuccess] = useState(false);

  const isDark = theme === 'dark';

  // Navigation handlers
  const openAccountDetailScreen = (acc: AccountRow) => {
    setSelectedAccount(acc);
    setActiveNav('account_detail');
  };

  const openCommunityDetailScreen = (com: CommunityRow) => {
    setSelectedCommunity(com);
    setActiveNav('community_detail');
  };

  const openJobDetailScreen = (job: JobRow, origin: 'jobs' | 'calendar' | 'accounts' | 'community_detail' = 'jobs') => {
    setSelectedJob(job);
    setJobDetailOriginNav(origin);
    setActiveNav('job_detail');
  };

  const openChangeLogScreen = () => {
    setActiveNav('change_log');
  };

  // Archive & Delete Rules Guardrail
  const handleToggleArchiveAccount = (accId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = accountsData.map(acc => acc.id === accId ? { ...acc, isArchived: !acc.isArchived } : acc);
    setAccountsData(updated);
    if (selectedAccount && selectedAccount.id === accId) {
      setSelectedAccount({ ...selectedAccount, isArchived: !selectedAccount.isArchived });
    }
  };

  const handleDeleteAccount = (acc: AccountRow, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (acc.communities.length > 0) {
      alert(`Cannot delete account "${acc.name}" because it has ${acc.communities.length} active communities (children). Please delete the child communities first, or mark this account as Archived.`);
      return;
    }
    if (confirm(`Are you sure you want to permanently delete account "${acc.name}"?`)) {
      setAccountsData(accountsData.filter(a => a.id !== acc.id));
      if (selectedAccount && selectedAccount.id === acc.id) {
        setSelectedAccount(null);
        setActiveNav('accounts');
      }
    }
  };

  const handleToggleArchiveCommunity = (comId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedAccount) return;
    const updatedCommunities = selectedAccount.communities.map(c => c.id === comId ? { ...c, isArchived: !c.isArchived } : c);
    const updatedAcc = { ...selectedAccount, communities: updatedCommunities };
    setSelectedAccount(updatedAcc);
    setAccountsData(accountsData.map(a => a.id === updatedAcc.id ? updatedAcc : a));
    if (selectedCommunity && selectedCommunity.id === comId) {
      setSelectedCommunity({ ...selectedCommunity, isArchived: !selectedCommunity.isArchived });
    }
  };

  const handleDeleteCommunity = (com: CommunityRow, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (com.lots.length > 0) {
      alert(`Cannot delete community "${com.name}" because it has ${com.lots.length} active lots (children). Please delete the child lots first, or mark this community as Archived.`);
      return;
    }
    if (confirm(`Are you sure you want to delete community "${com.name}"?`)) {
      if (selectedAccount) {
        const updatedCommunities = selectedAccount.communities.filter(c => c.id !== com.id);
        const updatedAcc = { ...selectedAccount, communities: updatedCommunities };
        setSelectedAccount(updatedAcc);
        setAccountsData(accountsData.map(a => a.id === updatedAcc.id ? updatedAcc : a));
      }
      if (selectedCommunity && selectedCommunity.id === com.id) {
        setSelectedCommunity(null);
        setActiveNav('account_detail');
      }
    }
  };

  const selectSavedView = (viewName: string) => {
    setActiveView(viewName);
    if (viewName === 'Unscheduled Jobs View') {
      setFilters(['Job Status Is Active', 'Unscheduled']);
    } else if (viewName === 'Warranty Rework View') {
      setFilters(['Job Category: Warranty Rework']);
    } else if (viewName === 'Multi-Region Overview') {
      setFilters(['All Regions']);
    } else {
      setFilters(['Job Status Is Active']);
    }
  };

  const filteredAccounts = accountsData.filter((acc) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        acc.name.toLowerCase().includes(q) ||
        acc.code.toLowerCase().includes(q) ||
        acc.primaryContact.toLowerCase().includes(q) ||
        (acc.externalId && acc.externalId.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (accountView === 'All Active Accounts' && acc.isArchived) return false;
    if (accountView === 'Archived Accounts' && !acc.isArchived) return false;
    return true;
  });

  const filteredJobs = jobsData.filter((job) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        job.jobName.toLowerCase().includes(q) ||
        job.accountName.toLowerCase().includes(q) ||
        job.communityName.toLowerCase().includes(q) ||
        job.salesperson.toLowerCase().includes(q) ||
        (job.externalId && job.externalId.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (activeView === 'Unscheduled Jobs View') {
      const isUnscheduled =
        job.templateDate.status === 'none' ||
        job.templateDate.status === 'tent' ||
        job.fabDate.status === 'none' ||
        job.installDate.status === 'none';
      if (!isUnscheduled) return false;
    }

    if (activeView === 'Warranty Rework View') {
      if (job.jobCategory !== 'REWORK_WARRANTY') return false;
    }

    const hasUnscheduledFilter = filters.some((f) => f.includes('Unscheduled'));
    if (hasUnscheduledFilter && activeView === 'Standard View') {
      const isUnscheduled =
        job.templateDate.status === 'none' ||
        job.templateDate.status === 'tent' ||
        job.installDate.status === 'none';
      if (!isUnscheduled) return false;
    }

    return true;
  });

  // Core Scheduling Engine: Workday & Holiday Evaluation
  const isDateWorkingDay = (dateStr: string, regionScopeName?: string): boolean => {
    if (!dateStr || dateStr === 'No Date') return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;

    const isoDate = d.toISOString().split('T')[0];
    // Overtime catch-up day override
    if (customWorkDays.includes(isoDate)) return true;

    // Check company & regional holidays
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = String(d.getFullYear());
    const formattedMDY = `${mm}/${dd}/${yyyy}`;
    const isHoliday = companyHolidays.some(h => {
      if (h.date === formattedMDY) {
        if (h.regionScope === 'Global (All Regions)') return true;
        if (regionScopeName && h.regionScope.includes(regionScopeName)) return true;
      }
      return false;
    });
    if (isHoliday) return false;

    // Check regional shutdown
    const reg = regionsList.find(r => r.name === (regionScopeName || selectedRegion));
    if (reg && reg.status === 'SHUTDOWN') return false;

    // Check day of week (0 = Sun, 1 = Mon, ..., 6 = Sat)
    const daysArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = daysArr[d.getDay()];

    if (regionScopeName && regionalWorkDays[regionScopeName] && !regionalWorkDays[regionScopeName].inheritFromSubscriber) {
      return !!regionalWorkDays[regionScopeName].workDays[dayName];
    }
    return !!globalWorkDays[dayName];
  };

  const calculateNextWorkingDate = (startDateStr: string, workDaysToAdd: number, regionScopeName?: string): string => {
    const d = new Date(startDateStr);
    if (isNaN(d.getTime())) return startDateStr;
    let added = 0;
    while (added < workDaysToAdd) {
      d.setDate(d.getDate() + 1);
      const iso = d.toISOString().split('T')[0];
      if (isDateWorkingDay(iso, regionScopeName)) {
        added++;
      }
    }
    const mm = String(d.getMonth() + 1);
    const dd = String(d.getDate());
    const yyyy = String(d.getFullYear());
    return `${mm}/${dd}/${yyyy}`;
  };

  const calculateShiftPreview = (job: JobRow, triggerPhase: 'template' | 'fab' | 'install', newDateStr: string) => {
    const affected: Array<{ phase: string; activityName: string; currentDate: string; proposedDate: string; workdayOffset: number }> = [];

    let proposedFabDate = job.fabDate.date;
    let proposedInstallDate = job.installDate.date;

    if (triggerPhase === 'template') {
      proposedFabDate = calculateNextWorkingDate(newDateStr, 2, job.regionName);
      proposedInstallDate = calculateNextWorkingDate(proposedFabDate, 2, job.regionName);
      affected.push({
        phase: 'STONE FABRICATION',
        activityName: 'Stone Fabrication (Saw, CNC, Polish)',
        currentDate: job.fabDate.date,
        proposedDate: proposedFabDate,
        workdayOffset: 2,
      });
      affected.push({
        phase: 'STONE INSTALLATION',
        activityName: 'Stone Final Installation',
        currentDate: job.installDate.date,
        proposedDate: proposedInstallDate,
        workdayOffset: 4,
      });
    } else if (triggerPhase === 'fab') {
      proposedInstallDate = calculateNextWorkingDate(newDateStr, 2, job.regionName);
      affected.push({
        phase: 'STONE INSTALLATION',
        activityName: 'Stone Final Installation',
        currentDate: job.installDate.date,
        proposedDate: proposedInstallDate,
        workdayOffset: 2,
      });
    }

    const targetDate = job.targetInstallDate || '7/25/2026';
    const installObj = new Date(proposedInstallDate);
    const targetObj = new Date(targetDate);
    let isDeadlineExceeded = false;
    let daysLate = 0;
    if (!isNaN(installObj.getTime()) && !isNaN(targetObj.getTime()) && installObj > targetObj) {
      isDeadlineExceeded = true;
      daysLate = Math.ceil((installObj.getTime() - targetObj.getTime()) / (1000 * 60 * 60 * 24));
    }

    setDependencyShiftPlan({
      isOpen: true,
      sourceJob: job,
      triggerPhase,
      newDate: newDateStr,
      affectedActivities: affected,
      targetInstallDate: targetDate,
      isDeadlineExceeded,
      daysLate,
    });
  };

  const applyDependencyShiftPlan = () => {
    if (!dependencyShiftPlan.sourceJob) return;
    const { sourceJob, triggerPhase, newDate, affectedActivities } = dependencyShiftPlan;

    const fabShift = affectedActivities.find(a => a.phase.includes('FABRICATION'));
    const installShift = affectedActivities.find(a => a.phase.includes('INSTALLATION'));

    const updatedJobs = jobsData.map(j => {
      if (j.id === sourceJob.id) {
        return {
          ...j,
          templateDate: triggerPhase === 'template' ? { date: newDate, status: 'conf' as const } : j.templateDate,
          fabDate: triggerPhase === 'fab' ? { date: newDate, status: 'conf' as const } : (fabShift ? { date: fabShift.proposedDate, status: 'calc' as const } : j.fabDate),
          installDate: triggerPhase === 'install' ? { date: newDate, status: 'conf' as const } : (installShift ? { date: installShift.proposedDate, status: 'calc' as const } : j.installDate),
        };
      }
      return j;
    });

    setJobsData(updatedJobs);
    if (selectedJob && selectedJob.id === sourceJob.id) {
      const updatedSel = updatedJobs.find(j => j.id === sourceJob.id);
      if (updatedSel) setSelectedJob(updatedSel);
    }

    const newLogs: ChangeLogEntry = {
      id: String(Date.now()),
      timestamp: new Date().toLocaleString(),
      changedBy: `${activeUserRole === 'SUBSCRIBER_ADMIN' ? 'Admin' : 'Scheduler'} (${activeUserRole})`,
      summary: `Auto-Dependency Shift Applied on ${sourceJob.jobName} (Triggered by ${triggerPhase.toUpperCase()} date change to ${newDate})`,
      diffs: affectedActivities.map(a => ({
        field: a.phase,
        from: a.currentDate,
        to: a.proposedDate
      }))
    };
    setChangeLogs([newLogs, ...changeLogs]);
    setDependencyShiftPlan({ ...dependencyShiftPlan, isOpen: false });
  };

  const openDateEditor = (job: JobRow, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeUserRole === 'EXTERNAL_FIELD_INSTALLER' || activeUserRole === 'EXTERNAL_SUBCONTRACTOR') {
      alert('🔒 Access Restricted: External field crews cannot reschedule milestone dates. Please contact office dispatch.');
      return;
    }
    setEditingDateJob(job);
    setEditTemplateDate(job.templateDate.date === 'No Date' ? '' : job.templateDate.date);
    setEditTemplateStatus(job.templateDate.status);
    setEditFabDate(job.fabDate.date === 'No Date' ? '' : job.fabDate.date);
    setEditFabStatus(job.fabDate.status);
    setEditInstallDate(job.installDate.date === 'No Date' ? '' : job.installDate.date);
    setEditInstallStatus(job.installDate.status);
  };

  const handleSaveDates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDateJob) return;

    // Check if template or fab date shifted to trigger dependency workflow
    if (editTemplateDate && editTemplateDate !== editingDateJob.templateDate.date && editTemplateDate !== 'No Date') {
      calculateShiftPreview(editingDateJob, 'template', editTemplateDate);
      setEditingDateJob(null);
      return;
    }

    if (editFabDate && editFabDate !== editingDateJob.fabDate.date && editFabDate !== 'No Date') {
      calculateShiftPreview(editingDateJob, 'fab', editFabDate);
      setEditingDateJob(null);
      return;
    }

    const updatedJobs = jobsData.map((j) => {
      if (j.id === editingDateJob.id) {
        return {
          ...j,
          templateDate: {
            date: editTemplateDate || 'No Date',
            status: editTemplateStatus === 'auto' ? 'conf' : editTemplateStatus,
          },
          fabDate: {
            date: editFabDate || 'No Date',
            status: editFabStatus === 'auto' ? 'conf' : editFabStatus,
          },
          installDate: {
            date: editInstallDate || 'No Date',
            status: editInstallStatus === 'auto' ? 'conf' : editInstallStatus,
          },
        };
      }
      return j;
    });

    setJobsData(updatedJobs);
    if (selectedJob && selectedJob.id === editingDateJob.id) {
      const updatedSelected = updatedJobs.find((j) => j.id === selectedJob.id);
      if (updatedSelected) setSelectedJob(updatedSelected);
    }

    const newLog: ChangeLogEntry = {
      id: String(Date.now()),
      timestamp: new Date().toLocaleString(),
      changedBy: `${activeUserRole === 'SUBSCRIBER_ADMIN' ? 'Admin' : 'Scheduler'} (${activeUserRole})`,
      summary: `Job Activity Dates Updated for ${editingDateJob.jobName}`,
      diffs: [
        { field: 'Template Date', from: editingDateJob.templateDate.date, to: editTemplateDate || 'No Date' },
        { field: 'Install Date', from: editingDateJob.installDate.date, to: editInstallDate || 'No Date' }
      ]
    };
    setChangeLogs([newLog, ...changeLogs]);
    setEditingDateJob(null);
  };

  // Activity Completion & Form Validation Guardrail
  const handleActivityCompletionCheck = (job: JobRow, activity: JobActivityRow) => {
    const template = builderFormTemplates.find(t => t.accountId === job.accountId) || builderFormTemplates[0];

    if (template && template.isRequiredForCompletion) {
      const submissionKey = `${job.id}_${template.id}`;
      const sub = formSubmissions[submissionKey] || {};

      const missing: string[] = [];
      template.fields.forEach(f => {
        if (f.required) {
          if (f.type === 'signature' && (!sub[f.id] || sub[f.id].trim() === '')) {
            missing.push(`${f.label} (Digital Signature Missing)`);
          } else if (f.type === 'checkbox' && !sub[f.id]) {
            missing.push(`${f.label} (Required Checkbox Unverified)`);
          } else if (f.type === 'pass_fail' && (!sub[f.id] || sub[f.id] === 'FAIL')) {
            missing.push(`${f.label} (Must be verified as PASS)`);
          } else if ((f.type === 'text' || f.type === 'select') && (!sub[f.id] || sub[f.id].trim() === '')) {
            missing.push(`${f.label} (Required Input Empty)`);
          }
        }
      });

      if (missing.length > 0) {
        setFormValidationModal({
          isOpen: true,
          job,
          activity,
          missingFields: missing,
          formTemplate: template,
        });
        return;
      }
    }

    const updatedActivities = job.activities.map(a => a.id === activity.id ? { ...a, status: 'Complete' as const } : a);
    const updatedJob = { ...job, activities: updatedActivities };
    setJobsData(jobsData.map(j => j.id === job.id ? updatedJob : j));
    if (selectedJob && selectedJob.id === job.id) setSelectedJob(updatedJob);

    const log: ChangeLogEntry = {
      id: String(Date.now()),
      timestamp: new Date().toLocaleString(),
      changedBy: `${activeAssigneeName} (${activeUserRole})`,
      summary: `Activity "${activity.activityName}" marked COMPLETE on Job ${job.jobName}`,
      diffs: [{ field: 'Activity Status', from: activity.status, to: 'Complete' }]
    };
    setChangeLogs([log, ...changeLogs]);
  };

  // Warranty / Rework Task Generator
  const handleGenerateWarrantyRework = (parentJob: JobRow, issue: JobIssueItem) => {
    const reworkJobId = `job_rework_${Date.now()}`;
    const newReworkJob: JobRow = {
      id: reworkJobId,
      jobName: `${parentJob.jobName} - REWORK (#${issue.category})`,
      jobCategory: 'REWORK_WARRANTY',
      accountId: parentJob.accountId,
      accountName: parentJob.accountName,
      accountCode: parentJob.accountCode,
      communityId: parentJob.communityId,
      communityName: parentJob.communityName,
      lotId: parentJob.lotId,
      lotNumber: parentJob.lotNumber,
      streetAddress: parentJob.streetAddress,
      cityStateZip: parentJob.cityStateZip,
      elevationPlan: parentJob.elevationPlan,
      templateDate: { date: '7/25/2026', status: 'conf' },
      fabDate: { date: '7/27/2026', status: 'auto' },
      installDate: { date: '7/29/2026', status: 'calc' },
      salesperson: parentJob.salesperson,
      jobIssues: `Warranty Rework: ${issue.description}`,
      hasOpenIssue: false,
      status: 'Active',
      isArchived: false,
      assignedCrew: 'Service Warranty Tech 1',
      materialOrdered: true,
      materialETA: '7/25/2026',
      materialReceived: true,
      materialReceivedOn: '7/25/2026',
      sinksOrdered: false,
      sinksETA: '',
      sinksReceived: false,
      sinksReceivedOn: '',
      purchasingNotes: 'Allocated warranty repair kit',
      installerNotesText: `Warranty follow-up created from Issue ticket #${issue.id}: ${issue.description}`,
      files: [],
      activities: [
        { id: `act_w1_${Date.now()}`, activityName: 'Warranty On-Site Inspection', phase: 'STONE', status: 'Confirmed', startDate: '7/25/2026', schedTime: '9:00am', duration: '60m', assignedTo: 'Service Warranty Tech 1' },
        { id: `act_w2_${Date.now()}`, activityName: 'Stone Seam/Chip Repair & Re-polish', phase: 'STONE', status: 'Confirmed', startDate: '7/29/2026', schedTime: '11:00am', duration: '120m', assignedTo: 'Service Warranty Tech 1' },
      ]
    };

    setJobsData([newReworkJob, ...jobsData]);
    setJobIssuesList(jobIssuesList.map(i => i.id === issue.id ? { ...i, hasWarrantyOrder: true } : i));

    const log: ChangeLogEntry = {
      id: String(Date.now()),
      timestamp: new Date().toLocaleString(),
      changedBy: `${activeUserRole === 'SUBSCRIBER_ADMIN' ? 'Admin' : 'Office User'}`,
      summary: `Created Warranty / Rework Order "${newReworkJob.jobName}" linked to Lot ${parentJob.lotNumber}`,
      diffs: [{ field: 'Order Type', from: 'Issue Ticket', to: 'Warranty Job Active' }]
    };
    setChangeLogs([log, ...changeLogs]);
    alert(`✅ Success: Generated Warranty Rework Order "${newReworkJob.jobName}" under Lot ${parentJob.lotNumber}!`);
  };

  // CSV Exporter (Scoped to Current Filters & Visibility)
  const exportTableToCsv = (type: 'accounts' | 'jobs' | 'reports') => {
    const filename = `SlabMaster_${type}_Export_${new Date().toISOString().split('T')[0]}.csv`;
    let csvContent = '';

    if (type === 'accounts') {
      const headers = ['Account Name', 'Account Code', 'Billing Address', 'Phone', 'Primary Contact', 'Email', 'Active Communities Count', 'External ERP ID'];
      const rows = filteredAccounts.map(a => [
        `"${a.name}"`,
        `"${a.code}"`,
        `"${a.billingAddress}"`,
        `"${a.phone}"`,
        `"${a.primaryContact}"`,
        `"${a.email}"`,
        a.communities.length,
        `"${a.externalId || ''}"`
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else if (type === 'jobs') {
      const headers = ['Job Name', 'Builder Account', 'Community', 'Lot #', 'Street Address', 'Status', 'Category', 'Template Date', 'Fab Date', 'Install Date', 'Target Deadline', 'Assigned Crew', 'Salesperson'];
      const rows = filteredJobs.map(j => [
        `"${j.jobName}"`,
        `"${j.accountName}"`,
        `"${j.communityName}"`,
        `"${j.lotNumber}"`,
        `"${j.streetAddress}"`,
        `"${j.status}"`,
        `"${j.jobCategory}"`,
        `"${j.templateDate.date}"`,
        `"${j.fabDate.date}"`,
        `"${j.installDate.date}"`,
        `"${j.targetInstallDate || '7/25/2026'}"`,
        `"${j.assignedCrew || 'Unassigned'}"`,
        `"${j.salesperson}"`
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else {
      const headers = ['Report Metric', 'Perry Homes (Tampa)', 'Toll Brothers (LV)', 'Century Communities', 'Total Aggregated'];
      const rows = [
        ['Installed Area (Sq Ft - Kitchen Slabs)', '12,450', '8,920', '4,100', '25,470'],
        ['Installed Area (Sq Ft - Vanity)', '3,200', '2,140', '980', '6,320'],
        ['Schedule Adherence Rate (%)', '96.2%', '94.8%', '98.1%', '96.4%'],
      ];
      csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendExternalInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteSentSuccess(true);
    setTimeout(() => {
      setInviteSentSuccess(false);
      setInviteEmail('');
    }, 3000);
  };

  const handleSaveFormPacket = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSaveSuccess(true);
    setTimeout(() => setFormSaveSuccess(false), 3000);
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert('File size exceeds 500KB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Work Days & Holiday Handlers
  const handleToggleWorkDay = (day: string) => {
    if (calendarConfigScope === 'GLOBAL') {
      setGlobalWorkDays({ ...globalWorkDays, [day]: !globalWorkDays[day] });
    } else {
      const currentReg = regionalWorkDays[calendarConfigScope];
      if (currentReg) {
        setRegionalWorkDays({
          ...regionalWorkDays,
          [calendarConfigScope]: {
            ...currentReg,
            inheritFromSubscriber: false,
            workDays: {
              ...currentReg.workDays,
              [day]: !currentReg.workDays[day],
            },
          },
        });
      }
    }
  };

  const handleToggleOvertimeDay = (isoDate: string) => {
    if (customWorkDays.includes(isoDate)) {
      setCustomWorkDays(customWorkDays.filter(d => d !== isoDate));
    } else {
      setCustomWorkDays([...customWorkDays, isoDate]);
    }
  };

  const handleToggleInheritance = (region: string, shouldInherit: boolean) => {
    const currentReg = regionalWorkDays[region];
    if (currentReg) {
      setRegionalWorkDays({
        ...regionalWorkDays,
        [region]: {
          ...currentReg,
          inheritFromSubscriber: shouldInherit,
          workDays: shouldInherit ? { ...globalWorkDays } : { ...currentReg.workDays },
        },
      });
    }
  };

  const handleAddCustomHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayName || !newHolidayDate) return;

    let formattedDate = newHolidayDate;
    if (newHolidayDate.includes('-')) {
      const [y, m, d] = newHolidayDate.split('-');
      formattedDate = `${m}/${d}/${y}`;
    }

    const newH: HolidayItem = {
      id: `hol_${Date.now()}`,
      name: newHolidayName,
      date: formattedDate,
      regionScope: newHolidayRegion,
      isRecurring: newHolidayRecurring,
    };

    setCompanyHolidays([...companyHolidays, newH]);
    setNewHolidayName('');
    setNewHolidayDate('');
    setHolidayAddedSuccess(true);
    setTimeout(() => setHolidayAddedSuccess(false), 3000);
  };

  const handleDeleteHoliday = (holidayId: string) => {
    setCompanyHolidays(companyHolidays.filter(h => h.id !== holidayId));
  };

  // Region & Operating Facility Handlers with Dedicated Address Breakdown
  const handleToggleShutdownRegion = (regId: string) => {
    const updated = regionsList.map((r) => {
      if (r.id === regId) {
        const nextStatus: 'ACTIVE' | 'SHUTDOWN' = r.status === 'ACTIVE' ? 'SHUTDOWN' : 'ACTIVE';
        return { ...r, status: nextStatus };
      }
      return r;
    });
    setRegionsList(updated);
  };

  const handleSetDefaultRegion = (regId: string) => {
    const updated = regionsList.map((r) => ({
      ...r,
      isDefault: r.id === regId,
    }));
    setRegionsList(updated);
    const chosen = updated.find((r) => r.id === regId);
    if (chosen) setSelectedRegion(chosen.name);
  };

  const handleCreateRegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegionName) return;

    const code = newRegionCode || newRegionName.substring(0, 3).toUpperCase();
    const fullFormattedAddress = `${newRegionStreet ? newRegionStreet + ', ' : ''}${newRegionCity ? newRegionCity + ', ' : ''}${newRegionState} ${newRegionZip}`.trim();

    const newReg = {
      id: `reg_${Date.now()}`,
      name: `${newRegionName} (${code})`,
      code: code,
      streetAddress: newRegionStreet || '100 Main Logistics Way',
      city: newRegionCity || 'Phoenix',
      state: newRegionState || 'AZ',
      zip: newRegionZip || '85001',
      address: fullFormattedAddress || '100 Main Logistics Way, Phoenix, AZ 85001',
      timezone: newRegionTimezone || 'America/Phoenix (MST)',
      isDefault: false,
      status: 'ACTIVE' as const,
      activeJobsCount: 0,
    };

    setRegionsList([...regionsList, newReg]);
    setNewRegionName('');
    setNewRegionCode('');
    setNewRegionStreet('');
    setNewRegionCity('');
    setNewRegionState('AZ');
    setNewRegionZip('');
    setRegionAddedSuccess(true);
    setTimeout(() => setRegionAddedSuccess(false), 3000);
  };

  const handleDeleteRegion = (regId: string) => {
    const target = regionsList.find((r) => r.id === regId);
    if (!target) return;
    if (target.isDefault) {
      alert('Cannot delete the Default Region. Please set another region as Default first.');
      return;
    }
    if (target.activeJobsCount > 0) {
      alert(`Cannot delete region "${target.name}" because it has ${target.activeJobsCount} active jobs attached. Shutdown the region instead or reassign jobs.`);
      return;
    }
    if (confirm(`Are you sure you want to delete region "${target.name}"?`)) {
      setRegionsList(regionsList.filter((r) => r.id !== regId));
    }
  };

  const handleSaveEditRegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRegion || !editingRegion.name) return;

    const previousTarget = regionsList.find(r => r.id === editingRegion.id);
    const fullFormattedAddress = `${editingRegion.streetAddress ? editingRegion.streetAddress + ', ' : ''}${editingRegion.city ? editingRegion.city + ', ' : ''}${editingRegion.state} ${editingRegion.zip}`.trim();

    const updated = regionsList.map(r => {
      if (r.id === editingRegion.id) {
        return {
          ...r,
          name: editingRegion.name,
          code: editingRegion.code || editingRegion.name.substring(0, 3).toUpperCase(),
          streetAddress: editingRegion.streetAddress,
          city: editingRegion.city,
          state: editingRegion.state,
          zip: editingRegion.zip,
          address: fullFormattedAddress || editingRegion.address,
          timezone: editingRegion.timezone,
        };
      }
      return r;
    });

    setRegionsList(updated);
    if (previousTarget && selectedRegion === previousTarget.name) {
      setSelectedRegion(editingRegion.name);
    }
    setEditingRegion(null);
  };

  const get14DayRange = (centerDateStr: string) => {
    const current = new Date(centerDateStr);
    const days: { dateStr: string; dayName: string; formatted: string; isCenter: boolean }[] = [];
    
    for (let i = -7; i <= 7; i++) {
      const d = new Date(current);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const formatted = `${d.getMonth() + 1}/${d.getDate()}`;
      days.push({ dateStr, dayName, formatted, isCenter: i === 0 });
    }
    return days;
  };

  const calendar14Days = get14DayRange(centerDate);
  const week1Days = calendar14Days.slice(0, 7);
  const week2Days = calendar14Days.slice(7, 15);

  const isDateMatch = (targetDateString?: string, calDay?: { dateStr: string; formatted: string }): boolean => {
    if (!targetDateString || !calDay || targetDateString === 'No Date') return false;
    const cleanTarget = targetDateString.trim();
    if (cleanTarget === calDay.formatted || cleanTarget === calDay.dateStr) return true;

    const parts = cleanTarget.split('/');
    if (parts.length >= 2) {
      const month = parseInt(parts[0], 10);
      const day = parseInt(parts[1], 10);
      const calParts = calDay.formatted.split('/');
      if (calParts.length === 2) {
        const calMonth = parseInt(calParts[0], 10);
        const calDayNum = parseInt(calParts[1], 10);
        if (month === calMonth && day === calDayNum) return true;
      }
    }

    const parsed = new Date(cleanTarget);
    if (!isNaN(parsed.getTime())) {
      const targetFormatted = `${parsed.getMonth() + 1}/${parsed.getDate()}`;
      const targetISO = parsed.toISOString().split('T')[0];
      return targetFormatted === calDay.formatted || targetISO === calDay.dateStr;
    }
    return false;
  };

  const getCalendarMilestonesForDay = (calDay: { dateStr: string; formatted: string }) => {
    const results: Array<{
      key: string;
      job: JobRow;
      phase: 'template' | 'fab' | 'install';
      phaseLabel: string;
      crew: string;
      badgeClass: string;
      cardClass: string;
    }> = [];

    const filtered = jobsData.filter(j => {
      if (calAccountFilter !== 'All' && j.accountName !== calAccountFilter) return false;
      if (calCommunityFilter !== 'All' && j.communityName !== calCommunityFilter) return false;
      return true;
    });

    filtered.forEach(j => {
      // 1. Laser Template Milestone
      if (isDateMatch(j.templateDate?.date, calDay)) {
        results.push({
          key: `${j.id}_template_${calDay.dateStr}`,
          job: j,
          phase: 'template',
          phaseLabel: 'Template',
          crew: 'Laser Templater 1',
          badgeClass: 'bg-blue-600 text-white',
          cardClass: 'bg-blue-50/90 hover:bg-blue-100/90 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-800'
        });
      }

      // 2. Fabrication Milestone
      if (isDateMatch(j.fabDate?.date, calDay)) {
        results.push({
          key: `${j.id}_fab_${calDay.dateStr}`,
          job: j,
          phase: 'fab',
          phaseLabel: 'Fab',
          crew: 'Bridge Saw 1 & CNC',
          badgeClass: 'bg-purple-600 text-white',
          cardClass: 'bg-purple-50/90 hover:bg-purple-100/90 text-purple-900 border-purple-300 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-800'
        });
      }

      // 3. Field Installation Milestone
      if (isDateMatch(j.installDate?.date, calDay)) {
        const isWarranty = j.jobCategory === 'REWORK_WARRANTY';
        results.push({
          key: `${j.id}_install_${calDay.dateStr}`,
          job: j,
          phase: 'install',
          phaseLabel: isWarranty ? 'Warranty Rework' : 'Install',
          crew: j.assignedCrew || 'Install Truck 1',
          badgeClass: isWarranty ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white',
          cardClass: isWarranty 
            ? 'bg-rose-50/90 hover:bg-rose-100/90 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800' 
            : 'bg-emerald-50/90 hover:bg-emerald-100/90 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800'
        });
      }
    });

    return results;
  };

  const shiftCalendarDays = (offsetDays: number) => {
    const d = new Date(centerDate);
    d.setDate(d.getDate() + offsetDays);
    setCenterDate(d.toISOString().split('T')[0]);
  };

  // Open Scoped Create Modal based on active screen context
  const triggerContextualCreate = () => {
    const currentRegionObj = regionsList.find(r => r.name === selectedRegion);
    if (currentRegionObj && currentRegionObj.status === 'SHUTDOWN') {
      alert(`⚠️ Creation Blocked: The region "${selectedRegion}" is currently flagged as SHUTDOWN. No new records (accounts, communities, lots, or jobs) can be created under this region. Please switch to an active location or reactivate this facility in Settings.`);
      return;
    }

    if (activeNav === 'accounts') {
      setCreateScope('account');
      setNewEntityName('');
      setNewEntityCode('');
      setNewEntityAddress('');
      setNewEntityContact('');
      setActiveModal('create');
    } else if (activeNav === 'account_detail' && selectedAccount) {
      setCreateScope('community');
      setNewEntityName('');
      setNewEntityAddress('');
      setNewEntityContact('');
      setActiveModal('create');
    } else if (activeNav === 'community_detail' && selectedCommunity) {
      setCreateScope('lot');
      setNewEntityName('');
      setNewEntityAddress('');
      setActiveModal('create');
    } else if (activeNav === 'jobs') {
      setCreateScope('job');
      setNewEntityName('');
      setActiveModal('create');
    } else if (activeNav === 'job_detail' && selectedJob) {
      setCreateScope('activity');
      setNewActivityName('Stone Quality Walk');
      setActiveModal('create');
    } else if (activeNav === 'settings' && settingsCategory === 'users') {
      setUsersSubSection('External Users');
    }
  };

  // Handle Context-Scoped Creation Submit
  const handleCreateEntity = (e: React.FormEvent) => {
    e.preventDefault();

    if (createScope === 'account') {
      if (!newEntityName) return;
      const newAcc: AccountRow = {
        id: `acc_${Date.now()}`,
        name: newEntityName,
        code: newEntityCode || newEntityName.substring(0, 5).toUpperCase(),
        billingAddress: newEntityAddress || '100 Corporate Blvd',
        phone: newEntityPhone || '(555) 000-0000',
        primaryContact: newEntityContact || 'Account Exec',
        email: newEntityEmail || 'contact@builder.com',
        externalId: `ERP-ACC-${Math.floor(100000 + Math.random() * 900000)}`,
        isArchived: false,
        communities: []
      };
      setAccountsData([newAcc, ...accountsData]);
    } else if (createScope === 'community' && selectedAccount) {
      if (!newEntityName) return;
      const newCom: CommunityRow = {
        id: `com_${Date.now()}`,
        accountId: selectedAccount.id,
        name: newEntityName,
        cityState: newEntityAddress || 'Tampa, FL',
        superintendent: newEntityContact || 'Field Super',
        isArchived: false,
        lots: []
      };
      const updatedAcc = {
        ...selectedAccount,
        communities: [...selectedAccount.communities, newCom]
      };
      setSelectedAccount(updatedAcc);
      setAccountsData(accountsData.map(a => a.id === updatedAcc.id ? updatedAcc : a));
    } else if (createScope === 'lot' && selectedCommunity && selectedAccount) {
      if (!newEntityName) return;
      const newLot: LotRow = {
        id: `lot_${Date.now()}`,
        communityId: selectedCommunity.id,
        lotNumber: newEntityName,
        streetAddress: newEntityAddress || '100 Main St',
        planType: 'Plan Standard',
        isArchived: false
      };
      const updatedCom = {
        ...selectedCommunity,
        lots: [...selectedCommunity.lots, newLot]
      };
      setSelectedCommunity(updatedCom);
      const updatedCommunities = selectedAccount.communities.map(c => c.id === updatedCom.id ? updatedCom : c);
      const updatedAcc = { ...selectedAccount, communities: updatedCommunities };
      setSelectedAccount(updatedAcc);
      setAccountsData(accountsData.map(a => a.id === updatedAcc.id ? updatedAcc : a));
    } else if (createScope === 'job') {
      if (!newEntityName) return;
      const newJob: JobRow = {
        id: String(Date.now()),
        jobName: `${newEntityName}`,
        jobCategory: newJobCategory,
        accountId: 'acc1',
        accountName: newEntityAccount,
        accountCode: 'CUSTOM-FL',
        communityId: 'com1',
        communityName: newEntityCommunity,
        lotNumber: '001099',
        streetAddress: '100 Main St',
        cityStateZip: 'LAKEWOOD RANCH, FL 34211',
        templateDate: { date: 'No Date', status: 'tent' },
        fabDate: { date: 'No Date', status: 'auto' },
        installDate: { date: 'No Date', status: 'calc' },
        salesperson: 'jason mayes',
        externalId: `ERP-JOB-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Active',
        isArchived: false,
        assignedCrew: 'Unassigned',
        materialOrdered: false,
        materialETA: '',
        materialReceived: false,
        materialReceivedOn: '',
        sinksOrdered: false,
        sinksETA: '',
        sinksReceived: false,
        sinksReceivedOn: '',
        purchasingNotes: '',
        installerNotesText: '',
        files: [],
        activities: [
          { id: 'n1', activityName: 'Stone CAD', phase: 'STONE', status: 'Auto-Schedule', startDate: 'No Date', schedTime: '9:00am', duration: '60m', assignedTo: 'CAD Team' },
          { id: 'n2', activityName: 'Stone Install', phase: 'STONE', status: 'Tentative', startDate: 'No Date', schedTime: '8:00am', duration: '180m', assignedTo: 'Install Crew' },
        ]
      };
      setJobsData([newJob, ...jobsData]);
    } else if (createScope === 'activity' && selectedJob) {
      const newAct: JobActivityRow = {
        id: String(Date.now()),
        activityName: newActivityName,
        phase: newActivityPhase,
        status: 'Auto-Schedule',
        startDate: 'No Date',
        schedTime: '9:00am',
        duration: '60m',
        assignedTo: 'Plant Team',
        notes: 'Created via Job Detail view'
      };
      const updated = {
        ...selectedJob,
        activities: [...selectedJob.activities, newAct]
      };
      setSelectedJob(updated);
      setJobsData(jobsData.map(j => j.id === updated.id ? updated : j));
    }

    setNewEntityName('');
    setActiveModal('none');
  };

  const handleSaveView = (e: React.FormEvent) => {
    e.preventDefault();
    if (newViewName && !savedViews.includes(newViewName)) {
      setSavedViews([...savedViews, newViewName]);
      selectSavedView(newViewName);
      setNewViewName('');
    }
    setActiveModal('none');
  };

  const sharedReportsList = [
    { id: 'r1', name: 'Installed Sq Ft by Month (Area-Details Form)', category: 'Production' },
    { id: 'r2', name: 'Installed sq ft by Month (Order Area Form)', category: 'Production' },
    { id: 'r3', name: 'Installed Sq Ft by Month w/ Job Names (Area-Details Form)', category: 'Operations' },
    { id: 'r4', name: 'Jobs by Salesperson', category: 'Sales' },
    { id: 'r5', name: 'Total sales by month (from Orders)', category: 'Financial' },
  ];

  // Contextual Create Button Label & Visibility
  const shouldShowCreateButton =
    activeNav === 'accounts' ||
    activeNav === 'account_detail' ||
    activeNav === 'community_detail' ||
    activeNav === 'jobs' ||
    activeNav === 'job_detail' ||
    (activeNav === 'settings' && settingsCategory === 'users');

  const getCreateButtonLabel = () => {
    if (activeNav === 'accounts') return '+ Create Account';
    if (activeNav === 'account_detail') return '+ Create Community';
    if (activeNav === 'community_detail') return '+ Create Lot';
    if (activeNav === 'jobs') return '+ Create Job';
    if (activeNav === 'job_detail') return '+ Add Activity';
    if (activeNav === 'settings' && settingsCategory === 'users') return '+ Invite User';
    return '+ Create';
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* 1. TOP TOOLBAR & MODULE HEADER */}
      <header className={`border-b shadow-md ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-700'}`}>
        <div className="px-6 py-4 flex items-center justify-between">
          
          {/* Logo / Subscriber Branding Display (h-28 max-w-[500px]) */}
          <div className="flex items-center space-x-4">
            {logoBase64 ? (
              <img src={logoBase64} alt="Subscriber Logo" className="h-28 max-w-[500px] object-contain rounded bg-white/10 p-2 shadow-lg border border-white/20" />
            ) : (
              <div className="h-28 px-8 bg-white/20 rounded-xl flex items-center justify-center font-black text-white text-3xl shadow-xl border border-white/30 tracking-tight">
                {subscriberName}
              </div>
            )}
          </div>

          {/* Global Search Bar */}
          <div className="flex items-center space-x-1 bg-white rounded-md p-1 border border-slate-200 shadow-sm text-slate-900">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="bg-white text-xs font-semibold px-2 py-1 focus:outline-none cursor-pointer text-slate-800 rounded"
            >
              <option value="All" className="text-slate-900 bg-white">All</option>
              <option value="Accounts" className="text-slate-900 bg-white">Accounts</option>
              <option value="Jobs" className="text-slate-900 bg-white">Jobs</option>
              <option value="Lots" className="text-slate-900 bg-white">Lots</option>
            </select>
            <div className="h-6 w-[2px] bg-black mx-1"></div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-xs px-2.5 py-1 focus:outline-none placeholder-slate-400 text-slate-900 w-40 md:w-56"
            />
            <button className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded transition-all">
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Top Action Buttons (Conditioned strictly to relevant pages!) */}
          <div className="flex items-center space-x-4 md:space-x-6 text-xs font-medium">
            
            {/* View Controls: Visible on Accounts and Jobs grid pages */}
            {(activeNav === 'accounts' || activeNav === 'jobs') && (
              <>
                <button
                  onClick={() => setActiveModal('views')}
                  className="flex flex-col items-center space-y-1 hover:opacity-80 transition-all cursor-pointer"
                >
                  <Eye className="w-5 h-5" />
                  <span>Views</span>
                </button>

                <button
                  onClick={() => setActiveModal('customize')}
                  className="flex flex-col items-center space-y-1 hover:opacity-80 transition-all cursor-pointer"
                >
                  <Sliders className="w-5 h-5" />
                  <span>Customize</span>
                </button>

                <button
                  onClick={() => setActiveModal('save_view')}
                  className="flex flex-col items-center space-y-1 hover:opacity-80 transition-all cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  <span>Save View</span>
                </button>

                <button
                  onClick={() => exportTableToCsv(activeNav as any)}
                  className="flex flex-col items-center space-y-1 hover:opacity-80 transition-all cursor-pointer text-emerald-200 hover:text-emerald-100"
                  title="Export Scoped CSV"
                >
                  <Download className="w-5 h-5" />
                  <span>Export CSV</span>
                </button>
              </>
            )}

            {/* Context-Scoped Create Action Button */}
            {shouldShowCreateButton && (
              <button
                onClick={triggerContextualCreate}
                className="flex items-center space-x-1.5 hover:opacity-90 transition-all bg-white/20 px-3.5 py-2 rounded-md border border-white/30 shadow-sm cursor-pointer font-bold text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>{getCreateButtonLabel()}</span>
              </button>
            )}

            {/* Active Module Title */}
            <div className="pl-4 border-l border-white/20 text-xl font-bold tracking-tight">
              {activeNav === 'accounts' && 'Accounts'}
              {activeNav === 'account_detail' && 'Account Detail'}
              {activeNav === 'community_detail' && 'Community Detail'}
              {activeNav === 'jobs' && 'Jobs'}
              {activeNav === 'job_detail' && 'Job Detail'}
              {activeNav === 'change_log' && 'Change Log'}
              {activeNav === 'calendar' && 'Calendar'}
              {activeNav === 'reports' && 'Reports'}
              {activeNav === 'forms' && 'Form Packets'}
              {activeNav === 'settings' && 'Settings'}
              {activeNav === 'help' && 'Help'}
            </div>
          </div>

          {/* Right Utilities (Role Switcher, Theme & Region) */}
          <div className="flex items-center space-x-3 text-xs">
            {/* Active Role Simulator */}
            <div className="flex items-center space-x-1.5 bg-white/10 px-2.5 py-1.5 rounded-md border border-white/20 shadow-xs">
              <Shield className="w-3.5 h-3.5 text-blue-200" />
              <select
                value={activeUserRole}
                onChange={(e) => setActiveUserRole(e.target.value as any)}
                className="bg-transparent text-[11px] font-bold text-white focus:outline-none cursor-pointer"
                title="Simulate Role (RBAC)"
              >
                <option value="SUBSCRIBER_ADMIN" className="text-slate-900">👑 Admin (Full Access)</option>
                <option value="INTERNAL_OFFICE_USER" className="text-slate-900">🏢 Office Dispatch / Scheduler</option>
                <option value="INTERNAL_ESTIMATOR" className="text-slate-900">📐 Estimator</option>
                <option value="EXTERNAL_FIELD_INSTALLER" className="text-slate-900">🚐 Field Crew (Apex Crew A)</option>
                <option value="EXTERNAL_SUBCONTRACTOR" className="text-slate-900">🛠️ Subcontractor</option>
              </select>
            </div>

            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-blue-100" />}
              <span className="font-semibold">{isDark ? 'Light' : 'Dark'}</span>
            </button>

            {/* Shutdown Region Alert Indicator */}
            {regionsList.find(r => r.name === selectedRegion)?.status === 'SHUTDOWN' && (
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-rose-600 text-white rounded-md border border-rose-300 text-[11px] font-black tracking-wide shadow-md animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>SHUTDOWN / READ-ONLY</span>
              </div>
            )}

            <div className="flex items-center space-x-1 bg-white/10 border border-white/20 px-2.5 py-1.5 rounded-md">
              <MapPin className="w-4 h-4 text-white" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-transparent font-semibold focus:outline-none cursor-pointer text-white"
              >
                {regionsList.map((r) => (
                  <option key={r.id} value={r.name} className="text-slate-900 font-bold">
                    {r.name} {r.status === 'SHUTDOWN' ? '[SHUTDOWN]' : r.isDefault ? '[DEFAULT]' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* External Field Installer Role Banner */}
      {(activeUserRole === 'EXTERNAL_FIELD_INSTALLER' || activeUserRole === 'EXTERNAL_SUBCONTRACTOR') && (
        <div className="bg-amber-500 text-slate-950 font-black text-xs px-6 py-2 flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-2">
            <span className="text-base">🚐</span>
            <span>FIELD PORTAL ACTIVE: Scoped strictly to tasks assigned to <span className="underline">{activeAssigneeName}</span>. Milestone dates are read-only; financial records and other crew tasks are hidden.</span>
          </div>
          <button
            onClick={() => setActiveUserRole('SUBSCRIBER_ADMIN')}
            className="px-2.5 py-0.5 bg-slate-950 text-white rounded text-[10px] hover:bg-slate-800 cursor-pointer"
          >
            Switch to Admin Mode
          </button>
        </div>
      )}

      {/* 2. BODY LAYOUT (SIDEBAR + MAIN CONTENT) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT NAVIGATION SIDEBAR (Accounts is positioned ABOVE Jobs!) */}
        <aside className={`w-52 border-r flex flex-col justify-between shrink-0 shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-300'}`}>
          <nav className="p-2 space-y-1 text-xs font-semibold">
            
            {/* 1. ACCOUNTS (POSITIONED ABOVE JOBS) */}
            <button
              onClick={() => setActiveNav('accounts')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-left transition-all ${
                activeNav === 'accounts' || activeNav === 'account_detail' || activeNav === 'community_detail'
                  ? isDark ? 'bg-blue-900/60 text-blue-300 font-bold border-l-4 border-blue-500' : 'bg-blue-600 text-white font-bold shadow-sm'
                  : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Accounts</span>
            </button>

            {/* 2. JOBS */}
            <button
              onClick={() => setActiveNav('jobs')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-left transition-all ${
                activeNav === 'jobs' || activeNav === 'job_detail' || activeNav === 'change_log'
                  ? isDark ? 'bg-blue-900/60 text-blue-300 font-bold border-l-4 border-blue-500' : 'bg-blue-600 text-white font-bold shadow-sm'
                  : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Jobs</span>
            </button>

            {/* 3. CALENDAR */}
            <button
              onClick={() => setActiveNav('calendar')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-left transition-all ${
                activeNav === 'calendar'
                  ? isDark ? 'bg-blue-900/60 text-blue-300 font-bold border-l-4 border-blue-500' : 'bg-blue-600 text-white font-bold shadow-sm'
                  : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Calendar</span>
            </button>

            {/* 4. FORM PACKETS */}
            <button
              onClick={() => setActiveNav('forms')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-left transition-all ${
                activeNav === 'forms'
                  ? isDark ? 'bg-blue-900/60 text-blue-300 font-bold border-l-4 border-blue-500' : 'bg-blue-600 text-white font-bold shadow-sm'
                  : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Form Packets</span>
            </button>

            {/* 5. REPORTS */}
            <button
              onClick={() => setActiveNav('reports')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-left transition-all ${
                activeNav === 'reports'
                  ? isDark ? 'bg-blue-900/60 text-blue-300 font-bold border-l-4 border-blue-500' : 'bg-blue-600 text-white font-bold shadow-sm'
                  : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports</span>
            </button>

            {/* 6. SETTINGS */}
            <button
              onClick={() => setActiveNav('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-left transition-all ${
                activeNav === 'settings'
                  ? isDark ? 'bg-blue-900/60 text-blue-300 font-bold border-l-4 border-blue-500' : 'bg-blue-600 text-white font-bold shadow-sm'
                  : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            {/* 7. HELP */}
            <button
              onClick={() => setActiveNav('help')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-left transition-all ${
                activeNav === 'help'
                  ? isDark ? 'bg-blue-900/60 text-blue-300 font-bold border-l-4 border-blue-500' : 'bg-blue-600 text-white font-bold shadow-sm'
                  : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </button>
          </nav>

          <div className={`p-3 border-t text-xs ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-300 bg-slate-100'}`}>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                👤
              </div>
              <div className="overflow-hidden">
                <div className="font-bold truncate text-slate-800 dark:text-slate-200">SAPIntegration</div>
                <div className="text-[10px] text-emerald-500 font-medium">● Connected</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT CANVAS */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          {/* SCREEN 0: ACCOUNTS LIST / GRID VIEW */}
          {activeNav === 'accounts' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Account View Filter Subheader */}
              <div className={`px-4 py-2 border-b flex items-center justify-between text-xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-slate-500">Account View:</span>
                    <select
                      value={accountView}
                      onChange={(e) => setAccountView(e.target.value)}
                      className={`font-bold rounded border px-2 py-1 focus:outline-none cursor-pointer ${isDark ? 'bg-slate-950 border-slate-700 text-blue-400' : 'bg-slate-50 border-slate-300 text-blue-700'}`}
                    >
                      <option value="All Active Accounts">All Active Accounts</option>
                      <option value="Archived Accounts">Archived Accounts</option>
                      <option value="High Volume Builders">High Volume Builders</option>
                    </select>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Showing <strong className="text-blue-500">{filteredAccounts.length}</strong> of <strong className="text-slate-500">{accountsData.length}</strong> builder accounts
                </div>
              </div>

              {/* Accounts Grid Table */}
              <div className="flex-1 overflow-auto p-4">
                <div className={`border rounded-lg overflow-hidden shadow-md ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className={`${isDark ? 'bg-blue-950 text-blue-200 border-b border-slate-800' : 'bg-blue-600 text-white'}`}>
                        <th className="p-3 font-bold border-r border-white/20">Builder Account Name</th>
                        <th className="p-3 font-bold border-r border-white/20">Code</th>
                        <th className="p-3 font-bold border-r border-white/20">Billing Address</th>
                        <th className="p-3 font-bold border-r border-white/20">Primary Contact</th>
                        <th className="p-3 font-bold border-r border-white/20 text-center">Subdivisions</th>
                        <th className="p-3 font-bold border-r border-white/20 text-center">Total Lots</th>
                        <th className="p-3 font-bold border-r border-white/20 text-center">Status</th>
                        <th className="p-3 font-bold text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {filteredAccounts.map((acc, idx) => {
                        const totalLots = acc.communities.reduce((sum, c) => sum + c.lots.length, 0);
                        return (
                          <tr
                            key={acc.id}
                            onClick={() => openAccountDetailScreen(acc)}
                            className={`transition-colors cursor-pointer ${
                              idx % 2 === 0
                                ? isDark ? 'bg-slate-900/60' : 'bg-white'
                                : isDark ? 'bg-slate-950/40' : 'bg-blue-50/40'
                            } hover:bg-blue-100/50 dark:hover:bg-slate-800/80`}
                          >
                            <td className="p-3 font-bold text-blue-700 dark:text-blue-400 hover:underline">
                              <div>{acc.name}</div>
                              {acc.externalId && (
                                <span className="text-[10px] text-slate-400 font-mono no-underline">
                                  ID: {acc.externalId}
                                </span>
                              )}
                            </td>
                            <td className="p-3 font-mono font-semibold">{acc.code}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-400">{acc.billingAddress}</td>
                            <td className="p-3">
                              <div className="font-semibold">{acc.primaryContact}</div>
                              <div className="text-[10px] text-slate-400">{acc.email}</div>
                            </td>
                            <td className="p-3 text-center font-bold text-blue-600">{acc.communities.length}</td>
                            <td className="p-3 text-center font-bold text-purple-600">{totalLots}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                acc.isArchived ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}>
                                {acc.isArchived ? 'Archived' : 'Active'}
                              </span>
                            </td>
                            <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={(e) => handleToggleArchiveAccount(acc.id, e)}
                                  title={acc.isArchived ? 'Restore from Archive' : 'Archive Account'}
                                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-amber-600"
                                >
                                  {acc.isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                                </button>

                                <button
                                  onClick={(e) => handleDeleteAccount(acc, e)}
                                  title={acc.communities.length > 0 ? 'Cannot delete account with child communities' : 'Delete Account'}
                                  className={`p-1 rounded ${
                                    acc.communities.length > 0
                                      ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                      : 'hover:bg-rose-100 text-rose-600 cursor-pointer'
                                  }`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 0B: ACCOUNT DETAIL VIEW (DRILL INTO SUBDIVISIONS / COMMUNITIES) */}
          {activeNav === 'account_detail' && selectedAccount && (
            <div className="flex-1 overflow-auto flex flex-col p-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActiveNav('accounts')}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center space-x-1 font-bold text-xs cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Accounts List</span>
                  </button>
                  <h2 className="text-xl font-black text-blue-600 dark:text-blue-400">
                    Account: {selectedAccount.name}
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleArchiveAccount(selectedAccount.id)}
                    className="px-3 py-1.5 rounded border text-xs font-bold flex items-center space-x-1.5 cursor-pointer bg-slate-100 dark:bg-slate-800"
                  >
                    {selectedAccount.isArchived ? <ArchiveRestore className="w-3.5 h-3.5 text-emerald-600" /> : <Archive className="w-3.5 h-3.5 text-amber-600" />}
                    <span>{selectedAccount.isArchived ? 'Restore Account' : 'Archive Account'}</span>
                  </button>

                  <button
                    onClick={() => { setCreateScope('community'); setActiveModal('create'); }}
                    className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded text-xs flex items-center space-x-1.5 hover:bg-blue-500 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Subdivision / Community</span>
                  </button>
                </div>
              </div>

              {/* Account Overview Card */}
              <div className={`p-6 rounded-xl border text-xs space-y-4 shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 border-b pb-2 flex items-center justify-between">
                  <span>Account Information</span>
                  <button className="text-blue-600 font-bold flex items-center space-x-1 hover:underline">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Information</span>
                  </button>
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div><span className="text-slate-400 font-semibold block">Account Code:</span> <strong className="font-mono">{selectedAccount.code}</strong></div>
                  <div><span className="text-slate-400 font-semibold block">Primary Contact:</span> <strong>{selectedAccount.primaryContact} ({selectedAccount.email})</strong></div>
                  <div><span className="text-slate-400 font-semibold block">Phone:</span> <span>{selectedAccount.phone}</span></div>
                  <div><span className="text-slate-400 font-semibold block">Corporate Billing Address:</span> <span>{selectedAccount.billingAddress}</span></div>
                  <div><span className="text-slate-400 font-semibold block">ERP Sync ID:</span> <span className="font-mono">{selectedAccount.externalId || '--'}</span></div>
                  <div><span className="text-slate-400 font-semibold block">Status:</span> <span className={`px-2 py-0.5 rounded font-bold ${selectedAccount.isArchived ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{selectedAccount.isArchived ? 'Archived' : 'Active'}</span></div>
                </div>
              </div>

              {/* Communities (Subdivisions) Hierarchy List */}
              <div className={`rounded-xl border overflow-hidden shadow-md ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center space-x-2">
                    <Home className="w-4 h-4 text-blue-600" />
                    <span>Subdivisions & Communities ({selectedAccount.communities.length})</span>
                  </h3>
                  <button
                    onClick={() => { setCreateScope('community'); setActiveModal('create'); }}
                    className="text-xs text-blue-600 font-bold hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Subdivision</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  {selectedAccount.communities.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 italic">
                      No subdivisions or communities created for this account yet. Click "+ Create Subdivision / Community" above to add one.
                    </div>
                  ) : (
                    selectedAccount.communities.map((com) => (
                      <div
                        key={com.id}
                        onClick={() => openCommunityDetailScreen(com)}
                        className="p-4 flex items-center justify-between hover:bg-blue-50/50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-sm text-blue-600 dark:text-blue-400 hover:underline">{com.name}</div>
                          <div className="text-slate-500">Location: {com.cityState} • Site Super: <strong>{com.superintendent}</strong></div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="px-2.5 py-1 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold">
                            {com.lots.length} Lots Configured
                          </span>

                          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => handleToggleArchiveCommunity(com.id, e)}
                              title="Archive Community"
                              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-amber-600"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteCommunity(com, e)}
                              title={com.lots.length > 0 ? 'Cannot delete community with child lots' : 'Delete Community'}
                              className={`p-1 rounded ${
                                com.lots.length > 0
                                  ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                  : 'hover:bg-rose-100 text-rose-600 cursor-pointer'
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 0C: COMMUNITY DETAIL VIEW (MANAGE LOTS & CHILD JOBS) */}
          {activeNav === 'community_detail' && selectedCommunity && selectedAccount && (
            <div className="flex-1 overflow-auto flex flex-col p-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActiveNav('account_detail')}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center space-x-1 font-bold text-xs cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Account</span>
                  </button>
                  <h2 className="text-xl font-black text-blue-600 dark:text-blue-400">
                    Subdivision: {selectedCommunity.name} ({selectedAccount.name})
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => { setCreateScope('lot'); setActiveModal('create'); }}
                    className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded text-xs flex items-center space-x-1.5 hover:bg-blue-500 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Lot</span>
                  </button>
                </div>
              </div>

              {/* Community Lots Table */}
              <div className={`rounded-xl border overflow-hidden shadow-md ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <span>Lots & Assigned Jobs ({selectedCommunity.lots.length})</span>
                  </h3>
                </div>

                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`${isDark ? 'bg-blue-950 text-blue-200 border-b border-slate-800' : 'bg-blue-600 text-white'}`}>
                      <th className="p-3 font-bold border-r border-white/20">Lot #</th>
                      <th className="p-3 font-bold border-r border-white/20">Physical Street Address</th>
                      <th className="p-3 font-bold border-r border-white/20">Plan / Elevation</th>
                      <th className="p-3 font-bold border-r border-white/20">Linked Job Orders</th>
                      <th className="p-3 font-bold text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {selectedCommunity.lots.map((lot, idx) => {
                      const linkedJobs = jobsData.filter(j => j.lotNumber === lot.lotNumber);
                      return (
                        <tr key={lot.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-800/60">
                          <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{lot.lotNumber}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-300 font-medium">{lot.streetAddress}</td>
                          <td className="p-3 text-slate-500">{lot.planType}</td>
                          <td className="p-3">
                            {linkedJobs.length > 0 ? (
                              linkedJobs.map(j => (
                                <span
                                  key={j.id}
                                  onClick={() => openJobDetailScreen(j)}
                                  className="inline-block mr-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold cursor-pointer hover:underline"
                                >
                                  {j.jobName}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 italic">No Jobs Attached</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                const updatedLots = selectedCommunity.lots.filter(l => l.id !== lot.id);
                                const updatedCom = { ...selectedCommunity, lots: updatedLots };
                                setSelectedCommunity(updatedCom);
                                const updatedComms = selectedAccount.communities.map(c => c.id === updatedCom.id ? updatedCom : c);
                                const updatedAcc = { ...selectedAccount, communities: updatedComms };
                                setSelectedAccount(updatedAcc);
                                setAccountsData(accountsData.map(a => a.id === updatedAcc.id ? updatedAcc : a));
                              }}
                              className="text-rose-600 hover:text-rose-800 p-1"
                              title="Delete Lot"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SCREEN 1: JOBS TABLE GRID */}
          {activeNav === 'jobs' && (
            <div className="flex-1 overflow-auto p-4">
              <div className={`border rounded-lg overflow-hidden shadow-md ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
                {filteredJobs.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <div className="font-bold text-sm">No jobs match the selected view criteria</div>
                    <div className="text-xs text-slate-500 mt-1">Try switching back to "Standard View" or clearing your filters.</div>
                    <button
                      onClick={() => selectSavedView('Standard View')}
                      className="mt-4 bg-blue-600 text-white font-bold px-4 py-2 rounded text-xs cursor-pointer"
                    >
                      Reset to Standard View
                    </button>
                  </div>
                ) : (
                  <table className={`w-full text-left text-xs border-collapse ${compactDensity ? 'p-1' : ''}`}>
                    <thead>
                      <tr className={`${isDark ? 'bg-blue-950 text-blue-200 border-b border-slate-800' : 'bg-blue-600 text-white'}`}>
                        {visibleColumns.jobName && <th className="p-3 font-bold border-r border-white/20">Job Name / Lot</th>}
                        {visibleColumns.account && <th className="p-3 font-bold border-r border-white/20">Account (Builder)</th>}
                        {visibleColumns.community && <th className="p-3 font-bold border-r border-white/20">Community</th>}
                        {visibleColumns.templateDate && <th className="p-3 font-bold border-r border-white/20 text-center">Stone Template - Date ✏️</th>}
                        {visibleColumns.fabDate && <th className="p-3 font-bold border-r border-white/20 text-center">Stone Fabrication - Date ✏️</th>}
                        {visibleColumns.installDate && <th className="p-3 font-bold border-r border-white/20 text-center">Stone Install - Date ✏️</th>}
                        {visibleColumns.salesperson && <th className="p-3 font-bold border-r border-white/20">Salesperson</th>}
                        {visibleColumns.issues && <th className="p-3 font-bold">Category / Issues</th>}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {filteredJobs.map((row, idx) => (
                        <tr
                          key={row.id}
                          onClick={() => openJobDetailScreen(row)}
                          className={`transition-colors cursor-pointer ${
                            idx % 2 === 0
                              ? isDark ? 'bg-slate-900/60' : 'bg-white'
                              : isDark ? 'bg-slate-950/40' : 'bg-blue-50/40'
                          } hover:bg-blue-100/50 dark:hover:bg-slate-800/80`}
                        >
                          {visibleColumns.jobName && (
                            <td className="p-3 font-semibold text-blue-700 dark:text-blue-400 hover:underline">
                              <div>{row.jobName}</div>
                              {row.externalId && (
                                <span className="text-[10px] text-slate-400 font-mono no-underline">
                                  ERP Order: {row.externalId}
                                </span>
                              )}
                            </td>
                          )}

                          {visibleColumns.account && (
                            <td className="p-3 font-semibold text-blue-800 dark:text-blue-300 hover:underline">
                              {row.accountName}
                            </td>
                          )}

                          {visibleColumns.community && (
                            <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                              {row.communityName} ({row.lotNumber})
                            </td>
                          )}

                          {/* Editable Date Cells */}
                          {visibleColumns.templateDate && (
                            <td className="p-3 text-center font-medium hover:bg-blue-200/40" onClick={(e) => openDateEditor(row, e)}>
                              <span className={`underline font-semibold cursor-pointer group flex items-center justify-center space-x-1 ${
                                row.templateDate.status === 'auto' ? 'text-purple-600 dark:text-purple-400' :
                                row.templateDate.status === 'calc' ? 'text-purple-600 dark:text-purple-400' :
                                row.templateDate.status === 'conf' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                              }`}>
                                <span>{row.templateDate.date} ({row.templateDate.status})</span>
                                <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                              </span>
                            </td>
                          )}

                          {visibleColumns.fabDate && (
                            <td className="p-3 text-center font-medium hover:bg-blue-200/40" onClick={(e) => openDateEditor(row, e)}>
                              <span className={`underline font-semibold cursor-pointer group flex items-center justify-center space-x-1 ${
                                row.fabDate.status === 'auto' ? 'text-purple-600 dark:text-purple-400' :
                                row.fabDate.status === 'calc' ? 'text-purple-600 dark:text-purple-400' :
                                row.fabDate.status === 'conf' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                              }`}>
                                <span>{row.fabDate.date} ({row.fabDate.status})</span>
                                <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                              </span>
                            </td>
                          )}

                          {visibleColumns.installDate && (
                            <td className="p-3 text-center font-medium hover:bg-blue-200/40" onClick={(e) => openDateEditor(row, e)}>
                              <span className={`underline font-semibold cursor-pointer group flex items-center justify-center space-x-1 ${
                                row.installDate.status === 'auto' ? 'text-purple-600 dark:text-purple-400' :
                                row.installDate.status === 'calc' ? 'text-purple-600 dark:text-purple-400' :
                                row.installDate.status === 'conf' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                              }`}>
                                <span>{row.installDate.date} ({row.installDate.status})</span>
                                <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                              </span>
                            </td>
                          )}

                          {visibleColumns.salesperson && (
                            <td className="p-3 text-slate-700 dark:text-slate-300">
                              {row.salesperson}
                            </td>
                          )}

                          {visibleColumns.issues && (
                            <td className="p-3">
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  row.jobCategory === 'INITIAL_INSTALL' ? 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950 dark:text-blue-300' :
                                  row.jobCategory === 'REWORK_WARRANTY' ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950 dark:text-rose-300' :
                                  'bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                                }`}>
                                  {row.jobCategory}
                                </span>
                                {row.jobIssues && (
                                  <span className="text-[11px] font-semibold text-rose-600 flex items-center space-x-1">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{row.jobIssues}</span>
                                  </span>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* SCREEN 2: DEDICATED FULL JOB DETAIL VIEW */}
          {activeNav === 'job_detail' && selectedJob && (
            <div className="flex-1 overflow-auto flex flex-col">
              <div className={`px-6 py-3 border-b flex items-center justify-between ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setActiveNav(jobDetailOriginNav)}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center space-x-1 font-bold text-xs cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>
                      {jobDetailOriginNav === 'calendar' && 'Back to Calendar'}
                      {jobDetailOriginNav === 'jobs' && 'Back to Jobs List'}
                      {jobDetailOriginNav === 'community_detail' && 'Back to Community'}
                      {jobDetailOriginNav === 'accounts' && 'Back to Accounts'}
                    </span>
                  </button>

                  <h2 className="text-base font-black text-blue-600 dark:text-blue-400 tracking-tight">
                    JOB: {selectedJob.jobName}
                  </h2>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setPrintJobPacketJob(selectedJob)}
                    className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm cursor-pointer"
                    title="Print Clipboard Job Packet"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Job Packet</span>
                  </button>

                  <button
                    onClick={() => setPhaseFilter(phaseFilter === 'ALL' ? 'STONE' : 'ALL')}
                    className={`px-3 py-1.5 rounded border text-xs font-bold flex items-center space-x-1.5 cursor-pointer ${
                      phaseFilter === 'STONE' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter Phases {phaseFilter !== 'ALL' && `(${phaseFilter})`}</span>
                  </button>

                  <button
                    onClick={openChangeLogScreen}
                    className="px-3 py-1.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 text-xs font-bold flex items-center space-x-1.5 hover:bg-blue-100 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Change Log</span>
                  </button>

                  {activeUserRole !== 'EXTERNAL_FIELD_INSTALLER' && activeUserRole !== 'EXTERNAL_SUBCONTRACTOR' && (
                    <button
                      onClick={() => openDateEditor(selectedJob)}
                      className="px-3 py-1.5 rounded bg-blue-600 text-white text-xs font-bold flex items-center space-x-1.5 hover:bg-blue-500 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Dates</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6 flex-1 overflow-auto">
                {/* External Portal Role Notice on Job Detail */}
                {(activeUserRole === 'EXTERNAL_FIELD_INSTALLER' || activeUserRole === 'EXTERNAL_SUBCONTRACTOR') && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-lg text-xs flex items-center justify-between text-amber-900 dark:text-amber-200 font-semibold">
                    <span>🔒 Field Crew Access Mode: You are viewing only your assigned task. Milestone dates are locked; fill out required sign-off forms below to complete your task.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                  <div className={`lg:col-span-7 p-5 rounded-lg border space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Job Info</h3>
                      {activeUserRole !== 'EXTERNAL_FIELD_INSTALLER' && activeUserRole !== 'EXTERNAL_SUBCONTRACTOR' && (
                        <button className="text-slate-400 hover:text-blue-600 cursor-pointer">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      <div><span className="text-slate-400 font-semibold block">Job Name:</span> <strong className="text-blue-600 dark:text-blue-400">{selectedJob.jobName}</strong></div>
                      <div><span className="text-slate-400 font-semibold block">Account:</span> <strong>{selectedJob.accountName}</strong></div>
                      <div><span className="text-slate-400 font-semibold block">Creation Date:</span> <span>6/15/2026</span></div>
                      <div><span className="text-slate-400 font-semibold block">Target Install Date:</span> <strong className="text-amber-600">{selectedJob.targetInstallDate || '7/25/2026'}</strong></div>
                      <div><span className="text-slate-400 font-semibold block">Community / Lot #:</span> <strong>{selectedJob.communityName} / {selectedJob.lotNumber}</strong></div>
                      <div><span className="text-slate-400 font-semibold block">Project #:</span> <span>{selectedJob.projectNumber || '0001017193'}</span></div>
                      <div><span className="text-slate-400 font-semibold block">Sales Order #:</span> <span>{selectedJob.salesOrderNumber || 'SO-99201'}</span></div>
                      <div><span className="text-slate-400 font-semibold block">Builder Phase:</span> <span>{selectedJob.builderPhase || 'PHASE ONE'}</span></div>
                      <div><span className="text-slate-400 font-semibold block">Field Super:</span> <span>{selectedJob.fieldSuper || 'Mark Stevens'}</span></div>
                      <div><span className="text-slate-400 font-semibold block">Designer:</span> <span>{selectedJob.designer || 'Elena Rostova'}</span></div>
                    </div>

                    {selectedJob.jobNotes && (
                      <div className="pt-2 border-t text-slate-600 dark:text-slate-300">
                        <span className="text-slate-400 font-semibold block mb-0.5">Notes:</span>
                        <p className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800">{selectedJob.jobNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className={`p-4 rounded-lg border space-y-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center space-x-1.5 font-bold text-sm">
                          <MapPin className="w-4 h-4 text-rose-600" />
                          <span>Job Site Address</span>
                        </div>
                        <button className="text-slate-400 hover:text-blue-600"><MapIcon className="w-4 h-4" /></button>
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{selectedJob.streetAddress}</div>
                      <div className="text-slate-500">{selectedJob.cityStateZip}</div>
                    </div>

                    {/* Hide corporate billing and financial info for external field crews */}
                    {activeUserRole !== 'EXTERNAL_FIELD_INSTALLER' && activeUserRole !== 'EXTERNAL_SUBCONTRACTOR' && (
                      <>
                        <div className={`p-4 rounded-lg border space-y-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
                          <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center space-x-1.5 font-bold text-sm">
                              <Building2 className="w-4 h-4 text-blue-600" />
                              <span>Corporate Account Address</span>
                            </div>
                          </div>
                          <div className="text-slate-500">{selectedJob.accountCode} - Corporate Billing (Tampa Regional Hub)</div>
                        </div>

                        <div className={`p-4 rounded-lg border space-y-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
                          <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center space-x-1.5 font-bold text-sm">
                              <Users className="w-4 h-4 text-emerald-600" />
                              <span>Account Contacts</span>
                            </div>
                          </div>
                          <div className="font-bold">{selectedJob.fieldSuper || 'Mark Stevens'} (Site Super)</div>
                          <div className="text-slate-500">(813) 555-0192 • mstevens@builder.com</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Job Activities Table (Strictly Scoped by Assignee when External) */}
                <div className={`rounded-lg border overflow-hidden shadow-md ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
                  <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-950">
                    <h3 className="font-bold text-sm">
                      Job Activities {activeUserRole.startsWith('EXTERNAL_') && `(Scoped to ${activeAssigneeName})`}
                    </h3>
                    {activeUserRole !== 'EXTERNAL_FIELD_INSTALLER' && activeUserRole !== 'EXTERNAL_SUBCONTRACTOR' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => { setCreateScope('activity'); setActiveModal('create'); }}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-blue-600 cursor-pointer"
                          title="Add Activity"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className={`${isDark ? 'bg-blue-950 text-blue-200 border-b border-slate-800' : 'bg-blue-600 text-white'}`}>
                        <th className="p-3 font-bold border-r border-white/20">Activity</th>
                        <th className="p-3 font-bold border-r border-white/20">Phase</th>
                        <th className="p-3 font-bold border-r border-white/20">Status</th>
                        <th className="p-3 font-bold border-r border-white/20 text-center">Start Date</th>
                        <th className="p-3 font-bold border-r border-white/20 text-center">Sched Time</th>
                        <th className="p-3 font-bold border-r border-white/20">Assigned To</th>
                        <th className="p-3 font-bold text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {selectedJob.activities
                        .filter(a => {
                          if (phaseFilter !== 'ALL' && a.phase !== phaseFilter) return false;
                          // External users ONLY see their assigned activities!
                          if (activeUserRole === 'EXTERNAL_FIELD_INSTALLER' || activeUserRole === 'EXTERNAL_SUBCONTRACTOR') {
                            return a.assignedTo === activeAssigneeName || a.activityName.toLowerCase().includes('install');
                          }
                          return true;
                        })
                        .map((act, i) => (
                          <tr
                            key={act.id}
                            className={`transition-colors ${
                              i % 2 === 0
                                ? isDark ? 'bg-slate-900/60' : 'bg-white'
                                : isDark ? 'bg-slate-950/40' : 'bg-blue-50/40'
                            } hover:bg-blue-100/50 dark:hover:bg-slate-800/80`}
                          >
                            <td className="p-3 font-semibold text-blue-700 dark:text-blue-400">{act.activityName}</td>
                            <td className="p-3 font-mono text-slate-500">{act.phase}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                act.status === 'Complete' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                                act.status === 'In Progress' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                                act.status === 'CALCULATED' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                                'bg-slate-100 text-slate-800 border border-slate-300'
                              }`}>
                                {act.status}
                              </span>
                            </td>
                            <td className="p-3 text-center font-medium">{act.startDate}</td>
                            <td className="p-3 text-center text-slate-500">{act.schedTime || '--'}</td>
                            <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">{act.assignedTo || 'Unassigned'}</td>
                            <td className="p-3 text-center">
                              {act.status !== 'Complete' ? (
                                <button
                                  onClick={() => handleActivityCompletionCheck(selectedJob, act)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold shadow-xs cursor-pointer"
                                >
                                  ✓ Mark Complete
                                </button>
                              ) : (
                                <span className="text-emerald-600 font-bold text-xs">Completed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Job Issues & 1-Click Warranty Rework Generator Section */}
                <div className={`p-4 rounded-lg border space-y-3 text-xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-bold text-sm flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Job Issues & Punch List</span>
                    </h4>
                  </div>

                  {jobIssuesList.filter(i => i.jobId === selectedJob.id || i.lotNumber === selectedJob.lotNumber).length > 0 ? (
                    <div className="space-y-3">
                      {jobIssuesList.filter(i => i.jobId === selectedJob.id || i.lotNumber === selectedJob.lotNumber).map((issue) => (
                        <div key={issue.id} className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black">{issue.status.toUpperCase()}</span>
                              <strong className="text-rose-900 dark:text-rose-200 text-xs">{issue.category}</strong>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 mt-1">{issue.description}</p>
                            <span className="text-[10px] text-slate-400">Logged on: {issue.loggedAt}</span>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {!issue.hasWarrantyOrder ? (
                              <button
                                onClick={() => handleGenerateWarrantyRework(selectedJob, issue)}
                                className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center space-x-1 shadow-sm cursor-pointer"
                              >
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>Generate Warranty / Rework Task</span>
                              </button>
                            ) : (
                              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-bold text-[11px]">
                                ✓ Warranty Task Generated
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-400 italic py-2">No Job Issues Logged on this Order</div>
                  )}
                </div>

                {/* Dynamic Builder Custom Forms & Digital Signature */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold flex items-center space-x-2">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                      <span>Custom Builder Sign-Off & Inspection Forms</span>
                    </h3>
                  </div>

                  {builderFormTemplates.filter(t => t.accountId === selectedJob.accountId || selectedJob.accountName.includes('PERRY') || selectedJob.accountName.includes('TOLL')).map((template) => {
                    const submissionKey = `${selectedJob.id}_${template.id}`;
                    const currentValues = formSubmissions[submissionKey] || {};

                    return (
                      <div key={template.id} className={`rounded-lg border overflow-hidden text-xs shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
                        <div
                          onClick={() => setOpenForms({ ...openForms, dynamicForm: !openForms.dynamicForm })}
                          className="p-3 bg-slate-50 dark:bg-slate-950 flex items-center justify-between cursor-pointer border-b hover:bg-slate-100"
                        >
                          <div className="flex items-center space-x-2 font-bold">
                            {openForms.dynamicForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            <span>{template.formName}</span>
                            {template.isRequiredForCompletion && (
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold">
                                Required For Activity Completion
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-blue-600 font-semibold">{currentValues.isSigned ? '✓ Digitally Signed' : 'Pending Signature'}</span>
                        </div>

                        {openForms.dynamicForm && (
                          <div className="p-5 space-y-4 bg-white dark:bg-slate-900">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {template.fields.map((field) => (
                                <div key={field.id} className={field.type === 'textarea' || field.type === 'signature' ? 'md:col-span-2' : ''}>
                                  <label className="block font-bold mb-1">
                                    {field.label} {field.required && <span className="text-rose-500">*</span>}
                                  </label>

                                  {field.type === 'text' && (
                                    <input
                                      type="text"
                                      placeholder={field.placeholder || ''}
                                      value={currentValues[field.id] || ''}
                                      onChange={(e) => setFormSubmissions({ ...formSubmissions, [submissionKey]: { ...currentValues, [field.id]: e.target.value } })}
                                      className="w-full p-2 border rounded font-semibold text-slate-900 dark:bg-slate-950 dark:text-slate-100"
                                    />
                                  )}

                                  {field.type === 'textarea' && (
                                    <textarea
                                      rows={2}
                                      placeholder={field.placeholder || ''}
                                      value={currentValues[field.id] || ''}
                                      onChange={(e) => setFormSubmissions({ ...formSubmissions, [submissionKey]: { ...currentValues, [field.id]: e.target.value } })}
                                      className="w-full p-2 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-mono"
                                    />
                                  )}

                                  {field.type === 'checkbox' && (
                                    <label className="flex items-center space-x-2 p-2 border rounded font-bold cursor-pointer bg-slate-50 dark:bg-slate-950">
                                      <input
                                        type="checkbox"
                                        checked={!!currentValues[field.id]}
                                        onChange={(e) => setFormSubmissions({ ...formSubmissions, [submissionKey]: { ...currentValues, [field.id]: e.target.checked } })}
                                        className="rounded text-blue-600"
                                      />
                                      <span>Verified & Confirmed</span>
                                    </label>
                                  )}

                                  {field.type === 'pass_fail' && (
                                    <div className="flex space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => setFormSubmissions({ ...formSubmissions, [submissionKey]: { ...currentValues, [field.id]: 'PASS' } })}
                                        className={`px-4 py-2 rounded font-bold transition-all cursor-pointer ${
                                          currentValues[field.id] === 'PASS' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                                        }`}
                                      >
                                        ✓ PASS
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setFormSubmissions({ ...formSubmissions, [submissionKey]: { ...currentValues, [field.id]: 'FAIL' } })}
                                        className={`px-4 py-2 rounded font-bold transition-all cursor-pointer ${
                                          currentValues[field.id] === 'FAIL' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                                        }`}
                                      >
                                        ✗ FAIL
                                      </button>
                                    </div>
                                  )}

                                  {field.type === 'select' && (
                                    <select
                                      value={currentValues[field.id] || (field.options ? field.options[0] : '')}
                                      onChange={(e) => setFormSubmissions({ ...formSubmissions, [submissionKey]: { ...currentValues, [field.id]: e.target.value } })}
                                      className="w-full p-2 border rounded font-semibold text-slate-900 dark:bg-slate-950 dark:text-slate-100"
                                    >
                                      {field.options?.map((opt, i) => (
                                        <option key={i} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                  )}

                                  {field.type === 'signature' && (
                                    <div className="space-y-1">
                                      <input
                                        type="text"
                                        placeholder="Type full legal name to digitally sign..."
                                        value={currentValues[field.id] || ''}
                                        onChange={(e) => setFormSubmissions({
                                          ...formSubmissions,
                                          [submissionKey]: {
                                            ...currentValues,
                                            [field.id]: e.target.value,
                                            isSigned: e.target.value.trim().length > 0,
                                            submittedAt: new Date().toLocaleString()
                                          }
                                        })}
                                        className="w-full p-2.5 border-2 border-blue-400 rounded font-serif font-bold text-sm text-blue-700 dark:text-blue-300 dark:bg-slate-950"
                                      />
                                      <span className="text-[10px] text-slate-400 italic">E-Signature captures legally binding acceptance for activity completion.</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            <div className="pt-3 border-t flex justify-end">
                              <button
                                onClick={() => {
                                  alert('✅ Form Packet answers saved successfully!');
                                }}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded text-xs shadow-md cursor-pointer"
                              >
                                Save Form Responses
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Files Section */}
                <div className={`p-4 rounded-lg border space-y-3 text-xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-bold text-sm flex items-center space-x-2">
                      <Paperclip className="w-4 h-4 text-blue-600" />
                      <span>Files & Attachments (Azure Blob Storage)</span>
                    </h4>
                    <button className="bg-blue-600 text-white px-2.5 py-1 rounded font-bold flex items-center space-x-1 hover:bg-blue-500 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                    </button>
                  </div>

                  {selectedJob.files.length === 0 ? (
                    <div className="text-slate-400 italic py-2">No Files Attached</div>
                  ) : (
                    <div className="divide-y">
                      {selectedJob.files.map((file) => (
                        <div key={file.id} className="py-2 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px]">{file.type}</span>
                            <span className="font-semibold text-blue-600 underline cursor-pointer">{file.name}</span>
                            <span className="text-slate-400">({file.size})</span>
                          </div>
                          <span className="text-slate-400">{file.uploadedAt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Job Issues Section */}
                <div className={`p-4 rounded-lg border space-y-3 text-xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-bold text-sm flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Job Issues</span>
                    </h4>
                  </div>

                  {selectedJob.jobIssues ? (
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded flex items-center justify-between">
                      <span className="font-bold text-rose-700 dark:text-rose-300">{selectedJob.jobIssues}</span>
                      <span className="px-2 py-0.5 bg-rose-200 text-rose-900 rounded font-bold text-[10px]">Open Issue</span>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic py-2">No Job Issues Logged</div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* SCREEN 3: CHANGE LOG AUDIT TRAIL VIEW */}
          {activeNav === 'change_log' && selectedJob && (
            <div className="flex-1 overflow-auto flex flex-col">
              <div className={`px-6 py-3 border-b flex items-center justify-between ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActiveNav('job_detail')}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center space-x-1 font-bold text-xs cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Job</span>
                  </button>
                  <h2 className="text-base font-black text-blue-600 dark:text-blue-400">Change Log (Audit Trail)</h2>
                </div>
              </div>

              <div className="p-6 max-w-4xl mx-auto space-y-6 flex-1 overflow-auto w-full">
                <div className={`p-4 rounded-lg border text-xs space-y-1 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
                  <div><span className="text-slate-500 font-bold">Account Name:</span> <strong className="text-blue-600 dark:text-blue-400">{selectedJob.accountName}</strong></div>
                  <div><span className="text-slate-500 font-bold">Job Name:</span> <strong>{selectedJob.jobName}</strong></div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-sm border-b pb-2">Changes</h3>

                  <div className="space-y-3">
                    {changeLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`p-4 rounded-lg border text-xs space-y-2 ${
                          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            ● {log.timestamp} by <strong className="text-blue-600 underline">{log.changedBy}</strong>
                          </span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">System Audit</span>
                        </div>

                        <div className="font-semibold text-slate-800 dark:text-slate-200">{log.summary}</div>

                        <div className="space-y-1 pl-3 border-l-2 border-blue-500 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                          {log.diffs.map((d, idx) => (
                            <div key={idx}>
                              — {d.field} - Change from <span className="text-rose-600">[{d.from}]</span> to <span className="text-emerald-600 font-bold">[{d.to}]</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SCREEN 4: MASTER SCHEDULING CALENDAR & CREW CAPACITY BOARD */}
          {activeNav === 'calendar' && (
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* Calendar Controls & Filters */}
              <div className={`p-4 rounded-lg border flex flex-wrap items-center justify-between gap-3 text-xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
                <div className="flex items-center space-x-3">
                  <button onClick={() => shiftCalendarDays(-7)} className="p-1.5 rounded border hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center space-x-2 bg-blue-50 dark:bg-slate-950 border border-blue-300 dark:border-slate-700 px-3 py-1.5 rounded-md">
                    <CalendarIcon className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">Selected Anchor Date:</span>
                    <input
                      type="date"
                      value={centerDate}
                      onChange={(e) => setCenterDate(e.target.value)}
                      className="bg-transparent font-bold text-blue-600 dark:text-blue-400 focus:outline-none cursor-pointer"
                    />
                  </div>

                  <button onClick={() => shiftCalendarDays(7)} className="p-1.5 rounded border hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* View Mode Toggle: 14-Day View vs Assignee Lanes */}
                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setCalendarViewMode('grid')}
                    className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      calendarViewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>14-Day Timeline</span>
                  </button>
                  <button
                    onClick={() => setCalendarViewMode('assignees')}
                    className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      calendarViewMode === 'assignees' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Assignee / Crew Capacity</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2 font-medium">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Filter by:</span>

                  <select value={calAccountFilter} onChange={(e) => setCalAccountFilter(e.target.value)} className="p-1 border rounded bg-transparent text-slate-900 dark:text-slate-100">
                    <option value="All">All Builders</option>
                    <option value="PERRY HOMES">Perry Homes</option>
                    <option value="TOLL BROTHERS">Toll Brothers</option>
                  </select>

                  <select value={calCommunityFilter} onChange={(e) => setCalCommunityFilter(e.target.value)} className="p-1 border rounded bg-transparent text-slate-900 dark:text-slate-100">
                    <option value="All">All Communities</option>
                    <option value="STAR FARMS">Star Farms</option>
                    <option value="Oakridge">Oakridge Estates</option>
                  </select>
                </div>
              </div>

              {/* Drag-and-Drop Instruction Banner for Schedulers */}
              {activeUserRole !== 'EXTERNAL_FIELD_INSTALLER' && activeUserRole !== 'EXTERNAL_SUBCONTRACTOR' && (
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs flex items-center justify-between text-blue-900 dark:text-blue-300">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span><strong>Scheduler Drag-and-Drop Active:</strong> Drag any activity card to a working day to shift dates. Downstream dependencies and deadline warnings will prompt for confirmation.</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">Non-working days are locked (gray shaded).</span>
                </div>
              )}

              {/* VIEW 1: 14-DAY GRID WITH SHADED NON-WORKING DAYS */}
              {calendarViewMode === 'grid' && (
                <div className={`p-4 rounded-lg border space-y-6 text-xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-md'}`}>
                  {/* Week 1 */}
                  <div>
                    <div className="font-bold text-slate-400 mb-2 flex items-center justify-between">
                      <span>Week 1 (Days -7 to -1)</span>
                      <span className="text-[11px] font-normal text-slate-400">{week1Days[0]?.formatted} – {week1Days[6]?.formatted}</span>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center font-bold">
                      {week1Days.map((d, i) => {
                        const isWork = isDateWorkingDay(d.dateStr);
                        const isOvertime = customWorkDays.includes(d.dateStr);
                        return (
                          <div
                            key={i}
                            className={`p-2 rounded border transition-all ${
                              !isWork
                                ? 'bg-slate-200/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-500'
                                : d.isCenter
                                  ? 'bg-blue-600 text-white shadow-md'
                                  : isOvertime
                                    ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                                    : 'bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-center space-x-1">
                              <span>{d.dayName}</span>
                              {!isWork && <Lock className="w-3 h-3 text-slate-400" />}
                              {isOvertime && <span className="text-[9px] bg-amber-500 text-white px-1 rounded font-black">OT</span>}
                            </div>
                            <div className="text-[10px] opacity-80">{d.formatted}</div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-7 gap-2 mt-2 items-start">
                      {week1Days.map((d, i) => {
                        const isWork = isDateWorkingDay(d.dateStr);
                        const isOvertime = customWorkDays.includes(d.dateStr);
                        const milestones = isWork ? getCalendarMilestonesForDay(d) : [];
                        return (
                          <div
                            key={i}
                            onDragOver={(e) => {
                              if (isWork) {
                                e.preventDefault();
                                e.currentTarget.classList.add('ring-2', 'ring-blue-500');
                              }
                            }}
                            onDragLeave={(e) => {
                              e.currentTarget.classList.remove('ring-2', 'ring-blue-500');
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove('ring-2', 'ring-blue-500');
                              if (!isWork || !draggedActivity) return;
                              const job = jobsData.find(j => j.id === draggedActivity.jobId);
                              if (job) {
                                calculateShiftPreview(job, draggedActivity.phase.toLowerCase().includes('temp') ? 'template' : draggedActivity.phase.toLowerCase().includes('fab') ? 'fab' : 'install', d.formatted);
                              }
                              setDraggedActivity(null);
                            }}
                            className={`min-h-[130px] h-auto p-2 border rounded-lg transition-all flex flex-col justify-between ${
                              !isWork
                                ? 'bg-slate-200/50 dark:bg-slate-950/60 border-slate-300 dark:border-slate-800'
                                : 'bg-slate-50/70 dark:bg-slate-950/30 border-dashed border-slate-300 dark:border-slate-800'
                            }`}
                          >
                            <div className="space-y-1.5 flex flex-col w-full">
                              {!isWork ? (
                                <div className="text-center py-5 text-slate-400">
                                  <div className="font-bold text-[10px] flex items-center justify-center space-x-1">
                                    <Lock className="w-3 h-3" />
                                    <span>Non-Working Day</span>
                                  </div>
                                  <button
                                    onClick={() => handleToggleOvertimeDay(d.dateStr)}
                                    className="mt-1 text-[9px] text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                                  >
                                    + Enable Overtime Day
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {milestones.length === 0 ? (
                                    <div className="text-slate-400 dark:text-slate-600 text-[10px] italic py-4 text-center">
                                      No Scheduled Milestones
                                    </div>
                                  ) : (
                                    milestones.map((item) => (
                                      <div
                                        key={item.key}
                                        draggable={activeUserRole !== 'EXTERNAL_FIELD_INSTALLER' && activeUserRole !== 'EXTERNAL_SUBCONTRACTOR'}
                                        onDragStart={() => setDraggedActivity({
                                          jobId: item.job.id,
                                          activityId: `act_${item.phase}`,
                                          activityName: item.job.jobName,
                                          currentDate: d.formatted,
                                          phase: item.phase
                                        })}
                                        onClick={() => openJobDetailScreen(item.job, 'calendar')}
                                        className={`p-2 rounded-lg text-[10px] font-bold shadow-xs cursor-pointer transition-all border flex flex-col space-y-1 group ${item.cardClass}`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${item.badgeClass}`}>
                                            {item.phaseLabel}
                                          </span>
                                          <span className="text-[9px] font-medium opacity-80">Lot {item.job.lotNumber}</span>
                                        </div>
                                        <div className="font-bold text-xs truncate leading-tight">
                                          {item.job.jobName}
                                        </div>
                                        <div className="text-[9px] opacity-80 flex items-center justify-between pt-0.5 border-t border-black/10 dark:border-white/10">
                                          <span className="truncate">{item.crew}</span>
                                          <ExternalLink className="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </>
                              )}
                            </div>

                            {isOvertime && (
                              <button
                                onClick={() => handleToggleOvertimeDay(d.dateStr)}
                                className="text-[9px] text-amber-700 dark:text-amber-400 hover:underline font-semibold text-center cursor-pointer mt-2"
                              >
                                Overtime Enabled (Revert)
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Week 2 */}
                  <div>
                    <div className="font-bold text-slate-400 mb-2 flex items-center justify-between">
                      <span className="text-blue-600 dark:text-blue-400 font-extrabold">Week 2 (Selected Date & Next 7 Days)</span>
                      <span className="text-[11px] font-normal text-slate-400">{week2Days[0]?.formatted} – {week2Days[7]?.formatted}</span>
                    </div>

                    <div className="grid grid-cols-8 gap-2 text-center font-bold">
                      {week2Days.map((d, i) => {
                        const isWork = isDateWorkingDay(d.dateStr);
                        const isOvertime = customWorkDays.includes(d.dateStr);
                        return (
                          <div
                            key={i}
                            className={`p-2 rounded border transition-all ${
                              !isWork
                                ? 'bg-slate-200/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-500'
                                : d.isCenter
                                  ? 'bg-blue-600 text-white shadow-md'
                                  : isOvertime
                                    ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                                    : 'bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-center space-x-1">
                              <span>{d.dayName}</span>
                              {!isWork && <Lock className="w-3 h-3 text-slate-400" />}
                              {isOvertime && <span className="text-[9px] bg-amber-500 text-white px-1 rounded font-black">OT</span>}
                            </div>
                            <div className="text-[10px] opacity-80">{d.formatted}</div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-8 gap-2 mt-2 items-start">
                      {week2Days.map((d, i) => {
                        const isWork = isDateWorkingDay(d.dateStr);
                        const isOvertime = customWorkDays.includes(d.dateStr);
                        const milestones = isWork ? getCalendarMilestonesForDay(d) : [];
                        return (
                          <div
                            key={i}
                            onDragOver={(e) => {
                              if (isWork) {
                                e.preventDefault();
                                e.currentTarget.classList.add('ring-2', 'ring-blue-500');
                              }
                            }}
                            onDragLeave={(e) => {
                              e.currentTarget.classList.remove('ring-2', 'ring-blue-500');
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove('ring-2', 'ring-blue-500');
                              if (!isWork || !draggedActivity) return;
                              const job = jobsData.find(j => j.id === draggedActivity.jobId);
                              if (job) {
                                calculateShiftPreview(job, draggedActivity.phase.toLowerCase().includes('temp') ? 'template' : draggedActivity.phase.toLowerCase().includes('fab') ? 'fab' : 'install', d.formatted);
                              }
                              setDraggedActivity(null);
                            }}
                            className={`min-h-[130px] h-auto p-2 border rounded-lg transition-all flex flex-col justify-between ${
                              !isWork
                                ? 'bg-slate-200/50 dark:bg-slate-950/60 border-slate-300 dark:border-slate-800'
                                : 'bg-slate-50/70 dark:bg-slate-950/30 border-dashed border-slate-300 dark:border-slate-800'
                            }`}
                          >
                            <div className="space-y-1.5 flex flex-col w-full">
                              {!isWork ? (
                                <div className="text-center py-5 text-slate-400">
                                  <div className="font-bold text-[10px] flex items-center justify-center space-x-1">
                                    <Lock className="w-3 h-3" />
                                    <span>Non-Working Day</span>
                                  </div>
                                  <button
                                    onClick={() => handleToggleOvertimeDay(d.dateStr)}
                                    className="mt-1 text-[9px] text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                                  >
                                    + Enable Overtime Day
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {milestones.length === 0 ? (
                                    <div className="text-slate-400 dark:text-slate-600 text-[10px] italic py-4 text-center">
                                      No Scheduled Milestones
                                    </div>
                                  ) : (
                                    milestones.map((item) => (
                                      <div
                                        key={item.key}
                                        draggable={activeUserRole !== 'EXTERNAL_FIELD_INSTALLER' && activeUserRole !== 'EXTERNAL_SUBCONTRACTOR'}
                                        onDragStart={() => setDraggedActivity({
                                          jobId: item.job.id,
                                          activityId: `act_${item.phase}`,
                                          activityName: item.job.jobName,
                                          currentDate: d.formatted,
                                          phase: item.phase
                                        })}
                                        onClick={() => openJobDetailScreen(item.job, 'calendar')}
                                        className={`p-2 rounded-lg text-[10px] font-bold shadow-xs cursor-pointer transition-all border flex flex-col space-y-1 group ${item.cardClass}`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${item.badgeClass}`}>
                                            {item.phaseLabel}
                                          </span>
                                          <span className="text-[9px] font-medium opacity-80">Lot {item.job.lotNumber}</span>
                                        </div>
                                        <div className="font-bold text-xs truncate leading-tight">
                                          {item.job.jobName}
                                        </div>
                                        <div className="text-[9px] opacity-80 flex items-center justify-between pt-0.5 border-t border-black/10 dark:border-white/10">
                                          <span className="truncate">{item.crew}</span>
                                          <ExternalLink className="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </>
                              )}
                            </div>

                            {isOvertime && (
                              <button
                                onClick={() => handleToggleOvertimeDay(d.dateStr)}
                                className="text-[9px] text-amber-700 dark:text-amber-400 hover:underline font-semibold text-center cursor-pointer mt-2"
                              >
                                Overtime Enabled (Revert)
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: ASSIGNEE & CREW CAPACITY BOARD */}
              {calendarViewMode === 'assignees' && (
                <div className={`p-4 rounded-lg border space-y-4 text-xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-md'}`}>
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-sm flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>Crews & Machine Saw Lines Daily Capacity Lanes</span>
                    </h3>
                    <span className="text-slate-400 text-xs">Workload balancing for {selectedRegion}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { crew: 'Install Truck 1', type: 'FIELD CREW', maxHrs: 8, scheduledHrs: 6, color: 'border-blue-500 bg-blue-500/10' },
                      { crew: 'Apex Install Crew A', type: 'FIELD CREW', maxHrs: 8, scheduledHrs: 7.5, color: 'border-indigo-500 bg-indigo-500/10' },
                      { crew: 'Bridge Saw 1 & CNC 2', type: 'SHOP MACHINE', maxHrs: 16, scheduledHrs: 12, color: 'border-purple-500 bg-purple-500/10' },
                      { crew: 'Service Warranty Tech 1', type: 'SERVICE', maxHrs: 8, scheduledHrs: 3, color: 'border-amber-500 bg-amber-500/10' },
                    ].map((lane, idx) => (
                      <div key={idx} className={`p-3 rounded-xl border-2 ${lane.color} space-y-3`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{lane.crew}</div>
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{lane.type}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-xs text-blue-600 dark:text-blue-400">{lane.scheduledHrs}h / {lane.maxHrs}h</span>
                            <div className="w-16 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(lane.scheduledHrs / lane.maxHrs) * 100}%` }}></div>
                            </div>
                          </div>
                        </div>

                        {/* Activities in this lane */}
                        <div className="space-y-2">
                          {jobsData.filter(j => j.assignedCrew === lane.crew || (idx === 0 && j.id === '1') || (idx === 3 && j.id === '2')).map((j) => (
                            <div
                              key={j.id}
                              onClick={() => openJobDetailScreen(j, 'calendar')}
                              className="p-2.5 bg-white dark:bg-slate-900 border rounded-lg shadow-xs cursor-pointer hover:border-blue-500 transition-all"
                            >
                              <div className="font-bold text-xs text-blue-700 dark:text-blue-400">{j.jobName}</div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{j.communityName} • Lot {j.lotNumber}</div>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                                <span className="font-bold text-emerald-600">{j.installDate.date}</span>
                                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-extrabold">{j.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCREEN 5: SHARED REPORTS DASHBOARD */}
          {activeNav === 'reports' && (
            <div className="flex-1 overflow-auto p-6 max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Shared Reports</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Standard fabrication & installation analytics, square footage throughput, and salesperson volume.
                  </p>
                </div>

                <button className="bg-blue-600 text-white font-bold px-4 py-2 rounded text-xs flex items-center space-x-1.5 shadow-sm cursor-pointer hover:bg-blue-500">
                  <Plus className="w-4 h-4" />
                  <span>Create Custom Report</span>
                </button>
              </div>

              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search Reports..."
                  value={reportSearchQuery}
                  onChange={(e) => setReportSearchQuery(e.target.value)}
                  className={`w-full p-2.5 pl-8 border rounded text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-300'}`}
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
              </div>

              <div className={`rounded-lg border overflow-hidden shadow-md text-xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
                <div className="p-3 bg-blue-600 text-white font-bold flex items-center justify-between">
                  <span>Name ▲</span>
                  <span className="text-[11px] opacity-90">Category</span>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {sharedReportsList
                    .filter(r => r.name.toLowerCase().includes(reportSearchQuery.toLowerCase()))
                    .map((report) => (
                      <div
                        key={report.id}
                        onClick={() => setSelectedReport(report.name)}
                        className={`p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                          selectedReport === report.name
                            ? 'bg-blue-50 dark:bg-blue-950/60 font-bold text-blue-700 dark:text-blue-300'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <span className="underline hover:text-blue-600">{report.name}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                          {report.category}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {selectedReport && (
                <div className={`p-6 rounded-lg border space-y-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-md'}`}>
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-blue-600">{selectedReport}</h3>
                      <span className="text-xs text-slate-500">Auto-calculated from Lot activities & stone dimensions</span>
                    </div>

                    <button className="bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 hover:bg-emerald-500 cursor-pointer">
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 border rounded bg-slate-50 dark:bg-slate-950">
                      <span className="text-slate-500 font-bold block mb-1">June 2026</span>
                      <span className="text-xl font-extrabold text-blue-600">8,420 Sq Ft</span>
                      <span className="text-[10px] text-emerald-500 block mt-1">+12% vs prior month</span>
                    </div>

                    <div className="p-4 border rounded bg-slate-50 dark:bg-slate-950">
                      <span className="text-slate-500 font-bold block mb-1">July 2026 (Projected)</span>
                      <span className="text-xl font-extrabold text-purple-600">9,180 Sq Ft</span>
                      <span className="text-[10px] text-purple-500 block mt-1">Based on confirmed install dates</span>
                    </div>

                    <div className="p-4 border rounded bg-slate-50 dark:bg-slate-950">
                      <span className="text-slate-500 font-bold block mb-1">August 2026 (Scheduled)</span>
                      <span className="text-xl font-extrabold text-amber-600">6,500 Sq Ft</span>
                      <span className="text-[10px] text-slate-400 block mt-1">42 lot orders pending</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* SCREEN 6: BUILDER FORM PACKETS */}
          {activeNav === 'forms' && (
            <div className="flex-1 overflow-auto p-6 max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Builder Dynamic Form Packet Engine</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Fill out, sign, and submit custom sign-off packets and field work orders per Builder Account.
                  </p>
                </div>
              </div>

              {formSaveSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Form packet data saved and attached to Lot/Job order successfully!</span>
                </div>
              )}

              <div className="flex space-x-3 border-b">
                <button
                  onClick={() => setActiveFormBuilder('toll')}
                  className={`pb-2.5 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all ${
                    activeFormBuilder === 'toll'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Toll Brothers Installation Sign-off Packet</span>
                </button>

                <button
                  onClick={() => setActiveFormBuilder('lennar')}
                  className={`pb-2.5 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all ${
                    activeFormBuilder === 'lennar'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Lennar Standard Work Order Packet</span>
                </button>
              </div>

              <form onSubmit={handleSaveFormPacket} className={`p-6 rounded-lg border space-y-4 text-xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-md'}`}>
                <div className="font-bold text-sm text-blue-600 border-b pb-2 flex items-center justify-between">
                  <span>{activeFormBuilder === 'toll' ? 'Toll Brothers Sign-off Form' : 'Lennar Work Order Form'}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded">Job #1078 Attached</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">Site Superintendent Name</label>
                    <input
                      type="text"
                      value={formSuperintendent}
                      onChange={(e) => setFormSuperintendent(e.target.value)}
                      className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Edge Profile Selection</label>
                    <select
                      value={formEdgeProfile}
                      onChange={(e) => setFormEdgeProfile(e.target.value)}
                      className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                    >
                      <option value="Eased 1.5 inch">Eased 1.5 inch</option>
                      <option value="Bevel 45 deg">Bevel 45 deg</option>
                      <option value="Full Bullnose">Full Bullnose</option>
                      <option value="Ogee Premium">Ogee Premium</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sinkCheck"
                    checked={formSinkCutoutVerified}
                    onChange={(e) => setFormSinkCutoutVerified(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <label htmlFor="sinkCheck" className="font-bold cursor-pointer">
                    Sink Cutout & Faucet Hole Dimensions Verified On-Site
                  </label>
                </div>

                <div>
                  <label className="block font-bold mb-1">Field Installer Notes & Seam Verification</label>
                  <textarea
                    rows={3}
                    value={formInstallerNotes}
                    onChange={(e) => setFormInstallerNotes(e.target.value)}
                    className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 font-mono"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-bold mb-1">Customer / Super Sign-off Signature</label>
                  <input
                    type="text"
                    value={formCustomerSignature}
                    onChange={(e) => setFormCustomerSignature(e.target.value)}
                    placeholder="Type name to sign digitally"
                    className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 font-serif font-bold text-sm text-blue-700 dark:text-blue-400"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded text-xs shadow-md cursor-pointer">
                    Save & Submit Form Packet
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SCREEN 7: EXPANDED FULL-SCREEN SETTINGS HUB */}
          {activeNav === 'settings' && (
            <div className="flex-1 overflow-auto flex flex-col p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2.5">
                    <Settings className="w-6 h-6 text-blue-600" />
                    <span>System & Technical Settings</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage Machine Queues, Security RBAC, Entra ID SSO, and White-Label Branding. (Builder Accounts are managed via the dedicated Accounts module).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                
                {/* Left Master Navigation List */}
                <div className={`lg:col-span-3 p-4 rounded-xl border space-y-2 shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
                  <div className="px-3 py-2 font-black text-[11px] uppercase tracking-wider text-slate-400">Settings Modules</div>
                  {[
                    { id: 'regions', label: 'Regions & Locations', icon: MapPin, desc: 'Operating facilities, default location & shutdown status' },
                    { id: 'job', label: 'Job Settings', icon: Briefcase, desc: 'Activity types, sequence dependencies & forms' },
                    { id: 'calendar', label: 'Calendar & Holidays', icon: CalendarIcon, desc: 'Working days, non-working holidays & map' },
                    { id: 'shop', label: 'Shop Floor Machines', icon: Wrench, desc: 'Bridge saws, CNC routers & line buffers' },
                    { id: 'users', label: 'Users & Roles', icon: Users, desc: 'Internal roles, external invited users & RBAC' },
                    { id: 'branding', label: 'Branding & Logo', icon: ImageIcon, desc: 'Logo Base64 upload & brand styling' },
                    { id: 'system', label: 'System & Security', icon: Monitor, desc: 'Entra SSO, IP login locations & policies' },
                    { id: 'billing', label: 'Billing & Plan', icon: DollarSign, desc: 'SaaS subscription & tier management' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSettingsCategory(cat.id as any)}
                      className={`w-full text-left p-3 rounded-lg font-bold transition-all flex items-start space-x-3 cursor-pointer ${
                        settingsCategory === cat.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <cat.icon className={`w-5 h-5 shrink-0 mt-0.5 ${settingsCategory === cat.id ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                      <div className="overflow-hidden">
                        <div className="text-sm font-bold truncate">{cat.label}</div>
                        <div className={`text-[11px] font-normal truncate mt-0.5 ${settingsCategory === cat.id ? 'text-blue-100' : 'text-slate-400'}`}>
                          {cat.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right Working Area */}
                <div className={`lg:col-span-9 p-8 rounded-xl border space-y-6 shadow-md flex-1 overflow-auto ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-300 text-slate-900'}`}>
                  
                  {/* MODULE 0: REGIONS & LOCATIONS */}
                  {settingsCategory === 'regions' && (
                    <div className="space-y-8 text-xs">
                      <div className="border-b pb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-black text-blue-600 dark:text-blue-400">Regions & Operating Facilities</h3>
                          <p className="text-slate-500 mt-1">
                            Configure fabrication shops, regional distribution hubs, and service territories. Set your default operating location and manage facility shutdown status.
                          </p>
                        </div>
                      </div>

                      {regionAddedSuccess && (
                        <div className="p-4 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs flex items-center space-x-2 font-semibold">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>New operating facility registered and initialized successfully!</span>
                        </div>
                      )}

                      {/* Summary Metric Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Primary Default Location</span>
                          <strong className="text-base text-blue-600 dark:text-blue-400 mt-1">
                            {regionsList.find(r => r.isDefault)?.name || 'None Set'}
                          </strong>
                          <span className="text-[11px] text-slate-500 mt-1">Auto-assigned to new accounts & jobs</span>
                        </div>

                        <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Active Operating Facilities</span>
                          <strong className="text-base text-emerald-600 mt-1">
                            {regionsList.filter(r => r.status === 'ACTIVE').length} Facilities
                          </strong>
                          <span className="text-[11px] text-emerald-500 mt-1">Accepting new schedules & lot orders</span>
                        </div>

                        <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Shutdown / Inactive Facilities</span>
                          <strong className="text-base text-rose-600 mt-1">
                            {regionsList.filter(r => r.status === 'SHUTDOWN').length} Facilities
                          </strong>
                          <span className="text-[11px] text-rose-500 mt-1">Record creation strictly blocked</span>
                        </div>
                      </div>

                      {/* Register New Facility Form */}
                      <form onSubmit={handleCreateRegion} className="p-5 rounded-xl border bg-slate-50 dark:bg-slate-950 space-y-4">
                        <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400 flex items-center space-x-2">
                          <PlusCircle className="w-4 h-4" />
                          <span>Register New Operating Facility / Warehouse</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block font-bold mb-1">Facility / Warehouse Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Austin Metro Hub"
                              value={newRegionName}
                              onChange={(e) => setNewRegionName(e.target.value)}
                              className="w-full p-2.5 border rounded font-semibold text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                            />
                          </div>

                          <div>
                            <label className="block font-bold mb-1">Region Code</label>
                            <input
                              type="text"
                              placeholder="e.g. AUS"
                              value={newRegionCode}
                              onChange={(e) => setNewRegionCode(e.target.value)}
                              className="w-full p-2.5 border rounded font-mono font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                            />
                          </div>

                          <div>
                            <label className="block font-bold mb-1">Operating Timezone</label>
                            <select
                              value={newRegionTimezone}
                              onChange={(e) => setNewRegionTimezone(e.target.value)}
                              className="w-full p-2.5 border rounded font-semibold text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                            >
                              <option value="America/Phoenix (MST)">America/Phoenix (MST)</option>
                              <option value="America/Denver (MDT)">America/Denver (MDT)</option>
                              <option value="America/Chicago (CST)">America/Chicago (CST)</option>
                              <option value="America/New_York (EST)">America/New_York (EST)</option>
                            </select>
                          </div>
                        </div>

                        {/* Dedicated Warehouse Address Fields */}
                        <div className="p-3.5 bg-white dark:bg-slate-900 border rounded-lg space-y-3">
                          <span className="block font-bold text-xs text-slate-700 dark:text-slate-300">Physical Warehouse / Facility Address</span>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold mb-1">Street Address</label>
                              <input
                                type="text"
                                placeholder="e.g. 500 Airport Blvd, Suite 200"
                                value={newRegionStreet}
                                onChange={(e) => setNewRegionStreet(e.target.value)}
                                className="w-full p-2 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold mb-1">City</label>
                              <input
                                type="text"
                                placeholder="e.g. Austin"
                                value={newRegionCity}
                                onChange={(e) => setNewRegionCity(e.target.value)}
                                className="w-full p-2 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-bold mb-1">State</label>
                                <select
                                  value={newRegionState}
                                  onChange={(e) => setNewRegionState(e.target.value)}
                                  className="w-full p-2 border rounded font-bold text-slate-900 dark:bg-slate-950 dark:text-slate-100"
                                >
                                  {US_STATES.map((st) => (
                                    <option key={st.code} value={st.code}>{st.code} - {st.name}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold mb-1">Zip Code</label>
                                <input
                                  type="text"
                                  placeholder="78701"
                                  value={newRegionZip}
                                  onChange={(e) => setNewRegionZip(formatZipMask(e.target.value))}
                                  maxLength={10}
                                  className="w-full p-2 border rounded font-mono font-bold text-slate-900 dark:bg-slate-950 dark:text-slate-100"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            className="bg-blue-600 text-white font-bold px-5 py-2 rounded-lg text-xs flex items-center space-x-1.5 hover:bg-blue-500 shadow-md cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Create Location</span>
                          </button>
                        </div>
                      </form>

                      {/* Operating Facilities Table */}
                      <div className="border rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className={`${isDark ? 'bg-blue-950 text-blue-200 border-b border-slate-800' : 'bg-blue-600 text-white'}`}>
                              <th className="p-3 font-bold border-r border-white/20">Location Name</th>
                              <th className="p-3 font-bold border-r border-white/20">Code</th>
                              <th className="p-3 font-bold border-r border-white/20">Address & Timezone</th>
                              <th className="p-3 font-bold border-r border-white/20 text-center">Status</th>
                              <th className="p-3 font-bold text-center">Actions & Default</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {regionsList.map((reg, idx) => (
                              <tr
                                key={reg.id}
                                className={`transition-colors ${
                                  reg.status === 'SHUTDOWN'
                                    ? isDark ? 'bg-rose-950/20' : 'bg-rose-50/50'
                                    : idx % 2 === 0
                                      ? isDark ? 'bg-slate-900/60' : 'bg-white'
                                      : isDark ? 'bg-slate-950/40' : 'bg-slate-50'
                                }`}
                              >
                                <td className="p-3">
                                  <div className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                                    <span>{reg.name}</span>
                                    {reg.isDefault && (
                                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-extrabold text-[10px]">
                                        DEFAULT
                                      </span>
                                    )}
                                  </div>
                                </td>

                                <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                                  {reg.code}
                                </td>

                                <td className="p-3">
                                  <div className="font-medium text-slate-700 dark:text-slate-300">{reg.address}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{reg.timezone}</div>
                                </td>

                                <td className="p-3 text-center">
                                  <span className={`px-2.5 py-1 rounded text-[10px] font-black inline-flex items-center space-x-1 ${
                                    reg.status === 'ACTIVE'
                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-400'
                                  }`}>
                                    {reg.status === 'ACTIVE' ? (
                                      <>
                                        <Check className="w-3 h-3" />
                                        <span>ACTIVE</span>
                                      </>
                                    ) : (
                                      <>
                                        <AlertCircle className="w-3 h-3" />
                                        <span>SHUTDOWN</span>
                                      </>
                                    )}
                                  </span>
                                  {reg.status === 'SHUTDOWN' && (
                                    <div className="text-[9px] text-rose-500 font-semibold mt-0.5">
                                      Creation Blocked
                                    </div>
                                  )}
                                </td>

                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center space-x-2">
                                    <button
                                      onClick={() => setEditingRegion({
                                        id: reg.id,
                                        name: reg.name,
                                        code: reg.code,
                                        streetAddress: reg.streetAddress,
                                        city: reg.city,
                                        state: reg.state,
                                        zip: reg.zip,
                                        address: reg.address,
                                        timezone: reg.timezone,
                                      })}
                                      className="px-2 py-1 rounded border hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1 cursor-pointer"
                                    >
                                      <Edit3 className="w-3 h-3 text-blue-600" />
                                      <span>Edit</span>
                                    </button>

                                    {!reg.isDefault && (
                                      <button
                                        onClick={() => handleSetDefaultRegion(reg.id)}
                                        className="px-2 py-1 rounded border hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold text-blue-600 cursor-pointer"
                                      >
                                        Set as Default
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleToggleShutdownRegion(reg.id)}
                                      className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                                        reg.status === 'ACTIVE'
                                          ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300'
                                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-300'
                                      }`}
                                    >
                                      {reg.status === 'ACTIVE' ? 'Shutdown Facility' : 'Reactivate Facility'}
                                    </button>

                                    {!reg.isDefault && (
                                      <button
                                        onClick={() => handleDeleteRegion(reg.id)}
                                        title={reg.activeJobsCount > 0 ? 'Cannot delete region with active jobs' : 'Delete Location'}
                                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* EDIT REGION / LOCATION MODAL */}
                      {editingRegion && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                          <div className={`max-w-lg w-full p-6 rounded-xl border shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                              <h3 className="font-bold text-sm flex items-center space-x-2 text-blue-600">
                                <Edit3 className="w-4 h-4" />
                                <span>Edit Location / Facility Details</span>
                              </h3>
                              <button onClick={() => setEditingRegion(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <form onSubmit={handleSaveEditRegion} className="mt-4 space-y-4 text-xs">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block font-bold mb-1">Facility Name</label>
                                  <input
                                    type="text"
                                    required
                                    value={editingRegion.name}
                                    onChange={(e) => setEditingRegion({ ...editingRegion, name: e.target.value })}
                                    className="w-full p-2.5 border rounded font-bold text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                                  />
                                </div>

                                <div>
                                  <label className="block font-bold mb-1">Region Code</label>
                                  <input
                                    type="text"
                                    value={editingRegion.code}
                                    onChange={(e) => setEditingRegion({ ...editingRegion, code: e.target.value })}
                                    className="w-full p-2.5 border rounded font-mono font-bold text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block font-bold mb-1">Timezone</label>
                                <select
                                  value={editingRegion.timezone}
                                  onChange={(e) => setEditingRegion({ ...editingRegion, timezone: e.target.value })}
                                  className="w-full p-2.5 border rounded font-semibold text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                                >
                                  <option value="America/Phoenix (MST)">America/Phoenix (MST)</option>
                                  <option value="America/Denver (MDT)">America/Denver (MDT)</option>
                                  <option value="America/Chicago (CST)">America/Chicago (CST)</option>
                                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                                </select>
                              </div>

                              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border rounded-lg space-y-3">
                                <span className="block font-bold text-xs text-blue-600">Physical Warehouse Address Breakdown</span>
                                <div>
                                  <label className="block text-[11px] font-bold mb-1">Street Address</label>
                                  <input
                                    type="text"
                                    value={editingRegion.streetAddress}
                                    onChange={(e) => setEditingRegion({ ...editingRegion, streetAddress: e.target.value })}
                                    className="w-full p-2 border rounded text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                                  />
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label className="block text-[11px] font-bold mb-1">City</label>
                                    <input
                                      type="text"
                                      value={editingRegion.city}
                                      onChange={(e) => setEditingRegion({ ...editingRegion, city: e.target.value })}
                                      className="w-full p-2 border rounded text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold mb-1">State</label>
                                    <select
                                      value={editingRegion.state}
                                      onChange={(e) => setEditingRegion({ ...editingRegion, state: e.target.value })}
                                      className="w-full p-2 border rounded font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                                    >
                                      {US_STATES.map((st) => (
                                        <option key={st.code} value={st.code}>{st.code} - {st.name}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold mb-1">Zip Code</label>
                                    <input
                                      type="text"
                                      value={editingRegion.zip}
                                      onChange={(e) => setEditingRegion({ ...editingRegion, zip: formatZipMask(e.target.value) })}
                                      maxLength={10}
                                      className="w-full p-2 border rounded font-mono font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="pt-3 flex justify-end space-x-2 border-t">
                                <button
                                  type="button"
                                  onClick={() => setEditingRegion(null)}
                                  className="px-4 py-2 border rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="bg-blue-600 text-white font-bold px-5 py-2 rounded shadow-md cursor-pointer hover:bg-blue-500"
                                >
                                  Save Location Changes
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODULE 1: USERS & ROLES */}
                  {settingsCategory === 'users' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <h3 className="text-lg font-black text-blue-600 dark:text-blue-400">Users & Security Roles Management</h3>
                          <span className="text-xs text-slate-500">Configure internal employee credentials and external contractor roles.</span>
                        </div>
                        <div className="flex space-x-2 font-bold text-xs">
                          {(['External Roles', 'External Users', 'Roles', 'Users'] as const).map((sub) => (
                            <button
                              key={sub}
                              onClick={() => setUsersSubSection(sub)}
                              className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                                usersSubSection === sub ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                              }`}
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      </div>

                      {usersSubSection === 'External Users' && (
                        <div className="space-y-6">
                          <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-lg flex items-center justify-between">
                            <div>
                              <strong className="block text-sm text-purple-900 dark:text-purple-200">External Category User Security Rule</strong>
                              <span className="text-xs text-slate-500">External user invites can strictly only be initiated by Internal Office Users.</span>
                            </div>
                            <span className="px-3 py-1 bg-purple-200 text-purple-900 font-bold rounded text-xs">Strict Office Control</span>
                          </div>

                          {inviteSentSuccess && (
                            <div className="p-4 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs flex items-center space-x-2 font-semibold">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              <span>Emailed invite sent to external user with temporary setup link!</span>
                            </div>
                          )}

                          <form onSubmit={handleSendExternalInvite} className="p-6 border rounded-xl bg-slate-50 dark:bg-slate-950 space-y-4">
                            <h4 className="font-bold text-sm flex items-center space-x-2 text-blue-600">
                              <UserPlus className="w-4 h-4" />
                              <span>Send Emailed Invite to External User</span>
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <label className="block font-bold mb-1">User Email Address</label>
                                <input
                                  type="email"
                                  required
                                  placeholder="installer.crew@contractor.com"
                                  value={inviteEmail}
                                  onChange={(e) => setInviteEmail(e.target.value)}
                                  className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-semibold"
                                />
                              </div>

                              <div>
                                <label className="block font-bold mb-1">Assigned External Role</label>
                                <select
                                  value={inviteRole}
                                  onChange={(e) => setInviteRole(e.target.value)}
                                  className="w-full p-2.5 border rounded font-semibold text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                                >
                                  <option value="EXTERNAL_CREW_ADMIN">EXTERNAL_CREW_ADMIN</option>
                                  <option value="EXTERNAL_FIELD_INSTALLER">EXTERNAL_FIELD_INSTALLER</option>
                                  <option value="EXTERNAL_BUILDER_SUPER">EXTERNAL_BUILDER_SUPER</option>
                                  <option value="EXTERNAL_SUBCONTRACTOR">EXTERNAL_SUBCONTRACTOR</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex justify-end pt-2">
                              <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg text-xs cursor-pointer hover:bg-blue-500 shadow-md">
                                Send Emailed Invite
                              </button>
                            </div>
                          </form>

                          <div className="divide-y text-xs">
                            <div className="py-3 flex items-center justify-between">
                              <div>
                                <strong className="text-sm">crew.lead@subcontractor.com</strong>
                                <span className="block text-slate-500 mt-0.5">EXTERNAL_CREW_ADMIN • Scoped to Phoenix Region</span>
                              </div>
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded font-bold">Invited by Admin</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {usersSubSection === 'External Roles' && (
                        <div className="space-y-4 text-xs">
                          <p className="text-slate-500">All external roles are explicitly prefixed with <code className="font-bold text-purple-600">EXTERNAL_</code> and isolated from internal system administration.</p>
                          <div className="divide-y">
                            <div className="py-3 flex items-center justify-between">
                              <div><strong className="text-sm text-purple-600">EXTERNAL_CREW_ADMIN</strong><span className="block text-slate-500 mt-0.5">Manage crew installers and lot schedule tickets</span></div>
                              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold">4 Permissions</span>
                            </div>
                            <div className="py-3 flex items-center justify-between">
                              <div><strong className="text-sm text-purple-600">EXTERNAL_FIELD_INSTALLER</strong><span className="block text-slate-500 mt-0.5">Fill mobile sign-off forms and update task status</span></div>
                              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold">2 Permissions</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {usersSubSection === 'Roles' && (
                        <div className="space-y-4 text-xs">
                          <div className="divide-y">
                            <div className="py-3 flex items-center justify-between">
                              <div><strong className="text-sm text-blue-600">SUBSCRIBER_ADMIN</strong><span className="block text-slate-500 mt-0.5">Full tenant-level access and configuration</span></div>
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded font-bold">Super Admin</span>
                            </div>
                            <div className="py-3 flex items-center justify-between">
                              <div><strong className="text-sm text-blue-600">INTERNAL_OFFICE_USER</strong><span className="block text-slate-500 mt-0.5">Schedule jobs, manage builders, send user invites</span></div>
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-mono font-bold">Standard Office</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {usersSubSection === 'Users' && (
                        <div className="divide-y text-xs">
                          <div className="py-3 flex items-center justify-between">
                            <div>
                              <strong className="text-sm">admin@granitecraft.com</strong>
                              <span className="block text-slate-500 mt-0.5">SUBSCRIBER_ADMIN • Regions: All (PHX, TUC, DEN)</span>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded">Active SSO</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODULE 2: BRANDING & LOGO */}
                  {settingsCategory === 'branding' && (
                    <div className="space-y-6 text-xs">
                      <div className="border-b pb-4">
                        <h3 className="text-lg font-black text-blue-600 dark:text-blue-400">Subscriber Custom Branding & Logo</h3>
                        <p className="text-slate-500 mt-1">Upload company logos (stored directly as Base64 in DB) and configure header presentation.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block font-bold mb-1.5 text-sm">Subscriber Business Name</label>
                            <input
                              type="text"
                              value={subscriberName}
                              onChange={(e) => setSubscriberName(e.target.value)}
                              className="w-full p-3 border rounded-lg text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 font-bold text-sm"
                            />
                          </div>

                          <div>
                            <label className="block font-bold mb-1.5 text-sm">Upload Header Logo</label>
                            <div className="p-6 border-2 border-dashed rounded-xl text-center bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800">
                              <Upload className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                              <input
                                type="file"
                                accept="image/png, image/jpeg, image/svg+xml"
                                onChange={handleLogoUpload}
                                className="text-xs cursor-pointer"
                              />
                              <div className="text-slate-500 mt-2">
                                <strong>Recommended size:</strong> 200x50px PNG or SVG with transparent background (Max 500KB)
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 rounded-xl border bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
                          <div>
                            <strong className="block text-sm text-slate-500 mb-2">Live Header Logo Display Preview:</strong>
                            {logoBase64 ? (
                              <img src={logoBase64} alt="Uploaded Logo Preview" className="h-28 max-w-[500px] object-contain border p-2 rounded-lg bg-white shadow-md" />
                            ) : (
                              <div className="h-28 px-8 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-2xl shadow-md tracking-tight">
                                {subscriberName}
                              </div>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 mt-4">Header container is scaled to h-28 max-w-[500px] to render high-resolution branding prominently.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODULE 3: SYSTEM SETTINGS */}
                  {settingsCategory === 'system' && (
                    <div className="space-y-6 text-xs">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <h3 className="text-lg font-black text-blue-600 dark:text-blue-400">System Security & Preferences</h3>
                          <span className="text-slate-500">Configure Microsoft Entra ID SSO, login whitelists, and regional timezones.</span>
                        </div>
                        <div className="flex space-x-2 font-bold">
                          {(['Login Locations', 'Page Styles', 'Security', 'Settings'] as const).map((sub) => (
                            <button
                              key={sub}
                              onClick={() => setSystemSubSection(sub)}
                              className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                                systemSubSection === sub ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                              }`}
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      </div>

                      {systemSubSection === 'Security' && (
                        <div className="space-y-6">
                          {savedSuccess && (
                            <div className="p-4 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs flex items-center space-x-2 font-semibold">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              <span>Entra ID SSO settings updated successfully!</span>
                            </div>
                          )}

                          <div>
                            <label className="block font-bold mb-2 text-sm">Authentication Provider Mode</label>
                            <div className="grid grid-cols-3 gap-4">
                              <button
                                type="button"
                                onClick={() => setAuthProvider('EMAIL_PASSWORD')}
                                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                                  authProvider === 'EMAIL_PASSWORD'
                                    ? 'bg-blue-50 border-blue-600 text-blue-900 dark:bg-blue-950 dark:text-blue-100 font-bold shadow-sm'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                              >
                                <span className="font-bold text-sm">Email / Password</span>
                                <span className="text-[11px] text-slate-500 mt-1">Standard login</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setAuthProvider('ENTRA_ID')}
                                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                                  authProvider === 'ENTRA_ID'
                                    ? 'bg-blue-50 border-blue-600 text-blue-900 dark:bg-blue-950 dark:text-blue-100 font-bold shadow-sm'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                              >
                                <span className="font-bold text-sm">Microsoft Entra ID</span>
                                <span className="text-[11px] text-slate-500 mt-1">Corporate SSO</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setAuthProvider('HYBRID')}
                                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                                  authProvider === 'HYBRID'
                                    ? 'bg-blue-50 border-blue-600 text-blue-900 dark:bg-blue-950 dark:text-blue-100 font-bold shadow-sm'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                              >
                                <span className="font-bold text-sm">Hybrid (Both)</span>
                                <span className="text-[11px] text-slate-500 mt-1">SSO + Passwords</span>
                              </button>
                            </div>
                          </div>

                          {(authProvider === 'ENTRA_ID' || authProvider === 'HYBRID') && (
                            <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                              <div>
                                <label className="block font-bold mb-1">Microsoft Entra Directory (Tenant) ID</label>
                                <input
                                  type="text"
                                  value={entraTenantId}
                                  onChange={(e) => setEntraTenantId(e.target.value)}
                                  className="w-full p-2.5 border rounded font-mono text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                                />
                              </div>

                              <div>
                                <label className="block font-bold mb-1">Microsoft Entra Application (Client) ID</label>
                                <input
                                  type="text"
                                  value={entraClientId}
                                  onChange={(e) => setEntraClientId(e.target.value)}
                                  className="w-full p-2.5 border rounded font-mono text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                                />
                              </div>
                            </div>
                          )}

                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => { setSavedSuccess(true); setTimeout(() => setSavedSuccess(false), 3000); }}
                              className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg shadow-md cursor-pointer hover:bg-blue-500"
                            >
                              Save Entra ID Settings
                            </button>
                          </div>
                        </div>
                      )}

                      {systemSubSection === 'Login Locations' && (
                        <div className="space-y-4">
                          <p className="text-slate-500">Whitelisted office, fabrication shop, and warehouse access points.</p>
                          <div className="divide-y">
                            <div className="py-3 flex items-center justify-between">
                              <div><strong className="text-sm">Phoenix Central Office (HQ)</strong><span className="block text-slate-500 mt-0.5">IP Range: 198.51.100.0/24</span></div>
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded">Primary Gateway</span>
                            </div>
                            <div className="py-3 flex items-center justify-between">
                              <div><strong className="text-sm">Tampa Fabrication Facility</strong><span className="block text-slate-500 mt-0.5">IP Range: 203.0.113.0/24</span></div>
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold rounded">Plant Gateway</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {systemSubSection === 'Page Styles' && (
                        <div className="space-y-4">
                          <p className="text-slate-500">Subscriber visual theme, accent colors, and custom header branding.</p>
                          <div className="p-6 border rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                            <div>
                              <strong className="block text-sm">Primary Theme Accent Color</strong>
                              <span className="text-slate-500">Applied across toolbars, active tabs, and primary action buttons</span>
                            </div>
                            <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="w-12 h-12 border rounded-lg cursor-pointer" />
                          </div>
                        </div>
                      )}

                      {systemSubSection === 'Settings' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-bold mb-1 text-sm">Default Timezone</label>
                              <select className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-950 font-semibold">
                                <option value="America/Phoenix">America/Phoenix (MST)</option>
                                <option value="America/New_York">America/New_York (EST)</option>
                                <option value="America/Denver">America/Denver (MDT)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block font-bold mb-1 text-sm">Date Format</label>
                              <select className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-950 font-semibold">
                                <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard)</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODULE 4: SHOP FLOOR SETTINGS */}
                  {settingsCategory === 'shop' && (
                    <div className="space-y-6 text-xs">
                      <div className="border-b pb-4">
                        <h3 className="text-lg font-black text-blue-600 dark:text-blue-400">Shop Floor Machine Configuration</h3>
                        <p className="text-slate-500 mt-1">Configure Bridge Saw lines, CNC router sequencing, and cooldown buffers.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                          <div>
                            <strong className="block text-sm">Bridge Saw Line 1 Buffer</strong>
                            <span className="text-slate-500">Automatic scheduled cooldown between slab cuts</span>
                          </div>
                          <span className="font-mono font-bold text-blue-600 bg-blue-100 dark:bg-blue-950 p-2 rounded-lg text-sm">15 Mins</span>
                        </div>

                        <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                          <div>
                            <strong className="block text-sm">CNC Router 2 Queue Mode</strong>
                            <span className="text-slate-500">Auto-sequence by material hardness & edge profile</span>
                          </div>
                          <span className="font-mono font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 p-2 rounded-lg text-sm">Optimized</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODULE 5: CALENDAR & HOLIDAYS */}
                  {settingsCategory === 'calendar' && (
                    <div className="space-y-8 text-xs">
                      
                      {/* Section Header */}
                      <div className="border-b pb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-black text-blue-600 dark:text-blue-400">Work Days & Company Holidays Configuration</h3>
                          <p className="text-slate-500 mt-1">
                            Configure standard working days (default Monday–Friday) and non-working holidays. Regional settings are optional and inherit from Subscriber level by default.
                          </p>
                        </div>
                      </div>

                      {/* 1. CONFIGURATION SCOPE SELECTOR */}
                      <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>Select Configuration Scope:</span>
                          </span>
                          <select
                            value={calendarConfigScope}
                            onChange={(e) => setCalendarConfigScope(e.target.value)}
                            className="p-2 border rounded-lg font-bold bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs cursor-pointer"
                          >
                            <option value="GLOBAL">Subscriber Level (Global Default - All Regions)</option>
                            <option value="Phoenix Metro (PHX)">Phoenix Metro (PHX)</option>
                            <option value="Tucson East (TUC)">Tucson East (TUC)</option>
                            <option value="Denver North (DEN)">Denver North (DEN)</option>
                            <option value="Tampa Plant (TPA)">Tampa Plant (TPA)</option>
                          </select>
                        </div>

                        {calendarConfigScope !== 'GLOBAL' && (
                          <label className="flex items-center space-x-2 font-bold cursor-pointer bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border">
                            <input
                              type="checkbox"
                              checked={regionalWorkDays[calendarConfigScope]?.inheritFromSubscriber ?? true}
                              onChange={(e) => handleToggleInheritance(calendarConfigScope, e.target.checked)}
                              className="rounded text-blue-600"
                            />
                            <span>Inherit Work Days from Subscriber Level</span>
                          </label>
                        )}
                      </div>

                      {/* 2. WORK DAYS SELECTION */}
                      <div className={`p-6 rounded-xl border space-y-4 shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
                        <div className="flex items-center justify-between border-b pb-3">
                          <div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                              <CalendarDays className="w-4 h-4 text-blue-600" />
                              <span>
                                Active Work Days for: {calendarConfigScope === 'GLOBAL' ? 'Subscriber Level (Global)' : calendarConfigScope}
                              </span>
                            </h4>
                            <span className="text-slate-500 text-[11px]">
                              Jobs and phase activities will auto-schedule exclusively across selected working days.
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded-lg font-mono font-bold text-xs">
                              {(() => {
                                const currentDays = calendarConfigScope === 'GLOBAL'
                                  ? globalWorkDays
                                  : (regionalWorkDays[calendarConfigScope]?.inheritFromSubscriber
                                      ? globalWorkDays
                                      : regionalWorkDays[calendarConfigScope]?.workDays || globalWorkDays);
                                const activeCount = Object.values(currentDays).filter(Boolean).length;
                                return `${activeCount} Work Days / Week`;
                              })()}
                            </span>
                          </div>
                        </div>

                        {/* Inheritance notice if regional and inheriting */}
                        {calendarConfigScope !== 'GLOBAL' && regionalWorkDays[calendarConfigScope]?.inheritFromSubscriber && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-800 dark:text-blue-300 text-xs flex items-center justify-between">
                            <span>Currently inheriting default M–F schedule from Subscriber Level. Uncheck the "Inherit" box above to apply a custom schedule for {calendarConfigScope}.</span>
                            <span className="font-bold text-xs uppercase tracking-wider">Inherited</span>
                          </div>
                        )}

                        {/* Day Checkboxes */}
                        <div className="grid grid-cols-7 gap-3 pt-2">
                          {(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const).map((dayKey) => {
                            const fullNames: Record<string, string> = {
                              Sun: 'Sunday',
                              Mon: 'Monday',
                              Tue: 'Tuesday',
                              Wed: 'Wednesday',
                              Thu: 'Thursday',
                              Fri: 'Friday',
                              Sat: 'Saturday',
                            };
                            const isChecked = calendarConfigScope === 'GLOBAL'
                              ? globalWorkDays[dayKey]
                              : (regionalWorkDays[calendarConfigScope]?.inheritFromSubscriber
                                  ? globalWorkDays[dayKey]
                                  : regionalWorkDays[calendarConfigScope]?.workDays[dayKey] ?? false);
                            
                            const isDisabled = calendarConfigScope !== 'GLOBAL' && regionalWorkDays[calendarConfigScope]?.inheritFromSubscriber;

                            return (
                              <button
                                key={dayKey}
                                type="button"
                                disabled={isDisabled}
                                onClick={() => handleToggleWorkDay(dayKey)}
                                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between space-y-2 cursor-pointer ${
                                  isDisabled ? 'opacity-60 cursor-not-allowed' : ''
                                } ${
                                  isChecked
                                    ? 'bg-blue-600 text-white font-bold shadow-md border-blue-600'
                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 hover:bg-slate-100'
                                }`}
                              >
                                <span className="font-black text-sm">{dayKey}</span>
                                <span className={`text-[10px] ${isChecked ? 'text-blue-100' : 'text-slate-400'}`}>
                                  {fullNames[dayKey]}
                                </span>
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                                  isChecked ? 'bg-white text-blue-600 font-bold' : 'border border-slate-400'
                                }`}>
                                  {isChecked ? '✓' : ''}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. COMPANY & REGIONAL HOLIDAYS */}
                      <div className={`p-6 rounded-xl border space-y-6 shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
                        <div className="flex items-center justify-between border-b pb-3">
                          <div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                              <ShieldAlert className="w-4 h-4 text-rose-600" />
                              <span>Company Holidays & Non-Working Days (MM/DD/YYYY)</span>
                            </h4>
                            <span className="text-slate-500 text-[11px]">
                              Auto-scheduler skips these dates when calculating template, fab, and install milestones.
                            </span>
                          </div>
                        </div>

                        {holidayAddedSuccess && (
                          <div className="p-3 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs flex items-center space-x-2 font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Custom holiday added successfully!</span>
                          </div>
                        )}

                        {/* Add Holiday Inline Form */}
                        <form onSubmit={handleAddCustomHoliday} className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-950 space-y-3">
                          <strong className="block font-bold text-xs text-blue-600 dark:text-blue-400">Add Custom Company or Regional Holiday:</strong>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold mb-1">Holiday Name</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Founder's Day or Shutdown"
                                value={newHolidayName}
                                onChange={(e) => setNewHolidayName(e.target.value)}
                                className="w-full p-2 border rounded font-semibold text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold mb-1">Date (MM/DD/YYYY)</label>
                              <input
                                type="text"
                                required
                                placeholder="MM/DD/YYYY (e.g. 10/12/2026)"
                                value={newHolidayDate}
                                onChange={(e) => setNewHolidayDate(e.target.value)}
                                className="w-full p-2 border rounded font-mono font-semibold text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold mb-1">Applies To Scope</label>
                              <select
                                value={newHolidayRegion}
                                onChange={(e) => setNewHolidayRegion(e.target.value)}
                                className="w-full p-2 border rounded font-semibold text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                              >
                                <option value="Global (All Regions)">Global (All Regions)</option>
                                <option value="Phoenix Metro (PHX)">Phoenix Metro (PHX)</option>
                                <option value="Tucson East (TUC)">Tucson East (TUC)</option>
                                <option value="Denver North (DEN)">Denver North (DEN)</option>
                                <option value="Tampa Plant (TPA)">Tampa Plant (TPA)</option>
                              </select>
                            </div>

                            <div className="flex items-end">
                              <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-bold py-2 px-3 rounded text-xs flex items-center justify-center space-x-1.5 hover:bg-blue-500 shadow-sm cursor-pointer"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Add Holiday</span>
                              </button>
                            </div>
                          </div>
                        </form>

                        {/* Holidays Table / List */}
                        <div className="border rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
                          {companyHolidays.map((h) => (
                            <div key={h.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                              <div className="space-y-0.5">
                                <div className="flex items-center space-x-2">
                                  <strong className="text-sm text-slate-800 dark:text-slate-200">{h.name}</strong>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    h.regionScope.includes('Global')
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                      : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                  }`}>
                                    {h.regionScope}
                                  </span>
                                  {h.isRecurring && (
                                    <span className="text-[10px] text-slate-400 font-medium">Annual Recurring</span>
                                  )}
                                </div>
                                <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                                  Date: {h.date}
                                </div>
                              </div>

                              <div className="flex items-center space-x-3">
                                <span className="px-3 py-1 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded font-bold text-[10px]">
                                  Non-Working Day
                                </span>
                                <button
                                  onClick={() => handleDeleteHoliday(h.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                  title="Delete Holiday"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* MODULE 6: JOB / BILLING */}
                  {(settingsCategory === 'job' || settingsCategory === 'billing') && (
                    <div className="space-y-6 text-xs">
                      <div className="border-b pb-4">
                        <h3 className="text-lg font-black text-blue-600 dark:text-blue-400 capitalize">{settingsCategory} Settings</h3>
                        <p className="text-slate-500 mt-1">Configuration parameters for {settingsCategory} active for subscriber tenant <strong>{subscriberName}</strong>.</p>
                      </div>
                      <div className="p-6 border rounded-xl bg-slate-50 dark:bg-slate-950">
                        <span className="text-sm font-semibold">Active schema parameters and fields are synced with database models.</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* 3. DATE EDITOR MODAL */}
      {editingDateJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full p-5 rounded-lg border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                <span>Edit Job Dates & Statuses</span>
              </h3>
              <button onClick={() => setEditingDateJob(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDates} className="mt-4 space-y-4 text-xs">
              <div className="text-slate-500 font-semibold">{editingDateJob.jobName}</div>

              <div className="space-y-1 p-3 border rounded bg-slate-50 dark:bg-slate-950">
                <label className="block font-bold">Stone Template Date</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. 7/20/2026 or No Date"
                    value={editTemplateDate}
                    onChange={(e) => setEditTemplateDate(e.target.value)}
                    className="w-full p-2 border rounded text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                  />
                  <select
                    value={editTemplateStatus}
                    onChange={(e) => setEditTemplateStatus(e.target.value as any)}
                    className="p-2 border rounded font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="conf">Confirmed (conf)</option>
                    <option value="auto">Auto-Schedule (auto)</option>
                    <option value="calc">Calculated (calc)</option>
                    <option value="tent">Tentative (tent)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 p-3 border rounded bg-slate-50 dark:bg-slate-950">
                <label className="block font-bold">Stone Fabrication Date</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. 7/22/2026 or No Date"
                    value={editFabDate}
                    onChange={(e) => setEditFabDate(e.target.value)}
                    className="w-full p-2 border rounded text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                  />
                  <select
                    value={editFabStatus}
                    onChange={(e) => setEditFabStatus(e.target.value as any)}
                    className="p-2 border rounded font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="conf">Confirmed (conf)</option>
                    <option value="auto">Auto-Schedule (auto)</option>
                    <option value="calc">Calculated (calc)</option>
                    <option value="tent">Tentative (tent)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 p-3 border rounded bg-slate-50 dark:bg-slate-950">
                <label className="block font-bold">Stone Install Date</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. 7/24/2026 or No Date"
                    value={editInstallDate}
                    onChange={(e) => setEditInstallDate(e.target.value)}
                    className="w-full p-2 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100"
                  />
                  <select
                    value={editInstallStatus}
                    onChange={(e) => setEditInstallStatus(e.target.value as any)}
                    className="p-2 border rounded font-bold text-slate-900 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="conf">Confirmed (conf)</option>
                    <option value="auto">Auto-Schedule (auto)</option>
                    <option value="calc">Calculated (calc)</option>
                    <option value="tent">Tentative (tent)</option>
                  </select>
                </div>
              </div>

              <div className="text-[11px] text-amber-600 font-medium">
                Note: Manually editing an auto-scheduled date automatically sets its status to 'Confirmed (conf)' and records a Change Log audit entry.
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setEditingDateJob(null)} className="px-3 py-1.5 border rounded cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded cursor-pointer">
                  Save Dates & Log Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. TOOLBAR ACTION MODALS */}

      {/* VIEWS MODAL */}
      {activeModal === 'views' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full p-5 rounded-lg border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm flex items-center space-x-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Select Saved View</span>
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              {savedViews.map((v, i) => (
                <div
                  key={i}
                  onClick={() => { selectSavedView(v); setActiveModal('none'); }}
                  className={`p-3 rounded border flex items-center justify-between cursor-pointer transition-all ${
                    activeView === v ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{v}</span>
                  {activeView === v && <Check className="w-4 h-4 text-blue-600" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMIZE COLUMNS MODAL */}
      {activeModal === 'customize' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full p-5 rounded-lg border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Customize Table Columns</span>
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="font-bold text-slate-500">Visible Grid Columns</div>
              {Object.keys(visibleColumns).map((colKey) => (
                <label key={colKey} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(visibleColumns as any)[colKey]}
                    onChange={(e) => setVisibleColumns({ ...visibleColumns, [colKey]: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span className="capitalize font-semibold">{colKey.replace(/([A-Z])/g, ' $1')}</span>
                </label>
              ))}

              <div className="pt-3 border-t flex items-center justify-between">
                <span className="font-bold">Compact Table Density</span>
                <input
                  type="checkbox"
                  checked={compactDensity}
                  onChange={(e) => setCompactDensity(e.target.checked)}
                  className="rounded text-blue-600"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button onClick={() => setActiveModal('none')} className="bg-blue-600 text-white font-bold px-4 py-2 rounded text-xs">
                  Apply Projection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SAVE VIEW MODAL */}
      {activeModal === 'save_view' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full p-5 rounded-lg border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm flex items-center space-x-2">
                <Save className="w-4 h-4 text-blue-600" />
                <span>Save Current View</span>
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveView} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">New View Name</label>
                <input
                  type="text"
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  placeholder="e.g. Active Builder Overview"
                  className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setActiveModal('none')} className="px-3 py-1.5 border rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded">
                  Save View
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTEXT-SCOPED CREATE MODAL (FOR ALL HIERARCHY LEVELS) */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`max-w-lg w-full p-6 rounded-xl border shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm flex items-center space-x-2 text-blue-600">
                <Plus className="w-4 h-4" />
                <span>
                  {createScope === 'account' && 'Create New Builder Account'}
                  {createScope === 'community' && `Create Subdivision for: ${selectedAccount?.name}`}
                  {createScope === 'lot' && `Create Lot in: ${selectedCommunity?.name}`}
                  {createScope === 'job' && 'Create New Job Order'}
                  {createScope === 'activity' && `Add Activity to Job: ${selectedJob?.jobName}`}
                </span>
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEntity} className="mt-4 space-y-4 text-xs">
              
              {/* CONTEXT: CREATE BUILDER ACCOUNT */}
              {createScope === 'account' && (
                <>
                  <div>
                    <label className="block font-bold mb-1">Builder Account Name</label>
                    <input
                      type="text"
                      required
                      value={newEntityName}
                      onChange={(e) => setNewEntityName(e.target.value)}
                      placeholder="e.g. D.R. HORTON - TAMPA BAY"
                      className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">Account Code</label>
                      <input
                        type="text"
                        value={newEntityCode}
                        onChange={(e) => setNewEntityCode(e.target.value)}
                        placeholder="e.g. DRHORTON-FL"
                        className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Primary Phone</label>
                      <input
                        type="text"
                        value={newEntityPhone}
                        onChange={(e) => setNewEntityPhone(e.target.value)}
                        placeholder="e.g. (813) 555-1234"
                        className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Corporate Billing Address</label>
                    <input
                      type="text"
                      value={newEntityAddress}
                      onChange={(e) => setNewEntityAddress(e.target.value)}
                      placeholder="e.g. 100 Corporate Blvd, Tampa, FL 33602"
                      className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">Primary Contact Name</label>
                      <input
                        type="text"
                        value={newEntityContact}
                        onChange={(e) => setNewEntityContact(e.target.value)}
                        placeholder="e.g. Karen Miller"
                        className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={newEntityEmail}
                        onChange={(e) => setNewEntityEmail(e.target.value)}
                        placeholder="e.g. kmiller@builder.com"
                        className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* CONTEXT: CREATE COMMUNITY / SUBDIVISION */}
              {createScope === 'community' && (
                <>
                  <div>
                    <label className="block font-bold mb-1">Subdivision / Community Name</label>
                    <input
                      type="text"
                      required
                      value={newEntityName}
                      onChange={(e) => setNewEntityName(e.target.value)}
                      placeholder="e.g. Cypress Creek Reserve"
                      className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">City / State</label>
                      <input
                        type="text"
                        value={newEntityAddress}
                        onChange={(e) => setNewEntityAddress(e.target.value)}
                        placeholder="e.g. Wesley Chapel, FL"
                        className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Lead Superintendent</label>
                      <input
                        type="text"
                        value={newEntityContact}
                        onChange={(e) => setNewEntityContact(e.target.value)}
                        placeholder="e.g. David Ross"
                        className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* CONTEXT: CREATE LOT */}
              {createScope === 'lot' && (
                <>
                  <div>
                    <label className="block font-bold mb-1">Lot Number / Unit</label>
                    <input
                      type="text"
                      required
                      value={newEntityName}
                      onChange={(e) => setNewEntityName(e.target.value)}
                      placeholder="e.g. Lot 48B or Unit 102"
                      className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Physical Street Address</label>
                    <input
                      type="text"
                      value={newEntityAddress}
                      onChange={(e) => setNewEntityAddress(e.target.value)}
                      placeholder="e.g. 542 Cypress Way"
                      className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                    />
                  </div>
                </>
              )}

              {/* CONTEXT: CREATE JOB */}
              {createScope === 'job' && (
                <>
                  <div>
                    <label className="block font-bold mb-1">Job Name / Number</label>
                    <input
                      type="text"
                      required
                      value={newEntityName}
                      onChange={(e) => setNewEntityName(e.target.value)}
                      placeholder="e.g. P2HSPN_001099_000_01"
                      className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Builder Account</label>
                    <select
                      value={newEntityAccount}
                      onChange={(e) => setNewEntityAccount(e.target.value)}
                      className="w-full p-2 border rounded font-semibold text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                    >
                      {accountsData.map(a => (
                        <option key={a.id} value={a.name}>{a.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Community (Subdivision)</label>
                    <input
                      type="text"
                      value={newEntityCommunity}
                      onChange={(e) => setNewEntityCommunity(e.target.value)}
                      className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Job Category</label>
                    <select
                      value={newJobCategory}
                      onChange={(e) => setNewJobCategory(e.target.value as any)}
                      className="w-full p-2 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                    >
                      <option value="INITIAL_INSTALL">Initial Install</option>
                      <option value="ADD_ON">Add-on Top</option>
                      <option value="REWORK_WARRANTY">Rework / Warranty</option>
                    </select>
                  </div>
                </>
              )}

              {/* CONTEXT: ADD ACTIVITY TO JOB */}
              {createScope === 'activity' && (
                <>
                  <div>
                    <label className="block font-bold mb-1">Activity Name</label>
                    <input
                      type="text"
                      required
                      value={newActivityName}
                      onChange={(e) => setNewActivityName(e.target.value)}
                      placeholder="e.g. Stone Quality Walk, Field Re-Measure"
                      className="w-full p-2.5 border rounded text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Phase</label>
                    <select
                      value={newActivityPhase}
                      onChange={(e) => setNewActivityPhase(e.target.value)}
                      className="w-full p-2 border rounded font-semibold text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
                    >
                      <option value="STONE">STONE</option>
                      <option value="CABINETRY">CABINETRY</option>
                      <option value="TILE">TILE</option>
                    </select>
                  </div>
                </>
              )}

              <div className="pt-3 flex justify-end space-x-2 border-t">
                <button type="button" onClick={() => setActiveModal('none')} className="px-4 py-2 border rounded cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white font-bold px-5 py-2 rounded shadow-md cursor-pointer hover:bg-blue-500">
                  {createScope === 'account' && 'Create Account'}
                  {createScope === 'community' && 'Create Subdivision'}
                  {createScope === 'lot' && 'Create Lot'}
                  {createScope === 'job' && 'Create Job'}
                  {createScope === 'activity' && 'Add Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: DEPENDENCY SHIFT CONFIRMATION MODAL */}
      {dependencyShiftPlan.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className={`max-w-xl w-full p-6 rounded-2xl border shadow-2xl space-y-4 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-300 text-slate-900'}`}>
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base">Schedule Dependency Shift Warning</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Changing the <strong>{dependencyShiftPlan.triggerPhase.toUpperCase()}</strong> date impacts downstream dependent activities:
                </p>
              </div>
            </div>

            {/* Target Install Deadline Exceeded Warning Banner */}
            {dependencyShiftPlan.isDeadlineExceeded && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-xl text-xs flex items-start space-x-3 text-amber-900 dark:text-amber-200">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <strong className="block font-bold">Target Install Deadline Warning</strong>
                  <span>The proposed install date ({dependencyShiftPlan.affectedActivities.find(a => a.phase === 'install')?.proposedDate}) is <strong>{dependencyShiftPlan.daysLate} day(s)</strong> past the builder's agreed Target Install Deadline ({dependencyShiftPlan.targetInstallDate}).</span>
                </div>
              </div>
            )}

            {/* Affected Activities Cascade Table */}
            <div className="border rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 font-bold">
                  <tr>
                    <th className="p-2.5">Milestone / Activity</th>
                    <th className="p-2.5 text-center">Current Date</th>
                    <th className="p-2.5 text-center">Shifted Proposed Date</th>
                    <th className="p-2.5 text-center">Working Days Lag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {dependencyShiftPlan.affectedActivities.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-2.5 font-bold uppercase">{item.phase} Milestone</td>
                      <td className="p-2.5 text-center text-slate-500 line-through">{item.currentDate}</td>
                      <td className="p-2.5 text-center font-bold text-blue-600 dark:text-blue-400">{item.proposedDate}</td>
                      <td className="p-2.5 text-center font-mono">+{item.workdayOffset} working days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Non-working weekend days, regional holidays, and plant shutdowns have been automatically calculated.
            </p>

            <div className="pt-3 border-t flex justify-end space-x-2.5">
              <button
                onClick={() => setDependencyShiftPlan({ ...dependencyShiftPlan, isOpen: false })}
                className="px-4 py-2 rounded-lg border text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={applyDependencyShiftPlan}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Shift & Cascade Dates</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FORM VALIDATION HARD-BLOCK MODAL */}
      {formValidationModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-4 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-300 text-slate-900'}`}>
            <div className="flex items-center space-x-3 pb-3 border-b border-rose-200 dark:border-rose-900">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-rose-600 dark:text-rose-400">Completion Blocked</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Required Builder Sign-Off Form Incomplete
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300">
              The activity <strong>"{formValidationModal.activity?.activityName}"</strong> cannot be marked complete because the mandatory builder form (<strong>{formValidationModal.formTemplate?.formName}</strong>) has missing required fields:
            </p>

            {/* List of missing fields */}
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl space-y-1.5">
              <span className="block font-bold text-xs text-rose-700 dark:text-rose-300">Incomplete Required Fields:</span>
              <ul className="list-disc list-inside text-xs text-rose-900 dark:text-rose-200 font-medium space-y-1">
                {formValidationModal.missingFields.map((field, idx) => (
                  <li key={idx}><strong>{field}</strong> is required</li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t flex justify-end space-x-2">
              <button
                onClick={() => setFormValidationModal({ ...formValidationModal, isOpen: false })}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shadow-md cursor-pointer"
              >
                Complete Required Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PRINTABLE JOB PACKET CLIPBOARD SHEET (NO BARCODE / QR) */}
      {printJobPacketJob && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="max-w-3xl w-full bg-white text-slate-900 p-8 rounded-2xl shadow-2xl space-y-6 my-8 print:m-0 print:p-0 print:shadow-none print:w-full">
            {/* Top Toolbar (Hidden when printing) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <div className="flex items-center space-x-2">
                <Printer className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base">Printable Clipboard Job Packet</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Sheet</span>
                </button>
                <button
                  onClick={() => setPrintJobPacketJob(null)}
                  className="px-3 py-2 border rounded-lg text-xs font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* PRINTABLE PACKET SHEET CONTENT */}
            <div className="space-y-6 text-xs font-sans">
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900">APEX STONEWORKS</h1>
                  <p className="text-slate-600 font-medium">Production Fabrication & Installation Field Packet</p>
                  <p className="text-slate-500 text-[11px]">{selectedRegion} Operating Hub • (813) 555-0100</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-400">JOB ORDER NUMBER</div>
                  <div className="text-lg font-black font-mono text-blue-800">{printJobPacketJob.jobName}</div>
                  <div className="text-[11px] text-slate-500">Order Category: {printJobPacketJob.jobCategory}</div>
                </div>
              </div>

              {/* Order & Location Overview Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 border border-slate-300 rounded-lg bg-slate-50">
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Builder Account</span>
                  <strong className="text-sm text-slate-900">{printJobPacketJob.accountName}</strong>
                  <div className="mt-1"><span className="text-slate-500 font-semibold">Subdivision:</span> {printJobPacketJob.communityName}</div>
                  <div><span className="text-slate-500 font-semibold">Lot / Unit:</span> <strong className="text-blue-700">Lot {printJobPacketJob.lotNumber}</strong></div>
                  <div><span className="text-slate-500 font-semibold">Builder Phase:</span> {printJobPacketJob.builderPhase || 'PHASE ONE'}</div>
                </div>

                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Job Site Address</span>
                  <strong className="text-slate-900 block">{printJobPacketJob.streetAddress}</strong>
                  <div className="text-slate-600">{printJobPacketJob.cityStateZip}</div>
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <div><span className="text-slate-500 font-semibold">Site Superintendent:</span> {printJobPacketJob.fieldSuper || 'Mark Stevens'} (813-555-0192)</div>
                    <div><span className="text-slate-500 font-semibold">Assigned Crew:</span> {printJobPacketJob.assignedCrew || 'Install Truck 1'}</div>
                  </div>
                </div>
              </div>

              {/* Milestone Schedule */}
              <div>
                <h4 className="font-black text-xs uppercase tracking-wider mb-2 text-slate-800">Production Milestones</h4>
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <thead className="bg-slate-100 font-bold">
                    <tr>
                      <th className="border border-slate-300 p-2 text-left">Phase</th>
                      <th className="border border-slate-300 p-2 text-center">Scheduled Date</th>
                      <th className="border border-slate-300 p-2 text-center">Status</th>
                      <th className="border border-slate-300 p-2 text-left">Assigned Resource</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 font-bold">Laser Template</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">{printJobPacketJob.templateDate.date}</td>
                      <td className="border border-slate-300 p-2 text-center">{printJobPacketJob.templateDate.status.toUpperCase()}</td>
                      <td className="border border-slate-300 p-2">Digital Field Templater 1</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-bold">Shop Fabrication</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">{printJobPacketJob.fabDate.date}</td>
                      <td className="border border-slate-300 p-2 text-center">{printJobPacketJob.fabDate.status.toUpperCase()}</td>
                      <td className="border border-slate-300 p-2">Bridge Saw 1 & CNC 2</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-bold">Field Installation</td>
                      <td className="border border-slate-300 p-2 text-center font-mono font-bold text-blue-700">{printJobPacketJob.installDate.date}</td>
                      <td className="border border-slate-300 p-2 text-center font-bold">{printJobPacketJob.installDate.status.toUpperCase()}</td>
                      <td className="border border-slate-300 p-2 font-bold">{printJobPacketJob.assignedCrew || 'Install Truck 1'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Stone Material Specifications */}
              <div className="p-3.5 border border-slate-300 rounded-lg space-y-2">
                <h4 className="font-black text-xs uppercase tracking-wider text-slate-800">Stone & Material Specs</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div><span className="text-slate-500">Material Name:</span> <strong>Calacatta Gold Quartz (3CM)</strong></div>
                  <div><span className="text-slate-500">Edge Detail:</span> <strong>1.5" Eased Edge</strong></div>
                  <div><span className="text-slate-500">Sink Cutouts:</span> <strong>1x Undermount Double Bowl</strong></div>
                </div>
              </div>

              {/* Field Sign-Off Checklist & Signatures */}
              <div className="border border-slate-300 rounded-lg p-4 space-y-4">
                <h4 className="font-black text-xs uppercase tracking-wider text-slate-800">Field Completion & Quality Inspection Sign-Off</h4>
                
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-slate-400 rounded-xs"></div>
                    <span>Cabinets level & stone seams tight / color matched</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-slate-400 rounded-xs"></div>
                    <span>Sink mounted, glued, and clips secured</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-slate-400 rounded-xs"></div>
                    <span>Cooktop / faucet cutouts verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-slate-400 rounded-xs"></div>
                    <span>Cleaned, sealed, and silicone applied</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200">
                  <div>
                    <div className="border-b border-slate-400 h-8"></div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>Field Installer Signature</span>
                      <span>Date</span>
                    </div>
                  </div>

                  <div>
                    <div className="border-b border-slate-400 h-8"></div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>Superintendent / Builder Acceptance</span>
                      <span>Date</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
