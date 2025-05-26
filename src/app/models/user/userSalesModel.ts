export interface UserSalesModel {
  "quantity" : number;
  "price" : number;
  "cardIdentifier": string;
  "cardName" : string;
  "buyer": Buyer;
  "order": Order;
}

export interface Buyer {
  id: number;
  email: string;
}

export interface Order {
  id: number;
  status: string;
  createdAt: Date;
  address: AddressBuyer;
}

export interface AddressBuyer {
  "id": number,
  "street": string,
  "houseNumber": string,
  "city": string,
  "region": string,
  "zip": string,
  "country": string
}
