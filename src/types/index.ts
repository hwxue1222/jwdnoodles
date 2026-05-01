export interface InventoryItem {
  id: string;
  name: string;
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
