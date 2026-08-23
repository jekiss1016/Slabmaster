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
  Sparkles,
  Navigation,
  Phone
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
  const [selectedMobileDayIndex, setSelectedMobileDayIndex] = useState<number>(0);
  const [fieldCalHoverInfo, setFieldCalHoverInfo] = useState<{ job: JobRow; top: number; left: number } | null>(null);
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

  // Filter jobs by assigned user
  const scopedJobs = useMemo(() => {
    if (userRole === 'INTERNAL_QA_SUPERVISOR' || userRole === 'SUBSCRIBER_ADMIN' || userRole === 'SYSTEM_ADMIN') {
      return jobs;
    }
    return jobs.filter((j) => {
      if (assignedToName && j.assignedCrew === assignedToName) return true;
      if (j.activities?.some((a: any) => a.assignedTo === assignedToName || a.assignedTo === currentUser)) return true;
      return true; // Simulator fallback
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
          active.push(job);
        } else {
          future.push(job);
        }
      }
    });

    return { activeJobs: active, pastJobs: past, futureJobs: future };
  }, [scopedJobs, today]);

  // 7-Day Rolling Calendar calculation (Infinite ±7 days pagination from Today)
  const calendarDays = useMemo(() => {
    const days: { date: Date; dateStr: string; label: string; shortDay: string; jobs: JobRow[] }[] = [];
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
      const shortDay = current.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

      const matchingJobs = scopedJobs.filter((job) => {
        const dStr = getJobPrimaryDate(job);
        const d = parseJobDate(dStr);
        if (!d) return false;
        const jd = new Date(d);
        jd.setHours(0, 0, 0, 0);
        return jd.getTime() === current.getTime();
      });

      days.push({ date: current, dateStr, label, shortDay, jobs: matchingJobs });
    }

    return days;
  }, [scopedJobs, today, calendarOffsetDays]);

  // Determine Form Status Badge for a given template and job
  const renderFormStatusBadge = (job: JobRow, template: FormTemplate, activityId?: string) => {
    const submission = getOfflineFormForJob(job.id, template.id, activityId);
    const formStatus = submission?.status || 'NOT_STARTED';

    if (formStatus === 'COMPLETED') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1 shrink-0">
          <CheckCircle2 className="w-3 h-3" />
          <span>COMPLETED</span>
        </span>
      );
    }
    if (formStatus === 'IN_PROGRESS') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800 flex items-center space-x-1 shrink-0">
          <Clock className="w-3 h-3" />
          <span>IN PROGRESS</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center space-x-1 shrink-0">
        <span>⚪</span>
        <span>NOT STARTED</span>
      </span>
    );
  };

  const renderJobCard = (job: JobRow) => {
    const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(`${job.streetAddress}, ${job.cityStateZip}`)}`;

    return (
      <div
        key={job.id}
        className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 ${
          isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
        }`}
      >
        <div className="flex items-start justify-between gap-2.5">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {job.accountName}
              </span>
              <span className="font-bold text-xs text-slate-500">• Lot {job.lotNumber}</span>
            </div>
            <h3
              onClick={() => onSelectJobDetail(job)}
              className="font-bold text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline cursor-pointer tracking-tight truncate block"
            >
              {job.jobName}
            </h3>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-500 hover:text-blue-600 flex items-center space-x-1 underline cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">{job.streetAddress}, {job.cityStateZip}</span>
              </a>
            </div>
          </div>

          <div className="text-right space-y-1 shrink-0">
            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black block ${
              isJobCompleted(job)
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {isJobCompleted(job) ? 'COMPLETED' : 'ACTIVE DISPATCH'}
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono block">
              {getJobPrimaryDate(job)}
            </span>
          </div>
        </div>

        {/* Milestone Activities & Linked Form Packets */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Assigned Activities & Forms:</span>

          <div className="space-y-2">
            {(job.activities || [
              { id: 'act_default', activityName: 'Stone Install & QA Walk', phase: 'STONE', status: 'Auto-Schedule', startDate: getJobPrimaryDate(job), schedTime: '8:00am', duration: '120m', assignedTo: currentUser }
            ]).map((act) => {
              const relevantTemplates = formTemplates.slice(0, 2);

              return (
                <div
                  key={act.id}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{act.activityName}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-semibold">{act.phase}</span>
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{act.assignedTo || 'Unassigned'}</span>
                      <span>•</span>
                      <span>{act.schedTime} ({act.duration})</span>
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:pt-0">
                    {relevantTemplates.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => onOpenFormRunner(tpl, job, act, 'pkt_default')}
                        className="px-2.5 py-2 sm:py-1.5 rounded-lg border text-xs font-bold flex items-center space-x-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-2xs cursor-pointer transition-all active:scale-95 min-h-[38px] sm:min-h-0"
                        title={'Open ' + tpl.title}
                      >
                        <FileCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate max-w-[110px]">{tpl.title.split(' ')[0]}</span>
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
      <div className={`px-3.5 sm:px-6 py-2.5 sm:py-3 border-b flex flex-wrap items-center justify-between gap-2.5 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
            <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm sm:text-base font-black tracking-tight">Field Technician Dispatch</h2>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                {userRole === 'INTERNAL_QA_SUPERVISOR' ? 'Supervisor' : userRole === 'INTERNAL_QA_TECH' ? 'QA Tech' : 'Installer'}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500">Live dispatching, touch signatures, and offline sync</p>
          </div>
        </div>

        {/* Offline Cache Indicator */}
        <div className="flex items-center space-x-2">
          <div className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center space-x-1 border ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
          }`}>
            {isOnline ? <Wifi className="w-3 h-3 text-emerald-600" /> : <WifiOff className="w-3 h-3 text-amber-600" />}
            <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
          </div>
        </div>
      </div>

      {/* Segmented Tabs Navigation (Smooth Horizontal Touch Scroll on Phones) */}
      <div className={`px-3 sm:px-6 py-2 border-b flex items-center justify-between gap-2 overflow-x-auto no-scrollbar scroll-smooth ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex space-x-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
              activeTab === 'ACTIVE'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Active ({activeJobs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PAST')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
              activeTab === 'PAST'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Past ({pastJobs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('FUTURE')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
              activeTab === 'FUTURE'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Future ({futureJobs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CALENDAR')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
              activeTab === 'CALENDAR'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>7-Day Calendar</span>
          </button>
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center space-x-3 text-[11px] text-slate-500 shrink-0">
          <span className="font-semibold text-slate-400">Legend:</span>
          <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span><span>Not Started</span></span>
          <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span>In Progress</span></span>
          <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span>Completed</span></span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4">
        {/* TAB 1: ACTIVE JOBS */}
        {activeTab === 'ACTIVE' && (
          <div className="space-y-3.5 max-w-5xl mx-auto">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[11px] sm:text-xs">Jobs scheduled for <strong>Today</strong> + uncompleted active milestones.</span>
              </div>
              <span className="font-black font-mono shrink-0 ml-2">{activeJobs.length}</span>
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
          <div className="space-y-3.5 max-w-5xl mx-auto">
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
          <div className="space-y-3.5 max-w-5xl mx-auto">
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
            <div className={`p-3 sm:p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-2.5 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                <h3 className="font-bold text-xs sm:text-sm">7-Day Dispatch Calendar</h3>
                <span className="text-[10px] sm:text-xs text-slate-400">({calendarDays[0].shortDay} – {calendarDays[6].shortDay})</span>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setCalendarOffsetDays((prev) => prev - 7)}
                  className="px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center space-x-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prior 7 Days</span>
                </button>

                {calendarOffsetDays !== 0 && (
                  <button
                    type="button"
                    onClick={() => setCalendarOffsetDays(0)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-black bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                  >
                    Today
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setCalendarOffsetDays((prev) => prev + 7)}
                  className="px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center space-x-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
                >
                  <span className="hidden sm:inline">Next 7 Days</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* MOBILE DAY SELECTOR CHIPS (PHONES - GALAXY S26+ / IPHONE 17 MAX) */}
            <div className="flex md:hidden space-x-1.5 overflow-x-auto no-scrollbar py-1">
              {calendarDays.map((colDay, cIdx) => {
                const isSelected = selectedMobileDayIndex === cIdx;
                const isDayToday = colDay.date.getTime() === today.getTime();

                return (
                  <button
                    key={cIdx}
                    type="button"
                    onClick={() => setSelectedMobileDayIndex(cIdx)}
                    className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 min-w-[72px] cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-md scale-105'
                        : isDayToday
                        ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-400'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold">{colDay.shortDay.split(' ')[0]}</span>
                    <span className="text-sm font-black">{colDay.shortDay.split(' ')[1]}</span>
                    <span className={`text-[9px] px-1 rounded-full mt-0.5 ${isSelected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                      {colDay.jobs.length} jobs
                    </span>
                  </button>
                );
              })}
            </div>

            {/* MOBILE SELECTED DAY JOBS DISPLAY */}
            <div className="block md:hidden space-y-3">
              <div className="font-bold text-xs text-slate-500 px-1 flex items-center justify-between">
                <span>{calendarDays[selectedMobileDayIndex].label}</span>
                <span className="font-mono">{calendarDays[selectedMobileDayIndex].jobs.length} job(s) scheduled</span>
              </div>

              {calendarDays[selectedMobileDayIndex].jobs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed rounded-2xl dark:border-slate-800 text-xs">
                  No jobs scheduled for {calendarDays[selectedMobileDayIndex].label}.
                </div>
              ) : (
                calendarDays[selectedMobileDayIndex].jobs.map(renderJobCard)
              )}
            </div>

            {/* DESKTOP 7-DAY COLUMNS GRID (MD AND UP) */}
            <div className="hidden md:grid md:grid-cols-7 gap-3">
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
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setFieldCalHoverInfo({
                                job,
                                top: rect.bottom + 6,
                                left: Math.max(16, Math.min(rect.left, window.innerWidth - 370))
                              });
                            }}
                            onMouseLeave={() => setFieldCalHoverInfo(null)}
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

            {/* Desktop Calendar Hover Tooltip (100% Solid Opaque Background) */}
            {fieldCalHoverInfo && (
              <div
                className={`fixed z-50 pointer-events-none w-84 p-4 rounded-2xl border-2 shadow-2xl space-y-2 transition-all animate-in fade-in zoom-in-95 duration-150 ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-400 text-slate-950 shadow-2xl'
                }`}
                style={{
                  top: Math.max(16, Math.min(fieldCalHoverInfo.top, window.innerHeight - 260)),
                  left: Math.max(16, Math.min(fieldCalHoverInfo.left, window.innerWidth - 360))
                }}
              >
                <div className="flex items-center justify-between border-b pb-1.5 border-slate-200 dark:border-slate-800">
                  <span className="font-black text-xs text-blue-600 dark:text-blue-400">
                    Lot {fieldCalHoverInfo.job.lotNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                    {fieldCalHoverInfo.job.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-sm text-slate-950 dark:text-white leading-tight">
                    {fieldCalHoverInfo.job.jobName}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                    {fieldCalHoverInfo.job.accountName} • {fieldCalHoverInfo.job.communityName}
                  </p>
                </div>

                <div className="space-y-1 pt-1 text-[11px] border-t border-slate-200 dark:border-slate-800">
                  <div className="text-slate-600 dark:text-slate-300">
                    {fieldCalHoverInfo.job.streetAddress}, {fieldCalHoverInfo.job.cityStateZip}
                  </div>
                  <div className="flex items-center justify-between text-slate-500 pt-0.5">
                    <span>Crew: <strong className="text-slate-800 dark:text-slate-200">{fieldCalHoverInfo.job.assignedCrew || 'Install Truck 1'}</strong></span>
                    <span>Sales: <strong className="text-slate-800 dark:text-slate-200">{fieldCalHoverInfo.job.salesperson}</strong></span>
                  </div>
                </div>

                {fieldCalHoverInfo.job.installerNotesText && (
                  <div className="p-2 bg-slate-100 dark:bg-slate-950 rounded-lg text-[10px] text-slate-600 dark:text-slate-400 italic">
                    "{fieldCalHoverInfo.job.installerNotesText}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};