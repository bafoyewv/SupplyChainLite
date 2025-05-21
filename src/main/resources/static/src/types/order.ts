
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PROCESSING' | 'PAID' | 'FAILED';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface OrderResponse {
  orders: Order[];
  total: number;
  page: number;
  size: number;
}

export interface OrderCreateRequest {
  customerName: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}
