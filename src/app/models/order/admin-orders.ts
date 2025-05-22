export interface Order {
  id: number;
  user: string;
  total: number;
  status: string;
  createdAt: Date;
  items: Items[];
}

export interface Items {
  productName: string;
  quantity: number;
  price: number;
}
