export interface offerListByCardModel {
  id: number;
  cardId: string;
  userOfferId: string;
  userId: string;
  quantity: number;
  price: number;
  editionLang: string;
  cardCondition: string;
  isFoil: boolean;
  description: string;
  creation: string;
  quantityToAdd: number;
}
