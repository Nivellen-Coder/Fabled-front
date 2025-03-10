export interface offerListByUserIdModel {
  message: string;
  offers: Offers[];
}

export interface Offers {
  id: number;
  cardName: string;
  cardId: string;
  quantity: number;
  price: number;
  description: string|null;
  language: string;
  cardCondition: string;
  foil: boolean;
  created_at: string;
  dateEnd: string|null;
  isActive: boolean;
}
