export class Country {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}


export class UserCreateModel {
  username: string;
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  hasAddress: boolean;
  street?: string;
  streetSecond?: string;
  houseNumber?: string;
  city?: string;
  postalCode?: string;
  region?: string;
  country?: Country;

  constructor(username: string, email: string, password: string, lastName: string, firstName: string, hasAddress: boolean);
  constructor(username: string, email: string, password: string, lastName: string, firstName: string, hasAddress: boolean,
              street: string, streetSecond: string, houseNumber: string, city: string, postalCode: string, region: string, country: Country);

  constructor(
    username: string,
    email: string,
    password: string,
    lastName: string,
    firstName: string,
    hasAddress: boolean,
    street?: string,
    streetSecond?: string,
    houseNumber?: string,
    city?: string,
    postalCode?: string,
    region?: string,
    country?: Country
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.lastName = lastName;
    this.firstName = firstName;
    this.hasAddress = hasAddress;

    if (hasAddress) {
      this.street = street;
      this.streetSecond = streetSecond;
      this.houseNumber = houseNumber;
      this.city = city;
      this.postalCode = postalCode;
      this.region = region;
      this.country = country;
    }
  }
}
