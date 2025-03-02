export interface Order {
  id: string;
  createdAt: Date;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  reservations: Reservation[];
}

export interface Reservation {
  id: string;
  reservedModelId: string;
  quantity: number;
}
