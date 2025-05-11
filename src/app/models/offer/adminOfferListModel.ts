export interface User {
  id: number;
  username: string;
}

export interface AdminOfferListModel {
  id: number;
  quantity: number;
  price: number;
  editionLang: string;
  cardCondition: string;
  isFoil: boolean;
  description: string;
  isActive: boolean;
  creation: string;
  dateEnd: string | null;
  userOfferId: User;
  cardIdentifier: string;
  cardName: string;
}
