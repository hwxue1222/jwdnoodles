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

export interface Transaction {
  id: string;
  itemName: string;
  quantity: number;
  timestamp: number;
  type: 'IN' | 'OUT';
}
