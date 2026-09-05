import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Plus,
  Filter,
  Printer,
  QrCode,
  Tag,
  Layers,
  MapPin,
  CheckCircle2,
  Trash2,
  ArrowRight,
  ExternalLink,
  Package,
  Barcode
} from 'lucide-react';

export interface SlabItem {
  id: string;
  serialNumber: string;
  bundleId: string;
  materialName: string;
  materialType: 'Quartz' | 'Granite' | 'Marble' | 'Porcelain';
  thickness: '2cm' | '3cm';
  lengthInches: number;
  widthInches: number;
  sqft: number;
  rackLocation: string;
  plantCode: string; // 'ATL', 'PHX', etc.
  status: 'AVAILABLE' | 'ALLOCATED' | 'IN_CUT' | 'REMNANT' | 'CONSUMED';
  allocatedJobId?: string;
  allocatedJobName?: string;
  receivedDate: string;
}

const DEFAULT_SLABS: SlabItem[] = [
  {
    id: 'slb_1',
    serialNumber: 'SLB-ATL-2026-0041',
    bundleId: 'BND-8802-CG',
    materialName: 'Calacatta Gold',
    materialType: 'Quartz',
    thickness: '3cm',
    lengthInches: 130,
    widthInches: 65,
    sqft: 58.7,
    rackLocation: 'Rack A-04',
    plantCode: 'ATL',
    status: 'ALLOCATED',
    allocatedJobId: '10485',
    allocatedJobName: 'CNAALN_000033_000_01',
    receivedDate: '2026-08-10'
  },
  {
    id: 'slb_2',
    serialNumber: 'SLB-ATL-2026-0042',
    bundleId: 'BND-8802-CG',
    materialName: 'Calacatta Gold',
    materialType: 'Quartz',
    thickness: '3cm',
    lengthInches: 130,
    widthInches: 65,
    sqft: 58.7,
    rackLocation: 'Rack A-04',
    plantCode: 'ATL',
    status: 'AVAILABLE',
    receivedDate: '2026-08-10'
  },
  {
    id: 'slb_3',
    serialNumber: 'SLB-ATL-2026-0099',
    bundleId: 'BND-9104-WD',
    materialName: 'White Dallas',
    materialType: 'Granite',
    thickness: '3cm',
    lengthInches: 124,
    widthInches: 72,
    sqft: 62.0,
    rackLocation: 'Rack B-12',
    plantCode: 'ATL',
    status: 'ALLOCATED',
    allocatedJobId: '10170',
    allocatedJobName: 'LNXAUS_000036_000_01',
    receivedDate: '2026-08-15'
  },
  {
    id: 'slb_4',
    serialNumber: 'REM-ATL-2026-0112',
    bundleId: 'BND-8411-CM',
    materialName: 'Carrara Mist',
    materialType: 'Quartz',
    thickness: '3cm',
    lengthInches: 54,
    widthInches: 36,
    sqft: 13.5,
    rackLocation: 'Remnant Bin R-03',
    plantCode: 'ATL',
    status: 'REMNANT',
    receivedDate: '2026-08-20'
  },
  {
    id: 'slb_5',
    serialNumber: 'SLB-ATL-2026-0145',
    bundleId: 'BND-7719-MS',
    materialName: 'Midnight Sparkle',
    materialType: 'Quartz',
    thickness: '2cm',
    lengthInches: 126,
    widthInches: 63,
    sqft: 55.1,
    rackLocation: 'Rack C-02',
    plantCode: 'ATL',
    status: 'AVAILABLE',
    receivedDate: '2026-08-28'
  }
];

interface SlabInventoryViewProps {
  isDark: boolean;
  activeRegionCode?: string;
}

export const SlabInventoryView: React.FC<SlabInventoryViewProps> = ({
  isDark,
  activeRegionCode = 'ATL'
}) => {
  const [slabs, setSlabs] = useState<SlabItem[]>(DEFAULT_SLABS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [activeLabelPrint, setActiveLabelPrint] = useState<SlabItem | null>(null);
  const [isAddingSlab, setIsAddingSlab] = useState(false);

  // New Slab Form State
  const [serialNumber, setSerialNumber] = useState(`SLB-${activeRegionCode}-${Date.now().toString().slice(-4)}`);
  const [bundleId, setBundleId] = useState('');
  const [materialName, setMaterialName] = useState('Calacatta Gold');
  const [materialType, setMaterialType] = useState<'Quartz' | 'Granite' | 'Marble' | 'Porcelain'>('Quartz');
  const [thickness, setThickness] = useState<'2cm' | '3cm'>('3cm');
  const [lengthInches, setLengthInches] = useState(128);
  const [widthInches, setWidthInches] = useState(64);
  const [rackLocation, setRackLocation] = useState('Rack A-01');

  // Stats calculation
  const totalSlabs = slabs.length;
  const availableSlabs = slabs.filter((s) => s.status === 'AVAILABLE');
  const allocatedSlabs = slabs.filter((s) => s.status === 'ALLOCATED');
  const remnantSlabs = slabs.filter((s) => s.status === 'REMNANT');

  const totalAvailableSqft = availableSlabs.reduce((acc, s) => acc + s.sqft, 0);
  const totalAllocatedSqft = allocatedSlabs.reduce((acc, s) => acc + s.sqft, 0);

  const filteredSlabs = slabs.filter((s) => {
    const matchesSearch =
      s.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.bundleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.allocatedJobName && s.allocatedJobName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
    const matchesType = selectedType === 'ALL' || s.materialType === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleRegisterSlab = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedSqft = parseFloat(((lengthInches * widthInches) / 144).toFixed(1));
    const newSlab: SlabItem = {
      id: `slb_${Date.now()}`,
      serialNumber,
      bundleId: bundleId.trim() || `BND-${Math.floor(Math.random() * 9000 + 1000)}`,
      materialName,
      materialType,
      thickness,
      lengthInches: Number(lengthInches),
      widthInches: Number(widthInches),
      sqft: calculatedSqft,
      rackLocation,
      plantCode: activeRegionCode,
      status: 'AVAILABLE',
      receivedDate: new Date().toISOString().split('T')[0]
    };

    setSlabs([newSlab, ...slabs]);
    setIsAddingSlab(false);
    setSerialNumber(`SLB-${activeRegionCode}-${Date.now().toString().slice(-4)}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Slab Inventory & Warehouse Control
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Plant: {activeRegionCode}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Serialized slab tracking, barcode label printing, remnant management, and job allocations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingSlab(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-sm cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Register Slabs / Bundle</span>
        </button>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Slabs On Hand
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 block">
            {totalSlabs}
          </span>
          <span className="text-[11px] text-slate-500">Across all warehouse racks</span>
        </div>

        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Available Material
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {totalAvailableSqft.toFixed(1)} <span className="text-sm font-bold">SQFT</span>
          </span>
          <span className="text-[11px] text-slate-500">{availableSlabs.length} slabs unallocated</span>
        </div>

        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
            Allocated to Jobs
          </span>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">
            {totalAllocatedSqft.toFixed(1)} <span className="text-sm font-bold">SQFT</span>
          </span>
          <span className="text-[11px] text-slate-500">{allocatedSlabs.length} slabs staged for cutting</span>
        </div>

        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            Remnants in Stock
          </span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
            {remnantSlabs.length}
          </span>
          <span className="text-[11px] text-slate-500">Reusable offcuts in bins</span>
        </div>
      </div>

      {/* Add Slab Modal */}
      {isAddingSlab && (
        <div className="p-5 rounded-2xl border border-blue-300 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 space-y-4 animate-fade-in shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Register New Slab / Delivery Receipt
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingSlab(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleRegisterSlab} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Serial / Barcode Number *
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs font-mono font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Bundle / Block ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. BND-9901-CG"
                  value={bundleId}
                  onChange={(e) => setBundleId(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Material Name / Color *
                </label>
                <input
                  type="text"
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Material Species
                </label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value as any)}
                  className="w-full p-2 border rounded-lg text-xs font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                >
                  <option value="Quartz">Quartz</option>
                  <option value="Granite">Granite</option>
                  <option value="Marble">Marble</option>
                  <option value="Porcelain">Porcelain</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Thickness
                </label>
                <select
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value as any)}
                  className="w-full p-2 border rounded-lg text-xs font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                >
                  <option value="3cm">3cm (1 1/4")</option>
                  <option value="2cm">2cm (3/4")</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Length (Inches)
                </label>
                <input
                  type="number"
                  value={lengthInches}
                  onChange={(e) => setLengthInches(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg text-xs font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Width (Inches)
                </label>
                <input
                  type="number"
                  value={widthInches}
                  onChange={(e) => setWidthInches(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg text-xs font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Warehouse Location / Rack
                </label>
                <input
                  type="text"
                  value={rackLocation}
                  onChange={(e) => setRackLocation(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingSlab(false)}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer shadow-xs"
              >
                Save & Register Slab
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by serial #, material, bundle ID, or job..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium bg-transparent border-none focus:outline-hidden text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Materials</option>
            <option value="Quartz">Quartz</option>
            <option value="Granite">Granite</option>
            <option value="Marble">Marble</option>
            <option value="Porcelain">Porcelain</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ALLOCATED">Allocated to Job</option>
            <option value="REMNANT">Remnant Offcuts</option>
            <option value="CONSUMED">Consumed</option>
          </select>
        </div>
      </div>

      {/* Slabs Grid Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-950/70 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <th className="p-3">Serial / Barcode</th>
              <th className="p-3">Material & Species</th>
              <th className="p-3">Dimensions</th>
              <th className="p-3">Area</th>
              <th className="p-3">Bundle ID</th>
              <th className="p-3">Warehouse Location</th>
              <th className="p-3">Status</th>
              <th className="p-3">Allocated Job</th>
              <th className="p-3 text-center">Label</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredSlabs.map((slab) => {
              const isRemnant = slab.status === 'REMNANT';
              const isAllocated = slab.status === 'ALLOCATED';
              const isAvailable = slab.status === 'AVAILABLE';

              return (
                <tr key={slab.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {slab.serialNumber}
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      {slab.materialName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {slab.materialType} • {slab.thickness}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-300">
                    {slab.lengthInches}" × {slab.widthInches}"
                  </td>
                  <td className="p-3 font-mono font-black text-emerald-600 dark:text-emerald-400">
                    {slab.sqft} SF
                  </td>
                  <td className="p-3 font-mono text-slate-500">{slab.bundleId}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{slab.rackLocation}</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                          : isAllocated
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300'
                          : isRemnant
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {slab.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {slab.allocatedJobName ? (
                      <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1">
                        <span>{slab.allocatedJobName}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => setActiveLabelPrint(slab)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Preview Barcode Label"
                    >
                      <Barcode className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Barcode Label Print Modal Dialog */}
      {activeLabelPrint && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-300 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Thermal Slab Barcode Label
              </span>
              <button
                type="button"
                onClick={() => setActiveLabelPrint(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Label Card */}
            <div className="border-2 border-slate-900 p-4 rounded-xl space-y-2 text-center bg-white font-mono">
              <span className="text-[10px] font-black tracking-widest block text-slate-400">
                SLABMASTER™ WAREHOUSE
              </span>
              <div className="text-sm font-black tracking-tight">{activeLabelPrint.materialName}</div>
              <div className="text-xs text-slate-600">
                {activeLabelPrint.materialType} • {activeLabelPrint.thickness}
              </div>
              <div className="py-2 flex justify-center">
                {/* Barcode Mock Visual */}
                <div className="h-12 w-48 bg-slate-900 flex items-center justify-around px-2">
                  <div className="h-full w-1 bg-white"></div>
                  <div className="h-full w-2 bg-white"></div>
                  <div className="h-full w-0.5 bg-white"></div>
                  <div className="h-full w-1.5 bg-white"></div>
                  <div className="h-full w-0.5 bg-white"></div>
                  <div className="h-full w-2 bg-white"></div>
                  <div className="h-full w-1 bg-white"></div>
                </div>
              </div>
              <div className="text-xs font-black">{activeLabelPrint.serialNumber}</div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 flex justify-between">
                <span>{activeLabelPrint.lengthInches}" × {activeLabelPrint.widthInches}"</span>
                <span className="font-bold">{activeLabelPrint.sqft} SF</span>
                <span>{activeLabelPrint.rackLocation}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveLabelPrint(null)}
                className="px-3 py-1.5 border border-slate-300 text-xs font-bold rounded-lg cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setActiveLabelPrint(null);
                }}
                className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Barcode Label</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
