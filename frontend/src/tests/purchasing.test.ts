import { describe, it, expect } from 'vitest';

export interface POLineItem {
  id: string;
  materialName: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitPrice: number;
  thickness: '2CM' | '3CM';
  estimatedSqftPerUnit: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  orderDate: string;
  expectedDate: string;
  status: 'Draft' | 'Issued' | 'Partial' | 'Received' | 'Closed';
  lineItems: POLineItem[];
  regionCode: string;
}

export function calculatePOTotal(items: POLineItem[]): number {
  const sum = items.reduce((acc, item) => acc + item.quantityOrdered * item.unitPrice, 0);
  return Math.round(sum * 100) / 100;
}

export function calculateTotalSqftOrdered(items: POLineItem[]): number {
  return items.reduce((acc, item) => acc + item.quantityOrdered * item.estimatedSqftPerUnit, 0);
}

export function processDockReceiving(
  po: PurchaseOrder,
  lineItemId: string,
  quantityToReceive: number,
  rackLocation: string
): { updatedPO: PurchaseOrder; generatedSlabs: Array<{ serialNumber: string; rackLocation: string; status: string }> } {
  const updatedItems = po.lineItems.map(item => {
    if (item.id === lineItemId) {
      const newReceived = Math.min(item.quantityOrdered, item.quantityReceived + quantityToReceive);
      return { ...item, quantityReceived: newReceived };
    }
    return item;
  });

  const totalOrdered = updatedItems.reduce((acc, i) => acc + i.quantityOrdered, 0);
  const totalReceived = updatedItems.reduce((acc, i) => acc + i.quantityReceived, 0);

  let newStatus = po.status;
  if (totalReceived >= totalOrdered) {
    newStatus = 'Received';
  } else if (totalReceived > 0) {
    newStatus = 'Partial';
  }

  const targetedItem = po.lineItems.find(i => i.id === lineItemId);
  const generatedSlabs: Array<{ serialNumber: string; rackLocation: string; status: string }> = [];

  for (let i = 0; i < quantityToReceive; i++) {
    generatedSlabs.push({
      serialNumber: `${po.poNumber}-${targetedItem ? targetedItem.materialName.slice(0, 3).toUpperCase() : 'SLB'}-${Date.now().toString().slice(-4)}${i + 1}`,
      rackLocation,
      status: 'Available'
    });
  }

  return {
    updatedPO: {
      ...po,
      lineItems: updatedItems,
      status: newStatus
    },
    generatedSlabs
  };
}

describe('Purchasing & Dock Receiving Subsystem', () => {
  const samplePO: PurchaseOrder = {
    id: 'po_101',
    poNumber: 'PO-2026-0881',
    vendorName: 'Cosentino North America',
    orderDate: '2026-09-01',
    expectedDate: '2026-09-10',
    status: 'Issued',
    regionCode: 'ATL',
    lineItems: [
      {
        id: 'li_1',
        materialName: 'Silestone Calacatta Gold',
        quantityOrdered: 4,
        quantityReceived: 0,
        unitPrice: 1250.00,
        thickness: '3CM',
        estimatedSqftPerUnit: 55.0
      },
      {
        id: 'li_2',
        materialName: 'Dekton Laurent',
        quantityOrdered: 2,
        quantityReceived: 0,
        unitPrice: 1600.00,
        thickness: '2CM',
        estimatedSqftPerUnit: 48.0
      }
    ]
  };

  it('calculates total dollar value of purchase order line items', () => {
    const total = calculatePOTotal(samplePO.lineItems);
    expect(total).toBe(8200.00);
  });

  it('calculates total estimated SQFT across order line items', () => {
    const totalSqft = calculateTotalSqftOrdered(samplePO.lineItems);
    expect(totalSqft).toBe(316);
  });

  it('handles partial dock receiving and updates PO status to Partial', () => {
    const result = processDockReceiving(samplePO, 'li_1', 2, 'Dock Staging A');
    expect(result.updatedPO.status).toBe('Partial');
    expect(result.updatedPO.lineItems[0].quantityReceived).toBe(2);
    expect(result.generatedSlabs.length).toBe(2);
    expect(result.generatedSlabs[0].status).toBe('Available');
    expect(result.generatedSlabs[0].rackLocation).toBe('Dock Staging A');
  });

  it('transitions PO to Received when all line items are fulfilled', () => {
    const partiallyReceivedPO: PurchaseOrder = {
      ...samplePO,
      lineItems: [
        { ...samplePO.lineItems[0], quantityReceived: 4 },
        { ...samplePO.lineItems[1], quantityReceived: 0 }
      ],
      status: 'Partial'
    };

    const finalResult = processDockReceiving(partiallyReceivedPO, 'li_2', 2, 'Rack C-10');
    expect(finalResult.updatedPO.status).toBe('Received');
    expect(finalResult.updatedPO.lineItems[1].quantityReceived).toBe(2);
    expect(finalResult.generatedSlabs.length).toBe(2);
    expect(finalResult.generatedSlabs[0].rackLocation).toBe('Rack C-10');
  });
});
