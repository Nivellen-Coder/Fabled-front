export interface Order {
  id: number;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  cardName: string;
  quantity: number;
  price: number;
}
