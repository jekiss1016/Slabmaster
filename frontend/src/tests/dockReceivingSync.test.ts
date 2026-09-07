import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateSlabsFromPo,
  inferMaterialType,
  loadSlabs,
  saveSlabs,
  loadPos,
  savePos
} from '../utils/inventoryStorage';
import { PurchaseOrderItem } from '../components/PurchasingView';

describe('Dock Receiving & Slab Barcode Serialization Workflow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const samplePo: PurchaseOrderItem = {
    id: 'po_test_01',
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
  };

  it('generates exact number of serialized slabs with formatted barcodes and rack location', () => {
    const targetRack = 'Rack A-04 (Quartz Bundle Bay)';
    const { updatedPo, newSlabs } = generateSlabsFromPo(samplePo, targetRack);

    expect(updatedPo.status).toBe('RECEIVED');
    expect(newSlabs).toHaveLength(3);

    expect(newSlabs[0].serialNumber).toBe('SLB-ATL-0419-01');
    expect(newSlabs[1].serialNumber).toBe('SLB-ATL-0419-02');
    expect(newSlabs[2].serialNumber).toBe('SLB-ATL-0419-03');

    newSlabs.forEach((slab) => {
      expect(slab.rackLocation).toBe(targetRack);
      expect(slab.plantCode).toBe('ATL');
      expect(slab.status).toBe('ALLOCATED');
      expect(slab.allocatedJobName).toBe('LNXAUS_000036_000_01');
      expect(slab.sqft).toBe(55.0);
      expect(slab.thickness).toBe('3cm');
    });
  });

  it('marks unallocated PO slabs as AVAILABLE status', () => {
    const unallocatedPo: PurchaseOrderItem = {
      ...samplePo,
      id: 'po_test_stock',
      associatedJobId: undefined,
      associatedJobName: undefined,
      quantitySlabs: 2,
      totalSqft: 110.0
    };

    const { newSlabs } = generateSlabsFromPo(unallocatedPo, 'Dock Receiving Bay');
    expect(newSlabs).toHaveLength(2);
    expect(newSlabs[0].status).toBe('AVAILABLE');
    expect(newSlabs[1].status).toBe('AVAILABLE');
  });

  it('correctly classifies stone material types from descriptions', () => {
    expect(inferMaterialType('Super White Granite 3cm')).toBe('Granite');
    expect(inferMaterialType('Calacatta Gold Quartz Jumbo')).toBe('Quartz');
    expect(inferMaterialType('Carrara Venatino Marble 2cm')).toBe('Marble');
    expect(inferMaterialType('Dekton Laurent Porcelain UltraCompact')).toBe('Porcelain');
    expect(inferMaterialType('Silestone Desert Silver')).toBe('Quartz');
  });

  it('persists newly received slabs into localStorage and retrieves them via loadSlabs', () => {
    const initial = loadSlabs();
    expect(initial.length).toBeGreaterThan(0);

    const { newSlabs } = generateSlabsFromPo(samplePo, 'Rack B-01');
    const combined = [...newSlabs, ...initial];
    saveSlabs(combined);

    const reloaded = loadSlabs();
    expect(reloaded).toHaveLength(initial.length + 3);
    expect(reloaded.find((s) => s.serialNumber === 'SLB-ATL-0419-01')).toBeDefined();
  });

  it('persists updated PO statuses into localStorage via savePos and loadPos', () => {
    const pos = loadPos();
    const target = pos[0];
    const { updatedPo } = generateSlabsFromPo(target);

    const updatedPos = pos.map((p) => (p.id === target.id ? updatedPo : p));
    savePos(updatedPos);

    const reloadedPos = loadPos();
    const found = reloadedPos.find((p) => p.id === target.id);
    expect(found?.status).toBe('RECEIVED');
  });
});
