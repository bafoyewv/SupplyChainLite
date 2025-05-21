
export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  price: number;
  status: InventoryStatus;
}

export interface InventoryResponse {
  items: InventoryItem[];
  total: number;
  page: number;
  size: number;
}

export interface InventoryCreateRequest {
  name: string;
  quantity: number;
  category: string;
  price: number;
}
