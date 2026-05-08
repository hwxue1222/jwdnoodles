export interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  cost: number;
  features: string;
  supplier: string;
  quantity: number;
  lastUpdated: number;
}

export const STOCK_LOCATIONS = ['Puteri harbour', 'Mutiara Rini'] as const;
export type StockLocation = (typeof STOCK_LOCATIONS)[number];

export interface Transaction {
  id: string;
  itemId?: string;
  itemName: string;
  quantity: number;
  timestamp: number;
  type: 'IN' | 'OUT';
  location?: StockLocation;
}
