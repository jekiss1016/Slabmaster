import React, { useState } from 'react';
import {
  Monitor,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  ChevronRight,
  Filter,
  RefreshCw,
  Maximize2,
  Search
} from 'lucide-react';

export interface ShopQueueItem {
  id: string;
  jobId: string;
  jobName: string;
  accountName: string;
  communityName: string;
  lotNumber: string;
  station: string;
  material: string;
  thickness: string;
  edgeProfile: string;
  sqft: number;
  sinkCutouts: string;
  targetCutDate: string;
  priority: 'NORMAL' | 'HOT_RUSH' | 'REMAKE_WARRANTY';
  status: 'QUEUED' | 'IN_CUT' | 'COMPLETED';
}

const DEFAULT_SHOP_QUEUE: ShopQueueItem[] = [
  {
    id: 'sq_1',
    jobId: '10485',
    jobName: 'CNAALN_000033_000_01',
    accountName: 'Century Communities Nashville',
    communityName: 'Averitt Landing',
    lotNumber: '33',
    station: 'Saw 1 - CNC Bridge Saw',
    material: 'Calacatta Gold Quartz',
    thickness: '3cm',
    edgeProfile: 'Eased Standard',
    sqft: 64.5,
    sinkCutouts: '1x 50/50 Undermount, 2x Oval Vanity',
    targetCutDate: 'Today',
    priority: 'HOT_RUSH',
    status: 'IN_CUT'
  },
  {
    id: 'sq_2',
    jobId: '10170',
    jobName: 'LNXAUS_000036_000_01',
    accountName: 'Lennar Homes of Georgia',
    communityName: 'Austin Lakes',
    lotNumber: '36',
    station: 'Saw 1 - CNC Bridge Saw',
    material: 'White Dallas Granite',
    thickness: '3cm',
    edgeProfile: '1/4" Bevel',
    sqft: 78.0,
    sinkCutouts: '1x Farmhouse Apron Sink',
    targetCutDate: 'Today',
    priority: 'NORMAL',
    status: 'QUEUED'
  },
  {
    id: 'sq_3',
    jobId: '10720',
    jobName: 'CS2OGG_000069_000_01',
    accountName: 'Century Communities Southeast',
    communityName: 'Olde Gold Golf Club',
    lotNumber: '69',
    station: 'CNC Router 1',
    material: 'Carrara Mist Quartz',
    thickness: '3cm',
    edgeProfile: 'Mitered 2" Apron',
    sqft: 52.0,
    sinkCutouts: '1x Single Basin Undermount',
    targetCutDate: 'Today',
    priority: 'REMAKE_WARRANTY',
    status: 'QUEUED'
  },
  {
    id: 'sq_4',
    jobId: '10941',
    jobName: 'DF41DC_0000DC_000_01',
    accountName: 'Dream Finders Homes',
    communityName: 'Durham Creek',
    lotNumber: '12',
    station: 'Edge Polisher Line',
    material: 'Midnight Sparkle Quartz',
    thickness: '2cm',
    edgeProfile: 'Full Bullnose',
    sqft: 44.2,
    sinkCutouts: '1x Undermount Bar Sink',
    targetCutDate: 'Tomorrow',
    priority: 'NORMAL',
    status: 'QUEUED'
  }
];

const STATIONS = [
  'All Stations',
  'Saw 1 - CNC Bridge Saw',
  'Saw 2 - Waterjet Combo',
  'CNC Router 1',
  'Edge Polisher Line',
  'Assembly & Sink Glue',
  'Final QA Inspection'
];

interface ShopFloorViewProps {
  isDark: boolean;
  onExitKiosk?: () => void;
}

export const ShopFloorView: React.FC<ShopFloorViewProps> = ({ isDark, onExitKiosk }) => {
  const [queue, setQueue] = useState<ShopQueueItem[]>(DEFAULT_SHOP_QUEUE);
  const [selectedStation, setSelectedStation] = useState('All Stations');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedNotice, setCompletedNotice] = useState<string | null>(null);

  const filteredQueue = queue.filter((item) => {
    const matchesStation = selectedStation === 'All Stations' || item.station === selectedStation;
    const matchesSearch =
      item.jobName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStation && matchesSearch;
  });

  const handleAdvanceStation = (id: string, jobName: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'COMPLETED' } : item))
    );
    setCompletedNotice(`Job ${jobName} marked Complete for this station and dispatched downstream!`);
    setTimeout(() => setCompletedNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Kiosk Header */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black tracking-tight">Shop Floor Touchscreen Kiosk</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                Live Production Feed
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Touch-optimized station queue for bridge saws, waterjets, CNC routers, and polish lines.
            </p>
          </div>
        </div>

        {/* Live Station Filter Pills */}
        <div className="flex items-center gap-2">
          {onExitKiosk && (
            <button
              type="button"
              onClick={onExitKiosk}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer transition-all"
            >
              Exit Kiosk View
            </button>
          )}
        </div>
      </div>

      {/* Completion Toast Alert */}
      {completedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black flex items-center space-x-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{completedNotice}</span>
        </div>
      )}

      {/* Station Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STATIONS.map((station) => (
          <button
            key={station}
            type="button"
            onClick={() => setSelectedStation(station)}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all shadow-xs ${
              selectedStation === station
                ? 'bg-blue-600 text-white scale-102 shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {station}
          </button>
        ))}
      </div>

      {/* Touch Station Queue Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQueue.map((item) => {
          const isRush = item.priority === 'HOT_RUSH';
          const isRemake = item.priority === 'REMAKE_WARRANTY';
          const isDone = item.status === 'COMPLETED';

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isDone
                  ? 'opacity-50 bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
                  : isRush
                  ? 'border-rose-400 dark:border-rose-800 bg-rose-50/20 dark:bg-rose-950/20 shadow-md'
                  : isRemake
                  ? 'border-amber-400 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/20 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                {/* Header Badge Row */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 font-bold">{item.station}</span>
                  <div className="flex items-center space-x-1.5">
                    {isRush && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white">
                        HOT RUSH
                      </span>
                    )}
                    {isRemake && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-slate-950">
                        REMAKE WARRANTY
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        isDone
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Job Title & Hierarchy */}
                <div>
                  <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">
                    {item.jobName}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {item.accountName} • {item.communityName} • Lot {item.lotNumber}
                  </p>
                </div>

                {/* Stone Specifications Box */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Material & Color</span>
                    <span className="font-black text-slate-800 dark:text-slate-200">{item.material}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Thickness & Edge</span>
                    <span className="font-black text-slate-800 dark:text-slate-200">
                      {item.thickness} • {item.edgeProfile}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Area</span>
                    <span className="font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {item.sqft} SQFT
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-3 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Cutouts & Sinks</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{item.sinkCutouts}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Touchscreen */}
              <div className="pt-4 flex items-center gap-2">
                <button
                  type="button"
                  disabled={isDone}
                  onClick={() => handleAdvanceStation(item.id, item.jobName)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md ${
                    isDone
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isDone ? 'Station Completed' : '✓ Complete Station'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
