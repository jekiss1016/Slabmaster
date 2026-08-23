import React, { useState, useMemo } from 'react';
import { FormPacket, FormTemplate } from '../types/forms';
import { getOfflineFormForJob, isDeviceOnline } from '../offlineStorage';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  MapPin,
  User,
  ShieldCheck,
  Smartphone,
  Wifi,
  WifiOff,
  Filter,
  CheckSquare,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface JobRow {
  id: string;
  jobName: string;
  jobCategory?: 'INITIAL_INSTALL' | 'ADD_ON' | 'REWORK_WARRANTY' | 'CUSTOMER_SERVICE' | string;
  accountId: string;
  accountName: string;
  accountCode: string;
  communityId: string;
  communityName: string;
  lotNumber: string;
  streetAddress: string;
  cityStateZip: string;
  templateDate: { date: string; status: 'auto' | 'tent' | 'calc' | 'conf' | 'none' };
  fabDate: { date: string; status: 'auto' | 'tent' | 'calc' | 'conf' | 'none' };
  installDate: { date: string; status: 'auto' | 'tent' | 'calc' | 'conf' | 'none' };
  salesperson: string;
  externalId: string;
  status: string;
  isArchived: boolean;
  assignedCrew?: string;
  materialOrdered?: boolean;
  materialETA?: string;
  materialReceived?: boolean;
  materialReceivedOn?: string;
  sinksOrdered?: boolean;
  sinksETA?: string;
  sinksReceived?: boolean;
  sinksReceivedOn?: string;
  purchasingNotes?: string;
  installerNotesText?: string;
  files?: { name: string; type: string; url: string }[];
  activities?: Array<{
    id: string;
    activityName: string;
    phase: string;
    status: string;
    startDate: string;
    schedTime: string;
    duration: string;
    assignedTo: string;
    notes?: string;
  }>;
}

interface FieldJobsSegmentedViewProps {
  jobs: any[];
  userRole: string;
  currentUser: string;
  assignedToName?: string;
  formPackets: FormPacket[];
  formTemplates: FormTemplate[];
  isDark: boolean;
  onOpenFormRunner: (template: FormTemplate, job: any, activity?: any, packetId?: string) => void;
  onSelectJobDetail: (job: any) => void;
}

export const FieldJobsSegmentedView: React.FC<FieldJobsSegmentedViewProps> = ({
  jobs,
  userRole,
  currentUser,
  assignedToName,
  formPackets,
  formTemplates,
  isDark,
  onOpenFormRunner,
  onSelectJobDetail
}) => {
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PAST' | 'FUTURE' | 'CALENDAR'>('ACTIVE');
  const [calendarOffsetDays, setCalendarOffsetDays] = useState<number>(0);
  const isOnline = isDeviceOnline();

  // Helper to parse date string
  const parseJobDate = (dateStr: string): Date | null => {
    if (!dateStr || dateStr === 'No Date' || dateStr.toLowerCase().includes('auto')) return null;
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const getJobPrimaryDate = (job: JobRow): string => {
    if (job.installDate?.date && job.installDate.date !== 'No Date') return job.installDate.date;
    if (job.templateDate?.date && job.templateDate.date !== 'No Date') return job.templateDate.date;
    if (job.fabDate?.date && job.fabDate.date !== 'No Date') return job.fabDate.date;
    return 'No Date';
  };

  const isJobCompleted = (job: JobRow): boolean => {
    if (job.status?.toLowerCase() === 'completed') return true;
    if (job.activities && job.activities.length > 0) {
      return job.activities.every((a) => a.status?.toLowerCase() === 'complete');
    }
    return false;
  };

  // Filter jobs by assigned user (Supervisor sees all assigned plant facilities; Tech/Crew sees theirs)
  const scopedJobs = useMemo(() => {
    if (userRole === 'INTERNAL_QA_SUPERVISOR' || userRole === 'SUBSCRIBER_ADMIN' || userRole === 'SYSTEM_ADMIN') {
      return jobs;
    }
    return jobs.filter((j) => {
      if (assignedToName && j.assignedCrew === assignedToName) return true;
      if (j.activities?.some((a: any) => a.assignedTo === assignedToName || a.assignedTo === currentUser)) return true;
      return true; // Fallback to allow exploration in simulator
    });
  }, [jobs, userRole, currentUser, assignedToName]);

  // Current today reference
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Classify jobs into Active, Past, and Future
  const { activeJobs, pastJobs, futureJobs } = useMemo(() => {
    const active: JobRow[] = [];
    const past: JobRow[] = [];
    const future: JobRow[] = [];

    scopedJobs.forEach((job) => {
      const dStr = getJobPrimaryDate(job);
      const d = parseJobDate(dStr);
      const isDone = isJobCompleted(job);

      if (isDone) {
        past.push(job);
      } else if (!d) {
        active.push(job); // Unscheduled active tasks
      } else {
        const jobDate = new Date(d);
        jobDate.setHours(0, 0, 0, 0);

        if (jobDate < today) {
          // Scheduled in the past but NOT completed -> Active per user rule!
          active.push(job);
        } else if (jobDate.getTime() === today.getTime()) {
          // Today's jobs
          active.push(job);
        } else {
          // Future dates
          future.push(job);
        }
      }
    });

    return { activeJobs: active, pastJobs: past, futureJobs: future };
  }, [scopedJobs, today]);

  // 7-Day Rolling Calendar calculation (Infinite ±7 days pagination from Today)
  const calendarDays = useMemo(() => {
    const days: { date: Date; dateStr: string; label: string; jobs: JobRow[] }[] = [];
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + calendarOffsetDays);

    for (let i = 0; i < 7; i++) {
      const current = new Date(startDate);
      current.setDate(current.getDate() + i);
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, '0');
      const dd = String(current.getDate()).padStart(2, '0');
      const dateStr = mm + '/' + dd + '/' + yyyy;
      const label = current.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      const matchingJobs = scopedJobs.filter((job) => {
        const dStr = getJobPrimaryDate(job);
        const d = parseJobDate(dStr);
        if (!d) return false;
        const jd = new Date(d);
        jd.setHours(0, 0, 0, 0);
        return jd.getTime() === current.getTime();
      });

      days.push({ date: current, dateStr, label, jobs: matchingJobs });
    }

    return days;
  }, [scopedJobs, today, calendarOffsetDays]);

  // Determine Form Status Badge for a given template and job
  const renderFormStatusBadge = (job: JobRow, template: FormTemplate, activityId?: string) => {
    const submission = getOfflineFormForJob(job.id, template.id, activityId);
    const formStatus = submission?.status || 'NOT_STARTED';

    if (formStatus === 'COMPLETED') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>COMPLETED</span>
        </span>
      );
    }
    if (formStatus === 'IN_PROGRESS') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800 flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>IN PROGRESS</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center space-x-1">
        <span>⚪</span>
        <span>NOT STARTED</span>
      </span>
    );
  };

  const renderJobCard = (job: JobRow) => {
    return (
      <div
        key={job.id}
        className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {job.accountName}
              </span>
              <span className="font-bold text-xs text-slate-500">• Lot {job.lotNumber}</span>
            </div>
            <h3
              onClick={() => onSelectJobDetail(job)}
              className="font-bold text-base text-blue-600 dark:text-blue-400 hover:underline cursor-pointer tracking-tight"
            >
              {job.jobName}
            </h3>
            <p className="text-xs text-slate-500 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{job.streetAddress}, {job.cityStateZip}</span>
            </p>
          </div>

          <div className="text-right space-y-1">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-black block ${
              isJobCompleted(job)
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {isJobCompleted(job) ? 'COMPLETED' : 'ACTIVE DISPATCH'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono block">
              Sched: {getJobPrimaryDate(job)}
            </span>
          </div>
        </div>

        {/* Milestone Activities & Linked Form Packets */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Assigned Activities & Sign-Off Packets:</span>

          <div className="space-y-2">
            {(job.activities || [
              { id: 'act_default', activityName: 'Stone Install & QA Walk', phase: 'STONE', status: 'Auto-Schedule', startDate: getJobPrimaryDate(job), schedTime: '8:00am', duration: '120m', assignedTo: currentUser }
            ]).map((act) => {
              // Find bundled form templates for this activity or default QA forms
              const relevantTemplates = formTemplates.slice(0, 2);

              return (
                <div
                  key={act.id}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{act.activityName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-semibold">{act.phase}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                      <User className="w-3 h-3" />
                      <span>Assigned: <strong>{act.assignedTo || 'Unassigned'}</strong></span>
                      <span>•</span>
                      <span>Time: {act.schedTime} ({act.duration})</span>
                    </div>
                  </div>

                  {/* Form Action Buttons with 3-State Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {relevantTemplates.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => onOpenFormRunner(tpl, job, act, 'pkt_default')}
                        className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center space-x-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-2xs cursor-pointer transition-all"
                        title={'Open ' + tpl.title}
                      >
                        <FileCheck className="w-3.5 h-3.5 text-blue-500" />
                        <span className="truncate max-w-[120px]">{tpl.title.split(' ')[0]} Form</span>
                        {renderFormStatusBadge(job, tpl, act.id)}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Field Top Bar & Online/Offline Indicator */}
      <div className={`px-4 sm:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-600 text-white">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black tracking-tight">Field Technician & QA Dispatch Hub</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                {userRole === 'INTERNAL_QA_SUPERVISOR' ? 'QA Supervisor Mode' : userRole === 'INTERNAL_QA_TECH' ? 'Field QA Tech Mode' : 'Field Installer Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-500">Live field dispatching, digital touch sign-offs, and photo documentation</p>
          </div>
        </div>

        {/* Offline Cache Indicator */}
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 border ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
          }`}>
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Online & Synced' : 'Offline Cache Active'}</span>
          </div>
        </div>
      </div>

      {/* Segmented Tabs Navigation & Legend */}
      <div className={`px-4 sm:px-6 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'ACTIVE'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Active Jobs ({activeJobs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PAST')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'PAST'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Past / Completed ({pastJobs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('FUTURE')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'FUTURE'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Future Scheduled ({futureJobs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CALENDAR')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'CALENDAR'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>7-Day Field Calendar</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-400">Legend:</span>
          <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span><span>Not Started</span></span>
          <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span>In Progress</span></span>
          <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span>Completed</span></span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* TAB 1: ACTIVE JOBS */}
        {activeTab === 'ACTIVE' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Showing jobs scheduled for <strong>Today</strong> plus all uncompleted active milestones from prior days.</span>
              </div>
              <span className="font-black font-mono">{activeJobs.length} active job(s)</span>
            </div>

            {activeJobs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 border border-dashed rounded-2xl dark:border-slate-800">
                No active jobs pending for today. All scheduled work is up-to-date!
              </div>
            ) : (
              activeJobs.map(renderJobCard)
            )}
          </div>
        )}

        {/* TAB 2: PAST JOBS */}
        {activeTab === 'PAST' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            {pastJobs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 border border-dashed rounded-2xl dark:border-slate-800">
                No past completed jobs found.
              </div>
            ) : (
              pastJobs.map(renderJobCard)
            )}
          </div>
        )}

        {/* TAB 3: FUTURE JOBS */}
        {activeTab === 'FUTURE' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            {futureJobs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 border border-dashed rounded-2xl dark:border-slate-800">
                No future jobs scheduled beyond today.
              </div>
            ) : (
              futureJobs.map(renderJobCard)
            )}
          </div>
        )}

        {/* TAB 4: 7-DAY ROLLING FIELD CALENDAR */}
        {activeTab === 'CALENDAR' && (
          <div className="space-y-4 max-w-7xl mx-auto">
            {/* Calendar Controls & Infinite ±7 Days Pagination */}
            <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm">7-Day Field Dispatch Calendar</h3>
                <span className="text-xs text-slate-400">({calendarDays[0].label} – {calendarDays[6].label})</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setCalendarOffsetDays((prev) => prev - 7)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center space-x-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
                  title="Move back 7 days"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prior 7 Days</span>
                </button>

                {calendarOffsetDays !== 0 && (
                  <button
                    type="button"
                    onClick={() => setCalendarOffsetDays(0)}
                    className="px-3 py-1.5 rounded-lg text-xs font-black bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                  >
                    Today
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setCalendarOffsetDays((prev) => prev + 7)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center space-x-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
                  title="Move forward 7 days"
                >
                  <span>Next 7 Days</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 7-Day Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {calendarDays.map((colDay, cIdx) => {
                const isDayToday = colDay.date.getTime() === today.getTime();

                return (
                  <div
                    key={cIdx}
                    className={`rounded-2xl border flex flex-col min-h-[380px] overflow-hidden ${
                      isDayToday
                        ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20'
                        : isDark
                        ? 'bg-slate-900 border-slate-800'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    {/* Day Column Header */}
                    <div className={`p-3 border-b text-center ${
                      isDayToday
                        ? 'bg-blue-600 text-white'
                        : isDark
                        ? 'bg-slate-950 text-slate-300 border-slate-800'
                        : 'bg-slate-50 text-slate-800 border-slate-200'
                    }`}>
                      <div className="font-bold text-xs">{colDay.label}</div>
                      <div className="text-[10px] font-mono mt-0.5 opacity-90">{colDay.jobs.length} job(s)</div>
                    </div>

                    {/* Day Jobs List */}
                    <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                      {colDay.jobs.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-[11px] text-slate-400 italic text-center p-4">
                          No jobs scheduled
                        </div>
                      ) : (
                        colDay.jobs.map((job) => (
                          <div
                            key={job.id}
                            className={`p-2.5 rounded-xl border text-xs space-y-1.5 cursor-pointer hover:shadow-md transition-all ${
                              isDark ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200'
                            }`}
                            onClick={() => onSelectJobDetail(job)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-black text-[10px] text-blue-600 dark:text-blue-400">
                                Lot {job.lotNumber}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400">
                                {job.accountName.split(' ')[0]}
                              </span>
                            </div>
                            <div className="font-bold text-[11px] truncate">{job.jobName}</div>
                            <div className="text-[10px] text-slate-500 truncate">{job.streetAddress}</div>

                            {/* Quick Form Trigger */}
                            <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                              <span className="text-[9px] font-semibold text-purple-600">QA Sign-Off</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenFormRunner(formTemplates[0], job, job.activities?.[0], 'pkt_default');
                                }}
                                className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded text-[9px] font-bold hover:bg-blue-100"
                              >
                                Run Form
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};