import { describe, it, expect } from 'vitest';

export interface SlabRecord {
  id: string;
  serialNumber: string;
  lotBlock: string;
  bundleNumber: string;
  materialName: string;
  color: string;
  thickness: '2CM' | '3CM';
  finish: string;
  lengthInches: number;
  widthInches: number;
  sqft: number;
  status: 'Available' | 'Allocated' | 'Consigned' | 'Consumed';
  rackLocation: string;
  regionCode: string;
  isRemnant?: boolean;
  parentSlabSerial?: string;
  allocatedJobId?: string;
}

export function calculateSlabSqft(lengthInches: number, widthInches: number): number {
  if (lengthInches <= 0 || widthInches <= 0) return 0;
  return Math.round(((lengthInches * widthInches) / 144) * 100) / 100;
}

export function createRemnant(
  parentSlab: SlabRecord,
  remnantLength: number,
  remnantWidth: number,
  newRack: string
): SlabRecord {
  const remnantSqft = calculateSlabSqft(remnantLength, remnantWidth);
  return {
    id: 'rem_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    serialNumber: parentSlab.serialNumber + '-R1',
    lotBlock: parentSlab.lotBlock,
    bundleNumber: parentSlab.bundleNumber,
    materialName: parentSlab.materialName,
    color: parentSlab.color,
    thickness: parentSlab.thickness,
    finish: parentSlab.finish,
    lengthInches: remnantLength,
    widthInches: remnantWidth,
    sqft: remnantSqft,
    status: 'Available',
    rackLocation: newRack,
    regionCode: parentSlab.regionCode,
    isRemnant: true,
    parentSlabSerial: parentSlab.serialNumber
  };
}

export function filterSlabs(
  slabs: SlabRecord[],
  regionCode: string,
  statusFilter: string,
  searchQuery: string
): SlabRecord[] {
  return slabs.filter(slab => {
    const matchRegion = regionCode === 'ALL' || regionCode === 'All' || slab.regionCode === regionCode;
    const matchStatus = statusFilter === 'ALL' || slab.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      !query ||
      slab.serialNumber.toLowerCase().includes(query) ||
      slab.materialName.toLowerCase().includes(query) ||
      slab.color.toLowerCase().includes(query) ||
      slab.rackLocation.toLowerCase().includes(query) ||
      slab.bundleNumber.toLowerCase().includes(query);
    return matchRegion && matchStatus && matchSearch;
  });
}

export function generateBarcodeString(slab: SlabRecord): string {
  return `SLAB:${slab.serialNumber}|MAT:${slab.materialName}|DIM:${slab.lengthInches}x${slab.widthInches}|SQFT:${slab.sqft}|RACK:${slab.rackLocation}`;
}

describe('Slab Inventory & Remnants Subsystem', () => {
  const sampleSlab: SlabRecord = {
    id: 'slb_001',
    serialNumber: 'CG-88201',
    lotBlock: 'LOT-9021',
    bundleNumber: 'BNDL-441',
    materialName: 'Calacatta Gold',
    color: 'White/Gold',
    thickness: '3CM',
    finish: 'Polished',
    lengthInches: 126,
    widthInches: 63,
    sqft: 55.13,
    status: 'Available',
    rackLocation: 'A-Frame 04',
    regionCode: 'ATL'
  };

  it('correctly calculates dimensional SQFT from length and width in inches', () => {
    expect(calculateSlabSqft(126, 63)).toBe(55.13);
    expect(calculateSlabSqft(130, 65)).toBe(58.68);
    expect(calculateSlabSqft(0, 50)).toBe(0);
    expect(calculateSlabSqft(-10, 50)).toBe(0);
  });

  it('creates remnant offcut and links back to parent slab serial number', () => {
    const remnant = createRemnant(sampleSlab, 48, 30, 'Remnant Rack R-02');
    expect(remnant.isRemnant).toBe(true);
    expect(remnant.parentSlabSerial).toBe('CG-88201');
    expect(remnant.serialNumber).toBe('CG-88201-R1');
    expect(remnant.materialName).toBe('Calacatta Gold');
    expect(remnant.thickness).toBe('3CM');
    expect(remnant.rackLocation).toBe('Remnant Rack R-02');
    expect(remnant.sqft).toBe(10);
    expect(remnant.status).toBe('Available');
  });

  it('filters slabs by regional facility code', () => {
    const multiPlantSlabs: SlabRecord[] = [
      sampleSlab,
      { ...sampleSlab, id: 'slb_002', serialNumber: 'NQ-100', regionCode: 'PHX' },
      { ...sampleSlab, id: 'slb_003', serialNumber: 'NQ-101', regionCode: 'TUC' }
    ];

    const atlSlabs = filterSlabs(multiPlantSlabs, 'ATL', 'ALL', '');
    expect(atlSlabs.length).toBe(1);
    expect(atlSlabs[0].serialNumber).toBe('CG-88201');

    const phxSlabs = filterSlabs(multiPlantSlabs, 'PHX', 'ALL', '');
    expect(phxSlabs.length).toBe(1);
    expect(phxSlabs[0].regionCode).toBe('PHX');

    const allSlabs = filterSlabs(multiPlantSlabs, 'ALL', 'ALL', '');
    expect(allSlabs.length).toBe(3);
  });

  it('filters slabs by lifecycle status and text search query', () => {
    const dataset: SlabRecord[] = [
      { ...sampleSlab, id: 's1', serialNumber: 'SL-001', status: 'Available', materialName: 'Cambria Brittanicca' },
      { ...sampleSlab, id: 's2', serialNumber: 'SL-002', status: 'Allocated', materialName: 'Silestone Blanco Zeus' },
      { ...sampleSlab, id: 's3', serialNumber: 'SL-003', status: 'Consumed', materialName: 'Cambria Portrush' }
    ];

    const availableOnly = filterSlabs(dataset, 'ALL', 'Available', '');
    expect(availableOnly.length).toBe(1);
    expect(availableOnly[0].serialNumber).toBe('SL-001');

    const cambriaSearch = filterSlabs(dataset, 'ALL', 'ALL', 'Cambria');
    expect(cambriaSearch.length).toBe(2);

    const rackSearch = filterSlabs(dataset, 'ALL', 'ALL', 'A-Frame');
    expect(rackSearch.length).toBe(3);
  });

  it('generates thermal barcode string encoding serial, material, dimensions, and rack', () => {
    const barcode = generateBarcodeString(sampleSlab);
    expect(barcode).toContain('SLAB:CG-88201');
    expect(barcode).toContain('MAT:Calacatta Gold');
    expect(barcode).toContain('DIM:126x63');
    expect(barcode).toContain('SQFT:55.13');
    expect(barcode).toContain('RACK:A-Frame 04');
  });
});
