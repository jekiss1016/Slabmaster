import { SlabItem } from '../components/SlabInventoryView';
import { PurchaseOrderItem } from '../components/PurchasingView';

export const SLABS_STORAGE_KEY = 'slabmaster_inventory_slabs';
export const POS_STORAGE_KEY = 'slabmaster_purchasing_pos';

export const INITIAL_SLABS: SlabItem[] = [
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
    status: 'ALLOCATED',
    allocatedJobId: '10485',
    allocatedJobName: 'CNAALN_000033_000_01',
    receivedDate: '2026-08-10'
  },
  {
    id: 'slb_3',
    serialNumber: 'SLB-ATL-2026-0099',
    bundleId: 'BND-7714-WD',
    materialName: 'White Dallas',
    materialType: 'Granite',
    thickness: '3cm',
    lengthInches: 126,
    widthInches: 63,
    sqft: 55.1,
    rackLocation: 'Rack B-02',
    plantCode: 'ATL',
    status: 'AVAILABLE',
    receivedDate: '2026-08-12'
  },
  {
    id: 'slb_4',
    serialNumber: 'SLB-ATL-2026-0100',
    bundleId: 'BND-7714-WD',
    materialName: 'White Dallas',
    materialType: 'Granite',
    thickness: '3cm',
    lengthInches: 126,
    widthInches: 63,
    sqft: 55.1,
    rackLocation: 'Rack B-02',
    plantCode: 'ATL',
    status: 'AVAILABLE',
    receivedDate: '2026-08-12'
  },
  {
    id: 'slb_5',
    serialNumber: 'REM-ATL-2026-0012',
    bundleId: 'BND-8802-CG',
    materialName: 'Calacatta Gold (Remnant)',
    materialType: 'Quartz',
    thickness: '3cm',
    lengthInches: 65,
    widthInches: 38,
    sqft: 17.1,
    rackLocation: 'Remnant Bin R-1',
    plantCode: 'ATL',
    status: 'REMNANT',
    receivedDate: '2026-08-15'
  }
];

export const INITIAL_POS: PurchaseOrderItem[] = [
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
    materialDescription: 'Carrara Mist Quartz 3cm',
    quantitySlabs: 2,
    totalSqft: 110.0,
    totalCost: 2420.0,
    orderDate: '2026-08-12',
    expectedDeliveryDate: '2026-08-24',
    status: 'ISSUED',
    plantCode: 'ATL'
  }
];

export function loadSlabs(): SlabItem[] {
  try {
    const raw = localStorage.getItem(SLABS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to load slabs from localStorage', err);
  }
  return INITIAL_SLABS;
}

export function saveSlabs(slabs: SlabItem[]): void {
  try {
    localStorage.setItem(SLABS_STORAGE_KEY, JSON.stringify(slabs));
  } catch (err) {
    console.error('Failed to save slabs to localStorage', err);
  }
}

export function loadPos(): PurchaseOrderItem[] {
  try {
    const raw = localStorage.getItem(POS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to load POs from localStorage', err);
  }
  return INITIAL_POS;
}

export function savePos(pos: PurchaseOrderItem[]): void {
  try {
    localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(pos));
  } catch (err) {
    console.error('Failed to save POs to localStorage', err);
  }
}

/**
 * Derives material type from material description.
 */
export function inferMaterialType(desc: string): 'Quartz' | 'Granite' | 'Marble' | 'Porcelain' {
  const lower = desc.toLowerCase();
  if (lower.includes('granite')) return 'Granite';
  if (lower.includes('marble')) return 'Marble';
  if (lower.includes('porcelain')) return 'Porcelain';
  return 'Quartz'; // Default stone category
}

/**
 * Transforms a received PO line into serialized SlabItems ready for warehouse allocation.
 */
export function generateSlabsFromPo(
  po: PurchaseOrderItem,
  rackLocation: string = 'Dock Receiving Bay'
): { updatedPo: PurchaseOrderItem; newSlabs: SlabItem[] } {
  const count = po.quantitySlabs || 1;
  const sqftPerSlab = Math.round((po.totalSqft / count) * 10) / 10;
  const materialType = inferMaterialType(po.materialDescription);
  const thickness = po.materialDescription.includes('2cm') ? '2cm' : '3cm';
  const cleanMaterial = po.materialDescription.replace(/\s*\d+cm.*$/i, '').trim();

  // Extract short suffix from PO (e.g. "PO-ATL-2026-0419" -> "0419")
  const poSuffix = po.poNumber.split('-').pop() || Date.now().toString().slice(-4);
  const dateStr = new Date().toISOString().split('T')[0];

  const newSlabs: SlabItem[] = [];
  for (let i = 1; i <= count; i++) {
    const seqStr = i.toString().padStart(2, '0');
    const serialNumber = `SLB-${po.plantCode}-${poSuffix}-${seqStr}`;

    newSlabs.push({
      id: `slb_po_${Date.now()}_${i}`,
      serialNumber,
      bundleId: `BND-${poSuffix}`,
      materialName: cleanMaterial,
      materialType,
      thickness,
      lengthInches: 128,
      widthInches: 64,
      sqft: sqftPerSlab,
      rackLocation,
      plantCode: po.plantCode,
      status: po.associatedJobName ? 'ALLOCATED' : 'AVAILABLE',
      allocatedJobId: po.associatedJobId,
      allocatedJobName: po.associatedJobName,
      receivedDate: dateStr
    });
  }

  const updatedPo: PurchaseOrderItem = {
    ...po,
    status: 'RECEIVED'
  };

  return { updatedPo, newSlabs };
}
