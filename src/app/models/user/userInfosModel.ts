export interface UserInfosModel {
  id: number;
  username: string;
  email: string;
  lastName: string;
  firstName: string;
  address: Address;
}

export interface Address {
  street: string,
  streetSecond: string,
  houseNumber: string,
  postalCode: string,
  city: string,
  region: string,
  country: string,
}
