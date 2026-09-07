import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  DollarSign,
  Truck,
  ExternalLink,
  Trash2,
  FileCheck,
  ArrowRight,
  Barcode
} from 'lucide-react';
import { SlabItem } from './SlabInventoryView';
import {
  loadPos,
  savePos,
  loadSlabs,
  saveSlabs,
  generateSlabsFromPo
} from '../utils/inventoryStorage';

export interface PurchaseOrderItem {
  id: string;
  poNumber: string;
  supplierName: string;
  associatedJobId?: string;
  associatedJobName?: string;
  materialDescription: string;
  quantitySlabs: number;
  totalSqft: number;
  totalCost: number;
  orderDate: string;
  expectedDeliveryDate: string;
  status: 'DRAFT' | 'ISSUED' | 'RECEIVED' | 'PARTIAL' | 'CANCELLED';
  plantCode: string;
}

const DEFAULT_POS: PurchaseOrderItem[] = [
  {
    id: 'po_1',
    poNumber: 'PO-ATL-2026-0412',
    supplierName: 'MSI Surfaces - Atlanta',
    associatedJobId: '10485',
    associatedJobName: 'CNAALN_000033_000_01',
    materialDescription: 'Calacatta Gold Quartz 3cm (Jumbo 130"x65")',
    quantitySlabs: 2,
    totalSqft: 117.4,
    totalCost: 2840.0,
    orderDate: '2026-08-01',
    expectedDeliveryDate: '2026-08-10',
    status: 'RECEIVED',
    plantCode: 'ATL'
  },
  {
    id: 'po_2',
    poNumber: 'PO-ATL-2026-0419',
    supplierName: 'Cosentino Center Atlanta',
    associatedJobId: '10170',
    associatedJobName: 'LNXAUS_000036_000_01',
    materialDescription: 'Silestone Desert Silver 3cm',
    quantitySlabs: 3,
    totalSqft: 165.0,
    totalCost: 4125.0,
    orderDate: '2026-08-08',
    expectedDeliveryDate: '2026-08-20',
    status: 'ISSUED',
    plantCode: 'ATL'
  },
  {
    id: 'po_3',
    poNumber: 'PO-ATL-2026-0428',
    supplierName: 'Arizona Tile - Southeast',
    associatedJobId: '10720',
    associatedJobName: 'CS2OGG_000069_000_01',
    materialDescription: 'Della Terra Quartz Carrara 3cm',
    quantitySlabs: 2,
    totalSqft: 110.0,
    totalCost: 2530.0,
    orderDate: '2026-08-18',
    expectedDeliveryDate: 'Today',
    status: 'ISSUED',
    plantCode: 'ATL'
  }
];

interface PurchasingViewProps {
  isDark: boolean;
  activeRegionCode?: string;
  onNavigateToInventory?: () => void;
  onSlabsReceived?: (newSlabs: SlabItem[]) => void;
}

export const PurchasingView: React.FC<PurchasingViewProps> = ({
  isDark,
  activeRegionCode = 'ATL',
  onNavigateToInventory,
  onSlabsReceived
}) => {
  const [pos, setPos] = useState<PurchaseOrderItem[]>(() => loadPos());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreatingPo, setIsCreatingPo] = useState(false);

  // Dock Receiving Modal State
  const [receivingPo, setReceivingPo] = useState<PurchaseOrderItem | null>(null);
  const [targetRack, setTargetRack] = useState('Dock Receiving Bay / A-Frame 01');
  const [dockSuccessNotice, setDockSuccessNotice] = useState<string | null>(null);

  // New PO State
  const [poNumber, setPoNumber] = useState(`PO-${activeRegionCode}-${Date.now().toString().slice(-4)}`);
  const [supplierName, setSupplierName] = useState('MSI Surfaces - Atlanta');
  const [associatedJobName, setAssociatedJobName] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [quantitySlabs, setQuantitySlabs] = useState(2);
  const [totalCost, setTotalCost] = useState(2400);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );

  const filteredPos = pos.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (po.associatedJobName && po.associatedJobName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      po.materialDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    const newPo: PurchaseOrderItem = {
      id: `po_${Date.now()}`,
      poNumber,
      supplierName,
      associatedJobName: associatedJobName.trim() || undefined,
      materialDescription,
      quantitySlabs: Number(quantitySlabs),
      totalSqft: Number(quantitySlabs) * 58.0,
      totalCost: Number(totalCost),
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate,
      status: 'ISSUED',
      plantCode: activeRegionCode
    };

    const updatedPos = [newPo, ...pos];
    setPos(updatedPos);
    savePos(updatedPos);
    setIsCreatingPo(false);
    setPoNumber(`PO-${activeRegionCode}-${Date.now().toString().slice(-4)}`);
  };

  const handleOpenDockReceive = (po: PurchaseOrderItem) => {
    setReceivingPo(po);
    setTargetRack('Dock Receiving Bay / A-Frame 01');
  };

  const handleConfirmDockReceive = () => {
    if (!receivingPo) return;
    const { updatedPo, newSlabs } = generateSlabsFromPo(receivingPo, targetRack);
    const updatedPos = pos.map((item) => (item.id === updatedPo.id ? updatedPo : item));
    setPos(updatedPos);
    savePos(updatedPos);

    // Save to shared slab inventory storage
    const currentSlabs = loadSlabs();
    const mergedSlabs = [...newSlabs, ...currentSlabs];
    saveSlabs(mergedSlabs);

    onSlabsReceived?.(newSlabs);
    setReceivingPo(null);
    setDockSuccessNotice(
      `✓ Successfully docked ${newSlabs.length} slabs for ${updatedPo.poNumber}! Allocated to ${targetRack}.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Purchasing & Supplier PO Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Plant: {activeRegionCode}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track material purchase orders, supplier shipments, receiving dock workflows, and job allocation readiness.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreatingPo(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-sm cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Purchase Order</span>
        </button>
      </div>

      {dockSuccessNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200 animate-fade-in shadow-xs">
          <div className="flex items-center space-x-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{dockSuccessNotice}</span>
          </div>
          {onNavigateToInventory && (
            <button
              type="button"
              onClick={onNavigateToInventory}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold flex items-center space-x-1 cursor-pointer transition-all shadow-xs"
            >
              <span>View in Slab Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by PO #, supplier, job, or material..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium bg-transparent border-none focus:outline-hidden text-slate-900 dark:text-slate-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Statuses</option>
          <option value="ISSUED">Issued / Staged</option>
          <option value="RECEIVED">Received in Shop</option>
          <option value="DRAFT">Draft</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Create PO Inline Form */}
      {isCreatingPo && (
        <div className="p-5 rounded-2xl border border-blue-300 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 space-y-4 animate-fade-in shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Create New Supplier Purchase Order
            </h3>
            <button
              type="button"
              onClick={() => setIsCreatingPo(false)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreatePo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  PO Number *
                </label>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs font-mono font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Supplier / Vendor *
                </label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Associated Job (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CNAALN_000033_000_01"
                  value={associatedJobName}
                  onChange={(e) => setAssociatedJobName(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Material Description & Thickness *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Calacatta Gold Quartz 3cm"
                  value={materialDescription}
                  onChange={(e) => setMaterialDescription(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Quantity Slabs
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantitySlabs}
                  onChange={(e) => setQuantitySlabs(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg text-xs font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingPo(false)}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer shadow-xs"
              >
                Issue Purchase Order
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PO Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-950/70 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <th className="p-3">PO Number</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Material Description</th>
              <th className="p-3">Qty / Area</th>
              <th className="p-3">Delivery Date</th>
              <th className="p-3">Associated Job</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Receive</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredPos.map((po) => {
              const isReceived = po.status === 'RECEIVED';
              const isIssued = po.status === 'ISSUED';

              return (
                <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {po.poNumber}
                  </td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                    {po.supplierName}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">
                    {po.materialDescription}
                  </td>
                  <td className="p-3 font-mono">
                    <span className="font-bold">{po.quantitySlabs} Slabs</span>
                    <span className="text-slate-400 block text-[11px]">~{po.totalSqft} SF</span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {po.expectedDeliveryDate}
                  </td>
                  <td className="p-3">
                    {po.associatedJobName ? (
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {po.associatedJobName}
                      </span>
                    ) : (
                      <span className="text-slate-400">Shop Stock</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        isReceived
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                          : isIssued
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {!isReceived ? (
                      <button
                        type="button"
                        onClick={() => handleOpenDockReceive(po)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-all shadow-xs"
                      >
                        ✓ Receive
                      </button>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center justify-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Docked</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dock Receiving & Slab Barcode Minting Modal */}
      {receivingPo && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-300 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Dock Receive & Slab Barcode Minting
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReceivingPo(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Purchase Order:</span>
                  <span className="font-mono font-black">{receivingPo.poNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Supplier:</span>
                  <span className="font-bold">{receivingPo.supplierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Material:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{receivingPo.materialDescription}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Quantity to Receive:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">
                    {receivingPo.quantitySlabs} Slabs (~{receivingPo.totalSqft} SF)
                  </span>
                </div>
                {receivingPo.associatedJobName && (
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-1.5">
                    <span className="text-slate-500 font-bold">Allocated Job:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{receivingPo.associatedJobName}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Assign Storage Rack / Warehouse Bay *
                </label>
                <select
                  value={targetRack}
                  onChange={(e) => setTargetRack(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-xs font-bold text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
                >
                  <option value="Dock Receiving Bay / A-Frame 01">Dock Receiving Bay / A-Frame 01</option>
                  <option value="Rack A-01 (Primary Staging)">Rack A-01 (Primary Staging)</option>
                  <option value="Rack A-04 (Quartz Bundle Bay)">Rack A-04 (Quartz Bundle Bay)</option>
                  <option value="Rack B-02 (Granite Bundle Bay)">Rack B-02 (Granite Bundle Bay)</option>
                  <option value="Remnant Bin R-1">Remnant Bin R-1</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 text-[11px] text-blue-800 dark:text-blue-300">
                <div className="font-bold flex items-center space-x-1.5 mb-1">
                  <Barcode className="w-3.5 h-3.5" />
                  <span>Auto-Generated Barcode Serials ({receivingPo.quantitySlabs} items)</span>
                </div>
                <div className="font-mono text-[10px] space-y-0.5 text-blue-900 dark:text-blue-200">
                  {Array.from({ length: receivingPo.quantitySlabs }).map((_, idx) => (
                    <div key={idx}>
                      • SLB-{receivingPo.plantCode}-{(receivingPo.poNumber.split('-').pop() || 'PO')}-{(idx + 1).toString().padStart(2, '0')} ➔ {targetRack}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setReceivingPo(null)}
                className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDockReceive}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Dock Receive & Mint Barcodes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
