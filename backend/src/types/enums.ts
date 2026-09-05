export const AuthProvider = {
  EMAIL_PASSWORD: 'EMAIL_PASSWORD',
  ENTRA_ID: 'ENTRA_ID',
  HYBRID: 'HYBRID',
} as const;
export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider];

export const RegionStatus = {
  ACTIVE: 'ACTIVE',
  SHUTDOWN: 'SHUTDOWN',
} as const;
export type RegionStatus = (typeof RegionStatus)[keyof typeof RegionStatus];

export const JobCategory = {
  INITIAL_INSTALL: 'INITIAL_INSTALL',
  ADD_ON: 'ADD_ON',
  REWORK_WARRANTY: 'REWORK_WARRANTY',
  CUSTOMER_SERVICE: 'CUSTOMER_SERVICE',
} as const;
export type JobCategory = (typeof JobCategory)[keyof typeof JobCategory];

export const ProcessType = {
  Job: 'Job',
  Lead: 'Lead',
} as const;
export type ProcessType = (typeof ProcessType)[keyof typeof ProcessType];

export const JobStatus = {
  Draft: 'Draft',
  Active: 'Active',
  OnHold: 'OnHold',
  Complete: 'Complete',
  Cancelled: 'Cancelled',
} as const;
export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];

export const OffsetDir = {
  Before: 'Before',
  After: 'After',
} as const;
export type OffsetDir = (typeof OffsetDir)[keyof typeof OffsetDir];

export const ActivityStatus = {
  Tentative: 'Tentative',
  Confirmed: 'Confirmed',
  AutoSchedule: 'AutoSchedule',
  Complete: 'Complete',
  Cancelled: 'Cancelled',
} as const;
export type ActivityStatus = (typeof ActivityStatus)[keyof typeof ActivityStatus];

export const UserRole = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  SUBSCRIBER_ADMIN: 'SUBSCRIBER_ADMIN',
  INTERNAL_OFFICE_USER: 'INTERNAL_OFFICE_USER',
  INTERNAL_ESTIMATOR: 'INTERNAL_ESTIMATOR',
  EXTERNAL_CREW_ADMIN: 'EXTERNAL_CREW_ADMIN',
  EXTERNAL_FIELD_INSTALLER: 'EXTERNAL_FIELD_INSTALLER',
  EXTERNAL_SUBCONTRACTOR: 'EXTERNAL_SUBCONTRACTOR',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const ErpSyncStatus = {
  PENDING: 'PENDING',
  RETRYING: 'RETRYING',
  FAILED: 'FAILED',
  COMPLETED: 'COMPLETED',
} as const;
export type ErpSyncStatus = (typeof ErpSyncStatus)[keyof typeof ErpSyncStatus];
