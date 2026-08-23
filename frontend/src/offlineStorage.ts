/**
 * SlabMaster Offline Storage & Sync Queue
 * Stores form answers, signatures, and photos in localStorage / IndexedDB
 * with automatic synchronization upon network restoration.
 */

export interface OfflineFormSubmission {
  jobId: string;
  activityId?: string;
  packetId: string;
  formId: string;
  formTitle: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  answers: Record<string, any>;
  signatures: Record<string, string>; // fieldId -> base64 png
  photos: Record<string, string[]>; // fieldId -> array of base64 photos
  savedAt: string;
  submittedBy: string;
  isSynced: boolean;
}

const STORAGE_KEY = 'slabmaster_offline_forms';

export function getOfflineSubmissions(): OfflineFormSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading offline submissions:', err);
    return [];
  }
}

export function saveOfflineSubmission(submission: OfflineFormSubmission): void {
  try {
    const list = getOfflineSubmissions();
    const index = list.findIndex(
      (s) => s.jobId === submission.jobId && s.formId === submission.formId && s.activityId === submission.activityId
    );
    if (index >= 0) {
      list[index] = submission;
    } else {
      list.push(submission);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving offline submission:', err);
  }
}

export function getOfflineFormForJob(jobId: string, formId: string, activityId?: string): OfflineFormSubmission | null {
  const list = getOfflineSubmissions();
  return list.find((s) => s.jobId === jobId && s.formId === formId && (activityId ? s.activityId === activityId : true)) || null;
}

export function isDeviceOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}